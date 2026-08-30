# Package G.2 — Calibration Source Verification + Object-Level AI Review Rubric v0.1

Date: 2026-08-30  
Scope: WATER and LANGUAGE calibration objects only  
Excluded: final decisions on the 19-record queue, publication actions, Experiment 003

## Outcome

G.2 adds reliable source boundaries without making an AI review decision. Source Verification may now say that a claim is source-backed, disputed, or still needs verification; every affected object's `ai_review.status` remains `not-reviewed`.

## LANGUAGE historical etymology

The verified chain is recorded as:

> English `language` ← Middle English `langage / language` ← Old French `langage` ← Old French `langue` ← Latin `lingua`

The American Heritage Dictionary gives Middle English from Old French `langage`, from `langue`, from Latin `lingua`. The Middle English Dictionary documents the Middle English form and senses. These sources support the lexical-history chain; they do not support `language ↔ 朗` as historical etymology.

Sources:

- American Heritage Dictionary, “language”: https://www.ahdictionary.com/word/search.html?q=language
- Middle English Dictionary, “langage”: https://quod.lib.umich.edu/m/middle-english-dictionary/dictionary/MED24625

Source Verification: `source-backed`  
AI Review: `not-reviewed`

## WATER W↔F/H phonetic claim

The author's observation remains preserved, but the statement that W and F are a voicing pair is contradicted by standard articulatory classification:

- `/w/` is a voiced labial-velar approximant;
- `/f/` is a voiceless labiodental fricative and pairs by voicing with `/v/`;
- `/h/` is a voiceless glottal fricative.

This does not prove that no language-specific W↔F or W↔H change can ever occur. It means that a general interchange cannot be inferred from “voiced/unvoiced consonants.” A historical correspondence requires repeated comparative forms, named languages/stages and plausible chronology.

Sources:

- International Phonetic Association, official IPA chart: https://www.internationalphoneticassociation.org/content/ipa-chart
- Cambridge University Press, “Historical Linguistics,” DOI 10.1017/9781108344326.020: https://doi.org/10.1017/9781108344326.020

Source Verification: `disputed`  
AI Review: `not-reviewed`

## L history split into two hypotheses

### L glyph-history hypothesis

Research on early alphabetic inscriptions supports an Egyptian contact context and acrophonic use of foreign sign names. Later transmission through Phoenician to Greek is well supported at the system level. A scholarly comparison associates L with Semitic `lamd/lamed`, Greek `lambda`, and an “ox-goad” letter-name meaning, while offering alternative Egyptian sign candidates with explicit uncertainty.

Therefore the system records a historical glyph-lineage hypothesis separately. It does not state that one exact Egyptian hieroglyph for L has been conclusively identified.

Sources:

- Darnell et al., *Two Early Alphabetic Inscriptions from the Wadi el-Hol* publication record: https://nelc.yale.edu/publications/two-early-alphabetic-inscriptions-wadi-el-hol-new-evidence-origin-alphabet-western
- Höflmayer et al., “Early alphabetic writing in the ancient Near East,” *Antiquity* 95 (2021): https://www.cambridge.org/core/journals/antiquity/article/early-alphabetic-writing-in-the-ancient-near-east-the-missing-link-from-tel-lachish/C73F769B7CF3A7E4E2607958A096B7D8
- Brian E. Colless, “The Origin of the Alphabet: An Examination of the Goldwasser Hypothesis,” *Antiguo Oriente* 12 (2014), 71–104: https://repositorio.uca.edu.ar/bitstream/123456789/6787/4/origin-alphabet-goldwasser-hypothesis.pdf

Source Verification: `disputed` at the precise-sign level  
AI Review: `not-reviewed`

### L inherent-semantic hypothesis

Even if `lamed` historically had an object-name association, that does not demonstrate that modern English `/l/` or the Latin letter L carries the same semantic value across words. This remains a separate sound/letter-semantic hypothesis requiring:

1. an operational semantic category;
2. a preregistered L-word sample;
3. matched control initials;
4. blinded annotation;
5. a decision rule that allows null or negative results.

Source Verification: `needs-verification`  
AI Review: `not-reviewed`

## Object-level AI Review rubric

The machine-readable method is `data/review/object-review-rubric.g2.v0.1.json`. It reviews one object at a time and requires:

- exact object identity;
- claim-to-source fit;
- support and non-support boundaries;
- counterevidence;
- calibrated confidence;
- type-specific checks;
- signed reviewer metadata and rationale;
- no change to publication status.

An AI review of an etymology cannot review its mapping by proxy. An experiment cannot review a hypothesis by proxy. `Reviewed-by-AI` remains distinct from `Published`, which continues to require the separate Package G human publication gate.
