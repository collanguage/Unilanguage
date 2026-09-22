# Observation Registry v0.1

Queue/Research infrastructure only. No entry schema change, candidate acceptance,
new page, batch research or scheduler is introduced by this release.

## Storage and identities

`research/observations/registry.schema.v0.1.json` validates the new sidecar event
store. `registry.v0.1.json` contains the conservative migration;
`migration-report.v0.1.json` records scope, source fingerprints and omissions.
The research directory is excluded from the website publication package. It is
still committed repository data: **it is not a place for private holdouts**.

Each `ingest` event freezes the complete Observation: ID, origin, author,
original text, source form/language, optional proposed mapping, raw reasoning,
receipt timestamp, optional source date, provenance, exposure/research state,
candidate/mapping links, evidence status and optional AI discovery metadata.
`source_date: null` means unknown. Receipt time never substitutes for original
authorship time. A stored source date may be the source's own imprecise label.

Known origins are `jinkai_original`, `contributor`, `ai_discovery`. `unknown` is
an explicit conservative migration state, with `author: null`; it is not a
fourth creative inbox. An author label on a canonical entry is not proof of
authorship of every note or editorial paraphrase inside that entry.

Events have sequence, timestamp, actor, previous hash and SHA-256 hash over the
JSON-serialized event body. Hashes prove integrity, not authorship, linguistic
truth or pre-AI existence. The validator additionally compares the entire
committed event prefix. Rehashing a modified original does not pass that gate.
Persistence rejects changed/deleted prefixes and stale writers under a file
lock. Normalization is appended separately. Corrections require a new record
with a provenance reference to the original; old records are not rewritten.
This is application/Git enforcement, not tamper-proof hardware or signing.

## Three inboxes

1. **Jinkai original:** explicit verified attribution and original wording;
   preserved before any normalization.
2. **Contributor:** distinct named identity, with its own attribution basis;
   the API rejects a contributor relabeled as Jinkai.
3. **AI discovery:** model (or explicitly unknown), run/work reference, method,
   input scope, candidate, controls, counterexamples and independence status.
   `ai_discovery` records can be author-assisted; origin does not certify
   independent rediscovery. Refinements are not human original observations.

The pure `observation` / `append` APIs support all three inboxes. No language
model must be used to ingest a reserved human target. The human-run CLI accepts
JSON on stdin and prints only an opaque ID, receipt time and holdout status:

```text
node scripts/observation-intake.mjs OUTSIDE_REPO_REGISTRY production|holdout HUMAN_AUTHORIZATION_REF
```

Supply the input JSON by stdin/file redirection from a trusted non-LLM terminal.
Required fields are `origin_type`, `author`, `original_text`, `source_form`,
`source_language`, and `provenance` with `source_location`,
`attribution_basis`, `authorship_verified`; mapping/reasoning/source date are
optional. A holdout also requires a nonempty `proposed_mapping` and explicit
`ai_exposure_status: unexposed`. The operator, not AI, verifies that attestation.
Do not paste the private JSON into an AI conversation or command argument.

## Mapping and observation associations

An `object` event declares a Candidate or Mapping ID and exact source reference.
A `link` event joins an observation to that object. Replay materializes
`linked_candidate_ids` and `linked_mapping_ids`. Many observations can link to
one object, and one note may link to several objects. IDs are explicit;
spelling similarity does not establish shared lexical identity or word family.
Mapping references in this migration point to the actual candidate array
elements in the accepted frozen research. Legacy notes link to their entries
as contextual observations, not as endorsements of every current mapping.

`productionTasks(registry)` groups eligible records by Candidate ID and carries
every observation ID and independently labeled origin. It does not delete or
merge original notes. AI pool records use this same association layer. It skips
reserved, unknown-exposure and unexposed observations, archives and already
accepted references. Newly ingested production notes need an explicit object
and link before they produce a task. The task projection is read-only and has
`benchmark_eligibility: Benchmark-ineligible after exposure`.

## Exposure / holdout state machine

| Current state | Permitted next state |
|---|---|
| unexposed | exposed_to_ai (reserved items require explicit human reveal) |
| unknown | exposed_to_ai |
| exposed_to_ai | same state only |
| post_ai_observation | same state only |

