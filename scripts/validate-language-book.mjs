import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const datasetPath = path.join(root, "data", "language-book.v0.2.json");
const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
const candidateBatch = JSON.parse(fs.readFileSync(path.join(root, "data", "candidates", "package-e-batch-001.v0.2.json"), "utf8"));
const errors = [];
const requiredEntry = ["entry_id", "source_word", "language", "normalized_form", "pronunciation", "phonetic_form", "lexical_meaning", "aliases", "candidate_cross_language_mappings", "entry_review_status", "source_provenance", "notes", "author", "version"];
const requiredMapping = ["mapping_id", "mapping_language", "mapping_form", "mapping_type", "claim_kind", "phonetic_relation", "semantic_structure", "etymology_evidence", "evidence_tracks", "mapping_level", "hypothesis_links", "experiment_status", "experiment_links", "confidence", "review_status", "source_provenance", "notes"];
const enums = {
  mapping_type: ["lexical-equivalent", "historical-relation", "script-relation", "phonetic-semantic-candidate", "semantic-cognitive-association", "cultural-metaphor", "research-condition"],
  claim_kind: ["Observed Mapping", "Hypothesis", "Experimentally Tested Result"],
  mapping_level: ["A", "B", "C", "D"],
  experiment_status: ["Untested", "Tested-Supported", "Tested-Inconclusive", "Tested-Not-Supported", "Invalid"],
  confidence: ["low", "medium", "high"],
  review_status: ["candidate", "reviewed", "published", "rejected"],
  evidence_tracks: ["Historical", "Phonetic-Semantic", "Cognitive", "Speculative"],
};

