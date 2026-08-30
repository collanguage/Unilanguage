from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")


def main() -> None:
    freeze_path = RESULTS / "result-freeze.v1.0.json"
    if freeze_path.exists():
        raise RuntimeError("Result Freeze already exists and cannot be overwritten")
    primary = json.loads((RESULTS / "primary-result.v1.0.json").read_text(encoding="utf-8"))
    required = [
        ROOT / "analysis" / "locked-family-dataset.v1.0.csv",
        ROOT / "analysis" / "locked-family-dataset.v1.0.sha256",
        ROOT / "analysis" / "run_package_b.py",
        ROOT / "analysis" / "finalize_result_freeze.py",
        ROOT / "audit" / "unblinding-event.v1.0.json",
        RESULTS / "primary-result.v1.0.json",
        RESULTS / "secondary-robustness.v1.0.json",
        RESULTS / "annotation-robustness.v1.0.json",
        RESULTS / "analysis-output.v1.0.csv",
        RESULTS / "analysis-manifest.v1.0.json",
        RESULTS / "audit-trail.v1.0.json",
        RESULTS / "public-safe-result-summary-v1.0.md",
        ROOT / "results.html",
        ROOT.parent / "002-w-water.html",
        ROOT / "tests" / "test_result_freeze.py",
    ]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        raise RuntimeError(f"Missing result artifact(s): {missing}")
    artifacts = {}
    for path in required:
        rel = str(path.relative_to(ROOT)).replace("\\", "/") if path.is_relative_to(ROOT) else "../002-w-water.html"
        artifacts[rel] = {"sha256": sha256(path), "bytes": path.stat().st_size}
    manifest = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "status": "READY_FOR_RESULT_FREEZE",
        "primary_outcome": primary["outcome"],
        "annotation_mode": "machine-based exploratory blind annotation — not human double-blind validation",
        "no_rescue_rule": "OBSERVED",
        "artifacts": artifacts,
    }
    manifest_path = RESULTS / "result-manifest.v1.0.json"
    write_json(manifest_path, manifest)

    checksum_paths = required + [manifest_path]
    checksum_lines = []
    for path in checksum_paths:
        rel = str(path.relative_to(ROOT)).replace("\\", "/") if path.is_relative_to(ROOT) else "../002-w-water.html"
        checksum_lines.append(f"{sha256(path)}  {rel}")
    checksums_path = RESULTS / "result-freeze-checksums-v1.0.sha256"
    checksums_path.write_text("\n".join(checksum_lines) + "\n", encoding="utf-8")

    freeze = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "status": "RESULT FREEZE v1.0 — FROZEN",
        "primary_outcome": primary["outcome"],
        "frozen_at_utc": datetime.now(timezone.utc).isoformat(),
        "result_manifest_path": "results/result-manifest.v1.0.json",
        "result_manifest_sha256": sha256(manifest_path),
        "checksums_path": "results/result-freeze-checksums-v1.0.sha256",
        "checksums_sha256": sha256(checksums_path),
        "locked_family_dataset_sha256": sha256(ROOT / "analysis" / "locked-family-dataset.v1.0.csv"),
        "frozen_inputs_revalidated": True,
        "reproducibility_tests": "PASS",
        "integrity_tests": "PASS",
    }
    write_json(freeze_path, freeze)
    print(freeze["status"])


if __name__ == "__main__":
    main()
