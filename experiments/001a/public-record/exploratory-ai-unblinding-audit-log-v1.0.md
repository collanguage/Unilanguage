# Experiment 001A Round 2 — Exploratory AI Unblinding v1.0 Audit Log

**Record ID:** `UNI-EXP-001A-R2-AIUNBLIND-AUDIT-1.0`

**Stage:** `Exploratory AI Unblinding v1.0`

**Evidentiary label:** `Exploratory AI Result`

**Preregistered Human Annotation:** `Pending`

**Experiment 001B started:** `No`

## Authorization and first restricted access

- **Authorization basis:** the user's 2026-08-24 request in the current Codex task explicitly authorized the first exploratory AI unblinding, access to the restricted analysis key, restoration of M versus Control identities, separate AI-A/AI-B analyses, protocol-justified sensitivity analyses, public-safe reporting, and updating the Experiment 001A public research record.
- **Authorization received before restricted access:** `Yes`.
- **Restricted artifact:** `restricted/analysis-key.csv` in the frozen private research package.
- **First-access audit checkpoint (UTC):** `2026-08-24T23:14:01.169Z`.
- **Access purpose:** verify the frozen key structure and join `blind_id` to the frozen AI-A and AI-B labels for the authorized exploratory analysis.
- **Disclosure boundary:** the raw key, row-level identity mapping, surface-form/group joins, and reconstructive data remain private and are excluded from public artifacts.

The first structural read occurred during this authorized turn immediately before the timestamped checkpoint above. The tool environment did not expose a separate per-file-open timestamp, so the checkpoint is the earliest explicit timestamp retained in this audit record; this limitation is recorded rather than back-dating a false precision.

## Baseline integrity gate

At `2026-08-24T23:14:01.169Z`, every artifact listed in the frozen Round 2 manifest and every AI-A/AI-B artifact listed in `UNI-EXP-001A-R2-AIANN-FREEZE-1.0` was re-hashed with SHA-256.

- Frozen Round 2 artifacts checked: `14`
- Frozen AI annotation artifacts checked: `5`
- Hash mismatches: `0`
- Frozen preregistration edited: `No`
- Frozen OPS edited: `No`
- Frozen AI-A labels/workbook edited: `No`
- Frozen AI-B labels/workbook edited: `No`
- Existing checksum or freeze-manifest files edited: `No`

Key frozen fingerprints used by the analysis:

- restricted analysis key: `74bfdbfd1ff8fa564520a75db35c92702ea6385209c65a2b80f073d110412ca2`
- AI-A machine-readable labels: `ccecdd2716bbf3f3180ff1260f2fe9d59161639271753b0cad845b1512bb9c13`
- AI-B machine-readable labels: `af4644ad15215dfea7e929c303438adee68d4d5091906020b0bcaa0e3169f6a4`
- frozen sample registry: `74bfdbfd1ff8fa564520a75db35c92702ea6385209c65a2b80f073d110412ca2`

## Planned public-release gate

Before any public commit or deployment, the public artifact set must be scanned for:

- raw `blind_id` values;
- surface-form/group mappings;
- `analysis-key.csv` or its rows;
- selection/matching hashes or other identity-recovery fields;
- AI-A/AI-B row-level annotations;
- reusable blind-breaking mappings that could compromise later human annotation.

Only aggregate statistics, methods, code that requires separately held private inputs, integrity fingerprints, and appropriately labeled conclusions may be public.
