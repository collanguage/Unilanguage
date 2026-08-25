# AI Agreement & Disagreement Analysis

## Experiment 001A Round 2 — Blinded Methodological Review

**Document status:** Public-safe historical reconstruction v1.0

**Experiment:** `UNI-EXP-001A-R2`

**Historical review stage:** Exploratory AI Annotation — still blinded

**Evidence base:** 1,020 paired blind items; frozen aggregate AI-A/AI-B outputs

**Human annotation at review:** `Preregistered Human Annotation: Pending`

**Historical review date:** 24 August 2026

**Reconstruction note:** This public file was assembled after exploratory AI unblinding from the preserved blinded diagnostics and the documented pre-unblinding methodological decision. It records the earlier blind-state review but does not claim that this exact Markdown file was itself frozen before unblinding. No M/Control identities, row-level annotations, or reusable blind-breaking material are included.

> **Historical recommendation recorded before unblinding: PROCEED TO EXPLORATORY AI UNBLINDING.** The broad HUMAN field was exceptionally robust (99.61% raw agreement; κ=0.9832; four disagreements). The 81.18% exact six-label-vector rate was judged adequate for an explicitly exploratory analysis because it is a strict six-field criterion and the remaining disagreement was concentrated in interpretable category boundaries. The two frozen passes were to be reported separately, PEOPLE and HUMAN-ATTRIBUTE treated as sensitivity-limited secondary fields, and preregistered human annotation kept pending.

The recommendation above was methodological, not a finding about M → HUMAN. The subsequent unblinding was separately authorized and is reported in `Exploratory AI Unblinding v1.0`.

## 1. Review question and protected boundary

The review asked whether the frozen AI-A and AI-B annotations were sufficiently reproducible to justify opening a separate exploratory unblinding stage. It did not test the M hypothesis and did not estimate any M-versus-Control outcome rate.

**Protected boundary at the time of review:** the restricted analysis key was not accessed; experimental and control identities were not used; no row-level disagreement was adjudicated; no frozen coding rule was changed; no frozen annotation file was edited; the 31-section preregistration remained unchanged; and Experiment 001B was not started.

## 2. What 81.18% means

AI-A and AI-B produced the same complete six-label vector for **828 of 1,020** paired blind items:

- exact-vector agreement: **81.18%**;
- exact-vector disagreements: **192**;
- Wilson 95% confidence interval: approximately **78.66% to 83.46%**.

This is stricter than agreement on HUMAN alone: a row counted as an exact-vector disagreement if either pass differed on any one of HUMAN, PERSON, PEOPLE, IDENTITY, HUMAN-ATTRIBUTE, or UNCERTAIN.

## 3. Agreement by frozen field

| Frozen field | Paired n | Raw agreement | Cohen's κ | AI-A positives | AI-B positives | Disagreements |
|---|---:|---:|---:|---:|---:|---:|
| HUMAN | 1,020 | 99.61% | 0.9832 | 136 | 140 | 4 |
| PERSON | 1,020 | 94.71% | 0.7004 | 72 | 126 | 54 |
| PEOPLE | 1,020 | 94.31% | 0.2393 | 64 | 14 | 58 |
| IDENTITY | 1,020 | 96.27% | 0.8249 | 104 | 142 | 38 |
| HUMAN-ATTRIBUTE | 1,020 | 88.92% | 0.6536 | 246 | 155 | 113 |
| UNCERTAIN | 1,020 | 99.90% | 0.0000 | 0 | 1 | 1 |

## 4. Why high agreement and low κ can coexist

Cohen's κ depends on expected agreement under the observed marginal label frequencies. PEOPLE and UNCERTAIN were highly imbalanced: positive labels were rare and differed sharply between passes. Under such prevalence imbalance, raw agreement can remain high while κ is low or zero. The review therefore retained raw agreement, positive counts, disagreements, and 2×2 cross-tabulations rather than interpreting κ alone.

For HUMAN, this limitation was not material: positive counts were similar between passes, raw agreement was 99.61%, and κ was 0.9832.

## 5. Where disagreements occurred

- **HUMAN-ATTRIBUTE:** largest concentration, 113 disagreements. The main boundary concerned a human-associated property or behavior versus direct denotation of a human.
- **PEOPLE:** 58 disagreements and strong marginal imbalance, reflecting collective-human versus broader group/category boundaries.
- **PERSON:** 54 disagreements, generally involving individual-person or person-type boundaries.
- **IDENTITY:** 38 disagreements, involving roles, occupations, statuses, titles, kinship, or recognized social identities.
- **HUMAN:** only 4 disagreements; the primary semantic field was stable.
- **UNCERTAIN:** one disagreement and too few positives for κ to be informative.

The pattern was interpretable semantic-boundary disagreement rather than broad random inconsistency.

## 6. Historical methodological decision

The blinded review concluded that the frozen AI annotations were adequate for an **explicitly exploratory** unblinding because:

1. the primary HUMAN label was exceptionally stable;
2. the stricter full-vector agreement was above 80% with a reasonably narrow interval;
3. disagreements were concentrated in known secondary-category boundaries;
4. both original passes could be retained and analyzed separately;
5. no group identity or outcome had been used to reach the decision.

The review did not authorize replacing the preregistered human analysis, selecting the more favorable AI pass, silently merging the passes, changing frozen definitions, or starting Experiment 001B.

## 7. Required conditions carried into unblinding

- analyze AI-A and AI-B separately before comparison;
- retain all frozen items and original labels;
- report denominators, counts, rates, effect sizes, confidence intervals, and tests;
- retain evidence-family robustness analysis;
- treat PEOPLE, IDENTITY, HUMAN-ATTRIBUTE, PERSON, and UNCERTAIN only as labeled secondary sensitivities;
- label every conclusion `Exploratory AI Result`;
- retain `Preregistered Human Annotation: Pending`;
- keep the restricted key and row-level identity mapping private.

## 8. Subsequent status

The separately authorized exploratory unblinding was later completed. Its public conclusion is **Exploratory AI Result — Tentatively Supported**. This subsequent result does not retrospectively alter the blind-state diagnostics or convert them into evidence for the preregistered human conclusion.

**Preregistered Human Annotation: Pending.**

**Experiment 001B started: No.**
