import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "data", "candidates", "package-f-review-queue.v0.1.json"), "utf8"));
const canonical = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.2.json"), "utf8"));
const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, "data", "candidates", "package-g-decision-register.v0.1.json");
const register = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const decisionStates = new Set(["pending", "reviewed", "needs_evidence", "rejected"]);
const completeWithReferences = (items) => items.every((item) => item.complete === true && typeof item.evidence_reference === "string" && item.evidence_reference.trim());

check(register.package_version === "0.1.0", "Package G version must be 0.1.0");
check(register.baseline_record_count === 19 && register.records.length === 19, "Package G must contain exactly 19 records");
check(register.governance.reviewed_is_not_published === true, "Reviewed and Published must remain separate");
check(register.governance.publication_requires_explicit_human_approval === true, "Publication must require explicit human approval");
check(register.governance.automatic_review_allowed === false, "Automatic review must be disabled");
check(register.governance.automatic_publication_allowed === false, "Automatic publication must be disabled");
for (const state of ["reviewed", "needs_evidence", "rejected"]) check(Boolean(register.governance.decision_reason_requirements[state]), `${state}: decision reason requirement missing`);

const sourceIds = source.records.map((record) => record.candidate_id);
const registerIds = register.records.map((record) => record.candidate_id);
check(new Set(registerIds).size === 19, "Package G candidate IDs must be unique");
check(JSON.stringify(registerIds) === JSON.stringify(sourceIds), "Package G candidate IDs/order differ from Package F");

for (const [index, record] of register.records.entries()) {
  const sourceRecord = source.records[index];
  const id = record.candidate_id;
  const decision = record.decision_record;
  const evidence = record.evidence_completeness;
  const publication = record.publication_gate;
  check(record.source_word === sourceRecord.source_word && record.normalized_form === sourceRecord.normalized_form, `${id}: source identity changed`);
  check(record.package_f_source.intake_status === sourceRecord.provisional_assessment.review_status, `${id}: Package F intake status changed`);
  check(record.package_f_source.provisional_reason === sourceRecord.provisional_assessment.reason, `${id}: Package F reason changed`);
  check(record.package_f_source.source_verification_count === sourceRecord.source_verification.length, `${id}: source verification count changed`);
  check(decisionStates.has(decision.status), `${id}: invalid decision state`);
  check(typeof decision.status_reason === "string" && decision.status_reason.trim(), `${id}: decision status reason missing`);
  check(Array.isArray(decision.reason_codes) && decision.reason_codes.length > 0, `${id}: decision reason code missing`);
  check(Array.isArray(decision.checklist) && decision.checklist.length >= 6, `${id}: decision checklist incomplete`);
  check(Array.isArray(evidence.checks) && evidence.checks.length >= 6, `${id}: evidence completeness checks missing`);
  check(evidence.missing_required_checks.length === evidence.checks.filter((item) => !item.complete).length, `${id}: missing-check summary is inconsistent`);
  check(publication.automatic_promotion_allowed === false, `${id}: automatic publication enabled`);
  check(Array.isArray(publication.checklist) && publication.checklist.length >= 6, `${id}: publication checklist incomplete`);
  check(Array.isArray(record.audit_log) && record.audit_log.length > 0, `${id}: audit log missing`);
  for (const event of record.audit_log) {
    check(Boolean(event.event_id && event.occurred_at && event.event_type && event.reason_code && event.rationale), `${id}: incomplete audit event`);
    check(Boolean(event.actor?.actor_type && event.actor?.actor_id), `${id}: audit actor missing`);
    check(Array.isArray(event.source_references) && event.source_references.length > 0, `${id}: audit source reference missing`);
  }

  if (decision.status === "pending") {
    check(decision.reviewer === null && decision.decided_at === null && decision.rationale === null, `${id}: pending decision must remain unsigned`);
    check(decision.checklist.every((item) => item.complete === false && item.evidence_reference === null), `${id}: pending decision checklist must remain incomplete`);
  } else {
    check(typeof decision.reviewer === "string" && decision.reviewer.trim(), `${id}: ${decision.status} requires a named reviewer`);
    check(/^\d{4}-\d{2}-\d{2}$/.test(decision.decided_at || ""), `${id}: ${decision.status} requires a decision date`);
    check(typeof decision.rationale === "string" && decision.rationale.trim(), `${id}: ${decision.status} requires a rationale`);
    check(record.audit_log.some((event) => event.event_type === "human_decision_recorded" && event.actor.actor_type === "human"), `${id}: signed decision requires a human audit event`);
  }

  if (decision.status === "reviewed") {
    check(evidence.reviewed_eligible === true, `${id}: Reviewed requires evidence eligibility`);
    check(evidence.status === "complete" && evidence.missing_required_checks.length === 0 && evidence.checks.every((item) => item.complete), `${id}: Reviewed requires every evidence-completeness check`);
    check(completeWithReferences(decision.checklist), `${id}: Reviewed requires a completed, referenced checklist`);
  } else {
    check(evidence.reviewed_eligible === false, `${id}: non-Reviewed record cannot be Reviewed-eligible`);
  }

  if (decision.status === "needs_evidence") {
    check(decision.reason_codes.some((code) => /evidence|source|sense|context/.test(code)), `${id}: Needs Evidence requires a specific evidence-gap reason code`);
    check(decision.remediation_required.length > 0, `${id}: Needs Evidence requires remediation guidance`);
  }
  if (decision.status === "rejected") check(!decision.reason_codes.includes("awaiting_human_review"), `${id}: Rejected requires a rejection reason`);

  if (publication.eligibility_status === "eligible") {
    check(decision.status === "reviewed", `${id}: publication eligibility requires Reviewed`);
    check(completeWithReferences(publication.checklist), `${id}: publication eligibility requires a completed checklist`);
  }
  if (publication.publication_status === "published") {
    check(publication.eligibility_status === "eligible" && decision.status === "reviewed", `${id}: Published requires eligible Reviewed state`);
    check(typeof publication.approval.publisher === "string" && publication.approval.publisher.trim(), `${id}: Published requires a named publisher`);
    check(/^\d{4}-\d{2}-\d{2}$/.test(publication.approval.approved_at || ""), `${id}: Published requires an approval date`);
    check(Boolean(publication.approval.rationale && publication.approval.release_commit), `${id}: Published requires approval rationale and release commit`);
    check(record.audit_log.some((event) => event.event_type === "publication_approved" && event.actor.actor_type === "human"), `${id}: Published requires a human publication audit event`);
  }
}

