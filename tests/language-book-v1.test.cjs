const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v1.0.json"), "utf8"));
const dataApi = require(path.join(root, "js/language-book-data.js"));

test("v1 keeps publication, mapping, history and literature independent", () => {
  const at = dataApi.lookup(dataset, "presence").entry;
  assert.equal(at.slug, "at");
  assert.equal(at.entry_status, "Published");
  assert.equal(at.mapping_status, "Candidate");
  assert.equal(at.historical_relation_status, "Not claimed");
  assert.equal(at.literary_layer.status, "Published");
  assert.equal(at.literary_layer.is_historical_evidence, false);
});

test("search_terms power English and Chinese lookup without page hardcoding", () => {
  assert.equal(dataApi.lookup(dataset, "sky").entry.slug, "sky");
  assert.equal(dataApi.lookup(dataset, "爱").entry.slug, "at");
  assert.equal(dataApi.lookup(dataset, "在").entry.slug, "at");
  assert.equal(dataApi.lookup(dataset, "human").entry.slug, "human");
  assert.equal(dataApi.lookup(dataset, "声音").entry.slug, "sound");
});

test("every entry exposes four evidence tracks and one primary mapping", () => {
  for (const entry of dataset.entries) {
    assert.deepEqual(Object.keys(entry.evidence), ["Historical", "Phonetic-Semantic", "Cognitive", "Speculative"]);
    assert.ok(entry.primary_mapping.source.word);
    assert.ok(entry.primary_mapping.target.word);
  }
});

test("Sky and Light retain calibration boundaries", () => {
  const sky = dataApi.lookup(dataset, "sky").entry;
  const light = dataApi.lookup(dataset, "light").entry;
  assert.equal(sky.semantic_structure.relation, "ABOVE → COVER");
  assert.equal(sky.mapping_status, "Candidate");
  assert.equal(light.entry_status, "Published");
  assert.equal(light.mapping_status, "Candidate");
  assert.equal(light.literary_layer.is_historical_evidence, false);
});
