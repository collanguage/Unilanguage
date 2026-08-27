# {{EXPERIMENT_ID}} blind annotation protocol

- Protocol version: `v1.0`
- Annotation stream ID: {{HUMAN_PRIMARY_OR_AI_EXPLORATORY_OR_OTHER}}
- Actor type and provenance: {{HUMAN_RECRUITMENT_OR_MODEL_VERSION_AND_CONFIGURATION}}
- Role: {{PREREGISTERED_PRIMARY_OR_EXPLORATORY}}
- Blind condition: group identities and analysis key unavailable

## Instructions

{{Define the task using only information permitted by the frozen OPS.}}

## Labels and codebook

| Label | Definition | Include | Exclude | Uncertain handling |
|---|---|---|---|---|
| {{LABEL}} | {{DEFINITION}} | {{RULE}} | {{RULE}} | {{RULE}} |

## Independence and contamination controls

{{State whether annotators may communicate, what tools/sources are allowed, and how accidental identity clues are reported.}}

## A/B package handling

- Never attempt to infer target/control identity.
- Do not open any identity map, analysis key or unblinding material.
- Record start/end timestamps and protocol deviations.
- Return completed files to the private custodian for Gate 2 freezing.

## Stream-separation attestation

This stream is {{PREREGISTERED_OR_EXPLORATORY}}. It must remain separately identifiable in manifests, agreement review, analysis and final reporting. Exploratory AI output is not the preregistered human annotation unless Gate 1 explicitly says otherwise.
