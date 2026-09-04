import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v1.0.json"), "utf8"));
const schema = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book-entry.schema.v1.json"), "utf8"));
const errors = [];
const check = (value, message) => { if (!value) errors.push(message); };
const allowed = (group, value, label) => check(dataset.status_enums[group].includes(value), `${label}: invalid ${group} ${value}`);
const ids = new Set();
const slugs = new Set();

check(schema.$defs?.entry, "JSON Schema lacks the entry definition");
check(dataset.schema_version === "1.0.0" && dataset.dataset_version === "1.2.6", "Schema must remain 1.0.0 and the Sky literary/cosmological revision must be 1.2.6");
check(dataset.entries.length === 37, "Universe upgrade must not change the 37-record entry count");
check(dataset.author === "Jinkai Liu", "dataset author must be Jinkai Liu");
check(/entry may be published/i.test(dataset.editorial_policy.publication_boundary.en), "publication boundary policy missing");
check(/one English word/i.test(dataset.editorial_policy.data_separation.en), "data separation policy missing");
check(/not evidence/i.test(dataset.editorial_policy.non_cognacy_position.en), "non-cognacy product position missing");

for (const entry of dataset.entries) {
  check(!ids.has(entry.id), `duplicate id ${entry.id}`); ids.add(entry.id);
  check(!slugs.has(entry.slug), `duplicate slug ${entry.slug}`); slugs.add(entry.slug);
  check(entry.title?.en && entry.title?.["zh-Hans"], `${entry.id}: bilingual title required`);
  check(entry.languages?.length >= 2, `${entry.id}: at least two language forms required`);
  check(entry.primary_mapping?.source?.word && entry.primary_mapping?.target?.word, `${entry.id}: primary mapping source/target required`);
  check(entry.primary_mapping?.mapping_type && entry.primary_mapping?.gloss?.en, `${entry.id}: primary mapping type/gloss required`);
  allowed("entry_status", entry.entry_status, entry.id);
  allowed("mapping_status", entry.mapping_status, entry.id);
  allowed("mapping_level", entry.mapping_level, entry.id);
  allowed("historical_relation_status", entry.historical_relation_status, entry.id);
  for (const track of ["Historical", "Phonetic-Semantic", "Cognitive", "Speculative"]) {
    const value = entry.evidence?.[track];
    check(value, `${entry.id}: missing ${track} evidence track`);
    if (value) { allowed("evidence_status", value.status, `${entry.id}/${track}`); allowed("confidence", value.confidence, `${entry.id}/${track}`); }
  }
  check(entry.literary_layer?.is_historical_evidence === false, `${entry.id}: literature must not be historical evidence`);
  check(entry.author === "Jinkai Liu", `${entry.id}: author must follow project convention`);
  check(Array.isArray(entry.search_terms) && entry.search_terms.length, `${entry.id}: search_terms required`);
  if (entry.source) check(entry.source.type && entry.source.author && entry.source.status && entry.source.normalization && entry.source.raw_note, `${entry.id}: incomplete source/raw note`);
  for (const media of entry.media || []) {
    const external = media.type === "external creative work";
    check(["archival image", "original manuscript", "illustration", "generated illustration", "research figure", "external creative work"].includes(media.type), `${entry.id}/${media.media_id}: invalid media type`);
    check(external ? /^https:\/\//.test(media.url || "") && media.title?.en && media.source && media.provenance : media.alt?.en && media.alt?.["zh-Hans"] && media.caption?.en && media.source && media.provenance, `${entry.id}/${media.media_id}: incomplete media provenance`);
    if (!external) check(fs.existsSync(path.join(root, media.path)), `${entry.id}/${media.media_id}: missing media file ${media.path}`);
  }
  for (const hypothesis of entry.hypotheses || []) {
    check(hypothesis.hypothesis_id && hypothesis.claim && hypothesis.status && hypothesis.supporting_cases && hypothesis.counterexamples && hypothesis.testability && Object.hasOwn(hypothesis, "experiment_link"), `${entry.id}: incomplete hypothesis`);
  }
  const referenceIds = new Set((entry.references || []).map((item) => item.reference_id));
  for (const related of entry.related_words || []) {
    check(related.word && related.language && related.relationship_type && related.family && related.relation_to_entry?.en && related.relation_to_entry?.["zh-Hans"], `${entry.id}: incomplete related word`);
    for (const ref of related.source_refs || []) check(referenceIds.has(ref), `${entry.id}/${related.word}: broken related-word source ref ${ref}`);
  }
  for (const association of entry.semantic_associations || []) {
    check(association.association_id && association.relation && association.status && typeof association.is_etymological === "boolean", `${entry.id}: incomplete semantic association`);
  }
  if (entry.page) check(fs.existsSync(path.join(root, entry.page)), `${entry.id}: missing page ${entry.page}`);
}

for (const slug of ["sky", "light", "at", "universe", "human", "sound"]) check(slugs.has(slug), `required migrated entry missing: ${slug}`);
check(slugs.has("abbey"), "Dataset Expansion v1 sample missing: abbey");
check(slugs.has("abdomen"), "Dataset Expansion v1 sample missing: abdomen");
check(slugs.has("namcha-barwa"), "Named Entity / Literary Entry missing: namcha-barwa");
for (const slug of ["generate", "form", "media", "sign", "montrer", "fil", "figure", "marchand", "press", "convent"]) check(slugs.has(slug), `Dataset Expansion Batch 001 entry missing: ${slug}`);
for (const slug of ["abeyance", "abound", "abridge", "acumen", "aliment", "a-indefinite-article", "above", "absolute", "aback", "abandon", "abash", "abbreviate", "abdicate", "abhor"]) check(slugs.has(slug), `Legacy Website Import Batch 001 entry missing: ${slug}`);
const at = dataset.entries.find((entry) => entry.slug === "at");
check(at?.entry_status === "Published" && at?.mapping_status === "Candidate" && at?.historical_relation_status === "Not claimed", "AT status axes changed");
check(at?.primary_mapping.source.pronunciation === "/æt/" && /tsaɪ̯/.test(at?.primary_mapping.target.pronunciation), "AT pronunciation observation changed");
check(at?.semantic_structure.relation === "LOCATION → PRESENCE → RELATION → WORLD", "AT semantic chain changed");
check(at?.literary_layer.proposition["zh-Hans"] === "爱就是在。爱在，世界就在。", "AT proposition changed");
const sky = dataset.entries.find((entry) => entry.slug === "sky");
check(sky?.mapping_status === "Candidate" && sky?.semantic_structure.relation === "ABOVE → COVER", "Sky calibration boundary changed");
const light = dataset.entries.find((entry) => entry.slug === "light");
check(light?.entry_status === "Published" && light?.mapping_status === "Candidate" && light?.literary_layer.is_historical_evidence === false, "Light status/literary boundary changed");
const universe = dataset.entries.find((entry) => entry.slug === "universe");
check(universe?.primary_mapping.target.word === "宇宙" && universe?.primary_mapping.mapping_type === "Standard lexical translation", "Universe standard translation boundary changed");
check(universe?.root_level_mapping?.version === "1.0", "Universe root-level mapper metadata missing");
check(universe?.root_level_mapping?.featured_structural_mapping?.target === "斡" && universe.root_level_mapping.featured_structural_mapping.reading === "wò", "Universe featured structural mapping missing");
const sound = dataset.entries.find((entry) => entry.slug === "sound");
check(sound?.featured_mapping?.target === "声" && sound.featured_mapping.reading === "shēng", "Sound featured lexical mapping missing");
check(sound?.primary_mapping?.target?.word === "声音", "Sound standard translation must remain 声音");
check(universe?.root_level_mapping?.latin_decomposition?.chain === "Latin universus → UNI (unus) + VERS (versus ← vertere) → ONE + TURNED → WHOLE", "Universe Latin decomposition changed");
check(universe?.root_level_mapping?.traditional_chinese_construction?.chain === "宇 + 宙 → SPACE + TIME → COSMOS", "Universe traditional Chinese construction changed");
check(universe?.root_level_mapping?.chinese_structural_candidates?.length === 9, "Universe Chinese candidate evidence grades incomplete");
check(universe?.hypotheses?.find((item) => item.hypothesis_id === "HYP-UNIVERSE-SPIRAL-001")?.status === "Speculative/Testable", "Universe author hypothesis grade changed");
check(universe?.hypotheses?.find((item) => item.hypothesis_id === "HYP-UNIVERSE-SPIRAL-001")?.counterexamples?.some((item) => /Scientific claim/.test(item)), "Universe scientific-claim boundary missing");
for (const term of ["universus", "uni", "vers", "vert", "turn", "宇", "宙", "转", "斡", "涡", "窝", "蜗", "周", "合", "全"]) check(universe?.search_terms?.includes(term), `Universe search term missing: ${term}`);
const abbey = dataset.entries.find((entry) => entry.slug === "abbey");
check(abbey?.entry_status === "Reviewed" && abbey?.mapping_status === "Reviewed" && abbey?.mapping_level === "Unrated", "Abbey editorial/mapping classification changed");
check(abbey?.primary_mapping.target.word === "修道院", "Abbey primary mapping must remain the standard Chinese equivalent");
check(abbey?.historical_relation_status === "Not claimed" && abbey?.evidence?.Historical?.status === "Established", "Abbey historical word history must remain separate from cross-language historical relation");
check(abbey?.evidence?.["Phonetic-Semantic"]?.confidence === "Low", "Abbey modern-form resemblance must remain low confidence");
check(abbey?.literary_layer?.status === "Reviewed" && abbey?.literary_layer?.is_historical_evidence === false, "Abbey literary boundary changed");
check(/蓓蕾/.test(abbey?.source?.raw_note || ""), "Abbey author source/raw note missing");
const aberrant = dataset.entries.find((entry) => entry.slug === "aberrant");
check(aberrant?.entry_status === "Reviewed" && aberrant?.mapping_status === "Reviewed", "Aberrant lexical mapping classification changed");
check(aberrant?.primary_mapping?.target?.word === "反常的／偏离常规的", "Aberrant primary mapping must remain adjectival and ordinary");
check(aberrant?.historical_relation_status === "Not claimed" && aberrant?.evidence?.Historical?.status === "Established", "Aberrant historical family must remain separate from cross-language relation");
check(aberrant?.evidence?.["Phonetic-Semantic"]?.status === "Candidate", "err ↔ 讹 must remain Candidate");
check(aberrant?.evidence?.Speculative?.status === "Rejected", "consonant-bridge account must remain rejected historically");
check(aberrant?.literary_layer?.is_historical_evidence === false, "Aberrant literature must not become historical evidence");
check(/天鹅/.test(aberrant?.source?.raw_note || ""), "Aberrant author source/raw note missing");
const abdomen = dataset.entries.find((entry) => entry.slug === "abdomen");
check(abdomen?.entry_status === "Reviewed" && abdomen?.mapping_status === "Reviewed" && abdomen?.mapping_level === "Unrated", "Abdomen editorial/mapping classification changed");
check(abdomen?.primary_mapping.target.word === "肚子" && /腹部/.test(abdomen?.primary_mapping.meaning?.["zh-Hans"] || ""), "Abdomen standard translation and primary mapping boundary changed");
check(abdomen?.historical_relation_status === "Not claimed" && abdomen?.evidence?.Historical?.status === "Established", "Abdomen lexical history must remain separate from cross-language historical relation");
check(abdomen?.evidence?.["Phonetic-Semantic"]?.confidence === "Low", "Abdomen ↔ 肚 must remain a low-confidence phonetic-semantic candidate");
check(abdomen?.related_words?.some((item) => item.word === "abdominal" && /Etymological/.test(item.relationship_type)), "Abdominal etymological derivative missing");
check(abdomen?.related_words?.some((item) => item.word === "dome" && /Speculative/.test(item.relationship_type)), "Dome speculative association boundary missing");
check(abdomen?.semantic_associations?.every((item) => item.is_etymological === false), "Abdomen cognitive associations must not be marked etymological");
check(abdomen?.literary_layer?.proposition?.["zh-Hans"] === "肚子是我们的领地吗？" && abdomen?.literary_layer?.is_historical_evidence === false, "Abdomen literary layer changed");
check(/用户英文原稿/.test(abdomen?.source?.raw_note || ""), "Abdomen raw English source missing");
const namcha = dataset.entries.find((entry) => entry.slug === "namcha-barwa");
check(namcha?.record_kind === "named_entity" && ["proper_name", "place", "named_entity"].every((type) => namcha?.entity_types?.includes(type)), "Namcha Barwa entity typing missing");
check(namcha?.entry_status === "Published" && namcha?.mapping_status === "Reviewed" && namcha?.mapping_level === "Unrated", "Namcha Barwa must remain a published named entity, not a phonetic candidate");
check(namcha?.evidence?.["Phonetic-Semantic"]?.status === "Not claimed" && namcha?.hypotheses?.length === 0, "Namcha Barwa must not become a phonetic candidate");
check(namcha?.literary_layer?.status === "Published" && namcha?.literary_layer?.is_historical_evidence === false, "Namcha Barwa literary/evidence boundary changed");
check(/直刺天空的长矛/.test(namcha?.search_terms?.join(" ") || "") && /情青/.test(namcha?.source?.raw_note || ""), "Namcha Barwa search alias or raw note missing");
check(namcha?.media?.some((item) => item.type === "external creative work" && item.content_status === "not independently verified"), "Namcha Barwa external creative work boundary missing");
check(namcha?.languages?.some((item) => item.code === "bo" && item.word === "གནམ་ལྕགས་འབར་བ།"), "Namcha Barwa primary Tibetan form missing");
check(namcha?.name_analysis?.wylie === "gnam lcags ’bar ba" && namcha?.name_analysis?.morphemes?.length === 4, "Namcha Barwa Tibetan lexical analysis incomplete");
check(namcha?.name_analysis?.chinese_name_assessment?.type === "phonetic transcription plus geographic classifier", "Namcha Barwa Chinese transcription assessment missing");
check(namcha?.name_analysis?.translation_assessments?.some((item) => item.chinese === "直刺蓝天的战矛／直刺天空的长矛" && item.literal_match === "weak"), "Namcha Barwa spear interpretation boundary missing");
check(namcha?.name_analysis?.translation_assessments?.some((item) => item.chinese === "雷电如火燃烧" && item.grade === "closest semantic paraphrase"), "Namcha Barwa closest Chinese semantic paraphrase missing");
const namchaPoem = namcha?.literary_layer?.poem_lyrics?.find((item) => item.work_id === "LB-NAMCHA-POEM-001");
const namchaTranslations = namcha?.literary_layer?.translations || [];
check(["zh-Hans", "en", "fr", "bo"].every((code) => typeof namchaPoem?.text?.[code] === "string"), "Namcha Barwa four-language poem text incomplete");
check(namchaTranslations.find((item) => item.language_code === "zh-Hans")?.status === "Original Text", "Namcha Barwa Chinese original status missing");
check(["en", "fr"].every((code) => namchaTranslations.find((item) => item.language_code === code)?.status === "Literary Translation"), "Namcha Barwa English/French literary translation status missing");
check(namchaTranslations.find((item) => item.language_code === "bo")?.status === "Translation Draft" && /native Tibetan speaker/.test(namchaTranslations.find((item) => item.language_code === "bo")?.review_status || ""), "Namcha Barwa Tibetan draft review boundary missing");
check(["zh-Hans", "en", "fr", "bo"].every((code) => namchaPoem.text[code].split("\n\n").length === 3), "Namcha Barwa translations must preserve the introduction and two-stanza structure");
check(["zh-Hans", "en", "fr", "bo"].every((code) => {
  const [, firstStanza, secondStanza] = namchaPoem.text[code].split("\n\n");
  return firstStanza.split("\n").length === 10 && secondStanza.split("\n").length === 12;
}), "Namcha Barwa translations must preserve the original 10-line / 12-line stanza structure");

if (errors.length) {
  console.error(`Language Book v1.0 validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Language Book Entry Schema v1.0: VALID`);
console.log(`${dataset.entries.length} entries · 4 independent evidence tracks each · ${dataset.entries.filter((entry) => entry.entry_status === "Published").length} published entries`);
