import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previous = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.2.json"), "utf8"));

const localized = (en, zh) => ({ en, "zh-Hans": zh });
const review = (sourceStatus, refs, sourceNotes, aiStatus = "not-reviewed") => ({
  source_verification: {
    status: sourceStatus,
    source_refs: refs,
    notes: sourceNotes,
  },
  ai_review: {
    status: aiStatus,
    reviewer: null,
    reviewed_at: null,
    rationale: localized("No G.1 object-level AI review has been completed.", "尚未完成 G.1 对象级 AI 审核。"),
  },
});

const primary = (id, form, pinyin, basis, status, refs, notes) => ({
  mapping_id: id,
  chinese_form: form,
  pinyin,
  role: "primary",
  mapping_basis: basis,
  status,
  identity: basis === "author-proposal" ? "author-idea" : "source-backed-lexical-mapping",
  ...review(basis === "author-proposal" ? "needs-verification" : "source-backed", refs, notes),
});

const secondary = (id, form, pinyin, basis, status, refs, notes) => ({
  mapping_id: id,
  chinese_form: form,
  pinyin,
  role: "secondary",
  mapping_basis: basis,
  status,
  identity: basis === "author-proposal" ? "author-idea" : "source-backed-lexical-mapping",
  ...review(basis === "author-proposal" ? "needs-verification" : "source-backed", refs, notes),
});

const rationale = (id, mappingRef, text, refs) => ({
  rationale_id: id,
  mapping_ref: mappingRef,
  identity: "author-idea",
  status: "candidate",
  statement: text,
  ...review("not-applicable", refs, localized("This preserves the author's reason for proposing the mapping; it is not an established fact.", "此对象保存作者提出映射的理由，不是既成事实。")),
});

const etymology = (id, chain, summary, refs, sourceStatus = "needs-authoritative-source") => ({
  etymology_id: id,
  identity: "historical-claim",
  status: "candidate",
  chain,
  summary,
  ...review(sourceStatus, refs, localized("Kept separate from cross-language similarity. Authoritative historical-linguistic citation is still required for G.1 verification.", "已与跨语言相似性分离；G.1 核验仍需补充权威历史语言学引文。")),
});

const note = (id, text, refs, status = "needs-classification") => ({
  note_id: id,
  identity: "author-note",
  status,
  text,
  ...review("not-applicable", refs, localized("Preserved during migration without forcing an evidential interpretation.", "迁移时原样保留，不强行赋予证据解释。")),
});

const commonEntry = (old, overrides) => ({
  entry_id: old.entry_id,
  source_word: old.source_word,
  language: old.language,
  normalized_form: old.normalized_form,
  pronunciation: old.pronunciation,
  phonetic_form: old.phonetic_form,
  lexical_meaning: old.lexical_meaning,
  aliases: old.aliases,
  classification_status: "published",
  primary_chinese_mapping: null,
  secondary_chinese_mappings: [],
  mapping_rationales: [],
  historical_etymologies: [],
  sound_symbol_hypothesis_refs: [],
  other_author_notes: [],
  experimental_validation_refs: [],
  source_provenance: old.source_provenance,
  author: old.author,
  version: `${old.version} / G.1 migration`,
  ...overrides,
});

const byWord = new Map(previous.entries.map((entry) => [entry.normalized_form, entry]));
const entries = [];

entries.push(commonEntry(byWord.get("sky"), {
  primary_chinese_mapping: primary("MAP-sky-primary-tiankong", "天空", "tiānkōng", "lexical-equivalent", "published", ["SRC-LB-SKY"], localized("Ordinary Chinese lexical equivalent; no common-origin claim.", "普通汉语词汇对应；不主张共同词源。")),
  secondary_chinese_mappings: [secondary("MAP-sky-secondary-tian", "天", "tiān", "lexical-equivalent", "published", ["SRC-LB-SKY"], localized("Secondary lexical equivalent retained from v0.2.", "保留自 v0.2 的次要词汇对应。"))],
  sound_symbol_hypothesis_refs: ["UNI-SKY-COVER-001"],
  other_author_notes: [note("NOTE-sky-french", localized("French lexical counterpart retained from v0.2: ciel.", "保留 v0.2 中的法语词汇对应：ciel。"), ["SRC-LB-SKY"], "classified")],
}));

entries.push(commonEntry(byWord.get("universe"), {
  primary_chinese_mapping: primary("MAP-universe-primary-yuzhou", "宇宙", "yǔzhòu", "lexical-equivalent", "published", ["SRC-LB-UNIVERSE"], localized("Cross-language lexical mapping based on totalizing semantic structure, not cognacy.", "基于整体语义结构的跨语言词汇对应，不主张同源。")),
  sound_symbol_hypothesis_refs: ["UNI-UNIVERSE-FLOW-001"],
}));

