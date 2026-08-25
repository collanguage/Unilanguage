# Experiment 001A Round 2 — Exploratory AI Unblinding v1.0｜探索性 AI 揭盲 v1.0

**Record ID｜记录编号：** `UNI-EXP-001A-R2-AIUNBLIND-1.0`

**Conclusion label｜结论标签：** **Exploratory AI Result — Tentatively Supported｜探索性 AI 结果——初步支持**

**Preregistered Human Annotation｜预注册真人标注：** **Pending｜待进行**

**Experiment 001B｜实验 001B：** **Not started｜未启动**

## Research boundary｜研究边界

This report records the first authorized exploratory unblinding of the frozen AI-A and AI-B annotations. It does not amend or replace the frozen 31-section preregistration, the frozen pre-outcome operational specification (OPS), either frozen AI pass, or any pre-existing checksum. It is not the preregistered human analysis and does not confirm or reject the preregistered human hypothesis.

本报告记录第一次经授权的冻结 AI-A 与 AI-B 标注探索性揭盲。它不修改或替代冻结的 31 节预注册、冻结的结果产生前操作规范（OPS）、任何一轮冻结 AI 标注或任何既有校验和。它不是预注册真人分析，也不确认或否定预注册真人假说。

The raw restricted analysis key, row-level M/Control mapping, joined item-level data, and AI workbooks remain private so that future preregistered human annotation is not compromised.

原始受限分析密钥、逐项 M／Control 映射、连接后的逐项数据和 AI 工作簿继续保持私有，以免破坏未来的预注册真人盲标。

## Integrity and analysis procedure｜完整性与分析程序

Before group comparisons, SHA-256 hashes were recomputed for all 14 artifacts in the Round 2 freeze manifest and all 5 artifacts in the AI annotation freeze manifest. There were **0 mismatches**.

在组间比较前，重新计算了 Round 2 冻结清单中全部 14 个文件和 AI 标注冻结清单中全部 5 个文件的 SHA-256；**不匹配数为 0**。

AI-A and AI-B were joined separately to the frozen key by `blind_id`. No labels were adjudicated, selected, pooled, averaged, or merged. The primary analysis used all 510 M items and all 510 pooled controls. The prespecified robustness analysis used only evidence-family representatives fixed before annotation: 385 M families and 475 Control families.

AI-A 与 AI-B 分别通过 `blind_id` 连接到冻结密钥。没有裁决、挑选、汇总、平均或合并任何标签。主要分析使用全部 510 个 M 项目和全部 510 个合并对照项目；预先规定的稳健性分析仅使用标注前固定的证据家族代表项：M 组 385 个家族，对照组 475 个家族。

For each pass, the primary effect is the absolute risk difference｜每一轮的主要效应为绝对风险差：

`P(HUMAN | M) − P(HUMAN | pooled Controls)`

The 95% interval is the two-sided Newcombe score interval without continuity correction. Fisher's exact test is reported one-sided for the frozen directional prediction (`M > Controls`) and two-sided for transparency. Supplemental odds ratios use ordinary sample odds ratios with Wald 95% intervals and do not determine the conclusion.

95% 区间采用不作连续性校正的双侧 Newcombe score 区间。Fisher 精确检验对冻结的方向性预测（`M > Controls`）报告单侧 p 值，并为透明性同时报告双侧 p 值。补充优势比采用普通样本优势比和 Wald 95% 区间，不用于决定结论。

## Primary HUMAN outcome — lexeme level｜主要 HUMAN 结果——词项层级

