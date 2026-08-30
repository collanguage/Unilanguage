import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "data", "language-book.v0.5.json");
const output = path.join(root, "data", "language-book.v0.6.json");
const dataset = JSON.parse(fs.readFileSync(input, "utf8"));

const localized = (en, zh) => ({ en, "zh-Hans": zh });
const aiNotReviewed = () => ({
  status: "not-reviewed",
  reviewer: null,
  reviewed_at: null,
  rationale: localized(
    "This Candidate object has not received object-level AI review.",
    "该 Candidate 对象尚未接受对象级 AI 审核。",
  ),
});
const verification = (status, sourceRefs, en, zh) => ({
  status,
  source_refs: sourceRefs,
  notes: localized(en, zh),
});

dataset.dataset_version = "0.6.0";
dataset.published_at = "2026-08-30";
dataset.classification_model = {
  package: "G.4",
  version: "0.1",
  parent_package: "G.3 v0.1",
  principle: "One English word → one primary Chinese mapping → separate historical etymology → separate sound-semantic hypothesis → separate experimental validation.",
  review_rule: "LIGHT → 籁 is retained as Candidate / retain_without_promotion. The mapping, hypotheses, experiment plan, AI review and publication status are not promoted.",
};

const sourceRecords = [
  { source_id: "SRC-LB-LIGHT", title: "Language Book · Light → 籁", source_type: "language-book-page", path: "words/light.html", version: "G.4 Candidate v0.1", notes: "Reader-facing Candidate page; it does not promote the record." },
  { source_id: "SRC-LIGHT-CANDIDATE", title: "LIGHT → 籁 mapping Candidate", source_type: "author-research-record", path: "data/candidates/light-lai.v0.1.json", version: "0.1.0", notes: "Primary mapping intake record with retain_without_promotion status.", source_quality: "project-record" },
  { source_id: "SRC-LIGHT-ETYMOLOGY", title: "LIGHT / lumière / lumen / lux / 籁 etymology bundle", source_type: "author-research-record", path: "data/evidence/etymology/light-lai.v0.1.json", version: "0.1.0", notes: "Separates English, Latin/French and Chinese historical tracks.", source_quality: "project-record" },
  { source_id: "SRC-LIGHT-CROSSMODAL-RECORD", title: "Sound↔Light Cross-modal Hypothesis v0.1", source_type: "author-research-record", path: "data/hypotheses/sound-light-cross-modal.v0.1.json", version: "0.1", notes: "Untested Candidate hypothesis; not historical evidence.", source_quality: "project-record" },
  { source_id: "SRC-L-LIGHT-CLUSTER-RECORD", title: "L-Light Semantic Cluster Hypothesis v0.1", source_type: "author-research-record", path: "data/hypotheses/l-light-semantic-cluster.v0.1.json", version: "0.1", notes: "Includes positive and negative observations with family-level deduplication.", source_quality: "project-record" },
  { source_id: "SRC-LIGHT-EXPERIMENT-PLAN", title: "Light–籁 cross-modal experiment plan v0.1", source_type: "author-research-record", path: "data/experiments/plans/light-lai-cross-modal.v0.1.json", version: "0.1", notes: "Unexecuted plan with no metrics or result.", source_quality: "project-record" },
  { source_id: "SRC-RUGUANG-TIANLAI", title: "《如光天籁》 selected literary source material", source_type: "author-research-record", path: "data/sources/literary/ru-guang-tian-lai.v0.1.json", version: "0.1", notes: "Literary / Cognitive Interpretation only; not etymological or experimental evidence.", source_quality: "project-record" },
  { source_id: "SRC-AHD-LIGHT", title: "American Heritage Dictionary · light", source_type: "authoritative-dictionary", path: "data/evidence/etymology/light-lai.v0.1.json", version: "Fifth Edition / online", notes: "Supports the Old English history and separates brightness light from not-heavy light.", url: "https://www.ahdictionary.com/word/search.html?q=light", accessed_at: "2026-08-30", source_quality: "authoritative-dictionary", supports: ["Brightness light continues Old English lēoht/līht and belongs to the PIE *leuk- family."], does_not_support: ["Historical cognacy with Chinese 籟/籁."] },
  { source_id: "SRC-AHD-LEUK", title: "American Heritage Dictionary · Indo-European root leuk-", source_type: "authoritative-dictionary", path: "data/evidence/etymology/light-lai.v0.1.json", version: "online appendix", notes: "Supports the deeper relation among Germanic light and Latin lux/lumen forms.", url: "https://www.ahdictionary.com/word/indoeurop.html", accessed_at: "2026-08-30", source_quality: "authoritative-dictionary", supports: ["PIE *leuk- underlies Germanic *leuhtam and Latin lux/lumen formations."], does_not_support: ["Four independent observations for an L=LIGHT semantic law."] },
  { source_id: "SRC-CNRTL-LUMIERE", title: "CNRTL / TLFi · lumière", source_type: "authoritative-dictionary", path: "data/evidence/etymology/light-lai.v0.1.json", version: "online", notes: "Supports French lumière from Latin luminaria, plural of luminare.", url: "https://www.cnrtl.fr/etymologie/lumiere", accessed_at: "2026-08-30", source_quality: "authoritative-dictionary", supports: ["French lumière derives from Latin luminaria/luminare."], does_not_support: ["French lumière as an independent family from Latin lumen."] },
  { source_id: "SRC-CNRTL-LUMEN", title: "CNRTL / TLFi · lumen", source_type: "authoritative-dictionary", path: "data/evidence/etymology/light-lai.v0.1.json", version: "online", notes: "Records Latin lumen 'light'.", url: "https://www.cnrtl.fr/etymologie/lumen", accessed_at: "2026-08-30", source_quality: "authoritative-dictionary", supports: ["Latin lumen means light."], does_not_support: ["Historical relation to Chinese 籟/籁."] },
  { source_id: "SRC-CUHK-LAI", title: "CUHK Multi-function Chinese Character Database · 籟", source_type: "authoritative-dictionary", path: "data/evidence/etymology/light-lai.v0.1.json", version: "online", notes: "Supports 從竹、賴聲, the instrument sense and classical sound extensions.", url: "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=%E7%B1%9F", accessed_at: "2026-08-30", source_quality: "authoritative-dictionary", supports: ["籟 is analyzed as 從竹、賴聲 and originally denotes a bamboo wind instrument."], does_not_support: ["A light/brightness etymology for 籟."] },
  { source_id: "SRC-CTEXT-LAI", title: "Chinese Text Project · 籟", source_type: "primary-historical-source", path: "data/evidence/etymology/light-lai.v0.1.json", version: "online received-text index", notes: "Provides received lexicographic and classical-text context for 籟.", url: "https://ctext.org/dictionary.pl?char=%E7%B1%9F&if=gb", accessed_at: "2026-08-30", source_quality: "primary-publication", supports: ["Received Shuowen wording and later sound uses of 籟."], does_not_support: ["Historical cognacy with English light."] },
];

