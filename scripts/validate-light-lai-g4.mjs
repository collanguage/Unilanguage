import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const dataset = read("data/language-book.v0.6.json");
const schema = read("data/language-book.schema.json");
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const localized = (value) => value && typeof value.en === "string" && value.en.trim() && typeof value["zh-Hans"] === "string" && value["zh-Hans"].trim();

function shallowSchemaCheck(item, defName, label) {
  const def = schema.$defs[defName];
  check(Boolean(def), `Schema definition missing: ${defName}`);
  if (!def || !item) return;
  for (const key of def.required || []) check(Object.hasOwn(item, key), `${label} missing required ${key}`);
  if (def.additionalProperties === false) {
    for (const key of Object.keys(item)) check(Object.hasOwn(def.properties, key), `${label} has unsupported property ${key}`);
  }
  for (const [key, rule] of Object.entries(def.properties || {})) {
    if (!Object.hasOwn(item, key)) continue;
    const value = item[key];
    if (rule.const !== undefined) check(value === rule.const, `${label}.${key} must equal ${rule.const}`);
    if (rule.enum) check(rule.enum.includes(value), `${label}.${key} has invalid enum value ${value}`);
    if (rule.pattern && typeof value === "string") check(new RegExp(rule.pattern).test(value), `${label}.${key} fails ${rule.pattern}`);
    if (rule.type === "array") check(Array.isArray(value), `${label}.${key} must be array`);
    if (rule.type === "object") check(value && typeof value === "object" && !Array.isArray(value), `${label}.${key} must be object`);
    if (rule.type === "string") check(typeof value === "string", `${label}.${key} must be string`);
  }
}

const standaloneFiles = [
  "data/candidates/light-lai.v0.1.json",
  "data/evidence/etymology/light-lai.v0.1.json",
  "data/hypotheses/sound-light-cross-modal.v0.1.json",
  "data/hypotheses/l-light-semantic-cluster.v0.1.json",
  "data/experiments/plans/light-lai-cross-modal.v0.1.json",
  "data/sources/literary/ru-guang-tian-lai.v0.1.json",
];
const standalone = standaloneFiles.map((file) => ({ file, record: read(file) }));
for (const { file, record } of standalone.slice(0, 5)) {
  check(record.status === "Candidate", `${file} must remain Candidate`);
  check(record.review_decision === "retain_without_promotion", `${file} must retain_without_promotion`);
}

const candidate = standalone[0].record;
check(candidate.mapping_cardinality.primary_mapping_count === 1 && candidate.mapping_cardinality.compliant === true, "LIGHT candidate must have exactly one primary Chinese mapping");
check(candidate.primary_chinese_mapping.simplified === "籁" && candidate.primary_chinese_mapping.traditional === "籟", "LIGHT candidate mapping must remain 籁/籟");
check(/unsupported/i.test(candidate.observed_relation.historical_cognacy), "LIGHT candidate must state historical cognacy is unsupported");
for (const [name, ref] of Object.entries(candidate.linked_records)) {
  const target = path.resolve(path.dirname(path.join(root, standaloneFiles[0])), ref);
  check(target.startsWith(root) && fs.existsSync(target), `Broken candidate linked record ${name}: ${ref}`);
}

const crossModal = standalone[2].record;
const cluster = standalone[3].record;
const experimentPlan = standalone[4].record;
const literary = standalone[5].record;
check(crossModal.workflow_status === "Untested" && crossModal.confidence === "low", "Cross-modal hypothesis must remain Untested/low");
check(cluster.workflow_status === "Untested" && cluster.confidence === "low", "L-Light hypothesis must remain Untested/low");
check(cluster.deduplication.positive_counts.eligible_surface_forms === 4 && cluster.deduplication.positive_counts.deep_pie_families === 1, "L-Light deduplication must remain 4 surface → 1 PIE family");
check(cluster.negative_controls.length >= 5, "L-Light hypothesis needs positive and negative controls");
check(experimentPlan.workflow_status === "Planned / Not tested" && Object.keys(experimentPlan.metrics).length === 0 && /Not Tested/i.test(experimentPlan.result), "LIGHT experiment must remain a planned, unexecuted study with no metrics");
check(literary.status === "Published" && literary.review_decision === "published_as_literary_work_without_hypothesis_promotion" && literary.author_attribution === "Jinkai Liu", "Literary work must be published with Jinkai Liu attribution without promoting the hypothesis");
check(literary.historical_evidence === false && literary.classification === "Literary / Cognitive Interpretation", "Published literary record must stay outside historical evidence");
check(candidate.publication_axes?.entry_status === "Published" && candidate.publication_axes?.mapping_status === "Candidate" && candidate.publication_axes?.literary_status === "Published", "Publication axes must separate the Published entry/literature from the Candidate mapping");

check(dataset.schema_version === schema.properties.schema_version.const, "Canonical dataset and schema version disagree");
check(dataset.dataset_version === "0.6.0" && dataset.classification_model.package === "G.4", "Canonical dataset must be G.4 / v0.6.0");
for (const key of schema.required) check(Object.hasOwn(dataset, key), `Dataset missing schema-required ${key}`);
for (const key of Object.keys(dataset)) check(Object.hasOwn(schema.properties, key), `Dataset has unsupported top-level property ${key}`);

