# Package F — Candidate Source Verification + Human Review v0.1

Package F starts from, and only from, the 19 records in `data/candidates/package-e-batch-001.v0.2.json`. It does not add candidates, change Package E’s six-entry canonical dataset, modify Experiment 001A or 002, or begin Experiment 003.

## Outcome

- 19 baseline records preserved by stable `candidate_id`
- 10 records remain `candidate`, with source preparation complete enough for a human decision
- 9 records are `needs_evidence` because a sense, part-of-speech, or technical-definition conflict remains
- 0 records are `reviewed`, `rejected`, or `published`
- 57 source-verification records: one internal primary locator and two bilingual-dictionary locators per candidate
- every record retains counterexamples, uncertainty, conflicting evidence, and an incomplete six-item human checklist

No record was upgraded because no named human reviewer has signed a checklist. This is deliberate: source preparation by an AI is not a human-review decision.

## Evidence boundaries

The queue separates four tracks:

1. `linguistic_etymological` — ordinary lexical/grammatical support and any genuine historical evidence; translation is explicitly not treated as cognacy.
2. `phonetic` — pronunciation or regular sound-correspondence evidence; not assessed for these ordinary lexical candidates.
3. `semantic_cognitive` — semantic schemas or cognitive evidence; project framework text is labeled internal and partial, not independent empirical proof.
4. `speculative_association` — exploratory association; unsupported for every Package F lexical decision.

Every Cambridge locator records what can be checked and what the source cannot establish. Live dictionary pages do not expose a stable release number, so Package F stores the access date and that version limitation rather than inventing an edition.

## Human workflow

The allowed review transition is `candidate → reviewed / rejected / needs_evidence`. A `needs_evidence` record may return to `candidate` after the missing source or sense split is documented. `published` is not a review decision: it is a later, separate canonical release gate.

The reviewer must confirm source availability, part of speech, context-specific Chinese and French forms, retained counterevidence, evidence-track labels, and the non-cognacy boundary. The reviewer then records their name, date, decision, and rationale. Package F intentionally leaves those fields null and all checklist items false.

## Records needing more evidence

- `containment`: the project uses a technical spatial-relation sense, while the general dictionary headword is dominated by control/limitation; add a specialist topology or cognitive-linguistics source.
- `change`: split verb and noun.
- `up`, `down`, `inside`, `outside`: split grammatical categories and direction/location senses.
- `boundary`: choose `limite` versus `frontière` by domain and justify abstract-category extension.
- `goal`: separate intended result from physical destination or cite the SOURCE–PATH–GOAL cognitive model.
- `cover`: split verb and noun and keep the sky-cover hypothesis outside lexical evidence.

## Reproducibility

Run `node scripts/build-package-f-review.mjs` to deterministically rebuild the review queue from the frozen Package E batch, `node scripts/validate-package-f.mjs` to validate invariants, and `node --test tests/package-f.test.cjs` to run regression tests. The canonical v0.2 validator remains independent and must continue to pass.
