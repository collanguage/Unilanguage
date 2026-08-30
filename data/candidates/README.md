# Candidate import area

AI extraction and bulk imports stop here. A candidate record is not a validated or public mapping.

The lifecycle is `candidate → reviewed → published`. Promotion requires a human or research review, traceable provenance, evidence-boundary labels, and a passing canonical dataset validation. AI may extract text and suggest fields; it must never raise `mapping_level`, `confidence`, `review_status`, or `experiment_status` on its own.

Use `import-template.json` for future batches. Reviewed records are manually normalized into the canonical dataset; rejected records remain outside the public dataset with an audit note.
