# {{EXPERIMENT_ID}} publication-boundary record

- Artifact version: `v1.0`
- Boundary owner: {{ROLE}}
- Public-release reviewer: {{ROLE}}
- Review date (UTC): {{TIMESTAMP}}

## Public Research Record — eligible after release review

| Artifact | Version/hash | Redaction or aggregation | Release status |
|---|---|---|---|
| Preregistration and OPS | {{REF}} | {{NONE_OR_DETAIL}} | {{APPROVED_OR_WITHHELD}} |
| Public-safe manifest/checksums | {{REF}} | Excludes private paths and secret values | {{STATUS}} |
| Blinded protocol/review | {{REF}} | {{DETAIL}} | {{STATUS}} |
| Aggregate analysis/code/report | {{REF}} | {{DETAIL}} | {{STATUS}} |
| Final classification | {{REF}} | {{DETAIL}} | {{STATUS}} |

## Private Research Package — never publicly deployed

| Restricted class | Custodian/private reference | Reason | Retention/access rule |
|---|---|---|---|
| Raw or licensed restricted data | {{PRIVATE_ID}} | {{REASON}} | {{RULE}} |
| Completed restricted item-level annotations | {{PRIVATE_ID}} | {{REASON}} | {{RULE}} |
| A/B group-identity mapping | {{PRIVATE_ID}} | Reveals blind identity | {{RULE}} |
| Analysis key, seed if restricted, or credentials | {{PRIVATE_ID}} | Enables reveal or unauthorized access | {{RULE}} |
| Re-identification-risk material | {{PRIVATE_ID}} | Privacy/safety | {{RULE}} |

## Mandatory deployment exclusions

- No private/restricted analysis key.
- No target/control or A/B group-identity mapping.
- No credentials, tokens or private storage paths that expose restricted material.
- No raw restricted data or restricted item-level records.
- No checksum manifest that leaks secret values through filenames or metadata.

## Release checks

- [ ] Every candidate public file is listed and hashed.
- [ ] Content and filenames were scanned for analysis keys and identity mappings.
- [ ] Public links resolve only to public-safe artifacts.
- [ ] A reviewer independent of artifact generation approved the release set.
- [ ] The deployed bytes match the approved public-safe checksums.

## Decision

- Public-safe manifest SHA-256: {{HASH}}
- Decision: {{APPROVE_RELEASE_OR_REJECT}}
- Reviewer / authority / time: {{DETAIL}}

A public-safe reconstruction may describe that authorized unblinding occurred, but it must not publish the restricted mapping or key.
