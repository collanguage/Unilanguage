const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const dataApi = require("../js/language-book-data.js");

const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.1.json"), "utf8"));
const schema = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.schema.json"), "utf8"));

test("canonical schema declares required extensible record fields", () => {
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  const entryFields = schema.$defs.entry.required;
  const mappingFields = schema.$defs.mapping.required;
  for (const field of ["entry_id", "source_word", "language", "normalized_form", "pronunciation", "phonetic_form", "lexical_meaning", "candidate_cross_language_mappings", "source_provenance", "author", "version"]) assert.ok(entryFields.includes(field));
  for (const field of ["mapping_language", "mapping_form", "mapping_type", "phonetic_relation", "semantic_structure", "etymology_evidence", "evidence_tracks", "mapping_level", "hypothesis_links", "experiment_status", "confidence", "review_status", "source_provenance", "notes"]) assert.ok(mappingFields.includes(field));
});

test("known word and alias lookup use the canonical dataset", () => {
  assert.equal(dataApi.lookup(dataset, "sky").entry.entry_id, "LB-en-sky-001");
  assert.equal(dataApi.lookup(dataset, "天空").entry.entry_id, "LB-en-sky-001");
  assert.equal(dataApi.lookup(dataset, "宇宙").entry.entry_id, "LB-en-universe-001");
  assert.equal(dataApi.lookup(dataset, "water").entry.entry_id, "LB-en-w-condition-001");
});

test("normalization handles case, width and whitespace", () => {
  assert.equal(dataApi.normalize("  ＳＫＹ  "), "sky");
  assert.equal(dataApi.lookup(dataset, "  UnIvErSe ").entry.entry_id, "LB-en-universe-001");
});

test("unknown terms never receive a generated mapping", () => {
  const result = dataApi.lookup(dataset, "definitely-not-reviewed");
  assert.equal(result.kind, "unknown");
  assert.equal(result.entry, null);
});

test("two different mapping types share the canonical renderer shape", () => {
  const mappings = dataset.entries.flatMap((entry) => entry.candidate_cross_language_mappings);
  assert.ok(mappings.some((item) => item.mapping_type === "lexical-equivalent"));
  assert.ok(mappings.some((item) => item.mapping_type === "phonetic-semantic-candidate"));
  assert.ok(mappings.some((item) => item.mapping_type === "research-condition"));
  for (const item of mappings) assert.ok(item.mapping_form && item.semantic_structure && item.source_provenance.length);
});

test("Experiment 002 regression remains Tested-Inconclusive with frozen public metrics", () => {
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

test("critical pages expose mapper, data layer and no-result behavior", () => {
  const mapper = fs.readFileSync(path.join(root, "semantic-mapper.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "js/semantic-mapper.js"), "utf8");
  const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(mapper, /Lexical Meaning|Enter a word/);
  assert.match(mapper, /js\/language-book-data\.js/);
  assert.match(script, /No reviewed mapping/);
  assert.match(script, /Tested — Inconclusive/);
  assert.match(home, /semantic-mapper\.html/);
});
