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
check(dataset.schema_version === "1.0.0" && dataset.dataset_version === "1.0.2", "Schema must remain 1.0.0 and Dataset Expansion release must be 1.0.2");
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
const at = dataset.entries.find((entry) => entry.slug === "at");
check(at?.entry_status === "Published" && at?.mapping_status === "Candidate" && at?.historical_relation_status === "Not claimed", "AT status axes changed");
check(at?.primary_mapping.source.pronunciation === "/æt/" && /tsaɪ̯/.test(at?.primary_mapping.target.pronunciation), "AT pronunciation observation changed");
check(at?.semantic_structure.relation === "LOCATION → PRESENCE → RELATION → WORLD", "AT semantic chain changed");
check(at?.literary_layer.proposition["zh-Hans"] === "爱就是在。爱在，世界就在。", "AT proposition changed");
const sky = dataset.entries.find((entry) => entry.slug === "sky");
check(sky?.mapping_status === "Candidate" && sky?.semantic_structure.relation === "ABOVE → COVER", "Sky calibration boundary changed");
const light = dataset.entries.find((entry) => entry.slug === "light");
check(light?.entry_status === "Published" && light?.mapping_status === "Candidate" && light?.literary_layer.is_historical_evidence === false, "Light status/literary boundary changed");
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

if (errors.length) {
  console.error(`Language Book v1.0 validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Language Book Entry Schema v1.0: VALID`);
console.log(`${dataset.entries.length} entries · 4 independent evidence tracks each · ${dataset.entries.filter((entry) => entry.entry_status === "Published").length} published entries`);
