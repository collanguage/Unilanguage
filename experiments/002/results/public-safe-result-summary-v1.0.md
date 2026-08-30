# UNI-EXP-002 — Public-Safe Result Summary v1.0

**Final status:** RESULT FREEZE v1.0  
**Primary outcome:** **INCONCLUSIVE**  
**Annotation boundary:** **Machine-based exploratory blind annotation — not human double-blind validation.**

## Preregistered primary result

The analysis used the 360 frozen, deduplicated lexical families and only the final `1 = Direct Target` label.

| Group | Direct Target | Non-Target | Total | Proportion |
|---|---:|---:|---:|---:|
| W | 7 | 113 | 120 | 5.83% |
| Pooled Controls | 9 | 231 | 240 | 3.75% |

- Risk Ratio (RR): **1.556**
- RR 95% CI (preregistered Katz log interval): **0.594 to 4.075**
- Risk Difference (RD): **0.0208** (2.08 percentage points)
- RD 95% CI (preregistered Newcombe-Wilson interval): **−0.0412 to 0.0957**
- Two-sided Fisher exact p-value: **0.4185**
- Alpha: **.05**
- SESOI: **RR=2.0**

The result does not meet the preregistered requirements for Supported: the RR interval includes 1 and Fisher p is above .05. The interval also permits both no enrichment and enrichment at or above the SESOI, so the unique primary outcome is **INCONCLUSIVE**. Secondary analyses cannot change this outcome.

## Robustness and sensitivity

- High frequency: W 3/40 vs Controls 7/80; RR=0.857; Fisher p=1.000.
- Middle frequency: W 4/40 vs Controls 2/80; RR=4.000; Fisher p=0.0945.
- Lower frequency: W 0/40 vs Controls 0/80; raw RR undefined; Fisher p=1.000.
- Borderline-inclusive sensitivity (`1` or `2`): W 9/120 vs Controls 12/240; RR=1.500; 95% CI 0.650–3.461; Fisher p=0.3478.
- AI-A raw, AI-B raw, and final adjudicated labels all produce the same primary classification: **INCONCLUSIVE**.

The frozen implementation did not define a repetition count/resampling algorithm or provide labels for unsampled controls, so a repeated random-control/null-distribution analysis was not invented after unblinding. V-control analysis was likewise not run because no frozen V annotations exist. The frozen sample contains one annotated representative per family, so a distinct raw lemma-level analysis cannot be estimated without an unfrozen label-propagation rule.

## Annotation and deviation record

AI-A and AI-B agreed on 357/360 items (99.17%); unweighted Cohen's kappa was 0.98048. Three disagreements were independently adjudicated. These values describe machine annotation reproducibility and are **not human validation**.

The preserved minor deviation is that AI-B was initially dispatched too early, but the dispatch was stopped before producing output. The usable AI-B run was restarted fresh only after AI-A froze. No condition exposure, A/B data sharing, design change, or analysis change is evidenced; the deviation does not invalidate the primary inference.

## Interpretation boundary

Experiment 002 did not establish statistically reliable W enrichment for WATER / WETNESS / WAVE-FLOW semantics under the frozen primary endpoint. It also did not estimate the effect precisely enough to rule out the preregistered meaningful enrichment threshold. This is an inconclusive result, not evidence that W “means water,” and not a human double-blind validation.
