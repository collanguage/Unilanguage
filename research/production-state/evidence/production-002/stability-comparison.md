# Batch 001 vs Batch 002 — descriptive stability comparison

比较Production首次研究提案阶段，不用Batch001后续Final Freeze/Acceptance成绩替换原始基线。两批不是随机样本，也不是盲测。

|Metric|Batch001 research|Batch002 research|
|---|---:|---:|
|candidates_processed|8|8|
|ready_for_freeze|4|2|
|featured_pending_primary_status|1|5|
|targeted_verification_needed|2|1|
|archived|1|0|
|serious_candidate_records_considered|20|31|
|average_serious_candidates_per_entry|2.5|3.875|
|controls|17|16|
|counterexamples|16|16|
|expansion_added|6|10|
|expansion_retained|4|4|
|expansion_not_selected|1|4|
|expansion_semantic_mismatch_rejected|1|2|
|expansion_evidence_failure|0|0|
|new_useful_candidates_discovered_local|11|23|

## 解释

- 8项处理=7项完成有界候选研究+1项身份门停止。CUN的0候选是缺失身份的有效结果，不是完整词源研究已经完成。
- 2 Ready / 5 Featured Pending / 1 Targeted / 0 Archive 是互斥主状态；Featured字段Pending共6条，因为CUN也没有Featured。
- 扩展10项：4 retained、4 not selected、2 semantic mismatch、0 evidence-failure rejection。4项保留只指Research中的局部义项：塌、合、逼、怜；都不是自动Featured。
- 扩展保留4/10=40%，Batch001为4/6≈66.7%。样本、义项及选择不同，不能解释为算法退步或precision变化。
- 31项candidate table含6项未选/淘汰；25项限定义保留。平均31/8=3.875；仅对7条身份清楚的词为31/7≈4.43。
- 新有用候选23仅指selected intake未列而本批限定义保留的form-record，含普通翻译。不是23项原创发现，不与Author Rediscovery混用。Batch001同口径为11。
- 原文记录2条完整保留：MIDDLE限缩1条，CUN身份隔离1条；新淘汰作者原观察0条。其余6条没有可逐字归属作者的观察，不计成作者命中或失败。
- 稳定性方面，Pending、身份停止、义项分层和保留反例正常工作；来源访问仍是瓶颈。Cambridge 7个页面403，大陆纸本条目未取得，网页聚合不能充作纸本验证。

## 下一批建议

**继续8条，不扩大到10–15条。** 当前可重复的是有界研究和证据身份控制；尚不能证明扩容后的证据核验质量稳定。先由Jinkai Liu审核本批7条可形成提案的记录，以及CUN的身份问题。无须第三条pipeline或扩schema。

未执行Batch003；未改变42 legacy + 7 active candidate + 1 archive。
