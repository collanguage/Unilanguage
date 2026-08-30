from __future__ import annotations

import csv
import hashlib
import json
import math
import platform
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "analysis"))
from exact_power import fisher_two_sided_p  # noqa: E402

Z95 = 1.959963984540054


def now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, rows: list[dict[str, object]], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def verify_freezes() -> dict[str, object]:
    checks: dict[str, object] = {}
    implementation_freeze = read_json(ROOT / "implementation" / "implementation-freeze.v1.0.json")
    annotation_freeze = read_json(ROOT / "annotation" / "annotation-freeze.v1.0.json")
    require(implementation_freeze["status"] == "FROZEN", "Implementation Freeze is not FROZEN")
    require(annotation_freeze["status"] == "ANNOTATION FREEZE — FROZEN", "Annotation Freeze is not FROZEN")

    implementation_failures = []
    checksum_file = ROOT / "public-record" / "implementation-freeze-checksums-v1.0.sha256"
    for line in checksum_file.read_text(encoding="utf-8").splitlines():
        expected, rel = line.split("  ", 1)
        actual = sha256(ROOT.parent.parent / rel)
        if actual != expected:
            implementation_failures.append(rel)
    require(not implementation_failures, f"Implementation hash failure: {implementation_failures}")
    checks["implementation_public_checksum_chain"] = "PASS"

    annotation_manifest_path = ROOT / "annotation" / "annotation-manifest.v1.0.json"
    integrity_path = ROOT / "annotation" / "annotation-integrity-report.v1.0.json"
    require(sha256(annotation_manifest_path) == annotation_freeze["annotation_manifest_sha256"], "Annotation Manifest lock mismatch")
    require(sha256(integrity_path) == annotation_freeze["integrity_report_sha256"], "Annotation integrity lock mismatch")
    annotation_manifest = read_json(annotation_manifest_path)
    artifact_failures = []
    for rel, record in annotation_manifest["artifacts"].items():
        if sha256(ROOT / rel) != record["sha256"]:
            artifact_failures.append(rel)
    require(not artifact_failures, f"Annotation artifact hash failure: {artifact_failures}")
    require(annotation_manifest["rows"] == 360, "Annotation manifest does not contain 360 rows")
    require(annotation_manifest["integrity"] == "PASS", "Annotation integrity did not pass")
    checks["annotation_hash_chain"] = "PASS"
    checks["annotation_integrity"] = "PASS"
    checks["pre_unblind_condition_key_accessed"] = annotation_freeze["condition_key_accessed"]
    checks["pre_unblind_primary_analysis_performed"] = annotation_freeze["primary_analysis_performed"]
    require(not annotation_freeze["condition_key_accessed"], "Frozen record says condition key was accessed before authorization")
    require(not annotation_freeze["primary_analysis_performed"], "Frozen record says primary analysis was already performed")
    return {
        "checks": checks,
        "implementation_freeze_sha256": sha256(ROOT / "implementation" / "implementation-freeze.v1.0.json"),
        "annotation_freeze_sha256": sha256(ROOT / "annotation" / "annotation-freeze.v1.0.json"),
        "annotation_manifest_sha256": sha256(annotation_manifest_path),
        "final_annotation_labels_sha256": sha256(ROOT / "annotation" / "final-annotation-labels.v1.0.csv"),
        "sampling_manifest_sha256": sha256(ROOT / "data" / "manifests" / "sampling-manifest.v1.0.csv"),
        "blind_id_map_sha256": sha256(ROOT / "annotation" / "private" / "blind-id-map.v1.0.csv"),
    }


def wilson(successes: int, total: int) -> tuple[float, float]:
    p = successes / total
    denominator = 1 + Z95 * Z95 / total
    center = (p + Z95 * Z95 / (2 * total)) / denominator
    half = Z95 * math.sqrt(p * (1 - p) / total + Z95 * Z95 / (4 * total * total)) / denominator
    return center - half, center + half


