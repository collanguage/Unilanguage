# Experiment 001A Round 2 — Exploratory AI Unblinding v1.0

**Record ID:** `UNI-EXP-001A-R2-AIUNBLIND-1.0`

**Conclusion label:** **Exploratory AI Result — Tentatively Supported**

**Preregistered Human Annotation:** **Pending**

**Experiment 001B:** **Not started**

## Research boundary

This report is the first authorized exploratory unblinding of the frozen AI-A and AI-B annotations. It does not amend or replace the frozen 31-section preregistration, the frozen pre-outcome operational specification (OPS), either frozen AI pass, or any pre-existing checksum. It is not the preregistered human analysis and does not confirm or reject the preregistered human hypothesis.

The raw restricted analysis key, row-level M/Control mapping, joined item-level data, and AI workbooks remain private so that future preregistered human annotation is not compromised.

## Integrity and analysis procedure

Before group comparisons, SHA-256 hashes were recomputed for all 14 artifacts in the Round 2 freeze manifest and all 5 artifacts in the AI annotation freeze manifest. There were **0 mismatches**.

AI-A and AI-B were joined separately to the frozen key by `blind_id`. No labels were adjudicated, selected, pooled, averaged, or merged. The primary analysis used all 510 M items and all 510 pooled controls. The prespecified robustness analysis used only evidence-family representatives fixed before annotation: 385 M families and 475 Control families.

For each pass, the primary effect is the absolute risk difference:

`P(HUMAN | M) − P(HUMAN | pooled Controls)`

The 95% interval is the two-sided Newcombe score interval without continuity correction. Fisher's exact test is reported one-sided for the frozen directional prediction (`M > Controls`) and two-sided for transparency. Supplemental odds ratios use ordinary sample odds ratios with Wald 95% intervals and do not determine the conclusion.

## Primary HUMAN outcome — lexeme level

| Frozen AI pass | M HUMAN | Control HUMAN | Absolute risk difference | 95% CI | Fisher p, one-sided | Fisher p, two-sided | Odds ratio (95% Wald CI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| AI-A | 76/510 = 14.90% | 60/510 = 11.76% | +3.14 percentage points | −1.05 to +7.33 pp | 0.0835 | 0.1669 | 1.31 (0.91–1.89) |
| AI-B | 79/510 = 15.49% | 61/510 = 11.96% | +3.53 percentage points | −0.71 to +7.77 pp | 0.0608 | 0.1217 | 1.35 (0.94–1.93) |

Both frozen AI passes show a modest positive M-minus-Control difference. Neither two-sided 95% interval excludes zero, and neither directional Fisher test reaches 0.05. The passes therefore agree on direction and approximate magnitude but do not provide a conventionally decisive result.

## Preregistered/OPS-specified evidence-family robustness analysis

| Frozen AI pass | M HUMAN | Control HUMAN | Absolute risk difference | 95% CI | Fisher p, one-sided | Fisher p, two-sided |
|---|---:|---:|---:|---:|---:|---:|
| AI-A | 61/385 = 15.84% | 59/475 = 12.42% | +3.42 percentage points | −1.23 to +8.22 pp | 0.0901 | 0.1661 |
| AI-B | 62/385 = 16.10% | 60/475 = 12.63% | +3.47 percentage points | −1.21 to +8.30 pp | 0.0883 | 0.1688 |

The fixed evidence-family analysis preserves the positive direction and nearly the same magnitude in both passes. Its intervals also include zero. Deduplication therefore does not erase or reverse the signal, but it does not make the signal statistically decisive.

## Frozen-category sensitivity analyses — lexeme level

These are secondary **Exploratory AI Results**. They probe documented semantic-boundary disagreements and do not replace HUMAN.

| Category | AI-A: M vs Control | AI-A RD (95% CI), two-sided p | AI-B: M vs Control | AI-B RD (95% CI), two-sided p |
|---|---:|---:|---:|---:|
| PERSON | 38/510 vs 34/510 | +0.78 pp (−2.41, +3.99), p=0.7141 | 71/510 vs 55/510 | +3.14 pp (−0.92, +7.20), p=0.1533 |
| PEOPLE | 38/510 vs 26/510 | +2.35 pp (−0.65, +5.41), p=0.1551 | 8/510 vs 6/510 | +0.39 pp (−1.18, +2.02), p=0.7891 |
| IDENTITY | 66/510 vs 38/510 | +5.49 pp (+1.78, +9.24), p=0.0050 | 81/510 vs 61/510 | +3.92 pp (−0.34, +8.18), p=0.0854 |
| HUMAN-ATTRIBUTE | 117/510 vs 129/510 | −2.35 pp (−7.59, +2.90), p=0.4208 | 79/510 vs 76/510 | +0.59 pp (−3.83, +5.01), p=0.8616 |
| UNCERTAIN | 0/510 vs 0/510 | 0.00 pp (−0.75, +0.75), p=1.0000 | 0/510 vs 1/510 | −0.20 pp (−1.10, +0.57), p=1.0000 |

The secondary categories show why they cannot be silently substituted for HUMAN. AI-A has a clear positive IDENTITY comparison, while AI-B's IDENTITY estimate is positive but less precise. PEOPLE and HUMAN-ATTRIBUTE counts differ substantially between passes, consistent with the earlier blinded agreement review. UNCERTAIN is too rare to be informative. The primary HUMAN outcome is much more stable across passes than these boundary categories.

## Exploratory AI Result — interpretation

**Exploratory AI Result — Tentatively Supported.** Both independent frozen AI passes estimate a positive HUMAN difference of about 3–3.5 percentage points, and both fixed evidence-family analyses retain that direction and magnitude. However, all primary 95% intervals include zero and the directional p-values are 0.0608–0.0901. The exploratory evidence is therefore directionally compatible with M → HUMAN but remains uncertain and is not a confirmation.

**Preregistered Human Annotation: Pending.** No preregistered human conclusion has been reached. Future human annotators must remain blind to the reusable item-level key and mappings.

## Reproducibility and disclosure boundary

The accompanying machine-readable JSON and CSV contain aggregate results only. The analysis code is included and requires the separately held frozen private inputs. A restricted joined file was generated for private verification and is intentionally absent from this public-safe package. Public release files contain no raw `blind_id`, no surface-form/group map, no analysis-key rows, and no row-level AI labels.
