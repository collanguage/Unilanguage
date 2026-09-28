# Production Batch 004 acceptance and Scheduler v0.1 production freeze

Jinkai Liu approved acceptance on 2026-09-27. Intake approval does not promote Candidate to Reviewed, Published or Proven.

## Accepted outcome

- Active: ABASHED, HORROR, HORRID, MEANING (Featured Pending); UP (上 shàng), INSIDE (内 nèi), both Structural-Semantic Candidates with Phonetic Fit Low.
- Control / Negative: BOUND and LAW, Featured Pending. Research controls are neither Active nor Archive. BOUND retains four separately sourced identities.
- Totals: 42 unchanged Legacy entries; 20 Active Production Candidates; 2 Archives; 2 Batch 004 Control records. Batch 003 proposals remain unaccepted.
- All eight imported origins remain unknown. The AI research record is not original authorship. Registry remains 66 observations (52 unknown, 14 AI discovery); no new human/AI attribution is inferred from this acceptance.

The approved research is stored in `data/review/production-004-freeze.v0.1.json`. Active records use the existing Candidate Corpus envelope and reference that freeze; controls reside in `research/controls/production-004.v0.1.json`. No entry schema extension and no new pages.

## Default selector

`research/scheduler/production-policy.v0.1.json` freezes Scheduler v0.1 as Default Production Batch Selector, size 8. Existing human/contributor priority, AI slots, controls, backfill, source identity and holdout rules remain in force. There is no unattended background service or automatic research dispatch.

Original Note → preserved provenance → explicit AI exposure/holdout decision → queue remains the human entry point. Unknown sources cannot fill human quotas. Scheduler cannot approve Featured, assign authorship, release holdouts, mark Reviewed/Published, or bypass Jinkai Liu Review.

The completion ledger excludes all eight processed objects, including non-active controls, from subsequent selection. The original Batch 004 dry-run input/audit is unchanged and reproducible. New snapshots use a current queue identity instead of masquerading as Batch 004. No next batch was selected or researched by this acceptance.

## Directory resolution and compatibility

Scheduler input/output relative paths, audit defaults and snapshot preparation resolve against the repository root derived from the script URL. Absolute output paths remain supported. `node scripts/run-tests.mjs` launches the full test suite with the repository cwd even when invoked elsewhere. New regression tests invoke CLIs from temporary unrelated directories.

The Registry migration validator still checks the exact original 14-record intake prefix against its original hash, and still verifies every original text/reference. Approved appended records are checked independently against their acceptance freeze by the Production and Batch 004 evidence/editorial gates. This permits append-only corpus growth without rewriting historical Registry evidence.

Candidate search recognizes the six additions as unpublished candidates; controls/archives do not enter active lookup. Legacy lookup remains unchanged.

## Family reuse and queue

Four reuse edges: ABASH→ABASHED, horrēre research→HORROR, horrēre research→HORRID, CONTAINMENT scope boundary→INSIDE. These reuse two historical bundles and one structural-boundary bundle; conclusions and grades remain independent. No measured time-saving percentage is claimed.

Future audits record historical_research_reused, sources_reused, new_research_avoided, conclusion_inheritance_blocked. A reused reference does not remove the obligation to verify a new modern sense.

Current sanitized queue accounting: 14 eligible unselected objects, 19 pending identity/provenance, hence 33 outstanding research/identity objects. This is a backlog count, not a newly selected batch. Existing benchmark/holdout restrictions, processed records and archives remain excluded.

## Publication boundary

No reader-facing HTML/JS was changed and no deployment is required. Commit/push are authorized after validation; no explicit deployment trigger, no next batch.