const existingSourceIds = new Set(dataset.sources.map((item) => item.source_id));
for (const source of sourceRecords) if (!existingSourceIds.has(source.source_id)) dataset.sources.push(source);

const hypotheses = [
  {
    hypothesis_id: "UNI-LIGHT-LAI-001",
    label: localized("Sound↔Light cross-modal mapping", "Sound↔Light 声音—光跨模态映射"),
    status: "Untested",
    source_refs: ["SRC-LIGHT-CROSSMODAL-RECORD", "SRC-LIGHT-CANDIDATE", "SRC-RUGUANG-TIANLAI"],
    hypothesis_type: "sound-semantic",
    identity: "author-hypothesis",
    statement: localized(
      "Test whether the modern resemblance between light /laɪt/ and 籁 lài /laɪ̯⁵¹/ strengthens a LIGHT ↔ SOUND/MUSIC association. No translation equivalence, sound law, borrowing or common origin is asserted.",
      "检验 light /laɪt/ 与“籁” lài /laɪ̯⁵¹/ 的现代近音是否会增强 LIGHT ↔ SOUND／MUSIC 联想；本假说不主张翻译等值、音变规律、借词或共同词源。",
    ),
    evidence_refs: ["SRC-RUGUANG-TIANLAI"],
    confidence: "low",
    source_verification: verification(
      "needs-verification",
      ["SRC-LIGHT-CROSSMODAL-RECORD", "SRC-LIGHT-CANDIDATE", "SRC-RUGUANG-TIANLAI"],
      "The sound comparison and literary motifs motivate a test; they do not establish a population-level cognitive effect.",
      "语音比较与文学意象只能提出可检验问题，不能证明群体层面的认知效应。",
    ),
    ai_review: aiNotReviewed(),
  },
  {
    hypothesis_id: "UNI-L-LIGHT-CLUSTER-001",
    label: localized("L-Light Semantic Cluster Hypothesis v0.1", "L-Light 光亮语义词群假说 v0.1"),
    status: "Untested",
    source_refs: ["SRC-L-LIGHT-CLUSTER-RECORD", "SRC-LIGHT-ETYMOLOGY", "SRC-AHD-LEUK", "SRC-CNRTL-LUMIERE"],
    hypothesis_type: "initial-consonant-semantics",
    identity: "author-hypothesis",
    statement: localized(
      "Test whether L-initial light/brightness words occur above a language-specific baseline after etymological-family deduplication. The four motivating surface positives collapse to one PIE *leuk- family at the deepest level.",
      "在进行词源家族去重后，检验 L 起首的光／明亮词是否高于各语言基线。四个表面正例在最深层均归入同一 PIE *leuk- 词族。",
    ),
    evidence_refs: ["SRC-AHD-LEUK", "SRC-CNRTL-LUMIERE", "SRC-L-LIGHT-CLUSTER-RECORD"],
    confidence: "low",
    source_verification: verification(
      "needs-verification",
      ["SRC-L-LIGHT-CLUSTER-RECORD", "SRC-LIGHT-ETYMOLOGY", "SRC-AHD-LEUK", "SRC-CNRTL-LUMIERE"],
      "The family audit blocks independent counting of light, lumière, lumen and lux. A frequency-matched preregistered lexicon is still required.",
      "词族审核阻止把 light、lumière、lumen、lux 当作独立证据；仍需预注册、频率匹配的词表。",
    ),
    ai_review: aiNotReviewed(),
  },
];
const existingHypothesisIds = new Set(dataset.hypotheses.map((item) => item.hypothesis_id));
for (const hypothesis of hypotheses) if (!existingHypothesisIds.has(hypothesis.hypothesis_id)) dataset.hypotheses.push(hypothesis);

