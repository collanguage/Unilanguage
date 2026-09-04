import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacy = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.6.json"), "utf8"));
const out = path.join(root, "data", "language-book.v1.0.json");
const authoredEntriesDirectory = path.join(root, "data", "entries");
const migrationDate = "2026-09-02";
const releaseDate = "2026-09-02";
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
    semantic: ["ONE", "TURN", "WHOLE", "SPACE", "TIME", "COSMOS"],
    proposition: localized("The universe is a poem written by existence itself.", "宇宙是存在本身写下的一首诗。"),
    note: localized("Standard translation (宇宙), Latin root-level structure, Chinese semantic candidates and cognitive hypotheses are independent objects. No cross-language cognacy or physical cosmology is inferred.", "标准翻译（宇宙）、拉丁词根级结构、汉语语义候选与认知假说是彼此独立的对象；不据此推断跨语言同源或宇宙物理结构。"),
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

function upgradeSky(entry) {
  entry.languages = [
    { role: "source", code: "en", name: "English", word: "sky", pronunciation: "/skaɪ/" },
    { role: "standard-translation", code: "zh-Hans", name: "Chinese", word: "天空", pronunciation: "tiānkōng" },
    { role: "featured-phonetic-semantic-candidate", code: "zh-Hans", name: "Chinese", word: "盖", pronunciation: "gài" },
    { role: "historically-related-form", code: "fr", name: "French", word: "ciel", pronunciation: "/sjɛl/" },
  ];
  entry.featured_mapping = {
    source: "sky", target: "盖", reading: "gài",
    display_label: "Featured phonetic-semantic candidate · 特色音义候选",
    status: "Candidate · Low confidence", historical_relation: "Unestablished",
    boundary: localized("盖 is displayed first as the author's concise sound–meaning and cover-schema candidate. The standard translation remains 天空; modern resemblance does not establish cognacy.", "先展示“盖”gài，作为作者提出的简洁音义与覆盖图式候选；通用翻译仍是“天空”，现代读音近似不证明同源。"),
    source_refs: ["REF-JL-SKY-RAW", "REF-MW-SKY", "REF-CUHK-TIAN", "REF-CTEXT-ZHOUBI"],
  };
  entry.evidence.Historical = {
    status: "Established", confidence: "High",
    summary: localized("English sky, French ciel and Chinese 天/盖 each have independently documented histories; none establishes an English–Chinese cognate relation.", "英语 sky、法语 ciel 与汉语“天／盖”各有独立可考的历史；这些材料不能建立英汉同源关系。"),
    items: [
      { evidence_id: "HIST-SKY-NORSE-001", claim: localized("Middle English sky continues Old Norse ský ‘cloud’; the English sense expanded to the visible upper region.", "中古英语 sky 承自古诺尔斯语 ský“云”，英语词义后来扩展至可见的上方空间。"), status: "Established", confidence: "High", source_refs: ["REF-MW-SKY"] },
      { evidence_id: "HIST-CIEL-LATIN-002", claim: localized("French ciel continues Latin caelum, ‘celestial vault / heaven.’", "法语 ciel 承自拉丁语 caelum“天穹／天界”。"), status: "Established", confidence: "High", source_refs: ["REF-CNRTL-CIEL"] },
      { evidence_id: "HIST-TIAN-FORM-003", claim: localized("Early forms of 天 emphasize a person's head or highest point; the graph subsequently denotes the sky.", "“天”的早期字形突出人首或最高处，后来用于表示天空。"), status: "Supported", confidence: "High", source_refs: ["REF-CUHK-TIAN"] },
    ],
    source_refs: ["REF-MW-SKY", "REF-CNRTL-CIEL", "REF-CUHK-TIAN"],
  };
  entry.literary_layer = {
    ...entry.literary_layer,
    status: "Published",
    proposition: localized("The blue sky is the cover above us, changing through day and night, sun and moon, and the turning seasons.", "蓝天是覆盖我们的被盖，昼日夜月，四季变换。"),
    essay_prose: [{
      work_id: "LB-SKY-PROSE-001", title: localized("The Cover Above Us", "覆盖我们的蓝天"), page_anchor: "words/sky.html#literary", status: "Published",
      text: localized(
        "Standing on a mountain and looking up at the sky, I watch the white clouds wandering overhead. At moments the earth itself seems to move, while the houses rise and fall like sampans and ocean liners. Across oceans and great rivers, wherever we are able to sail, we may never travel over every part of Mother Earth. Even in passing, however, we may glimpse her skin and the places where her bones lie exposed—the mountains, ridges and valleys. The blue sky is the cover above us, changing through day and night, sun and moon, and the turning seasons.",
        "站在山上向天空仰望，覺得天上的白雲在遊走，偶爾也會覺得地在走，房屋似此起彼伏的舢板與郵輪。在海洋、大河，在我們能夠航行的地方，我們雖未遊走在這大地母親的每一處，哪怕只是走馬觀花，也可以看看地母的每處肌膚、每處骨骼外露之處——那是山脈與丘壑。那藍天是我們的被蓋，晝日夜月，四季變換。"
      ),
    }],
    translations: [{ language: "Chinese", status: "Author text, editorially revised" }, { language: "English", status: "Literary translation" }],
  };
  entry.hypotheses.push({
    hypothesis_id: "UNI-SKY-YIJING-002", type: "Author structural-symbol hypothesis",
    claim: localized("The sixty-four hexagrams may be studied as another kind of writing; the author proposes Qian as their originating structure.", "六十四卦图可以作为我们的另一种文字来研究；作者提出“所有卦象都是从乾卦而来”。"),
    status: "Speculative/Testable", confidence: "Low", supporting_cases: ["乾 ☰ as the all-yang hexagram", "hexagrams as yin–yang line combinations"],
    counterexamples: ["This is not presented as a settled historical or Yijing conclusion", "The combinatorial system also requires yin lines and includes Kun ☷ as a basic contrast"],
    testability: localized("Define ‘originating structure’ and compare it with received-text, excavated-text and combinatorial accounts of the hexagram system.", "须先定义“从乾卦而来”的结构含义，再与传世文献、出土材料及卦象组合方式比较。"),
    experiment_link: null, source_refs: ["REF-CTEXT-QIAN"],
  });
  entry.references = [
    { reference_id: "REF-JL-SKY-RAW", title: "Jinkai Liu: Sky literary and research note", type: "author manuscript", url: null, path: null, provenance: "author-provided in conversation; claims independently classified" },
    { reference_id: "REF-MW-SKY", title: "Merriam-Webster Dictionary: sky", type: "dictionary", url: "https://www.merriam-webster.com/dictionary/sky", path: null, provenance: "external dictionary; accessed 2026-09-04" },
    { reference_id: "REF-CNRTL-CIEL", title: "CNRTL/TLFi: étymologie de ciel", type: "historical dictionary", url: "https://www.cnrtl.fr/etymologie/ciel", path: null, provenance: "French national lexical resource; accessed 2026-09-04" },
    { reference_id: "REF-CUHK-TIAN", title: "CUHK Multi-function Chinese Character Database: 天", type: "palaeographic database", url: "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/oraclePiece.php?piece=%E5%A4%A9", path: null, provenance: "university character database; accessed 2026-09-04" },
    { reference_id: "REF-CTEXT-QIAN", title: "Chinese Text Project: Book of Changes — Qian", type: "primary-text database", url: "https://ctext.org/book-of-changes/qian", path: null, provenance: "digitized classical text; accessed 2026-09-04" },
    { reference_id: "REF-CTEXT-ZHOUBI", title: "Chinese Text Project: Zhoubi / Gaitian passages", type: "primary-text database", url: "https://ctext.org/dictionary.pl?char=%E5%91%A8%E9%AB%80&if=en", path: null, provenance: "digitized classical-text index; accessed 2026-09-04" },
    { reference_id: "REF-WIKISOURCE-CHILE", title: "Wikisource: Song of Chile", type: "primary-text edition", url: "https://zh.wikisource.org/wiki/%E6%95%95%E5%8B%92%E6%AD%8C", path: null, provenance: "digital text edition; accessed 2026-09-04" },
    { reference_id: "SRC-LB-SKY", title: "Language Book · Sky", type: "language-book-page", url: null, path: "words/sky.html", provenance: "project editorial page" },
  ];
  entry.source = {
    type: "author-provided literary and research note", author: "Jinkai Liu", status: "Preserved; claims independently classified above",
    normalization: "Traditional characters normalized where appropriate; pinyin and parts of speech normalized; English recast as a literary translation.",
    raw_note: "英语：sky n. 天；汉语：盖【gai】n.。六十四卦图是我们的另一种文字。所有卦象都是从乾卦而来。附乾卦原文、坤卦标题、天字字源说明、盖天说、《敕勒歌》，以及站在山上仰望白云、房屋如舢板与邮轮、大地母亲的肌肤与骨骼、蓝天是被盖的文学段落。原稿另将卫星、电离层和平流层并置为所仰望的盖天结构；编辑版将古代模型、现代大气层与地球外部空间分开说明。",
  };
  entry.editorial_notes = [
    localized("Translation (天空), featured candidate (盖 gài), independent histories, the ABOVE → COVER schema, Gaitian cosmology, Yijing hypothesis and literary writing remain separate.", "通用翻译（天空）、特色候选（盖 gài）、独立词史、ABOVE→COVER 图式、盖天说、易经假说与文学写作保持分离。"),
  ];
  entry.search_terms = clean([...entry.search_terms, "gài", "盖天", "盖天说", "乾", "乾卦", "坤", "坤卦", "周易", "六十四卦", "敕勒歌", "穹庐", "ciel"]);
  entry.version = "Sky Author-Text Literary and Cosmological Revision v1.7 / Schema v1.0";
  entry.dates.modified = releaseDate;
}

