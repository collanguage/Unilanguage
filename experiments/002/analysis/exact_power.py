from __future__ import annotations

import argparse
import math
import platform
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "pipeline"))
from common import ROOT, sha256_file, write_json  # noqa: E402


def log_choose(n: int, k: int) -> float:
    if k < 0 or k > n:
        return float("-inf")
    return math.lgamma(n + 1) - math.lgamma(k + 1) - math.lgamma(n - k + 1)


def hypergeom_probability(x_w: int, total_success: int, n_w: int, n_c: int) -> float:
    total = n_w + n_c
    return math.exp(log_choose(n_w, x_w) + log_choose(n_c, total_success - x_w) - log_choose(total, total_success))


def fisher_two_sided_p(x_w: int, x_c: int, n_w: int, n_c: int) -> float:
    total_success = x_w + x_c
    low = max(0, total_success - n_c)
    high = min(n_w, total_success)
    observed = hypergeom_probability(x_w, total_success, n_w, n_c)
    tolerance = max(1e-15, observed * 1e-12)
    return min(1.0, sum(
        probability
        for possible in range(low, high + 1)
        if (probability := hypergeom_probability(possible, total_success, n_w, n_c)) <= observed + tolerance
    ))


def binomial_probabilities(n: int, p: float) -> list[float]:
    return [math.comb(n, k) * (p ** k) * ((1 - p) ** (n - k)) for k in range(n + 1)]


def calculate(n_w: int, n_c: int, p_w: float, p_c: float, alpha: float) -> dict:
    probs_w = binomial_probabilities(n_w, p_w)
    probs_c = binomial_probabilities(n_c, p_c)
    reject = 0.0
    reject_positive = 0.0
    reject_negative = 0.0
    for x_w, prob_w in enumerate(probs_w):
        for x_c, prob_c in enumerate(probs_c):
            joint = prob_w * prob_c
            p_value = fisher_two_sided_p(x_w, x_c, n_w, n_c)
            if p_value < alpha:
                reject += joint
                difference = x_w / n_w - x_c / n_c
                if difference > 0:
                    reject_positive += joint
                elif difference < 0:
                    reject_negative += joint
    return {
        "total_two_sided_rejection_probability": reject,
        "direction_consistent_power": reject_positive,
        "opposite_direction_rejection_probability": reject_negative,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Enumerate unconditional power for the two-sided Fisher exact test.")
    parser.add_argument("--n-w", type=int, default=120)
    parser.add_argument("--n-control", type=int, default=240)
    parser.add_argument("--p-w", type=float, default=0.15)
    parser.add_argument("--p-control", type=float, default=0.05)
    parser.add_argument("--alpha", type=float, default=0.05)
    parser.add_argument("--output", type=Path, default=ROOT / "analysis" / "exact-power-verification.v1.0.json")
    args = parser.parse_args()

    result = calculate(args.n_w, args.n_control, args.p_w, args.p_control, args.alpha)
    report = {
        "schema_version": "1.0",
        "experiment_id": "UNI-EXP-002",
        "status": "VERIFIED" if result["direction_consistent_power"] >= 0.80 else "BELOW_TARGET",
        "method": "Unconditional binomial enumeration; each possible 2x2 table is evaluated by the two-sided Fisher exact conditional p-value. Direction-consistent power requires rejection and observed pW > pC.",
        "parameters": {
            "n_w": args.n_w,
            "n_control": args.n_control,
            "p_w": args.p_w,
            "p_control": args.p_control,
            "alpha": args.alpha,
            "alternative_reference_rr": args.p_w / args.p_control,
            "alternative_reference_rd": args.p_w - args.p_control,
        },
        "results": result,
        "target_power": 0.80,
        "important_scope_note": "This verifies the reference Fisher-test rejection probability. It does not guarantee power for other baselines, smaller effects, annotation loss, or the separate RR-confidence-interval decision requirement.",
        "runtime": {"python": sys.version, "platform": platform.platform()},
        "script_sha256": sha256_file(Path(__file__)),
    }
    write_json(args.output, report)
    print(f"Direction-consistent exact-test power: {result['direction_consistent_power']:.6f}")
    print(f"Status: {report['status']}")


if __name__ == "__main__":
    main()

