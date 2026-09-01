const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v1.0.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/batches/legacy-website-import-batch-001.v1.json"), "utf8"));
const api = require(path.join(root, "js/language-book-data.js"));

test("legacy batch reconciles all 20 source pages without manufacturing records", () => {
  assert.equal(manifest.summary.source_pages_processed, 20);
  assert.equal(manifest.summary.new_records, 14);
  assert.equal(manifest.summary.existing_records_merged, 4);
  assert.equal(manifest.summary.research_queue, 1);
  assert.equal(manifest.source_reconciliation.total, 20);
  assert.equal(dataset.entries.length, 37);
});

test("every new legacy record preserves raw authorship and four-track evaluation", () => {
  for (const item of manifest.records) {
    const entry = dataset.entries.find((x) => x.id === item.final_record_ids[0]);
    assert.ok(entry, item.final_record_ids[0]);
    assert.equal(entry.author, "Jinkai Liu");
    assert.ok(entry.source.raw_note);
    assert.equal(entry.legacy.batch_id, manifest.batch_id);
    assert.deepEqual(Object.keys(entry.evidence), ["Historical", "Phonetic-Semantic", "Cognitive", "Speculative"]);
    assert.ok(entry.counterevidence.length);
    assert.equal(entry.literary_layer.is_historical_evidence, false);
  }
});

test("legacy Mapper terms route to unified records", () => {
  const expected = {
    a:"a-indefinite-article", abeyance:"abeyance", 闭:"abeyance", abound:"abound", 蹦:"abound",
    abridge:"abridge", acumen:"acumen", aliment:"aliment", 粮:"aliment", above:"above", absolute:"absolute",
    aback:"aback", abandon:"abandon", abash:"abash", abbreviate:"abbreviate", abbreviation:"abbreviate",
    abdicate:"abdicate", abhor:"abhor"
  };
  for (const [query, slug] of Object.entries(expected)) assert.equal(api.lookup(dataset, query).entry?.slug, slug, query);
});

test("deduplication and historical corrections remain explicit", () => {
  assert.equal(api.lookup(dataset, "at").entry?.slug, "at");
  assert.equal(api.lookup(dataset, "abbey").entry?.legacy_import?.action, "merged-source-deduplicated");
  assert.match(api.lookup(dataset, "abridge").entry.evidence.Historical.summary.en, /abbreviare/);
  assert.match(api.lookup(dataset, "abandon").entry.evidence.Historical.summary.en, /not historically ban \+ donner/);
  assert.match(api.lookup(dataset, "abhor").entry.evidence.Historical.summary.en, /horrere/);
});

test("prior calibration entries still resolve", () => {
  for (const [query, slug] of Object.entries({Sky:"sky",Light:"light",at:"at",abbey:"abbey",aberrant:"aberrant",abdomen:"abdomen","Namcha Barwa":"namcha-barwa"})) {
    assert.equal(api.lookup(dataset, query).entry?.slug, slug, query);
  }
});
