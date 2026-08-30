# Package G v0.1 — Final audit summary

Audit date: 2026-08-30  
Input: Package F v0.1 / 19 fixed records  
Scope: formal human-decision and publication gates only

## Status

| Layer | Status | Count | Meaning |
|---|---:|---:|---|
| Package F intake | Candidate | 10 | Source packet prepared; human decision pending. |
| Package F intake | Needs Evidence | 9 | An inherited source, sense, or grammar gap remains. |
| Package G decision | Pending | 19 | No named human reviewer has signed a decision. |
| Package G decision | Reviewed | 0 | No entry has passed the signed evidence gate. |
| Package G decision | Needs Evidence / Rejected | 0 / 0 | No formal human decision was fabricated from the Package F intake state. |
| Publication gate | Not Eligible | 19 | Reviewed decision and release approval are absent. |
| Publication gate | Eligible / Published | 0 / 0 | No automatic promotion occurred. |

## Invariants

- Candidate IDs, order, words, Package F intake states, reasons, and source counts are unchanged.
- Every record contains reason codes, an evidence-completeness result, a six-item decision checklist, a six-item publication checklist, and an audit log.
- The nine inherited Needs Evidence records retain their Package F reason and remediation text.
- A Reviewed state is invalid unless all evidence and decision checks pass with references and a named reviewer.
- A Published state is invalid unless the record is Reviewed, publication eligibility passes, all release checks have references, and a named human publisher approves a release commit.
- The canonical Language Book remains six published entries. Experiment 002 remains frozen; Experiment 003 is absent.

## Changed files

- `review-decisions.html`
- `css/review-decisions.css`
- `js/review-decisions.js`
- `data/candidates/package-g-decision-register.v0.1.json`
- `data/candidates/package-g-decision.schema.json`
- `scripts/build-package-g-review.mjs`
- `scripts/validate-package-g.mjs`
- `tests/package-g.test.cjs`
- `docs/product/package-g-review-decision-v0.1.md`
- `docs/product/package-g-audit-summary-v0.1.md`
- supporting navigation, data-governance, sitemap, link-check, and README files
