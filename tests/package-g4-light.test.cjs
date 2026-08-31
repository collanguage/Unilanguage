const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const dataApi = require("../js/language-book-data.js");

const root = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.6.json"), "utf8"));
const light = dataApi.lookup(dataset, "light").entry;
const crossModal = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-LIGHT-LAI-001");
const cluster = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-L-LIGHT-CLUSTER-001");
const experiment = dataset.experiments.find((item) => item.experiment_id === "UNI-EXP-LIGHT-001");

test("G.4 retains LIGHT → 籁 as the fourth Candidate without promotion", () => {
  assert.equal(dataset.dataset_version, "0.6.0");
  assert.equal(dataset.classification_model.package, "G.4");
  assert.equal(dataset.entries.filter((entry) => entry.classification_status === "candidate").length, 4);
  assert.equal(light.classification_status, "candidate");
  assert.equal(light.primary_chinese_mapping.chinese_form, "籁");
  assert.equal(light.primary_chinese_mapping.status, "candidate");
  assert.equal(light.primary_chinese_mapping.mapping_basis, "author-proposal");
  assert.deepEqual(light.secondary_chinese_mappings, []);
  assert.match(light.version, /retain_without_promotion/);
});

test("English, Latin/French and Chinese histories remain separate", () => {
  assert.equal(light.historical_etymologies.length, 3);
  assert.match(light.historical_etymologies[0].chain.join(" "), /Old English.*Proto-Germanic.*PIE \*leuk-/);
  assert.match(light.historical_etymologies[1].summary.en, /lux is a related family member, not an intermediate/i);
  assert.match(light.historical_etymologies[2].summary.en, /No historical cognacy or borrowing/i);
  assert.ok(light.historical_etymologies.every((item) => item.source_verification.status === "source-backed"));
});

test("hypotheses and experiment remain independent and untested", () => {
  assert.equal(crossModal.status, "Untested");
  assert.equal(crossModal.confidence, "low");
  assert.match(crossModal.statement.en, /No translation equivalence.*common origin is asserted/i);
  assert.equal(cluster.status, "Untested");
  assert.equal(cluster.confidence, "low");
  assert.match(cluster.statement.en, /four motivating surface positives collapse to one PIE \*leuk- family/i);
  assert.equal(experiment.status, "Untested");
  assert.equal(experiment.identity, "experimental-plan");
  assert.deepEqual(experiment.metrics, {});
  assert.match(experiment.result.en, /Not Tested/);
});

test("all six formal records and the word page are indexed", () => {
  const files = [
    "data/candidates/light-lai.v0.1.json",
    "data/evidence/etymology/light-lai.v0.1.json",
    "data/hypotheses/sound-light-cross-modal.v0.1.json",
    "data/hypotheses/l-light-semantic-cluster.v0.1.json",
    "data/experiments/plans/light-lai-cross-modal.v0.1.json",
    "data/sources/literary/ru-guang-tian-lai.v0.1.json",
    "words/light.html",
  ];
  for (const file of files) assert.ok(fs.existsSync(path.join(root, file)), file);
  assert.equal(dataApi.DATASET_URL, "data/language-book.v0.6.json");
  assert.equal(dataApi.lookup(dataset, "籁").entry.entry_id, light.entry_id);
  assert.match(fs.readFileSync(path.join(root, "semantic-mapper.html"), "utf8"), /data-example="light"/);
  const page = fs.readFileSync(path.join(root, "words/light.html"), "utf8");
  const candidate = JSON.parse(fs.readFileSync(path.join(root, "data/candidates/light-lai.v0.1.json"), "utf8"));
  const literary = JSON.parse(fs.readFileSync(path.join(root, "data/sources/literary/ru-guang-tian-lai.v0.1.json"), "utf8"));
  assert.match(page, /Entry Status · 词条状态[\s\S]*Published · 已发表/);
  assert.match(page, /Mapping Status · 映射状态[\s\S]*Candidate · 候选/);
  assert.match(page, /Literary Status · 文学状态[\s\S]*Published · 已发表/);
  assert.match(page, /Music of Heaven, Like Light/);
  assert.match(page, /Chinese Original/);
  assert.match(page, /English Literary Translation/);
  assert.ok((page.match(/class="literary-pair/g) || []).length >= 20, "bilingual literary pairs missing");
  assert.equal(candidate.status, "Candidate");
  assert.equal(candidate.review_decision, "retain_without_promotion");
  assert.equal(literary.status, "Published");
  assert.equal(literary.author_attribution, "Jinkai Liu");
  assert.deepEqual(literary.languages, ["zh-Hans", "en"]);
  assert.equal(literary.original_language, "zh-Hans");
});

test("no LIGHT mapping, hypothesis or experiment object is promoted or AI-reviewed", () => {
  const objects = [light.primary_chinese_mapping, ...light.mapping_rationales, ...light.historical_etymologies, ...light.other_author_notes, crossModal, cluster, experiment];
  for (const object of objects) {
    assert.equal(object.ai_review.status, "not-reviewed");
    assert.equal(object.ai_review.reviewer, null);
  }
  assert.equal(dataset.entries.filter((entry) => entry.classification_status === "published").length, 4);
});
