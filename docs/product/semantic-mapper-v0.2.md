# Semantic Mapper MVP v0.2 · Package E

Version 0.2 expands the published evidence layer from four to six entries and creates a separate 19-record candidate review batch. `language` and `sound` enter the canonical dataset only as ordinary lexical-equivalence records grounded in their existing project-authored Language Book pages. Exploratory sound associations from those pages are intentionally excluded.

## Release inventory

- Published canonical entries: 6
- Published mappings: 8
- Candidate review records: 19
- Formal experiments: 1
- Candidate leakage into Mapper: 0

The current content foundation therefore tracks 25 concepts while preserving the lifecycle boundary. Candidate records are not counted as reviewed or public mappings.

## Review queue

`data/candidates/package-e-batch-001.v0.2.json` records each candidate's project provenance and unresolved blockers. Promotion requires authoritative lexical sources, sense and part-of-speech boundaries, evidence-track assignment, alternatives or counterexamples where relevant, and a documented owner/research review.

## Product behavior

Mapper, Dictionary and reviewed-word Search use `data/language-book.v0.2.json`. The public Data Foundation page reports the published/candidate split. A candidate such as `time` remains an unknown Mapper term until review is completed; the front end does not read candidate batches.

Experiment 002 remains `Tested-Inconclusive` with the frozen primary statistics. Package E does not modify any Experiment 001A or Experiment 002 asset.
