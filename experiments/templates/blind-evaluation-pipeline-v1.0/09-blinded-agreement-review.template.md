# {{EXPERIMENT_ID}} blinded agreement and quality review

- Artifact version: `v1.0`
- Gate: `3 — Blinded Quality Review`
- Reviewer: {{NAME_OR_STABLE_ID}}
- Review started/completed (UTC): {{TIMESTAMPS}}
- Gate 2 freeze manifest SHA-256: {{HASH}}

## Blinding attestation

I attest that target/control identity, A/B identity mapping and analysis key were unavailable throughout this review. Any suspected leakage is documented below and blocks Gate 4 pending resolution.

## Inputs

{{List exact frozen annotation streams and hashes without revealing group identity.}}

## Completeness and protocol adherence

{{Missingness, duplicates, invalid labels, timing, protocol deviations and stream provenance.}}

## Agreement results

| Measure | Frozen threshold | Observed value | Pass/fail | Notes |
|---|---:|---:|---|---|
| {{MEASURE}} | {{THRESHOLD}} | {{VALUE}} | {{RESULT}} | {{NOTES}} |

## Disagreement review

{{Describe patterns and preregistered resolution without using or inferring group identity.}}

## Separate annotation streams

{{Report human-human, AI-AI or human-AI agreement separately as authorized. Never merge preregistered human and exploratory AI streams silently.}}

## Blind quality decision

Choose exactly one:

- [ ] `AUTHORIZE_GATE_4`
- [ ] `RETURN_TO_GATE_2` — reason and allowed corrective action: {{DETAIL}}
- [ ] `TERMINATE` — reason: {{DETAIL}}

- Authorized by / authority basis: {{IDENTITY_AND_ROLE}}
- Decision time (UTC): {{TIMESTAMP}}
- This authorization is bound to Gate 2 manifest SHA-256: {{HASH}}

This decision does not reveal identities and does not itself perform unblinding.
