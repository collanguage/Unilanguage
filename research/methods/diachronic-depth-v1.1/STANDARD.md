# Diachronic Depth Standard v1.1

Method freeze authorized by Jinkai Liu, 2026-09-29. Default research depth for the Lexical–Diachronic Pipeline. Audit/upgrade ordering and validator implementation proposal remain subject to review. No automatic batch dispatch or corpus changes.

**A Featured Mapping is a reader-facing summary, not the research object.**

Default research sequence:

**Source Diachrony → Stage Meaning → Chinese Diachrony → Stage-to-Stage Mapping → Featured summary (optional) → Editorial Freeze Proposal → Jinkai Liu Review.**

## 1. Required research content

For every stage comparison record source form, language, period/basis, exact sense/construction; Chinese form, period/layer, documented meaning; Semantic Fit, Phonetic Fit, Structural Fit separately; supporting evidence with locator/scope/status; counterevidence; Historical Relation (default Not claimed).

Use stable source-stage and Chinese-unit labels within the research record. A Chinese unit is form + sense + layer, not a character without context. A modern gloss of an ancient source stage is not Chinese historical evidence. Do not require mechanically matching dates on the two sides.

Distinguish four relationships explicitly:

| Relationship | Required basis | Forbidden inference |
|---|---|---|
| attested coexistence | Evidence that senses are attested in the stated period | Turning their list order into A→B→C |
| documented semantic development | Evidence for the transition, direction, and temporal scope; citations for endpoints alone are insufficient | Inferring causation or first occurrence from earliest retrieved example |
| editorial structural comparison | Named units, scope, rationale, limits | Presenting conceptual order as historical chronology |
| unknown chronology | Explicit Pending and what is missing | Inserting a plausible transition to complete a diagram |

Reconstruction, lexicographic report, directly inspected text and author hypothesis remain different evidence identities. Meaning nodes and development edges receive separate assessments. No forced branch order.

## 2. Chinese diachrony check

For each serious candidate, check availability of Modern Mandarin, classical/historical senses, Middle Chinese, Old Chinese, character history/phonetic series, and dialect evidence where relevant. Record each as supported / lead / Pending / not applicable with reason. This is a coverage check, not an instruction to find a positive result for every layer.

Mainland-first remains mandatory. A dictionary aggregator is not proof that a named Mainland print edition was inspected. Record original work period separately from edition/publication date. Historical pronunciations need named systems; reconstructed forms retain asterisks, model/version and scope. MC transcription is not automatically IPA. A modern character graph cannot establish ancient word origin. Dialect pronunciation/meaning must identify locality and construction. Missing reliable evidence stays visible as Pending.

## 3. Many-to-many mapping; optional summary

One source stage may have several Chinese comparisons. A Chinese form may recur with separately documented senses. A stage may remain None found / Pending / Not selected; none requires a filler character.

Select Featured only from a scoped comparison, based on semantic research value, structural value, phonetic interest and explanatory value (not a combined evidence score). It need not cover the whole source history. Reader summary must identify its sense/stage and visible limitations. Low Phonetic Fit remains Low even when semantic value is high. Pending Featured does not block a valid research result.

## 4. CONVENIR calibration

The approved [CONVENIR report](../../calibration/convenir-depth-v1/REPORT.md) is the calibration example; its original text is preserved. Approval is recorded separately in `convenir-calibration.json`.

Retain 合 hé as Limited Structural-Semantic Candidate, suitability/fitting-together summary only, Phonetic Fit Low, Historical Relation Not claimed. Latin gathering and fitting senses are not a demonstrated serial chain. 聚／会／合 compare gathering; 合／宜 compare fitting; agreement and acknowledgement require separate units. No evidence for making 合 cover acknowledgement. Chinese path-direction and some lexicographic/palaeographic details remain Pending. Method approval does not turn the partially documented pathway into Established.

## 5. Scope of the second pipeline

Structural/Cultural/Literary/Protocol objects keep their own primary pipeline. They need clear Standard Meaning, comparison and evidence separation; full lexical diachrony is not required. Apply this standard only to any actual lexical-historical claims they make. D4 is a scope classification, not a lower quality grade or blanket exemption from evidence.

