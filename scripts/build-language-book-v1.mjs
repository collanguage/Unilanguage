import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacy = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.6.json"), "utf8"));
const out = path.join(root, "data", "language-book.v1.0.json");
const authoredEntriesDirectory = path.join(root, "data", "entries");
const migrationDate = "2026-08-30";
const releaseDate = "2026-08-31";
const localized = (en, zh) => ({ en, "zh-Hans": zh });
const clean = (values) => [...new Set(values.filter((value) => value !== null && value !== undefined && String(value).trim()).map(String))];
const sourceMap = new Map(legacy.sources.map((item) => [item.source_id, item]));
const hypothesisMap = new Map(legacy.hypotheses.map((item) => [item.hypothesis_id, item]));
const experimentMap = new Map(legacy.experiments.map((item) => [item.experiment_id, item]));

const pageSlugs = new Set(["sky", "universe", "sound", "language", "advance", "light", "at"]);
const publishedPages = new Set(["sky", "universe", "sound", "light"]);
const documentedPublicationDates = { sky: "2026-08-07", universe: "2026-08-16", light: "2026-08-30" };
const custom = {
  sky: {
    title: localized("Sky · Cover", "Sky · 天空 · 盖"),
    mappingStatus: "Candidate", mappingLevel: "B", historical: "Unestablished",
    semantic: ["ABOVE", "COVER"],
    observation: localized("sky /skaɪ/ ↔ 盖 gài /kaɪ˥˩/ is a candidate velar and rhyme resemblance associated with the cognitive schema ABOVE → COVER.", "sky /skaɪ/ ↔ 盖 gài /kaɪ˥˩/ 是候选软腭音与韵部近似观察，并与 ABOVE → COVER 认知图式相连。"),
    proposition: localized("The sky is above us; a cover is over what it contains.", "天在上，盖在所覆之物的上方。"),
    note: localized("Calibration case: ordinary lexical equivalence (sky → 天空), the sky ↔ 盖 candidate, independent word histories, the ABOVE → COVER schema and literary interpretation remain separate.", "Mapping 校准案例：普通词义对应（sky → 天空）、sky ↔ 盖候选、各自词史、ABOVE → COVER 图式与文学解释保持分离。"),
  },
  universe: {
    title: localized("Universe · 宇宙", "Universe · 宇宙"),
    mappingStatus: "Supported", mappingLevel: "C", historical: "Not claimed",
    semantic: ["SPACE", "TIME", "TOTALITY", "ONE", "TURN"],
    proposition: localized("The universe is a poem written by existence itself.", "宇宙是存在本身写下的一首诗。"),
    note: localized("SPACE + TIME and ONE + TURN are compared as semantic structures; selected sound networks remain experimental.", "SPACE + TIME 与 ONE + TURN 作为语义结构比较；选定的声音网络仍属实验性。"),
  },
  man: {
    title: localized("Man · Human", "Man · 人 · 男"),
    mappingStatus: "Candidate", mappingLevel: "B", historical: "Unestablished",
    semantic: ["HUMAN", "PERSON", "MALE"],
    observation: localized("The M–N relation in man /mæn/ and 男 nán is an author-proposed consonantal comparison.", "man /mæn/ 与 男 nán 的 M–N 关系是作者提出的辅音比较。"),
    note: localized("The record preserves the existing man/human calibration case without asserting historical cognacy.", "本记录保留既有 man/human 校准案例，不主张历史同源。"),
  },
  sound: {
    title: localized("Sound · 声音", "Sound · 声音"),
    mappingStatus: "Supported", mappingLevel: "A", historical: "Not claimed",
    semantic: ["VIBRATION", "HEARING", "SPEECH"],
    note: localized("This is primarily a lexical and protocol record; no cross-language origin claim is made.", "本条主要是词义与协议记录；不主张跨语言共同来源。"),
  },
  language: {
    title: localized("Language · 朗", "Language · 语言 · 朗"),
    mappingStatus: "Candidate", mappingLevel: "B", historical: "Unestablished",
    semantic: ["VOICE", "MEANING", "COMMUNICATION"],
    note: localized("The language → 朗 mapping is an author proposal. English historical etymology remains a separate track.", "language → 朗 是作者提案；英语历史词源保持独立轨道。"),
  },
  water: {
    title: localized("Water · 哗", "Water · 水 · 哗"),
    mappingStatus: "Candidate", mappingLevel: "B", historical: "Unestablished",
    semantic: ["WATER", "FLOW", "SURFACE", "SOUND"],
    note: localized("The water → 哗 mapping and Experiment 002 result remain independently classified.", "water → 哗 mapping 与实验 002 结果保持独立分类。"),
  },
  advance: {
    title: localized("Advance · 往", "Advance · 往"),
    mappingStatus: "Candidate", mappingLevel: "C", historical: "Unestablished",
    semantic: ["MOVE", "FORWARD", "TOWARD"],
    note: localized("The semantic structure MOVE → FORWARD/TOWARD is distinct from both historical etymology and the vance ↔ 往 sound hypothesis.", "MOVE → FORWARD/TOWARD 语义结构与历史词源、vance ↔ 往声音假说彼此独立。"),
  },
  light: {
    title: localized("Light · 籁 · 如光天籁", "Light · 光 · 籁 · 如光天籁"),
    mappingStatus: "Candidate", mappingLevel: "B", historical: "Unestablished",
    semantic: ["LIGHT", "BRIGHTNESS", "SOUND", "INNER VISION"],
    observation: localized("light /laɪt/ ↔ 籁 lài shares an approximate /laɪ/ sequence; lexical meanings differ.", "light /laɪt/ ↔ 籁 lài 共享近似 /laɪ/ 音序，但直接词义不同。"),
    proposition: localized("Sound, music, light and inner vision transform into one another in 《如光天籁》.", "《如光天籁》让声音、音乐、光与内在视觉彼此转换。"),
    note: localized("The published literary layer does not promote the light ↔ 籁 candidate or prove etymology.", "已发表的文学层不升级 light ↔ 籁 候选，也不证明词源。"),
  },
};

