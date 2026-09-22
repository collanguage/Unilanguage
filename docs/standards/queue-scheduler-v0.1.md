# Human–AI Queue Scheduler v0.1 — dry run

Approved scope: planning infrastructure and a real eight-item Production Batch
004 proposal. No Research Worker, new candidate acceptance, page, Featured
selection, evidence promotion or publication is executed.

## Inputs and custody

`prepare-scheduler-snapshot.mjs` prepares metadata from the existing 115-item
inventory, the approved production exclusion manifest, Batch 003 selection,
Legacy 42, Production 14+2 and the Observation Registry. The Registry's frozen
AI records constitute the current AI Discovery pool; there is no invented
second copy or independent-discovery attribution.

The reservation list is applied before any benchmark item's source/author
fields are projected. Hidden benchmark packages are never opened. Blocked rows
contain only opaque IDs/channel/order/reservation flags. No proposed Chinese
mapping, raw reasoning, author wording or Featured enters the Scheduler input.
The actual snapshot and audit live under `research/scheduler/`, which is
excluded from website publication by the existing publication policy.

`registryQueueProjection` is a trusted-intake boundary, not a worker function:
private stores must remain inaccessible to the Scheduler/Worker. It exports
only opaque IDs/status for reserved or unexposed observations. For released
production notes it exports source and provenance metadata, with normalized
identity/context supplied separately through descriptors. It never exports
the proposed mapping or original text. Do not pass a private registry path to
a Production process. Application projections are not an OS sandbox.

Current scope contains no registered Future Holdouts. The adapter records this
limitation rather than claiming to inspect unregistered private stores. Future
intake must supply up-to-date exclusion metadata/protected IDs before adding
items to the production snapshot. Missing exclusion lists fail closed; an
unexposed or reserved observation also blocks its research object independent
of the list. Benchmark remains Designed / Frozen / Execution Pending Isolated
Evaluator.

## Deterministic rules, no scientific total score

1. Group by explicit `research_object_id`; collect all Candidate aliases and
   Observation IDs. No fuzzy spelling or word-family deduplication.
2. If **any** row/alias in a group is benchmark-reserved or holdout-protected,
   exclude the whole object. Exposed-but-reserved is an anomaly, not permission.
3. Defer unexposed notes for a human holdout/production decision. Unknown
   exposure also blocks scheduling. The Scheduler cannot reveal or release.
4. Exclude archived, completed, review-pending and in-progress objects.
   Archive reopening is not implemented; it requires a separate explicit human
   decision. Preserve duplicate observations, defer redundant research scope.
5. Require source form, one source-language identity, lexical/root identity,
   meaning/context and provenance. Missing/composite identities go to
   **Provenance/Identity Queue**. This checks intake completeness, not the
   historical truth of inherited source claims. Chinese matches never fill
   missing source identity.
6. Use one approved primary pipeline or unambiguous typed metadata to route
   Lexical–Diachronic / Cultural–Structural–Literary. Otherwise Routing Pending.
7. Attempt **2 AI-only slots, 4 human/contributor slots, 2 control/uncertainty
   slots**. Multiple-origin objects retain all origins but consume one slot.
   AI slots are allocated first so plentiful human notes cannot crowd them out.
   Human slots use oldest receipt first; other slots use persisted queue order,
   then receipt date and stable object ID. A new confirmed human note competes
   for reserved human slots, not the entire old unknown-provenance backlog.
8. Unfilled quotas alternate the two pipelines in existing queue order.
   Never fabricate sources or controls. Fewer than eight eligible objects
   produces a visible shortfall. Eligible but unselected items retain a reason.

Each row separately shows Research Value, Evidence Availability, Protocol
Relevance, Novelty, Counterexample Value, Product/Mapper Value, Research Risk
and Provenance Confidence. These are inherited ordinal planning assessments
with rationale, not fresh research/evidence scores. **There is no aggregate
score**. The initial sorting policy deliberately uses explicit quotas and
queue order; it does not claim these subjective dimensions are commensurable.

Origin composition shows Jinkai Liu observation, Contributor observation,
AI discovery, multiple origins or unknown provenance. Human attribution
requires an explicit verified identity flag supplied by trusted intake;
unverified labels downgrade to unknown for scheduling. This does not mutate
the Observation. Conflicting attribution for one Observation ID is rejected.

## Permissions and audit

