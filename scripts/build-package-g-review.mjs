import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data", "candidates", "package-f-review-queue.v0.1.json");
const outputPath = path.join(root, "data", "candidates", "package-g-decision-register.v0.1.json");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const decisionChecklist = [
  ["source_availability_confirmed", "Confirm every required source locator is available and matches the recorded sense."],
  ["sense_and_part_of_speech_confirmed", "Confirm a single reviewable sense and part of speech, or document an explicit split."],
  ["bilingual_context_confirmed", "Confirm the Chinese and French forms with context-sensitive examples."],
  ["counterevidence_reviewed", "Review and retain counterexamples, uncertainty, and conflicting evidence."],
  ["evidence_tracks_confirmed", "Confirm all four evidence-track labels and their stated limitations."],
  ["claim_boundary_confirmed", "Confirm that lexical equivalence is not presented as cognacy or a universal law."],
];

const publicationChecklist = [
  ["signed_reviewed_decision", "A named human reviewer signed a Reviewed decision."],
  ["reviewed_gate_passed", "Every Reviewed evidence-standard check passed without an unresolved blocker."],
  ["canonical_record_prepared", "A normalized canonical record and provenance references were prepared."],
  ["canonical_validation_passed", "Canonical schema, dataset, and regression validation passed."],
  ["release_audit_linked", "The release change is linked to the review decision and audit history."],
  ["explicit_publication_approval", "A named human publisher explicitly approved publication."],
];

function item([checkId, label]) {
  return { check_id: checkId, label, complete: false, evidence_reference: null };
}

function buildRecord(record) {
  const intakeStatus = record.provisional_assessment.review_status;
  const hasPackageFGap = intakeStatus === "needs_evidence";
  const statusReason = hasPackageFGap
    ? `Package F records an unresolved evidence gap: ${record.provisional_assessment.reason} This is an inherited preparation status, not a signed human decision.`
    : "The Package F source packet is prepared, but no named human reviewer has signed a decision or completed the evidence-standard checklist.";
  const evidenceChecks = [
    { check_id: "fixed_candidate_identity", label: "Candidate ID and source word match the fixed Package E/F queue.", complete: true, basis: record.candidate_id },
    { check_id: "traceable_source_packet", label: "At least three source verifications include locators, limits, access dates, and version details.", complete: record.source_verification.length >= 3, basis: `${record.source_verification.length} source verifications` },
    { check_id: "four_evidence_tracks", label: "The four evidence tracks are present and separately labeled.", complete: Object.keys(record.evidence_tracks).length === 4, basis: Object.keys(record.evidence_tracks).join(", ") },
    { check_id: "counterevidence_retained", label: "Counterexamples, uncertainty, and conflicts remain visible.", complete: record.counterexamples_uncertainties_conflicts.length > 0, basis: `${record.counterexamples_uncertainties_conflicts.length} retained statements` },
    { check_id: "sense_and_part_of_speech_resolved", label: "The sense and part of speech have no unresolved Package F blocker.", complete: !hasPackageFGap, basis: hasPackageFGap ? record.provisional_assessment.reason : "Package F marks the source packet Candidate-ready for human review." },
    { check_id: "signed_human_confirmation", label: "A named human reviewer completed and signed all review checks.", complete: false, basis: "No human reviewer or signature is recorded." },
  ];
  const missingChecks = evidenceChecks.filter((check) => !check.complete).map((check) => check.check_id);

  return {
    candidate_id: record.candidate_id,
    source_word: record.source_word,
    normalized_form: record.normalized_form,
    package_f_source: {
      package: source.package,
      package_version: source.package_version,
      intake_status: intakeStatus,
      provisional_reason: record.provisional_assessment.reason,
      source_verification_count: record.source_verification.length,
      source_record_locator: `data/candidates/package-f-review-queue.v0.1.json#${record.candidate_id}`,
    },
    evidence_completeness: {
      status: hasPackageFGap ? "blocked_evidence_gap" : "awaiting_human_confirmation",
      checks: evidenceChecks,
      missing_required_checks: missingChecks,
      reviewed_eligible: false,
      eligibility_reason: hasPackageFGap
        ? "An inherited Package F evidence gap and the unsigned human checklist block Reviewed."
        : "The source packet is prepared, but the unsigned human checklist blocks Reviewed.",
    },
    decision_record: {
      decision_id: `DEC-${record.candidate_id}-001`,
      status: "pending",
      status_reason: statusReason,
      reason_codes: [hasPackageFGap ? "package_f_evidence_gap_unresolved" : "awaiting_human_review"],
      rationale: null,
      remediation_required: hasPackageFGap ? [record.provisional_assessment.reason, ...record.baseline_record.blockers] : [],
      reviewer: null,
      decided_at: null,
      evidence_standard: "Package G reviewed-evidence standard v0.1",
      checklist: decisionChecklist.map(item),
    },
    publication_gate: {
      eligibility_status: "not_eligible",
      eligibility_reason: "A signed Reviewed decision, completed release checklist, and explicit publication approval are absent.",
      checklist: publicationChecklist.map(item),
      approval: { publisher: null, approved_at: null, rationale: null, release_commit: null },
      publication_status: "not_published",
      automatic_promotion_allowed: false,
    },
    audit_log: [
      {
        event_id: `AUD-${record.candidate_id}-001`,
        occurred_at: "2026-08-30",
        event_type: "decision_gate_initialized",
        actor: { actor_type: "system", actor_id: "package-g-builder" },
        from_state: { intake_status: intakeStatus, decision_status: null, publication_status: "not_published" },
        to_state: { intake_status: intakeStatus, decision_status: "pending", publication_status: "not_published" },
        reason_code: hasPackageFGap ? "package_f_evidence_gap_unresolved" : "awaiting_human_review",
        rationale: "Initialized governance fields without making, signing, or publishing a human decision.",
        source_references: [`data/candidates/package-f-review-queue.v0.1.json#${record.candidate_id}`],
      },
    ],
  };
}

const records = source.records.map(buildRecord);
const output = {
  package: "Package G — Review Decision + Publication Gate",
  package_version: "0.1.0",
  schema_version: "1.0.0",
  created_at: "2026-08-30",
  source_review_package: "data/candidates/package-f-review-queue.v0.1.json",
  baseline_record_count: 19,
  scope_rule: "Only the fixed 19 Package F records are in scope. Package G records governance state; it does not add candidates, alter evidence conclusions, publish records, or begin Experiment 003.",
  governance: {
    decision_states: ["pending", "reviewed", "needs_evidence", "rejected"],
    decision_reason_requirements: {
      reviewed: "Require a named reviewer, date, substantive rationale, every evidence-standard check, and no unresolved evidence blocker.",
      needs_evidence: "Require a named reviewer, date, explicit evidence-gap reason code, substantive rationale, and remediation request.",
      rejected: "Require a named reviewer, date, explicit rejection reason code, substantive rationale, and preserved counterevidence.",
    },
    reviewed_is_not_published: true,
    publication_requires_explicit_human_approval: true,
    automatic_review_allowed: false,
    automatic_publication_allowed: false,
  },
  status_summary: {
    package_f_intake: { candidate: 10, needs_evidence: 9 },
    human_decisions: { pending: 19, reviewed: 0, needs_evidence: 0, rejected: 0 },
    publication_gate: { not_eligible: 19, eligible: 0, published: 0 },
  },
  records,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log("Package G decision register written: 19 records · 19 pending human decisions · 0 Reviewed · 0 Published");