function reviewStatus(item) {
  const value = item?.source_verification?.status;
  if (value === "source-backed") return "Supported";
  if (value === "rejected") return "Rejected";
  if (value === "needs-verification") return "Under review";
  return "Not evaluated";
}

function migrateHypothesis(item) {
  return {
    hypothesis_id: item.hypothesis_id,
    type: item.hypothesis_type || "Other candidate rule",
    claim: item.statement || item.label || localized("Claim not recorded.", "未记录主张。"),
    status: String(item.status || "Untested").replace(/^candidate$/i, "Candidate"),
    confidence: item.confidence || "Unknown",
    supporting_cases: item.evidence_refs || [],
    counterexamples: item.counterexamples || [],
    testability: item.testability || localized("See the linked record for testability limits.", "可检验性边界见关联记录。"),
    experiment_link: null,
    source_refs: item.source_verification?.source_refs || [],
  };
}

function migrateExperiment(item) {
  return {
    experiment_id: item.experiment_id,
    title: item.title,
    status: item.status,
    tested_hypotheses: item.hypothesis_refs || [],
    design: item.tested_condition,
    result: item.result,
    metrics: item.metrics || null,
    path: item.experiment_id === "UNI-EXP-002" ? "experiments/002/results.html" : null,
    source_refs: item.source_verification?.source_refs || [],
  };
}

function mapReferences(ids) {
  return clean(ids).map((id) => {
    const item = sourceMap.get(id);
    return item ? {
      reference_id: id,
      title: item.title || id,
      type: item.source_type || "unknown",
      url: item.url || null,
      path: item.path || null,
      provenance: item.source_quality || "unknown",
    } : { reference_id: id, title: id, type: "unknown", url: null, path: null, provenance: "unknown" };
  });
}