`schedule` is a pure planner with no filesystem, networking, worker dispatch,
Registry writes or acceptance API. Generated tasks have `dispatch_allowed:
false`, stop at Editorial Freeze Proposal and require Jinkai Liu review.
The Registry review gate remains independently enforced. Roles/attribution
flags are trusted intake assertions; they are not an authentication system.

Every dry run records version, timestamp, safe source fingerprints, queue
snapshot reference, hash of the sanitized scheduling view, selection,
deferred reasons, origin composition, exclusions and zero worker/mutation
counts. Even the scheduling-view hash excludes hidden target content.
The CLI creates new files exclusively and refuses to overwrite a previous
audit. The validator replays the exact snapshot and independently checks
exclusions, identity/pipeline and review/dispatch boundaries.

```text
node scripts/prepare-scheduler-snapshot.mjs OUTPUTS_DIR NEW_SNAPSHOT_FILE
node scripts/run-queue-scheduler.mjs SANITIZED_SNAPSHOT NEW_AUDIT_FILE
node scripts/validate-queue-scheduler.mjs
node --test tests/queue-scheduler.test.cjs
```

The adapter accepts the existing repository/outputs layout; the core planner
works on sanitized metadata only. There is no heartbeat, automation schedule
or background worker. Dry run does not mark a proposal completed and does not
change the real queue. Production-exposed inventory remains benchmark-ineligible.

## Batch 004 proposal and honest composition

The real snapshot has 181 input rows / 149 research objects. It includes the
115-item inventory and 66 Registry observation-to-Candidate rows. These rows
are not 181 new candidates. Completed Registry objects are deferred.

| Candidate | ID | Pipeline | Allocation |
|---|---|---|---|
| BOUND | RQ-101dda206cb9 | Lexical–Diachronic | Existing surface-similarity negative/control |
| LAW | RQ-562d6cb07a1c | Lexical–Diachronic | Existing hypothesis negative/control |
| ABASHED | RQ-73a0d89d12dc | Lexical–Diachronic | Queue-order backfill |
| MEANING | RQ-9132e6719bd4 | Cultural–Structural–Literary | Queue-order backfill |
| HORROR | RQ-2070e35dd27a | Lexical–Diachronic | Queue-order backfill |
| UP | RQ-7894011e782d | Cultural–Structural–Literary | Queue-order backfill |
| HORRID | RQ-248f91f7b08f | Lexical–Diachronic | Queue-order backfill |
| INSIDE | RQ-a5233aa38dc4 | Cultural–Structural–Literary | Queue-order backfill |

All eight have **unknown provenance**, traceable to previous repository
extractions. None is relabeled human or AI to fill a quota. Available new
verified-human and active-AI slots are both zero; two control slots are filled,
six slots backfilled. HORROR/HORRID are separate lexical objects, not two
independent confirmations of a hypothesis; shared historical-family claims
remain inherited research inputs. No word-family conclusion is made here.

Examples deferred:

| Item | Reason |
|---|---|
| OUTSIDE | Eligible, eight-item capacity reached |
| SOURCE | Eligible, eight-item capacity reached |
| GOAL | Eligible, eight-item capacity reached |
| BRIEF/BREVITY | Composite lexical identity; split/clarify first |
| CONVENE / CONVENIR | Multiple source languages/forms; clarify first |
| FORMATION | English/French identity not resolved |
| LUMEN / LUX (separate queue records) | No standard meaning/context in sanitized intake; do not infer from Chinese |
| GAN / CUN | Existing archives; not reopened |
| GUN / GIN / GEN | Redundant scope of archived GAN observation; not newly archived records |

The machine audit lists every selected dimension, context, provenance,
identity result and deferred/excluded object. The snapshot contains no actual
new holdout; synthetic tests cover the future human-note flow and exposed
holdout anomalies. No provenance mining or lexical research was performed.

## Can Jinkai directly submit raw notes now?

The underlying intake + planning interfaces support this: preserve raw note,
freeze provenance, record exposure/holdout decision, then generate a queue
proposal. A note with unknown source identity is preserved and routed for
clarification instead of guessed or discarded. Same Mapping can retain
Jinkai, contributor and AI records simultaneously.

This release is **a callable dry-run infrastructure**, not a finished Inbox UI
or always-on scheduler. A trusted human/non-LLM intake and explicit production
consent are still needed for unexposed notes. Scheduling proposals can then be
generated automatically; research dispatch and corpus acceptance remain off
until separately authorized. No real Batch 004 has started.
