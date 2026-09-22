# Batch 004 Scheduler Dry Run — 审核报告

只排队，未启动研究。时间：2026-09-22T15:14:42.706Z。

## 8 条建议

| Candidate / ID | Origin | Primary Pipeline | Identity Gate | Benchmark/Holdout | Why selected |
|---|---|---|---|---|---|
| bound / RQ-101dda206cb9 | unknown provenance | Lexical–Diachronic | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Control/uncertainty allocation; preserve negative research value |
| law / RQ-562d6cb07a1c | unknown provenance | Lexical–Diachronic | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Control/uncertainty allocation; preserve negative research value |
| abashed / RQ-73a0d89d12dc | unknown provenance | Lexical–Diachronic | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Unfilled composition slots; pipeline-balanced backfill in persisted queue order |
| meaning / RQ-9132e6719bd4 | unknown provenance | Cultural–Structural–Literary | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Unfilled composition slots; pipeline-balanced backfill in persisted queue order |
| horror / RQ-2070e35dd27a | unknown provenance | Lexical–Diachronic | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Unfilled composition slots; pipeline-balanced backfill in persisted queue order |
| up / RQ-7894011e782d | unknown provenance | Cultural–Structural–Literary | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Unfilled composition slots; pipeline-balanced backfill in persisted queue order |
| horrid / RQ-248f91f7b08f | unknown provenance | Lexical–Diachronic | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Unfilled composition slots; pipeline-balanced backfill in persisted queue order |
| inside / RQ-a5233aa38dc4 | unknown provenance | Cultural–Structural–Literary | Pass | Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible | Unfilled composition slots; pipeline-balanced backfill in persisted queue order |

## 独立优先级维度

这些是已有 intake 的规划评价，不是本轮词源研究结论；未合成总分。

| Candidate | Research Value | Evidence Availability | Protocol Relevance | Novelty | Counterexample Value | Product/Mapper Value | Research Risk | Provenance Confidence |
|---|---|---|---|---|---|---|---|---|
| bound | Medium | Medium | Medium | Medium | High | Medium | Medium | Low |
| law | Medium | Medium | Medium | Medium | Unknown | Medium | Medium | Low |
| abashed | Medium | Medium | Medium | Medium | Unknown | Medium | Medium | Low |
| meaning | Medium | High | High | Low | Unknown | Medium | Medium | Low |
| horror | Medium | Medium | Medium | Medium | Unknown | Medium | Medium | Low |
| up | Medium | High | High | Low | Unknown | Medium | Medium | Low |
| horrid | Medium | Medium | Medium | Medium | Unknown | Medium | Medium | Low |
| inside | Medium | High | High | Low | Unknown | Medium | Medium | Low |

## Source Identity / provenance

Gate 只检查身份与上下文资料是否齐备，不宣称历史词源已经独立核验。

- **bound**：English；Author comparison or semantic association only; not historical derivation.
  来源：data/language-book.v1.0.json#/entries/22/related_words/1
- **law**：English；rule
  来源：data/hypotheses/l-light-semantic-cluster.v0.1.json#/negative_controls/2
- **abashed**：English；Derivative of the related word abash, not of violent-hit bash.
  来源：data/language-book.v1.0.json#/entries/12/related_words/1
- **meaning**：English；What a sign, word, act or structure conveys or makes interpretable.
  来源：data/candidates/package-e-batch-001.v0.2.json#/records/2；data/candidates/package-f-review-queue.v0.1.json#/records/2；data/candidates/package-g-decision-register.v0.1.json#/records/2
- **horror**：English；Latin horror ← horrēre
  来源：data/language-book.v1.0.json#/entries/21/related_words/0
- **up**：English；Toward or in a higher position.
  来源：data/candidates/package-e-batch-001.v0.2.json#/records/8；data/candidates/package-f-review-queue.v0.1.json#/records/8；data/candidates/package-g-decision-register.v0.1.json#/records/8
