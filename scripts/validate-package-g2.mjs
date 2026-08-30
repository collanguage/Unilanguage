import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.4.json"), "utf8"));
const rubric = JSON.parse(fs.readFileSync(path.join(root, "data", "review", "object-review-rubric.g2.v0.1.json"), "utf8"));
const queue = JSON.parse(fs.readFileSync(path.join(root, "data", "candidates", "package-g-decision-register.v0.1.json"), "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(dataset.dataset_version === "0.4.0", "G.2 dataset must be v0.4.0");
check(dataset.schema_version === "2.0.0", "G.2 must retain classification schema 2.0.0");
check(dataset.classification_model.package === "G.2" && dataset.classification_model.parent_package === "G.1 v0.1", "G.2 parent metadata missing");
const sourceMap = new Map(dataset.sources.map((source) => [source.source_id, source]));
for (const source of dataset.sources) {
  check(fs.existsSync(path.join(root, source.path)), `Broken local source dossier path ${source.source_id}`);
  if (source.url) {
    check(/^https:\/\//.test(source.url), `${source.source_id} URL must be HTTPS`);
    check(Array.isArray(source.supports) && source.supports.length, `${source.source_id} lacks supports boundary`);
    check(Array.isArray(source.does_not_support) && source.does_not_support.length, `${source.source_id} lacks non-support boundary`);
  }
}

const language = dataset.entries.find((entry) => entry.normalized_form === "language");
const water = dataset.entries.find((entry) => entry.normalized_form === "water");
const etymology = language.historical_etymologies.find((item) => item.etymology_id === "ETY-language-001");
check(etymology.chain.join("|") === "English language|Middle English langage / language|Old French langage|Old French langue|Latin lingua", "LANGUAGE verified chain is incomplete");
check(etymology.source_verification.status === "source-backed", "LANGUAGE etymology must be source-backed");
check(etymology.source_verification.source_refs.includes("SRC-AHD-LANGUAGE") && etymology.source_verification.source_refs.includes("SRC-MED-LANGAGE"), "LANGUAGE etymology lacks dictionary references");

const wf = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-W-FH-PHONETIC-001");
check(wf.source_verification.status === "disputed", "W↔F/H claim must be disputed as stated");
check(wf.evidence_refs.includes("SRC-IPA-CHART") && wf.evidence_refs.includes("SRC-CAMBRIDGE-COMPARATIVE"), "W↔F/H lacks phonetic/method evidence");
check(/not a voicing pair/i.test(wf.source_verification.notes.en), "W↔F/H correction is not explicit");

const lGlyph = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-L-GLYPH-HISTORY-001");
const lSemantic = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-L-INHERENT-SEMANTIC-001");
check(language.sound_symbol_hypothesis_refs.includes(lGlyph.hypothesis_id) && language.sound_symbol_hypothesis_refs.includes(lSemantic.hypothesis_id), "LANGUAGE must link both independent L hypotheses");
check(lGlyph.source_verification.status === "disputed" && lGlyph.confidence === "low", "L glyph history uncertainty missing");
check(lSemantic.source_verification.status === "needs-verification", "L inherent semantics must remain unverified");
check(/does not show/i.test(lSemantic.source_verification.notes.en), "L historical evidence boundary missing");

for (const item of [language.primary_chinese_mapping, etymology, wf, lGlyph, lSemantic]) {
  check(item.ai_review.status === "not-reviewed" && item.ai_review.reviewer === null, `${item.mapping_id || item.etymology_id || item.hypothesis_id} was auto-reviewed`);
}
check(water.primary_chinese_mapping.status === "candidate", "WATER mapping was promoted");
check(language.primary_chinese_mapping.status === "candidate", "LANGUAGE mapping was promoted");

check(rubric.status === "active-method-not-yet-executed", "Rubric must not claim execution");
check(rubric.object_types.length === 7, "Rubric must cover seven object types");
check(rubric.ai_review.required_common_checks.includes("Do not change publication status."), "Rubric lacks publication boundary");
check(rubric.ai_review.type_specific_checks.historical_etymology.length > 0, "Rubric lacks etymology checks");
check(rubric.ai_review.type_specific_checks.sound_consonant_symbol_hypothesis.length > 0, "Rubric lacks hypothesis checks");
check(rubric.ai_review.type_specific_checks.experimental_validation.length > 0, "Rubric lacks experiment checks");

check(queue.records.length === 19, "Package G queue count changed");
check(queue.records.every((record) => record.decision_record.status === "pending"), "A Package G decision was made");
check(queue.records.every((record) => record.publication_gate.publication_status === "not_published"), "A Package G record was published");
const exp002 = dataset.experiments.find((item) => item.experiment_id === "UNI-EXP-002");
check(exp002.status === "Tested-Inconclusive" && exp002.metrics.w_target === 7 && exp002.metrics.control_target === 9 && exp002.metrics.fisher_two_sided_p === 0.4185, "Experiment 002 frozen result changed");

for (const id of ["SRC-AHD-LANGUAGE", "SRC-MED-LANGAGE", "SRC-IPA-CHART", "SRC-CAMBRIDGE-COMPARATIVE", "SRC-YALE-WADI-EL-HOL", "SRC-ANTIQUITY-EARLY-ALPHABET", "SRC-COLLESS-ALPHABET-L"]) check(sourceMap.has(id), `Missing G.2 source ${id}`);

if (errors.length) {
  console.error(`Package G.2 validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Package G.2 v0.1: VALID");
console.log("LANGUAGE etymology source-backed · W↔F/H disputed · L history split · AI reviews 0 · Published 0");
