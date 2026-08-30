import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.3.json"), "utf8"));
const schema = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.schema.json"), "utf8"));
const candidates = JSON.parse(fs.readFileSync(path.join(root, "data", "candidates", "package-e-batch-001.v0.2.json"), "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const unique = (values, label) => { const seen = new Set(); for (const value of values) { check(!seen.has(value), `Duplicate ${label}: ${value}`); seen.add(value); } };
const localized = (value) => value && typeof value.en === "string" && value.en.trim() && typeof value["zh-Hans"] === "string" && value["zh-Hans"].trim();

function validateReviews(item, label, sourceIds) {
  check(item.source_verification && item.ai_review, `${label} must have separate source_verification and ai_review`);
  if (!item.source_verification || !item.ai_review) return;
  for (const ref of item.source_verification.source_refs) check(sourceIds.has(ref), `${label} broken source verification ref ${ref}`);
  check(localized(item.source_verification.notes), `${label} source verification notes must be bilingual`);
  check(localized(item.ai_review.rationale), `${label} AI review rationale must be bilingual`);
  if (item.ai_review.status === "not-reviewed") {
    check(item.ai_review.reviewer === null && item.ai_review.reviewed_at === null, `${label} not-reviewed must not name a reviewer or date`);
  }
}

check(dataset.schema_version === "2.0.0", "schema_version must be 2.0.0");
check(dataset.dataset_version === "0.3.0", "latest canonical dataset must be v0.3.0");
check(schema.properties.schema_version.const === dataset.schema_version, "schema and dataset versions disagree");
check(dataset.classification_model.package === "G.1" && dataset.classification_model.version === "0.1", "G.1 classification metadata missing");
check(/one primary Chinese mapping/i.test(dataset.classification_model.principle), "core G.1 principle missing");

const sourceIds = new Set(dataset.sources.map((source) => source.source_id));
const hypothesisIds = new Set(dataset.hypotheses.map((item) => item.hypothesis_id));
const experimentIds = new Set(dataset.experiments.map((item) => item.experiment_id));
unique([...sourceIds], "source_id"); unique([...hypothesisIds], "hypothesis_id"); unique([...experimentIds], "experiment_id");
for (const source of dataset.sources) check(fs.existsSync(path.join(root, source.path)), `Broken provenance path ${source.source_id}: ${source.path}`);

for (const hypothesis of dataset.hypotheses) {
  check(hypothesis.identity === "author-hypothesis", `${hypothesis.hypothesis_id} lost hypothesis identity`);
  check(localized(hypothesis.statement), `${hypothesis.hypothesis_id} statement must be bilingual`);
  validateReviews(hypothesis, hypothesis.hypothesis_id, sourceIds);
}
for (const experiment of dataset.experiments) {
  check(experiment.identity === "experimental-result", `${experiment.experiment_id} lost experimental-result identity`);
  check(localized(experiment.tested_condition) && localized(experiment.result), `${experiment.experiment_id} lacks tested condition/result`);
  for (const ref of experiment.hypothesis_refs) check(hypothesisIds.has(ref), `${experiment.experiment_id} broken hypothesis ref ${ref}`);
  validateReviews(experiment, experiment.experiment_id, sourceIds);
}

unique(dataset.entries.map((entry) => entry.entry_id), "entry_id");
const mappingIds = [];
for (const entry of dataset.entries) {
  check(entry.primary_chinese_mapping?.role === "primary", `${entry.entry_id} must have exactly one primary Chinese mapping`);
  check(!Object.hasOwn(entry, "candidate_cross_language_mappings"), `${entry.entry_id} retains mixed legacy mapping objects`);
  check(!Object.hasOwn(entry.primary_chinese_mapping || {}, "etymology_evidence"), `${entry.entry_id} mapping still embeds etymology`);
  check(!Object.hasOwn(entry.primary_chinese_mapping || {}, "experiment_links"), `${entry.entry_id} mapping still embeds experiment links`);
  check(entry.secondary_chinese_mappings.every((mapping) => mapping.role === "secondary"), `${entry.entry_id} secondary list contains non-secondary mapping`);
  const mappings = [entry.primary_chinese_mapping, ...entry.secondary_chinese_mappings];
  for (const mapping of mappings) { mappingIds.push(mapping.mapping_id); validateReviews(mapping, mapping.mapping_id, sourceIds); }
  for (const rationale of entry.mapping_rationales) { check(rationale.identity === "author-idea", `${rationale.rationale_id} must remain author idea`); validateReviews(rationale, rationale.rationale_id, sourceIds); }
  for (const item of entry.historical_etymologies) { check(item.identity === "historical-claim", `${item.etymology_id} must remain historical claim`); validateReviews(item, item.etymology_id, sourceIds); }
  for (const ref of entry.sound_symbol_hypothesis_refs) check(hypothesisIds.has(ref), `${entry.entry_id} broken hypothesis ref ${ref}`);
  for (const item of entry.other_author_notes) validateReviews(item, item.note_id, sourceIds);
  for (const ref of entry.experimental_validation_refs) check(experimentIds.has(ref), `${entry.entry_id} broken experiment ref ${ref}`);
  for (const ref of entry.source_provenance) check(sourceIds.has(ref), `${entry.entry_id} broken entry source ref ${ref}`);
}
unique(mappingIds, "mapping_id");

const water = dataset.entries.find((entry) => entry.normalized_form === "water");
const language = dataset.entries.find((entry) => entry.normalized_form === "language");
check(water?.classification_status === "candidate", "WATER calibration record must remain candidate");
check(water?.primary_chinese_mapping.chinese_form === "哗" && water.primary_chinese_mapping.status === "candidate", "WATER primary candidate must be 哗");
check(water?.sound_symbol_hypothesis_refs.includes("UNI-W-FH-PHONETIC-001") && water.sound_symbol_hypothesis_refs.includes("UNI-W-WATER-002"), "WATER hypotheses are not independently linked");
check(water?.experimental_validation_refs.includes("UNI-EXP-002"), "WATER must link independent Experiment 002 validation");
check(language?.classification_status === "candidate", "LANGUAGE calibration record must remain candidate");
check(language?.primary_chinese_mapping.chinese_form === "朗" && language.primary_chinese_mapping.status === "candidate", "LANGUAGE primary candidate must be 朗");
check(language?.historical_etymologies[0].chain.join("|") === "English language|Old French langage|Latin lingua", "LANGUAGE etymology chain must be separate");
check(language?.sound_symbol_hypothesis_refs.includes("UNI-L-INHERENT-SEMANTIC-001"), "LANGUAGE L hypothesis must be independently linked");
for (const entry of [water, language]) {
  const objects = [entry.primary_chinese_mapping, ...entry.mapping_rationales, ...entry.historical_etymologies, ...entry.sound_symbol_hypothesis_refs.map((id) => dataset.hypotheses.find((item) => item.hypothesis_id === id)), ...entry.experimental_validation_refs.map((id) => dataset.experiments.find((item) => item.experiment_id === id))].filter(Boolean);
  check(objects.every((item) => item.ai_review.status === "not-reviewed"), `${entry.source_word} calibration objects were automatically AI-reviewed`);
}

check(candidates.records.length === 19, "Package E/F/G queue must remain exactly 19 records");
check(candidates.records.every((record) => record.review_status === "candidate"), "A 19-record candidate was promoted by G.1");
for (const record of candidates.records) check(!dataset.entries.some((entry) => entry.normalized_form === record.normalized_form), `${record.candidate_id} leaked into G.1 canonical records`);

const exp002 = dataset.experiments.find((item) => item.experiment_id === "UNI-EXP-002");
check(exp002?.status === "Tested-Inconclusive", "UNI-EXP-002 must remain Tested-Inconclusive");
check(exp002?.metrics.w_target === 7 && exp002?.metrics.w_total === 120 && exp002?.metrics.control_target === 9 && exp002?.metrics.control_total === 240, "UNI-EXP-002 frozen counts changed");
check(exp002?.metrics.risk_ratio === 1.556 && exp002?.metrics.fisher_two_sided_p === 0.4185, "UNI-EXP-002 frozen metrics changed");

if (errors.length) {
  console.error(`Language Book G.1 validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Language Book dataset v${dataset.dataset_version}: VALID`);
console.log(`${dataset.entries.length} word records · ${mappingIds.length} Chinese mappings · ${dataset.hypotheses.length} independent hypotheses · ${dataset.experiments.length} experiment`);
