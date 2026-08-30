# Package G — Review Decision + Publication Gate v0.1

Package G adds governance to the fixed 19-record Package F queue. It does not add candidates, alter Package F evidence conclusions, modify the six-entry canonical dataset, start Experiment 003, or infer a human decision.

## Two separate gates

`Reviewed` is a signed human evidence decision. It requires a named reviewer, decision date, substantive rationale, traceable evidence references, no unresolved required check, and completion of the six-item decision checklist. `Reviewed` never means `Published`.

`Published` is a later release action. Eligibility requires a signed Reviewed decision, a normalized canonical record, successful schema and regression validation, a linked release audit, a completed publication checklist, and explicit approval from a named human publisher. No tool, build script, or UI control may promote a record automatically.

## Decision reasons

- `Reviewed`: explain why the cited evidence satisfies the existing evidence standard and how conflicts or limitations were retained.
- `Needs Evidence`: identify the exact missing source, unresolved sense, part-of-speech conflict, or context gap and record the remediation required.
- `Rejected`: identify the evidence- or scope-based rejection ground while retaining counterevidence and the Package F source record.

Every signed decision must append a human audit event. Reopening or changing a decision must preserve earlier events rather than overwriting them.

## Current truthful state

Package F remains 10 `candidate` and 9 `needs_evidence`. These are intake/preparation states, not Package G human decisions. Because no named reviewer has signed a decision, Package G records 19 `pending`, 0 `reviewed`, 0 human `needs_evidence`, and 0 `rejected`. All 19 publication gates are `not_eligible`; 0 records are `published`.

Each record includes:

- an immutable Package F locator and inherited status/reason;
- objective evidence-packet completeness checks;
- a formal human decision record and reason codes;
- remediation details for inherited evidence gaps;
- a separate publication eligibility checklist and approval object;
- an append-only audit event that records gate initialization without pretending it was a human act.

## Reproducibility

Run `node scripts/build-package-g-review.mjs` to rebuild `data/candidates/package-g-decision-register.v0.1.json`. Run `node scripts/validate-package-g.mjs` and `node --test tests/package-g.test.cjs` to enforce the gates. The validator rejects unsigned Reviewed decisions, unexplained Needs Evidence or Rejected decisions, and any Published state without a signed Reviewed decision and explicit publication approval.

The read-only inspection UI is `review-decisions.html`. It exposes evidence completeness, decision reasons, publication eligibility, checklists, and audit history, but it cannot write or promote records.
