from __future__ import annotations

import csv
import hashlib
import json
import math
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ResultFreezeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.dataset = ROOT / "analysis" / "locked-family-dataset.v1.0.csv"
        self.primary = json.loads((ROOT / "results" / "primary-result.v1.0.json").read_text(encoding="utf-8"))
        with self.dataset.open("r", encoding="utf-8", newline="") as handle:
            self.rows = list(csv.DictReader(handle))

    def test_locked_dataset_hash(self) -> None:
        expected = (ROOT / "analysis" / "locked-family-dataset.v1.0.sha256").read_text(encoding="utf-8").split()[0]
        self.assertEqual(sha256(self.dataset), expected)

    def test_family_coverage_and_conditions(self) -> None:
        self.assertEqual(len(self.rows), 360)
        self.assertEqual(len({r["family_id"] for r in self.rows}), 360)
        self.assertEqual(sum(r["group"] == "W" for r in self.rows), 120)
        self.assertEqual(sum(r["group"] == "CONTROL" for r in self.rows), 240)
        self.assertLessEqual({r["target_code"] for r in self.rows}, {"0", "1", "2", "U"})

    def test_primary_counts_regenerate(self) -> None:
        w = [r for r in self.rows if r["group"] == "W"]
        c = [r for r in self.rows if r["group"] == "CONTROL"]
        table = {
            "w_target": sum(r["target_code"] == "1" for r in w),
            "w_nontarget": sum(r["target_code"] != "1" for r in w),
            "control_target": sum(r["target_code"] == "1" for r in c),
            "control_nontarget": sum(r["target_code"] != "1" for r in c),
        }
        self.assertEqual(table, self.primary["table"])
        self.assertTrue(math.isclose((table["w_target"] / 120) / (table["control_target"] / 240), self.primary["risk_ratio"], rel_tol=1e-15))

    def test_unique_primary_outcome(self) -> None:
        self.assertEqual(self.primary["outcome"], "INCONCLUSIVE")
        self.assertGreater(self.primary["risk_ratio_95_ci_katz"][1], 2.0)
        self.assertLess(self.primary["risk_ratio_95_ci_katz"][0], 1.0)
        self.assertGreater(self.primary["fisher_two_sided_p"], 0.05)

    def test_public_boundary(self) -> None:
        summary = (ROOT / "results" / "public-safe-result-summary-v1.0.md").read_text(encoding="utf-8")
        page = (ROOT / "results.html").read_text(encoding="utf-8")
        boundary = "Machine-based exploratory blind annotation — not human double-blind validation."
        self.assertIn(boundary, summary)
        self.assertIn(boundary, page)
        self.assertIn("INCONCLUSIVE", summary)
        self.assertIn("INCONCLUSIVE", page)

    def test_result_manifest_hashes(self) -> None:
        manifest_path = ROOT / "results" / "result-manifest.v1.0.json"
        if not manifest_path.exists():
            self.skipTest("Result Manifest is generated after pre-freeze tests")
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        for rel, record in manifest["artifacts"].items():
            self.assertEqual(sha256(ROOT / rel), record["sha256"], rel)


if __name__ == "__main__":
    unittest.main()
