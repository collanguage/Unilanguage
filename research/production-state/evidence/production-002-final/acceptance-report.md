# Production Batch 002 — Final Freeze and Acceptance

Seven records accepted into the active Production Candidate Corpus; CUN archived. No schema expansion or candidate pages. Original 42 legacy entries and all prior Batch001 records are unchanged.

|Entry|Featured|Final Freeze status|
|---|---|---|
|DOWN|下 xià; Structural-Semantic Candidate; Phonetic Low|Ready for canonical candidate entry|
|PRESSURE|压力 yālì; Structural-Semantic Candidate; Phonetic Low|Ready for canonical candidate entry|
|ONE|Pending|Ready with Featured Pending|
|CONVENTION|Pending|Ready with Featured Pending|
|MIDDLE|Pending|Ready with Featured Pending|
|ILLUMINATE|Pending|Ready with Featured Pending|
|LOVE|Pending|Ready with Featured Pending|
|CUN|Pending|Archive / Provenance unresolved|

All active outer records remain review_status=candidate and publication_status=not_published. Editorial acceptance is independent from Reviewed/Published/evidence status. All cross-language Historical Relation remains Not claimed.

## CUN targeted verification

The original-linked repository record contains only `cun，存。`, in `data/batches/legacy-website-import-batch-001.v1.json#/research_queue/0`, introduced in commit30bdc93 dated2026-09-01. Its linked URL slug decodes to `村，存`. This is neither enough to identify a foreign word nor enough to diagnose a spelling/transcription error. The source page was inaccessible through the web tool and returned HTTP406 to a direct request. Language, lexical identity and source pronunciation therefore remain unresolved. No source was inferred from Chinese存cún, no new candidate search was run, and no history was invented. Raw wording, link, import version and uncertainty are preserved in the archive record.

## Corpus / compatibility

42 Legacy +14 active Production Candidates +2 archived observations (GAN,CUN). The original batch-envelope IDs remain stable corpus identifiers; each new record points to its own Batch002 freeze. The candidate lookup adapter accepts the two existing retained-status spellings. Pending remains queryable; archive and rejected candidates do not appear as active candidate hits. Legacy Mapper/search stays on the unchanged42-entry dataset. No new pages.

## Validation

271/271 regression tests passed. Schema, language dataset, production structural/editorial, second-pipeline and final-structural validators passed. Nine Batch002 mutation cases reject false source identification, evidence/Featured/phonetic upgrades, publication/review promotion and active/archive leakage. Publication build passed for394 tracked files. Protected content hashes were checked; prior Batch001 records compare equal as JSON objects.

## Stability

Batch001 and Batch002 each accepted7 active +1 archive. The matching intake counts are descriptive, not a quality score. The useful stability evidence is that Pending remains valid, source identity can block and archive an item, and physical/abstract senses remain separate. Keep Batch003 at8; do not expand to10–15 while paper evidence/access constraints remain. Batch003 was not started.

## Git

Commit: cc45d5541b2c9ab76564f5a5d353ea3ce44cefd7
Safe non-force push to origin/main verified. No manual deployment trigger; existing push-driven publication may update the data files. See live-check.json for final observed live status. No SHA-linked Netlify revision was available from GitHub status at initial check.

Final live check: active14, archive2 and Batch002 freeze8 endpoints all returned HTTP200; parsed JSON exactly matched committed data. This verifies live data content, not an independently supplied Netlify deployment revision ID.
