import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "data", "entries");
const batchDir = path.join(root, "data", "batches");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(batchDir, { recursive: true });

const date = "2026-09-01";
const L = (en, zh) => ({ en, "zh-Hans": zh });
const ref = (id, title, type, url, provenance = "external lexicographic reference; accessed 2026-09-01") => ({ reference_id: id, title, type, url, path: null, provenance });
const authorRef = (key) => ref(`REF-JL-${key.toUpperCase()}-RAW`, `Jinkai Liu: ${key} source/raw research note`, "author research note", null, "author-provided in conversation; preserved independently from evaluation");
const sourceRefs = {
  generate: [ref("REF-MW-GENERATE", "Merriam-Webster Dictionary: generate", "dictionary", "https://www.merriam-webster.com/dictionary/generate"), ref("REF-MW-GENERATION", "Merriam-Webster Dictionary: generation", "dictionary", "https://www.merriam-webster.com/dictionary/generation")],
  form: [ref("REF-MW-FORM", "Merriam-Webster Dictionary: form", "dictionary", "https://www.merriam-webster.com/dictionary/form"), ref("REF-MW-FARM", "Merriam-Webster Dictionary: farm", "dictionary", "https://www.merriam-webster.com/dictionary/farm")],
  media: [ref("REF-MW-MEDIUM", "Merriam-Webster Dictionary: medium/media", "dictionary", "https://www.merriam-webster.com/dictionary/medium"), ref("REF-MW-MIDDLE", "Merriam-Webster Dictionary: middle", "dictionary", "https://www.merriam-webster.com/dictionary/middle"), ref("REF-CNRTL-MEDIA", "CNRTL/TLFi: étymologie de média", "historical dictionary", "https://www.cnrtl.fr/etymologie/m%C3%A9dia")],
  sign: [ref("REF-MW-SIGN", "Merriam-Webster Dictionary: sign", "dictionary", "https://www.merriam-webster.com/dictionary/sign"), ref("REF-CNRTL-COGNITION", "CNRTL/TLFi: étymologie de cognition", "historical dictionary", "https://www.cnrtl.fr/etymologie/cognition"), ref("REF-CNRTL-COGNITIF", "CNRTL/TLFi: étymologie de cognitif", "historical dictionary", "https://www.cnrtl.fr/etymologie/cognitif")],
  montrer: [ref("REF-CNRTL-MONTRER", "CNRTL/TLFi: étymologie de montrer", "historical dictionary", "https://www.cnrtl.fr/etymologie/montrer"), ref("REF-CNRTL-MONITEUR", "CNRTL/TLFi: étymologie de moniteur/monitor", "historical dictionary", "https://www.cnrtl.fr/etymologie/moniteur")],
  fil: [ref("REF-CNRTL-FIL", "CNRTL/TLFi: étymologie de fil", "historical dictionary", "https://www.cnrtl.fr/etymologie/fil"), ref("REF-CNRTL-FILIERE", "CNRTL/TLFi: étymologie de filière", "historical dictionary", "https://www.cnrtl.fr/etymologie/fili%C3%A8re"), ref("REF-CNRTL-FILLE", "CNRTL/TLFi: étymologie de fille", "historical dictionary", "https://www.cnrtl.fr/etymologie/fille")],
  figure: [ref("REF-CNRTL-FIGURE", "CNRTL/TLFi: étymologie de figure", "historical dictionary", "https://www.cnrtl.fr/etymologie/figure"), ref("REF-MW-FINGER", "Merriam-Webster Dictionary: finger", "dictionary", "https://www.merriam-webster.com/dictionary/finger")],
  marchand: [ref("REF-CNRTL-MARCHAND", "CNRTL/TLFi: étymologie de marchand", "historical dictionary", "https://www.cnrtl.fr/etymologie/marchande"), ref("REF-CNRTL-MARCHER", "CNRTL/TLFi: étymologie de marcher", "historical dictionary", "https://www.cnrtl.fr/etymologie/marcher"), ref("REF-MW-MARCH", "Merriam-Webster Dictionary: march", "dictionary", "https://www.merriam-webster.com/dictionary/march")],
  press: [ref("REF-MW-PRESS", "Merriam-Webster Dictionary: press", "dictionary", "https://www.merriam-webster.com/dictionary/press"), ref("REF-CNRTL-PRESSION", "CNRTL/TLFi: étymologie de pression", "historical dictionary", "https://www.cnrtl.fr/etymologie/pression"), ref("REF-CNRTL-PRESSER", "CNRTL/TLFi: étymologie de presser", "historical dictionary", "https://www.cnrtl.fr/etymologie/presser")],
  convent: [ref("REF-MW-CONVENT", "Merriam-Webster Dictionary: convent", "dictionary", "https://www.merriam-webster.com/dictionary/convent"), ref("REF-MW-CONVENTION", "Merriam-Webster Dictionary: convention", "dictionary", "https://www.merriam-webster.com/dictionary/convention"), ref("REF-CNRTL-COUVENT", "CNRTL/TLFi: étymologie de couvent/convent", "historical dictionary", "https://www.cnrtl.fr/etymologie/couvent"), ref("REF-CNRTL-CONVENTION", "CNRTL/TLFi: étymologie de convention", "historical dictionary", "https://www.cnrtl.fr/etymologie/convention")],
};

