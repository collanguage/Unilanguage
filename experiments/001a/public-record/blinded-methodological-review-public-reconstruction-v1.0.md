# AI Agreement & Disagreement Analysis｜AI 一致性与分歧分析

## Experiment 001A Round 2 — Blinded Methodological Review｜盲态方法审查

**Document status:** Public-safe historical reconstruction v1.0

**文件状态：** 公开安全历史重建版 v1.0

**Experiment:** `UNI-EXP-001A-R2`

**Historical review stage:** Exploratory AI Annotation — still blinded

**历史审查阶段：** 探索性 AI 标注——仍处于盲态

**Evidence base:** 1,020 paired blind items; frozen aggregate AI-A/AI-B outputs

**证据基础：** 1,020 个配对盲态词项；已冻结的 AI-A/AI-B 汇总输出

**Human annotation at review:** `Preregistered Human Annotation: Pending`

**审查时真人标注状态：** `预注册真人标注：待进行`

**Historical review date:** 24 August 2026

**历史审查日期：** 2026 年 8 月 24 日

**Reconstruction note:** This public file was assembled after exploratory AI unblinding from the preserved blinded diagnostics and the documented pre-unblinding methodological decision. It records the earlier blind-state review but does not claim that this exact Markdown file was itself frozen before unblinding. No M/Control identities, row-level annotations, or reusable blind-breaking material are included.

**重建说明：** 本公开文件是在探索性 AI 揭盲之后，根据保存下来的盲态诊断结果及已记录的揭盲前方法决策整理而成。它记录此前的盲态审查，但不声称这份具体的 Markdown 文件在揭盲前已经被冻结。文件不包含 M/对照组身份、逐项标注或可重复使用的破盲材料。

> **Historical recommendation recorded before unblinding: PROCEED TO EXPLORATORY AI UNBLINDING.** The broad HUMAN field was exceptionally robust (99.61% raw agreement; κ=0.9832; four disagreements). The 81.18% exact six-label-vector rate was judged adequate for an explicitly exploratory analysis because it is a strict six-field criterion and the remaining disagreement was concentrated in interpretable category boundaries. The two frozen passes were to be reported separately, PEOPLE and HUMAN-ATTRIBUTE treated as sensitivity-limited secondary fields, and preregistered human annotation kept pending.

> **揭盲前记录的历史建议：进入探索性 AI 揭盲。** HUMAN 核心字段表现出极高稳健性（原始一致率 99.61%；κ=0.9832；仅 4 个分歧）。完整六标签向量一致率为 81.18%；由于这是严格的六字段同时一致标准，且其余分歧主要集中在可解释的类别边界，因此足以支持明确标注为“探索性”的分析。两份冻结 AI 结果必须分别报告；PEOPLE 与 HUMAN-ATTRIBUTE 应作为受一致性限制的次级敏感性字段；预注册真人标注继续保持待进行。

The recommendation above was methodological, not a finding about M → HUMAN. The subsequent unblinding was separately authorized and is reported in `Exploratory AI Unblinding v1.0`.

上述建议属于方法决策，并不是关于 M → HUMAN 的实验发现。其后的揭盲另行获得授权，并记录于 `Exploratory AI Unblinding v1.0`。

## 1. Review question and protected boundary｜审查问题与受保护边界

The review asked whether the frozen AI-A and AI-B annotations were sufficiently reproducible to justify opening a separate exploratory unblinding stage. It did not test the M hypothesis and did not estimate any M-versus-Control outcome rate.

本次审查的问题是：被冻结的 AI-A 与 AI-B 标注是否具有足够的可重复性，从而允许开启一个独立的探索性揭盲阶段。该审查不检验 M 假说，也不估计任何 M 组与对照组的结果率。

**Protected boundary at the time of review:** the restricted analysis key was not accessed; experimental and control identities were not used; no row-level disagreement was adjudicated; no frozen coding rule was changed; no frozen annotation file was edited; the 31-section preregistration remained unchanged; and Experiment 001B was not started.

**审查当时的受保护边界：** 未访问受限分析密钥；未使用实验组或对照组身份；未裁决逐项分歧；未修改任何冻结编码规则；未编辑任何冻结标注文件；31 节预注册保持不变；未启动 Experiment 001B。

## 2. What 81.18% means｜81.18% 的含义

AI-A and AI-B produced the same complete six-label vector for **828 of 1,020** paired blind items:

在 1,020 个配对盲态词项中，AI-A 与 AI-B 对其中 **828 个**给出了完全相同的六标签向量：

- exact-vector agreement｜完整向量一致率：**81.18%**；
- exact-vector disagreements｜完整向量分歧：**192**；
- Wilson 95% confidence interval｜Wilson 95% 置信区间：约 **78.66%–83.46%**。

This is stricter than agreement on HUMAN alone: a row counted as an exact-vector disagreement if either pass differed on any one of HUMAN, PERSON, PEOPLE, IDENTITY, HUMAN-ATTRIBUTE, or UNCERTAIN.

这一标准比仅检查 HUMAN 是否一致更严格：只要两轮标注在 HUMAN、PERSON、PEOPLE、IDENTITY、HUMAN-ATTRIBUTE 或 UNCERTAIN 中任一字段不同，该词项就被计为完整向量分歧。

## 3. Agreement by frozen field｜各冻结字段的一致性

