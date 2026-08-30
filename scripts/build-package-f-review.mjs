import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = path.join(root, "data", "candidates", "package-e-batch-001.v0.2.json");
const outputPath = path.join(root, "data", "candidates", "package-f-review-queue.v0.1.json");
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

const decisions = {
  time: { status: "candidate", confidence: "high", level: "A", pos: "noun", sense: "temporal duration, sequence, or a point in time", zh: "时间", fr: "temps", note: "The selected ordinary temporal sense is directly represented, but time is highly polysemous." },
  space: { status: "candidate", confidence: "high", level: "A", pos: "noun", sense: "physical or conceptual extent in which position can be described", zh: "空间", fr: "espace", note: "The ordinary spatial sense is supported; outer space, blank space, and available-room senses must remain separate." },
  meaning: { status: "candidate", confidence: "medium", level: "B", pos: "noun", sense: "what a word, sign, or expression conveys", zh: "意义／意思", fr: "sens／signification", note: "The narrower linguistic sense is supportable; the original wording also covers acts and structures and needs a reviewer to approve that extension." },
  containment: { status: "needs_evidence", confidence: "low", level: "C", pos: "noun", sense: "the spatial relation of being within a boundary", zh: "包含／容纳关系", fr: "relation d’inclusion／contenance", note: "The candidate uses a technical spatial-relation sense, while the general dictionary headword primarily describes control or limitation. A specialist cognitive-linguistics or topology source is required." },
  knowledge: { status: "candidate", confidence: "medium", level: "B", pos: "noun", sense: "information or understanding acquired through learning or experience", zh: "知识", fr: "connaissance／savoir", note: "Chinese is straightforward; French connaissance and savoir divide countability, domain, and construction differently." },
  move: { status: "candidate", confidence: "medium", level: "B", pos: "verb", sense: "change position or cause a change of position", zh: "移动／搬动", fr: "bouger／déplacer", note: "The intransitive/transitive split determines whether bouger or déplacer is appropriate." },
  change: { status: "needs_evidence", confidence: "medium", level: "B", pos: "verb and noun in baseline", sense: "become or make different; a resulting difference", zh: "改变／变化", fr: "changer／changement", note: "The baseline combines verb and noun. Human review must select one part of speech or split the record." },
  exist: { status: "candidate", confidence: "high", level: "A", pos: "verb", sense: "have objective reality or being", zh: "存在", fr: "exister", note: "The ordinary existence sense is direct; philosophical uses should not be inferred automatically." },
  up: { status: "needs_evidence", confidence: "medium", level: "B", pos: "adverb/preposition/adjective", sense: "toward or at a higher position", zh: "向上／在上面", fr: "vers le haut／en haut", note: "The baseline collapses direction, location, and adjective uses." },
  down: { status: "needs_evidence", confidence: "medium", level: "B", pos: "adverb/preposition/adjective", sense: "toward or at a lower position", zh: "向下／在下面", fr: "vers le bas／en bas", note: "The baseline collapses direction, location, and adjective uses." },
  boundary: { status: "needs_evidence", confidence: "medium", level: "B", pos: "noun", sense: "a line or limit separating areas, states, or categories", zh: "边界／界限", fr: "limite／frontière", note: "Frontière is favored for territorial separation; limite is broader. The category/state extension needs explicit sense selection." },
  inside: { status: "needs_evidence", confidence: "medium", level: "B", pos: "preposition/adverb/noun/adjective", sense: "in or into an interior area", zh: "里面／内部", fr: "à l’intérieur／dedans／intérieur", note: "The proposed forms differ by part of speech and syntactic environment." },
  outside: { status: "needs_evidence", confidence: "medium", level: "B", pos: "preposition/adverb/noun/adjective", sense: "beyond or not within a boundary", zh: "外面／外部", fr: "à l’extérieur／dehors／extérieur", note: "The proposed forms differ by part of speech and syntactic environment." },
  source: { status: "candidate", confidence: "medium", level: "B", pos: "noun", sense: "a place, person, or thing from which something originates", zh: "来源／源头", fr: "source", note: "Literal origin and informational-source senses are related but not interchangeable in every context." },
  path: { status: "candidate", confidence: "medium", level: "B", pos: "noun", sense: "a route or way along which movement occurs", zh: "路径／道路", fr: "chemin／trajet", note: "Chemin can denote a physical way; trajet emphasizes a journey or route. The protocol’s SOURCE–PATH–GOAL abstraction is broader than either headword." },
  goal: { status: "needs_evidence", confidence: "medium", level: "B", pos: "noun", sense: "an intended result or a destination in a movement schema", zh: "目标／目的", fr: "but／objectif", note: "Dictionaries support the intended-result sense, but not automatic equivalence with a physical destination. The two senses must be split or explicitly linked by a cognitive source." },
  cover: { status: "needs_evidence", confidence: "medium", level: "B", pos: "verb and noun in baseline", sense: "put something over another thing; an object placed over it", zh: "覆盖／盖上；盖子／覆盖物", fr: "couvrir；couverture／couvercle", note: "The baseline combines verb and noun, and the sky ↔ cover hypothesis must remain outside ordinary lexical evidence." },
  direction: { status: "candidate", confidence: "high", level: "A", pos: "noun", sense: "the course toward which something moves or faces", zh: "方向", fr: "direction", note: "The spatial-course sense is supported; management and instruction senses are excluded." },
  translation: { status: "candidate", confidence: "high", level: "A", pos: "noun", sense: "the process or product of expressing content in another language", zh: "翻译／译文", fr: "traduction", note: "The process/result distinction is lexical polysemy and should be recorded, not treated as cross-language identity in every context." },
};

