# Schema / Provenance Compatibility Report

检查基于本地仓库HEAD `cc45d5541b2c9ab76564f5a5d353ea3ce44cefd7`。只读检查，没有新增字段或修改schema。

## 已有能力

| 位置 | 实际结构 | 可复用范围 / 限制 |
|---|---|---|
| `data/language-book-entry.schema.v1.json` `/properties/author` 与 `/$defs/entry/properties/author` | `const: Jinkai Liu` | 旧语料署名约束；不是多作者Observation身份模型 |
| 同文件 `/$defs/entry/properties/source` | 单对象，type/author/status/normalization/raw_note；additionalProperties=false | 能存一个raw note和来源说明；不能直接放Observation数组、不可变版本链和多作者关系 |
| 同文件 `/$defs/pilotModel` | historical_stages / mappings / display_selection等 | 历史/映射/展示模型复用，无须新pipeline |
| 同文件 `/$defs/pilotMapping` | stage_mapping_id / stage_ref / freeze / search / candidates / review | 可作研究映射锚点，但一个stage mapping还含多个候选，不能当作source↔Chinese pair唯一ID |
| 同文件 `/$defs/pilotCandidate` | candidate_id / target / comparison / evidence / historical_relation等 | 具体目标、读音、义项、评分复用；无typed observation_refs/origin records |
| `data/candidates/production-corpus.v0.1.json` | 独立candidate/publication/featured状态；source_provenance指向freeze，baseline_record保存快照 | 当前接收机制复用；不得悄悄修改既有快照添加新作者 |
| `data/review/production-002-freeze.v0.1.json` | author_observation.original / imported_editorial_observations / provenance数组 / attribution_status | 已能区分作者原文与编辑抽取并保存多来源位置；provenance数组不等于多位独立作者记录 |
| `scripts/validate-production-candidates.mjs` | source_provenance必须指向对应freeze；baseline_record须deepEqual既有contract | 接收验证有真实冻结约束；不能借自由文本绕过更新审批 |
| `data/language-book.schema.json` | source catalog和生命周期；严格additionalProperties边界 | 引用与状态复用；source catalog不是独立Observation/exposure登记服务 |

Schema中出现`independent_observations`字样，不代表已存在可管理多作者原文的关系表；必须看它的实际类型/上下文，不能据字段名下结论。

## 最小扩展提案：只在Queue层

**现有canonical schema不改；typed multi-origin关系目前不足。** 用references或editorial_notes可以写文字说明，但无法机械验证原文版本、作者归属、独立性和多对多关系，不能称已完整支持。

建议新增两个Queue sidecar逻辑契约，当前仅提案：

1. **Observation registry**：稳定Observation ID、origin kind、creator identity/status、immutable raw version/hash/location、source日期与系统时间、parent/refinement/version链接、run/source-input/exposure信息。人类与AI共用基础provenance，不混用署名。
2. **Mapping–Observation links**：现有candidate/mapping引用 + Observation ID/version + role/claim scope + independence状态 + exposure/review引用。

映射引用优先使用当前Candidate ID及其具体candidate/stage定位；还未有正式Mapping的观察用queue provisional Mapping ID。不是给每个重复笔记复制一条canonical entry。尚不确定同义项时保留provisional links供审核。

Observation registry不把raw记录当字典证据。现有`evidence.source_refs`继续引用支持语言学claim的证据，**不能为了不扩字段而把作者原始观察混成已核词典来源**。关联表在外部join，现有source_provenance继续指向经审核freeze。

如后续产品需要entry内可机器解析的反向引用，再单独考虑一个可选`observation_refs`列表；只有证明sidecar join无法满足才提出该canonical扩展。本轮既不加此字段，也不改旧作者const。

## 作者const的发布边界

未来contributor/AI内容可以在Queue与Production Candidate研究层保留真实身份；不能借旧entry模板把这些内容标成Jinkai的原创。`created_by`只说明谁生成批次文件，不说明谁提出Mapping。

若要将多作者成果正式发布到旧schema所约束的页面，需要一个额外审核过的兼容步骤：明确原`author`究竟是entry编写者还是项目编辑，保留Observation署名；若其语义仍是唯一原创作者，就需最小调整该发布约束。这个问题不妨碍本轮设计，也不授权现在修改42条或schema。

## 不能靠schema解决的事项

原始作者真实性、首次提出日期、跨作者独立性、AI是否实际见过答案，都需要来源/访问日志及人工判断。hash不能证明这些事实。真正holdout隔离需要非LLM接收与权限边界，不能靠一个`AI-unexposed`布尔字段实现。

结论：**研究模型复用；建议最小Queue provenance关系契约；本轮零schema修改。**