| Frozen field｜冻结字段 | Paired n｜配对数 | Raw agreement｜原始一致率 | Cohen's κ | AI-A positives｜阳性数 | AI-B positives｜阳性数 | Disagreements｜分歧数 |
|---|---:|---:|---:|---:|---:|---:|
| HUMAN | 1,020 | 99.61% | 0.9832 | 136 | 140 | 4 |
| PERSON | 1,020 | 94.71% | 0.7004 | 72 | 126 | 54 |
| PEOPLE | 1,020 | 94.31% | 0.2393 | 64 | 14 | 58 |
| IDENTITY | 1,020 | 96.27% | 0.8249 | 104 | 142 | 38 |
| HUMAN-ATTRIBUTE | 1,020 | 88.92% | 0.6536 | 246 | 155 | 113 |
| UNCERTAIN | 1,020 | 99.90% | 0.0000 | 0 | 1 | 1 |

## 4. Why high agreement and low κ can coexist｜为何高一致率可与低 κ 并存

Cohen's κ depends on expected agreement under the observed marginal label frequencies. PEOPLE and UNCERTAIN were highly imbalanced: positive labels were rare and differed sharply between passes. Under such prevalence imbalance, raw agreement can remain high while κ is low or zero. The review therefore retained raw agreement, positive counts, disagreements, and 2×2 cross-tabulations rather than interpreting κ alone.

Cohen's κ 取决于观察到的边际标签频率所对应的期望一致率。PEOPLE 与 UNCERTAIN 存在高度不平衡：阳性标签很少，而且两轮之间差异明显。在这种流行率不平衡下，原始一致率可能仍然很高，而 κ 却较低甚至为 0。因此，本审查同时保留原始一致率、阳性数、分歧数与 2×2 列联表，而不单独依赖 κ。

For HUMAN, this limitation was not material: positive counts were similar between passes, raw agreement was 99.61%, and κ was 0.9832.

对于 HUMAN，这一局限并不明显：两轮阳性数接近，原始一致率为 99.61%，κ 为 0.9832。

## 5. Where disagreements occurred｜分歧发生在哪里

- **HUMAN-ATTRIBUTE｜人类属性：** 分歧最多，共 113 个。主要边界是“与人相关的属性或行为”和“直接指称人”之间的区别。
- **PEOPLE｜人群／集合人类：** 58 个分歧，并有明显边际不平衡，反映“人类集合”与更广泛群体／类别之间的边界。
- **PERSON｜个人／人物类型：** 54 个分歧，通常涉及个体人或人物类型的边界。
- **IDENTITY｜身份：** 38 个分歧，涉及角色、职业、地位、头衔、亲属关系或公认社会身份。
- **HUMAN｜人类：** 仅 4 个分歧；主要语义字段稳定。
- **UNCERTAIN｜不确定：** 仅 1 个分歧，阳性数过少，κ 不具信息量。

The pattern was interpretable semantic-boundary disagreement rather than broad random inconsistency.

总体模式属于可解释的语义边界分歧，而不是广泛的随机不一致。

## 6. Historical methodological decision｜历史方法决策

The blinded review concluded that the frozen AI annotations were adequate for an **explicitly exploratory** unblinding because:

盲态审查认为，冻结 AI 标注足以进入一个**明确标为探索性**的揭盲阶段，理由如下：

1. the primary HUMAN label was exceptionally stable｜主要 HUMAN 标签极其稳定；
2. the stricter full-vector agreement was above 80% with a reasonably narrow interval｜更严格的完整向量一致率超过 80%，区间宽度合理；
3. disagreements were concentrated in known secondary-category boundaries｜分歧集中在已知的次级类别边界；
4. both original passes could be retained and analyzed separately｜两份原始标注可以完整保留并分别分析；
5. no group identity or outcome had been used to reach the decision｜作出决策时未使用任何分组身份或结果。

The review did not authorize replacing the preregistered human analysis, selecting the more favorable AI pass, silently merging the passes, changing frozen definitions, or starting Experiment 001B.

该审查不授权以 AI 结果替代预注册真人分析，不允许挑选更有利的一轮 AI 标注、静默合并两轮结果、修改冻结定义或启动 Experiment 001B。

## 7. Required conditions carried into unblinding｜带入揭盲阶段的必要条件

- analyze AI-A and AI-B separately before comparison｜比较前分别分析 AI-A 与 AI-B；
- retain all frozen items and original labels｜保留全部冻结词项和原始标签；
- report denominators, counts, rates, effect sizes, confidence intervals, and tests｜报告分母、计数、比例、效应量、置信区间与检验；
- retain evidence-family robustness analysis｜保留证据家族稳健性分析；
- treat PEOPLE, IDENTITY, HUMAN-ATTRIBUTE, PERSON, and UNCERTAIN only as labeled secondary sensitivities｜PEOPLE、IDENTITY、HUMAN-ATTRIBUTE、PERSON 与 UNCERTAIN 仅作为明确标注的次级敏感性分析；
- label every conclusion `Exploratory AI Result`｜所有结论均标为 `Exploratory AI Result｜探索性 AI 结果`；
- retain `Preregistered Human Annotation: Pending`｜保持 `Preregistered Human Annotation: Pending｜预注册真人标注：待进行`；
- keep the restricted key and row-level identity mapping private｜继续将受限密钥与逐项身份映射保密。

## 8. Subsequent status｜后续状态

The separately authorized exploratory unblinding was later completed. Its public conclusion is **Exploratory AI Result — Tentatively Supported**. This subsequent result does not retrospectively alter the blind-state diagnostics or convert them into evidence for the preregistered human conclusion.

其后另行授权的探索性揭盲已经完成，公开结论为 **Exploratory AI Result — Tentatively Supported｜探索性 AI 结果——初步支持**。这一后续结果不会追溯性修改盲态诊断，也不会把盲态诊断转化为预注册真人结论的证据。

**Preregistered Human Annotation: Pending.**

**预注册真人标注：待进行。**

**Experiment 001B started: No.**

**Experiment 001B 是否启动：否。**
