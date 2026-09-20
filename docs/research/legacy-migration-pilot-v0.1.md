# Legacy Migration Pilot v0.1

Approved scope: ABANDON, ABHOR, ABDICATE, ABERRANT only. Baseline: `5ed87f6b6d2aa99523368bd26aa4c7d43b8deb3b`. Jinkai Liu authorized preservation of the existing Featured choices and evidence states; this migration performs no new linguistic verification. ABEYANCE remains Featured Pending and is unchanged.

## Model and preservation

No JSON Schema extension. Reuse Model v0.1 historical_stages, mappings and display_selection; the existing optional featured_mapping.candidate_ref links editorial selection to a candidate. Each entry adds a read-only legacy_migration archive of the original diachronic object, including original component scores. The archive is Research history, not a second active model. Existing root-level modern/Featured assessments, consonant research, dialect evidence, controls, rejected hypotheses, author notes, references and literature remain unchanged.

Semantic Fit, Phonetic Fit and evidence are separate. New categorical fields summarize the existing scoped assessments; no numerical threshold, evidence upgrade or new empirical finding is introduced. Legacy C/D and totals remain in Research and retain their original caveats. Featured is editorial selection, not a grade. All new Chinese mappings record Historical Relation: Not claimed. Coarse source-language periods and modern Chinese reference periods are explicit; unknown dates remain null. Roman reference transcriptions retain editorial-inference status. Modern Mandarin 火 pronunciation is expressly not dialect audio.

## Four entries

|Entry|Original stages / legacy pair mappings|New source stages / Stage Mapping records / candidates|Reader cards|Featured retained|
|---|---|---|---|---|
|ABANDON|4 / 0 (two candidates lived in consonant_group_mapping)|4 / 2 / 3|1|放, whole-word release comparison; limited modern scope|
|ABHOR|3 / 1|3 / 2 / 3|2|火, dialectal/affective Candidate D / Low; independent dialect evidence Pending|
|ABDICATE|3 / 1|3 / 2 / 2|2|啼, historical dicāre Candidate D / Low|
|ABERRANT|3 / 1|3 / 3 / 4|2|讹, modern err sound comparison within historical error family; C / Low|

Counts distinguish a Stage Mapping container from its candidate pairs. No new historical stages were added.

- ABANDON: bandon authority and modern abandon/release remain separate. À bandon and abandonner explain disposal/release without mandatory Chinese searches (Not selected). 办 has indirect authority fit and unevaluated historical source sound; 柄/权柄 is a meaning control. 放 does not translate all abandon senses. The partial source sound record contains only the previously recorded medial /b/ observation; it is not a complete word transcription. The b-p-m-f hit is a hypothesis feature only.
- ABHOR: horrēre→骇 is separate from modern 恶 and Featured 火. Abhorrēre is retained for explanation, Not selected for a Chinese search. The 火 author report, standard anger uses and unverified dialect detestation sense remain separate. Exact locality/dialect pronunciation remains Pending.
- ABDICATE: dicāre→啼 is separate from modern 退. Abdicāre is explanatory, Not selected. 啼 is not DECLARE or an abdicate translation. 谛 and the rejected segmentation hypotheses remain in their original Research fields, not promoted into displayed candidates.
- ABERRANT: errāre has Pending selection, with 游/迷 as semantic controls. Modern err is a related-family branch used for 讹 sound comparison. Modern aberrant has its own branch through Latin aberrāre/aberrant-, summarized in the edge and original history. There is no err/error→aberrant ancestry edge. Error and French erreur remain secondary Research comparisons; their two-syllable pronunciations do not inherit err’s sound grade. Modern 偏 remains a scoped semantic candidate.

## Reader and compatibility

Each migrated page shows Standard Translation, one Featured selection with its existing boundary/confidence, and 1–2 Stage Mapping cards. Detailed original sections and the complete active model are closed Research/Evidence disclosures. Existing paragraph blocks, literary text, examples, source links and section anchors are preserved. Fragment links open the associated disclosure. Controls and rejected candidates do not gain stage cards.

Mapper uses its already-approved pilot header; only non-null Featured boundary rendering is added. Its controls/layout are not redesigned. ABEYANCE returns an empty Featured detail fragment and keeps its existing output. Search/browse keep original identities and aliases.

Historical regression suites use legacy-research-view: it restores only the archived diachronic object and removes the added reference/archive, then asserts exact equality to the approved baseline. It cannot silently mask other field changes. New active-model tests validate actual entries, reference integrity, non-selected/Pending states, editorial selection, branch separation, aliases, card counts and deterministic page generation. Unrelated data/pages and the schema are compared to the baseline. Browser checks cover desktop/mobile, original fragments, actual Mapper output and unchanged ABEYANCE/control outputs.

## Rollout judgment

The minimal model handles these four different cases without schema expansion or forced mappings. It is suitable for further bounded, reviewed migrations. It does not justify an unattended bulk migration: historical branches, polyphonic Chinese readings, dialect uncertainty and Featured scope still require editorial decisions. Keep original research archives during migration; define retention policy separately if storage duplication becomes material. Legacy Migration Work for other entries requires separate approval.

## Verification for this migration

165 Node tests pass. Full Draft 2020-12 validation passes for all 42 entries. Four migrated pages pass HTML5 parsing with zero errors; changed JavaScript passes syntax checks and git diff passes whitespace checks. All local links resolve across 25 critical pages. Headless Edge at 1366px and 390px verifies four pages, 1–2 cards, collapsed evidence and fragment opening, actual Mapper and dictionary routes, no overflow/runtime errors. ABEYANCE and four unrelated Mapper controls match the baseline. Product release manifest: 1.2.37; the unchanged schema retains dataset_version 1.2.23. No standalone lint configuration exists; syntax/HTML/schema/test checks are the applicable checks.
