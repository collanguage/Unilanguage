# Candidate import area

AI extraction and bulk imports stop here. A candidate record is not a validated or public mapping.

The review lifecycle is `candidate → reviewed / rejected / needs_evidence`. `published` is a separate, higher-threshold release gate after review. Promotion requires a named human reviewer, traceable provenance, evidence-boundary labels, a completed checklist, and a passing canonical dataset validation. AI may extract text and suggest fields; it must never raise `mapping_level`, `confidence`, `review_status`, `experiment_status`, or publication status on its own.

Use `import-template.json` for future batches. Reviewed records are manually normalized into the canonical dataset; rejected records remain outside the public dataset with an audit note.

Package F is stored in `package-f-review-queue.v0.1.json` and validated against `package-f-review.schema.json`. It contains exactly the original 19 Package E records, three traceable source-verification records per candidate, four separate evidence tracks, counterevidence and uncertainty, and an unsigned human checklist. `candidate-review.html` is the review-preparation UI; it has no publication control.