entries.push(commonEntry(byWord.get("man"), {
  primary_chinese_mapping: primary("MAP-man-primary-nan", "男", "nán", "author-proposal", "published", ["SRC-LB-MAN"], localized("Previously published project mapping retained with its hypothesis identity.", "保留此前发布的项目映射及其假说身份。")),
  mapping_rationales: [rationale("RAT-man-mn", "MAP-man-primary-nan", localized("The author compares the M–N consonant relation in man and 男.", "作者比较 man 与“男”中的 M–N 辅音关系。"), ["SRC-LB-MAN"])],
  sound_symbol_hypothesis_refs: ["UNI-SOUND-MN-001"],
}));

entries.push(commonEntry(byWord.get("sound"), {
  primary_chinese_mapping: primary("MAP-sound-primary-shengyin", "声音", "shēngyīn", "lexical-equivalent", "published", ["SRC-LB-SOUND"], localized("Ordinary Chinese lexical equivalent.", "普通汉语词汇对应。")),
  secondary_chinese_mappings: [secondary("MAP-sound-secondary-sheng", "声", "shēng", "lexical-equivalent", "published", ["SRC-LB-SOUND"], localized("Secondary Chinese form retained from v0.2.", "保留自 v0.2 的次要汉语形式。"))],
  other_author_notes: [note("NOTE-sound-french", localized("French lexical counterpart retained from v0.2: son.", "保留 v0.2 中的法语词汇对应：son。"), ["SRC-LB-SOUND"], "classified")],
}));

const language = byWord.get("language");
entries.push(commonEntry(language, {
  classification_status: "candidate",
  aliases: [...new Set([...language.aliases, "朗", "lǎng"])],
  primary_chinese_mapping: primary("MAP-language-primary-lang", "朗", "lǎng", "author-proposal", "candidate", ["SRC-LB-LANGUAGE"], localized("Author-proposed calibration mapping; not historical etymology and not reviewed fact.", "作者提出的校准映射；不是历史词源，也不是已审核事实。")),
  secondary_chinese_mappings: [secondary("MAP-language-secondary-yuyan", "语言", "yǔyán", "lexical-equivalent", "published", ["SRC-LB-LANGUAGE"], localized("Ordinary Chinese lexical equivalent retained separately from the author proposal.", "普通汉语词汇对应，与作者假说分开保留。"))],
  mapping_rationales: [rationale("RAT-language-lang", "MAP-language-primary-lang", localized("The author associates language with 朗读 and 朗朗上口: language is cognitively linked with being voiced or read aloud.", "作者把 language 与“朗读／朗朗上口”联系：语言在认知上与发声、朗读相关。"), ["SRC-LB-LANGUAGE"])],
  historical_etymologies: [etymology("ETY-language-001", ["English language", "Old French langage", "Latin lingua"], localized("The repository records the English lexical history through Old French langage and Latin lingua (‘tongue; speech’).", "仓库记录英语 language 经古法语 langage，进一步追溯至拉丁语 lingua（“舌；言语”）。"), ["SRC-LB-LANGUAGE"])],
  sound_symbol_hypothesis_refs: ["UNI-L-INHERENT-SEMANTIC-001"],
  other_author_notes: [note("NOTE-language-stream", localized("The source page's lang/朗/亮/廊/浪/良/粮/梁/凉/力/量 stream is preserved as author research material pending finer classification.", "源页面的 lang／朗／亮／廊／浪／良／粮／梁／凉／力／量联想链作为作者研究材料保留，等待进一步分类。"), ["SRC-LB-LANGUAGE"])],
}));

const w = byWord.get("w");
entries.push({
  entry_id: "LB-en-water-001",
  source_word: "water",
  language: "English",
  normalized_form: "water",
  pronunciation: "/ˈwɔːtər/",
  phonetic_form: "wɔːtər",
  lexical_meaning: localized("The transparent liquid essential to life; also water as flow, surface and sound.", "生命所必需的透明液体；也包括水的流动、表面与声音。"),
  aliases: ["W", "wetness", "wave", "flow", "哗", "huā", "水", "shuǐ"],
  classification_status: "candidate",
  primary_chinese_mapping: primary("MAP-water-primary-hua", "哗", "huā", "author-proposal", "candidate", ["SRC-G1-CALIBRATION"], localized("Author-proposed sound-semantic calibration mapping based on the sound of flowing water; not reviewed fact.", "作者基于流水声提出的声音—语义校准映射；不是已审核事实。")),
  secondary_chinese_mappings: [secondary("MAP-water-secondary-shui", "水", "shuǐ", "lexical-equivalent", "published", ["SRC-PROTOCOL-MAPPING"], localized("Ordinary Chinese lexical equivalent included as a separate secondary mapping.", "普通汉语词汇对应，作为独立次要 mapping 保存。"))],
  mapping_rationales: [rationale("RAT-water-hua", "MAP-water-primary-hua", localized("The author links water with 哗/哗哗流水 as an auditory and semantic association.", "作者把 water 与“哗／哗哗流水”联系，作为听觉与语义联想。"), ["SRC-G1-CALIBRATION"])],
  historical_etymologies: [],
  sound_symbol_hypothesis_refs: ["UNI-W-FH-PHONETIC-001", "UNI-W-WATER-002"],
  other_author_notes: [note("NOTE-water-other", localized("Reserved for additional author ideas about water without forcing them into a hypothesis or etymology.", "用于继续保存作者关于 water 的其他想法，不强行归入假说或词源。"), ["SRC-G1-CALIBRATION"])],
  experimental_validation_refs: ["UNI-EXP-002"],
  source_provenance: [...new Set([...w.source_provenance, "SRC-G1-CALIBRATION"])],
  author: "Jinkai Liu｜劉金凱",
  version: "G.1 calibration v0.1",
});