`reserved → revealed` requires a human-intake authorization reference and
atomically marks the observation exposed. No transition restores unexposed.
New human holdouts must be explicit targets, received through non-LLM intake.
Previously exposed matching original text or source/language/target in the
same private store cannot be re-ingested as a new holdout ID. External exposure
history still requires truthful human attestation; this software cannot prove
that a note has never been discussed elsewhere.

Private intake refuses a file inside the checkout, resolves parent real paths
to catch junctions, and rejects symlink registry files. Restrictive file mode
is requested; Windows ACLs must separately be configured by the operator.
Private raw records remain in the outside-repo store. `publicMetadata` emits
only opaque ID/origin/exposure/holdout states. No source forms, targets,
reasoning, hashes, provenance paths or normalized fields are exported for
holdouts. `productionTasks` omits reserved observations entirely. Production
must only receive that projection, never the raw store.

**This API is not an OS sandbox.** A process with unrestricted filesystem
access can read any accessible file. Roles and authorization references are
audit assertions, not authentication credentials. No isolated evaluator is
created here and the frozen benchmark stays Execution Pending Isolated
Evaluator. Real holdouts require a separately permissioned intake store and
workers lacking its filesystem access; until then do not give real reserved
notes to AI or claim blind evaluation. Tests use synthetic targets only.

## Review and evidence boundaries

Worker transitions are `queued → research → freeze_proposal` (or archive).
There is no worker acceptance, Reviewed or Published API. Observation review
and publication fields remain unreviewed/not_published regardless of the
linked entry's existing status. `accepted_reference` is migration bookkeeping
to prevent re-queuing the already accepted corpus, not new approval.

Jinkai review remains an external gate; a future authorized acceptance service
must verify an approval bound to the exact proposal digest. This release does
not implement that service or a scheduler. No scheduler can promote a record
through the provided API. Repository writers remain subject to normal code
review and permissions.

Schema validation checks shape/enums. The independent editorial/state gate
rejects identity confusion, invalid links, exposure rollback, evidence/history
promotion, altered originals and unauthorized state transitions. Source
fingerprints and pointer comparison verify migration fidelity, not the
underlying lexical claims. Normalized text is never merged into evidence.

## Conservative migration report

Only three existing product files were read as migration inputs: Legacy 42,
Production 14 active and Production 2 archives. No benchmark key, frozen target
package, Future Holdout or external 115-candidate inventory was ingested.

- **66 observations:** 52 unknown-origin preserved text occurrences and 14
  AI frozen research records; 0 newly authenticated Jinkai/contributor records.
- **58 Candidate/entry references, 51 Mapping references.** The original
  42+14+2 datasets and their conclusions remain byte-for-byte unchanged.
- Eight legacy entries lack `source.raw_note`; their object references are
  retained but no original note is invented. One production record lacks an
  original/imported note and links only its AI result. These are enumerated
  in the migration report.
- All imports are already exposed or post-AI. None is a new holdout. Source
  dates and original authorship remain unknown where not established.
- Exact JSON representations of AI candidate arrays are frozen snapshots,
  not verbatim human prose. Imported editorial wordings remain unknown-origin.
- Multiple stored occurrences are preserved; no independent-authorship claim
  is inferred from duplication. Active queue tasks currently generated: **0**,
  because these are accepted references/archives, not a new research batch.

The source fingerprints are SHA-256 of parsed JSON serialized with
`JSON.stringify`; event hashes use the same deterministic field order.

## Validation and scheduler readiness

Run `npm run validate`, `npm test`, and `npm run build`. The new regression
suite tests independent origins, normalization, immutable history, monotonic
exposure, holdout projections, dedup, Review Gate and publication exclusion.
Existing legacy/Mapper/search/candidate tests remain unchanged.

The registry, association and task-projection interfaces now support a future
bounded scheduler design. Scheduler implementation remains unapproved in this
task. Before activating one, configure actual role/storage permissions and
human review authentication; keep holdouts outside production access. No new
entry schema, research batch, page or scheduled job is needed for this release.
