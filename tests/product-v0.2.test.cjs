const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const dataApi = require("../js/language-book-data.js");

const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.2.json"), "utf8"));
const candidates = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-e-batch-001.v0.2.json"), "utf8"));

test("v0.2 publishes six provenance-backed entries", () => {
  assert.equal(dataset.dataset_version, "0.2.0");
  assert.equal(dataset.entries.length, 6);
  assert.ok(dataset.entries.every((entry) => entry.entry_review_status === "published"));
  assert.equal(dataApi.lookup(dataset, "language").entry.entry_id, "LB-en-language-001");
  assert.equal(dataApi.lookup(dataset, "语言").entry.entry_id, "LB-en-language-001");
  assert.equal(dataApi.lookup(dataset, "sound").entry.entry_id, "LB-en-sound-001");
  assert.equal(dataApi.lookup(dataset, "声音").entry.entry_id, "LB-en-sound-001");
});

test("new entries publish lexical equivalence without speculative upgrades", () => {
  for (const word of ["language", "sound"]) {
    const entry = dataApi.lookup(dataset, word).entry;
    assert.equal(entry.candidate_cross_language_mappings.length, 1);
    const mapping = entry.candidate_cross_language_mappings[0];
    assert.equal(mapping.mapping_type, "lexical-equivalent");
    assert.equal(mapping.claim_kind, "Observed Mapping");
    assert.equal(mapping.experiment_status, "Untested");
    assert.ok(!mapping.evidence_tracks.includes("Speculative"));
    assert.match(mapping.notes.en, /excluded|only/i);
  }
});

test("19 candidates remain isolated from formal lookup", () => {
  assert.equal(candidates.records.length, 19);
  assert.ok(candidates.records.every((record) => record.review_status === "candidate" && record.blockers.length));
  for (const record of candidates.records) {
    assert.equal(dataApi.lookup(dataset, record.source_word).kind, "unknown");
  }
});

test("Experiment 002 remains frozen as Tested-Inconclusive", () => {
  const experiment = dataset.experiments.find((item) => item.experiment_id === "UNI-EXP-002");
  assert.equal(experiment.status, "Tested-Inconclusive");
  assert.deepEqual(experiment.metrics, {
    w_target: 7, w_total: 120, w_rate_percent: 5.83,
    control_target: 9, control_total: 240, control_rate_percent: 3.75,
    risk_ratio: 1.556, risk_ratio_95_ci: [0.594, 4.075],
    risk_difference_percentage_points: 2.08,
    risk_difference_95_ci_percentage_points: [-4.12, 9.57],
    fisher_two_sided_p: 0.4185,
  });
});

test("product pages point at v0.2 and expose data governance", () => {
  const mapper = fs.readFileSync(path.join(root, "semantic-mapper.html"), "utf8");
  const dataPage = fs.readFileSync(path.join(root, "data-foundation.html"), "utf8");
  const loader = fs.readFileSync(path.join(root, "js/language-book-data.js"), "utf8");
  assert.match(mapper, /MVP v0\.2/);
  assert.match(mapper, /language-book\.v0\.2\.json/);
  assert.match(loader, /language-book\.v0\.2\.json/);
  assert.match(dataPage, /candidate → reviewed → published/);
  assert.match(dataPage, /19/);
});
