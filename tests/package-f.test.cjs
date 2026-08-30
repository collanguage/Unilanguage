const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const baseline = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-e-batch-001.v0.2.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-f-review-queue.v0.1.json"), "utf8"));
const canonical = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.2.json"), "utf8"));

test("Package F preserves exactly the Package E 19-record queue", () => {
  assert.equal(review.records.length, 19);
  assert.deepEqual(review.records.map((record) => record.candidate_id), baseline.records.map((record) => record.candidate_id));
  assert.deepEqual(review.records.map((record) => record.source_word), baseline.records.map((record) => record.source_word));
});

test("every candidate has traceable verification and four independent evidence tracks", () => {
  for (const record of review.records) {
    assert.equal(record.source_verification.length, 3);
    for (const source of record.source_verification) {
      assert.ok(source.source_type && source.locator && source.specific_location);
      assert.match(source.accessed_at, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(source.version_info);
      assert.ok(source.supports.length);
      assert.ok(source.does_not_support.length);
    }
    assert.deepEqual(Object.keys(record.evidence_tracks), ["linguistic_etymological", "phonetic", "semantic_cognitive", "speculative_association"]);
    assert.equal(record.evidence_tracks.phonetic.status, "not_assessed");
    assert.equal(record.evidence_tracks.speculative_association.status, "not_supported");
  }
});

test("AI preparation never promotes, signs, or publishes a record", () => {
  assert.deepEqual(review.workflow.review_states, ["candidate", "reviewed", "rejected", "needs_evidence"]);
  assert.equal(review.workflow.publication_is_separate_gate, true);
  assert.deepEqual(review.status_summary, { candidate: 10, reviewed: 0, rejected: 0, needs_evidence: 9, published: 0 });
  for (const record of review.records) {
    assert.notEqual(record.provisional_assessment.review_status, "reviewed");
    assert.equal(record.provisional_assessment.publication_status, "not_published");
    assert.equal(record.provisional_assessment.automatic_publication_allowed, false);
    assert.equal(record.human_review.reviewer, null);
    assert.equal(record.human_review.decision, null);
    assert.ok(record.human_review.checklist.every((item) => item.complete === false));
  }
});

test("ambiguous or conflicting records remain Needs Evidence", () => {
  const expected = ["containment", "change", "up", "down", "boundary", "inside", "outside", "goal", "cover"];
  const actual = review.records.filter((record) => record.provisional_assessment.review_status === "needs_evidence").map((record) => record.normalized_form);
  assert.deepEqual(actual, expected);
  const containment = review.records.find((record) => record.normalized_form === "containment");
  assert.match(containment.provisional_assessment.reason, /general dictionary|specialist/i);
  assert.match(containment.source_verification[1].does_not_support.join(" "), /control|spatial/i);
});

test("canonical Package E dataset and frozen experiment scope remain unchanged", () => {
  assert.equal(canonical.dataset_version, "0.2.0");
  assert.equal(canonical.entries.length, 6);
  assert.ok(canonical.entries.every((entry) => entry.entry_review_status === "published"));
  for (const candidate of review.records) assert.ok(!canonical.entries.some((entry) => entry.normalized_form === candidate.normalized_form));
  assert.equal(canonical.experiments.find((item) => item.experiment_id === "UNI-EXP-002").status, "Tested-Inconclusive");
  assert.ok(!fs.existsSync(path.join(root, "experiments", "003")));
});

test("review UI exposes sources, tracks, status, confidence, level and separate publish gate", () => {
  const html = fs.readFileSync(path.join(root, "candidate-review.html"), "utf8");
  const js = fs.readFileSync(path.join(root, "js/candidate-review.js"), "utf8");
  assert.match(html, /Publication is a separate gate/);
  assert.match(html, /19 candidate records/);
  assert.match(js, /Source verification/);
  assert.match(js, /Linguistic \/ etymological/);
  assert.match(js, /Phonetic/);
  assert.match(js, /Semantic \/ cognitive/);
  assert.match(js, /Speculative association/);
  assert.match(js, /confidence/);
  assert.match(js, /provisional level/);
  assert.match(js, /not published/);
});
