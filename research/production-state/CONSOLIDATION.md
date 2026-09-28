# Production State Consolidation v1.0

Scope: durable state only. No new research, Featured/evidence revision,
Candidate acceptance, benchmark run, page creation or deployment.

## Asset decisions

The inventory covers 1,428 accessible pre-consolidation files from the current
Work outputs, current Work execution directory and prior task outputs. It is a
bounded inventory of those locations, not every file on the user's computer.

| Classification | Files |
|---|---:|
| A Durable production state / already tracked copies | 350 |
| B Durable research evidence / supporting history | 137 |
| C Benchmark / audit custody | 313 |
| D Ephemeral / superseded execution artifacts | 628 |

Decisions: 378 repository dispositions (338 existing identical tracked copies
plus 40 newly preserved evidence/proposal files), 422 intentionally external,
628 deprecated execution copies. Nothing external was deleted. These file
counts are not counts of unique research claims or candidates.

`asset-inventory.v1.json` identifies each disposition, checksum (where safe),
repository destination and reason. Private assets have opaque IDs; no individual
low-entropy target hash or private filename is disclosed. Twelve mixed/private
package groups have aggregate integrity metadata in `external-assets.v1.json`.

## Closed gaps

- Batch 003: complete selected research, evidence and proposals preserved under
  `pending/production-003/`; still awaiting review, not accepted.
- Batch 005: research, original extracted observations, audit and selection
  preserved under `pending/production-005/`; still awaiting review. Its old
  external overlay is preserved as history and superseded operationally by
  `pending-batches.v1.json`.
- Snapshot generation: old external inventory/isolation/Batch003 file reads
  removed. `queue-seed.v1.json` has 115 sanitized inventory rows, including
  opaque protected rows. Current Registry, Corpus, Controls, Archives,
  completions, reservations and pending state are read inside the checkout.
- Accepted research: Batch 001/002/004 supporting reports, candidates,
  counterexamples and targeted verification are preserved without rewriting.
  Approved data/review freezes remain authoritative over historical drafts.
- Raw inventory / author adjudication: full mixed-sensitivity originals remain
  external intentionally. Safe operational projection is durable; no new human
  attribution or provenance authentication is inferred.
- Benchmark: original manifests, private keys/targets, reveal/query/contamination
  records and calibration harness remain external. No public import of target
  contents. Current paused status and recovery requirements are explicit.
- Old README counts and initial dry-run scope now point to current Resume/state
  authority. Historical narratives remain historical rather than rewritten.

## Recovery and checks

`recovery-report.v1.json` records an independent full Git checkout plus standard
package dependencies. No Work tree or private package was copied. Registry,
Scheduler, Corpus and editorial/schema validators passed. Full regression:
**308/308 passed** in the working checkout and recovery fixture. Publication
compatibility build passed inside the fixture; this was not a deployment.

Snapshot generation/dry run recovered six eligible objects, 19 identity-pending
objects and excluded both pending batches (16 objects). No Worker ran and no
entry was accepted. Counts remain 42 Legacy / 20 Active / 2 Archive / 2 Controls.

Two preliminary fixture problems were retained in the recovery report: pnpm
junction dependency copying and a history-free fixture. The corrected fixture
copies resolved package dependencies and uses full Git history. A separate
five-test focused run also verified CRLF checkout does not invalidate content
fingerprints. Original linguistic data and imported research are protected by
`preservation-lock.v1.json`; only text line endings are normalized for hashing.

## Remaining external requirements

Production continuation needs only full Git history and installed runtime
dependencies, then separately authorized research/source access and Jinkai
review. It no longer needs old Work output paths. Private benchmark originals,
unregistered human holdouts and their original authorship evidence cannot be
reconstructed from a checksum. Their custodian backup remains necessary, and
this task does not claim that such remote backup or evaluator isolation exists.

The review boundary is still a software state constraint plus human procedure,
not an authenticated approval service. No background Research Worker was added.
The next authorized action is review of pending batches, not a new batch.
