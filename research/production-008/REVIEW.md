# Production-008 — Jinkai Liu Review

Completed record: 2026-10-12. Selection frozen 2026-10-01; resumed the same batch.
Status: **Editorial Freeze Proposal only**. No Active acceptance, Reviewed,
Published, website change or deployment. Source of selection: `selection-audit.json`;
individual research records: `outputs/`; integrity: `freeze-manifest.json`.

## Selection and provenance

Exact Scheduler order: **monstre / monster / presser / recognize / reconnaître /
lumen / lux / pression**. All eight are Lexical–Diachronic. Scheduler used persisted
queue order and pipeline-balanced backfill after composition slots could not be
filled; no result-driven reselection. The original audit remains `dry_run` with
zero automatic workers; the user's subsequent authorization is recorded separately
in `proposal.json`. The research was carried out in this task, not by an autonomous
background process.

All eight retain **Imported legacy / author unknown**. Six distinct scoped
Observation records are copied without alteration in `observations.json`; paired
forms share observations. No attribution to Jinkai Liu, Contributor or AI is inferred.
The original notes chiefly supply family/source observations. The pression raw note
contains `press压力，pression。exercée施加。peur怕……`; adjacency does not establish a
specific author's unrestricted pression↔压力 claim. Lumen/lux came from L-cluster
observation records; production exposure does not validate that hypothesis.

## Eight-entry review table

Modern fit scores below apply only to the stated unit. Historical phonetic comparison
remains **Pending**, independently of modern Phonetic Fit **Low**.

| Entry | Source historical stages / units | Chinese historical evidence | Best stage comparison | Featured proposal | Semantic / phonetic fit | Depth | Strongest evidence | Strongest counterexample | Remaining Pending | Editorial action |
|---|---|---|---|---|---|---|---|---|---|---|
| monstre | Latin monstrum: portent/prodigy; French attested XII c.; modern creature/person uses | 怪:《说文》異也; 兆: divination crack; 妖/𡝩/䄏 identity unsettled | Latin omen ↔ 兆; modern unusual creature ↔ 怪 | Pending | Modern 怪 High / Low; historical omen comparison Medium / Pending | D2 | Académie MONSTRE + named Chinese dictionary transcription | monstre sacré may praise an eminent performer; not an evil creature | Graph identities, exact editions, reconstructed sounds, semantic sequence | Accept with Featured Pending — proposal |
| monster | Latin → Anglo-French/Middle English; English noun XIV c.; adjective recorded 1837 | Same Chinese source leads rechecked against English senses, no inherited conclusion | Latin omen ↔ 兆; creature ↔ 怪/妖 only within scope | Pending | High / Low for creature↔怪; ancient comparison Medium / Pending | D2 | MW separates transmission and sense-specific first uses | monster hit can be positive; giant size ≠ evil | Same textual/graph issues; English transferred-use chronology | Accept with Featured Pending — proposal |
| presser | Latin pressare, intensive of premere; ca1160 torment; ca1200 olives/crowd; later urgency | 迫:近也; urgency cited in later lexicography; 按:下也; 擠:排也 | Urgency/催迫 ↔ 迫; apply force ↔ 按; squeeze/crowd ↔ 挤 | **迫 pò**, limited Structural-Semantic Candidate | High / Low for scoped modern urgency; historical bridge Medium / Pending | D2 | TLFi dated attestations + 迫 historical sense leads | Earliest listed figurative French record precedes olive pressing; presser un citron ≠ 迫柠檬 | 迫 closeness/urgency development and original edition checks | Jinkai decision: adopt scoped summary or leave Pending |
| recognize | Latin recognoscere → Anglo-French reconoistre/reconois- → English; 1537 date is formal acknowledgement sense | 認:《玉篇》/《增韵》 and 卓茂认马 citation; 識:知也, textual variant noted | Identify a previously known entity / acknowledge ↔ 认; KNOW/identify ↔ 识 | **认 rèn**, limited Structural-Semantic Candidate | High / Low; historical comparison Medium / Pending | D2 | MW transmission and senses + 認辨识 citations | Parliamentary recognize a speaker needs a specific construction; 谢 is not a direct English equivalent | Historical identify/acknowledge ordering; 認 graph and OC evidence | Jinkai decision: adopt scoped summary or leave Pending |
| reconnaître | Latin strata separated; late X c. reconnostre; modern identification, acknowledgement, gratitude constructions | 認/識 as above; 謝:辞去 versus later gratitude commentary, not a proven linear chain | Identify ↔ 认/识; gratitude construction ↔ 谢 | Pending | Best modern comparison High / Low; historical comparison Medium / Pending | D2 | TLFi RECONNAÎTRE accessible via inflected page | reconnaissant gratitude and reconnaissance/reconnoitring cannot all become 认 | Chinese gratitude history; construction-specific equivalence | Accept with Featured Pending — proposal |
| lumen | **Latin neuter lūmen, luminis**, classical light/lamp; transferred clarity/luminary senses coexist | 光:明也; 朙:照也; 灯/燈/鐙 conflation explicitly blocked | Light ↔ 光; clarity ↔ 明; lamp ↔ 灯 (modern only) | Pending | Light comparison High / Low; ancient correspondence Medium / Pending | D2 | Lewis & Short cites Cicero; Chinese named lexicographic leads | Not the SI lumen; lamp is source, not all light; trop. is not a date | Lamp graph history; old sounds; chronology | Accept with Featured Pending — proposal |
| lux | **Latin feminine lux, lucis**, sunlight/day; transferred public-view/life/clarity | 光; 晝:day/night distinction; 朙/明 forms separately noted | Sunlight ↔ 光; DAY ↔ 昼; clarity ↔ 明 | Pending | Physical comparison High / Low; historical comparison Medium / Pending | D2 | Lewis & Short Cicero/Caesar passages | Not the SI lux; 昼 only DAY; no lux→lumen→lumière linear proof | Historical Chinese semantic development and reconstructions | Accept with Featured Pending — proposal |
| pression | Latin pressio, pressum/premere morphological base; French XIII c.; modern technical and abstract uses separate | 壓:壞/塞補 with 壓/厭 distinction; **pressure compound and scientific-term histories Pending** | Pressing ↔ 压; social burden ↔ 压力; force/area ↔ 压强 | Pending | Sense-scoped modern fits High/Medium / Low; historical compound pairing Pending | D2 | Académie dated borrowing and technical definition | 压力 ≠ 压强; ancient 壓 cannot date modern terminology | Compound first attestations, technical translation history, abstract extension | Accept with Featured Pending — proposal |