upgradeSky(entries.find((entry) => entry.slug === "sky"));

function upgradeUniverse(entry) {
  entry.primary_mapping = {
    ...entry.primary_mapping,
    mapping_type: "Standard lexical translation",
    rationale: localized("Translation is kept as the lexical baseline. Language Book mapping begins with the independently evidenced semantic operations inside Latin universus and compares Chinese candidates without claiming cognacy.", "翻译仅作为词义底座；Language Book Mapping 从拉丁语 universus 内部有独立证据的语义操作出发，再比较汉语候选，不主张同源。"),
  };
  entry.evidence = {
    Historical: {
      status: "Established", confidence: "High",
      summary: localized("Latin universus is historically analyzed as unus + versus (the participial form of vertere): one + turned, hence all together or whole. Chinese character histories are evaluated separately.", "拉丁语 universus 的标准历史分析为 unus + versus（vertere 的分词形式）：一＋转成，继而表示共同整体；汉字词史另行评估。"),
      items: [
        { evidence_id: "EVID-UNIVERSE-LATIN-001", claim: localized("universus: unus + versus / verto, ‘turned into one; combined into one whole.’", "universus：unus＋versus／verto，即“转成一个、合为整体”。"), status: "Established", confidence: "High", source_refs: ["REF-LEWIS-SHORT-UNIVERSUS", "REF-MW-UNIVERSE", "REF-CNRTL-UNIVERS"] },
        { evidence_id: "EVID-UNIVERSE-ZHUAN-001", claim: localized("轉 is glossed as 運也 in Shuowen; later lexicographic material records motion and rotation senses.", "《说文》释“轉”为“運也”；后世字书记录移动、旋转义。"), status: "Established", confidence: "High", source_refs: ["REF-ZDIC-ZHUAN"] },
        { evidence_id: "EVID-UNIVERSE-WO-001", claim: localized("斡 has an independently attested turn/rotate sense: ‘斡，轉也.’", "“斡”有独立可证的旋转义：“斡，轉也”。"), status: "Established", confidence: "High", source_refs: ["REF-CTEXT-WO", "REF-ZDIC-WO"] },
        { evidence_id: "EVID-UNIVERSE-WO-002", claim: localized("渦 is attested as 回川 with the gloss 旋流, supporting eddy/whirlpool rather than a cross-language origin claim.", "“渦”见“回川”并注“旋流”，支持旋流／漩涡义，不支持跨语言同源。"), status: "Established", confidence: "High", source_refs: ["REF-CTEXT-WHIRLPOOL", "REF-ZDIC-WHIRLPOOL"] },
        { evidence_id: "EVID-UNIVERSE-YUZHOU-001", claim: localized("Huainanzi distinguishes 宙 as past-to-present time and 宇 as the four directions plus above and below.", "《淮南子》以“宙”指古往今来的时间，以“宇”指四方上下的空间。"), status: "Established", confidence: "High", source_refs: ["REF-CTEXT-HUAINANZI", "REF-ZDIC-YUZHOU"] },
      ],
      source_refs: ["REF-LEWIS-SHORT-UNIVERSUS", "REF-MW-UNIVERSE", "REF-CNRTL-UNIVERS", "REF-ZDIC-ZHUAN", "REF-CTEXT-WO", "REF-ZDIC-WO", "REF-CTEXT-WHIRLPOOL", "REF-ZDIC-WHIRLPOOL", "REF-CTEXT-HUAINANZI", "REF-ZDIC-YUZHOU"],
    },
    "Phonetic-Semantic": {
      status: "Candidate", confidence: "Low",
      summary: localized("Modern Mandarin wò/wō forms are recorded as a testable sound–meaning cluster. Shared modern syllables do not establish common Chinese ancestry or relation to Latin VERS/VERT.", "现代普通话 wò／wō 形式作为可检验音义簇记录；现代音节相同既不证明汉字彼此同源，也不证明它们与拉丁 VERS／VERT 同源。"),
      items: [
        { evidence_id: "HYP-WO-ROTATION-CLUSTER", claim: localized("Modern 斡 wò, 涡 wō, 窝 wō and 蜗 wō may be compared around TURN / CURVE / ROTATION, with separate lexical evidence for every character.", "现代“斡 wò、涡 wō、窝 wō、蜗 wō”可围绕 TURN／CURVE／ROTATION 比较，但每个字须各用独立词义证据。"), status: "Untested", confidence: "Low", source_refs: ["REF-ZDIC-WO", "REF-ZDIC-WHIRLPOOL", "REF-ZDIC-NEST", "REF-ZDIC-SNAIL"] },
      ],
      source_refs: ["REF-ZDIC-WO", "REF-ZDIC-WHIRLPOOL", "REF-ZDIC-NEST", "REF-ZDIC-SNAIL"],
    },
    Cognitive: {
      status: "Interpretive", confidence: "Medium",
      summary: localized("The comparison models two independently evidenced constructions—ONE + TURNED → WHOLE and SPACE + TIME → COSMOS—then marks ROTATION → VORTEX / CURL / ENCLOSURE as a cognitive-geometric extension.", "比较并列两条独立有据的构词结构——ONE＋TURNED→WHOLE 与 SPACE＋TIME→COSMOS；ROTATION→VORTEX／CURL／ENCLOSURE 另标为认知—几何延伸。"),
      items: [
        { evidence_id: "MAP-UNIVERSE-GEOMETRY-001", claim: localized("Abstract → Motion → Geometry → Symbol: TURN → ROTATION → VORTEX / CURL / ENCLOSURE.", "抽象→动作→几何→符号：TURN→ROTATION→VORTEX／CURL／ENCLOSURE。"), status: "Interpretive", confidence: "Medium", source_refs: ["REF-ZDIC-WHIRLPOOL", "REF-ZDIC-NEST", "REF-ZDIC-SNAIL"] },
      ],
      source_refs: ["REF-ZDIC-WHIRLPOOL", "REF-ZDIC-NEST", "REF-ZDIC-SNAIL", "REF-ZDIC-ZHOU", "REF-ZDIC-HE", "REF-ZDIC-QUAN"],
    },
    Speculative: {
      status: "Candidate", confidence: "Low",
      summary: localized("Cognitive Trace, the author’s spiral-motion proposal, and Cosmic Motion Encoding are explicitly speculative/testable. Etymology does not establish a scientific model of the universe.", "语言认知痕迹、作者螺旋运动设想与宇宙运动编码均明确标为推测性／可检验；词源不能建立宇宙的科学模型。"),
      items: [
        { evidence_id: "HYP-COGNITIVE-TRACE-001", claim: localized("Language may preserve traces of how earlier human communities perceived, categorized, and modeled the world.", "语言可能保存早期人类群体感知、分类和构造世界模型的痕迹。"), status: "Speculative/Testable", confidence: "Low", source_refs: [] },
        { evidence_id: "HYP-UNIVERSE-SPIRAL-001", claim: localized("Perhaps ancient people recognized rotational or spiral motion in the universe and preserved that cognition in structures such as universe.", "也许古人已经认识到宇宙具有旋转或螺旋式运动，并将这种认知保留在 universe 一类语言结构之中。"), status: "Speculative/Testable", confidence: "Low", source_refs: [] },
        { evidence_id: "HYP-COSMIC-MOTION-ENCODING-001", claim: localized("Terms for cosmic totality may recruit ONE / TURN / CYCLE / ENCLOSE / SPACE / TIME more often than suitable controls across languages and cultures.", "跨语言／文化的宇宙整体词汇，是否比适当对照更频繁调用 ONE／TURN／CYCLE／ENCLOSE／SPACE／TIME。"), status: "Untested", confidence: "Low", source_refs: [] },
      ],
      source_refs: [],
    },
  };
  entry.phonetic_observation = [{
    observation_id: "PHON-WO-ROTATION-001",
    claim: localized("Modern Mandarin: 斡 wò, 涡 wō, 窝 wō, 蜗 wō. Their nearby modern forms motivate a cluster test only.", "现代普通话：斡 wò、涡 wō、窝 wō、蜗 wō；相近的现代读音只用于提出聚类检验。"),
    status: "Candidate",
    limitations: localized("No historical sound correspondence, shared Chinese etymon or Latin–Chinese cognacy is claimed. Historical pronunciations are omitted here unless tied to a named reconstruction or lexicographic source.", "不主张规律历史音变、汉字共同语源或拉丁—汉语同源；未能逐项绑定具名重构或字书来源的历史音不写入。"),
  }];
  entry.semantic_structure = { concepts: ["ONE", "TURN", "WHOLE", "ROTATION", "VORTEX", "CURL", "ENCLOSURE", "SPACE", "TIME", "COSMOS"], relation: "ONE + TURNED → WHOLE | TURN → ROTATION → VORTEX / CURL / ENCLOSURE | SPACE + TIME → COSMOS", status: "Layered: Established + Interpretive" };
  entry.root_level_mapping = {
    version: "1.0",
    translation: { source: "universe", target: "宇宙", status: "Standard lexical translation" },
    featured_structural_mapping: {
      source: "universe", target: "斡", reading: "wò",
      status: "Strong semantic candidate", historical_relation: "Not claimed",
      boundary: localized("Featured for the semantic operation TURN / ROTATION; it is not the standard translation and no Latin–Chinese cognacy is claimed.", "用于突出 TURN／ROTATION 语义操作；它不是通用翻译，也不主张拉丁语与汉语同源。"),
    },
    latin_decomposition: {
      status: "Established",
      chain: "Latin universus → UNI (unus) + VERS (versus ← vertere) → ONE + TURNED → WHOLE",
      components: [
        { form: "UNI / unus", primitive: "ONE", status: "Established", source_refs: ["REF-MW-UNIVERSE", "REF-LEWIS-SHORT-UNUS"] },
        { form: "VERS / versus ← vertere", primitive: "TURN / TURNED", status: "Established", source_refs: ["REF-MW-UNIVERSE", "REF-LEWIS-SHORT-VERTERE"] },
        { form: "universus", primitive: "WHOLE / ENTIRE / ALL TOGETHER", status: "Established", source_refs: ["REF-LEWIS-SHORT-UNIVERSUS", "REF-CNRTL-UNIVERS"] },
      ],
      modern_verse_note: localized("Modern English verse ‘poetic line’ belongs to the wider historical TURN family through Latin versus ‘line/row’; it is not the operative modern meaning used to decompose universe.", "现代英语 verse“诗行”虽经拉丁 versus“行列”属于更广的 TURN 词族，但不是拆解 universe 时采用的现代核心义。"),
    },
    semantic_primitives: ["ONE", "TURN", "WHOLE", "ROTATION", "VORTEX", "CURL", "ENCLOSURE", "SPACE", "TIME", "COSMOS"],
    chinese_structural_candidates: [
      { character: "一", reading: "yī", roles: ["ONE"], evidence_status: "Supported lexical mapping", candidate_grade: "Direct structural candidate", historical_relation: "Not claimed", note: localized("Direct Chinese semantic equivalent for ONE.", "ONE 的直接汉语语义对应。") },
      { character: "转／轉", reading: "zhuǎn / zhuàn", roles: ["TURN", "ROTATION"], evidence_status: "Established lexical meaning", candidate_grade: "Direct semantic candidate", historical_relation: "Not claimed", note: localized("Shuowen glosses 轉 as 運也; later records include motion and rotation.", "《说文》释“轉”为“運也”；后世记录移动与旋转义。") },
      { character: "斡", reading: "wò", roles: ["TURN", "ROTATION"], evidence_status: "Established lexical meaning", candidate_grade: "Strong semantic candidate", historical_relation: "Not claimed", note: localized("Guangya/lexicographic record: 斡，轉也. No Latin relation follows.", "《广雅》等字书载“斡，轉也”；不能据此推出拉丁语关系。") },
      { character: "涡／渦", reading: "wō", roles: ["VORTEX", "ROTATION"], evidence_status: "Established lexical meaning", candidate_grade: "Geometry candidate", historical_relation: "Not claimed", note: localized("A rotating current / eddy; historical lexicography records 回川 with the gloss 旋流.", "旋转水流／漩涡；字书有“回川”并注“旋流”。") },
      { character: "窝／窩", reading: "wō", roles: ["CURL", "ENCLOSURE", "RECESS"], evidence_status: "Modern meaning + later lexicography", candidate_grade: "Cognitive/Visual Candidate", historical_relation: "Not claimed", note: localized("Nest, recess and ‘bend’ motivate enclosure/curve imagery; a historical ROTATION sense is not established.", "巢穴、凹陷与“弄弯”可引出包围／曲线意象；未确立历史 ROTATION 义。") },
      { character: "蜗／蝸", reading: "wō", roles: ["SPIRAL-FORM", "CURL"], evidence_status: "Entity meaning + visual form", candidate_grade: "Cognitive/Visual Candidate", historical_relation: "Not claimed", note: localized("The word denotes a snail; spiral geometry comes from the shell’s form, not from a lexical meaning ‘rotate.’", "本字指蜗牛；螺旋几何来自壳的形态，不是“旋转”的词汇义。") },
      { character: "周", reading: "zhōu", roles: ["AROUND", "CYCLE", "COMPLETE", "WHOLE"], evidence_status: "Established lexical meanings", candidate_grade: "Semantic result candidate", historical_relation: "Not claimed", note: localized("Around, cycle, complete/all; semantically useful but outside the modern WO sound cluster.", "具有环绕、循环、周全／全部等义；语义上有用，但不属于现代 WO 音簇。") },
      { character: "合", reading: "hé", roles: ["JOIN", "WHOLE"], evidence_status: "Established lexical meaning", candidate_grade: "Whole/Totality candidate", historical_relation: "Not claimed", note: localized("Joining/closing models the result of bringing parts together, not TURN itself.", "聚合／闭合可表示诸部分成为整体的结果，并非 TURN 本身。") },
      { character: "全", reading: "quán", roles: ["COMPLETE", "WHOLE"], evidence_status: "Established lexical meaning", candidate_grade: "Whole/Totality candidate", historical_relation: "Not claimed", note: localized("Complete/entire models the outcome WHOLE, not the turning operation.", "完整／全部对应结果 WHOLE，并非旋转操作。") },
    ],
    geometry_mapping: { status: "Interpretive", chain: "Abstract → Motion → Geometry → Symbol | TURN → ROTATION → VORTEX / CURL / ENCLOSURE", boundary: localized("This is a cognitive-geometric mapping, not the historical meaning of every form in the chain.", "这是认知—几何映射，不是链上每一形式的历史词义。") },
    traditional_chinese_construction: { status: "Historically supported conceptual construction", chain: "宇 + 宙 → SPACE + TIME → COSMOS", boundary: localized("This Chinese construction is independent of the Latin decomposition.", "这条中文传统构词链独立于拉丁语拆解。") },
    whole_candidates: ["合", "全", "周"],
    evidence_boundary: localized("Translation is not Mapping; semantic resemblance is not cognacy; etymology cannot by itself establish the physical structure of the universe.", "Translation 不等于 Mapping；语义相似不等于同源；不能仅由词源推断宇宙物理结构。"),
  };
  entry.hypotheses = [
    { hypothesis_id: "HYP-WO-ROTATION-CLUSTER", type: "Phonetic-semantic cluster", claim: localized("Modern wò/wō forms may show a testable concentration around TURN / CURVE / ROTATION.", "现代 wò／wō 形式可能在 TURN／CURVE／ROTATION 周围形成可检验聚集。"), status: "Untested", confidence: "Low", supporting_cases: ["斡 wò", "涡 wō", "窝 wō", "蜗 wō"], counterexamples: ["Modern homophony does not establish shared origin", "窝 is primarily enclosure/bending", "蜗 is primarily an animal name"], testability: localized("Build a pre-registered Mandarin lexical sample with frequency-matched syllable controls and independent semantic coding.", "建立预注册的普通话词汇样本，以频率匹配音节作对照，并进行独立语义编码。"), experiment_link: null, source_refs: ["REF-ZDIC-WO", "REF-ZDIC-WHIRLPOOL", "REF-ZDIC-NEST", "REF-ZDIC-SNAIL"] },
    { hypothesis_id: "HYP-COGNITIVE-TRACE-001", type: "Cognitive trace hypothesis", claim: localized("Language may preserve traces of how earlier human communities perceived, categorized, and modeled the world.", "语言可能保存早期人类群体感知、分类和构造世界模型的痕迹。"), status: "Speculative/Testable", confidence: "Low", supporting_cases: ["Latin ONE + TURNED → WHOLE", "Chinese SPACE + TIME → COSMOS"], counterexamples: ["Lexicalization can be opaque to later speakers", "Parallel metaphors need not reflect the same historical cognition"], testability: localized("Compare independently coded historical lexical constructions across unrelated language families and time periods.", "跨无亲缘语系与历史时期，对历史构词结构进行独立编码比较。"), experiment_link: null, source_refs: ["REF-LEWIS-SHORT-UNIVERSUS", "REF-CTEXT-HUAINANZI"] },
    { hypothesis_id: "HYP-UNIVERSE-SPIRAL-001", type: "Author hypothesis", claim: localized("Perhaps ancient people recognized rotational or spiral motion in the universe and preserved that cognition in structures such as universe.", "也许古人已经认识到宇宙具有旋转或螺旋式运动，并将这种认知保留在 universe 一类语言结构之中。"), status: "Speculative/Testable", confidence: "Low", supporting_cases: ["TURN is historically present in the Latin formation"], counterexamples: ["Historical evidence: Unestablished", "Scientific claim: not established by etymology", "TURN → spiral cosmos is an additional inference"], testability: localized("Require independent historical texts showing a cosmic rotation model linked to the lexical choice; etymology alone is insufficient.", "必须找到独立历史文本，显示宇宙旋转模型与该词汇选择有关；仅凭词源不足。"), experiment_link: null, source_refs: ["REF-LEWIS-SHORT-UNIVERSUS"] },
    { hypothesis_id: "HYP-COSMIC-MOTION-ENCODING-001", type: "Cross-linguistic semantic-frequency hypothesis", claim: localized("Cosmic-totality expressions may recruit ONE / TURN / CYCLE / ENCLOSE / SPACE / TIME more often than matched non-cosmic concepts.", "表达宇宙整体的词语，可能比匹配的非宇宙概念更频繁调用 ONE／TURN／CYCLE／ENCLOSE／SPACE／TIME。"), status: "Untested", confidence: "Low", supporting_cases: ["universus", "宇宙"], counterexamples: ["Current examples are too few", "Borrowing and genealogical dependence must be controlled"], testability: localized("Pre-register languages, etymological sources, semantic coding, genealogical controls and a comparison baseline.", "预注册语言样本、词源来源、语义编码、谱系控制与比较基线。"), experiment_link: null, source_refs: ["REF-LEWIS-SHORT-UNIVERSUS", "REF-CTEXT-HUAINANZI"] },
  ];
  entry.references = [
    { reference_id: "REF-LEWIS-SHORT-UNIVERSUS", title: "Lewis & Short Latin Dictionary: universus", type: "historical dictionary", url: "https://archli.com/dictionary/lewis-short-latin-dictionary/universus-179957", path: null, provenance: "Lewis & Short (1879) digital edition" },
    { reference_id: "REF-LEWIS-SHORT-UNUS", title: "Lewis & Short Latin Dictionary: unus", type: "historical dictionary", url: "https://classics.andrewgadsden.com/lewisandshort/entry/n49871", path: null, provenance: "Lewis & Short (1879) digital edition" },
    { reference_id: "REF-LEWIS-SHORT-VERTERE", title: "Lewis & Short Latin Dictionary: vertere / verto", type: "historical dictionary", url: "https://alatius.com/ls/index.php?l=vertere", path: null, provenance: "Lewis & Short digital edition" },
    { reference_id: "REF-MW-UNIVERSE", title: "Merriam-Webster: universe — word history", type: "dictionary", url: "https://www.merriam-webster.com/dictionary/universe", path: null, provenance: "external dictionary reference" },
    { reference_id: "REF-CNRTL-UNIVERS", title: "CNRTL: étymologie de univers", type: "etymological dictionary", url: "https://www.cnrtl.fr/etymologie/univers", path: null, provenance: "French national lexical resource" },
    { reference_id: "REF-MW-VERSE", title: "Merriam-Webster: verse — word history", type: "dictionary", url: "https://www.merriam-webster.com/dictionary/verse", path: null, provenance: "external dictionary reference" },
    { reference_id: "REF-CTEXT-HUAINANZI", title: "Chinese Text Project: Huainanzi, Qisu Xun", type: "primary-text database", url: "https://ctext.org/text.pl?if=gb&node=3206", path: null, provenance: "digitized classical text" },
    { reference_id: "REF-ZDIC-YUZHOU", title: "漢典: 宇宙", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E5%AE%87%E5%AE%99", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-ZDIC-ZHUAN", title: "漢典: 轉／转", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E8%BD%AC", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-CTEXT-WO", title: "Chinese Text Project dictionary: 斡", type: "character/historical dictionary index", url: "https://ctext.org/dictionary.pl?char=%E6%96%A1&if=en", path: null, provenance: "indexed Shuowen, Guangyun, Kangxi and Hanyu references" },
    { reference_id: "REF-ZDIC-WO", title: "漢典: 斡", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hant/%E6%96%A1", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-CTEXT-WHIRLPOOL", title: "Chinese Text Project dictionary: 渦", type: "character/historical dictionary index", url: "https://ctext.org/dictionary.pl?char=%E6%B8%A6&if=en", path: null, provenance: "indexed classical and dictionary references" },
    { reference_id: "REF-ZDIC-WHIRLPOOL", title: "漢典: 渦／涡", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E6%B6%A1", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-ZDIC-NEST", title: "漢典: 窩／窝", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E7%AA%A9", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-ZDIC-SNAIL", title: "漢典: 蝸／蜗", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E8%9C%97", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-ZDIC-ZHOU", title: "漢典: 周", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E5%91%A8", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-ZDIC-HE", title: "漢典: 合", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E5%90%88", path: null, provenance: "external lexicographic reference" },
    { reference_id: "REF-ZDIC-QUAN", title: "漢典: 全", type: "historical/modern dictionary compilation", url: "https://www.zdic.net/hans/%E5%85%A8", path: null, provenance: "external lexicographic reference" },
    { reference_id: "SRC-LB-UNIVERSE", title: "Language Book · Universe", type: "language-book-page", url: null, path: "words/universe.html", provenance: "project editorial page" },
    { reference_id: "SRC-PROTOCOL-MAPPING", title: "Protocol Book · Multidimensional Mapping Framework", type: "protocol-page", url: null, path: "protocol/protocol.mapping-framework.html", provenance: "project protocol" },
  ];
  entry.version = "Universe Root-Level Semantic Mapper v1.0 / Entry v2.0 / Schema v1.0";
  entry.dates.modified = releaseDate;
  entry.editorial_notes = [
    localized("Language may preserve cognitive traces, but etymology alone cannot establish the physical structure of the universe.", "语言可以保存认知痕迹，但不能仅由词源反推出宇宙物理结构。"),
    localized("No single Chinese character is selected as the unique primary structural mapping; candidates retain evidence-specific grades.", "不把任何单一汉字选作唯一主要结构映射；各候选保留各自证据等级。"),
  ];
  entry.search_terms = ["universe", "universus", "uni", "vers", "vert", "turn", "宇宙", "宇", "宙", "转", "轉", "斡", "涡", "渦", "窝", "窩", "蜗", "蝸", "周", "合", "全", "one", "whole", "rotation", "vortex", "curl", "enclosure", "space", "time", "cosmos"];
  return entry;
}

upgradeUniverse(entries.find((entry) => entry.slug === "universe"));

function upgradeSound(entry) {
  const secondary = entry.legacy?.secondary_chinese_mappings?.find((item) => item.mapping_id === "MAP-sound-secondary-sheng");
  entry.languages = [
    { role: "source", code: "en", name: "English", word: "sound", pronunciation: "/saʊnd/" },
    { role: "standard-translation", code: "zh-Hans", name: "Chinese", word: "声音", pronunciation: "shēngyīn" },
    { role: "featured-lexical-candidate", code: "zh-Hans", name: "Chinese", word: "声", pronunciation: "shēng" },
    { role: "verb-equivalent", code: "zh-Hans", name: "Chinese", word: "响", pronunciation: "xiǎng" },
    { role: "historically-related-form", code: "fr", name: "French", word: "son", pronunciation: "/sɔ̃/" },
    { role: "historically-related-verb", code: "fr", name: "French", word: "sonner", pronunciation: "/sɔ.ne/" },
  ];
  entry.primary_mapping.source.pronunciation = "/saʊnd/";
  entry.primary_mapping.gloss = localized("Noun: an audible vibration; verb: to make or cause a sound.", "名词：声音；动词：响起或使之发声。");
  entry.primary_mapping.meaning = localized("声音 is the standard noun translation; 响 / 响起 expresses the intransitive verb in this record. 声 shēng is displayed as the concise featured lexical candidate.", "“声音”是名词的通用翻译；本条以“响／响起”表达不及物动词；单字“声”shēng 作为简洁的特色词义候选展示。");
  entry.featured_mapping = {
    source: "sound",
    target: secondary?.chinese_form || "声",
    reading: secondary?.pinyin || "shēng",
    display_label: "Featured lexical mapping · 特色词义映射",
    status: "Supported lexical equivalent",
    historical_relation: "Not claimed",
    boundary: localized("声 is a concise, source-backed Chinese lexical form. 声音 remains the standard modern dictionary translation; no shared historical origin is claimed.", "“声”是有来源记录的简洁汉语词义形式；“声音”仍是现代通用词典翻译，不主张共同历史来源。"),
    source_refs: ["SRC-LB-SOUND"],
  };
  entry.evidence.Historical = {
    status: "Established", confidence: "High",
    summary: localized("The audible English sound comes through Middle English and Anglo-French from Latin sonus / sonare. French son and sonner continue the same Latin sound family. These histories are independent of Chinese 声 and 响.", "英语表示听觉的 sound 经中古英语、盎格鲁法语追溯至拉丁语 sonus／sonare；法语 son、sonner 延续同一拉丁声音词族。这些词史独立于汉语“声”“响”。"),
    items: [
      { evidence_id: "HIST-SOUND-LATIN-001", claim: localized("Audible sound: Middle English soun ← Anglo-French son/sun ← Latin sonus, related to sonare ‘to sound.’", "听觉义 sound：中古英语 soun ← 盎格鲁法语 son／sun ← 拉丁语 sonus，并与 sonare“发声”相关。"), status: "Established", confidence: "High", source_refs: ["REF-MW-SOUND"] },
      { evidence_id: "HIST-FR-SON-002", claim: localized("French son derives from Latin sonus; French sonner derives from Latin sonare.", "法语 son 源自拉丁语 sonus；sonner 源自拉丁语 sonare。"), status: "Established", confidence: "High", source_refs: ["REF-CNRTL-SON", "REF-CNRTL-SONNER"] },
    ],
    source_refs: ["REF-MW-SOUND", "REF-CNRTL-SON", "REF-CNRTL-SONNER"],
  };
  entry.evidence["Phonetic-Semantic"] = {
    status: "Candidate", confidence: "Low",
    summary: localized("sound /saʊnd/ and 声 shēng share meaning and begin with sibilant consonants, but English /s/ and Mandarin sh /ʂ/ are not identical, and the remaining sounds do not regularly correspond.", "sound /saʊnd/ 与“声”shēng 共享声音义并都以擦音起首，但英语 /s/ 与普通话 sh /ʂ/ 并不相同，其余声音也没有建立规律对应。"),
    items: [{ evidence_id: "PHONSEM-SOUND-SHENG-001", claim: localized("The proposed relation is a modern sound–meaning resemblance, not a historical cognacy claim.", "所提关系是现代声音—意义近似，不是历史同源主张。"), status: "Candidate", confidence: "Low", source_refs: ["SRC-LB-SOUND", "REF-JL-SOUND-RAW"] }],
    source_refs: ["SRC-LB-SOUND", "REF-JL-SOUND-RAW"],
  };
  entry.phonetic_observation = [{ observation_id: "PHON-SOUND-SHENG-001", claim: localized("sound /saʊnd/ ↔ 声 shēng: shared sound meaning and a broad initial-sibilant resemblance.", "sound /saʊnd/ ↔“声”shēng：共享声音义，并有宽泛的起首擦音近似。"), status: "Candidate", limitations: localized("English /s/ is alveolar; Mandarin sh is retroflex /ʂ/. No regular correspondence, shared rime or historical relation is established.", "英语 /s/ 为齿龈音；普通话 sh 为卷舌音 /ʂ/。未建立规律对应、共享韵部或历史关系。") }];
  entry.literary_layer = {
    status: "Published", is_historical_evidence: false,
    proposition: localized("Architecture is frozen music.", "那是凝固的音乐。"),
    essay_prose: [{
      work_id: "LB-SOUND-PROSE-001",
      title: localized("When the Violin Sounds", "当小提琴声音响起"),
      text: localized(
        "When the violin sounded, it was like a small stream flowing through the forest. As the violin's current rose, I was passing a majestic church. I saw its two round corner towers, its circular window, and tracery radiating like the sun. A saint extended his arms as though an angel were beckoning; behind him, a halo shone like another sun. Columns recalled an ancient Athenian temple. A gentleman in a top hat passed through the great doorway. The violin's rising and falling melody made me imagine a pair of immortal companions drifting down from the mountains of the Middle Ages. Was this music I had once known, or a composer's new work? Sunlight touched the church's marble wall and spread over it a pale layer of yellow. It was frozen music.",
        "小提琴的声音响起时，仿佛森林里一条小小的溪水正在流动。琴声流淌的时候，我正路过一座雄伟的教堂。我看见教堂两座圆形角楼的顶，也看见那扇圆窗，以及像太阳般向四方放射的窗棂。一位圣人伸开双臂，仿佛天使正在招手；他身后的光环，又像一轮太阳。那些圆柱使人想起古老的雅典神庙。一位戴着礼帽的绅士从大门走过。小提琴起伏的旋律，使我想象一双仙侣从中世纪的山间漂流而来。那是我曾经熟悉的音乐，还是作曲家的新作呢？太阳照着教堂大理石的外墙，又为它涂上一层淡淡的黄色。那是凝固的音乐。"
      ),
      status: "Published",
      page_anchor: "words/sound.html#literature",
    }],
    poem_lyrics: [],
    translations: [{ language: "Chinese", status: "Author text, editorially revised" }, { language: "English", status: "Literary translation" }],
    archival_manuscript_media: [],
    evidence_boundary: localized("The violin, forest stream, church, sun, saint and frozen music are literary images. They are not historical or phonetic evidence.", "小提琴、森林溪流、教堂、太阳、圣人与“凝固的音乐”均属文学意象，不构成历史或语音证据。"),
  };
  entry.references = [
    ...entry.references,
    { reference_id: "REF-JL-SOUND-RAW", title: "Jinkai Liu: Sound literary manuscript and research note", type: "author manuscript", url: null, path: null, provenance: "author-provided in conversation; original note preserved below" },
    { reference_id: "REF-MW-SOUND", title: "Merriam-Webster Dictionary: sound", type: "dictionary", url: "https://www.merriam-webster.com/dictionary/sound", path: null, provenance: "external dictionary; accessed 2026-09-04" },
    { reference_id: "REF-CNRTL-SON", title: "CNRTL/TLFi: étymologie de son", type: "historical dictionary", url: "https://www.cnrtl.fr/etymologie/son/substantif", path: null, provenance: "external lexicographic reference; accessed 2026-09-04" },
    { reference_id: "REF-CNRTL-SONNER", title: "CNRTL/TLFi: étymologie de sonner", type: "historical dictionary", url: "https://www.cnrtl.fr/etymologie/sonner", path: null, provenance: "external lexicographic reference; accessed 2026-09-04" },
  ];
  entry.source = {
    type: "author-provided literary and research note", author: "Jinkai Liu", status: "Preserved; claims independently classified above",
    normalization: "Parts of speech and pinyin normalized; Chinese prose lightly edited; English recast as a literary translation.",
    raw_note: "英语：sound [sound] n/v. 声音，响起。汉语：声【sheng】n.；响【xiang】v.。备注：辅音近似。例文原稿以小提琴、森林溪水、雄伟教堂、圆形角楼、圆窗、太阳般四射的窗棂、圣人、雅典神庙圆柱、礼帽绅士、中世纪山间、阳光与‘凝固的音乐’构成文学场景。",
  };
  entry.search_terms = clean([...entry.search_terms, "响起", "xiǎng", "sonner", "violin", "小提琴", "church", "教堂", "frozen music", "凝固的音乐"]);
  entry.version = "Sound Literary Revision v1.1 / Schema v1.0";
  entry.dates.modified = releaseDate;
}

upgradeSound(entries.find((entry) => entry.slug === "sound"));
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
    { reference_id: "REF-LANGUAGESBOOK-AT", title: "languagesbook.com legacy entry: A，爱在，世界就在", type: "legacy author publication", url: "https://languagesbook.com/glossary/a-5/", path: null, provenance: "author-published legacy website; source merged without overwriting the published literary record" },
  ],
  author: "Jinkai Liu", version: "Literary Entry v1.0 / Schema v1.0", dates: { created: null, modified: migrationDate, published: migrationDate },
  editorial_notes: [localized("Publication, mapping, evidence/historical relation and literature are independent axes.", "词条发表、mapping、证据／历史关系与文学层是四条独立状态轴。")],
  search_terms: ["at", "在", "爱", "愛", "love", "presence", "location", "relation", "world", "世界", "爱在", "愛在", "love is presence", "第一次遇见你的时候", "一个美丽的向往，在那太空", "a beautiful yearning in space"],
  page: "words/at.html", legacy: null,
  legacy_import: { batch_id: "LEGACY-WEBSITE-IMPORT-BATCH-001", source_url: "https://languagesbook.com/glossary/a-5/", action: "merged-source-deduplicated", raw_note: "A，爱在，世界就在。遨游蓝色星海。" },
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
  dataset_version: "1.2.7",
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
