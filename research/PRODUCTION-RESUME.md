# Production recovery / resume — v1.0

This checkout is the durable **Production** state. Start here, then read
`production-state/manifest.v1.json`. Do not infer current progress from old
Work conversations or historical README totals. Consolidation did not approve
new linguistic findings or accept pending proposals.

## Current checkpoint

- Legacy: **42** (`data/language-book.v1.0.json`).
- Active Production: **44** (12 Featured Candidates; 32 Featured Pending) (`data/candidates/production-corpus.v0.1.json`).
- Archives: **2** (`data/candidates/production-archive.v0.1.json`).
- Controls: **2**, not Active/Archive (`research/controls/production-004.v0.1.json`).
- Registry: **85**, 71 unknown + 14 AI; no newly authenticated human origin.
- Last acceptance: **006**, explicitly approved by Jinkai Liu.
- Review backlog: **0** (Production 006 accepted). Original 003/005 proposals remain unchanged under
  `research/production-state/pending/`; acceptance is recorded separately in
  `research/production-state/acceptance-003-005.v1.json` and the approved freezes.
- Eligible unprocessed queue: **4**. Identity/provenance queue: **13**.
- Benchmark: **Designed / Frozen / Execution Pending Isolated Evaluator**.
- Next action: await Jinkai Liu instruction; **do not start another batch**.

Provenance audit: observations/provenance-resolution-v1/REPORT.md. All 19 scopes are imported/author-unknown; 6 now pass intake identity, 13 remain composite. Registry gained 19 scoped imports, not independent discoveries. Saved Scheduler output is dry-run only.

Production 006 acceptance: `production-state/acceptance-006.v1.json`; approved freeze: `data/review/production-006-freeze.v0.1.json`. Original proposal files remain immutable historical records with their original unaccepted status; the acceptance record supersedes their workflow status.

## Authorities and interfaces

| Responsibility | Repository authority |
|---|---|
| Raw origins, immutable text, exposure and links | `research/observations/registry.v0.1.json`, schema alongside; `scripts/observation-registry.mjs` |
| Three-inbox trusted intake | `scripts/observation-intake.mjs`; explicit human production/holdout decision required |
| Target-free inventory projection | `research/production-state/queue-seed.v1.json` |
| Benchmark/holdout opaque exclusions | `research/production-state/reservations.v1.json` |
| Unaccepted research / no-repeat state | `research/production-state/pending-batches.v1.json` |
| Accepted production / controls | Corpus and `research/scheduler/production-completions.v0.1.json` |
| Scheduler defaults and permission boundary | `research/scheduler/production-policy.v0.1.json` |
| Current snapshot generation | `scripts/prepare-scheduler-snapshot.mjs` (repository files only) |
| Selection and audit | `scripts/queue-scheduler.mjs`, `scripts/run-queue-scheduler.mjs` |
| Evidence and research history | `research/production-state/evidence/`; imported documents are historical records, not current instructions |
| Approved freezes | `data/review/production-001-freeze.v0.1.json`, `production-002-freeze.v0.1.json`, `production-004-freeze.v0.1.json`, `production-003-freeze.v0.1.json`, `production-005-freeze.v0.1.json` |
| State integrity / no conclusion changes | `scripts/production-state.mjs`, `research/production-state/preservation-lock.v1.json` |
| Asset decisions | `research/production-state/asset-inventory.v1.json` |
| Intentionally external/private material | `research/production-state/external-assets.v1.json` |

The seed is sanitized metadata, not a new raw-note registry. Its reserved
rows are opaque ID-only records. Original raw text is preserved wherever it
was already safely imported. Full mixed-sensitivity raw inventory and author
adjudication remain external intentionally; do not claim all originals are
recoverable from public Git.

One Candidate/Mapping may link many Observations. Deduplication never creates
authorship. Candidate, Featured, Evidence, Reviewed and Published remain
independent. Family references may be reused; conclusions may not be inherited.

## Validate / test / dry run