const computed = {
  package_f_intake: { candidate: 0, needs_evidence: 0 },
  human_decisions: { pending: 0, reviewed: 0, needs_evidence: 0, rejected: 0 },
  publication_gate: { not_eligible: 0, eligible: 0, published: 0 },
};
for (const record of register.records) {
  computed.package_f_intake[record.package_f_source.intake_status] += 1;
  computed.human_decisions[record.decision_record.status] += 1;
  computed.publication_gate[record.publication_gate.eligibility_status] += 1;
  if (record.publication_gate.publication_status === "published") computed.publication_gate.published += 1;
}
check(JSON.stringify(computed) === JSON.stringify(register.status_summary), "Package G status summary does not match records");
check(JSON.stringify(computed.package_f_intake) === JSON.stringify({ candidate: 10, needs_evidence: 9 }), "Package F intake must remain 10 Candidate / 9 Needs Evidence");
check(JSON.stringify(computed.human_decisions) === JSON.stringify({ pending: 19, reviewed: 0, needs_evidence: 0, rejected: 0 }), "No formal human decisions are authorized in Package G v0.1");
check(JSON.stringify(computed.publication_gate) === JSON.stringify({ not_eligible: 19, eligible: 0, published: 0 }), "No publication eligibility or publication is authorized in Package G v0.1");
check(canonical.entries.length === 6 && canonical.entries.every((entry) => entry.entry_review_status === "published"), "Canonical Package E dataset changed");
check(register.records.every((record) => !canonical.entries.some((entry) => entry.normalized_form === record.normalized_form)), "A Package G candidate entered the canonical dataset");
check(!fs.existsSync(path.join(root, "experiments", "003")), "Experiment 003 must not be started");

if (errors.length) {
  console.error(`Package G validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Package G v${register.package_version}: VALID`);
console.log("19 fixed records · 19 Pending human decisions · 0 Reviewed · 0 Eligible · 0 Published");
