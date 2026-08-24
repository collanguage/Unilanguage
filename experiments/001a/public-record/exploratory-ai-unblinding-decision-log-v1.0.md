# Decision Log — Exploratory AI Unblinding v1.0

**Status label required on every conclusion:** `Exploratory AI Result`

**Preregistered Human Annotation:** `Pending`

1. **Analyze AI-A and AI-B separately.** No pass selection, outcome-dependent pooling, adjudication, or silent consensus label is permitted.
2. **Primary outcome:** frozen binary `human` label at the lexeme/token level, comparing all 510 M items with all 510 pooled controls.
3. **Primary effect:** absolute risk difference `P(HUMAN|M) - P(HUMAN|Controls)` with a two-sided 95% Newcombe score interval. A sample odds ratio with a clearly labeled two-sided Wald interval may be reported as a supplemental measure when all four cells are nonzero; it is not the primary effect.
4. **Hypothesis test:** Fisher's exact test on the 2×2 table. Report both the directional one-sided p-value (`M > Controls`, matching the frozen directional hypothesis) and the two-sided p-value for transparent interpretation. No multiple-pass result selection is allowed.
5. **Preregistered/OPS robustness analysis:** evidence-family-level analysis using only the representative fixed before annotation (`family_representative`). This is Analysis B from frozen preregistration section 14 and OPS-EF-01.
6. **Protocol-justified semantic sensitivities:** repeat the same group comparison separately for `people`, `identity`, `human_attribute`, and `uncertain`; also report `person` for completeness because it is a frozen category and a documented disagreement boundary. These are secondary exploratory outcomes, not replacements for HUMAN.
7. **No post-unblinding exclusions.** All 1,020 items remain in the primary analysis. No control letter is dropped. No disagreement is adjudicated after identities are known.
8. **Public privacy boundary:** publish aggregates only. Do not publish the raw key, joined item-level data, group-linked counterexample lists, or row-level AI labels while preregistered human annotation remains pending.
9. **Conclusion vocabulary:** outcome interpretation may state that the exploratory AI passes support, fail to support, or contradict the directional M → HUMAN prediction. It may not confirm or reject the preregistered human hypothesis.
10. **Experiment boundary:** do not start Experiment 001B.

## Implementation clarification

The original entry for decision 3 incorrectly named a conditional odds-ratio interval that the dependency-free implementation did not calculate. This wording was corrected after the first analysis run. The implemented and reported primary risk difference, Newcombe interval, Fisher tests, inputs, and conclusions were not changed. Supplemental odds-ratio intervals are explicitly labeled Wald intervals and are not used for the decision.