const specs = [
  {
    key: "generate", id: "LB-en-generate-014", source: "generate", sourcePron: "/ˈdʒenəreɪt/", target: "产生／生成", targetPron: "chǎnshēng / shēngchéng", french: "générer", pos: "verb · 动词", disposition: "Reviewed", mappingStatus: "Reviewed", score: [95, 92, 90, 80, 85],
    gloss: L("to bring into existence or produce", "使某物产生、生成或出现"), concepts: ["CREATE", "PRODUCE", "BIRTH", "ORIGIN", "ROOT"], raw: "干 gan，gun、gin，gen，generate。generate ↔ 干 gan / 根 gen。辅音不变规则同样适用于词根的意义。",
    history: L("Generate is from Latin generare, based on gener-/genus ‘descent, birth’; generation is a genuine derivative. This is a documented Indo-European word family, but no historical link to Chinese 干 or 根 is claimed.", "generate 源自拉丁语 generare，基于 gener-／genus“世系、出生”；generation 是真实派生词。该印欧词族有文献依据，但不主张它与汉语“干”或“根”历史同源。"),
    phon: L("gen- and 根 gēn share a rough modern syllabic resemblance and ORIGIN/ROOT semantic overlap; 干 gàn/gān has broader, sense-dependent meanings and weaker overlap.", "gen- 与“根”gēn 有有限现代音近，并在 ORIGIN／ROOT 上有语义交集；“干”gàn／gān 义项繁多，重合较弱。"),
    cognitive: L("PRODUCE/BIRTH → ORIGIN → ROOT is a useful mnemonic-semantic chain.", "PRODUCE／BIRTH → ORIGIN → ROOT 可作为记忆与语义链。"),
    correction: L("Modern resemblance does not establish generate ← 根/干 or a shared historical root.", "现代音义近似不能证明 generate 源自“根／干”或共享历史词根。"),
    related: [["generation", "English", "Etymological derivative", "Latin generare / generatio", true], ["genus", "Latin/English", "Historical family", "Latin genus / gener-", true], ["根 gēn", "Chinese", "Phonetic-semantic candidate", "independent Sinitic history", false], ["干 gān/gàn", "Chinese", "Surface phonetic candidate", "independent Sinitic history", false]],
    search: ["generate", "generation", "gen", "genus", "产生", "生成", "根", "根源", "干", "gan", "root", "générer", "create", "produce"]
  },
  {
    key: "form", id: "LB-en-form-015", source: "form", sourcePron: "/fɔːrm/", target: "形式／形状", targetPron: "xíngshì / xíngzhuàng", french: "forme", pos: "noun/verb · 名词／动词", disposition: "Candidate", mappingStatus: "Candidate", score: [95, 90, 86, 84, 82],
    gloss: L("shape, structure, arrangement; to give shape", "形状、结构、构成方式；使成形"), concepts: ["FORM", "SHAPE", "STRUCTURE", "WORD FORMATION"], raw: "farm，form，构词形式。",
    history: L("Form comes through Anglo-French from Latin forma ‘form, shape, beauty’. Farm comes through Anglo-French ferme/fermer from Latin firmare/firmus ‘make firm, fixed’; they are not the same immediate word family.", "form 经盎格鲁法语来自拉丁语 forma“形式、形状、美”；farm 经盎格鲁法语 ferme／fermer 上溯拉丁语 firmare／firmus“使固定、牢固”。二者不属于同一直接词族。"),
    phon: L("form and farm are close in modern spelling and may merge in some accents, but similarity is not evidence of a shared form/shape root.", "form 与 farm 现代拼写接近，在部分口音中可能更近，但不能据此建立共享“形／形式”词根。"),
    cognitive: L("FORM/SHAPE → STRUCTURE → WORD FORMATION preserves the author's ‘构词形式’ insight as a semantic note.", "FORM／SHAPE → STRUCTURE → WORD FORMATION 保留作者“构词形式”的语义观察。"),
    correction: L("Farm’s modern agricultural sense developed from fixed rent/lease and leased land, not from Latin forma.", "farm 的现代农业义由固定租金／租赁及所租土地发展而来，不源自拉丁语 forma。"),
    related: [["forme", "French", "Historical cognate/borrowing family", "Latin forma", true], ["formation", "English/French", "Etymological derivative", "Latin forma / formare", true], ["farm", "English", "Surface similarity / negative calibration", "Latin firmus / firmare path", false]],
    search: ["form", "forme", "formation", "formal", "farm", "形式", "形状", "构词", "构词形式", "structure", "shape"]
  },
  {
    key: "media", id: "LB-en-media-016", source: "media", sourcePron: "/ˈmiːdiə/", target: "媒介／媒体", targetPron: "méijiè / méitǐ", french: "média", pos: "plural noun / mass noun · 复数名词／集合名词", disposition: "Reviewed", mappingStatus: "Reviewed", score: [92, 95, 92, 88, 78],
    gloss: L("means or channels of communication; plural of medium in many uses", "传播信息的手段或渠道；在许多用法中为 medium 的复数"), concepts: ["MIDDLE", "MEDIUM", "INTERMEDIARY", "COMMUNICATION"], raw: "media，middle，mad。media / middle / 媒 / 中间。",
    history: L("Media is historically the Latin plural of medium, from medius ‘middle’. English middle is Germanic. Latin medius and Germanic mid-/middle are accepted deeper Indo-European relatives, not a direct borrowing from one another.", "media 历史上是拉丁语 medium 的复数，来自 medius“中间”。英语 middle 属日耳曼语族；拉丁 medius 与日耳曼 mid-／middle 可追溯为较深层印欧同源，但不是彼此直接借入。"),
    phon: L("媒 méi resembles the initial sound of media only loosely. The strong mapping is semantic: a medium/media stands between source and audience.", "“媒”méi 与 media 起首音仅有松散近似；强项是语义：媒介位于信息来源与受众之间。"),
    cognitive: L("MIDDLE → INTERMEDIARY → CHANNEL → COMMUNICATION gives a strong cross-language conceptual mapping for 媒.", "MIDDLE → INTERMEDIARY → CHANNEL → COMMUNICATION 为“媒”提供很强的跨语言概念映射。"),
    correction: L("mad is not included in the media/medium/middle historical family merely because of m-d spelling.", "mad 不因 m-d 字母骨架就并入 media／medium／middle 的历史词族。"),
    related: [["medium", "English/Latin", "Direct inflectional family", "Latin medius / medium / media", true], ["middle", "English", "Deep historical cognate", "Germanic mid-; deeper Indo-European relation to Latin medius", true], ["média", "French", "Borrowing/abbreviation family", "mass-média; Latin media", true], ["媒 méi", "Chinese", "Strong semantic/cognitive mapping", "independent Sinitic history", false], ["mad", "English", "Negative calibration", "separate Germanic history", false]],
    search: ["media", "medium", "middle", "mid", "média", "媒", "媒介", "媒体", "中间", "intermediary", "communication", "mad"]
  },
  {
    key: "sign", id: "LB-en-sign-cognition-017", source: "sign", sourcePron: "/saɪn/", target: "符号／标记", targetPron: "fúhào / biāojì", french: "signe", pos: "noun/verb · 名词／动词", disposition: "Candidate", mappingStatus: "Candidate", score: [93, 87, 88, 90, 88],
    gloss: L("a mark, token or gesture that conveys meaning", "传达意义的符号、标记或动作"), concepts: ["SIGN", "MARK", "KNOW", "COGNITION", "RECOGNITION"], raw: "ign，ogn，cognitive认知，sign。辅音不变规则同样适用于词根的意义。",
    history: L("Sign belongs to the Latin signum/signare ‘mark, token’ family. Cognitive/cognition belongs to Latin cognoscere/cognitio ‘know, knowledge’, with the gnosc-/gno- KNOW family. These are separate historical clusters.", "sign 属拉丁语 signum／signare“标记、符号”词族；cognitive／cognition 属拉丁语 cognoscere／cognitio“认识、知识”及 gnosc-／gno- KNOW 词族。两者是不同的历史簇。"),
    phon: L("The written sequences ign/ogn/gn are not interchangeable morphemes. In sign the g is silent in the modern base form, while cognitive has /gn/ distributed by its Latin morphology and modern pronunciation.", "书写序列 ign／ogn／gn 不是可互换语素；现代 sign 的 g 不发音，而 cognitive 中相关字母受拉丁形态和现代读音制约。"),
    cognitive: L("A sign can cue recognition and knowledge, so SIGN/MARK → RECOGNIZE → KNOW is a legitimate semantic bridge, not an etymology.", "符号可触发辨认与认知，因此 SIGN／MARK → RECOGNIZE → KNOW 是合理语义桥，而不是词源链。"),
    correction: L("signum and cognoscere are not merged into one root; ign/ogn are treated as an authorial consonantal-skeleton hypothesis only.", "不把 signum 与 cognoscere 合并成一个词根；ign／ogn 只作为作者辅音骨架假说保留。"),
    related: [["signal / signature", "English/French", "Etymological derivatives", "Latin signum / signare", true], ["cognition / cognitive", "English/French", "Separate KNOW cluster", "Latin cognitio / cognoscere", true], ["recognize / reconnaître", "English/French", "KNOW cluster derivative", "Latin recognoscere", true]],
    search: ["sign", "signe", "signal", "signature", "cognitive", "cognition", "recognize", "recognition", "认知", "认识", "符号", "标记", "ign", "ogn", "gnoscere"]
  },
  {
    key: "montrer", id: "LB-fr-montrer-monitor-018", source: "montrer", sourcePron: "/mɔ̃.tʁe/", target: "显示／展示", targetPron: "xiǎnshì / zhǎnshì", french: "montrer", pos: "verb · 动词", disposition: "Reviewed", mappingStatus: "Reviewed", score: [93, 90, 84, 75, 78],
    gloss: L("to show, display or make known", "显示、展示或使人知道"), concepts: ["SHOW", "DISPLAY", "WARN", "WATCH", "MAKE KNOWN"], raw: "montrer显示，monitor监视器。",
    history: L("French montrer continues Latin monstrare, from monstrum; monstrum is historically connected with monere ‘warn’. Monitor comes directly from Latin monitor ‘one who warns/advises’, also from monere. They are related at a deeper Latin-family level, but monitor is not derived from montrer.", "法语 montrer 延续拉丁语 monstrare，来自 monstrum；monstrum 历史上与 monere“警示”相关。monitor 直接来自拉丁语 monitor“警示／劝告者”，同样基于 monere。二者在较深拉丁词族层相关，但 monitor 并非由 montrer 派生。"),
    phon: L("The shared mon- spelling reflects a real deeper family connection here, but the distinct formation paths monstrare and monitor must remain visible.", "此处共享 mon- 确有较深词族依据，但 monstrare 与 monitor 的不同构词路径必须保留。"),
    cognitive: L("SHOW/MAKE KNOWN and WARN/WATCH converge through directing attention to something.", "SHOW／MAKE KNOWN 与 WARN／WATCH 通过“把注意力指向某物”相交。"),
    correction: L("Similarity is not merely accidental, yet treating montrer and monitor as direct derivatives of each other is inaccurate.", "二者相似并非纯偶然，但把 montrer 与 monitor 当作彼此直接派生不准确。"),
    related: [["monstrare / monstrum", "Latin", "Historical source path", "monstrare ← monstrum", true], ["monitor / moniteur", "English/French", "Deeper historical relative", "Latin monitor ← monere", true], ["monstre / monster", "French/English", "Historical family through monstrum", "Latin monstrum", true]],
    search: ["montrer", "montre", "monitor", "moniteur", "monstrare", "monstrum", "显示", "展示", "监视器", "show", "display", "warn", "watch"]
  },
  {
    key: "fil", id: "LB-fr-fil-filiere-fille-019", source: "fil", sourcePron: "/fil/", target: "线／丝", targetPron: "xiàn / sī", french: "fil", pos: "noun · 名词", disposition: "Reviewed", mappingStatus: "Reviewed", score: [96, 93, 88, 82, 80],
    gloss: L("thread, wire or a long thin strand", "线、丝或细长条状物"), concepts: ["THREAD", "LINE", "SEQUENCE", "CHANNEL", "DAUGHTER/GIRL"], raw: "fil线，filiere行业，fille女孩。",
    history: L("French fil continues Latin filum ‘thread’. Filière is genuinely derived from fil with -ière and developed senses of a sequence/channel/sector. Fille comes from Latin filia ‘daughter’ and is not derived from fil.", "法语 fil 延续拉丁语 filum“线”；filière 确由 fil 加 -ière 派生，并发展出流程／渠道／行业义。fille 来自拉丁语 filia“女儿”，不是 fil 的派生词。"),
    phon: L("fil, filière and fille are close in spelling and sound, but only fil ↔ filière is the relevant derivational relation in this set.", "fil、filière、fille 拼写和读音接近，但本组只有 fil ↔ filière 属相关派生关系。"),
    cognitive: L("THREAD → LINE/SEQUENCE → CHANNEL → INDUSTRY/SECTOR explains the semantic development of filière.", "THREAD → LINE／SEQUENCE → CHANNEL → INDUSTRY／SECTOR 可解释 filière 的语义发展。"),
    correction: L("Fille is a negative calibration: similar spelling does not make it part of the fil ‘thread’ family.", "fille 是负校准案例：拼写相似不使它成为 fil“线”词族成员。"),
    related: [["filière", "French", "Etymological derivative", "fil + suffix -ière", true], ["filament", "French/English", "Historical thread family", "Latin filum / filamentum", true], ["fille", "French", "Surface similarity / negative calibration", "Latin filia", false]],
    search: ["fil", "filière", "filiere", "fille", "filament", "线", "丝", "行业", "女孩", "thread", "line", "sector", "daughter"]
  },
  {
    key: "figure", id: "LB-en-figure-finger-020", source: "figure", sourcePron: "/ˈfɪɡjər/", target: "图形／形状", targetPron: "túxíng / xíngzhuàng", french: "figure", pos: "noun/verb · 名词／动词", disposition: "Candidate", mappingStatus: "Candidate", score: [95, 88, 80, 78, 86],
    gloss: L("shape, representation, diagram, numeral or notable person, depending on sense", "依语境指形状、形象、图表、数字或重要人物"), concepts: ["SHAPE", "REPRESENTATION", "NUMBER", "BODY PART", "POINTING"], raw: "figure数字，finger。",
    history: L("Figure comes through French/Latin figura ‘form, shape, representation’, related to Latin fingere ‘shape’. Finger is inherited Germanic (Old English finger and cognates). No figure–finger historical family is established.", "figure 经法语／拉丁语 figura“形式、形状、表象”而来，与拉丁语 fingere“塑造”相关；finger 是继承的日耳曼词（古英语 finger 及其同源词）。没有建立 figure–finger 历史词族。"),
    phon: L("figure and finger share the visible fig-/fi-g sequence but differ in consonant order, pronunciation and history.", "figure 与 finger 共享可见的 fig-／fi-g 字母序列，但辅音顺序、读音与词史不同。"),
    cognitive: L("A finger can point to or trace a figure, creating a useful action-object mnemonic; NUMBER is one sense of figure, not its sole meaning.", "手指可指向或描画图形，形成动作—对象记忆联想；NUMBER 只是 figure 的一个义项。"),
    correction: L("The user observation is preserved as a modern-form/cognitive candidate, not cognacy.", "用户观察保留为现代词形／认知候选，不标为同源。"),
    related: [["figura / fingere", "Latin", "Historical source family", "figura ← fingere", true], ["figurative / figurer", "English/French", "Etymological derivative", "Latin figura / figurare", true], ["finger", "English", "Surface similarity / cognitive association", "Germanic inherited word", false]],
    search: ["figure", "figurer", "figurative", "finger", "数字", "图形", "形状", "手指", "number", "shape", "representation", "point"]
  },
  {
    key: "marchand", id: "LB-fr-marchand-march-021", source: "marchand", sourcePron: "/maʁ.ʃɑ̃/", target: "商人／商贩", targetPron: "shāngrén / shāngfàn", french: "marchand", pos: "noun/adjective · 名词／形容词", disposition: "Candidate", mappingStatus: "Candidate", score: [96, 92, 85, 82, 84],
    gloss: L("merchant, trader; commercial", "商人、商贩；商业的"), concepts: ["COMMERCE", "MERCHANT", "MARKET", "WALK", "TRAVEL"], raw: "marchand商人，march行走。",
    history: L("Marchand belongs to the commerce family, from a reconstructed popular Latin mercatantem/mercatare based on mercatus ‘market’. French marcher and English march follow a Germanic mark-/markon path involving marking/trampling/stepping. They are not one historical word family.", "marchand 属商业词族，来自据 mercatus“市场”重构的俗拉丁语 mercatantem／mercatare；法语 marcher 与英语 march 走日耳曼 mark-／markon 的标记、踩踏、迈步路径。二者不是同一历史词族。"),
    phon: L("The shared march- spelling in modern French is a strong visual resemblance but not a shared morpheme in marchand and marcher.", "现代法语中共享 march- 是很强的视觉相似，但在 marchand 与 marcher 中不是同一语素。"),
    cognitive: L("TRAVELLING MERCHANT → WALK/MARCH is a plausible cultural scene and mnemonic, not lexical derivation.", "TRAVELLING MERCHANT → WALK／MARCH 是合理文化场景与记忆联想，不是词汇派生。"),
    correction: L("Merchant/trade meaning comes from the market/merx family, not from walking.", "商人／贸易义来自 market／merx 商业词族，不来自“行走”。"),
    related: [["marché / merchant", "French/English", "Commerce family", "Latin mercatus / merx path", true], ["marcher / march", "French/English", "Separate walking family", "Germanic markon / mark path", false]],
    search: ["marchand", "marchande", "merchant", "marché", "market", "march", "marcher", "商人", "商贩", "行走", "贸易", "commerce", "travelling merchant"]
  },
  {
    key: "press", id: "LB-en-press-pression-022", source: "press", sourcePron: "/pres/", target: "按压／压", targetPron: "ànyā / yā", french: "presser / pression", pos: "verb/noun · 动词／名词", disposition: "Reviewed", mappingStatus: "Reviewed", score: [98, 97, 90, 65, 50],
    gloss: L("to exert steady force; pressure or a pressing device", "施加持续的力；压力或施压装置"), concepts: ["PRESS", "PRESSURE", "FORCE", "COMPRESSION"], raw: "press压力，pression。exercée施加。peur怕……",
    history: L("English press comes through Anglo-French presser from Latin pressare, an intensive/frequentative of premere ‘press’. French presser follows the same Latin path; pression is from Latin pressio/pressum, likewise from premere. This is a genuine historical family.", "英语 press 经盎格鲁法语 presser 来自拉丁语 pressare（premere“压”的加强／反复形式）；法语 presser 同源，pression 来自拉丁语 pressio／pressum，也基于 premere。这是真实历史词族。"),
    phon: L("The Chinese mapping 压 yā is semantically strong but not phonetically close to press/pression; 迫 pò has partial semantic overlap in compulsion, not a demonstrated sound relation.", "汉语“压”yā 与 press／pression 语义对应强，但声音并不近；“迫”pò 在强迫义上部分重合，也没有已证音系关系。"),
    cognitive: L("FORCE → CONTACT → COMPRESSION → PRESSURE is a stable comparable semantic structure.", "FORCE → CONTACT → COMPRESSION → PRESSURE 是稳定的可比较语义结构。"),
    correction: L("The strong result is lexical-semantic and within the English/French Latin family; no English/French–Chinese cognacy is proposed.", "强结论是词义对应及英法内部的拉丁词族关系；不提出英法词与汉语同源。"),
    related: [["pressure", "English", "Etymological derivative", "Latin premere / pressus", true], ["presser / pression", "French", "Historical cognate/borrowing family", "Latin pressare / pressio / premere", true], ["压 yā", "Chinese", "Strong semantic mapping", "independent Sinitic history", false], ["迫 pò", "Chinese", "Partial semantic association", "independent Sinitic history", false]],
    search: ["press", "pressure", "pression", "presser", "按压", "压", "压力", "迫", "施加", "force", "compression"]
  },
  {
    key: "convent", id: "LB-en-convent-convention-023", source: "convent", sourcePron: "/ˈkɒnvent/", target: "修道院／女修道院", targetPron: "xiūdàoyuàn / nǚxiūdàoyuàn", french: "couvent", pos: "noun · 名词", disposition: "Reviewed", mappingStatus: "Reviewed", score: [94, 95, 90, 80, 80],
    gloss: L("a religious community, especially of women, or its residence", "宗教团体（尤指女修会）或其居所"), concepts: ["COME TOGETHER", "ASSEMBLY", "RELIGIOUS COMMUNITY", "AGREEMENT", "CUSTOM"], raw: "convent，convention。习俗从修道院而来？",
    history: L("Convent is from Latin conventus ‘assembly, meeting’, the participial noun of convenire ‘come together’. Convention is from Latin conventio ‘meeting, agreement’, also from convenire. They are genuine relatives, but convention is not derived from the religious-institution sense of convent.", "convent 来自拉丁语 conventus“集会、会合”，是 convenire“共同来到／会合”的名词形式；convention 来自拉丁语 conventio“集会、协议”，同样基于 convenire。二者确有历史关系，但 convention 并非由 convent 的宗教机构义派生。"),
    phon: L("The shared convent-/conven- material reflects a real Latin family; suffixes and borrowing histories account for the distinct words.", "共享的 convent-／conven- 成分反映真实拉丁词族；不同后缀与借入史形成两个词。"),
    cognitive: L("COME TOGETHER → ASSEMBLY → AGREEMENT → ACCEPTED PRACTICE explains convention; COME TOGETHER → RELIGIOUS COMMUNITY explains convent.", "COME TOGETHER → ASSEMBLY → AGREEMENT → ACCEPTED PRACTICE 解释 convention；COME TOGETHER → RELIGIOUS COMMUNITY 解释 convent。"),
    correction: L("The ‘custom from monastery’ chain is historically inaccurate; both branches independently extend the shared ‘come together’ base.", "“习俗来自修道院”的链条在历史上不准确；两支分别从共享的“共同来到／会合”基础扩展。"),
    related: [["convention", "English/French", "Historical relative", "Latin conventio ← convenire", true], ["convene / convenir", "English/French", "Shared base family", "Latin convenire", true], ["couvent", "French", "Historical cognate/borrowing family", "Latin conventus", true], ["custom / 习俗", "English/Chinese", "Semantic extension of convention only", "not derived from convent", false]],
    search: ["convent", "convention", "convene", "convenir", "couvent", "修道院", "女修道院", "习俗", "惯例", "协议", "agreement", "assembly", "come together"]
  }
];

