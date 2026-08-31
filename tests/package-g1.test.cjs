const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const dataApi = require("../js/language-book-data.js");

const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.3.json"), "utf8"));
const queue = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-g-decision-register.v0.1.json"), "utf8"));

test("G.1 record schema separates all seven layers", () => {
  assert.equal(dataset.schema_version, "2.0.0");
  assert.equal(dataset.classification_model.package, "G.1");
  for (const entry of dataset.entries) {
    assert.equal(entry.primary_chinese_mapping.role, "primary");
    assert.ok(!Object.hasOwn(entry, "candidate_cross_language_mappings"));
    for (const field of ["secondary_chinese_mappings", "mapping_rationales", "historical_etymologies", "sound_symbol_hypothesis_refs", "other_author_notes", "experimental_validation_refs"]) assert.ok(Array.isArray(entry[field]));
  }
});

test("every evidence object has separate Source Verification and AI Review", () => {
  const objects = [
    ...dataset.hypotheses,
    ...dataset.experiments,
    ...dataset.entries.flatMap((entry) => [entry.primary_chinese_mapping, ...entry.secondary_chinese_mappings, ...entry.mapping_rationales, ...entry.historical_etymologies, ...entry.other_author_notes]),
  ];
  for (const object of objects) {
    assert.ok(object.source_verification);
    assert.ok(object.ai_review);
    assert.notEqual(object.source_verification, object.ai_review);
  }
});

test("WATER calibration preserves proposal, hypotheses and inconclusive experiment identities", () => {
  const water = dataApi.lookup(dataset, "water").entry;
  assert.equal(water.classification_status, "candidate");
  assert.equal(water.primary_chinese_mapping.chinese_form, "哗");
  assert.equal(water.primary_chinese_mapping.identity, "author-idea");
  assert.equal(water.primary_chinese_mapping.ai_review.status, "not-reviewed");
  assert.equal(water.secondary_chinese_mappings[0].chinese_form, "水");
  assert.deepEqual(water.sound_symbol_hypothesis_refs, ["UNI-W-FH-PHONETIC-001", "UNI-W-WATER-002"]);
  const experiment = dataset.experiments.find((item) => item.experiment_id === water.experimental_validation_refs[0]);
  assert.equal(experiment.identity, "experimental-result");
  assert.equal(experiment.status, "Tested-Inconclusive");
  assert.deepEqual(experiment.hypothesis_refs, ["UNI-W-WATER-002"]);
  assert.match(experiment.result.en, /universal sound law/i);
});

test("LANGUAGE calibration keeps mapping, etymology and L hypothesis independent", () => {
  const language = dataApi.lookup(dataset, "language").entry;
  assert.equal(language.classification_status, "candidate");
  assert.equal(language.primary_chinese_mapping.chinese_form, "朗");
  assert.equal(language.primary_chinese_mapping.mapping_basis, "author-proposal");
  assert.equal(language.secondary_chinese_mappings[0].chinese_form, "语言");
  assert.deepEqual(language.historical_etymologies[0].chain, ["English language", "Old French langage", "Latin lingua"]);
  assert.equal(language.historical_etymologies[0].source_verification.status, "needs-authoritative-source");
  const lHypothesis = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-L-INHERENT-SEMANTIC-001");
  assert.equal(lHypothesis.hypothesis_type, "letter-symbol-history");
  assert.equal(lHypothesis.status, "Untested");
  assert.equal(lHypothesis.ai_review.status, "not-reviewed");
  assert.match(lHypothesis.statement.en, /does not claim/i);
});

test("19-record decision queue remains pending and unpublished", () => {
  assert.equal(queue.records.length, 19);
  assert.ok(queue.records.every((record) => record.decision_record.status === "pending"));
  assert.ok(queue.records.every((record) => record.publication_gate.eligibility_status === "not_eligible"));
  assert.ok(queue.records.every((record) => record.publication_gate.approval.publisher === null && record.publication_gate.publication_status === "not_published"));
});

test("G.1 UI visibly distinguishes object identities", () => {
  const html = fs.readFileSync(path.join(root, "semantic-mapper.html"), "utf8");
  const js = fs.readFileSync(path.join(root, "js/semantic-mapper.js"), "utf8");
  assert.match(html, /Fact.*Source-backed|fact-backed/i);
  assert.match(js, /Author Hypothesis/);
  assert.match(js, /Experimental Result/);
  assert.match(js, /Four Independent Evidence Tracks/);
  assert.match(js, /Historical/);
  assert.match(js, /Source refs/);
  assert.match(js, /Literary Layer/);
});