Use a **full Git clone**, not a history-free ZIP or shallow clone: existing
compatibility tests intentionally read historical commits. Use Node 24 and the
pinned dependencies in `package.json` / `pnpm-lock.yaml`.
Install dependencies using `pnpm install --frozen-lockfile`. From checkout root:

```text
pnpm run validate
node scripts/run-tests.mjs
node scripts/prepare-scheduler-snapshot.mjs /absolute/path/to/new-snapshot.json
node scripts/run-queue-scheduler.mjs /absolute/path/to/new-snapshot.json /absolute/path/to/new-audit.json
```

The last two commands are **dry run only**. Output paths must be new files;
relative paths resolve against checkout root. The old OUTPUTS_DIR argument
is intentionally rejected. Four eligible objects remain; eight Production 006 records are excluded as accepted candidates.
No research is dispatched without separate authorization. Historical Batch 004 snapshots
remain immutable and replayable.

`node scripts/production-state.mjs` validates the manifest, preserved imports,
original corpus bytes and pending exclusions. `--write` is a maintenance action
to regenerate the manifest **after authorized state changes**, never approval
of a research conclusion. Its `latest_production_commit` resolves using:

```text
git log -1 --format=%H -- research/production-state/manifest.v1.json
```

This avoids pretending a commit can embed its own future SHA. The prior accepted
production SHA is recorded separately. Validator code fingerprints and input
hashes detect stale state. Future authorized revisions must explicitly maintain
the preservation contract; never silently regenerate hashes to excuse changes.

Durable integrity checks use SHA-256 of UTF-8 text with CRLF normalized to LF,
so Git checkout line-ending conversion is not mistaken for a content change.
No wording or JSON value is normalized. Historical imported manifests retain
their original raw-byte checksum semantics and are not rewritten.

## Research and acceptance

After separate authorization, use the Scheduler selection unchanged. Research
Worker remains a Work/agent activity, not a background service in this repo.
Record source identity, evidence, controls and Freeze Proposal. Before scheduling
again, persist the new pending batch and safe exposure state in Git. Ordinary
drafts may remain outside until proposal checkpointing; they cannot be the sole
input needed for routine scheduling.

Stop at **Jinkai Liu Review**. Pending proposals cannot change Corpus or approval
states. Following explicit acceptance, append the approved freeze, the relevant
Candidate/Archive/Control records and completion state; remove only that accepted
batch from pending status. Preserve its proposal and approval provenance. Update
manifest and validators with an explicit reviewed change. There is no generic
automatic acceptance or authenticated approval service in this release.

**Accepted research state must be committed or explicitly marked external.**
Work outputs are drafts/reports, not production runtime authority. Current
candidate pages are not created by this process. Publication needs its own
approval and `scripts/publication-build.mjs`; `research/` is excluded from website
publication. Git tracking itself is not publication approval.

## Private benchmark / holdout recovery

Normal Production never reads sealed targets, evaluator gold or mixed raw author
packages. Only safe reservations, existence/version metadata and aggregate
checksums are retained here. These hashes prove integrity, not evidence quality,
and cannot reconstruct private contents. Restore private packages from their
custodian's external backup into a separately permissioned environment. This
consolidation does **not** establish that an external backup already exists.

New unexposed human notes require trusted non-LLM intake and an explicit
holdout/production choice. Add opaque reservation IDs before any production
projection; fail closed on missing exclusion state. Never put the private store
in checkout. The application projection is not an OS sandbox. Registry reports
zero imported holdouts; it cannot discover unregistered private materials.

Author adjudication, prior blind query/reveal logs, original frozen benchmark
manifests and calibration harness remain external. No benchmark run is authorized.
The old calibration log's 'waiting authorization' is superseded by the current
**Pending Isolated Evaluator** status. Future blind scoring needs real isolation.

## Recovery extent

A fresh checkout plus standard Node dependencies can read accepted data, Registry,
pending proposals, current queue exclusions, run all checks and generate a safe
dry-run selection without any Work folder. It cannot recover intentionally external
private benchmark contents or original authentication evidence that was never
recorded. New research still needs source access and human review; Git does not
replace those services or prove linguistic claims.