if (!dataset.experiments.some((item) => item.experiment_id === "UNI-EXP-LIGHT-001")) {
  dataset.experiments.push({
    experiment_id: "UNI-EXP-LIGHT-001",
    title: localized("Future Light–籁 cross-modal forced-choice study", "未来 Light–籁 跨模态强制选择实验"),
    status: "Untested",
    primary: false,
    metrics: {},
    source_refs: ["SRC-LIGHT-EXPERIMENT-PLAN", "SRC-LIGHT-CANDIDATE"],
    identity: "experimental-plan",
    tested_condition: localized(
      "Not tested. A preregistered design will compare spoken /laɪ/ or /laɪt/ with matched controls while separating sound, spelling, familiarity, Mandarin tone and English final /t/.",
      "尚未检验。未来预注册设计将比较 /laɪ/ 或 /laɪt/ 与匹配控制，并分离声音、拼写、熟悉度、普通话声调及英语词尾 /t/。",
    ),
    result: localized(
      "Not Tested. No observations, metrics, outcomes or evidential update exist.",
      "Not Tested／尚未检验：没有观察数据、统计量、结果或证据更新。",
    ),
    hypothesis_refs: ["UNI-LIGHT-LAI-001"],
    source_verification: verification(
      "not-applicable",
      ["SRC-LIGHT-EXPERIMENT-PLAN", "SRC-LIGHT-CANDIDATE"],
      "This is a future validation requirement, not an executed experiment.",
      "该对象记录未来验证要求，不是已经执行的实验。",
    ),
    ai_review: aiNotReviewed(),
  });
}

const etymology = (id, chain, summaryEn, summaryZh, refs) => ({
  etymology_id: id,
  identity: "historical-claim",
  status: "candidate",
  chain,
  summary: localized(summaryEn, summaryZh),
  source_verification: verification("source-backed", refs, summaryEn, summaryZh),
  ai_review: aiNotReviewed(),
});

