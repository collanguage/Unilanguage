# {{EXPERIMENT_ID}} preregistration

- Artifact version: `v1.0`
- Pipeline version: `1.0`
- Status: `DRAFT` (valid values: `DRAFT`, `FROZEN`)
- Author(s): {{NAMES_OR_STABLE_IDS}}
- Created at (UTC): {{TIMESTAMP}}
- Frozen at (UTC): {{TIMESTAMP_OR_NULL}}
- SHA-256 after freeze: {{HASH_OR_NULL}}

## 1. Source observation and provenance

{{Identify the Language Book observation or registered hypothesis, its origin/author/date, and distinguish it from later external evidence.}}

## 2. Research question

{{A single answerable question.}}

## 3. Confirmatory hypotheses and null hypotheses

{{State directional or non-directional hypotheses and the null before outcome inspection.}}

## 4. Units, population and scope

{{Define unit of analysis, target population, languages, time range and exclusions.}}

## 5. Sampling and controls

{{Source frame, sample size, control construction, matching, deduplication and stopping rule.}}

## 6. Variables and annotation categories

{{Operational variables; categories must point to the frozen OPS and codebook.}}

## 7. Blinding design

{{What A/B hides, who remains blind, where the mapping is held, and how leakage is handled.}}

## 8. Annotation stream authorized for the primary test

- Preregistered human annotation required: {{YES_OR_NO}}
- AI annotation authorized for the primary test: {{YES_OR_NO}}
- Exploratory AI annotation permitted separately: {{YES_OR_NO}}
- Prohibited substitution/pooling: {{STATE_EXPLICIT_RULE}}

## 9. Randomization and deterministic seed policy

{{Algorithm/version, seed generation, custody, disclosure timing and reproducibility rule.}}

## 10. Missing data, disagreement and deviations

{{Rules fixed before annotation and unblinding.}}

## 11. Statistical analysis

{{Estimand, test/model, effect size, 95% CI, multiplicity, sensitivity analyses and software/version.}}

## 12. Decision rule

Define exact thresholds and required conditions for:

- `Supported`: {{RULE}}
- `Not Supported`: {{RULE}}
- `Inconclusive`: {{RULE}}

## 13. Quality thresholds and Gate 3 actions

{{Agreement/reliability thresholds and whether failure means return to Gate 2, termination or Inconclusive.}}

## 14. Public/private boundary

{{Public record plan, restricted inputs, analysis-key and identity-map controls, retention and release-review authority.}}

## 15. Amendments and termination

{{Append-only amendment format, permissible reasons and rule that no frozen artifact is overwritten.}}

## Gate 1 freeze authorization

- Exact prerequisite manifest SHA-256: {{HASH}}
- Machine checks passed at (UTC): {{TIMESTAMP}}
- Authorized by / authority basis: {{IDENTITY_AND_ROLE}}
- Decision: {{FREEZE_OR_REJECT}}
- Signed at (UTC): {{TIMESTAMP}}

No downstream gate is authorized by this signature.
