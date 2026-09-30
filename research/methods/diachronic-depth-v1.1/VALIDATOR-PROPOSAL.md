# Method validator proposal and schema compatibility

2026-09-29. Specification only; no validator code, database schema or accepted data changed. Existing validators have not suddenly gained these checks.

## Existing schema mapping

Inspected `data/language-book-entry.schema.v1.json`, especially `$defs/pilotModel`, `pilotStage`, `pilotMapping`, `pilotCandidate`, `pilotEvidence`, `pilotRelation`.

| v1.1 content | Existing location | Limitation / handling without schema change |
|---|---|---|
| Source form/language/period/sense/evidence | pilotStage form/language/period/meaning/source_refs/evidence_status | Dates may be null with period basis unknown; do not invent precision |
| Source comparison unit | pilotMapping.stage_ref; pilotCandidate.comparison.source_stage_ref/source_span/scope | Validate references agree; sense scope in freeze.meaning_note/excluded_senses |
| Chinese form/layer/period/sense/sounds | pilotCandidate.target | MC/OC are pronunciation layers, not new lexical_layer enum values |
| Chinese historical evidence | evidence.claim_scope=historical_chinese_sense; status/source_refs/locator/note | Modern online gloss alone does not satisfy historical support |
| Semantic / phonetic assessment | semantic_fit / phonetic_fit | Separate typed assessments already exist |
| Structural Fit | comparison-inference evidence.note and research record | No dedicated typed structural_fit in pilotCandidate; label it explicitly in existing research notes. Do not silently add a forbidden property |
| Counterevidence | confounds, evidence, decision_reason | Preserve negative records and claim scopes |
| Featured | display_selection.featured_candidate_ref | Reference must resolve to a candidate and its stage/sense; null allowed |
| Missing mapping | search.status pending/none_found; empty candidates; stage.mapping_selection=not_selected | Different states are not synonyms; retain explanatory stop_reason/selection_note |
| Four relationship categories | semantic_operation.type/description/status; historical_path/semantic_path/boundary | Existing relation_type enum has no coexistence value. Do not invent one or misuse sense_continuation. Record coexistence in descriptive research content without a directional edge |
| Chinese stage-to-stage transitions | research narrative and scoped candidate units | No dedicated typed Chinese graph/Chinese-stage foreign key. A complete independently validated graph is not provided by current schema |

Conclusion: **no schema extension needed for this method freeze or human-reviewed record**. Existing model plus research content can preserve the claims and uncertainty. It does not already provide fully typed bidirectional graph enforcement. Method validation must read the research record; claiming that JSON Schema proves chronology would be false. Production corpus baseline snapshots must not be rewritten to fit the template.

## Proposed checks and fixtures

| Rule | Reject / flag | Accept / preserve |
|---|---|---|
| V1 Featured scope | Candidate without resolvable source stage or stated sense; reject new proposal | Scoped Featured; Pending/null Featured with explanation |
| V2 Chinese history identity | Modern-only gloss labelled established historical Chinese stage | Modern gloss honestly labelled; historical layer Pending with missing-source reason |
| V3 Chronology | Coexisting senses converted to supported ordered development with no edge evidence | Unordered coexistence; documented development with supporting edge evidence; unknown chronology |
| V4 Historical relation | Semantic/structural resemblance promoted to common origin | Not claimed; actual new historical-relation claim requires separate expert review, not score inflation |
| V5 Phonetic independence | Sound fit copied from semantic fit or raised solely by consonant group hit | Independent rationale; Low despite High semantics; not_evaluated where necessary |
| V6 Pending visibility | Report summary suppresses material Chinese Pending or presents it as supported | Pending visible in Freeze summary and research detail |
| V7 Empty stage | Rejecting a valid historical stage only because no Chinese candidate exists | Pending/None found/Not selected with appropriate scope/reason |
| V8 Summary boundary | Featured treated as translation of every sense | Source stage/sense + exclusions explicitly displayed |
| V9 Second pipeline | Requiring full lexical history for a cultural/spatial structural object | D4 object with separately scoped lexical claims |

Minimum regression fixture plan: one invalid and one valid case per rule. Include CONVENIR coexistence→chronology mutation, acknowledgement→合 overextension, High semantic/Low phonetic, and historical stage with no mapping. These fixtures are proposed, not executed tests this turn.

Mechanical checks can validate required labels, references, contradictory statuses and missing rationale. They cannot prove that a quotation means what the Worker claims, that a transition is historical, or that a declared period is correct. Those require evidence/editorial review. Avoid regex tests that merely reject every arrow or every modern Chinese gloss.

Rollout: future/new lexical proposals after explicit implementation review; old accepted records receive depth-audit labels, not runtime rejection or automatic evidence downgrades. No automatic bulk backfill. Jinkai Liu Review Gate remains final.

## Implementation note — 2026-09-29

The approved mechanical subset is implemented in `scripts/validate-diachronic-depth.mjs`, scoped to `research/depth-upgrades/pilot-001/proposal.json`, with regression fixtures in `tests/diachronic-depth.test.cjs`. Earlier proposal text remains for traceability. This is not a canonical schema migration or automated historical adjudication.