## 6. Depth audit rubric

One primary classification per accepted record; do not change candidate/evidence/publication status.

- D1: source and Chinese historical units, supporting evidence and scoped comparisons sufficient for the claimed comparison. An unknown, unclaimed transition may stay Pending; global history completeness is not required.
- D2: existing source history supports the frozen scoped comparison, but Chinese diachrony is shallow. Source-sufficient here does not mean every first attestation/phonetic detail verified. Record residual source limitations.
- D3: only modern mapping established; source-stage reconstruction missing for the historical claim. Prose history counts as history; an absent array alone is not D3.
- D4: structural/cultural/literary object; full lexical diachrony not primary. Any lexical subclaim remains subject to targeted review.
- D5: existing evidence cannot support an assessable unit/comparison; keep Pending. A paper-page gap or Featured Pending alone does not imply D5.

Apply D4 scope first for genuinely second-pipeline records; for lexical records assess unit viability (D5), source-stage availability (D3), then bilateral depth (D1/D2). This audit reads accepted records only; it neither searches for new evidence nor retroactively certifies all source claims.

## 7. Upgrade priority

Use visible reasons, no aggregate score: scoped Featured with shallow Chinese layer; calibration/protocol value; recorded semantic shift; authenticated Human Original; hypothesis-testing value. Unknown provenance must not be promoted to Human Original. Within a priority group prefer an interpretable limited scope and disclose tie-breaking. D4 Featured alone does not require full diachrony.

The upgrade queue is separate from eligible unprocessed research queue; it is not a Scheduler input or authorization to run eight upgrades. Existing accepted objects must not be redispatched as new objects.

## 8. Production Worker v1.1 — minimal instruction overlay

Keep identity/holdout gate, two-pipeline routing, provenance preservation, family reuse and stop rules unchanged. Before generating a lexical Freeze Proposal:

1. Freeze source sense/construction nodes and classify each proposed relation using the four categories above.
2. Generate bounded candidates per meaningful stage; stop with Pending when appropriate. Do not optimize toward a single attractive character.
3. Complete the six-layer Chinese availability check for serious candidates; distinguish unavailable evidence from non-applicable layers.
4. Assemble bilateral comparisons with independent fits, evidence and counterevidence; label unsupported edges rather than inventing them.
5. Select optional Featured summary only after this record exists; reference its scoped unit and visible Pending.
6. Submit proposal to Jinkai Liu. Never change original observations, accepted Featured/Evidence, Reviewed/Published, benchmark exposure or holdout eligibility automatically.

This document is the approved method overlay, not an executed new Worker run. No new model, pipeline or database schema.

## 9. Pilot 001 mechanical implementation

Featured Mapping is summary, not research object. The Worker must attempt Chinese diachrony for each serious lexical candidate; unavailable layers are explicit Pending. Use the research-side contract demonstrated in `../../depth-upgrades/pilot-001/proposal.json`. Run `node scripts/validate-diachronic-depth.mjs` for this pilot before review. Its pure `validateDepth` function can check subsequent compatible research proposals; this does not auto-apply a new schema to accepted entries.

The validator always requires editorial/evidence review. It checks declarations and references, not historical truth. A newly confirmed chronology needs an explicit evidence-review reference. Production still stops at Jinkai Liu Review; the pilot cannot modify existing Featured, provenance or evidence grades. SOURCE/PRESSURE retain D4 and only their lexical subclaims are examined.

## 10. Production integration approval — 2026-09-30

The approved method is now the default task contract: see WORKER.md and
scripts/production-worker.mjs. Scheduler selection policy stays v0.1; its task
method is v1.1. The previous method-only/pilot-only implementation descriptions
above are historical context. New lexical research follows the complete bilateral
flow; no new batch has been run by installing it.

Top-8 approval is recorded separately in ../../depth-upgrades/pilot-001/acceptance.json.
D1=0/D2=8 remains; PRESSURE summary is narrowed in that overlay only. Original
proposal/calibration and accepted Active records are preserved. No D1 quota.
