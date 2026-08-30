import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previous = JSON.parse(fs.readFileSync(path.join(root, "data", "language-book.v0.3.json"), "utf8"));
const dataset = structuredClone(previous);
const localized = (en, zh) => ({ en, "zh-Hans": zh });
const markAiReviewPending = (item) => {
  item.ai_review = {
    status: "not-reviewed", reviewer: null, reviewed_at: null,
    rationale: localized("G.2 completed Source Verification only; object-level AI Review has not been executed.", "G.2 仅完成来源核验；尚未执行对象级 AI 审核。"),
  };
};

dataset.dataset_version = "0.4.0";
dataset.classification_model = {
  package: "G.2",
  version: "0.1",
  parent_package: "G.1 v0.1",
  principle: previous.classification_model.principle,
  review_rule: "Source Verification records what a source supports and does not support. AI Review remains an unsigned, object-level decision process; this migration does not perform it.",
};

const sourceRecord = (source_id, title, source_type, version, url, quality, supports, does_not_support) => ({
  source_id, title, source_type,
  path: "docs/product/package-g2-source-verification-v0.1.md",
  version, notes: "Package G.2 calibration source; support boundaries are explicit.",
  url, accessed_at: "2026-08-30", source_quality: quality, supports, does_not_support,
});

dataset.sources.push(
  sourceRecord("SRC-AHD-LANGUAGE", "American Heritage Dictionary · language", "authoritative-dictionary", "Fifth Edition / online", "https://www.ahdictionary.com/word/search.html?q=language", "authoritative-dictionary", ["English language derives through Middle English from Old French langage, from langue, from Latin lingua."], ["A historical relation between English language and Chinese 朗 or 语言."]),
  sourceRecord("SRC-MED-LANGAGE", "Middle English Dictionary · langage", "authoritative-dictionary", "online MED entry", "https://quod.lib.umich.edu/m/middle-english-dictionary/dictionary/MED24625", "authoritative-dictionary", ["Middle English langage is attested for language, speech and related senses."], ["Cross-language sound-symbolic mappings."]),
  sourceRecord("SRC-IPA-CHART", "International Phonetic Association · official IPA chart", "official-standard", "2020 chart / 2015 revision", "https://www.internationalphoneticassociation.org/content/ipa-chart", "official-standard", ["/w/ is a voiced labial-velar approximant; /f/ is a voiceless labiodental fricative paired with /v/; /h/ is a voiceless glottal fricative."], ["A general W↔F/H interchange or historical sound law."]),
  sourceRecord("SRC-CAMBRIDGE-COMPARATIVE", "Cambridge · Historical Linguistics / comparative method", "scholarly-source", "DOI 10.1017/9781108344326.020", "https://doi.org/10.1017/9781108344326.020", "scholarly-publication", ["Historical sound relationships require systematic correspondence patterns rather than isolated resemblance."], ["The specific water↔哗 comparison."]),
  sourceRecord("SRC-YALE-WADI-EL-HOL", "Darnell et al. · Two Early Alphabetic Inscriptions from Wadi el-Hol", "primary-historical-source", "2006 publication record", "https://nelc.yale.edu/publications/two-early-alphabetic-inscriptions-wadi-el-hol-new-evidence-origin-alphabet-western", "primary-publication", ["Early alphabetic signs in an Egyptian Middle Kingdom contact setting used acrophony from foreign sign names."], ["A proven enduring semantic value for modern Latin L."]),
  sourceRecord("SRC-ANTIQUITY-EARLY-ALPHABET", "Höflmayer et al. · Early alphabetic writing at Tel Lachish", "scholarly-source", "Antiquity 95 (2021)", "https://www.cambridge.org/core/journals/antiquity/article/early-alphabetic-writing-in-the-ancient-near-east-the-missing-link-from-tel-lachish/C73F769B7CF3A7E4E2607958A096B7D8", "scholarly-publication", ["Early alphabetic writing drew on Egyptian signs and later developed into Phoenician, from which Greek derived; chronology and some interpretations remain disputed."], ["A unique settled Egyptian pictorial source for L or a semantic law for L."]),
  sourceRecord("SRC-COLLESS-ALPHABET-L", "Colless · The Origin of the Alphabet: An Examination of the Goldwasser Hypothesis", "scholarly-source", "Antiguo Oriente 12 (2014), 71–104", "https://repositorio.uca.edu.ar/bitstream/123456789/6787/4/origin-alphabet-goldwasser-hypothesis.pdf", "scholarly-publication", ["A historical reconstruction connects L with Semitic lamd/lamed and Greek lambda; ox-goad is a proposed letter-name meaning."], ["Certainty about the exact Egyptian source sign; persistence of that meaning in modern English L words."]),
);

const language = dataset.entries.find((entry) => entry.normalized_form === "language");
const etymology = language.historical_etymologies.find((item) => item.etymology_id === "ETY-language-001");
etymology.chain = ["English language", "Middle English langage / language", "Old French langage", "Old French langue", "Latin lingua"];
etymology.summary = localized("Historical dictionaries trace English language through Middle English and Old French langage, from langue, ultimately Latin lingua (‘tongue; language’).", "历史词典将英语 language 追溯为：中古英语 langage／language，经古法语 langage、langue，最终来自拉丁语 lingua（“舌；语言”）。");
etymology.source_verification = {
  status: "source-backed", source_refs: ["SRC-AHD-LANGUAGE", "SRC-MED-LANGAGE"],
  notes: localized("The lexical-history chain is source-backed. These sources do not support the separate language↔朗 author mapping.", "该词汇史链已有来源支持；这些来源不支持独立的 language↔朗 作者映射。"),
};
markAiReviewPending(etymology);