const sourceOverrides = {
  containment: { zhSlug: "containment", frSlug: "contain", limitation: "The Chinese containment page supports control/limitation senses, not the proposed spatial relation; the French contain page concerns the verb contenir." },
};

function projectSource(record) {
  const [projectPath, fragment] = record.source_provenance.split("#");
  return {
    verification_id: `${record.candidate_id}-SRC-PROJECT`,
    source_type: "project-primary-source",
    title: `Unilanguage project source: ${projectPath}`,
    locator: record.source_provenance,
    url: projectPath,
    specific_location: fragment || "document-level occurrence",
    accessed_at: "2026-08-30",
    version_info: "Package E baseline commit 1a06dfd",
    verifiable_content: "The project source contains the concept or protocol role from which Package E extracted this candidate.",
    supports: ["candidate inclusion in this fixed 19-record review queue", "project-internal semantic context"],
    does_not_support: ["external lexical equivalence", "shared etymology", "phonetic correspondence", "publication readiness"],
  };
}

function dictionarySource(record, language) {
  const decision = decisions[record.normalized_form];
  const override = sourceOverrides[record.normalized_form] || {};
  const slug = language === "zh" ? (override.zhSlug || record.normalized_form) : (override.frSlug || record.normalized_form);
  const dictionary = language === "zh" ? "english-chinese-simplified" : "english-french";
  const target = language === "zh" ? "Mandarin Chinese" : "French";
  const selected = language === "zh" ? decision.zh : decision.fr;
  const limitation = override.limitation || `The page does not establish unrestricted equivalence across every sense of “${record.source_word}”.`;
  return {
    verification_id: `${record.candidate_id}-SRC-CAM-${language.toUpperCase()}`,
    source_type: "authoritative-bilingual-dictionary",
    title: `Cambridge Dictionary: ${record.source_word} — English–${target}`,
    locator: `headword “${record.source_word}”; reviewer-selected sense: ${decision.sense}`,
    url: `https://dictionary.cambridge.org/dictionary/${dictionary}/${slug}`,
    specific_location: "headword, part-of-speech label, sense divisions, translations, and examples",
    accessed_at: "2026-08-30",
    version_info: "live web edition; no stable release number displayed",
    verifiable_content: `The page permits verification of the ${decision.pos} headword, sense boundaries, and candidate ${target} rendering “${selected}”.`,
    supports: [`ordinary lexical comparison for the selected sense`, `${target} candidate form(s): ${selected}`],
    does_not_support: [limitation, "common origin, borrowing, or regular sound correspondence", "the Unilanguage protocol mapping level"],
  };
}

function track(status, supports, limits) {
  return { status, supports, limits };
}

