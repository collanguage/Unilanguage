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

test("language browse is generated from unified record forms without changing record counts", () => {
  const publishedBefore = dataset.entries.filter((entry) => entry.entry_status === "Published").length;
  const candidatesBefore = dataset.entries.filter((entry) => entry.mapping_status === "Candidate").length;
  const groups = new Map(dataApi.languageForms(dataset).map((group) => [group.code, group.forms]));
  const terms = (code) => groups.get(code).map((form) => form.term);

  for (const term of ["abdomen", "abdominal", "aberrant", "abbey", "sky", "light", "at", "presence", "advance"]) assert.ok(terms("en").includes(term), `missing English browse form ${term}`);
  for (const term of ["肚", "肚子", "讹", "修道院", "在", "爱", "盖", "往"]) assert.ok(terms("zh-Hans").includes(term), `missing Chinese browse form ${term}`);
  for (const term of ["abdomen", "abdominal", "abdominale", "aberrant", "aberrante", "abbaye", "abbé", "abbesse", "erreur"]) assert.ok(terms("fr").includes(term), `missing French browse form ${term}`);

  for (const group of groups.values()) {
    for (const form of group) assert.equal(dataApi.lookup(dataset, form.term).entry.id, form.recordId, `${form.term} did not resolve to its unified record`);
  }
  assert.equal(dataset.entries.filter((entry) => entry.entry_status === "Published").length, publishedBefore);
  assert.equal(dataset.entries.filter((entry) => entry.mapping_status === "Candidate").length, candidatesBefore);
});