def stats(rows: list[dict[str, str]], positive_codes: set[str]) -> dict[str, object]:
    w = [row for row in rows if row["group"] == "W"]
    control = [row for row in rows if row["group"] == "CONTROL"]
    a = sum(row["target_code"] in positive_codes for row in w)
    b = len(w) - a
    c = sum(row["target_code"] in positive_codes for row in control)
    d = len(control) - c
    p_w = a / len(w)
    p_c = c / len(control)
    if p_c == 0:
        rr: float | str | None = "infinity" if p_w > 0 else None
    else:
        rr = p_w / p_c
    rr_ci = None
    if a > 0 and c > 0:
        se = math.sqrt(1 / a - 1 / len(w) + 1 / c - 1 / len(control))
        rr_ci = [math.exp(math.log(float(rr)) - Z95 * se), math.exp(math.log(float(rr)) + Z95 * se)]
    w_ci = wilson(a, len(w))
    c_ci = wilson(c, len(control))
    return {
        "table": {"w_target": a, "w_nontarget": b, "control_target": c, "control_nontarget": d},
        "n_w": len(w),
        "n_control": len(control),
        "p_w": p_w,
        "p_control": p_c,
        "risk_ratio": rr,
        "risk_ratio_95_ci_katz": rr_ci,
        "risk_difference": p_w - p_c,
        "risk_difference_95_ci_newcombe_wilson": [w_ci[0] - c_ci[1], w_ci[1] - c_ci[0]],
        "fisher_two_sided_p": fisher_two_sided_p(a, c, len(w), len(control)),
        "continuity_corrected_rr_sensitivity": ((a + 0.5) / (len(w) + 1)) / ((c + 0.5) / (len(control) + 1)),
    }


def outcome(result: dict[str, object]) -> str:
    rr = result["risk_ratio"]
    ci = result["risk_ratio_95_ci_katz"]
    p = result["fisher_two_sided_p"]
    if isinstance(rr, (float, int)) and rr > 1 and ci and ci[0] > 1 and p < 0.05:
        return "SUPPORTED"
    if ci and ci[0] <= 1 <= ci[1] and ci[1] >= 2.0:
        return "INCONCLUSIVE"
    if ci and ci[1] < 2.0:
        return "NOT_SUPPORTED"
    if ci is None:
        return "INCONCLUSIVE"
    return "NOT_SUPPORTED"


