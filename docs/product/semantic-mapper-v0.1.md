# Semantic Mapper MVP v0.1 architecture

## Product boundary

Semantic Mapper is a deterministic viewer over `data/language-book.v0.1.json`. It does not generate evidence, etymology or mappings at query time. Exact and normalized lookup are supported; aliases resolve only when they are already present in the canonical dataset. Unknown terms return “No reviewed mapping.”

The Language Book remains a cross-language comparable semantic database. A mapping may compare form, meaning, cognition or culture without claiming historical cognacy. Consonantal Semantic Skeleton and similar proposals remain hypotheses unless a linked experiment changes their formal status.

## Single source of truth

`data/language-book.v0.1.json` feeds Semantic Mapper, Dictionary and reviewed-word Search. `data/language-book.schema.json` is the public schema contract. Source word pages remain human-readable provenance; they are not a second runtime index.

The schema is language-neutral: a record identifies its own source language and every mapping identifies its mapping language. English, Chinese and French are present where supported, but no renderer logic is hard-coded to those languages or to the sky case.

## Add an entry

1. Put raw notes or an AI extraction batch in `data/candidates/` using `import-template.json` and keep `review_status` as `candidate`.
2. Verify every lexical, phonetic, historical and experimental statement against a traceable project or external source. Add that source to `sources`.
3. Separate ordinary lexical equivalence, observed comparison, hypothesis and experimentally tested result. Never treat similarity as common-origin proof.
4. After human/research review, add a stable `entry_id`, mapping IDs, evidence tracks, Mapping Level, review status, provenance and bilingual uncertainty note to the canonical dataset.
5. Link formal experiments by ID. The mapping status must exactly match the experiment registry status.
6. Run the validator, tests and link checker; then rebuild the product manifest and checksums.

## Evidence tracks and Mapping Levels

- `Historical`: documented lexical, character or transmission history.
- `Phonetic-Semantic`: observable or proposed relations between sound/form and meaning.
- `Cognitive`: spatial, conceptual or metaphorical structure.
- `Speculative`: an explicitly unverified proposal requiring tests or stronger evidence.

Levels A/B/C/D follow the current project mapping framework. They classify the mapping inside Unilanguage; they do not by themselves measure historical certainty. A low-confidence or speculative sub-mapping may coexist with a stronger ordinary lexical equivalence, but each mapping must be rendered separately.

## AI promotion prohibition

AI may transcribe, normalize and propose candidate fields. It may not automatically change `candidate` to `reviewed` or `published`; raise Mapping Level or confidence; remove `Speculative`; or change an experiment status. Experiment statuses come only from frozen formal results. UNI-EXP-002 must remain `Tested-Inconclusive` unless a new, separately identified formal experiment is completed.

## Scale path

The current small dataset validates the record shape and product loop. Expansion to 300–500 reviewed entries is a content-review operation, not a renderer rewrite: import candidate batches, review evidence, promote records, validate references, and publish a new semver dataset and manifest.