function migrateEntry(entry) {
  const c = custom[entry.source_word];
  const hypotheses = entry.sound_symbol_hypothesis_refs.map((id) => hypothesisMap.get(id)).filter(Boolean).map(migrateHypothesis);
  const experiments = entry.experimental_validation_refs.map((id) => experimentMap.get(id)).filter(Boolean).map(migrateExperiment);
  for (const hypothesis of hypotheses) {
    const linked = experiments.find((experiment) => experiment.tested_hypotheses.includes(hypothesis.hypothesis_id));
    hypothesis.experiment_link = linked?.experiment_id || null;
  }
  const historicalItems = entry.historical_etymologies.map((item) => ({
    evidence_id: item.etymology_id,
    claim: item.summary,
    status: reviewStatus(item),
    confidence: reviewStatus(item) === "Supported" ? "High" : "Unknown",
    chain: item.chain,
    source_refs: item.source_verification?.source_refs || [],
  }));
  const sourceIds = clean([
    ...entry.source_provenance,
    ...entry.historical_etymologies.flatMap((item) => item.source_verification?.source_refs || []),
    ...hypotheses.flatMap((item) => item.source_refs),
    ...experiments.flatMap((item) => item.source_refs),
  ]);
  const entryStatus = publishedPages.has(entry.source_word) || entry.classification_status === "published" ? "Published" : "Reviewed";
  return {
    id: entry.entry_id,
    slug: entry.source_word === "man" ? "human" : entry.source_word,
    title: c.title,
    languages: [
      { role: "source", code: "en", name: "English", word: entry.source_word, pronunciation: entry.pronunciation || "unknown" },
      { role: "target", code: "zh-Hans", name: "Chinese", word: entry.primary_chinese_mapping.chinese_form, pronunciation: entry.primary_chinese_mapping.pinyin || "unknown" },
    ],
    primary_mapping: {
      mapping_id: entry.primary_chinese_mapping.mapping_id,
      source: { language: "English", word: entry.source_word, pronunciation: entry.pronunciation || "unknown" },
      target: { language: "Chinese", word: entry.primary_chinese_mapping.chinese_form, pronunciation: entry.primary_chinese_mapping.pinyin || "unknown" },
      gloss: entry.lexical_meaning,
      meaning: entry.lexical_meaning,
      mapping_type: entry.primary_chinese_mapping.mapping_basis === "lexical-equivalent" ? "Lexical equivalent" : "Cross-language semantic candidate",
      rationale: entry.mapping_rationales[0]?.statement || c.note,
    },
    entry_status: entryStatus,
    mapping_status: c.mappingStatus,
    mapping_level: c.mappingLevel,
    historical_relation_status: c.historical,
    evidence: {
      Historical: { status: historicalItems.length ? "Supported" : "Not evaluated", confidence: historicalItems.length ? "Medium" : "Unknown", summary: localized("Historical word histories are evaluated independently from the cross-language mapping.", "各语言的历史词源独立于跨语言 mapping 评估。"), items: historicalItems, source_refs: clean(historicalItems.flatMap((item) => item.source_refs)) },
      "Phonetic-Semantic": { status: c.observation ? "Candidate" : hypotheses.length ? "Candidate" : "Not evaluated", confidence: c.observation ? "Low" : "Unknown", summary: c.observation || localized("No separate phonetic-semantic observation is recorded.", "未记录独立的语音—语义观察。"), items: entry.mapping_rationales.map((item) => ({ evidence_id: item.rationale_id, claim: item.statement, status: reviewStatus(item), confidence: "Unknown", source_refs: item.source_verification?.source_refs || [] })), source_refs: clean(entry.mapping_rationales.flatMap((item) => item.source_verification?.source_refs || [])) },
      Cognitive: { status: c.semantic?.length ? "Interpretive" : "Not evaluated", confidence: c.semantic?.length ? "Medium" : "Unknown", summary: localized(`Recorded semantic structure: ${(c.semantic || []).join(" → ") || "unknown"}.`, `已记录语义结构：${(c.semantic || []).join(" → ") || "unknown"}。`), items: [], source_refs: [] },
      Speculative: { status: hypotheses.length ? "Candidate" : "Not claimed", confidence: hypotheses.length ? "Low" : "Unknown", summary: localized("Author hypotheses remain independently graded and testable; they are not historical proof.", "作者假说保持独立分级与可检验性，不作为历史证明。"), items: hypotheses.map((item) => ({ evidence_id: item.hypothesis_id, claim: item.claim, status: item.status, confidence: item.confidence, source_refs: item.source_refs })), source_refs: clean(hypotheses.flatMap((item) => item.source_refs)) },
    },
    phonetic_observation: c.observation ? [{ observation_id: `PHON-${entry.source_word}-001`, claim: c.observation, status: "Candidate", limitations: localized("Modern-form resemblance is not a regular sound correspondence or proof of cognacy.", "现代词形近似不是规律音变，也不证明同源。") }] : [],
    semantic_structure: { concepts: c.semantic || [], relation: (c.semantic || []).join(" → ") || "unknown", status: c.semantic?.length ? "Interpretive" : "Unknown" },
    hypotheses,
    experiments,
    literary_layer: {
      status: c.proposition ? "Published" : "Not present",
      is_historical_evidence: false,
      proposition: c.proposition || null,
      essay_prose: [], poem_lyrics: [], translations: [], archival_manuscript_media: [],
      evidence_boundary: localized("Literature may explore freely, but it is not historical evidence.", "文学可以自由展开，但不属于历史证据。"),
    },
    media: [],
    references: mapReferences(sourceIds),
    author: "Jinkai Liu",
    version: entry.version,
    dates: { created: null, modified: migrationDate, published: documentedPublicationDates[entry.source_word] || null },
    editorial_notes: [c.note],
    search_terms: clean([entry.source_word, entry.normalized_form, ...entry.aliases, entry.primary_chinese_mapping.chinese_form, entry.primary_chinese_mapping.pinyin, ...(c.semantic || [])]),
    page: pageSlugs.has(entry.source_word) ? `words/${entry.source_word}.html` : entry.source_word === "man" ? null : null,
    legacy: entry,
  };
}

