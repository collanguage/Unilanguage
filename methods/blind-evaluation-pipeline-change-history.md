# Blind Evaluation Pipeline change history

## v1.0 — 2026-08-27

- Status: Frozen / Released
- Release acceptance date: 2026-08-27
- Release manifest: `methods/blind-evaluation-pipeline-v1.0-release.json`
- Basis: abstracted from Experiment 001A, the First Reference Implementation
- Scope: five non-bypassable gates; explicit machine halt and human authorization; stable experiment metadata; public/private publication boundary; separate preregistered-human and exploratory-AI annotation streams; reusable templates
- Compatibility: initial release
- Migration: none; Experiment 001A remains governed by its own frozen records and is not rewritten by this release

## Rules for future releases

Every release must record:

1. semantic version and release date;
2. author and approving authority;
3. changed clauses, artifacts, schemas and templates;
4. whether the change is compatible with v1.0;
5. migration guidance for new experiments only;
6. SHA-256 checksums for the released method and template set.

Use a `v1.1` release for backward-compatible clarification, optional fields or stronger validation that does not change the meaning of a gate. Use `v2.0` when gate semantics, required artifacts, authority roles or classification logic change incompatibly.

Publish each release at a new stable path and retain all earlier versions. An experiment keeps the Pipeline version recorded at Gate 1. Never edit an old experiment to make it appear that it used a later Pipeline. A correction to an experiment is an append-only, dated amendment linked to the original checksum; it does not replace the frozen record.