| Frozen AI pass｜冻结 AI 轮次 | M HUMAN | Control HUMAN｜对照 HUMAN | Absolute risk difference｜绝对风险差 | 95% CI | Fisher p, one-sided｜单侧 | Fisher p, two-sided｜双侧 | Odds ratio｜优势比 (95% Wald CI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| AI-A | 76/510 = 14.90% | 60/510 = 11.76% | +3.14 percentage points｜个百分点 | −1.05 to｜至 +7.33 pp | 0.0835 | 0.1669 | 1.31 (0.91–1.89) |
| AI-B | 79/510 = 15.49% | 61/510 = 11.96% | +3.53 percentage points｜个百分点 | −0.71 to｜至 +7.77 pp | 0.0608 | 0.1217 | 1.35 (0.94–1.93) |

Both frozen AI passes show a modest positive M-minus-Control difference. Neither two-sided 95% interval excludes zero, and neither directional Fisher test reaches 0.05. The passes therefore agree on direction and approximate magnitude but do not provide a conventionally decisive result.

两轮冻结 AI 标注都显示幅度较小的正向 M 减 Control 差异。两个双侧 95% 区间都包含 0，两个方向性 Fisher 检验也都未达到 0.05。因此两轮在方向和大致幅度上相符，但没有提供传统标准下的决定性结果。

## Preregistered/OPS-specified evidence-family robustness analysis｜预注册／OPS 指定的证据家族稳健性分析

| Frozen AI pass｜冻结 AI 轮次 | M HUMAN | Control HUMAN｜对照 HUMAN | Absolute risk difference｜绝对风险差 | 95% CI | Fisher p, one-sided｜单侧 | Fisher p, two-sided｜双侧 |
|---|---:|---:|---:|---:|---:|---:|
| AI-A | 61/385 = 15.84% | 59/475 = 12.42% | +3.42 percentage points｜个百分点 | −1.23 to｜至 +8.22 pp | 0.0901 | 0.1661 |
| AI-B | 62/385 = 16.10% | 60/475 = 12.63% | +3.47 percentage points｜个百分点 | −1.21 to｜至 +8.30 pp | 0.0883 | 0.1688 |

The fixed evidence-family analysis preserves the positive direction and nearly the same magnitude in both passes. Its intervals also include zero. Deduplication therefore does not erase or reverse the signal, but it does not make the signal statistically decisive.

固定证据家族分析在两轮中均保留正向方向和近似幅度，但其区间也包含 0。因此去重没有消除或逆转信号，也没有使其达到统计上的决定性标准。

## Frozen-category sensitivity analyses — lexeme level｜冻结类别敏感性分析——词项层级

These are secondary **Exploratory AI Results**. They probe documented semantic-boundary disagreements and do not replace HUMAN.

以下为次级 **Exploratory AI Results｜探索性 AI 结果**，用于检查已有记录的语义边界分歧，不能替代 HUMAN 主要结果。

| Category｜类别 | AI-A: M vs Control | AI-A RD (95% CI), two-sided p｜双侧 p | AI-B: M vs Control | AI-B RD (95% CI), two-sided p｜双侧 p |
|---|---:|---:|---:|---:|
| PERSON｜个人／人物 | 38/510 vs 34/510 | +0.78 pp (−2.41, +3.99), p=0.7141 | 71/510 vs 55/510 | +3.14 pp (−0.92, +7.20), p=0.1533 |
| PEOPLE｜人群／人民 | 38/510 vs 26/510 | +2.35 pp (−0.65, +5.41), p=0.1551 | 8/510 vs 6/510 | +0.39 pp (−1.18, +2.02), p=0.7891 |
| IDENTITY｜身份 | 66/510 vs 38/510 | +5.49 pp (+1.78, +9.24), p=0.0050 | 81/510 vs 61/510 | +3.92 pp (−0.34, +8.18), p=0.0854 |
| HUMAN-ATTRIBUTE｜人类属性 | 117/510 vs 129/510 | −2.35 pp (−7.59, +2.90), p=0.4208 | 79/510 vs 76/510 | +0.59 pp (−3.83, +5.01), p=0.8616 |
| UNCERTAIN｜不确定 | 0/510 vs 0/510 | 0.00 pp (−0.75, +0.75), p=1.0000 | 0/510 vs 1/510 | −0.20 pp (−1.10, +0.57), p=1.0000 |

The secondary categories show why they cannot be silently substituted for HUMAN. AI-A has a clear positive IDENTITY comparison, while AI-B's IDENTITY estimate is positive but less precise. PEOPLE and HUMAN-ATTRIBUTE counts differ substantially between passes, consistent with the earlier blinded agreement review. UNCERTAIN is too rare to be informative. The primary HUMAN outcome is much more stable across passes than these boundary categories.

次级类别说明了为什么不能把它们静默替换为 HUMAN。AI-A 的 IDENTITY 比较明显正向，AI-B 的 IDENTITY 估计也为正但精度较低。PEOPLE 和 HUMAN-ATTRIBUTE 在两轮之间差异较大，与此前盲态一致性审查相符。UNCERTAIN 极少，无法提供有效信息。主要 HUMAN 结果比这些边界类别稳定得多。

## Exploratory AI Result — interpretation｜探索性 AI 结果——解释

**Exploratory AI Result — Tentatively Supported.** Both independent frozen AI passes estimate a positive HUMAN difference of about 3–3.5 percentage points, and both fixed evidence-family analyses retain that direction and magnitude. However, all primary 95% intervals include zero and the directional p-values are 0.0608–0.0901. The exploratory evidence is therefore directionally compatible with M → HUMAN but remains uncertain and is not a confirmation.

**Exploratory AI Result — Tentatively Supported｜探索性 AI 结果——初步支持。** 两轮独立冻结 AI 标注都估计 HUMAN 存在约 3–3.5 个百分点的正向差异，两个固定证据家族分析也保留这一方向和幅度。然而，所有主要 95% 区间均包含 0，方向性 p 值为 0.0608–0.0901。因此，探索性证据在方向上与 M → HUMAN 相容，但仍不确定，不能视为确认。

**Preregistered Human Annotation: Pending｜预注册真人标注：待进行。** No preregistered human conclusion has been reached. Future human annotators must remain blind to the reusable item-level key and mappings.

尚未得到任何预注册真人结论。未来真人标注者必须继续对可复用的逐项密钥和映射保持盲态。

## Reproducibility and disclosure boundary｜可复现性与公开边界

The accompanying machine-readable JSON and CSV contain aggregate results only. Their canonical machine keys remain in English for compatibility, with additive Chinese metadata and labels. The bilingual-commented analysis code requires the separately held frozen private inputs. A restricted joined file was generated for private verification and is intentionally absent from this public-safe package. Public release files contain no raw `blind_id`, no surface-form/group map, no analysis-key rows, and no row-level AI labels.

随附的机器可读 JSON 和 CSV 仅包含汇总结果。为保持兼容性，其规范机器键保留英文，并增补中文元数据和标签。带双语注释的分析代码需要另行保存的冻结私有输入。一份受限连接文件曾用于私有验证，并被有意排除在公开安全包之外。公开文件不含原始 `blind_id`、词形／组别映射、分析密钥行或逐项 AI 标签。
