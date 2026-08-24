#!/usr/bin/env python3
"""Reproduce Experiment 001A Round 2 Exploratory AI Unblinding v1.0.

This program requires three separately held frozen private inputs: the restricted
analysis key and the frozen machine-readable AI-A and AI-B labels. It writes a
restricted joined file and public-safe aggregate outputs. It never rewrites an
input artifact.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


LABELS = ("human", "person", "people", "identity", "human_attribute", "uncertain")
SENSITIVITY_LABELS = ("person", "people", "identity", "human_attribute", "uncertain")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def wilson_interval(x: int, n: int, z: float = 1.959963984540054) -> tuple[float, float]:
    if n == 0:
        return (math.nan, math.nan)
    p = x / n
    den = 1 + z * z / n
    centre = (p + z * z / (2 * n)) / den
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den
    return (max(0.0, centre - half), min(1.0, centre + half))


def newcombe_difference_ci(x1: int, n1: int, x0: int, n0: int) -> tuple[float, float]:
    """Newcombe score interval for p1-p0 without continuity correction."""
    p1, p0 = x1 / n1, x0 / n0
    l1, u1 = wilson_interval(x1, n1)
    l0, u0 = wilson_interval(x0, n0)
    lower = (p1 - p0) - math.sqrt((p1 - l1) ** 2 + (u0 - p0) ** 2)
    upper = (p1 - p0) + math.sqrt((u1 - p1) ** 2 + (p0 - l0) ** 2)
    return (max(-1.0, lower), min(1.0, upper))


def hypergeom_probability(a: int, row1: int, col1: int, total: int) -> float:
    return math.comb(col1, a) * math.comb(total - col1, row1 - a) / math.comb(total, row1)


def fisher_exact(a: int, b: int, c: int, d: int) -> tuple[float, float]:
    """Return one-sided greater and probability-ordering two-sided Fisher p-values."""
    row1, col1, total = a + b, a + c, a + b + c + d
    lo = max(0, row1 - (total - col1))
    hi = min(row1, col1)
    observed = hypergeom_probability(a, row1, col1, total)
    greater = sum(hypergeom_probability(k, row1, col1, total) for k in range(a, hi + 1))
    two_sided = sum(
        p for k in range(lo, hi + 1)
        if (p := hypergeom_probability(k, row1, col1, total)) <= observed * (1 + 1e-12)
    )
    return (min(1.0, greater), min(1.0, two_sided))


def effect_stats(rows: list[dict], label: str) -> dict:
    m = [r for r in rows if r["group"] == "M"]
    control = [r for r in rows if r["group"] == "Control"]
    x1, n1 = sum(r[label] for r in m), len(m)
    x0, n0 = sum(r[label] for r in control), len(control)
    a, b, c, d = x1, n1 - x1, x0, n0 - x0
    one_sided, two_sided = fisher_exact(a, b, c, d)
    rd = x1 / n1 - x0 / n0
    rd_low, rd_high = newcombe_difference_ci(x1, n1, x0, n0)
    if min(a, b, c, d) > 0:
        odds_ratio = (a * d) / (b * c)
        se_log_or = math.sqrt(1 / a + 1 / b + 1 / c + 1 / d)
        or_low = math.exp(math.log(odds_ratio) - 1.959963984540054 * se_log_or)
        or_high = math.exp(math.log(odds_ratio) + 1.959963984540054 * se_log_or)
    else:
        odds_ratio = or_low = or_high = None
    return {
        "label": label,
        "m": {"n": n1, "positive": x1, "rate": x1 / n1, "wilson_95_ci": wilson_interval(x1, n1)},
        "control": {"n": n0, "positive": x0, "rate": x0 / n0, "wilson_95_ci": wilson_interval(x0, n0)},
        "risk_difference_m_minus_control": rd,
        "risk_difference_newcombe_95_ci": [rd_low, rd_high],
        "odds_ratio": odds_ratio,
        "odds_ratio_wald_95_ci": None if odds_ratio is None else [or_low, or_high],
        "fisher_exact_p_greater": one_sided,
        "fisher_exact_p_two_sided": two_sided,
        "table_m_control_by_positive_negative": [[a, b], [c, d]],
    }


def truthy(value: str) -> bool:
    return str(value).strip().lower() in {"1", "true", "yes", "y"}


def load_labels(path: Path) -> dict[str, dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if len(data) != 1020:
        raise ValueError(f"{path}: expected 1020 rows, found {len(data)}")
    keyed = {}
    for row in data:
        blind_id = row["blind_id"]
        if blind_id in keyed:
            raise ValueError(f"{path}: duplicate blind_id {blind_id}")
        for label in LABELS:
            if row[label] not in (0, 1):
                raise ValueError(f"{path}: non-binary {label} at {blind_id}")
        keyed[blind_id] = row
    return keyed


def load_key(path: Path) -> dict[str, dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 1020:
        raise ValueError(f"{path}: expected 1020 rows, found {len(rows)}")
    for row in rows:
        raw_group = row["group"].strip().upper()
        if raw_group == "M":
            row["group"] = "M"
        elif raw_group == "CONTROL":
            row["group"] = "Control"
        else:
            raise ValueError(f"Unexpected group value: {row['group']!r}")
    keyed = {r["blind_id"]: r for r in rows}
    if len(keyed) != 1020:
        raise ValueError(f"{path}: duplicate blind_id")
    groups = Counter(r["group"] for r in rows)
    if groups != Counter({"M": 510, "Control": 510}):
        raise ValueError(f"Unexpected group counts: {groups}")
    return keyed


def joined_rows(key: dict[str, dict], labels: dict[str, dict]) -> list[dict]:
    if set(key) != set(labels):
        raise ValueError("Key and label blind_id sets differ")
    rows = []
    for blind_id, k in key.items():
        l = labels[blind_id]
        row = {
            "blind_id": blind_id,
            "group": k["group"],
            "control_letter": k["control_letter"],
            "frequency_band": k["frequency_band"],
            "evidence_family_id": k["evidence_family_id"],
            "family_representative": truthy(k["family_representative"]),
        }
        row.update({label: int(l[label]) for label in LABELS})
        rows.append(row)
    return rows


def pass_analysis(rows: list[dict]) -> dict:
    representatives = [r for r in rows if r["family_representative"]]
    control_letters = {}
    for letter in sorted({r["control_letter"] for r in rows if r["group"] == "Control"}):
        subset = [r for r in rows if r["group"] == "Control" and r["control_letter"] == letter]
        control_letters[letter] = {
            "n": len(subset),
            "human_positive": sum(r["human"] for r in subset),
            "human_rate": sum(r["human"] for r in subset) / len(subset),
        }
    return {
        "lexeme_level": {
            "primary_human": effect_stats(rows, "human"),
            "secondary_frozen_categories": {label: effect_stats(rows, label) for label in SENSITIVITY_LABELS},
        },
        "evidence_family_level_fixed_representatives": {
            "representative_n": len(representatives),
            "primary_human": effect_stats(representatives, "human"),
            "secondary_frozen_categories": {label: effect_stats(representatives, label) for label in SENSITIVITY_LABELS},
        },
        "descriptive_control_letters_human": control_letters,
    }


def write_private_join(path: Path, a_rows: list[dict], b_rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = [
        "blind_id", "group", "control_letter", "frequency_band", "evidence_family_id",
        "family_representative",
    ] + [f"ai_a_{label}" for label in LABELS] + [f"ai_b_{label}" for label in LABELS]
    by_id_b = {r["blind_id"]: r for r in b_rows}
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for a in sorted(a_rows, key=lambda r: r["blind_id"]):
            b = by_id_b[a["blind_id"]]
            out = {field: a[field] for field in fields[:6]}
            out.update({f"ai_a_{label}": a[label] for label in LABELS})
            out.update({f"ai_b_{label}": b[label] for label in LABELS})
            writer.writerow(out)


def flatten_output(result: dict, path: Path) -> None:
    rows = []
    for pass_name in ("ai_a", "ai_b"):
        for level_key, level_name in (
            ("lexeme_level", "lexeme"),
            ("evidence_family_level_fixed_representatives", "evidence_family_representative"),
        ):
            block = result["passes"][pass_name][level_key]
            categories = {"human": block["primary_human"], **block["secondary_frozen_categories"]}
            for label, stat in categories.items():
                rows.append({
                    "pass": pass_name,
                    "analysis_level": level_name,
                    "label": label,
                    "m_n": stat["m"]["n"],
                    "m_positive": stat["m"]["positive"],
                    "m_rate": stat["m"]["rate"],
                    "control_n": stat["control"]["n"],
                    "control_positive": stat["control"]["positive"],
                    "control_rate": stat["control"]["rate"],
                    "risk_difference": stat["risk_difference_m_minus_control"],
                    "risk_difference_ci_low": stat["risk_difference_newcombe_95_ci"][0],
                    "risk_difference_ci_high": stat["risk_difference_newcombe_95_ci"][1],
                    "fisher_p_greater": stat["fisher_exact_p_greater"],
                    "fisher_p_two_sided": stat["fisher_exact_p_two_sided"],
                })
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--analysis-key", type=Path, required=True)
    parser.add_argument("--ai-a", type=Path, required=True)
    parser.add_argument("--ai-b", type=Path, required=True)
    parser.add_argument("--private-joined", type=Path, required=True)
    parser.add_argument("--public-json", type=Path, required=True)
    parser.add_argument("--public-csv", type=Path, required=True)
    args = parser.parse_args()

    key = load_key(args.analysis_key)
    a_labels, b_labels = load_labels(args.ai_a), load_labels(args.ai_b)
    a_rows, b_rows = joined_rows(key, a_labels), joined_rows(key, b_labels)
    write_private_join(args.private_joined, a_rows, b_rows)

    result = {
        "record_id": "UNI-EXP-001A-R2-AIUNBLIND-1.0",
        "generated_at_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "result_label": "Exploratory AI Result",
        "preregistered_human_annotation": "Pending",
        "experiment_001b_started": False,
        "input_sha256": {
            "restricted_analysis_key": sha256(args.analysis_key),
            "ai_a_labels": sha256(args.ai_a),
            "ai_b_labels": sha256(args.ai_b),
        },
        "methods": {
            "primary_outcome": "frozen HUMAN binary label",
            "primary_analysis_level": "all frozen lexemes/items",
            "primary_effect": "M minus pooled-Control absolute risk difference",
            "risk_difference_ci": "two-sided 95% Newcombe score interval without continuity correction",
            "hypothesis_test": "Fisher exact test; one-sided greater follows the frozen directional hypothesis; two-sided also reported",
            "robustness": "evidence-family representatives fixed before annotation",
            "pass_handling": "AI-A and AI-B analyzed separately; no selection, pooling, consensus, or adjudication",
        },
        "passes": {"ai_a": pass_analysis(a_rows), "ai_b": pass_analysis(b_rows)},
    }
    args.public_json.parent.mkdir(parents=True, exist_ok=True)
    args.public_json.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    flatten_output(result, args.public_csv)
    print(json.dumps({
        "generated_at_utc": result["generated_at_utc"],
        "private_joined_sha256": sha256(args.private_joined),
        "public_json_sha256": sha256(args.public_json),
        "public_csv_sha256": sha256(args.public_csv),
    }, indent=2))


if __name__ == "__main__":
    main()
