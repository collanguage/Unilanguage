import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "data", "language-book.v0.4.json");
const output = path.join(root, "data", "language-book.v0.5.json");
const dataset = JSON.parse(fs.readFileSync(input, "utf8"));

const localized = (en, zhHans) => ({ en, "zh-Hans": zhHans });
const notReviewed = () => ({
  status: "not-reviewed",
  reviewer: null,
  reviewed_at: null,
  rationale: localized(
    "This calibration object has not received an object-level AI review.",
    "该校准对象尚未接受对象级 AI 审核。",
  ),
});
const verification = (status, sourceRefs, en, zhHans) => ({
  status,
  source_refs: sourceRefs,
  notes: localized(en, zhHans),
});

dataset.dataset_version = "0.5.0";
dataset.published_at = "2026-08-30";
dataset.classification_model = {
  package: "G.3",
  version: "0.1",
  parent_package: "G.2 v0.1",
  principle: dataset.classification_model.principle,
  review_rule: "ADVANCE is added as a third calibration Candidate. Source Verification is object-specific; no mapping, hypothesis, experiment, AI review, or publication status is promoted.",
};

dataset.sources.push(
  {
    source_id: "SRC-LB-ADVANCE",
    title: "Language Book · Advance",
    source_type: "author-research-record",
    path: "words/advance.html",
    version: "G.3 calibration v0.1",
    notes: "Preserves the author's mapping, segmentations, French comparisons and vance observation as author analysis rather than historical morphology.",
    source_quality: "project-record",
  },
  {
    source_id: "SRC-CAMBRIDGE-ADVANCE-ZH",
    title: "Cambridge Dictionary · advance (English–Chinese Simplified)",
    source_type: "authoritative-dictionary",
    path: "docs/product/package-g3-advance-calibration-v0.1.md",
    version: "online",
    notes: "Bilingual lexical source with an explicit support boundary.",
    url: "https://dictionary.cambridge.org/dictionary/english-chinese-simplified/advance",
    accessed_at: "2026-08-30",
    source_quality: "authoritative-dictionary",
    supports: ["Advance in its forward-motion sense may be translated with 前进 and, in contextual examples, 推进."],
    does_not_support: ["往 as a unique primary translation; a historical or sound-law relation between advance/vance and 往."],
  },
  {
    source_id: "SRC-MW-ADVANCE",
    title: "Merriam-Webster · advance",
    source_type: "authoritative-dictionary",
    path: "docs/product/package-g3-advance-calibration-v0.1.md",
    version: "online",
    notes: "English word-history source with an explicit support boundary.",
    url: "https://www.merriam-webster.com/dictionary/advance",
    accessed_at: "2026-08-30",
    source_quality: "authoritative-dictionary",
    supports: ["Middle English advauncen is an alteration of avauncen, borrowed from Anglo-French avancer, ultimately from Latin abante through Vulgar Latin *abantiare."],
    does_not_support: ["ad.van.ce as historical morphology; vance as a historical adjective meaning '前的'; common origin with Chinese 往."],
  },
  {
    source_id: "SRC-MW-ADVANCEMENT",
    title: "Merriam-Webster · advancement",
    source_type: "authoritative-dictionary",
    path: "docs/product/package-g3-advance-calibration-v0.1.md",
    version: "online",
    notes: "English and Anglo-French morphology source with an explicit support boundary.",
    url: "https://www.merriam-webster.com/dictionary/advancement",
    accessed_at: "2026-08-30",
    source_quality: "authoritative-dictionary",
    supports: ["English advancement reflects Middle English avauncement, borrowed from Anglo-French avancement, formed from avancer plus -ment."],
    does_not_support: ["ad.vance.ment as the historical segmentation; vance as a free historical morpheme meaning '前的'."],
  },
  {
    source_id: "SRC-CNRTL-AVANCER",
    title: "CNRTL / TLFi · avancer",
    source_type: "authoritative-dictionary",
    path: "docs/product/package-g3-advance-calibration-v0.1.md",
    version: "online TLFi",
    notes: "French historical-lexicography source with an explicit support boundary.",
    url: "https://www.cnrtl.fr/etymologie/avancer",
    accessed_at: "2026-08-30",
    source_quality: "authoritative-dictionary",
    supports: ["French avancer is traced to Vulgar Latin *abantiare, formed on abante."],
    does_not_support: ["A French adjective vance meaning '前的' as the historical base of avancer."],
  },
  {
    source_id: "SRC-CNRTL-AVANCE",
    title: "CNRTL / TLFi · avance",
    source_type: "authoritative-dictionary",
    path: "docs/product/package-g3-advance-calibration-v0.1.md",
    version: "online TLFi",
    notes: "French derivational source with an explicit support boundary.",
    url: "https://www.cnrtl.fr/etymologie/avance",
    accessed_at: "2026-08-30",
    source_quality: "authoritative-dictionary",
    supports: ["French avance is described as a deverbal noun from avancer."],
    does_not_support: ["vance as an independently established adjective meaning '前的'."],
  },
  {
    source_id: "SRC-CNRTL-AVANCEMENT",
    title: "CNRTL / TLFi · avancement",
    source_type: "authoritative-dictionary",
    path: "docs/product/package-g3-advance-calibration-v0.1.md",
    version: "online TLFi",
    notes: "French derivational source with an explicit support boundary.",
    url: "https://www.cnrtl.fr/etymologie/avancement",
    accessed_at: "2026-08-30",
    source_quality: "authoritative-dictionary",
    supports: ["French avancement is derived from avancer with the suffix -ment."],
    does_not_support: ["vance as an independently established adjective meaning '前的'."],
  },
);

