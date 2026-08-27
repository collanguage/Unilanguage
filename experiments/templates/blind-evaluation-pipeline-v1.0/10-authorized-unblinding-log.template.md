# {{EXPERIMENT_ID}} authorized unblinding log

> PRIVATE RESEARCH PACKAGE unless and until a public-safe reconstruction passes release review. Do not place analysis keys or group-identity mappings in the public repository.

- Artifact version: `v1.0`
- Gate: `4 — Authorized Unblinding`
- Decision ID: {{ID}}
- Requested by / at (UTC): {{IDENTITY_AND_TIMESTAMP}}
- Authorized by / authority basis: {{IDENTITY_AND_ROLE}}
- Authorized at (UTC): {{TIMESTAMP}}
- Purpose and scope: {{EXACT_SCOPE}}

## Frozen prerequisites

| Gate | Approval artifact | SHA-256 | Status |
|---|---|---|---|
| 1 | {{REF}} | {{HASH}} | Approved |
| 2 | {{REF}} | {{HASH}} | Approved |
| 3 | {{REF}} | {{HASH}} | Approved |

## Restricted reveal

- Identity-map private reference: {{PRIVATE_ID_NOT_PUBLIC_PATH}}
- Identity-map SHA-256: {{HASH}}
- Analysis-key private reference: {{PRIVATE_ID_NOT_PUBLIC_PATH}}
- Analysis-key SHA-256: {{HASH}}
- Persons/processes receiving access: {{LIST}}
- Access time (UTC): {{TIMESTAMP}}

## Integrity binding

The reveal applies only to the frozen inputs named above. If any prerequisite hash differs, unblinding is denied and the workflow returns to the relevant gate.

## Public-safe reconstruction

{{Later record only decision metadata, prerequisite hashes and scope. Never copy the mapping, key, credentials or restricted item-level data into a public artifact.}}