- **horrid**：English；Latin horridus ← horrēre
  来源：data/language-book.v1.0.json#/entries/21/related_words/2
- **inside**：English；In or into an interior area.
  来源：data/candidates/package-e-batch-001.v0.2.json#/records/11；data/candidates/package-f-review-queue.v0.1.json#/records/11；data/candidates/package-g-decision-register.v0.1.json#/records/11

## Deferred（可公开的来源／容量待办）

| Item | Why deferred |
|---|---|
| brief/brevity | Provenance/Identity Queue: missing lexical_identity, single lexical/root identity |
| convene / convenir | Provenance/Identity Queue: missing lexical_identity, single source-language identity, single lexical/root identity |
| figura / fingere | Provenance/Identity Queue: missing lexical_identity, single lexical/root identity |
| figurative / figurer | Provenance/Identity Queue: missing lexical_identity, single source-language identity, single lexical/root identity |
| formation | Provenance/Identity Queue: missing single source-language identity |
| genus | Provenance/Identity Queue: missing single source-language identity |
| marché / merchant | Provenance/Identity Queue: missing lexical_identity, single source-language identity, single lexical/root identity |
| medium | Provenance/Identity Queue: missing single source-language identity |
| monstrare / monstrum | Provenance/Identity Queue: missing lexical_identity, single lexical/root identity |
| monstre / monster | Provenance/Identity Queue: missing lexical_identity, single source-language identity, single lexical/root identity |
| presser / pression | Provenance/Identity Queue: missing lexical_identity, single lexical/root identity |
| signal / signature | Provenance/Identity Queue: missing lexical_identity, single source-language identity, single lexical/root identity |
| recognize / reconnaître | Provenance/Identity Queue: missing lexical_identity, single source-language identity, single lexical/root identity |
| lumen | Provenance/Identity Queue: missing lexical_identity, meaning_context |
| lux | Provenance/Identity Queue: missing lexical_identity, meaning_context |
| pression | Provenance/Identity Queue: missing lexical_identity, meaning_context |
| clearly | Provenance/Identity Queue: missing lexical_identity, meaning_context |
| 六十四卦 | Provenance/Identity Queue: missing lexical_identity, meaning_context |
| 神农氏人身牛头 | Provenance/Identity Queue: missing lexical_identity, meaning_context |
| outside | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| source | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| goal | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| abhorrent | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| abhorrence | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| abundance | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| absolve | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| acuity | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| alimentary | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| alimenter | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| couvent | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| forme | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| generation | Eligible; deferred by eight-item capacity and transparent composition/backfill order |
| média | Eligible; deferred by eight-item capacity and transparent composition/backfill order |

## 隔离与配比审计

- Already processed / review pending：60
- Frozen benchmark exclusion：42
- Provenance/Identity Queue：19
- Archive: explicit human reopen required (not implemented by Scheduler)：2
- Duplicate research scope; existing object retained：4
- Eligible; deferred by eight-item capacity and transparent composition/backfill order：14

- 输入 181 行，合并为 149 个研究对象；8 selected / 141 deferred。
- 当前没有已核实身份的新人工或未处理 AI Discovery 项；8 条均保留 unknown provenance，未制造来源补齐比例。
- 本批 2 条控制／负面案例；实际人工 0，AI 0。
- 当前 Registry 没有 reserved Future Holdout；模拟测试覆盖未曝光、已曝光但仍 reserved、需人工决定等路径。
- benchmark 排除只使用已有 ID 清单，未打开 hidden target packages。
- 42 Legacy + 14 Active + 2 Archives、66 Observation 原始记录不变。
- 每个任务 dispatch_allowed=false；停止在 Editorial Freeze Proposal，之后必须 Jinkai Liu Review。
- 并非始终运行的 Inbox 服务；本轮未设置定时任务、未派发 Worker、未自动接收或发布。