function reviewRecord(record) {
  const d = decisions[record.normalized_form];
  if (!d) throw new Error(`Missing Package F decision for ${record.normalized_form}`);
  const ambiguous = d.status === "needs_evidence";
  return {
    candidate_id: record.candidate_id,
    source_word: record.source_word,
    normalized_form: record.normalized_form,
    baseline_record: {
      lexical_meaning: record.lexical_meaning,
      candidate_mapping: record.candidate_mapping,
      source_provenance: record.source_provenance,
      blockers: record.blockers,
    },
    scoped_analysis: {
      part_of_speech: d.pos,
      selected_sense: d.sense,
      reviewed_candidate_mapping: `${d.zh} · ${d.fr}`,
      mapping_type: "lexical-equivalent-candidate",
      claim_boundary: "A cross-language lexical candidate for the selected sense only; not evidence of shared etymology or universal semantic identity.",
    },
    source_verification: [projectSource(record), dictionarySource(record, "zh"), dictionarySource(record, "fr")],
    evidence_tracks: {
      linguistic_etymological: track(ambiguous ? "partial" : "supported", "Bilingual dictionary evidence supports at least part of the selected lexical comparison.", "Lexical equivalence is not cognacy. No historical transmission chain or comparative-etymological evidence was found or claimed."),
      phonetic: track("not_assessed", "No phonetic evidence is used for this candidate.", "Surface resemblance, if any, must not affect review status without a separately documented phonetic analysis."),
      semantic_cognitive: track(record.source_provenance.startsWith("protocol/") ? "partial" : "not_assessed", record.source_provenance.startsWith("protocol/") ? "The project source places the concept in an internal semantic framework." : "No independent cognitive evidence is recorded.", "Project framework text is not independent empirical cognitive evidence."),
      speculative_association: track("not_supported", "No speculative association is required for the ordinary lexical comparison.", "Any broader sound-symbolic, universal, metaphorical, or shared-origin claim remains unsupported."),
    },
    provisional_assessment: {
      review_status: d.status,
      confidence: d.confidence,
      mapping_level: d.level,
      level_is_provisional: true,
      reason: d.note,
      publication_status: "not_published",
      automatic_publication_allowed: false,
    },
    counterexamples_uncertainties_conflicts: [
      d.note,
      "Translations vary by part of speech, collocation, register, and context; the listed forms are not interchangeable in every sentence.",
      "No cited source supports a common etymology or general phonetic law across English, Chinese, and French.",
    ],
    human_review: {
      reviewer: null,
      reviewed_at: null,
      decision: null,
      rationale: null,
      checklist: [
        { item: "Confirm all three source locators open and match the recorded headword/sense.", complete: false },
        { item: "Confirm part of speech and split the record if forms cross grammatical categories.", complete: false },
        { item: "Confirm Chinese and French forms with context-sensitive examples.", complete: false },
        { item: "Review counterexamples, uncertainty, and conflicting evidence without deleting them.", complete: false },
        { item: "Confirm the evidence-track labels and non-cognacy boundary.", complete: false },
        { item: "Record a signed decision: reviewed, rejected, or needs_evidence.", complete: false },
      ],
      allowed_decisions: ["reviewed", "rejected", "needs_evidence"],
      publish_requires_separate_gate: true,
    },
  };
}

const records = baseline.records.map(reviewRecord);
const counts = records.reduce((result, record) => {
  const key = record.provisional_assessment.review_status;
  result[key] = (result[key] || 0) + 1;
  return result;
}, { candidate: 0, reviewed: 0, rejected: 0, needs_evidence: 0, published: 0 });

const output = {
  package: "Package F — Candidate Source Verification + Human Review",
  package_version: "0.1.0",
  schema_version: "1.0.0",
  created_at: "2026-08-30",
  baseline_batch: "data/candidates/package-e-batch-001.v0.2.json",
  baseline_record_count: 19,
  scope_rule: "Only the 19 Package E candidates are in scope. No candidate expansion and no Experiment 003 work is permitted.",
  workflow: {
    review_states: ["candidate", "reviewed", "rejected", "needs_evidence"],
    transitions: { candidate: ["reviewed", "rejected", "needs_evidence"], needs_evidence: ["candidate", "rejected"] },
    publication_state: "published",
    publication_is_separate_gate: true,
    promotion_rule: "A documented human reviewer must complete the checklist and sign a decision. This generated verification package does not promote any record to Reviewed or Published.",
  },
  evidence_track_definitions: {
    linguistic_etymological: "Lexical, grammatical, historical-linguistic, borrowing, or cognacy evidence. Ordinary translation support must be distinguished from etymology.",
    phonetic: "Pronunciation, phonological form, regular sound correspondence, or measured phonetic comparison.",
    semantic_cognitive: "Sense structure, conceptual metaphor, spatial schema, psycholinguistic, or cognitive evidence.",
    speculative_association: "Exploratory analogy, sound symbolism, literary association, or untested cross-language proposal.",
  },
  status_summary: counts,
  records,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Package F review queue written: ${records.length} records · ${counts.candidate} candidate · ${counts.needs_evidence} needs evidence`);