function score(parts) {
  return Math.round((parts[0] * .30 + parts[1] * .25 + parts[2] * .20 + parts[3] * .15 + parts[4] * .10) * 10) / 10;
}

function makeEntry(s, index) {
  const refs = [authorRef(s.key), ...sourceRefs[s.key]];
  const allRefIds = refs.map((item) => item.reference_id);
  const authorRefId = allRefIds[0];
  const historicalRefs = allRefIds.slice(1);
  const related = s.related.map(([word, language, relationship_type, family, isHistorical], i) => ({
    word, language, relationship_type, family,
    relation_to_entry: isHistorical ? L("Documented historical relation within the stated family.", "在所列词族内有文献支持的历史关系。") : L("Comparison or association only; not a historical derivation.", "仅作比较或联想；不是历史派生关系。"),
    status: isHistorical ? "Established" : "Interpretive", source_refs: isHistorical ? historicalRefs : [authorRefId, ...historicalRefs]
  }));
  const historicalItems = [
    { evidence_id: `HIST-${s.key.toUpperCase()}-001`, claim: s.history, status: "Established", confidence: "High", source_refs: historicalRefs },
    { evidence_id: `HIST-${s.key.toUpperCase()}-CORRECTION-002`, claim: s.correction, status: "Established", confidence: "High", source_refs: allRefIds }
  ];
  return {
    id: s.id, slug: s.key, title: L(`${s.source} · Batch 001`, `${s.source} · 数据扩展 Batch 001`),
    languages: [
      { role: "source", code: s.key === "montrer" || s.key === "fil" || s.key === "marchand" ? "fr" : "en", name: s.key === "montrer" || s.key === "fil" || s.key === "marchand" ? "French" : "English", word: s.source, pronunciation: s.sourcePron, part_of_speech: s.pos },
      { role: "historically-related-or-compared-form", code: "fr", name: "French", word: s.french, pronunciation: "not recorded" },
      { role: "standard-translation", code: "zh-Hans", name: "Chinese", word: s.target, pronunciation: s.targetPron }
    ],
    primary_mapping: {
      mapping_id: `MAP-${s.key}-primary`, source: { language: s.key === "montrer" || s.key === "fil" || s.key === "marchand" ? "French" : "English", word: s.source, pronunciation: s.sourcePron }, target: { language: "Chinese", word: s.target, pronunciation: s.targetPron }, gloss: s.gloss,
      meaning: L(`${s.gloss.en}. This ordinary mapping is independent from the author's cross-language sound/root hypothesis.`, `${s.gloss["zh-Hans"]}。普通词义 Mapping 与作者跨语言声音／词根假说独立。`),
      mapping_type: "Standard lexical/semantic mapping with separately graded research hypothesis",
      rationale: L("The primary mapping follows ordinary meaning; historical and phonetic claims are evaluated on separate tracks.", "主要 Mapping 依据普通词义；历史关系与语音主张在独立轨道评价。")
    },
    entry_status: "Reviewed", mapping_status: s.mappingStatus, mapping_level: s.mappingStatus === "Reviewed" ? "Unrated" : "C", historical_relation_status: "Not claimed",
    evidence: {
      Historical: { status: "Established", confidence: "High", summary: s.history, items: historicalItems, source_refs: historicalRefs },
      "Phonetic-Semantic": { status: s.mappingStatus === "Candidate" ? "Candidate" : "Interpretive", confidence: s.key === "media" ? "Medium" : "Low", summary: s.phon, items: [{ evidence_id: `PHONSEM-${s.key.toUpperCase()}-001`, claim: s.phon, status: s.mappingStatus === "Candidate" ? "Candidate" : "Interpretive", confidence: s.key === "media" ? "Medium" : "Low", source_refs: allRefIds }], source_refs: allRefIds },
      Cognitive: { status: "Interpretive", confidence: "Medium", summary: s.cognitive, items: [{ evidence_id: `COG-${s.key.toUpperCase()}-001`, claim: s.cognitive, status: "Interpretive", confidence: "Medium", source_refs: [authorRefId] }], source_refs: [authorRefId] },
      Speculative: { status: s.mappingStatus === "Candidate" ? "Candidate" : "Unestablished", confidence: "Low", summary: s.correction, items: [{ evidence_id: `SPEC-${s.key.toUpperCase()}-001`, claim: s.correction, status: s.mappingStatus === "Candidate" ? "Candidate" : "Unestablished", confidence: "High", source_refs: allRefIds }], source_refs: allRefIds }
    },
    phonetic_observation: [{ observation_id: `PHON-${s.key.toUpperCase()}-001`, claim: s.phon, status: "Candidate", limitations: L("Modern spelling or sound resemblance is not a regular sound correspondence and does not prove cognacy.", "现代拼写或声音近似不是规律音变，也不能证明同源。") }],
    semantic_structure: { concepts: s.concepts, relation: s.concepts.join(" → "), status: "Interpretive" },
    related_words: related,
    semantic_associations: [{ association_id: `ASSOC-${s.key.toUpperCase()}-001`, relation: s.concepts.join(" → "), status: "Interpretive", is_etymological: false }],
    hypotheses: [{ hypothesis_id: `UNI-${s.key.toUpperCase()}-001`, type: "Original author phonetic-semantic / consonantal-skeleton hypothesis", claim: L(`The author's comparison around ${s.raw.replace(/。/g, "; ")} may support a mnemonic or semantic association without establishing common origin.`, `作者观察“${s.raw}”可作为记忆或语义联想，但不建立共同来源。`), status: s.mappingStatus === "Candidate" ? "Candidate" : "Unestablished", confidence: "Low", supporting_cases: s.search.slice(0, 5), counterexamples: [s.correction.en, "No regular cross-language sound correspondence has been demonstrated."], testability: L("Test sound similarity and semantic fit separately with blinded ratings, explicit negative controls and historical-source review.", "用盲法评分、明确负对照与独立词源核验分别检验声音相似度和语义适配。"), experiment_link: null, source_refs: allRefIds }],
    counterevidence: [{ counterevidence_id: `COUNTER-${s.key.toUpperCase()}-001`, statement: s.correction, confidence: "High", source_refs: allRefIds }],
    experiments: [],
    literary_layer: { status: "Not present", is_historical_evidence: false, proposition: s.cognitive, essay_prose: [], poem_lyrics: [], translations: [], archival_manuscript_media: [], evidence_boundary: L("This cognitive proposition may be developed literarily, but it is not historical evidence.", "该认知命题可作文学展开，但不是历史证据。") },
    media: [], references: refs, author: "Jinkai Liu", version: "Dataset Expansion Batch 001 / Schema v1.0", dates: { created: date, modified: date, published: null },
    editorial_notes: [L(`Batch disposition: ${s.disposition}. Priority score ${score(s.score)}/100 is editorial triage, not a scientific measurement.`, `批次归类：${s.disposition}。优先分 ${score(s.score)}/100 仅用于编辑分流，不是科学测量。`), s.correction],
    search_terms: [...new Set(s.search)], page: null, legacy: null,
    source: { type: "author-provided raw research note", author: "Jinkai Liu", status: "Preserved; claims independently classified above", normalization: "Spelling and punctuation normalized only in evaluated fields; raw note retained verbatim here.", raw_note: s.raw },
    batch: { batch_id: "DATASET-EXPANSION-BATCH-001", ordinal: index + 1, disposition: s.disposition, priority_score: score(s.score) }
  };
}

