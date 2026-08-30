import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.5.json"), "utf8"));
const queue = JSON.parse(fs.readFileSync(path.join(root, "data", "candidates", "package-g-decision-register.v0.1.json"), "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const advance = dataset.entries.find((entry) => entry.normalized_form === "advance");
const hypothesis = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-VANCE-WANG-001");
const experiment = dataset.experiments.find((item) => item.experiment_id === "UNI-EXP-ADVANCE-001");

check(dataset.dataset_version === "0.5.0", "G.3 dataset must be v0.5.0");
check(dataset.classification_model.package === "G.3" && dataset.classification_model.parent_package === "G.2 v0.1", "G.3 metadata missing");
check(dataset.entries.filter((entry) => entry.classification_status === "candidate").length === 3, "exactly three calibration Candidates required");
check(advance?.classification_status === "candidate", "ADVANCE must remain Candidate");
check(advance?.primary_chinese_mapping.chinese_form === "往" && advance.primary_chinese_mapping.identity === "author-idea", "ADVANCE primary mapping must be author-proposed 往");
check(advance?.secondary_chinese_mappings.some((item) => item.chinese_form === "推进") && advance.secondary_chinese_mappings.some((item) => item.chinese_form === "前进"), "ADVANCE lexical mappings are incomplete");
check(advance?.mapping_rationales[0].statement.en.includes("MOVE → FORWARD / TOWARD A DIRECTION"), "ADVANCE semantic structure missing");
check(advance?.other_author_notes[0].text.en.includes("ad.van.ce") && advance.other_author_notes[0].text.en.includes("ad.vance.ment"), "author segmentation not preserved");
check(advance?.other_author_notes[0].source_verification.status === "disputed", "author morphology must show source conflict");
check(advance?.historical_etymologies[0].source_verification.status === "source-backed", "ADVANCE etymology must be source-backed");
check(advance?.historical_etymologies[0].chain.join("|").includes("Anglo-French avancer|Vulgar Latin *abantiāre|Latin abante"), "ADVANCE historical chain incomplete");
check(/does not contain an independently established historical morpheme vance/i.test(advance?.historical_etymologies[0].summary.en || ""), "vance boundary missing");
check(hypothesis?.status === "Untested" && hypothesis.confidence === "low", "van/vance ↔ wang hypothesis must remain Untested/low");
check(/No sound change, historical correspondence, or common origin is asserted/i.test(hypothesis?.statement.en || ""), "hypothesis boundary missing");
check(experiment?.status === "Untested" && experiment.identity === "experimental-plan", "ADVANCE validation must remain an unexecuted plan");
check(Object.keys(experiment?.metrics || {}).length === 0 && /Not Tested/i.test(experiment?.result.en || ""), "ADVANCE plan must contain no fabricated metrics or result");
const objects = [advance?.primary_chinese_mapping, ...(advance?.secondary_chinese_mappings || []), ...(advance?.mapping_rationales || []), ...(advance?.historical_etymologies || []), ...(advance?.other_author_notes || []), hypothesis, experiment].filter(Boolean);
check(objects.every((item) => item.source_verification && item.ai_review?.status === "not-reviewed" && item.ai_review.reviewer === null), "every ADVANCE object needs separate Source Verification and not-reviewed AI Review");
check(queue.records.length === 19, "19-record queue count changed");
check(queue.records.every((item) => item.decision_record.status === "pending" && item.publication_gate.publication_status === "not_published"), "a 19-record queue item was reviewed or published");
check(fs.existsSync(path.join(root, "words", "advance.html")), "ADVANCE word page missing");
for (const source of dataset.sources) check(fs.existsSync(path.join(root, source.path)), `broken local source path ${source.source_id}: ${source.path}`);

if (errors.length) {
  console.error(`Package G.3 validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Package G.3 v0.1: VALID");
console.log("ADVANCE Candidate · 往 primary · 推进/前进 secondary · hypothesis Untested · validation Not Tested · AI reviews 0");
