# UNI-EXP-002 — Public-Safe Result Summary v1.1

# UNI-EXP-002 — 公开安全结果摘要 v1.1

**Final status / 最终状态：** RESULT FREEZE v1.0 — FROZEN / 结果冻结 v1.0 — 已冻结  
**Primary outcome / 主结果：** **INCONCLUSIVE / 不确定**  
**Annotation boundary / 标注边界：** **Machine-based exploratory blind annotation — not human double-blind validation. / 基于机器的探索性盲标注——不是真人双盲验证。**

---

## Preregistered primary result

## 预注册主结果

The primary analysis used the 360 frozen, deduplicated lexical families. Only the final `1 = Direct Target` label counted as Target.

主分析使用了 360 个已经冻结并完成去重的词汇家族。只有最终标签 `1 = Direct Target（直接目标）` 被计为 Target。

| Group / 组别 | Direct Target / 直接目标 | Non-Target / 非目标 | Total / 总数 | Proportion / 比例 |
|---|---:|---:|---:|---:|
| W | 7 | 113 | 120 | 5.83% |
| Pooled Controls / 合并对照组 | 9 | 231 | 240 | 3.75% |

- **Risk Ratio (RR) / 风险比：1.556**
- **RR 95% CI / RR 95% 置信区间：0.594–4.075**
- **Risk Difference (RD) / 风险差：0.0208**（2.08 percentage points / 2.08 个百分点）
- **RD 95% CI / RD 95% 置信区间：−0.0412–0.0957**
- **Two-sided Fisher exact p-value / 双侧 Fisher 精确检验 p 值：0.4185**
- **Alpha / 显著性水平：.05**
- **SESOI / 最小理论意义效应：RR=2.0**

The result does not satisfy the preregistered requirements for **SUPPORTED**: the RR interval includes 1 and the Fisher p-value is above .05. The interval also allows both no enrichment and enrichment at or above RR=2.0. Therefore, the unique primary outcome is **INCONCLUSIVE**. Secondary analyses cannot change this outcome.

结果没有达到预注册的 **SUPPORTED（支持）** 标准：RR 置信区间包含 1，而且 Fisher p 值高于 .05。同时，该区间既允许“没有富集效应”，也仍允许 RR≥2.0 的理论意义效应。因此，唯一正式主结论是 **INCONCLUSIVE（不确定）**。任何次要分析都不能改变这一主结论。

---

## Robustness and sensitivity

## 稳健性与敏感性分析

- **High frequency / 高频层：** W 3/40 vs Controls 7/80；RR=0.857；Fisher p=1.000。
- **Middle frequency / 中频层：** W 4/40 vs Controls 2/80；RR=4.000；Fisher p=0.0945。
- **Lower frequency / 低频层：** W 0/40 vs Controls 0/80；raw RR undefined / 原始 RR 无法定义；Fisher p=1.000。
- **Borderline-inclusive sensitivity / 包含 Borderline 的敏感性分析：** W 9/120 vs Controls 12/240；RR=1.500；95% CI 0.650–3.461；Fisher p=0.3478。
- Recalculation using AI-A raw, AI-B raw, or final adjudicated labels produced the same primary classification: **INCONCLUSIVE**.  
  使用 AI-A 原始标签、AI-B 原始标签或最终裁决标签重新计算，主结果分类均为 **INCONCLUSIVE（不确定）**。

The frozen implementation did not specify the repetition count or resampling algorithm needed for a repeated random-control/null-distribution analysis, and it did not contain semantic labels for unsampled control families. These elements were not invented after unblinding. V-control analysis was also not run because no frozen V annotations exist.

冻结实现没有规定 repeated random-control/null-distribution 分析所需的重复次数或重抽样算法，也没有为未抽样的对照词族提供冻结语义标签。因此，揭盲后没有临时发明这些规则。由于不存在冻结的 V-control 标注，V 对照分析也没有运行。

The frozen sample contains one annotated representative lemma per family. A distinct raw lemma-level result cannot be estimated without adding an unfrozen rule that propagates family labels to unannotated family members.

冻结样本中，每个词族只有一个接受标注的代表性 lemma。若不新增一条未经冻结的规则、把词族标签传播到未标注的同族词，就无法获得独立的 raw lemma-level 结果。

---

## Annotation robustness

## 标注稳健性

- **AI-A / AI-B exact agreement / 完全一致：357/360（99.17%）**
- **Unweighted Cohen’s κ / 未加权 Cohen’s κ：0.98048**
- **Disagreements adjudicated / 完成裁决的分歧：3/3**

These metrics describe reproducibility between machine annotation runs. They are not evidence of human validation.

这些指标描述的是不同机器标注运行之间的可重复性，不能被表述为真人验证证据。

---

## Protocol deviation assessment

## 协议偏差评估

The audit trail permanently retains the known minor deviation: AI-B was initially dispatched too early. That dispatch was stopped before producing any output. The usable AI-B run began fresh only after AI-A had frozen. No condition exposure, A/B data sharing, design change, or analysis change was found. The deviation is assessed as minor and contained and does not invalidate the primary inference.

审计记录永久保留了已知的轻微偏差：AI-B 曾被过早派发，但该次运行在产生任何输出之前已经停止。正式采用的 AI-B 是在 AI-A 冻结后重新独立启动的全新运行。没有发现 condition 暴露、A/B 数据共享、设计变更或分析变更。因此，该事件被评定为已经控制的轻微流程偏差，不会使主分析失效。

---

## Interpretation boundary

## 结论边界

Experiment 002 did not establish statistically reliable W enrichment for WATER / WETNESS / WAVE-FLOW semantics under the frozen primary endpoint. It also did not estimate the effect precisely enough to rule out the preregistered meaningful enrichment threshold.

在冻结的主终点下，Experiment 002 没有建立具有统计可靠性的 W → WATER / WETNESS / WAVE-FLOW 语义富集证据；但目前的估计精度也不足以排除预注册的理论意义效应阈值。

This is an **inconclusive result**. It is not evidence that W “means water,” not proof about the historical origin of the letter W, and not human double-blind validation.

这是一个 **不确定结果**。它不能证明 W“表示水”，不能证明字母 W 的历史起源，也不是真人双盲验证。

Negative, null, and inconclusive results remain publicly reportable under the frozen publication rule.

按照冻结的发布规则，负结果、零结果和不确定结果都必须保留并公开报告。
