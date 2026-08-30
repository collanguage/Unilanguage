# Package G.1 — Semantic Mapper Classification Model Refactor v0.1

Date: 2026-08-30  
Status: implemented; calibration records are not AI-reviewed or automatically published

## Core rule

> One English word → one primary Chinese mapping → separate historical etymology → separate sound-semantic hypothesis → separate experimental validation.

The model never uses a cross-language resemblance as an etymology, never stores an experiment as a mapping, and never treats an author hypothesis as a fact. Source Verification and AI Review are separate review records attached to each evidence object.

## Record layers

- **A. Primary Chinese Mapping:** exactly one primary Chinese form. Any additional Chinese forms are secondary objects.
- **B. Mapping Rationale / Author Idea:** the author's reason for proposing a mapping; identity remains `author-idea`.
- **C. Historical Etymology:** a historical chain requiring historical-linguistic sources. Cross-language similarity is excluded.
- **D. Sound / Consonant / Symbol Hypotheses:** independent registry objects with type, status, evidence references, confidence and reviews.
- **E. Other Author Notes:** material preserved as `needs-classification` when migration cannot classify it reliably.
- **F. Experimental Validation:** an actually executed experiment with tested condition, result, status and explicit hypothesis references.
- **G. Object-level Reviews:** every mapping, rationale, etymology, hypothesis, note and experiment carries separate `source_verification` and `ai_review` records.

## WATER calibration

`water ↔ 哗 huā` is an author-proposed primary candidate, motivated by the auditory association of `哗哗流水`. It is not a standard translation and is not a historical claim. `水 shuǐ` remains a separate secondary lexical equivalent.

Two hypothesis objects are linked:

1. possible W ↔ F/H phonetic/consonantal relation — `Untested`, low confidence, needs comparative phonological verification;
2. W-initial WATER / WETNESS / WAVE-FLOW semantic-family enrichment — linked to Experiment 002.

Experiment 002 is an independent validation object. Its frozen status remains `Tested-Inconclusive`; the direction was compatible with the hypothesis, but it did not establish enrichment or a universal W sound law.

## LANGUAGE calibration

`language ↔ 朗 lǎng` is an author-proposed primary candidate. Its rationale records the cognitive association with `朗读` and `朗朗上口`. It is explicitly not the historical origin of English `language`. The ordinary Chinese lexical equivalent `语言 yǔyán` remains a separate secondary mapping.

The historical chain `English language ← Old French langage ← Latin lingua` is stored in the Etymology layer and marked `needs-authoritative-source` until a reliable historical reference is attached.

The idea that L sound / letter L may carry an inherent semantic association, including a possible ancient-Egyptian pictorial-sign-to-letter history, is stored only as an `Untested` author hypothesis. No established Egyptian meaning is asserted. The longer `lang/朗/亮/廊/浪/良/粮/梁/凉/力/量` stream is preserved under Other Author Notes pending finer classification.

## Migration from v0.2

The reproducible migration is `scripts/migrate-classification-g1.mjs` and writes `data/language-book.v0.3.json`.

- The mixed `candidate_cross_language_mappings` array is removed from v0.3.
- Chinese primary and secondary mappings are separated.
- French counterparts formerly embedded in Chinese mapping strings are retained as classified author notes.
- Historical caveats formerly embedded in mapping objects are no longer used as an etymology field.
- Hypothesis mappings move to the independent hypothesis registry.
- The W research-condition entry moves into a WATER word record, while its substantive W-family content remains in the hypothesis and experiment layers.
- Existing source pages and published lexical objects retain their prior status. New WATER/LANGUAGE calibration objects remain Candidate and `not-reviewed`.
- The separate 19-record Package E/F/G queue remains unchanged: no final decision and no publication action occurs in G.1.

## Review and publication boundary

G.1 changes classification, not review outcomes. `source_verification.status` reports source work for one object. `ai_review.status` reports a separate AI assessment for that same object. Neither field is inherited from the word record, a linked hypothesis, or a linked experiment. Published remains a later, explicit gate governed by Package G.
