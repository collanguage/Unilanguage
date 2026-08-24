# Experiment 001A — Round 2

## AI Blind Annotation Protocol v1.0

**Protocol ID:** `UNI-EXP-001A-R2-AIANN-1.0`

**Version:** `1.0`

**Date frozen:** `2026-08-24`

**Stage:** `Exploratory AI Annotation`

**Preregistered Human Annotation:** `Pending`

**Status:** `Frozen before AI-A/AI-B outputs were compared or unblinded`

## 1. Scope and evidentiary status

This protocol adds an exploratory AI annotation stage to Experiment 001A Round 2. It does not amend, supersede, reinterpret, or replace Frozen Preregistration v1.0 (31 sections). AI annotation is exploratory and is not the preregistered human blind annotation. It must not be reported as a substitute for that procedure.

All results produced here must be labeled **Exploratory AI Annotation**. **Preregistered Human Annotation: Pending** remains unchanged until the frozen human procedure is completed. This protocol does not authorize or begin Experiment 001B.

## 2. Frozen inputs

Two already-generated blind workbooks were used without changing item membership, identifiers, locked sense fields, definitions, or row order. Each contained the same frozen set of 1,020 blind items in a distinct pre-existing randomized order. The workbooks and row-level contents are not part of the public release.

## 3. Blinding and isolation

AI-A and AI-B operated in isolated model contexts or processes. Each pass received only its assigned blind workbook (or a faithful extraction of its visible cells), the frozen coding scheme and annotator instructions, and a neutral instruction to complete all rows.

Neither pass could inspect or receive:

- the M hypothesis;
- experimental/control assignment;
- the Pilot result;
- the restricted analysis key;
- the other pass's prompt, reasoning, partial output, or completed output; or
- any outcome analysis or group-comparison result.

The passes retained their distinct randomized orders and did not communicate or reconcile during initial coding.

## 4. Frozen coding scheme

The following rules applied to the supplied principal definition only. A value of `1` indicates that the condition holds; `0` indicates that it does not.

| Field | Frozen rule |
|---|---|
| `human` | The principal sense directly denotes, categorizes, identifies, describes, or names a human being or socially recognized class of humans. Association alone is insufficient. |
| `person` | The sense denotes an individual human or type of person. |
| `people` | The sense denotes humans collectively, a population, group, community, or human category. |
| `identity` | The sense denotes a human role, occupation, kinship relation, social status, title, or recognized identity category. |
| `human_attribute` | The sense denotes a human-associated characteristic, state, behavior, or property without itself denoting a human. This does not imply `human=1`. |
| `uncertain` | The supplied principal sense does not permit a confident rule-based decision. All other labels must still be completed. |

Mandatory boundaries:

- Objects humans use, activities that do not denote their performer, body parts, physiological processes/substances, and mental or emotional concepts do not become `human=1` by association.
- Metaphorical personification, proper names, places, companies, trademarks, and rare or historical human senses outside the locked principal sense were excluded.
- Hidden group fields were not edited or inferred; identifiers, lexical items, part of speech, sense fields, definitions, membership, and row order were not altered.
- Only `0` or `1` was permitted in all six label fields.

## 5. Independent-pass procedure

1. Verify 1,020 data rows and the expected columns.
2. Read the frozen instructions before coding.
3. Code every row using only the visible blind fields.
4. Preserve the assigned order and every non-label field.
5. Complete all six binary fields.
6. Save one versioned completed artifact for the assigned pass.
7. Validate row count, allowed values, unique identifiers, unchanged content, and unchanged order.
8. Record SHA-256 checksums before any cross-pass comparison.

## 6. Freeze gate

No unblinding, analysis-key access, assignment recovery, M/control comparison, or outcome-rate calculation was permitted until both completed artifacts were versioned, structurally validated, and frozen by checksum. After that gate, only blinded inter-AI agreement diagnostics were automatically authorized.

## 7. Blinded agreement diagnostics

AI-A and AI-B were joined by blind identifier, never by row position. A one-to-one match of all 1,020 identifiers was confirmed. For each frozen field, the public report includes paired item count, raw agreement, Cohen's kappa, a 2×2 cross-tabulation, and positive counts for each pass. It also reports exact six-label-vector agreement.

## 8. Stop rule

After the blinded agreement summary and frozen manifest were complete, work stopped. The restricted analysis key was not opened; no unblinding, M versus Control outcome rates, group outcome tests, or disagreement adjudication were performed. Frozen Preregistration v1.0 was not modified, and Experiment 001B was not started.

## 9. Publication boundary

The public record includes this protocol, aggregate blinded agreement diagnostics, and public-safe integrity records. Completed AI-A/AI-B workbooks and row-level labels, the restricted analysis key, assignment mappings, blind-breaking keys, and material capable of compromising future human blind annotation remain private.

## 10. Deviations

Any future departure must be recorded before unblinding, including artifact, reason, date, and whether it occurred before or after output freeze. A deviation cannot silently alter the frozen preregistration.