if (!dataset.entries.some((item) => item.entry_id === "LB-en-light-001")) {
  dataset.entries.push({
    entry_id: "LB-en-light-001",
    source_word: "light",
    language: "English",
    normalized_form: "light",
    pronunciation: "/laɪt/",
    phonetic_form: "laɪt",
    lexical_meaning: localized("Visible illumination, brightness, or something that illuminates.", "可见的光、明亮状态或照明之物。"),
    aliases: ["籁", "籟", "lài"],
    classification_status: "candidate",
    primary_chinese_mapping: {
      mapping_id: "MAP-light-primary-lai",
      chinese_form: "籁",
      pinyin: "lài",
      role: "primary",
      mapping_basis: "author-proposal",
      status: "candidate",
      identity: "author-idea",
      source_verification: verification(
        "needs-verification",
        ["SRC-LIGHT-CANDIDATE", "SRC-LB-LIGHT"],
        "This is the author's selected research mapping, retained without promotion. It is not an ordinary lexical translation or historical cognate claim.",
        "这是作者选择并保留、但不升级的研究 mapping；它不是普通词典翻译，也不是历史同源主张。",
      ),
      ai_review: aiNotReviewed(),
    },
    secondary_chinese_mappings: [],
    mapping_rationales: [{
      rationale_id: "RAT-light-lai",
      mapping_ref: "MAP-light-primary-lai",
      identity: "author-idea",
      status: "candidate",
      statement: localized(
        "The modern forms share an approximate /laɪ/ sequence, while their lexical meanings differ. This motivates a testable LIGHT ↔ SOUND/MUSIC cross-modal comparison rather than an etymological claim.",
        "两个现代读音共享近似 /laɪ/ 序列，但直接词义不同；这支持提出可检验的 LIGHT ↔ SOUND／MUSIC 跨模态比较，而不是词源主张。",
      ),
      source_verification: verification(
        "needs-verification",
        ["SRC-LIGHT-CANDIDATE", "SRC-CUHK-LAI"],
        "The component pronunciations and meanings are documentable; the cross-modal comparison remains an author proposal.",
        "相关读音与词义可以记录，但跨模态比较仍是作者提议。",
      ),
      ai_review: aiNotReviewed(),
    }],
    historical_etymologies: [
      etymology(
        "ETY-light-english-001",
        ["English light 'brightness'", "Old English lēoht / līht", "Proto-Germanic *leuhtam / *leukhtam", "PIE *leuk- 'light, brightness'"],
        "The brightness noun is inherited through Germanic and is not a Latin borrowing. The homographic not-heavy adjective belongs to PIE *legwh- and is out of scope.",
        "表示光明的名词经日耳曼语传承，并非拉丁语借词；同形的“重量轻”形容词属于 PIE *legwh-，不在本条范围内。",
        ["SRC-AHD-LIGHT", "SRC-AHD-LEUK"],
      ),
      etymology(
        "ETY-light-latin-001",
        ["French lumière", "Christian Latin luminaria / luminare", "Latin lumen 'light'", "Latin lux 'light'", "PIE *leuk- 'light, brightness'"],
        "French lumière follows the luminaria/luminare/lumen line. Latin lux is a related family member, not an intermediate stage in lumière.",
        "法语 lumière 沿 luminaria／luminare／lumen 谱系发展；拉丁语 lux 是相关词族成员，不是 lumière 的中间环节。",
        ["SRC-CNRTL-LUMIERE", "SRC-CNRTL-LUMEN", "SRC-AHD-LEUK"],
      ),
      etymology(
        "ETY-light-lai-001",
        ["籟: 從竹，賴聲", "三孔龠: three-holed wind instrument", "sound from apertures", "人籟 / 地籟 / 天籟 / 萬籟"],
        "The Chinese word belongs to an instrument-and-sound history. No historical cognacy or borrowing with English light is established.",
        "汉语“籟／籁”属于乐器—声音历史系统；没有证据证明其与英语 light 历史同源或存在借词关系。",
        ["SRC-CUHK-LAI", "SRC-CTEXT-LAI"],
      ),
    ],
    sound_symbol_hypothesis_refs: ["UNI-LIGHT-LAI-001", "UNI-L-LIGHT-CLUSTER-001"],
    other_author_notes: [{
      note_id: "NOTE-light-literary-interpretation",
      identity: "author-note",
      status: "classified",
      text: localized(
        "《如光天籁》 repeatedly transforms sound, music, light and inner vision into one another. Its selected passages are Literary / Cognitive Interpretation only and are excluded from historical evidence.",
        "《如光天籁》反复在声音、音乐、光与内在视觉之间转换；所选片段仅归为 Literary／Cognitive Interpretation，不进入历史证据。",
      ),
      source_verification: verification(
        "source-backed",
        ["SRC-RUGUANG-TIANLAI"],
        "The source record preserves the selected user-provided passages and their evidence boundary.",
        "来源记录保存了用户提供的选段及其证据边界。",
      ),
      ai_review: aiNotReviewed(),
    }],
    experimental_validation_refs: ["UNI-EXP-LIGHT-001"],
    source_provenance: ["SRC-LB-LIGHT", "SRC-LIGHT-CANDIDATE", "SRC-LIGHT-ETYMOLOGY", "SRC-LIGHT-CROSSMODAL-RECORD", "SRC-L-LIGHT-CLUSTER-RECORD", "SRC-LIGHT-EXPERIMENT-PLAN", "SRC-RUGUANG-TIANLAI", "SRC-AHD-LIGHT", "SRC-AHD-LEUK", "SRC-CNRTL-LUMIERE", "SRC-CNRTL-LUMEN", "SRC-CUHK-LAI", "SRC-CTEXT-LAI"],
    author: "Jinkai Liu｜劉金凱",
    version: "G.4 Candidate v0.1 / dataset 0.6.0 / retain_without_promotion",
  });
}

fs.writeFileSync(output, `${JSON.stringify(dataset, null, 2)}\n`);
console.log("Dataset v0.6.0 written · LIGHT → 籁 retained as Candidate / retain_without_promotion");