dataset.hypotheses.push({
  hypothesis_id: "UNI-VANCE-WANG-001",
  label: localized("van/vance ↔ wang/往 sound-semantic hypothesis", "van／vance ↔ wang／往 声音—语义假说"),
  status: "Untested",
  source_refs: ["SRC-LB-ADVANCE", "SRC-MW-ADVANCE", "SRC-CNRTL-AVANCER"],
  hypothesis_type: "sound-semantic",
  identity: "author-hypothesis",
  statement: localized(
    "The author proposes testing whether van/vance and Mandarin wang/往 show a repeatable sound-semantic association around forward movement or direction. No sound change, historical correspondence, or common origin is asserted.",
    "作者提出检验 van／vance 与汉语 wang／往 是否围绕向前移动或方向形成可重复的声音—语义关联；此处不声称已证实音变、历史对应或共同词源。",
  ),
  evidence_refs: ["SRC-LB-ADVANCE"],
  confidence: "low",
  source_verification: verification(
    "needs-verification",
    ["SRC-LB-ADVANCE", "SRC-MW-ADVANCE", "SRC-CNRTL-AVANCER"],
    "The proposal is preserved, but the historical sources explain advance through avancer and *abantiare/abante and provide no evidence for a van/vance ↔ wang/往 relation. Comparative data and a preregistered test are required.",
    "该提议已保留，但历史来源把 advance 解释为经 avancer、*abantiare／abante 演变，并未提供 van／vance ↔ wang／往 的证据；仍需比较数据与预注册检验。",
  ),
  ai_review: notReviewed(),
});

dataset.experiments.push({
  experiment_id: "UNI-EXP-ADVANCE-001",
  title: localized("Future van/vance ↔ wang/往 validation", "未来 van／vance ↔ wang／往 验证"),
  status: "Untested",
  primary: false,
  metrics: {},
  source_refs: ["SRC-LB-ADVANCE"],
  identity: "experimental-plan",
  tested_condition: localized(
    "Not tested. A future preregistered design must define the phonetic comparison, semantic categories, sampling frame, controls, annotation and decision rule before data are inspected.",
    "尚未检验。未来必须先预注册语音比较、语义类别、抽样框、控制组、标注方法与判定规则，再查看数据。",
  ),
  result: localized(
    "Not Tested. No observations, metrics, outcomes or evidential update exist.",
    "Not Tested／尚未检验：没有观察数据、统计量、结果或证据更新。",
  ),
  hypothesis_refs: ["UNI-VANCE-WANG-001"],
  source_verification: verification(
    "not-applicable",
    ["SRC-LB-ADVANCE"],
    "This object records a future validation requirement, not an executed experiment.",
    "该对象只记录未来验证要求，不是已经执行的实验。",
  ),
  ai_review: notReviewed(),
});

