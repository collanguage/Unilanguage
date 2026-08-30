const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-f-review-queue.v0.1.json"), "utf8"));
const register = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-g-decision-register.v0.1.json"), "utf8"));
const canonical = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.2.json"), "utf8"));
const validator = path.join(root, "scripts/validate-package-g.mjs");

function validateMutation(mutator) {
  const copy = structuredClone(register);
  mutator(copy);
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "package-g-test-"));
  const filename = path.join(directory, "register.json");
  fs.writeFileSync(filename, JSON.stringify(copy));
  const result = spawnSync(process.execPath, [validator, filename], { encoding: "utf8" });
  fs.rmSync(directory, { recursive: true, force: true });
  return result;
}

test("Package G preserves all Package F identities, intake states, reasons and source counts", () => {
  assert.equal(register.records.length, 19);
  assert.deepEqual(register.records.map((record) => record.candidate_id), source.records.map((record) => record.candidate_id));
  register.records.forEach((record, index) => {
    const sourceRecord = source.records[index];
    assert.equal(record.source_word, sourceRecord.source_word);
    assert.equal(record.package_f_source.intake_status, sourceRecord.provisional_assessment.review_status);
    assert.equal(record.package_f_source.provisional_reason, sourceRecord.provisional_assessment.reason);
    assert.equal(record.package_f_source.source_verification_count, sourceRecord.source_verification.length);
  });
});

test("current decision and publication state is truthful and unsigned", () => {
  assert.deepEqual(register.status_summary.package_f_intake, { candidate: 10, needs_evidence: 9 });
  assert.deepEqual(register.status_summary.human_decisions, { pending: 19, reviewed: 0, needs_evidence: 0, rejected: 0 });
  assert.deepEqual(register.status_summary.publication_gate, { not_eligible: 19, eligible: 0, published: 0 });
  for (const record of register.records) {
    assert.equal(record.decision_record.status, "pending");
    assert.equal(record.decision_record.reviewer, null);
    assert.equal(record.evidence_completeness.reviewed_eligible, false);
    assert.equal(record.publication_gate.eligibility_status, "not_eligible");
    assert.equal(record.publication_gate.publication_status, "not_published");
    assert.equal(record.publication_gate.automatic_promotion_allowed, false);
  }
});

test("inherited Needs Evidence records retain reasons and remediation", () => {
  const expected = ["containment", "change", "up", "down", "boundary", "inside", "outside", "goal", "cover"];
  const records = register.records.filter((record) => record.package_f_source.intake_status === "needs_evidence");
  assert.deepEqual(records.map((record) => record.normalized_form), expected);
  for (const record of records) {
    assert.equal(record.evidence_completeness.status, "blocked_evidence_gap");
    assert.ok(record.decision_record.reason_codes.includes("package_f_evidence_gap_unresolved"));
    assert.ok(record.decision_record.remediation_required.length > 0);
    assert.match(record.decision_record.status_reason, /unresolved evidence gap/i);
  }
});

test("gate policy defines reasons and keeps Reviewed distinct from Published", () => {
  assert.equal(register.governance.reviewed_is_not_published, true);
  assert.equal(register.governance.publication_requires_explicit_human_approval, true);
  assert.equal(register.governance.automatic_review_allowed, false);
  assert.equal(register.governance.automatic_publication_allowed, false);
  assert.deepEqual(Object.keys(register.governance.decision_reason_requirements), ["reviewed", "needs_evidence", "rejected"]);
  const schema = fs.readFileSync(path.join(root, "data/candidates/package-g-decision.schema.json"), "utf8");
  assert.match(schema, /"reviewed_is_not_published": \{ "const": true \}/);
  assert.match(schema, /"publication_requires_explicit_human_approval": \{ "const": true \}/);
  assert.match(schema, /"publication_status": \{ "const": "published" \}/);
  assert.match(schema, /"decision_record": \{ "properties": \{ "status": \{ "const": "reviewed" \}/);
});

test("validator rejects an unsigned Reviewed promotion", () => {
  const result = validateMutation((copy) => { copy.records[0].decision_record.status = "reviewed"; });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /Reviewed requires evidence eligibility|Reviewed requires every evidence-completeness check/);
});

test("validator rejects unexplained Needs Evidence and automatic publication", () => {
  const needsEvidence = validateMutation((copy) => {
    copy.records[0].decision_record.status = "needs_evidence";
    copy.records[0].decision_record.reason_codes = ["unspecified"];
    copy.records[0].decision_record.remediation_required = [];
  });
  assert.notEqual(needsEvidence.status, 0);
  assert.match(`${needsEvidence.stdout}\n${needsEvidence.stderr}`, /specific evidence-gap reason code|requires remediation guidance/);

  const published = validateMutation((copy) => { copy.records[0].publication_gate.publication_status = "published"; });
  assert.notEqual(published.status, 0);
  assert.match(`${published.stdout}\n${published.stderr}`, /Published requires eligible Reviewed state|named publisher/);
});

test("decision UI exposes completeness, reasons, eligibility, checklists and audit history", () => {
  const html = fs.readFileSync(path.join(root, "review-decisions.html"), "utf8");
  const js = fs.readFileSync(path.join(root, "js/review-decisions.js"), "utf8");
  assert.match(html, /Decision is not publication/);
  assert.match(html, /inspection-only/);
  assert.match(html, /19 decision records/);
  assert.match(js, /Evidence completeness/);
  assert.match(js, /Human decision gate/);
  assert.match(js, /Publication eligibility/);
  assert.match(js, /Audit history/);
  assert.match(js, /automatic promotion disabled/);
});

test("canonical publication and experiment scope remain unchanged", () => {
  assert.equal(canonical.entries.length, 6);
  assert.ok(canonical.entries.every((entry) => entry.entry_review_status === "published"));
  assert.ok(register.records.every((record) => !canonical.entries.some((entry) => entry.normalized_form === record.normalized_form)));
  assert.equal(canonical.experiments.find((item) => item.experiment_id === "UNI-EXP-002").status, "Tested-Inconclusive");
  assert.ok(!fs.existsSync(path.join(root, "experiments", "003")));
});