const entries = legacy.entries.map(migrateEntry);
const atEntry = {
  id: "LB-en-at-003", slug: "at", title: localized("AT · 在 · 爱 | Love Is Presence", "AT · 在 · 爱｜爱在，世界就在"),
  languages: [
    { role: "source", code: "en", name: "English", word: "at", pronunciation: "/æt/" },
    { role: "target", code: "zh-Hans", name: "Chinese", word: "在", pronunciation: "zài /tsaɪ̯/" },
    { role: "literary-transformation", code: "zh-Hans", name: "Chinese", word: "爱", pronunciation: "ài /aɪ̯˥˩/" },
  ],
  primary_mapping: {
    mapping_id: "MAP-at-primary-zai",
    source: { language: "English", word: "at", pronunciation: "/æt/" },
    target: { language: "Chinese", word: "在", pronunciation: "zài /tsaɪ̯/" },
    gloss: localized("Location, point or state → presence", "位置、点或状态 → 在场／存在"),
    meaning: localized("A candidate comparison through LOCATION → PRESENCE; not interchangeable in every context.", "通过 LOCATION → PRESENCE 建立的候选比较；并非所有语境都可互换。"),
    mapping_type: "Phonetic-semantic candidate",
    rationale: localized("The strongest support is the semantic intersection LOCATION → PRESENCE; /æ/ ↔ /aɪ̯/ is only a limited vowel observation.", "最强支持是 LOCATION → PRESENCE 的语义交点；/æ/ ↔ /aɪ̯/ 仅为有限元音观察。"),
  },
  entry_status: "Published", mapping_status: "Candidate", mapping_level: "C", historical_relation_status: "Not claimed",
  evidence: {
    Historical: { status: "Unestablished", confidence: "High", summary: localized("English at, Chinese 在 and Chinese 爱 have independent histories. No common origin is claimed.", "英语 at、汉语“在”和“爱”各有独立历史；不主张共同来源。"), items: [], source_refs: ["REF-AHD-AT", "REF-CUHK-CHAR"] },
    "Phonetic-Semantic": { status: "Candidate", confidence: "Low", summary: localized("at /æt/ ↔ 在 zài /tsaɪ̯/ is a candidate vowel and phonetic-semantic observation; /t/ does not correspond regularly to /ts/, and Mandarin tone is unmatched.", "at /æt/ ↔ 在 zài /tsaɪ̯/ 是候选元音与语音—语义观察；/t/ 与 /ts/ 不构成规律对应，普通话声调也无对应。"), items: [], source_refs: [] },
    Cognitive: { status: "Interpretive", confidence: "Medium", summary: localized("LOCATION → PRESENCE → RELATION → WORLD", "位置 → 在场／存在 → 关系 → 世界"), items: [], source_refs: [] },
    Speculative: { status: "Candidate", confidence: "Low", summary: localized("The comparison is testable but currently untested.", "该比较可检验，但目前尚未测试。"), items: [], source_refs: [] },
  },
  phonetic_observation: [{ observation_id: "PHON-at-zai-001", claim: localized("at /æt/ ↔ 在 zài /tsaɪ̯/: limited open/front vowel resemblance plus semantic intersection.", "at /æt/ ↔ 在 zài /tsaɪ̯/：有限的开放／前部元音听感近似与语义交点。"), status: "Candidate", limitations: localized("English /t/ and Mandarin /ts/ occupy different positions; no regular sound correspondence is established.", "英语 /t/ 与普通话 /ts/ 位置不同；未建立规律音变。") }],
  semantic_structure: { concepts: ["LOCATION", "PRESENCE", "RELATION", "WORLD"], relation: "LOCATION → PRESENCE → RELATION → WORLD", status: "Interpretive" },
  hypotheses: [{ hypothesis_id: "UNI-AT-ZAI-001", type: "Vowel relation / phonetic-semantic candidate", claim: localized("The modern forms at and 在 may support a limited phonetic-semantic association around location and presence.", "现代词形 at 与“在”可能围绕位置与在场形成有限语音—语义联想。"), status: "Candidate", confidence: "Low", supporting_cases: ["at /æt/", "在 zài /tsaɪ̯/", "LOCATION → PRESENCE"], counterexamples: ["English final /t/ vs Mandarin initial /ts/", "Mandarin lexical tone", "non-identical grammar"], testability: localized("Test with blinded auditory judgments, corpus-based semantic overlap and explicit negative controls.", "可用盲法听辨、语料语义重叠与明确负对照检验。"), experiment_link: null, source_refs: [] }],
  experiments: [],
  literary_layer: {
    status: "Published", is_historical_evidence: false,
    proposition: localized("Love is presence. Where love is, the world is.", "爱就是在。爱在，世界就在。"),
    essay_prose: [{ work_id: "LB-AT-PROSE-001", title: localized("When I First Met You / Space and a Common Language / Cosmic Prose Poem", "第一次遇见你的时候／太空与共通语言／宇宙散文诗"), page_anchor: "words/at.html#first-meeting" }],
    poem_lyrics: [{ work_id: "LB-AT-LYRICS-001", title: localized("A Beautiful Yearning, in Space", "一个美丽的向往，在那太空"), page_anchor: "words/at.html#lyrics" }],
    translations: [{ language: "English", status: "Published", page: "words/at.html" }],
    archival_manuscript_media: ["MEDIA-AT-MS-001", "MEDIA-AT-MS-002"],
    evidence_boundary: localized("在 → 爱 is an intentional literary transformation, not etymology or historical evidence.", "在 → 爱是有意的文学转换，不是词源或历史证据。"),
  },
  media: [
    { media_id: "MEDIA-AT-ILL-001", type: "illustration", path: "images/at-astronaut-pair-illustration.png", alt: localized("Two young astronauts with a blue planet and stars behind them.", "两位年轻宇航员，身后是蓝色星球与星空。"), caption: localized("Visual supplied with the literary work.", "随文学作品提供的视觉材料。"), source: "unknown", provenance: "unknown" },
    { media_id: "MEDIA-AT-ILL-002", type: "illustration", path: "images/at-galaxy-visual.png", alt: localized("A blue galaxy and dense star field.", "蓝色银河与密集星空。"), caption: localized("Literary visual; not scientific evidence. Creation method is unknown.", "文学视觉材料；不是科学证据。创作方式未知。"), source: "unknown", provenance: "unknown" },
    { media_id: "MEDIA-AT-MS-001", type: "original manuscript", path: "images/at-original-manuscript-01.png", alt: localized("First page of the original handwritten musical score.", "原始手写曲谱第 1 页。"), caption: localized("Author-provided scan; date unknown.", "作者提供扫描件；日期未知。"), source: "Jinkai Liu", provenance: "author-provided scan" },
    { media_id: "MEDIA-AT-MS-002", type: "original manuscript", path: "images/at-original-manuscript-02.png", alt: localized("Second page of the original handwritten musical score.", "原始手写曲谱第 2 页。"), caption: localized("Author-provided scan; date unknown.", "作者提供扫描件；日期未知。"), source: "Jinkai Liu", provenance: "author-provided scan" },
  ],
  references: [
    { reference_id: "REF-AHD-AT", title: "American Heritage Dictionary: at", type: "dictionary", url: "https://www.ahdictionary.com/word/search.html?q=at", path: null, provenance: "external reference" },
    { reference_id: "REF-CUHK-CHAR", title: "CUHK Multi-function Chinese Character Database", type: "character database", url: "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/index.php", path: null, provenance: "external reference" },
  ],
  author: "Jinkai Liu", version: "Literary Entry v1.0 / Schema v1.0", dates: { created: null, modified: migrationDate, published: migrationDate },
  editorial_notes: [localized("Publication, mapping, evidence/historical relation and literature are independent axes.", "词条发表、mapping、证据／历史关系与文学层是四条独立状态轴。")],
  search_terms: ["at", "在", "爱", "愛", "love", "presence", "location", "relation", "world", "世界", "爱在", "愛在", "love is presence", "第一次遇见你的时候", "一个美丽的向往，在那太空", "a beautiful yearning in space"],
  page: "words/at.html", legacy: null,
};
entries.push(atEntry);