const sourceIds = new Set();
for (const source of dataset.sources) {
  shallowSchemaCheck(source, "source", source.source_id || "source");
  check(!sourceIds.has(source.source_id), `Duplicate source_id ${source.source_id}`);
  sourceIds.add(source.source_id);
  check(fs.existsSync(path.join(root, source.path)), `Broken source path ${source.source_id}: ${source.path}`);
}
const hypothesisIds = new Set();
for (const hypothesis of dataset.hypotheses) {
  shallowSchemaCheck(hypothesis, "hypothesis", hypothesis.hypothesis_id || "hypothesis");
  shallowSchemaCheck(hypothesis.source_verification, "sourceVerification", `${hypothesis.hypothesis_id}.source_verification`);
  shallowSchemaCheck(hypothesis.ai_review, "aiReview", `${hypothesis.hypothesis_id}.ai_review`);
  check(localized(hypothesis.label) && localized(hypothesis.statement), `${hypothesis.hypothesis_id} must be bilingual`);
  check(!hypothesisIds.has(hypothesis.hypothesis_id), `Duplicate hypothesis_id ${hypothesis.hypothesis_id}`);
  hypothesisIds.add(hypothesis.hypothesis_id);
  for (const ref of [...hypothesis.source_refs, ...hypothesis.evidence_refs, ...hypothesis.source_verification.source_refs]) check(sourceIds.has(ref), `${hypothesis.hypothesis_id} broken source ref ${ref}`);
}
const experimentIds = new Set();
for (const experiment of dataset.experiments) {
  shallowSchemaCheck(experiment, "experiment", experiment.experiment_id || "experiment");
  shallowSchemaCheck(experiment.source_verification, "sourceVerification", `${experiment.experiment_id}.source_verification`);
  shallowSchemaCheck(experiment.ai_review, "aiReview", `${experiment.experiment_id}.ai_review`);
  check(!experimentIds.has(experiment.experiment_id), `Duplicate experiment_id ${experiment.experiment_id}`);
  experimentIds.add(experiment.experiment_id);
  for (const ref of experiment.source_refs) check(sourceIds.has(ref), `${experiment.experiment_id} broken source ref ${ref}`);
  for (const ref of experiment.hypothesis_refs) check(hypothesisIds.has(ref), `${experiment.experiment_id} broken hypothesis ref ${ref}`);
}

const entryIds = new Set();
const mappingIds = new Set();
for (const entry of dataset.entries) {
  shallowSchemaCheck(entry, "entry", entry.entry_id || "entry");
  check(!entryIds.has(entry.entry_id), `Duplicate entry_id ${entry.entry_id}`);
  entryIds.add(entry.entry_id);
  const mappings = [entry.primary_chinese_mapping, ...entry.secondary_chinese_mappings];
  check(entry.primary_chinese_mapping.role === "primary", `${entry.entry_id} must have one primary mapping`);
  for (const mapping of mappings) {
    shallowSchemaCheck(mapping, "mapping", mapping.mapping_id || "mapping");
    shallowSchemaCheck(mapping.source_verification, "sourceVerification", `${mapping.mapping_id}.source_verification`);
    shallowSchemaCheck(mapping.ai_review, "aiReview", `${mapping.mapping_id}.ai_review`);
    check(!mappingIds.has(mapping.mapping_id), `Duplicate mapping_id ${mapping.mapping_id}`);
    mappingIds.add(mapping.mapping_id);
  }
  for (const rationale of entry.mapping_rationales) shallowSchemaCheck(rationale, "rationale", rationale.rationale_id);
  for (const item of entry.historical_etymologies) shallowSchemaCheck(item, "etymology", item.etymology_id);
  for (const note of entry.other_author_notes) shallowSchemaCheck(note, "authorNote", note.note_id);
  for (const ref of entry.sound_symbol_hypothesis_refs) check(hypothesisIds.has(ref), `${entry.entry_id} broken hypothesis ref ${ref}`);
  for (const ref of entry.experimental_validation_refs) check(experimentIds.has(ref), `${entry.entry_id} broken experiment ref ${ref}`);
  for (const ref of entry.source_provenance) check(sourceIds.has(ref), `${entry.entry_id} broken source provenance ${ref}`);
}

const light = dataset.entries.find((entry) => entry.entry_id === "LB-en-light-001");
check(light?.classification_status === "candidate", "LIGHT canonical entry must remain candidate");
check(light?.primary_chinese_mapping.status === "candidate" && light?.primary_chinese_mapping.chinese_form === "籁", "LIGHT primary mapping must remain candidate 籁");
check(light?.secondary_chinese_mappings.length === 0, "LIGHT must keep exactly one Chinese mapping");
check(light?.historical_etymologies.length === 3 && light.historical_etymologies.every((item) => item.source_verification.status === "source-backed"), "LIGHT must keep three independent source-backed historical tracks");
check(light?.sound_symbol_hypothesis_refs.includes("UNI-LIGHT-LAI-001") && light?.sound_symbol_hypothesis_refs.includes("UNI-L-LIGHT-CLUSTER-001"), "LIGHT hypothesis references incomplete");
check(light?.experimental_validation_refs.includes("UNI-EXP-LIGHT-001"), "LIGHT experiment reference missing");
const lightObjects = [light?.primary_chinese_mapping, ...(light?.mapping_rationales || []), ...(light?.historical_etymologies || []), ...(light?.other_author_notes || []), dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-LIGHT-LAI-001"), dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-L-LIGHT-CLUSTER-001"), dataset.experiments.find((item) => item.experiment_id === "UNI-EXP-LIGHT-001")].filter(Boolean);
check(lightObjects.every((item) => item.ai_review?.status === "not-reviewed" && item.ai_review.reviewer === null), "No LIGHT object may be promoted by AI review");
check(fs.existsSync(path.join(root, "words", "light.html")), "LIGHT word page missing");

if (errors.length) {
  console.error(`LIGHT G.4 validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("LIGHT G.4: VALID");
console.log("Published entry + Published literature · 1 canonical Candidate mapping · 2 Untested hypotheses · 1 Planned/Not tested experiment · 0 hypothesis promotions");
