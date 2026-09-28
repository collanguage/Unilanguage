# Production Batches 001 / 002 / 003 — Stability Report

比较各批**初次 Research → Freeze Proposal**阶段，不用前两批已经审核接收的7 Active + 1 Archive替换原始研究状态。所有数字是描述性记录，不是benchmark、precision、盲测复现率或性能趋势。

| Metric | Batch 001 | Batch 002 | Batch 003 |
|---|---:|---:|---:|
| Processed | 8 | 8 | 8 |
| Ready for Editorial Freeze | 4 | 2 | 2 |
| Featured Pending（互斥主状态） | 1 | 5 | 6 |
| Needs Targeted Verification | 2 | 1 | 0 |
| Archive（当时主状态） | 1 | 0 | 0 |
| Serious candidate records | 20 | 31 | 33 |
| Average / all 8 selected | 2.500 | 3.875 | 4.125 |
| Retained scoped research candidates | 18 | 25 | 28 |
| Controls | 17 | 16 | 32 |
| Counterexamples | 16 | 16 | 16 |
| Expansion generated | 6 | 10 | 7 |
| Expansion retained | 4 | 4 | 2 |
| Expansion not selected | 1 | 4 | 3 |
| Expansion semantic mismatch | 1 | 2 | 2 |
| Expansion evidence-failure rejection | 0 | 0 | 0 |
| Expansion retention | 4/6 (66.7%) | 4/10 (40%) | 2/7 (28.6%) |
| Source-identity failures / unresolved source items | 1 (GAN) | 1 (CUN) | 0 |
| 新增的本记录有用form（仅intake字符串基线） | 11 | 23 | 20 |

来源：[Batch001原指标](../production-research-queue-batch-001/production-metrics.json)、[Batch002原指标](../production-research-batch-002/production-metrics.json)、[本批指标](production-metrics.json)。旧文件未改写。

## 如何解释

- 主状态互斥；Featured字段本身在前两批也可能属于Targeted/Archive记录。不能把4 Ready理解为4个Featured。
- Batch001的GAN已经归档；Batch002的CUN先进入一次targeted verification，最终因source identity不明归档。这是阶段差异。本轮先检查身份，八条均通过，没有为复制7+1而制造Archive。
- Batch003提出DIRECTION→向 xiàng、LONG→长 cháng两个Structural-Semantic Featured；两者Phonetic Fit均Low。其余六条Featured Pending，无须自动重新搜字。
- 33个候选记录包括28个限定保留、3个not selected、2个semantic mismatch；每条3–5个，平均4.125。不是33个新词或33个证实关系。
- 本批明确列出每条2个semantic + 2个phonetic controls，故controls记录数高于前两批。不是控制能力提高一倍，也不是修改声音评分标准。仅32条示例，其中部分为普通词义示意、纸本待核，不是经过独立裁定的gold set。
- 扩展保留的2条：DIRECTION中的领，只限guidance侧义；FILAMENT中的纺，只限历史filare=spin单位。**都未成为Featured。** 声音评分仍Low。
- 其余扩展：通、缝、连未选；念、隆语义不匹配而拒绝。隆长复合词虽包含“长久”，不能把它投射到隆单字。没有把所有未选项叫false positive。
- 三批共生成23个扩展记录、保留10个（43.5%），只可作异质案例的合并计数；不能证明precision、因果增益或算法退化。保留不等于有发布价值。纸本Pending也不自动算evidence-failure rejection。
- 新候选20项仅相对每条旧proposed_chinese_mapping字符串；含普通翻译和已在项目其他位置出现的汉字。不是作者未想到20个原创Mapping，不报告independent rediscovery。

## 流程稳定性判断

**达到Queue Scheduler v0.1的设计门槛；尚不是无人审核自动接收/发布的授权。**

| Gate | Result | Limit |
|---|---|---|
| Validators | 本批5个现有validator通过；18个研究边界mutation被拒绝 | 机械规则不能独立判定所有自然语言claim真假 |
| Schema | 无字段扩展；研究成果在仓库外 | 本轮未测试新的线上接收代码，因为没有变更 |
| Source Identity Gate | 8/8已知词身份；失败路径通过mutation验证 | 无真实新失败样本；不能由此估计未知source检出率 |
| Freeze boundary | 2 Featured proposal + 6 Pending，等待审核 | 普通标准语义不自动成为Featured |
| Evidence promotion | 本批未发现自动升级；旧两批保留其原审核结论 | 不是对三批所有语言学断言重新独立审计 |
| Selection repeatability | 发现original28不足；本批1原队列+7同inventory储备，逐项排除 | 应由调度器显式记录reserve admission，不能假称FIFO |

主要瓶颈仍是中文具体纸本词条与稳定来源访问，而非缺少pipeline。CNRTL/汉典部分页面可见摘要但正文复读失败；存在、有、导、尖、敏、急、纤维、缝、连等细项维持Pending。DIRECTION有中国华文教育网限定构式支持，LONG的空间/时间义有汉典具体释义支持。没有把这些升级成历史共同来源。

## 当前产品状态

42 Legacy + 14 Active Production Candidates + 2 Archives **不变**。本批八条未接收、未建页面、未commit/push/deploy。冻结benchmark未执行、未改动。

下一步建议审核本批及[Scheduler设计](queue-scheduler-v0.1.md)，不建议继续手工发起Batch004，也不自动运行任何下一批。Scheduler初始批量上限仍8；增加规模需要新的编辑决定。
