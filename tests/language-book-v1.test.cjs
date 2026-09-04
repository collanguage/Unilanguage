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
  for (const term of ["肚子", "反常的", "修道院", "在", "盖", "斡", "声", "往", "南迦巴瓦"]) assert.ok(terms("zh-Hans").includes(term), `missing Chinese browse form ${term}`);
  for (const term of ["abdomen", "abdominal", "abdominale", "aberrant", "aberrante", "abbaye", "abbé", "abbesse", "erreur"]) assert.ok(terms("fr").includes(term), `missing French browse form ${term}`);

  for (const group of groups.values()) {
    for (const form of group) assert.equal(dataApi.lookup(dataset, form.term).entry.id, form.recordId, `${form.term} did not resolve to its unified record`);
  }
  assert.equal(dataset.entries.filter((entry) => entry.entry_status === "Published").length, publishedBefore);
  assert.equal(dataset.entries.filter((entry) => entry.mapping_status === "Candidate").length, candidatesBefore);
});

test("Chinese browse presents exactly one concise explanation per record", () => {
  const chinese = dataApi.languageForms(dataset).find((group) => group.code === "zh-Hans").forms;
  const visibleCount = dataset.entries.filter((entry) => entry.mapping_status !== "Rejected" && entry.classification_status !== "rejected").length;
  assert.equal(chinese.length, visibleCount);
  assert.equal(new Set(chinese.map((form) => form.recordId)).size, visibleCount);
  for (const unwanted of ["暂缓／中止状态", "绝对的／完全的", "南迦巴瓦峰", "放弃职责", "肚", "向后／吃惊地", "反常的／偏离常规的", "大量存在／繁盛", "声音", "宇宙", "天空", "爱"]) {
    assert.ok(!chinese.some((form) => form.term === unwanted), `redundant Chinese browse form remains: ${unwanted}`);
  }
  const preferred = Object.fromEntries(chinese.map((form) => [form.slug, form.term]));
  assert.equal(preferred.aback, "吃惊地");
  assert.equal(preferred.absolute, "绝对的");
  assert.equal(preferred.abdomen, "肚子");
  assert.equal(preferred["namcha-barwa"], "南迦巴瓦");
});

