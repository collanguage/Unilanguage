# UNI-EXP-002 — Preregistered Design v1.0

**Title:** W → WATER / WETNESS / WAVE-FLOW Semantic Concentration  
**Framework:** Unilanguage Hypothesis Evaluation System  
**Pipeline:** Blind Evaluation Pipeline v1.0  
**Status:** FROZEN — PREREGISTERED DESIGN  
**Freeze date:** 2026-08-27

This file records the design freeze. Implementation records must cite it and must not overwrite it.

## Research question and scope

Does the proportion of Direct-Target independent lexical families among eligible orthographic W-initial modern-English items exceed the corresponding proportion among preregistered pooled eligible non-W consonant controls?

The experiment tests statistical semantic concentration. It does not test whether W itself means water, whether W's shape originated as a wave, or whether W words share an ancient origin.

## Frozen semantic endpoint

A conventional lexical sense is a **Direct Target** only when it directly encodes one of:

- **A — WATER:** water, a body of water, or the presence/state of water;
- **B — WETNESS / WATER-CONTACT:** wetness, soaking, washing, or direct water/liquid-contact state or process;
- **C — WAVE / FLOW:** wave, flow, oscillation, or undulating movement as a lexical phenomenon.

Codes are `1 = Direct Target`, `2 = Associated/Borderline`, `0 = Not Target`, and `U = Unclear`. Only code `1` enters the primary endpoint.

Habitat, typical use, material composition, cultural association, incidental real-world knowledge, and merely being a liquid substance do not make a sense a Direct Target. Thus habitat examples such as *whale* and liquid substances such as *wine* do not qualify merely by association. Pure metaphorical extensions do not create new independent evidence.

## Sampling and independence

- Source: a frozen local copy of the public SUBTLEX-US frequency data.
- Population: reproducibly standardized modern-English lexical items derived from that source.
- Sampling unit: lemma.
- Annotation unit: conventional lexical sense.
- Primary independence unit: deduplicated lexical family.
- W and controls come from the same population and the same eligibility rules.
- Sampling is frequency-stratified and random.
- Proper nouns, abbreviations, codes, product names, and purely inflectional duplicates are excluded under frozen implementation rules.
- No researcher-selected example may be added. Previously discussed examples including *water*, *wave*, *wet*, *wash*, and *wavelength* enter only if selected by the formal procedure.

Target sample sizes are 120 W families and 240 control families (1:2; total 360). The design reference scenario is p(C)=.05 versus p(W)=.15, alpha=.05, two-sided, with target power at least .80 subject to exact-test verification. The 5% control prevalence is a design parameter, not an empirical claim. If fewer than 120 eligible W families exist, all eligible W families are retained and controls are sampled at 2:1 where feasible; the population is not expanded merely to reach N.

## Controls

- Primary: W versus pooled eligible non-W consonant initials.
- Robustness A: frequency-matched non-W controls.
- Robustness B: repeated random consonant-control sets.
- Exploratory only: phonologically or historically related controls such as V.

Secondary and exploratory controls cannot replace or upgrade the primary result.

## Family deduplication

Transparent derivatives, compounds inheriting target semantics from the same constituent, and clearly documented near-level stem/cognate families contribute at most one observation. Deep historical relatedness alone does not trigger merging. Family assignment must be completed without access to semantic target labels. A family can contribute at most one Direct-Target vote.

## Hypothesis-blind annotation

Two independent annotators classify randomized items using the frozen rules. They may see anonymous item ID, lemma, standardized dictionary senses, and necessary part-of-speech information. They may not see the hypothesis, group label, sampling stratum, aggregate counts, family-level outcome, or each other's judgments. They may not consult etymology for semantic labels. Disagreements are preserved and resolved by a third hypothesis-blind adjudicator using the same rules. Raw agreement and an appropriate chance-corrected agreement statistic are reported.

The accurate term is **hypothesis-blind independent semantic annotation**, not fully double-blind annotation.

## Primary statistics

The frozen 2×2 family table compares W versus Controls by Direct Target versus Non-Target. Report:

- uncorrected Risk Ratio (RR);
- Risk Difference (RD);
- preregistered 95% confidence intervals;
- two-sided Fisher's exact p-value at alpha=.05.

If a required RR cell is zero, Fisher's exact test remains primary. Report the uncorrected RR as zero, infinite, or undefined as appropriate, plus RD and an explicitly labeled continuity-corrected RR sensitivity estimate. The corrected value never replaces the raw estimate.

There is one preregistered primary test and no multiplicity adjustment for that test. All lemma-level, frequency-stratified, Borderline-inclusive, random-control, V-control, and other tests are secondary, robustness, sensitivity, or exploratory and cannot independently upgrade the primary status.

## Decision rule and SESOI

The minimum theoretically meaningful enrichment is RR=2.0. A result is **SUPPORTED** only when RR>1, the preregistered 95% RR interval excludes 1, and the two-sided Fisher p-value is below .05. Statistical-method inconsistency is not automatically Supported.

If the primary result is not Supported and its interval permits both RR=1 and RR>=2, status is **INCONCLUSIVE**. If the interval excludes RR>=2, or a sufficiently clear result is at or below RR=1, status is **NOT SUPPORTED**. A protocol breach that invalidates inference yields **INVALID / PROTOCOL FAILURE**.

## No Rescue and publication rules

A failed primary result cannot be rescued by expanding the semantic domain, adding Borderline items, deleting counterexamples, adding W words, changing family boundaries, selecting a favorable frequency stratum or control, or replacing the primary statistic. Such work is labeled post-hoc exploratory.

The preregistration and final result remain public whether the outcome is Supported, Inconclusive, Not Supported, or Invalid.

