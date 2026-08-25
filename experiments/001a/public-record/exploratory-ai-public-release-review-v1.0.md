# Public-Release Review — Exploratory AI Unblinding v1.0

**Review status:** `PASS`

**Result label:** `Exploratory AI Result`

**Preregistered Human Annotation:** `Pending`

## Approved public content

- group denominators, counts, rates, and aggregate 2×2 statistics;
- risk differences, confidence intervals, Fisher p-values, and supplemental aggregate odds ratios;
- separate AI-A and AI-B aggregate analyses;
- aggregate evidence-family and frozen-category sensitivity analyses;
- methods, analysis code, input SHA-256 fingerprints, audit/decision records, and release checksums;
- a bilingual public-safe reconstruction of the pre-unblinding methodological review, explicitly identified as reconstructed after unblinding;
- the conclusion `Exploratory AI Result — Tentatively Supported` and the continuing human-pending status.

## Excluded from public release

- `restricted/analysis-key.csv` and all of its rows;
- any raw `blind_id` value or list;
- surface-form-to-group mappings;
- the private joined unblinded dataset;
- row-level AI-A or AI-B labels and workbooks;
- identity-recovery, matching, or selection fields that could reconstruct assignments;
- group-linked item or counterexample lists while human annotation remains pending.

## Automated and manual checks

The release directory and website public-record additions were checked for accidental restricted-file copies, raw blind identifiers matching `BLD-[0-9A-F]+`, row-level mapping fields in aggregate data, and links to private paths. The analysis code necessarily names expected private input columns and accepts private input paths, but it embeds no key row, item identity, blind identifier value, or mapping.

The public files are sufficient to understand the methods and reproduce the statistics when the separately held frozen private inputs are supplied. They do not make the reusable blind-breaking key public and therefore preserve the possibility of later preregistered human blind annotation.

The website release manifest and checksum file hash the LF-normalized bytes stored and deployed by Git. The separate local handoff manifest hashes the local deliverable bytes. This distinction prevents Windows working-tree line endings from producing false deployment-integrity mismatches.
