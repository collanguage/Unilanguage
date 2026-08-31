const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const dataApi = require("../js/language-book-data.js");

const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.5.json"), "utf8"));
const advance = dataApi.lookup(dataset, "advance").entry;
const hypothesis = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-VANCE-WANG-001");
const experiment = dataset.experiments.find((item) => item.experiment_id === "UNI-EXP-ADVANCE-001");

test("G.3 adds ADVANCE as the third calibration Candidate", () => {
  assert.equal(dataset.dataset_version, "0.5.0");
  assert.equal(dataset.classification_model.package, "G.3");
  assert.equal(dataset.entries.filter((entry) => entry.classification_status === "candidate").length, 3);
  assert.equal(advance.classification_status, "candidate");
  assert.equal(advance.primary_chinese_mapping.chinese_form, "往");
  assert.equal(advance.primary_chinese_mapping.mapping_basis, "author-proposal");
  assert.deepEqual(advance.secondary_chinese_mappings.map((item) => item.chinese_form), ["推进", "前进"]);
});

test("author morphology and source-backed etymology remain parallel objects", () => {
  const note = advance.other_author_notes[0];
  const etymology = advance.historical_etymologies[0];
  assert.match(note.text.en, /ad\.van\.ce/);
  assert.match(note.text.en, /ad\.vance\.ment/);
  assert.equal(note.source_verification.status, "disputed");
  assert.equal(etymology.source_verification.status, "source-backed");
  assert.deepEqual(etymology.chain, ["English advance", "Middle English advauncen / avauncen", "Anglo-French avancer", "Vulgar Latin *abantiāre", "Latin abante (ab + ante: before / in front)"]);
  assert.match(etymology.summary.en, /does not contain.*morpheme vance/i);
});

test("sound-semantic hypothesis and future validation do not claim results", () => {
  assert.equal(hypothesis.status, "Untested");
  assert.equal(hypothesis.confidence, "low");
  assert.match(hypothesis.statement.en, /No sound change.*common origin is asserted/i);
  assert.equal(experiment.identity, "experimental-plan");
  assert.equal(experiment.status, "Untested");
  assert.deepEqual(experiment.metrics, {});
  assert.match(experiment.result.en, /Not Tested/);
});

test("every ADVANCE object keeps Source Verification separate from AI Review", () => {
  const objects = [advance.primary_chinese_mapping, ...advance.secondary_chinese_mappings, ...advance.mapping_rationales, ...advance.historical_etymologies, ...advance.other_author_notes, hypothesis, experiment];
  for (const object of objects) {
    assert.ok(object.source_verification);
    assert.equal(object.ai_review.status, "not-reviewed");
    assert.equal(object.ai_review.reviewer, null);
  }
});

test("G.3 archive remains queryable after the canonical loader advances", () => {
  assert.equal(dataApi.DATASET_URL, "data/language-book.v1.0.json");
  assert.equal(dataApi.lookup(dataset, "advancement").entry.entry_id, advance.entry_id);
  assert.equal(dataApi.lookup(dataset, "往").entry.entry_id, advance.entry_id);
  const canonical = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v1.0.json"), "utf8"));
  assert.ok(dataApi.languageForms(canonical).find((group) => group.code === "en").forms.some((form) => form.term === "advance"));
  assert.match(fs.readFileSync(path.join(root, "words/advance.html"), "utf8"), /Author Analysis vs Source-backed Etymology/);
});
