# Decision Log — Exploratory AI Unblinding v1.0｜决策记录——探索性 AI 揭盲 v1.0

**Status label required on every conclusion｜每项结论必须使用的状态标签：** `Exploratory AI Result｜探索性 AI 结果`

**Preregistered Human Annotation｜预注册真人标注：** `Pending｜待进行`

1. **Analyze AI-A and AI-B separately.** No pass selection, outcome-dependent pooling, adjudication, or silent consensus label is permitted.<br>
   **分开分析 AI-A 与 AI-B。** 不得挑选轮次、依据结果合并、裁决或静默建立共识标签。
2. **Primary outcome:** frozen binary `human` label at the lexeme/token level, comparing all 510 M items with all 510 pooled controls.<br>
   **主要结果：** 词项／token 层级的冻结二元 `human` 标签；比较全部 510 个 M 项目与全部 510 个合并对照项目。
3. **Primary effect:** absolute risk difference `P(HUMAN|M) - P(HUMAN|Controls)` with a two-sided 95% Newcombe score interval. A sample odds ratio with a clearly labeled two-sided Wald interval may be reported as supplemental and does not determine the conclusion.<br>
   **主要效应：** 绝对风险差 `P(HUMAN|M) - P(HUMAN|Controls)`，采用双侧 95% Newcombe score 区间。可补充报告带明确标签的样本优势比及双侧 Wald 区间，但它不决定结论。
4. **Hypothesis test:** Fisher's exact test on the 2×2 table. Report the directional one-sided p-value (`M > Controls`) and the two-sided p-value. No multiple-pass result selection is allowed.<br>
   **假设检验：** 对 2×2 表使用 Fisher 精确检验，同时报告方向性单侧 p 值（`M > Controls`）和双侧 p 值；不得从多轮结果中挑选。
5. **Preregistered/OPS robustness analysis:** evidence-family analysis using only the representative fixed before annotation (`family_representative`), corresponding to frozen preregistration section 14 and OPS-EF-01.<br>
   **预注册／OPS 稳健性分析：** 仅使用标注前固定的证据家族代表项（`family_representative`），对应冻结预注册第 14 节和 OPS-EF-01。
6. **Protocol-justified semantic sensitivities:** repeat comparisons for `people`, `identity`, `human_attribute`, and `uncertain`; report `person` for completeness because it is a frozen category and documented disagreement boundary. These are secondary exploratory outcomes and do not replace HUMAN.<br>
   **协议允许的语义敏感性分析：** 分别重复比较 `people`、`identity`、`human_attribute` 和 `uncertain`；为完整性同时报告 `person`，因为它是冻结类别和已有记录的分歧边界。这些是次级探索性结果，不能替代 HUMAN。
7. **No post-unblinding exclusions.** All 1,020 items remain in the primary analysis. No control letter is dropped, and no disagreement is adjudicated after identities are known.<br>
   **揭盲后不得排除。** 全部 1,020 个项目保留在主要分析中；不删除任何对照字母，也不在知道身份后裁决分歧。
8. **Public privacy boundary:** publish aggregates only. Do not publish the raw key, joined item-level data, group-linked counterexample lists, or row-level AI labels while preregistered human annotation remains pending.<br>
   **公开隐私边界：** 仅发布汇总结果。在预注册真人标注仍待进行期间，不公开原始密钥、连接后的逐项数据、带组别的反例清单或逐项 AI 标签。
9. **Conclusion vocabulary:** interpretation may state that exploratory AI passes support, fail to support, or contradict M → HUMAN. It may not confirm or reject the preregistered human hypothesis.<br>
   **结论用语：** 可以说明探索性 AI 轮次支持、未能支持或与 M → HUMAN 相矛盾；不得确认或否定预注册真人假说。
10. **Experiment boundary:** do not start Experiment 001B.<br>
    **实验边界：** 不启动 Experiment 001B。

## Implementation clarification｜实施说明

The original entry for decision 3 incorrectly named a conditional odds-ratio interval that the dependency-free implementation did not calculate. The wording was corrected after the first analysis run. The implemented and reported primary risk difference, Newcombe interval, Fisher tests, inputs, and conclusions were not changed. Supplemental odds-ratio intervals are explicitly labeled Wald intervals and are not used for the decision.

决策 3 的原始表述误写了一种无依赖实现并未计算的条件优势比区间。第一次分析运行后修正了措辞；已实现并报告的主要风险差、Newcombe 区间、Fisher 检验、输入和结论均未改变。补充优势比区间明确标为 Wald 区间，不用于作出结论。