## What v1.1 changed

- The records contain source nodes, Chinese nodes, explicit source units, separate
  fits, evidence references and counterevidence. Featured is bound to a specific
  comparison, never used as a substitute for the history.
- **Presser** blocks a visually attractive but unsupported physical→abstract
  timeline. **Pression** separates a Chinese character's history from the history
  of a compound and scientific term.
- **Monstre/monster** retain Latin omen as a separate comparison with 兆. 妖 is not
  promoted using an unchecked beauty→monster story.
- **Lumen/lux** separate Latin words from modern SI units and do not credit the
  L-hypothesis. **明/朙** and **灯/燈/鐙** are not silently conflated.
- **Recognize/reconnaître** share historical resources but differ in modern
  constructions. French gratitude cannot be transferred into English merely
  through a shared ancestor.

Depth totals: **D1=0 / D2=8 / D3=0 / D4=0 / D5=0**. This is a conservative evidence
assessment, not a mechanical consequence of any missing Old Chinese field. The
missing elements are claim-specific textual/graph identity and semantic-development
checks as well as period-aligned phonology. No D1 quota was applied.

## Evidence and method limitations

Source references are in `research-notes.json` and each output's `sources` catalog.
French foundations: [MONSTRE](https://www.dictionnaire-academie.fr/article/A9M2727),
[PRESSER](https://www.cnrtl.fr/etymologie/press%C3%A9),
[PRESSION](https://www.dictionnaire-academie.fr/article/A9P4189),
[RECONNAÎTRE](https://www.cnrtl.fr/definition/reconnaisse).
English foundations: [monster](https://www.merriam-webster.com/dictionary/monster),
[recognize](https://www.merriam-webster.com/dictionary/recognize).
Chinese access is Mainland-first via 汉典, but its embedded dictionaries have
different provenance. A Mainland-hosted transcription is **not** proof of checking
a Mainland print edition, original manuscript, or specialist reconstruction.
No print page number or reconstructed IPA is invented. Fanqie/rhyme labels remain
documentary leads. All cross-language Historical Relation = **Not claimed**.

Optional systematic consonant-group expansion was **not run** in this bounded
depth batch. Generated/retained counters are zero with `performed=false`, not an
experiment showing expansion failed. Candidate retrieval was meaning-first;
false-family and sense-boundary controls are stored for every entry. No blind
rediscovery, precision, or experimental-support claim is made.

Family reuse: four resource groups (monstrum, press-/prem-, recognoscere, Latin
light lexicography). Source references/nodes reused; eight modern/historical
objects assessed independently. No measured saved-time percentage is claimed.

## Review gate and state

Two optional Featured decisions: **presser→迫**, **recognize→认**, both limited
Structural-Semantic Candidates, modern Phonetic Fit Low. Six Featured Pending
recommendations. None is automatically accepted. No old authenticated human
mapping was supported or downgraded: provenance is unknown; the older family and
L-cluster observations were limited to their documented evidential roles.

Corpus remains **42 Legacy / 52 Active / 2 Archives / 2 Controls**. Production-008
adds **8 pending review objects**, leaving **1 eligible**, **5 identity pending**.
Pending reservation prevents duplicate dispatch; it does not add Active records.
No next batch, commit, push, page creation, or deploy in this task.

Verification commands: `pnpm validate`; `pnpm test`. Mechanical success validates
structure and editorial boundaries, not historical truth. Test outcome is recorded
in the final task report; do not infer D1 from a passing validator.
