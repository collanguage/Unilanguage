const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v1.0.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/batches/dataset-expansion-batch-001.v1.json"), "utf8"));
const api = require(path.join(root, "js/language-book-data.js"));

test("Batch 001 manifest records ten completed records and honest triage", () => {
  assert.equal(manifest.summary.processed_records, 10);
  assert.deepEqual(manifest.summary.dispositions, { Reviewed: 6, Candidate: 4 });
  assert.equal(manifest.summary.research_queue, 1);
  assert.equal(manifest.summary.existing_record_checked, 1);
  assert.equal(manifest.existing_record_checks[0].duplicate_created, false);
  assert.match(manifest.scoring.formula, /0\.30\*Verifiability/);
});

test("every Batch 001 record preserves author note, evidence separation and counterevidence", () => {
  for (const item of manifest.records) {
    const entry = dataset.entries.find((candidate) => candidate.id === item.final_record_ids[0]);
    assert.ok(entry, item.final_record_ids[0]);
    assert.equal(entry.author, "Jinkai Liu");
    assert.ok(entry.source.raw_note);
    assert.deepEqual(Object.keys(entry.evidence), ["Historical", "Phonetic-Semantic", "Cognitive", "Speculative"]);
    assert.ok(entry.counterevidence.length);
    assert.equal(entry.literary_layer.is_historical_evidence, false);
    assert.equal(entry.batch.priority_score, item.priority_score);
  }
});

test("required Batch 001 Mapper queries resolve to one intended record", () => {
  const expected = {
    generate: "generate", gen: "generate", root: "generate", 干: "generate", 根: "generate",
    form: "form", farm: "form", media: "media", 媒: "media", sign: "sign", cognitive: "sign",
    montrer: "montrer", monitor: "montrer", fil: "fil", "filière": "fil", fille: "fil",
    figure: "figure", finger: "figure", marchand: "marchand", march: "marchand",
    press: "press", pression: "press", 压: "press", convent: "convent", convention: "convent"
  };
  for (const [query, slug] of Object.entries(expected)) assert.equal(api.lookup(dataset, query).entry?.slug, slug, query);
});

test("negative calibrations and genuine relatives remain typed", () => {
  assert.match(api.lookup(dataset, "farm").entry.related_words.find((x) => x.word === "farm").relationship_type, /negative calibration/i);
  assert.match(api.lookup(dataset, "fille").entry.related_words.find((x) => x.word === "fille").relationship_type, /negative calibration/i);
  assert.match(api.lookup(dataset, "finger").entry.related_words.find((x) => x.word === "finger").relationship_type, /Surface similarity/i);
  assert.match(api.lookup(dataset, "march").entry.related_words.find((x) => x.word.includes("marcher")).relationship_type, /Separate walking family/i);
  assert.match(api.lookup(dataset, "middle").entry.related_words.find((x) => x.word === "middle").relationship_type, /Deep historical cognate/i);
  assert.match(api.lookup(dataset, "monitor").entry.evidence.Historical.summary.en, /deeper Latin-family level/);
  assert.match(api.lookup(dataset, "convention").entry.evidence.Historical.summary.en, /not derived from the religious-institution sense/);
});

test("legacy calibration entries remain stable", () => {
  for (const [query, slug] of Object.entries({ Sky: "sky", Light: "light", at: "at", abbey: "abbey", aberrant: "aberrant", abdomen: "abdomen", "Namcha Barwa": "namcha-barwa" })) {
    const entry = api.lookup(dataset, query).entry;
    assert.equal(entry?.slug, slug, query);
  }
});
