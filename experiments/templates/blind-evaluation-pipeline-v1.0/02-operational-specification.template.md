# {{EXPERIMENT_ID}} operational specification (OPS)

- Artifact version: `v1.0`
- Status: `DRAFT`
- Linked preregistration version/hash: {{VERSION_AND_SHA256}}

## Inputs and allowed sources

{{Exact files, fields, source versions, acquisition date and licensing/access limits.}}

## Unit construction

{{Deterministic steps from source data to one analysis/annotation unit.}}

## Inclusion, exclusion and deduplication

{{Executable or unambiguous rules; identify evidence-family/cognate handling where relevant.}}

## Sampling and randomization procedure

{{Algorithm, software/runtime version, ordering, sample size and seed-record reference.}}

## Blind-label construction

{{How A/B or neutral identifiers are assigned and how all target/control hints are removed.}}

## Codebook and adjudication

{{Category definitions, edge cases, prohibited inferences, missing/uncertain labels and resolution policy.}}

## Annotation streams

| Stream ID | Actor type | Preregistered role | Protocol/version | May affect final classification? |
|---|---|---|---|---|
| `HUMAN-PRIMARY` | Human | {{PRIMARY_OR_NONE}} | {{REF}} | {{YES_WITH_RULE_OR_NO}} |
| `AI-EXPLORATORY` | AI | Exploratory | {{REF}} | No, unless explicitly authorized in frozen preregistration |

## Quality-control procedure

{{Completeness, schema, duplication, agreement, leakage and protocol-deviation checks.}}

## Analysis procedure

{{Exact inputs, commands/steps, expected outputs, environment and deterministic checks.}}

## Failure and halt behavior

At each gate the runner must write `AWAITING_AUTHORIZATION` and halt after machine checks. Define recovery for missing files, checksum mismatch, blind leakage, failed quality threshold and authorization denial.

## Freeze authorization

{{Same exact-manifest approval fields as the preregistration.}}