dataset.entries.push({
  entry_id: "LB-en-advance-001",
  source_word: "advance",
  language: "English",
  normalized_form: "advance",
  pronunciation: "/ədˈvæns/",
  phonetic_form: "ədˈvæns",
  lexical_meaning: localized(
    "To move or bring something forward; to progress or promote development.",
    "向前移动、使某物向前推进，或取得进展、促进发展。",
  ),
  aliases: ["advancement", "avance", "avancer", "avancement", "往", "wǎng", "推进", "前进"],
  classification_status: "candidate",
  primary_chinese_mapping: {
    mapping_id: "MAP-advance-primary-wang",
    chinese_form: "往",
    pinyin: "wǎng",
    role: "primary",
    mapping_basis: "author-proposal",
    status: "candidate",
    identity: "author-idea",
    source_verification: verification(
      "needs-verification",
      ["SRC-LB-ADVANCE", "SRC-CAMBRIDGE-ADVANCE-ZH"],
      "This is the author's selected cross-language research mapping. Cambridge supports ordinary forward-motion translations, but does not establish 往 as a unique primary equivalent or historical relation.",
      "这是作者选择的跨语言研究 mapping。剑桥词典支持通常的向前运动译义，但不确立“往”为唯一主要对应，也不支持历史关系。",
    ),
    ai_review: notReviewed(),
  },
  secondary_chinese_mappings: [
    {
      mapping_id: "MAP-advance-secondary-tuijin",
      chinese_form: "推进",
      pinyin: "tuījìn",
      role: "secondary",
      mapping_basis: "lexical-equivalent",
      status: "published",
      identity: "source-backed-lexical-mapping",
      source_verification: verification(
        "source-backed",
        ["SRC-CAMBRIDGE-ADVANCE-ZH"],
        "Cambridge uses 推进 in a contextual forward-motion example and lists the broader forward/development senses.",
        "剑桥词典在向前运动的语境例句中使用“推进”，并列出相关的前进／发展义。",
      ),
      ai_review: notReviewed(),
    },
    {
      mapping_id: "MAP-advance-secondary-qianjin",
      chinese_form: "前进",
      pinyin: "qiánjìn",
      role: "secondary",
      mapping_basis: "lexical-equivalent",
      status: "published",
      identity: "source-backed-lexical-mapping",
      source_verification: verification(
        "source-backed",
        ["SRC-CAMBRIDGE-ADVANCE-ZH"],
        "Cambridge gives （使）前进 for the forward-motion verb sense.",
        "剑桥词典将向前运动的动词义译为“（使）前进”。",
      ),
      ai_review: notReviewed(),
    },
  ],
  mapping_rationales: [{
    rationale_id: "RAT-advance-wang",
    mapping_ref: "MAP-advance-primary-wang",
    identity: "author-idea",
    status: "candidate",
    statement: localized(
      "The proposed mapping compares a shared semantic structure: MOVE → FORWARD / TOWARD A DIRECTION. English advance foregrounds forward motion or progress; Chinese 往 profiles movement toward a destination or direction.",
      "该 mapping 比较共同语义结构：MOVE → FORWARD／TOWARD A DIRECTION。英语 advance 突出向前移动或进展，汉语“往”突出朝目的地或方向移动。",
    ),
    source_verification: verification(
      "needs-verification",
      ["SRC-LB-ADVANCE", "SRC-CAMBRIDGE-ADVANCE-ZH"],
      "The component meanings are documentable, but the decision to make 往 the primary research mapping is the author's analytical proposal.",
      "两个词的相关义项可以记录，但把“往”选作主要研究 mapping 是作者的分析提议。",
    ),
    ai_review: notReviewed(),
  }],
  historical_etymologies: [{
    etymology_id: "ETY-advance-001",
    identity: "historical-claim",
    status: "candidate",
    chain: ["English advance", "Middle English advauncen / avauncen", "Anglo-French avancer", "Vulgar Latin *abantiāre", "Latin abante (ab + ante: before / in front)"],
    summary: localized(
      "Reliable dictionaries trace advance through Middle English and Anglo-French avancer to Vulgar Latin *abantiāre, based on Latin abante. English advancement reflects Anglo-French avancement from avancer + -ment; French avance is deverbal from avancer, and French avancement is avancer + -ment. This source-backed morphology does not contain an independently established historical morpheme vance meaning '前的'.",
      "可靠词典把 advance 经中古英语、盎格鲁法语 avancer 追溯到通俗拉丁语 *abantiāre，其基础为拉丁语 abante。英语 advancement 反映盎格鲁法语 avancement（avancer + -ment）；法语 avance 是由 avancer 逆生的名词，avancement 为 avancer + -ment。该有来源的形态分析不含一个独立且已确立、意为“前的”的历史词素 vance。",
    ),
    source_verification: verification(
      "source-backed",
      ["SRC-MW-ADVANCE", "SRC-MW-ADVANCEMENT", "SRC-CNRTL-AVANCER", "SRC-CNRTL-AVANCE", "SRC-CNRTL-AVANCEMENT"],
      "The cited dictionary etymologies agree on the avancer → *abantiare/abante lineage and on the derivational status of avance/avancement. They do not support the author's ad.van.ce or ad.vance.ment segmentation as historical morphology.",
      "所引词典词源一致支持 avancer → *abantiare／abante 的谱系及 avance／avancement 的派生身份；它们不支持把作者的 ad.van.ce 或 ad.vance.ment 切分当作历史形态。",
    ),
    ai_review: notReviewed(),
  }],
  sound_symbol_hypothesis_refs: ["UNI-VANCE-WANG-001"],
  other_author_notes: [{
    note_id: "NOTE-advance-author-analysis",
    identity: "author-note",
    status: "classified",
    text: localized(
      "Author Analysis (preserved verbatim in substance): English advance [ədˈvæns], v., 推进; advancement, n., 推进; proposed segmentations ad.van.ce and ad.vance.ment. French avance / avancement; proposed observation vance, adjective, '前的'. Chinese 往 wǎng. These are author-supplied observations and segmentations, not automatically accepted historical morphology.",
      "Author Analysis／作者分析（实质原样保留）：English advance [ədˈvæns] v. 推进；advancement n. 推进；作者切分 ad.van.ce、ad.vance.ment；French avance／avancement，以及作者提出的 vance a. “前的”观察；Chinese 往 wǎng。这些是作者提供的观察与切分，不自动视为历史形态分析。",
    ),
    source_verification: verification(
      "disputed",
      ["SRC-LB-ADVANCE", "SRC-MW-ADVANCE", "SRC-MW-ADVANCEMENT", "SRC-CNRTL-AVANCE", "SRC-CNRTL-AVANCEMENT"],
      "The author record is authentic as an author analysis. Its proposed segmentation and vance gloss are not supported by the consulted historical dictionaries, which instead analyze the documented forms through avancer and -ment.",
      "该记录作为作者分析本身是真实的；但所提切分与 vance 释义未获已查历史词典支持，词典把相关形式分析为经 avancer 及后缀 -ment 构成。",
    ),
    ai_review: notReviewed(),
  }],
  experimental_validation_refs: ["UNI-EXP-ADVANCE-001"],
  source_provenance: ["SRC-LB-ADVANCE", "SRC-CAMBRIDGE-ADVANCE-ZH", "SRC-MW-ADVANCE", "SRC-MW-ADVANCEMENT", "SRC-CNRTL-AVANCER", "SRC-CNRTL-AVANCE", "SRC-CNRTL-AVANCEMENT"],
  author: dataset.author,
  version: "G.3 calibration v0.1 / dataset 0.5.0",
});

fs.writeFileSync(output, `${JSON.stringify(dataset, null, 2)}\n`);
console.log("Dataset v0.5.0 written · ADVANCE added as Candidate / Not Reviewed / Not Tested");