test("required mapper queries preserve unified record and independent status axes", () => {
  const expected = { abdomen: "abdomen", abdominal: "abdomen", 肚子: "abdomen", abbey: "abbey", 修道院: "abbey", aberrant: "aberrant", 讹: "aberrant", at: "at", 在: "at", presence: "at" };
  for (const [query, slug] of Object.entries(expected)) {
    const entry = dataApi.lookup(dataset, query).entry;
    assert.equal(entry.slug, slug, `lookup failed for ${query}`);
    assert.ok(entry.entry_status);
    assert.ok(entry.mapping_status);
    assert.ok(entry.evidence);
    assert.equal(entry.literary_layer.is_historical_evidence, false);
  }
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

test("Dataset Expansion v1 abbey sample separates lexical, historical, phonetic and literary claims", () => {
  for (const query of ["abbey", "abbaye", "abbé", "abbesse", "修道院", "bi", "bei", "蓓蕾"]) {
    assert.equal(dataApi.lookup(dataset, query).entry.slug, "abbey", `lookup failed for ${query}`);
  }
  const abbey = dataApi.lookup(dataset, "abbey").entry;
  assert.equal(abbey.entry_status, "Reviewed");
  assert.equal(abbey.mapping_status, "Reviewed");
  assert.equal(abbey.mapping_level, "Unrated");
  assert.equal(abbey.primary_mapping.target.word, "修道院");
  assert.equal(abbey.historical_relation_status, "Not claimed");
  assert.equal(abbey.evidence.Historical.status, "Established");
  assert.equal(abbey.evidence["Phonetic-Semantic"].confidence, "Low");
  assert.equal(abbey.literary_layer.status, "Reviewed");
  assert.equal(abbey.literary_layer.is_historical_evidence, false);
  assert.match(abbey.source.raw_note, /蓓蕾/);
});

test("Dataset Expansion v1 aberrant sample keeps morphology, word class and err ↔ 讹 candidate separate", () => {
  for (const query of ["aberrant", "err", "erreur", "aberrante", "讹", "错讹", "错误", "荒谬"]) {
    assert.equal(dataApi.lookup(dataset, query).entry.slug, "aberrant", `lookup failed for ${query}`);
  }
  const aberrant = dataApi.lookup(dataset, "aberrant").entry;
  assert.equal(aberrant.entry_status, "Reviewed");
  assert.equal(aberrant.mapping_status, "Reviewed");
  assert.equal(aberrant.primary_mapping.target.word, "反常的／偏离常规的");
  assert.equal(aberrant.historical_relation_status, "Not claimed");
  assert.equal(aberrant.evidence.Historical.status, "Established");
  assert.equal(aberrant.evidence["Phonetic-Semantic"].status, "Candidate");
  assert.equal(aberrant.evidence.Speculative.status, "Rejected");
  assert.equal(aberrant.hypotheses.find((item) => item.hypothesis_id === "UNI-ABERRANT-BRIDGE-B-002").status, "Rejected");
  assert.equal(aberrant.literary_layer.is_historical_evidence, false);
  assert.match(aberrant.source.raw_note, /天鹅/);
});

test("abdomen keeps translation, sound candidate, word families and literary association separate", () => {
  for (const query of ["abdomen", "肚", "肚子", "腹", "腹部", "belly", "ventre", "abdominal", "dome", "domain", "domestic", "dominant", "dominate"]) {
    assert.equal(dataApi.lookup(dataset, query).entry.slug, "abdomen", `lookup failed for ${query}`);
  }
  const abdomen = dataApi.lookup(dataset, "abdomen").entry;
  assert.equal(abdomen.entry_status, "Reviewed");
  assert.equal(abdomen.mapping_status, "Reviewed");
  assert.equal(abdomen.primary_mapping.target.word, "肚子");
  assert.match(abdomen.primary_mapping.meaning["zh-Hans"], /腹部／腹/);
  assert.equal(abdomen.historical_relation_status, "Not claimed");
  assert.equal(abdomen.evidence.Historical.status, "Established");
  assert.equal(abdomen.evidence["Phonetic-Semantic"].confidence, "Low");
  assert.equal(abdomen.related_words.find((item) => item.word === "abdominal").relationship_type, "Etymological derivative");
  assert.equal(abdomen.related_words.find((item) => item.word === "dome").relationship_type, "Speculative semantic association");
  assert.ok(abdomen.semantic_associations.every((item) => item.is_etymological === false));
  assert.equal(abdomen.literary_layer.proposition["zh-Hans"], "肚子是我们的领地吗？");
  assert.equal(abdomen.literary_layer.is_historical_evidence, false);
  assert.match(abdomen.source.raw_note, /Is the belly our domain\?/);
});

test("Mapper labels related-word etymology separately from speculative association", () => {
  const mapper = fs.readFileSync(path.join(root, "js/semantic-mapper.js"), "utf8");
  assert.match(mapper, /Etymological relation · 词源关系/);
  assert.match(mapper, /Semantic\/speculative association · 语义／推测联想/);
});

test("Mapper presents dataset-driven language groups and the shared-record explanation", () => {
  const html = fs.readFileSync(path.join(root, "semantic-mapper.html"), "utf8");
  const mapper = fs.readFileSync(path.join(root, "js/semantic-mapper.js"), "utf8");
  assert.match(html, /Browse by Language｜按语言浏览/);
  assert.match(html, /Different language forms may resolve to the same semantic record｜不同语言形式可映射到同一语义记录/);
  assert.doesNotMatch(html, /Schema records · 统一词条/);
  assert.match(mapper, /UnilanguageData\.languageForms\(dataset\)/);
});

test("Namcha Barwa is a searchable named entity and literary entry, not a phonetic candidate", () => {
  for (const query of ["Namcha Barwa", "南迦巴瓦", "南迦巴瓦峰", "直刺天空的长矛"]) {
    assert.equal(dataApi.lookup(dataset, query).entry.slug, "namcha-barwa", `lookup failed for ${query}`);
  }
  const entry = dataApi.lookup(dataset, "Namcha Barwa").entry;
  assert.equal(entry.record_kind, "named_entity");
  assert.deepEqual(entry.entity_types, ["proper_name", "place", "named_entity"]);
  assert.equal(entry.mapping_status, "Reviewed");
  assert.equal(entry.mapping_level, "Unrated");
  assert.equal(entry.evidence["Phonetic-Semantic"].status, "Not claimed");
  assert.equal(entry.hypotheses.length, 0);
  assert.equal(entry.literary_layer.status, "Published");
  assert.equal(entry.literary_layer.is_historical_evidence, false);
  assert.match(entry.source.raw_note, /情青/);
  assert.equal(entry.media[0].content_status, "not independently verified");
});

test("Mapper exposes the named-entity label separately from ordinary mappings", () => {
  const mapper = fs.readFileSync(path.join(root, "js/semantic-mapper.js"), "utf8");
  assert.match(mapper, /Named Entity \/ Literary Entry/);
  assert.match(mapper, /Named Entity Forms/);
});
