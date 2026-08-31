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
check(dataset.schema_version === "1.0.0" && dataset.dataset_version === "1.0.0", "dataset/schema version must be 1.0.0");
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
  for (const media of entry.media || []) {
    check(["archival image", "original manuscript", "illustration", "generated illustration", "research figure"].includes(media.type), `${entry.id}/${media.media_id}: invalid media type`);
    check(media.alt?.en && media.alt?.["zh-Hans"] && media.caption?.en && media.source && media.provenance, `${entry.id}/${media.media_id}: incomplete media provenance`);
    check(fs.existsSync(path.join(root, media.path)), `${entry.id}/${media.media_id}: missing media file ${media.path}`);
  }
  for (const hypothesis of entry.hypotheses || []) {
    check(hypothesis.hypothesis_id && hypothesis.claim && hypothesis.status && hypothesis.supporting_cases && hypothesis.counterexamples && hypothesis.testability && Object.hasOwn(hypothesis, "experiment_link"), `${entry.id}: incomplete hypothesis`);
  }
  if (entry.page) check(fs.existsSync(path.join(root, entry.page)), `${entry.id}: missing page ${entry.page}`);
}

for (const slug of ["sky", "light", "at", "universe", "human", "sound"]) check(slugs.has(slug), `required migrated entry missing: ${slug}`);
const at = dataset.entries.find((entry) => entry.slug === "at");
check(at?.entry_status === "Published" && at?.mapping_status === "Candidate" && at?.historical_relation_status === "Not claimed", "AT status axes changed");
check(at?.primary_mapping.source.pronunciation === "/æt/" && /tsaɪ̯/.test(at?.primary_mapping.target.pronunciation), "AT pronunciation observation changed");
check(at?.semantic_structure.relation === "LOCATION → PRESENCE → RELATION → WORLD", "AT semantic chain changed");
check(at?.literary_layer.proposition["zh-Hans"] === "爱就是在。爱在，世界就在。", "AT proposition changed");
const sky = dataset.entries.find((entry) => entry.slug === "sky");
check(sky?.mapping_status === "Candidate" && sky?.semantic_structure.relation === "ABOVE → COVER", "Sky calibration boundary changed");
const light = dataset.entries.find((entry) => entry.slug === "light");
check(light?.entry_status === "Published" && light?.mapping_status === "Candidate" && light?.literary_layer.is_historical_evidence === false, "Light status/literary boundary changed");

if (errors.length) {
  console.error(`Language Book v1.0 validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Language Book Entry Schema v1.0: VALID`);
console.log(`${dataset.entries.length} entries · 4 independent evidence tracks each · ${dataset.entries.filter((entry) => entry.entry_status === "Published").length} published entries`);
