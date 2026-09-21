const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v1.0.json"), "utf8"));
const ledger = JSON.parse(fs.readFileSync(path.join(root, "data/evidence/mainland-source-recalibration.v1.json"), "utf8"));

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules"].includes(entry.name)) return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(target) : [target];
  });
}

test("current repository has no superseded Chinese citation identifiers or hosts", () => {
  const removedHostSuffix = String.fromCharCode(46, 101, 100, 117, 46, 116, 119);
  const removedCharacterHost = String.fromCharCode(99, 104, 97, 114, 100, 98, 46, 105, 105, 115, 46, 115, 105, 110, 105, 99, 97);
  const removedGovernmentPrefix = String.fromCharCode(82, 69, 70, 45, 77, 79, 69);
  const removedCharacterPrefix = String.fromCharCode(82, 69, 70, 45, 83, 73, 78, 73, 67, 65);
  const needles = ["moe" + removedHostSuffix, removedCharacterHost, removedGovernmentPrefix, removedCharacterPrefix];
  const textual = new Set([".html", ".json", ".md", ".mjs", ".cjs", ".js", ".css", ".txt", ".xml"]);
  for (const file of filesBelow(root)) {
    if (!textual.has(path.extname(file))) continue;
    const contents = fs.readFileSync(file, "utf8");
    for (const needle of needles) assert.equal(contents.includes(needle), false, `${needle} remains in ${path.relative(root, file)}`);
  }
});

test("policy ledger classifies claims and records inaccessible dictionaries as pending", () => {
  assert.equal(ledger.author, "Jinkai Liu");
  assert.equal(ledger.entry_count_before, 37);
  assert.equal(ledger.entry_count_after, 37);
  assert.equal(ledger.candidate_upgrade_count, 0);
  const types = new Set(ledger.claims.map((claim) => claim.claim_type));
  for (const type of ["modern_meaning", "historical_meaning", "orthography", "phonology", "attestation", "reconstruction"]) {
    assert.ok(types.has(type) || ledger.source_catalog.some((source) => source.scope.includes(type)), `missing ${type}`);
  }
  const pending = ledger.source_catalog.filter((source) => source.disposition === "desired_pending");
  assert.ok(pending.length >= 5);
  assert.ok(pending.every((source) => /未|待/.test(source.boundary)));
});

test("priority records retain count and status boundaries", () => {
  assert.equal(dataset.entries.filter((entry) => !["new", "horizon", "horse", "abbreviation","abdominal"].includes(entry.slug)).length, 37);
  const expected = {
    sky: ["Published", "Candidate", "Not claimed"],
    universe: ["Published", "Supported", "Not claimed"],
    light: ["Published", "Candidate", "Not claimed"], // Final structural freeze: no cross-language claim; no promotion.
    at: ["Published", "Candidate", "Not claimed"],
    abandon: ["Published", "Supported", "Not claimed"],
    abash: ["Published", "Candidate", "Not claimed"],
    abbey: ["Reviewed", "Candidate", "Not claimed"],
    abdomen: ["Reviewed", "Reviewed", "Not claimed"],
    aberrant: ["Reviewed", "Candidate", "Not claimed"],
    "namcha-barwa": ["Published", "Reviewed", "Not claimed"],
  };
  for (const [slug, values] of Object.entries(expected)) {
    const entry = dataset.entries.find((item) => item.slug === slug);
    assert.ok(entry, `missing ${slug}`);
    assert.deepEqual([entry.entry_status, entry.mapping_status, entry.historical_relation_status], values);
  }
  assert.equal(dataset.entries.find((item) => item.slug === "abbey").featured_mapping.status, "Candidate · Low confidence");
  const abandon = dataset.entries.find((item) => item.slug === "abandon");
  assert.equal(abandon.featured_mapping.target, "放");
  assert.ok(abandon.consonant_group_mapping.candidates.some((candidate) => candidate.source_unit === "bandon" && candidate.target === "办 / 辦"));
  const abash=dataset.entries.find((item) => item.slug === "abash");
  assert.equal(abash.featured_mapping,undefined); // Batch 2 explicitly leaves Featured Pending.
  assert.equal(abash.query_views.find(v=>v.terms.includes('bash')).featured_mapping.target,'拍');
});

test("replacement references are claim-scoped and verified records carry provenance", () => {
  const ids = new Set(dataset.entries.flatMap((entry) => entry.references.map((reference) => reference.reference_id)));
  for (const id of ["REF-ZDIC-BENG", "REF-ZDIC-TONG", "REF-ZDIC-BING", "REF-ZDIC-PAI", "REF-ZDIC-PA", "REF-ZDIC-BA", "REF-ZDIC-DIE", "REF-ZDIC-YE", "REF-NOPSS-SW-KINSHIP", "REF-ZDIC-DU", "REF-ZDIC-FU", "REF-ZDIC-E"]) {
    assert.ok(ids.has(id), `missing ${id}`);
  }
  for (const entry of dataset.entries) {
    const entryIds = entry.references.map((reference) => reference.reference_id);
    assert.equal(entryIds.length, new Set(entryIds).size, `duplicate reference id in ${entry.slug}`);
    for (const reference of entry.references) assert.ok(reference.provenance, `missing provenance: ${entry.slug}/${reference.reference_id}`);
  }
});

test("frozen Mapper stylesheet remains outside the recalibration surface", () => {
  const changed = require("node:child_process")
    .execFileSync("git", ["diff", "--name-only", "--", "css/semantic-mapper.css"], { cwd: root, encoding: "utf8" })
    .trim();
  assert.equal(changed, "");
});
