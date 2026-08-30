import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseline = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-e-batch-001.v0.2.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-f-review-queue.v0.1.json"), "utf8"));
const errors = [];
const allowedStatus = new Set(["candidate", "reviewed", "rejected", "needs_evidence"]);
const allowedTrackStatus = new Set(["supported", "partial", "not_supported", "not_assessed"]);
const trackNames = ["linguistic_etymological", "phonetic", "semantic_cognitive", "speculative_association"];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(review.package_version === "0.1.0", "Package F version must be 0.1.0");
check(review.baseline_record_count === 19 && review.records.length === 19, "Package F must contain exactly 19 records");
check(review.workflow.publication_is_separate_gate === true, "Published must be a separate gate");
check(!review.workflow.review_states.includes("published"), "Published must not be a human-review state");
check(JSON.stringify(review.workflow.transitions.candidate) === JSON.stringify(["reviewed", "rejected", "needs_evidence"]), "Candidate transitions changed");

const baselineIds = baseline.records.map((record) => record.candidate_id);
const reviewIds = review.records.map((record) => record.candidate_id);
check(new Set(reviewIds).size === 19, "Candidate IDs must be unique");
check(JSON.stringify(reviewIds) === JSON.stringify(baselineIds), "Package F candidate IDs/order differ from Package E baseline");

for (const record of review.records) {
  const id = record.candidate_id;
  check(allowedStatus.has(record.provisional_assessment.review_status), `${id}: invalid review status`);
  check(record.provisional_assessment.review_status !== "reviewed", `${id}: AI-prepared record must not be Reviewed`);
  check(record.provisional_assessment.publication_status === "not_published", `${id}: candidate was published`);
  check(record.provisional_assessment.automatic_publication_allowed === false, `${id}: automatic publication enabled`);
  check(record.provisional_assessment.level_is_provisional === true, `${id}: mapping level must be provisional`);
  check(record.source_verification.length >= 3, `${id}: fewer than three source verifications`);
  for (const source of record.source_verification) {
    for (const field of ["source_type", "title", "locator", "url", "specific_location", "accessed_at", "version_info", "verifiable_content"]) check(typeof source[field] === "string" && source[field].trim(), `${id}: source missing ${field}`);
    check(Array.isArray(source.supports) && source.supports.length, `${id}: source lacks supported claims`);
    check(Array.isArray(source.does_not_support) && source.does_not_support.length, `${id}: source lacks unsupported-claim boundary`);
  }
  check(JSON.stringify(Object.keys(record.evidence_tracks)) === JSON.stringify(trackNames), `${id}: evidence tracks are incomplete or reordered`);
  for (const name of trackNames) {
    const track = record.evidence_tracks[name];
    check(allowedTrackStatus.has(track.status), `${id}: ${name} has invalid status`);
    check(Boolean(track.supports && track.limits), `${id}: ${name} lacks support/limits text`);
  }
  check(record.counterexamples_uncertainties_conflicts.length >= 3, `${id}: counterevidence/uncertainty missing`);
  check(record.human_review.reviewer === null && record.human_review.decision === null, `${id}: unsigned AI record has a human decision`);
  check(record.human_review.checklist.length >= 6 && record.human_review.checklist.every((item) => item.complete === false), `${id}: checklist must remain unsigned and incomplete`);
  check(record.human_review.publish_requires_separate_gate === true, `${id}: publish gate not enforced`);
}

const computed = review.records.reduce((counts, record) => {
  counts[record.provisional_assessment.review_status] += 1;
  return counts;
}, { candidate: 0, reviewed: 0, rejected: 0, needs_evidence: 0, published: 0 });
check(JSON.stringify(computed) === JSON.stringify(review.status_summary), "Status summary does not match records");
check(computed.candidate === 10 && computed.needs_evidence === 9 && computed.reviewed === 0 && computed.published === 0, "Expected conservative Package F disposition is 10 Candidate / 9 Needs Evidence / 0 Reviewed / 0 Published");

if (errors.length) {
  console.error(`Package F validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Package F v${review.package_version}: VALID`);
console.log(`${review.records.length} fixed candidates · ${computed.candidate} Candidate · ${computed.needs_evidence} Needs Evidence · ${computed.reviewed} Reviewed · ${computed.published} Published`);