const wf = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-W-FH-PHONETIC-001");
wf.source_refs = ["SRC-G1-CALIBRATION", "SRC-IPA-CHART", "SRC-CAMBRIDGE-COMPARATIVE"];
wf.evidence_refs = ["SRC-IPA-CHART", "SRC-CAMBRIDGE-COMPARATIVE"];
wf.source_verification = {
  status: "disputed", source_refs: wf.source_refs,
  notes: localized("As stated, W and F are not a voicing pair: IPA classifies /w/ as a voiced labial-velar approximant, /f/ as a voiceless labiodental fricative (paired with /v/), and /h/ as a voiceless glottal fricative. A historical W↔F/H correspondence would require language-specific, repeated comparative data.", "按当前表述，W 与 F 不是清浊音对：IPA 将 /w/ 列为有声唇软腭近音，将 /f/ 列为清唇齿擦音（其浊音对应为 /v/），将 /h/ 列为清声门擦音。若主张历史上的 W↔F/H 对应，必须提供特定语言、多个词项及年代链条的比较资料。"),
};
markAiReviewPending(wf);

const lSemantic = dataset.hypotheses.find((item) => item.hypothesis_id === "UNI-L-INHERENT-SEMANTIC-001");
lSemantic.hypothesis_type = "sound-semantic";
lSemantic.statement = localized("Research whether modern L or /l/ has a repeatable semantic association across words. Historical glyph evidence is context for a separate object and does not establish this hypothesis.", "研究现代字母 L 或 /l/ 音在多个词汇中是否存在可重复的语义关联。历史字形资料属于另一个对象的背景，不能证明本假说。");
lSemantic.source_refs = ["SRC-LB-LANGUAGE", "SRC-COLLESS-ALPHABET-L"];
lSemantic.evidence_refs = ["SRC-COLLESS-ALPHABET-L"];
lSemantic.source_verification = {
  status: "needs-verification", source_refs: lSemantic.source_refs,
  notes: localized("Writing-history evidence may support a historical letter name or proposed pictorial source, but it does not show that modern English /l/ or L carries that meaning across words. A separate operational semantic prediction and dataset are required.", "文字史资料可以支持历史字母名称或可能的图画来源，但不能证明现代英语 /l/ 音或字母 L 在不同词汇中持续携带该意义；仍需另行提出可操作的语义预测与数据集。"),
};
markAiReviewPending(lSemantic);

const lGlyph = {
  hypothesis_id: "UNI-L-GLYPH-HISTORY-001",
  label: localized("Historical glyph lineage associated with L / lamed / lambda", "L／lamed／lambda 相关字形谱系史"),
  status: "Untested", source_refs: ["SRC-YALE-WADI-EL-HOL", "SRC-ANTIQUITY-EARLY-ALPHABET", "SRC-COLLESS-ALPHABET-L"],
  hypothesis_type: "letter-symbol-history", identity: "author-hypothesis",
  statement: localized("Research the proposed path from early alphabetic signs in an Egyptian contact setting through Semitic lamed and Greek lambda to Latin L. The proposed pictorial source of lamed, often linked with an ox-goad or crook, remains a historical reconstruction—not a semantic law.", "研究在埃及接触环境中的早期字母符号，经闪米特 lamed、希腊 lambda 到拉丁 L 的提议路径。lamed 的图画来源常与赶牛杖或弯杖联系，但仍属于历史重建，不是语义法则。"),
  evidence_refs: ["SRC-YALE-WADI-EL-HOL", "SRC-ANTIQUITY-EARLY-ALPHABET", "SRC-COLLESS-ALPHABET-L"], confidence: "low",
  source_verification: {
    status: "disputed", source_refs: ["SRC-YALE-WADI-EL-HOL", "SRC-ANTIQUITY-EARLY-ALPHABET", "SRC-COLLESS-ALPHABET-L"],
    notes: localized("Sources support the Egyptian-contact context and later alphabetic transmission; the precise Egyptian sign proposed for L/lamed is not settled, and a scholarly comparison explicitly gives alternative candidates with a question mark.", "资料支持埃及接触背景及后续字母传播；L／lamed 所对应的具体埃及符号尚未定论，学术比较表明确以问号列出多个候选。"),
  },
  ai_review: { status: "not-reviewed", reviewer: null, reviewed_at: null, rationale: localized("Awaiting object-level G.2 AI review.", "等待 G.2 对象级 AI 审核。") },
};
dataset.hypotheses.push(lGlyph);
language.sound_symbol_hypothesis_refs = ["UNI-L-GLYPH-HISTORY-001", "UNI-L-INHERENT-SEMANTIC-001"];
language.version = `${language.version} / G.2 source verification`;

fs.writeFileSync(path.join(root, "data", "language-book.v0.4.json"), `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`G.2 source verification wrote dataset v${dataset.dataset_version} with ${dataset.sources.length} sources and ${dataset.hypotheses.length} hypotheses.`);