def main() -> None:
    results_dir = ROOT / "results"
    audit_dir = ROOT / "audit"
    require(not (results_dir / "result-freeze.v1.0.json").exists(), "Result Freeze already exists; immutable run will not overwrite it")

    validation = verify_freezes()
    unblinded_at = now_utc()

    # Authorized access to the condition key begins here, after freeze verification.
    sampling = read_csv(ROOT / "data" / "manifests" / "sampling-manifest.v1.0.csv")
    blind_map = read_csv(ROOT / "annotation" / "private" / "blind-id-map.v1.0.csv")
    labels = read_csv(ROOT / "annotation" / "final-annotation-labels.v1.0.csv")
    require(len(sampling) == len(blind_map) == len(labels) == 360, "Expected 360 frozen records in each key input")
    require(len({r["sample_id"] for r in sampling}) == 360, "Sampling sample IDs are not unique")
    require(len({r["family_id"] for r in sampling}) == 360, "Sampling Family IDs are not unique")
    require(len({r["blind_item_id"] for r in blind_map}) == 360, "Blind IDs are not unique")
    require(len({r["sample_id"] for r in blind_map}) == 360, "Blind-map sample IDs are not unique")
    require({r["sample_id"] for r in blind_map} == {r["sample_id"] for r in sampling}, "Blind map and sampling manifest do not cover the same sample IDs")
    require({r["blind_item_id"] for r in blind_map} == {r["blind_item_id"] for r in labels}, "Blind map and final labels do not cover the same blind IDs")

    sampling_by_id = {r["sample_id"]: r for r in sampling}
    labels_by_blind = {r["blind_item_id"]: r for r in labels}
    locked_rows: list[dict[str, object]] = []
    for mapping in blind_map:
        sample = sampling_by_id[mapping["sample_id"]]
        label = labels_by_blind[mapping["blind_item_id"]]
        locked_rows.append({
            "family_id": sample["family_id"],
            "sample_id": sample["sample_id"],
            "blind_item_id": mapping["blind_item_id"],
            "lemma": sample["lemma"],
            "group": sample["group"],
            "initial": sample["initial"],
            "frequency_stratum": sample["frequency_stratum"],
            "frequency_count": sample["frequency_count"],
            "contextual_diversity_count": sample["contextual_diversity_count"],
            "target_code": label["final_target_code"],
            "target_subdomain": label["final_target_subdomain"],
            "annotation_provenance": label["provenance"],
        })
    locked_rows.sort(key=lambda r: str(r["sample_id"]))
    locked_dataset = ROOT / "analysis" / "locked-family-dataset.v1.0.csv"
    write_csv(locked_dataset, locked_rows, list(locked_rows[0]))
    locked_hash = sha256(locked_dataset)
    (ROOT / "analysis" / "locked-family-dataset.v1.0.sha256").write_text(
        f"{locked_hash}  analysis/locked-family-dataset.v1.0.csv\n", encoding="utf-8"
    )

    unblind_event = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "event": "AUTHORIZED_UNBLIND",
        "unblinded_at_utc": unblinded_at,
        "authorization": "User instruction executing Package B after Annotation Freeze v1.0",
        "condition_key_components": {
            "blind_id_map_sha256": validation["blind_id_map_sha256"],
            "sampling_manifest_sha256": validation["sampling_manifest_sha256"],
        },
        "pre_unblind_validation": validation,
        "joined_rows": 360,
        "unique_family_ids": 360,
        "locked_family_dataset_sha256": locked_hash,
    }
    write_json(audit_dir / "unblinding-event.v1.0.json", unblind_event)

    primary = stats(locked_rows, {"1"})
    primary.update({
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "analysis_level": "deduplicated lexical family",
        "positive_definition": "final Direct Target code 1 only",
        "outcome": outcome(primary),
        "alpha": 0.05,
        "sesoi_rr": 2.0,
        "input_sha256": locked_hash,
        "analysis_script_sha256": sha256(Path(__file__)),
        "run_at_utc": now_utc(),
    })
    write_json(results_dir / "primary-result.v1.0.json", primary)

    strata = {}
    for stratum in ("high", "middle", "lower"):
        subset = [r for r in locked_rows if r["frequency_stratum"] == stratum]
        strata[stratum] = stats(subset, {"1"})
    borderline = stats(locked_rows, {"1", "2"})
    robustness = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "classification": "SECONDARY / ROBUSTNESS / SENSITIVITY — cannot override primary outcome",
        "frequency_stratified_direct_target": strata,
        "borderline_inclusive_sensitivity": borderline,
        "raw_lemma_level_descriptive": {
            "status": "NOT_DISTINCTLY_ESTIMABLE",
            "reason": "The frozen semantic annotation contains one sampled representative per deduplicated family. Propagating a family label to unannotated family-member lemmas was not frozen; the observed 360 representative lemmas therefore reproduce, rather than independently extend, the family-level table.",
        },
        "repeated_random_control_null_distribution": {
            "status": "NOT_RUN_UNDER_FROZEN_IMPLEMENTATION",
            "reason": "The frozen implementation does not specify a repetition count or resampling algorithm and contains no semantic labels for unsampled control families. Inventing either after unblinding would violate the No Rescue Rule.",
        },
        "frequency_matched_control_robustness": {
            "status": "EMBEDDED_IN_FROZEN_SAMPLE",
            "reason": "The primary frozen sample is exactly balanced within each preregistered stratum at 40 W to 80 Controls; stratum-specific results are reported above.",
        },
        "exploratory_v_control": {
            "status": "NOT_RUN_UNDER_FROZEN_DATA",
            "reason": "No frozen V-control semantic annotations exist.",
        },
    }
    write_json(results_dir / "secondary-robustness.v1.0.json", robustness)

    ai_a = {r["blind_item_id"]: r["target_code"] for r in read_csv(ROOT / "annotation" / "runs" / "ai-a" / "raw-annotations.csv")}
    ai_b = {r["blind_item_id"]: r["target_code"] for r in read_csv(ROOT / "annotation" / "runs" / "ai-b" / "raw-annotations.csv")}
    final_by_blind = {r["blind_item_id"]: r["target_code"] for r in locked_rows}
    annotation_results = {}
    for name, source in (("AI_A_RAW", ai_a), ("AI_B_RAW", ai_b), ("FINAL_ADJUDICATED", final_by_blind)):
        altered = [{**r, "target_code": source[str(r["blind_item_id"])]} for r in locked_rows]
        annotation_results[name] = stats(altered, {"1"})
    disagreement_ids = set(read_csv(ROOT / "annotation" / "disagreement-manifest.v1.0.csv")[i]["blind_item_id"] for i in range(3))
    annotation_robustness = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "classification": "ANNOTATION ROBUSTNESS — machine reproducibility, not human validation",
        "agreement": read_json(ROOT / "annotation" / "agreement-report.v1.0.json"),
        "adjudicated_item_count": len(disagreement_ids),
        "adjudicated_blind_item_ids": sorted(disagreement_ids),
        "primary_recomputed_by_label_source": annotation_results,
        "primary_outcome_by_label_source": {name: outcome(value) for name, value in annotation_results.items()},
    }
    write_json(results_dir / "annotation-robustness.v1.0.json", annotation_robustness)

    flat_rows = []
    for label, value in (("primary", primary), ("borderline_inclusive", borderline), *[(f"stratum_{k}", v) for k, v in strata.items()]):
        table = value["table"]
        flat_rows.append({
            "analysis": label,
            **table,
            "p_w": value["p_w"],
            "p_control": value["p_control"],
            "risk_ratio": value["risk_ratio"],
            "rr_ci_low": value["risk_ratio_95_ci_katz"][0] if value["risk_ratio_95_ci_katz"] else "",
            "rr_ci_high": value["risk_ratio_95_ci_katz"][1] if value["risk_ratio_95_ci_katz"] else "",
            "risk_difference": value["risk_difference"],
            "rd_ci_low": value["risk_difference_95_ci_newcombe_wilson"][0],
            "rd_ci_high": value["risk_difference_95_ci_newcombe_wilson"][1],
            "fisher_two_sided_p": value["fisher_two_sided_p"],
            "classification": "PRIMARY" if label == "primary" else "SECONDARY_OR_SENSITIVITY",
        })
    write_csv(results_dir / "analysis-output.v1.0.csv", flat_rows, list(flat_rows[0]))

    deviations = read_json(ROOT / "annotation" / "protocol-deviations.v1.0.json")
    audit = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "events": [
            {"event": "PRE_UNBLIND_FREEZE_VALIDATION", "status": "PASS", "timestamp_utc": unblinded_at},
            {"event": "AUTHORIZED_UNBLIND", "status": "COMPLETE", "timestamp_utc": unblinded_at},
            {"event": "PRIMARY_ANALYSIS", "status": "COMPLETE_ONCE", "timestamp_utc": primary["run_at_utc"]},
        ],
        "known_protocol_deviations": deviations["deviations"],
        "deviation_validity_assessment": "The early AI-B dispatch was stopped before producing output; the usable AI-B run began fresh after AI-A froze. No data sharing, condition exposure, design change, or analysis change is evidenced. It remains a minor contained process deviation and does not invalidate inference.",
        "no_rescue_rule": "OBSERVED",
    }
    write_json(results_dir / "audit-trail.v1.0.json", audit)

    core_paths = [
        ROOT / "analysis" / "locked-family-dataset.v1.0.csv",
        ROOT / "analysis" / "locked-family-dataset.v1.0.sha256",
        audit_dir / "unblinding-event.v1.0.json",
        results_dir / "primary-result.v1.0.json",
        results_dir / "secondary-robustness.v1.0.json",
        results_dir / "annotation-robustness.v1.0.json",
        results_dir / "analysis-output.v1.0.csv",
        results_dir / "audit-trail.v1.0.json",
    ]
    analysis_manifest = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "analysis_script": {"path": "analysis/run_package_b.py", "sha256": sha256(Path(__file__))},
        "runtime": {"python": sys.version, "platform": platform.platform()},
        "frozen_inputs": validation,
        "outputs": {str(p.relative_to(ROOT)).replace("\\", "/"): {"sha256": sha256(p), "bytes": p.stat().st_size} for p in core_paths},
    }
    write_json(results_dir / "analysis-manifest.v1.0.json", analysis_manifest)

    print(json.dumps({"outcome": primary["outcome"], "table": primary["table"], "rr": primary["risk_ratio"], "p": primary["fisher_two_sided_p"]}))


if __name__ == "__main__":
    main()
