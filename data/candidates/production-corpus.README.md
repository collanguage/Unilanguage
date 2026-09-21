# Production Candidate Corpus v0.1

Accepted by Jinkai Liu's Batch 001 Acceptance instruction. Seven active candidate records and one separate archived observation. This is candidate intake approval, not lexical review, publication approval or proof.

`production-corpus.v0.1.json` and `production-archive.v0.1.json` reuse the existing import-template batch envelope. Records reuse candidate-area identity/status/provenance fields and `baseline_record` to preserve the full frozen research payload. No legacy schema or canonical entry is extended. Package F's fixed 19-item package and lexical-only mapping enum are deliberately not relabeled or relaxed.

Each record keeps independent `review_status`, `publication_status`, `featured_mapping_status`, and frozen evidence/phonetic/semantic/structural fields inside `baseline_record`. The previous final-freeze `status` inside that payload describes eligibility for intake; it does not override the outer candidate status. MOVE→动 and CHANGE→易 remain Structural-Semantic Candidates with Low phonetic fit. Five active records have Featured Pending. GAN is archive-only; its author raw text and distinct editorial expansion remain intact.

The signed-off freeze is stored at `data/review/production-001-freeze.v0.1.json`. Approval provenance is the user's explicit Batch 001 Acceptance instruction; its recorded file timestamp is ingestion time, not a fabricated signature or authorship timestamp.

## Product boundary

The existing `loadDataset`, `lookup`, Mapper and Dictionary continue to use only `data/language-book.v1.0.json` (42 entries). The separate `js/production-candidate-data.js` API (`UnilanguageCandidates`) offers explicit `loadCandidateCorpus(url)` and `lookupCandidates(corpus, query)` for candidate-aware consumers. Candidate queries return kind `candidate`, `entry: null`, and labeled `candidates`; they cannot be passed off as a legacy exact-entry hit. Archive never appears in normal candidate lookup. No automatic fetching, no candidate pages, no Published/Reviewed search-count change.

This release makes the dataset interface compatible; it does not redesign or enable new public Mapper UI. Current Netlify publication copies tracked repository files, so data may be downloadable after normal push-triggered deployment even though it is not surfaced as reviewed content. No separate page deployment is required or authorized by this acceptance.

## Acceptance rule

Research complete ≠ Featured required. Featured Pending is valid. Canonical Candidate ≠ Reviewed or Published. Candidate ≠ Evidence. Author Observation ≠ Evidence. Archive ≠ Delete. Historical Relation remains Not claimed. Production-exposed items remain Benchmark-ineligible after exposure; frozen benchmarks are not inputs to product queries.

Run `node scripts/validate-production-candidates.mjs` and `node --test tests/production-candidates.test.cjs`. Structural validation checks the import envelope/record fields; the independent editorial gate compares preserved payloads to the approved freeze and prevents silent status/evidence promotion. Passing tests does not authorize later publication or Batch 002.