const hypotheses = previous.hypotheses.map((item) => ({
  ...item,
  hypothesis_type: item.hypothesis_id === "UNI-W-WATER-002" ? "initial-consonant-semantics" : "sound-semantic",
  identity: "author-hypothesis",
  statement: item.label,
  evidence_refs: item.source_refs,
  confidence: item.status === "Tested-Inconclusive" ? "low" : "low",
  ...review(item.status === "Tested-Inconclusive" ? "experiment-linked" : "needs-verification", item.source_refs, localized("Migrated from the v0.2 hypothesis registry as an independent hypothesis object.", "从 v0.2 假说登记表迁移为独立假说对象。")),
}));

hypotheses.push({
  hypothesis_id: "UNI-W-FH-PHONETIC-001",
  label: localized("Possible W ↔ F/H phonetic or consonantal relation", "W ↔ F/H 的可能语音或辅音关系"),
  status: "Untested",
  source_refs: ["SRC-G1-CALIBRATION"],
  hypothesis_type: "consonant-correspondence",
  identity: "author-hypothesis",
  statement: localized("The author proposes that W may correspond with F or H in the water ↔ 哗 comparison. No regular sound change is asserted.", "作者提出在 water ↔ 哗 的比较中，W 可能与 F 或 H 对应；此处不声称存在已证实的规律音变。"),
  evidence_refs: [],
  confidence: "low",
  ...review("needs-verification", ["SRC-G1-CALIBRATION"], localized("Requires comparative phonological evidence; similarity alone is insufficient.", "需要比较语音学证据；仅凭相似性不足。")),
});

hypotheses.push({
  hypothesis_id: "UNI-L-INHERENT-SEMANTIC-001",
  label: localized("L sound / letter L may carry an inherent semantic association", "L 音／字母 L 可能具有内在语义关联"),
  status: "Untested",
  source_refs: ["SRC-LB-LANGUAGE"],
  hypothesis_type: "letter-symbol-history",
  identity: "author-hypothesis",
  statement: localized("Research note: investigate what the historical pictorial-sign-to-letter development associated with L may have represented, including relevant ancient Egyptian stages. This does not claim that such a meaning has been established.", "研究笔记：核查与 L 相关的象形符号到字母的历史演变可能曾表示什么，包括相关古埃及阶段；本记录不声称该意义已经得到证明。"),
  evidence_refs: [],
  confidence: "low",
  ...review("needs-authoritative-source", ["SRC-LB-LANGUAGE"], localized("Reliable primary or scholarly history-of-writing sources are required before any historical statement can be promoted.", "任何历史陈述升级前，必须补充可靠原始资料或文字史学术来源。")),
});

const experiments = previous.experiments.map((experiment) => ({
  ...experiment,
  identity: "experimental-result",
  tested_condition: localized("Preregistered W-initial lexical-family enrichment for WATER / WETNESS / WAVE-FLOW semantics against controls.", "预注册检验 W 起始词族在水／湿润／波动—流动语义上相对控制组的富集。"),
  result: localized("Tested-Inconclusive. Direction matched the hypothesis, but uncertainty was wide and the evidence did not establish enrichment or a universal sound law.", "检验结果为不确定。方向与假说一致，但不确定性较大，证据未确立富集，更未确立普遍声音法则。"),
  hypothesis_refs: ["UNI-W-WATER-002"],
  ...review("source-backed", experiment.source_refs, localized("Linked to the frozen primary result and public result page; frozen metrics are preserved.", "链接冻结主结果和公开结果页；冻结统计量保持不变。"), "not-reviewed"),
}));

const dataset = {
  schema_version: "2.0.0",
  dataset_version: "0.3.0",
  published_at: "2026-08-30",
  author: previous.author,
  classification_model: {
    package: "G.1",
    version: "0.1",
    principle: "One English word → one primary Chinese mapping → separate historical etymology → separate sound-semantic hypothesis → separate experimental validation.",
    review_rule: "Source Verification and AI Review target each object independently. No G.1 calibration object is automatically Reviewed or Published.",
  },
  lifecycle: previous.lifecycle,
  sources: [...previous.sources, {
    source_id: "SRC-G1-CALIBRATION",
    title: "Package G.1 WATER / LANGUAGE author calibration record",
    source_type: "author-research-record",
    path: "docs/product/package-g1-classification-model-v0.1.md",
    version: "0.1",
    notes: "Records author proposals as research inputs, not as independently verified linguistic facts."
  }],
  hypotheses,
  experiments,
  entries,
};

fs.writeFileSync(path.join(root, "data", "language-book.v0.3.json"), `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`G.1 migration wrote ${dataset.entries.length} word records, ${dataset.hypotheses.length} hypotheses and ${dataset.experiments.length} experiment.`);
