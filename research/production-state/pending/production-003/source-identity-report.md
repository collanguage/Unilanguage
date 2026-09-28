# Source Identity Gate — Batch 003

| Source | Language / lexical identity | Provenance check | Result |
|---|---|---|---|
| WAVE | English noun/verb wave; non-Navy acronym | raw_note exact string; hash matches | Pass |
| KNOWLEDGE | English noun; knowledge/awareness roles | prior Package E record; hash matches; not author quote | Pass |
| EXIST | English intransitive verb | prior Package E record; hash matches; not author quote | Pass |
| DIRECTION | English noun; spatial/guidance senses | prior Package E record + related-word pointer; first source hash matches | Pass |
| TRANSLATION | English noun; process/product | prior Package E record; hash matches; not author quote | Pass |
| ACUTE | English adjective; Latin acūtus historical source | ACUMEN related-word pointer, not reused Featured; hash matches | Pass |
| FILAMENT | English noun primary; French noun separately identified | FIL related-word pointer; hash matches | Pass |
| LONG | English length/duration adjective/adverb | L-hypothesis negative-control pointer; hash matches | Pass |

八条source身份通过；0个真实未知source失败。对“不明身份仍生成候选”和“由汉字倒猜source”的两个mutation，验证器均拒绝。另一个合成正例确认：身份不明、零候选、保留provenance的Archive能够通过，不存在“只会一律拒绝”的漏洞。合成测试不计入实际8条。真实失败检出率不可由8个Pass推算。

FILAMENT的French最早年代待核，不等于source identity未知。LONG的imported PIE group待核，不影响English long词身份。七条没有作者原话，不影响外语词可研究，但不得因此认证作者目标。WAVE原文是仓库中记录的raw wording，不重新认证pre-AI authorship。

证据定位、实际选中值、hash比对见[provenance-check.json](provenance-check.json)。身份来源分别见各报告的Merriam-Webster、AHD和CNRTL限定证据；未读取隐藏Track B author package。

所有本批项已在research manifest标Benchmark-ineligible after production exposure；不写回冻结inventory或benchmark。此标记不改变旧blind run记录。
