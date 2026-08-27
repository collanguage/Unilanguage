# Blind Evaluation Pipeline v1.0 template package

Status: reusable public template set

Method: [Blind Evaluation Pipeline v1.0](../../../methods/blind-evaluation-pipeline-v1.0.html)

First Reference Implementation: [Experiment 001A](../../001a-m-human.html)

This package initializes a future experiment; it does not open any gate. Replace every `{{PLACEHOLDER}}`, validate the artifacts, freeze their checksums and obtain the named authorization at each gate. File existence, a successful script run or a prior gate approval never authorizes a later gate.

## Stable numbering and metadata

- Assign one permanent identifier in the form `UNI-EXP-NNN` with an optional preregistered variant or round suffix.
- Never reuse, renumber or fill the identifier of a withdrawn or terminated experiment.
- Record the Pipeline version at registration. Later Pipeline releases do not alter an experiment already frozen under v1.0.
- Give every artifact its own semantic version, UTC timestamp, author/actor and SHA-256 checksum.
- Amendments are new, append-only artifacts linked to the frozen predecessor; they never replace it.

## Recommended structure

```text
experiment-workspace/UNI-EXP-NNN/
├── public-research-record/
│   ├── experiment-metadata.json
│   ├── preregistration-v1.0.md
│   ├── operational-specification-v1.0.md
│   ├── public-safe-manifest-v1.0.json
│   ├── public-safe-checksums-v1.0.sha256
│   ├── blinded-agreement-review-v1.0.md
│   ├── analysis-output-v1.0.json
│   ├── analysis-report-v1.0.md
│   └── final-classification-v1.0.md
├── private-research-package/       # never commit or deploy
│   ├── raw-or-restricted-data/
│   ├── annotation-package-a/
│   ├── annotation-package-b/
│   ├── completed-annotations/
│   ├── identity-map.restricted.*   # never public
│   ├── analysis-key.restricted.*   # never public
│   └── authorized-unblinding-log-v1.0.md
└── gate-status.json
```

Only release-reviewed public-safe artifacts are copied into the public website repository. Actual private packages, analysis keys and group-identity mappings stay outside the deployed tree and are excluded by repository ignore rules.

## Gate-to-template map

| Gate | Required starting templates | Gate output |
|---|---|---|
| 1 Preregistration Freeze | `experiment-metadata`, `preregistration`, `operational-specification`, `randomization-seed-record`, `dataset-manifest` | frozen manifest and approval |
| 2 Annotation Freeze | `blind-annotation-protocol`, package A/B CSVs, `freeze-checksum-manifest` | separately labeled frozen annotation streams |
| 3 Blinded Quality Review | `blinded-agreement-review` | blinded authorization, return-to-G2 or termination |
| 4 Authorized Unblinding | `authorized-unblinding-log` | scoped reveal bound to frozen hashes |
| 5 Final Classification | `analysis-output`, `analysis-report`, `final-classification`, `public-private-boundary` | Supported / Not Supported / Inconclusive and public record |

`gate-status.template.json` is the state-control record. An automated runner must stop with `AWAITING_AUTHORIZATION` at every gate even when all machine checks pass.

## Annotation-stream rule

A preregistered human annotation and a later exploratory AI annotation are separate streams. Copy and complete the stream fields in the protocol, manifest, analysis and classification templates. An exploratory AI result cannot be called the preregistered human result, silently pooled with it or substituted into a human-only decision rule.

## One-command concept

> Register this Language Book observation as UNI-EXP-002 and execute Blind Evaluation Pipeline v1.0.

This initializes Gate 1 only. It never grants automatic permission to cross Gates 1–5.

## Version history

- `v1.0` — 2026-08-27 — Initial reusable template set abstracted from Experiment 001A without changing its frozen records.

Future `v1.1` or `v2.0` template sets must live in new versioned directories and include release date, author/approver, changed clauses/files, compatibility, migration guidance and checksums. Never edit a prior experiment merely to conform it to a newer Pipeline.
