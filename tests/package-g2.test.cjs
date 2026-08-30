const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.4.json"), "utf8"));
const rubric = JSON.parse(fs.readFileSync(path.join(root, "data/review/object-review-rubric.g2.v0.1.json"), "utf8"));
const queue = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-g-decision-register.v0.1.json"), "utf8"));
const entry = (word) => dataset.entries.find((item) => item.normalized_form === word);
const hypothesis = (id) => dataset.hypotheses.find((item) => item.hypothesis_id === id);

test("G.2 keeps one candidate primary mapping and separate lexical secondary mapping", () => {
  for (const [word, primary, secondary] of [["water", "哗", "水"], ["language", "朗", "语言"]]) {
    const record = entry(word);
    assert.equal(record.primary_chinese_mapping.chinese_form, primary);
    assert.equal(record.primary_chinese_mapping.role, "primary");
    assert.ok(record.secondary_chinese_mappings.some((item) => item.chinese_form === secondary));
    assert.equal(record.classification_status, "candidate");
    assert.equal(record.primary_chinese_mapping.ai_review.status, "not-reviewed");
  }
});

test("LANGUAGE etymology is source-backed without verifying language↔朗", () => {
  const etymology = entry("language").historical_etymologies[0];
  assert.deepEqual(etymology.chain, ["English language", "Middle English langage / language", "Old French langage", "Old French langue", "Latin lingua"]);
  assert.equal(etymology.source_verification.status, "source-backed");
  assert.deepEqual(etymology.source_verification.source_refs, ["SRC-AHD-LANGUAGE", "SRC-MED-LANGAGE"]);
  assert.match(etymology.source_verification.notes.en, /do not support.*language↔朗/i);
  assert.equal(etymology.ai_review.status, "not-reviewed");
});

test("W↔F/H is preserved but disputed as a voicing-pair claim", () => {
  const item = hypothesis("UNI-W-FH-PHONETIC-001");
  assert.equal(item.source_verification.status, "disputed");
  assert.match(item.source_verification.notes.en, /not a voicing pair/i);
  assert.match(item.source_verification.notes.en, /paired with \/v\//i);
  assert.match(item.source_verification.notes.en, /language-specific, repeated comparative data/i);
  assert.equal(item.ai_review.status, "not-reviewed");
});

test("L glyph history and inherent semantics remain separate hypotheses", () => {
  const record = entry("language");
  assert.deepEqual(record.sound_symbol_hypothesis_refs, ["UNI-L-GLYPH-HISTORY-001", "UNI-L-INHERENT-SEMANTIC-001"]);
  const glyph = hypothesis("UNI-L-GLYPH-HISTORY-001");
  const semantics = hypothesis("UNI-L-INHERENT-SEMANTIC-001");
  assert.equal(glyph.hypothesis_type, "letter-symbol-history");
  assert.equal(semantics.hypothesis_type, "sound-semantic");
  assert.equal(glyph.source_verification.status, "disputed");
  assert.match(glyph.statement.en, /not a semantic law/i);
  assert.equal(semantics.source_verification.status, "needs-verification");
  assert.match(semantics.source_verification.notes.en, /does not show.*modern English/i);
  assert.equal(glyph.ai_review.status, "not-reviewed");
  assert.equal(semantics.ai_review.status, "not-reviewed");
});

test("object-level rubric covers seven identities without executing review", () => {
  assert.equal(rubric.status, "active-method-not-yet-executed");
  assert.equal(rubric.object_types.length, 7);
  assert.equal(new Set(rubric.object_types).size, 7);
  assert.match(JSON.stringify(rubric), /Reviewed never implies Published/);
  assert.ok(Object.values(rubric.current_calibration_state).every((state) => /AI not-reviewed/.test(state)));
});

test("G.2 leaves the 19-record decision and publication queue untouched", () => {
  assert.equal(queue.records.length, 19);
  assert.ok(queue.records.every((item) => item.decision_record.status === "pending"));
  assert.ok(queue.records.every((item) => item.publication_gate.publication_status === "not_published"));
});

test("method page states that source verification is not an AI decision", () => {
  const page = fs.readFileSync(path.join(root, "object-review-method.html"), "utf8");
  assert.match(page, /Method active, reviews not executed/);
  assert.match(page, /Source Verification ≠ AI Review/);
  assert.match(page, /Reviewed-by-AI cannot publish a record/);
});