// Dataset Expansion records live as independently reviewable authoring files.
// The deterministic build keeps migration logic and new research records separate.
const authoredEntries = fs.existsSync(authoredEntriesDirectory)
  ? fs.readdirSync(authoredEntriesDirectory)
      .filter((name) => name.endsWith(".v1.json"))
      .sort()
      .map((name) => JSON.parse(fs.readFileSync(path.join(authoredEntriesDirectory, name), "utf8")))
  : [];
entries.push(...authoredEntries);

const dataset = {
  schema_version: "1.0.0",
  dataset_version: "1.0.2",
  published_at: releaseDate,
  product: localized("Language Book: a cross-language comparable semantic database", "Language Book：跨语言可比较语义数据库"),
  author: "Jinkai Liu",
  editorial_policy: {
    publication_boundary: localized("An entry may be published; a hypothesis must be graded; literature may explore freely; evidence must be evaluated independently.", "词条可以发表，假说必须标级，文学可以自由展开，证据必须独立核验。"),
    data_separation: localized("One English word → one primary Chinese mapping → separate historical etymology → separate sound-semantic hypothesis → separate experimental validation.", "一个英语词 → 一个主要汉语 Mapping → 独立历史词源 → 独立声音假说 → 独立实验验证。"),
    non_cognacy_position: localized("The database compares languages; it is not evidence that all languages share one historical origin.", "本数据库用于跨语言比较，不是“所有语言历史同源”的证明。"),
  },
  status_enums: {
    entry_status: ["Draft", "Reviewed", "Published", "Archived"],
    mapping_status: ["Candidate", "Reviewed", "Supported", "Rejected"],
    mapping_level: ["A", "B", "C", "D", "Unrated"],
    historical_relation_status: ["Established", "Supported", "Unestablished", "Rejected", "Not claimed"],
    literary_status: ["Draft", "Reviewed", "Published", "Not present"],
    evidence_status: ["Established", "Supported", "Candidate", "Interpretive", "Under review", "Unestablished", "Rejected", "Not claimed", "Not evaluated"],
    confidence: ["High", "Medium", "Low", "Unknown"],
  },
  entries,
};

fs.writeFileSync(out, `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`Language Book v1.0 written: ${entries.length} entries`);