test("English, Chinese and French browse forms each occupy one row", () => {
  const css = fs.readFileSync(path.join(root, "css", "semantic-mapper.css"), "utf8");
  assert.match(css, /\.language-form-list\{display:grid;grid-template-columns:1fr;justify-items:start/);
});

test("language browse follows A–Z for English/French and stroke collation for Chinese", () => {
  const groups = new Map(dataApi.languageForms(dataset).map((group) => [group.code, group]));
  for (const code of ["en", "fr"]) {
    const terms = groups.get(code).forms.map((form) => form.term);
    const expected = [...terms].sort(new Intl.Collator(code, { sensitivity: "base", numeric: true }).compare);
    assert.deepEqual(terms, expected, `${code} browse forms are not alphabetized`);
    assert.equal(groups.get(code).sortLabel, "A–Z");
  }
  const chinese = groups.get("zh-Hans").forms.map((form) => form.term);
  const expectedChinese = [...chinese].sort(new Intl.Collator("zh-Hans-u-co-stroke", { sensitivity: "base", numeric: true }).compare);
  assert.deepEqual(chinese, expectedChinese, "Chinese browse forms are not in stroke order");
  assert.equal(groups.get("zh-Hans").sortLabel, "新华字典式笔画序");
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

test("Universe is upgraded in place as the first root-level semantic-operation record", () => {
  assert.equal(dataset.dataset_version, "1.2.5");
  assert.equal(dataset.entries.length, 37);
  for (const query of ["universe", "universus", "uni", "vers", "vert", "turn", "宇宙", "宇", "宙", "转", "斡", "涡", "窝", "蜗", "周", "合", "全"]) {
    assert.equal(dataApi.lookup(dataset, query).entry.slug, "universe", `Universe lookup failed for ${query}`);
  }
  const universe = dataApi.lookup(dataset, "universe").entry;
  assert.equal(universe.primary_mapping.target.word, "宇宙");
  assert.equal(universe.primary_mapping.mapping_type, "Standard lexical translation");
  assert.equal(universe.root_level_mapping.version, "1.0");
  assert.deepEqual(universe.root_level_mapping.featured_structural_mapping, {
    source: "universe",
    target: "斡",
    reading: "wò",
    status: "Strong semantic candidate",
    historical_relation: "Not claimed",
    boundary: {
      en: "Featured for the semantic operation TURN / ROTATION; it is not the standard translation and no Latin–Chinese cognacy is claimed.",
      "zh-Hans": "用于突出 TURN／ROTATION 语义操作；它不是通用翻译，也不主张拉丁语与汉语同源。",
    },
  });
  assert.equal(universe.root_level_mapping.latin_decomposition.status, "Established");
  assert.match(universe.root_level_mapping.latin_decomposition.chain, /UNI \(unus\).*VERS \(versus ← vertere\).*WHOLE/);
  assert.equal(universe.root_level_mapping.traditional_chinese_construction.chain, "宇 + 宙 → SPACE + TIME → COSMOS");
  assert.deepEqual(universe.root_level_mapping.whole_candidates, ["合", "全", "周"]);
  assert.equal(universe.root_level_mapping.chinese_structural_candidates.find((item) => item.character === "斡").candidate_grade, "Strong semantic candidate");
  assert.equal(universe.root_level_mapping.chinese_structural_candidates.find((item) => item.character === "窝／窩").candidate_grade, "Cognitive/Visual Candidate");
  assert.equal(universe.root_level_mapping.chinese_structural_candidates.find((item) => item.character === "蜗／蝸").candidate_grade, "Cognitive/Visual Candidate");
  assert.ok(universe.root_level_mapping.chinese_structural_candidates.every((item) => item.historical_relation === "Not claimed"));
  assert.equal(universe.evidence.Historical.status, "Established");
  assert.equal(universe.evidence["Phonetic-Semantic"].confidence, "Low");
  assert.equal(universe.evidence.Cognitive.status, "Interpretive");
  assert.equal(universe.hypotheses.find((item) => item.hypothesis_id === "HYP-COGNITIVE-TRACE-001").status, "Speculative/Testable");
  assert.equal(universe.hypotheses.find((item) => item.hypothesis_id === "HYP-COSMIC-MOTION-ENCODING-001").status, "Untested");
  const authorHypothesis = universe.hypotheses.find((item) => item.hypothesis_id === "HYP-UNIVERSE-SPIRAL-001");
  assert.equal(authorHypothesis.status, "Speculative/Testable");
  assert.ok(authorHypothesis.counterexamples.includes("Historical evidence: Unestablished"));
  assert.ok(authorHypothesis.counterexamples.includes("Scientific claim: not established by etymology"));
});

test("Mapper renders optional root-level metadata without changing ordinary records", () => {
  const mapper = fs.readFileSync(path.join(root, "js", "semantic-mapper.js"), "utf8");
  assert.match(mapper, /Root-Level Semantic Operations/);
  assert.match(mapper, /Translation ≠ Mapping/);
  assert.match(mapper, /Featured structural mapping · 特色结构映射/);
  assert.match(mapper, /headline-translation/);
  assert.match(mapper, /root_level_mapping/);
  assert.equal(dataApi.lookup(dataset, "sky").entry.root_level_mapping, undefined);
});

test("Sound shows 声 as the featured form while preserving 声音 as standard translation", () => {
  const sound = dataApi.lookup(dataset, "sound").entry;
  assert.equal(sound.featured_mapping.target, "声");
  assert.equal(sound.featured_mapping.reading, "shēng");
  assert.equal(sound.featured_mapping.status, "Supported lexical equivalent");
  assert.equal(sound.featured_mapping.historical_relation, "Not claimed");
  assert.equal(sound.primary_mapping.target.word, "声音");
  assert.equal(sound.primary_mapping.target.pronunciation, "shēngyīn");
  assert.match(sound.primary_mapping.meaning["zh-Hans"], /响／响起/);
  assert.equal(sound.languages.find((item) => item.word === "响").pronunciation, "xiǎng");
  assert.equal(sound.languages.find((item) => item.word === "sonner").code, "fr");
  assert.equal(sound.evidence.Historical.status, "Established");
  assert.equal(sound.evidence["Phonetic-Semantic"].confidence, "Low");
  assert.equal(sound.literary_layer.status, "Published");
  assert.equal(sound.literary_layer.is_historical_evidence, false);
  assert.equal(sound.literary_layer.proposition["zh-Hans"], "那是凝固的音乐。");
  assert.match(sound.literary_layer.essay_prose[0].text["zh-Hans"], /小提琴.*教堂.*凝固的音乐/s);
  assert.ok(sound.featured_mapping.source_refs.includes("SRC-LB-SOUND"));
  assert.ok(dataApi.languageForms(dataset).find((group) => group.code === "zh-Hans").forms.some((form) => form.term === "声" && form.recordId === sound.id));

  const page = fs.readFileSync(path.join(root, "words", "sound.html"), "utf8");
  assert.match(page, /class="sound-title"/);
  assert.match(page, /<span>↔ 声 <small>shēng<\/small><\/span><span>· 声音<\/span>/);
  const styles = fs.readFileSync(path.join(root, "css", "sky-case.css"), "utf8");
  assert.match(styles, /\.sound-title span\{white-space:nowrap\}/);
  assert.match(page, /Literary boundary/);
  assert.match(page, /那是凝固的音乐/);
});

test("Dictionary cards honor featured forms and keep standard translations visible", () => {
  const search = fs.readFileSync(path.join(root, "js", "search.js"), "utf8");
  assert.match(search, /entry\.featured_mapping \|\| entry\.root_level_mapping\?\.featured_structural_mapping/);
  assert.match(search, /Standard translation · 通用翻译/);
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
  assert.equal(abdomen.featured_mapping.target, "肚");
  assert.equal(abdomen.featured_mapping.reading, "dù");
  assert.match(abdomen.featured_mapping.status, /Low confidence/);
  assert.equal(abdomen.featured_mapping.historical_relation, "Not claimed");
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
  assert.match(abdomen.literary_layer.essay_prose[0].text["zh-Hans"], /饥饿、呼吸、成长与最初的记忆/);
  assert.equal(abdomen.page, "words/abdomen.html");
  assert.match(abdomen.source.raw_note, /Is the belly our domain\?/);

  const page = fs.readFileSync(path.join(root, abdomen.page), "utf8");
  assert.match(page, /abdomen ↔ 肚 <small>dù<\/small> · 肚子/);
  assert.match(page, /ab\.dom\.en ≠ verified morphology/);
  assert.match(page, /文学—认知链/);
  assert.match(page, /文学意象，不构成词义、词源或语音证据/);
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
  for (const query of ["Namcha Barwa", "Namjagbarwa", "གནམ་ལྕགས་འབར་བ", "gnam lcags 'bar ba", "南迦巴瓦", "南迦巴瓦峰", "直刺天空的长矛", "燃烧的天铁"]) {
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
  assert.equal(entry.media.find((item) => item.type === "external creative work").content_status, "not independently verified");
  assert.equal(entry.media.find((item) => item.media_id === "MEDIA-NAMCHA-PHOTO-001").license, "CC BY-SA 3.0");
  assert.equal(entry.media.find((item) => item.media_id === "MEDIA-NAMCHA-LITERARY-001").content_status, "literary visualization; not geographic evidence");
  assert.equal(entry.languages.find((form) => form.code === "bo").word, "གནམ་ལྕགས་འབར་བ།");
  assert.equal(entry.name_analysis.wylie, "gnam lcags ’bar ba");
  assert.equal(entry.name_analysis.chinese_name_assessment.type, "phonetic transcription plus geographic classifier");
  assert.equal(entry.name_analysis.translation_assessments.find((item) => item.chinese === "雷电如火燃烧").grade, "closest semantic paraphrase");
  assert.equal(entry.name_analysis.translation_assessments.find((item) => item.chinese.includes("长矛")).literal_match, "weak");
  const poem = entry.literary_layer.poem_lyrics.find((item) => item.work_id === "LB-NAMCHA-POEM-001");
  assert.deepEqual(Object.keys(poem.text), ["zh-Hans", "en", "fr", "bo"]);
  for (const code of ["zh-Hans", "en", "fr", "bo"]) {
    const [introduction, firstStanza, secondStanza] = poem.text[code].split("\n\n");
    assert.ok(introduction, `${code} introduction missing`);
    assert.equal(firstStanza.split("\n").length, 10, `${code} first stanza lineation changed`);
    assert.equal(secondStanza.split("\n").length, 12, `${code} second stanza lineation changed`);
  }
  assert.equal(entry.literary_layer.translations.find((item) => item.language_code === "zh-Hans").status, "Original Text");
  assert.equal(entry.literary_layer.translations.find((item) => item.language_code === "en").status, "Literary Translation");
  assert.equal(entry.literary_layer.translations.find((item) => item.language_code === "fr").status, "Literary Translation");
  assert.equal(entry.literary_layer.translations.find((item) => item.language_code === "bo").status, "Translation Draft");
  assert.match(entry.literary_layer.translations.find((item) => item.language_code === "bo").review_status, /native Tibetan speaker/);
});

test("Namcha Barwa page presents four accessible language tabs with honest translation statuses", () => {
  const html = fs.readFileSync(path.join(root, "words", "namcha-barwa.html"), "utf8");
  const tabs = fs.readFileSync(path.join(root, "js", "literary-tabs.js"), "utf8");
  for (const label of ["中文", "English", "Français", "བོད་ཡིག"]) assert.match(html, new RegExp(label));
  assert.match(html, /Original Text｜原作/);
  assert.equal((html.match(/Literary Translation｜文学译本/g) || []).length, 2);
  assert.match(html, /Translation Draft｜翻译初稿/);
  assert.match(html, /尚待藏语母语者逐句审校/);
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 4);
  assert.match(tabs, /ArrowLeft/);
  assert.match(tabs, /aria-selected/);
});

test("Mapper exposes the named-entity label separately from ordinary mappings", () => {
  const mapper = fs.readFileSync(path.join(root, "js/semantic-mapper.js"), "utf8");
  assert.match(mapper, /Named Entity \/ Literary Entry/);
  assert.match(mapper, /Named Entity Forms/);
  assert.match(mapper, /form\.code === "bo"/);
});