function check(condition, message) { if (!condition) errors.push(message); }
function unique(values, label) {
  const seen = new Set();
  values.forEach((value) => { if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}`); seen.add(value); });
}
function hasLocalizedText(value) { return value && typeof value.en === "string" && value.en.trim() && typeof value["zh-Hans"] === "string" && value["zh-Hans"].trim(); }

check(dataset.schema_version === "1.0.0", "schema_version must be 1.0.0");
check(dataset.dataset_version === "0.2.0", "latest canonical dataset must be v0.2.0");
check(/^\d+\.\d+\.\d+$/.test(dataset.dataset_version), "dataset_version must use semver");
check(JSON.stringify(dataset.lifecycle.stages) === JSON.stringify(["candidate", "reviewed", "published"]), "lifecycle must be candidate → reviewed → published");
unique(dataset.sources.map((source) => source.source_id), "source_id");
unique(dataset.hypotheses.map((item) => item.hypothesis_id), "hypothesis_id");
unique(dataset.experiments.map((item) => item.experiment_id), "experiment_id");
unique(dataset.entries.map((entry) => entry.entry_id), "entry_id");
const sourceIds = new Set(dataset.sources.map((source) => source.source_id));
const hypothesisIds = new Set(dataset.hypotheses.map((item) => item.hypothesis_id));
const experimentMap = new Map(dataset.experiments.map((item) => [item.experiment_id, item]));

for (const source of dataset.sources) {
  check(fs.existsSync(path.join(root, source.path)), `Broken provenance path ${source.source_id}: ${source.path}`);
}
for (const item of [...dataset.hypotheses, ...dataset.experiments]) {
  for (const ref of item.source_refs) check(sourceIds.has(ref), `Broken source ref ${ref}`);
}

const mappingIds = [];
for (const entry of dataset.entries) {
  for (const field of requiredEntry) check(Object.hasOwn(entry, field), `${entry.entry_id || "entry"} missing ${field}`);
  check(entry.normalized_form === entry.source_word.normalize("NFKC").trim().toLocaleLowerCase("en"), `${entry.entry_id} normalized_form mismatch`);
  check(hasLocalizedText(entry.lexical_meaning), `${entry.entry_id} lexical_meaning must be bilingual`);
  check(hasLocalizedText(entry.notes), `${entry.entry_id} notes must be bilingual`);
  check(entry.entry_review_status === "published", `${entry.entry_id} canonical entry must be published`);
  for (const ref of entry.source_provenance) check(sourceIds.has(ref), `${entry.entry_id} broken source ref ${ref}`);
  for (const mapping of entry.candidate_cross_language_mappings) {
    mappingIds.push(mapping.mapping_id);
    for (const field of requiredMapping) check(Object.hasOwn(mapping, field), `${mapping.mapping_id || entry.entry_id} missing ${field}`);
    for (const field of ["mapping_type", "claim_kind", "mapping_level", "experiment_status", "confidence", "review_status"]) check(enums[field].includes(mapping[field]), `${mapping.mapping_id} invalid ${field}: ${mapping[field]}`);
    mapping.evidence_tracks.forEach((track) => check(enums.evidence_tracks.includes(track), `${mapping.mapping_id} invalid evidence track: ${track}`));
    check(hasLocalizedText(mapping.etymology_evidence), `${mapping.mapping_id} etymology_evidence must be bilingual`);
    check(hasLocalizedText(mapping.notes), `${mapping.mapping_id} notes must be bilingual`);
    for (const ref of mapping.source_provenance) check(sourceIds.has(ref), `${mapping.mapping_id} broken source ref ${ref}`);
    for (const ref of mapping.hypothesis_links) check(hypothesisIds.has(ref), `${mapping.mapping_id} broken hypothesis ref ${ref}`);
    for (const ref of mapping.experiment_links) {
      check(experimentMap.has(ref), `${mapping.mapping_id} broken experiment ref ${ref}`);
      if (experimentMap.has(ref)) check(mapping.experiment_status === experimentMap.get(ref).status, `${mapping.mapping_id} experiment status conflicts with ${ref}`);
    }
    if (mapping.claim_kind === "Experimentally Tested Result") check(mapping.experiment_links.length > 0, `${mapping.mapping_id} tested result lacks experiment link`);
    if (mapping.experiment_links.length === 0) check(mapping.experiment_status === "Untested", `${mapping.mapping_id} has status without experiment link`);
  }
}
unique(mappingIds, "mapping_id");

check(candidateBatch.review_status === "candidate", "Package E batch must remain candidate");
check(candidateBatch.records.length === 19, "Package E batch must contain 19 candidate records");
unique(candidateBatch.records.map((record) => record.candidate_id), "candidate_id");
for (const record of candidateBatch.records) {
  check(record.review_status === "candidate", `${record.candidate_id} was promoted without review`);
  check(Array.isArray(record.blockers) && record.blockers.length > 0, `${record.candidate_id} lacks review blockers`);
  check(!dataset.entries.some((entry) => entry.normalized_form === record.normalized_form), `${record.candidate_id} leaked into canonical published entries`);
}

const exp002 = experimentMap.get("UNI-EXP-002");
check(exp002?.status === "Tested-Inconclusive", "UNI-EXP-002 primary status must remain Tested-Inconclusive");
check(exp002?.primary === true, "UNI-EXP-002 must remain primary");
const expected002 = {
  w_target: 7, w_total: 120, w_rate_percent: 5.83,
  control_target: 9, control_total: 240, control_rate_percent: 3.75,
  risk_ratio: 1.556, risk_ratio_95_ci: [0.594, 4.075],
  risk_difference_percentage_points: 2.08,
  risk_difference_95_ci_percentage_points: [-4.12, 9.57],
  fisher_two_sided_p: 0.4185,
};
check(JSON.stringify(exp002?.metrics) === JSON.stringify(expected002), "UNI-EXP-002 metrics differ from the frozen public result");
const frozenPrimary = JSON.parse(fs.readFileSync(path.join(root, "experiments", "002", "results", "primary-result.v1.0.json"), "utf8"));
check(frozenPrimary.outcome === "INCONCLUSIVE", "Frozen Experiment 002 outcome is not INCONCLUSIVE");
check(frozenPrimary.table.w_target === 7 && frozenPrimary.table.control_target === 9, "Frozen Experiment 002 counts changed");
check(Math.abs(frozenPrimary.risk_ratio - 1.5555555555555556) < 1e-12, "Frozen Experiment 002 RR changed");

if (errors.length) {
  console.error(`Language Book validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Language Book dataset v${dataset.dataset_version}: VALID`);
console.log(`${dataset.entries.length} entries · ${mappingIds.length} mappings · ${dataset.sources.length} provenance sources · ${dataset.experiments.length} experiment`);