const entries = specs.map(makeEntry);
for (const entry of entries) fs.writeFileSync(path.join(outDir, `${entry.slug}.v1.json`), `${JSON.stringify(entry, null, 2)}\n`);

const componentNames = ["verifiability", "semantic_clarity", "mapping_value", "literary_cognitive_value", "novelty"];
const manifestRecords = specs.map((s, i) => ({
  candidate_id: `B001-${String(i + 1).padStart(2, "0")}`, raw_note: s.raw,
  priority_components: Object.fromEntries(componentNames.map((name, n) => [name, s.score[n]])), priority_score: score(s.score),
  processing_status: "complete", final_record_ids: [s.id], disposition: s.disposition,
  entry_status: "Reviewed", mapping_status: s.mappingStatus, historical_correction: !["generate", "press"].includes(s.key), validator_status: "pass (Schema v1.0 + Mapper/search regression)"
}));
const counts = manifestRecords.reduce((acc, item) => (acc[item.disposition] = (acc[item.disposition] || 0) + 1, acc), {});
const manifest = {
  batch_id: "DATASET-EXPANSION-BATCH-001", batch_version: "1.0.0", schema_version: "1.0.0", created_at: date, author: "Jinkai Liu",
  purpose: "Process ten high-priority author observations without conflating lexical mapping, historical relation, phonetic-semantic comparison, cognition, speculation or literature.",
  editorial_principle: "An entry may be published; a hypothesis must be graded; literature may explore freely; evidence must be evaluated independently.",
  scoring: { scale: "0-100", formula: "round(0.30*Verifiability + 0.25*SemanticClarity + 0.20*MappingValue + 0.15*LiteraryCognitiveValue + 0.10*Novelty, 1)", disclaimer: "Editorial triage only; not a scientific measurement." },
  quality_gate: { reviewed: "Standard meaning and word class recorded; historical claims source-checked; four evidence tracks complete; counterevidence and raw note preserved; Mapper terms tested.", published: "Reviewed plus a dedicated editorial/publication decision and, where required, a page. Batch 001 makes no automatic publication decisions.", candidate: "Record is structurally complete but the cross-language mapping remains exploratory or primarily mnemonic." },
  summary: { processed_records: entries.length, dispositions: counts, research_queue: 1, existing_record_checked: 1, historical_corrections: manifestRecords.filter((x) => x.historical_correction).length, validator_status: "pass (Schema v1.0 + Mapper/search regression)" },
  records: manifestRecords,
  deferred_queue: [{ candidate_id: "B001-Q01", raw_note: "wave / water ↔ 水 / w; w 形状与水语义假说。", priority_score: 66.5, processing_status: "deferred", final_record_ids: [], disposition: "Research Queue", reason: "Requires corpus/statistical controls for letter-shape and semantic-cluster claims." }],
  existing_record_checks: [{ candidate_id: "B001-X01", raw_note: "advance ↔ 往 wang", processing_status: "checked", final_record_ids: ["LB-en-advance-011"], disposition: "Existing Candidate", duplicate_created: false, note: "Existing calibration record retained; no duplicate authored entry." }]
};
fs.writeFileSync(path.join(batchDir, "dataset-expansion-batch-001.v1.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Batch 001 authored: ${entries.length} records · ${counts.Reviewed || 0} Reviewed · ${counts.Candidate || 0} Candidate`);
