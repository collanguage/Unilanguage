# Public-Release Review — Exploratory AI Unblinding v1.0｜公开发布审查——探索性 AI 揭盲 v1.0

**Review status｜审查状态：** `PASS｜通过`

**Result label｜结果标签：** `Exploratory AI Result｜探索性 AI 结果`

**Preregistered Human Annotation｜预注册真人标注：** `Pending｜待进行`

## Approved public content｜批准公开的内容

- group denominators, counts, rates, and aggregate 2×2 statistics｜各组分母、计数、比率及汇总 2×2 统计；
- risk differences, confidence intervals, Fisher p-values, and supplemental aggregate odds ratios｜风险差、置信区间、Fisher p 值及补充汇总优势比；
- separate AI-A and AI-B aggregate analyses｜分开报告的 AI-A 与 AI-B 汇总分析；
- aggregate evidence-family and frozen-category sensitivity analyses｜汇总证据家族及冻结类别敏感性分析；
- bilingual methods, analysis-code comments, JSON/CSV metadata, audit/decision records, fingerprints, and checksums｜双语方法、分析代码注释、JSON／CSV 元数据、审计／决策记录、指纹和校验和；
- the bilingual public-safe exploratory result summary｜双语公开安全探索性结果摘要；
- a bilingual public-safe reconstruction of the pre-unblinding methodological review｜双语公开安全的揭盲前方法审查重建版；
- `Exploratory AI Result — Tentatively Supported｜探索性 AI 结果——初步支持` and continuing `Pending｜待进行` human status.

## Excluded from public release｜排除在公开发布之外

- `restricted/analysis-key.csv` and all rows｜`restricted/analysis-key.csv` 及其全部数据行；
- any raw `blind_id` value or list｜任何原始 `blind_id` 值或清单；
- surface-form-to-group mappings｜词形到组别的映射；
- the private joined unblinded dataset｜私有的已揭盲连接数据集；
- row-level AI-A/AI-B labels and workbooks｜逐项 AI-A／AI-B 标签和工作簿；
- identity-recovery, matching, or selection fields｜可能重建分组的身份恢复、匹配或选择字段；
- group-linked item/counterexample lists while human annotation is pending｜真人标注待进行期间带组别的项目／反例清单。

## Automated and manual checks｜自动与人工检查

The release directory and website public-record additions were checked for accidental restricted-file copies, raw blind identifiers matching `BLD-[0-9A-F]+`, row-level mapping fields in aggregate data, and links to private paths. The analysis code necessarily names expected private input columns and accepts private input paths, but it embeds no key row, item identity, blind identifier value, or mapping.

已检查发布目录和网站公开记录，确认没有意外复制受限文件、没有符合 `BLD-[0-9A-F]+` 的原始盲态标识符、汇总数据中没有逐项映射字段，也没有指向私有路径的链接。分析代码因复现需要会声明预期的私有输入列并接受私有输入路径，但不嵌入任何密钥数据行、项目身份、盲态标识符值或映射。

The public files are sufficient to understand the methods and reproduce the statistics when the separately held frozen private inputs are supplied. They do not make the reusable blind-breaking key public and therefore preserve the possibility of later preregistered human blind annotation.

在另行提供冻结私有输入的条件下，公开文件足以理解方法并复现统计结果；它们不会公开可复用的破盲密钥，因此保留了以后开展预注册真人盲标的可能性。

The website release manifest and checksum file hash the LF-normalized bytes stored and deployed by Git. The separate local handoff manifest hashes the local deliverable bytes. This distinction prevents Windows working-tree line endings from producing false deployment-integrity mismatches.

网站发布清单和校验和针对 Git 存储与部署的 LF 规范化字节计算哈希；独立的本地交付清单则针对本地交付文件字节计算哈希。此区分可避免 Windows 工作区换行符造成虚假的部署完整性不匹配。
