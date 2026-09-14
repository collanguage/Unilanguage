# ABHOR ↔ 火 huǒ · Featured Recalibration v1.3

Author: Jinkai Liu
核验日期：2026-09-13

保留 ID `LB-en-abhor-037`、40条数据集、词条 Published 状态。**Present-day Mapping ≠ Diachronic Mapping｜现代词义映射 ≠ 历时语义映射。**

| 对象 | Status / Level / confidence | 语音 | 语义 | 结构／认知 | 语境 | 总分 |
|---|---|---:|---:|---:|---:|---:|
| 现代 abhor → 恶 wù（动词） | Supported / A—Direct / Medium | 2/30 | 29/30 | 12/20 | 17/20 | 60/100 |
| 历史 horrēre → 骇 hài | Candidate / C—Experimental / Medium | 5/30 | 18/30 | 13/20 | 7/20 | 43/100 |
| Featured 火 huǒ 方言／情绪候选 | Candidate / D / Low | 10/30 | 6/30 | 10/20 | 3/20 | 29/100 |

分数为现行 Mapping Score v0.2 的暂定编辑判断，不是声学测量、盲评结果或历史概率。A 只按框架 Direct 类评价有资料支持的所选词义，不代表音近；综合 confidence Medium，所选语义在数字来源范围内 High。历时 C 对应可检验的部分阶段比较，不因拉丁词源已知就升级汉语 mapping。

三层跨语言 **Historical Relation: Not claimed**。词义对应不等于共同词源；没有声称实验完成。

## 核验与证据边界

优先查找大陆规范辞书具体条目；本轮未取得《现代汉语词典》《新华字典》的可核验版本条目，故明确 pending，不以出版社介绍或无版本“在线新华字典”代替。

- [汉典：恶](https://www.zdic.net/hans/恶)，基本解释 wù、详细解释 wù 动词第1义及拼音：支持所选“讨厌／憎恶”义和 wù。è／ě／wū 对应其他读音义项，不混用。参考宽式 [u˥˩]（零声母，可有语音性 [w] 起始；平台记 [wu˥˧]，调值不是唯一实现）。这只是大陆数字平台 scoped evidence，不是纸本核验。
- [汉典：骇](https://www.zdic.net/hans/骇)，基本解释第1义、详细解释第3义及拼音：支持 hài 与惊惧／惊骇。以该现代义比较早期受惊反应；不把骇逐字等同于毛发竖起／战栗的全部义项。平台转录的马受惊古义、古籍书证未独立校勘；《汉语大字典》《汉语大词典》《辞源》及大陆整理原典的具体条目仍 pending。
- [Merriam-Webster：abhor](https://www.merriam-webster.com/dictionary/abhor)，Word History / Did you know：本轮复核拉丁 abhorrēre、ab- 与 horrēre 的构词及 bristle / tremble / shudder、recoil 语义。不是“应该经法语”的推断。
- [Allen & Greenough / DCC §8](https://dcc.dickinson.edu/grammar/latin/vowel-and-consonant-pronunciation) 与 [§7](https://dcc.dickinson.edu/grammar/latin/syllables)：近似古典 Roman reference；据规则推导 hor-rē-re 三音节。h [h] 对普通话 h [x] 只有限相似；o–ē–e 对 ai，rr/r、元音长短及三音节对一音节均不同。未拟构汉语古音，未将现代英语 -hor 音值倒投拉丁语。

`HORRĒRE — BRISTLE / SHUDDER / TREMBLE ↔ 骇 → RECOIL / AVERSION → ABHOR — DETEST / LOATHE ↔ 恶`

这是 semantic-stage comparison，是概括图式，不是三个严格递进的首见年代，也不是汉语骇演变为恶的主张。

## 火的保留位置与数据结构

火作为 Featured primary mapping Candidate；不是标准译词或历时映射。原情绪／文学对象以引用保留，正式音系比较归属 primary_mapping。作者“憎恶即对某人有火”及 raw note 原样保留；不进入 Evidence。ANGER/HEAT imagery ≠ AVERSION；Not etymological evidence。旧评估29/100只属于火，不继承新现代映射的 A。

复用 `diachronic_semantic_mapping`；历史阶段从固定四段放宽为至少一段，新增可选 `mappings`，每项独立 source/target、义项、status/level/confidence、历史关系及评分。兼容原 ABANDON，不修改其 record。主 mapping assessment 只评价 Featured abhor↔火（D / Low）；modern_standard_semantic_mapping 保留恶 wù 的 A / Supported 及独立评分。Search / Dictionary / Mapper 展示火候选，标准翻译及现代语义在 gloss/meaning 中区分，所有别名指向同一记录；冻结 UI 不变。

HORR family 仍为 horror / horrible / horrid / abhorrent / abhorrence。horizontal 属 Greek horizon family；horse 属 Germanic hors / hros，均不并入 HORR。不改写 HORIZON、HORSE、NEW 或 ABANDON。

## 沿用的来源审计与次级火分析

以下分析沿用火的 D / Low 评价，该评价现属于 Featured 候选，不能与恶的 A 混用。原有来源沿用上一轮审计；本轮新核验来源与范围列于上文。

## 声音与认知

onset：英语 /h/ 为声门音，普通话 /x/ 为软腭擦音；同有清擦音性质，但发音部位不相同。

glide：普通话有 /w/ 介音（亦以非音节 u 转写）；英语目标段无对应介音。

vowel：英语 /ɔː/ 与普通话 /w/ 后的 /o/ 仅有宽泛圆唇后元音近似；音质、时长与运动不同。

rhoticity：参考非卷舌英音单念无词尾 r，后接元音可出现连接 r；参考美音保留 /r/，常实现为 [ɹ]。

coda：英音单念目标段无韵尾；美音有 r／卷舌性；普通话火无辅音韵尾。

tone：普通话上声单念常记214，英语无相应词汇声调；连读实际调值会变化。

whole_word：所选片段排除了英语 /əb-/，整词相似更弱；不能把现代 -hor 的音值倒投为拉丁 horrēre 的读音。

法语 /abɔʁe/：书写 h 不发 /h/，rr 不等于英语 /h/ 加 /r/；/ɔʁ/ 对 /xwo/ 是更弱的次级比较，不增加独立同源证据。

BRISTLE/SHUDDER/RECOIL → HORROR/AVERSION → DETEST || FIRE/HEAT → ANGER/INTENSE AFFECT

两条独立路径部分共享具身／强烈负面情绪结构；终点分别为厌恶／憎恶与愤怒，并不相同。 这些箭头为概念概括，不虚构逐年代演变。

## 词族、校勘与作者层

horror：Latin horror ← horrēre；历史词族关联，不是独立跨语言样本。

horrible：Anglo-French ← Latin horribilis ← horrēre；历史词族关联，不是独立跨语言样本。

horrid：Latin horridus ← horrēre；历史词族关联，不是独立跨语言样本。

abhorrent：Latin abhorrent-/abhorrens, participle of abhorrēre；历史词族关联，不是独立跨语言样本。

abhorrence：English abhor noun family; standard spelling；历史词族关联，不是独立跨语言样本。

horizontal：水平的；horizont- + -al，词干经拉丁语追溯希腊语 horizōn／horizein（划界）与 horos（界限）。hori.zon.tal／zone 不是历史构词分析。

horse：中古英语 hors ← 古英语；与古高地德语 hros 相联系。不是 hor + se，也不属于 HORR 词族。

abhorrance → abhorrence；abhorrant → abhorrent。ab- 不是由本词即可证明的 a- 遇 h 规则。

“憎恶即对某人有火”仅为 Author's Intuition / Literary Layer；原始笔记保留，未放入 Evidence。

现有 data/entries 无成熟 horse candidate。本任务不扩展；午马／五行配属须另用大陆可靠资料逐项核验，禁止反向证明 hor-=火。

## 逐项来源

- **REF-MW-ABHOR — Merriam-Webster: abhor**
  - 范围：historical_etymology, modern_meaning
  - 定位：Word History; Did you know?
  - 已核验条目正文。支持中古英语借自拉丁语，不列法语中介。
  - [来源](https://www.merriam-webster.com/dictionary/abhor)

- **ABHOR-OALD — Oxford Advanced Learner’s Dictionary: abhor**
  - 范围：phonology, historical_etymology
  - 定位：British /əbˈhɔː(r)/; American /əbˈhɔːr/; Word Origin
  - 已核验参考口音及拉丁来源；不是对所有英语口音的穷尽描述。
  - [来源](https://www.oxfordlearnersdictionaries.com/definition/english/abhor)

- **ABHOR-FR — CNRTL / TLFi: abhorrer**
  - 范围：historical_etymology, phonology
  - 定位：Étymologie; Prononc. et orth.
  - 检索所得完整条目文字核验；标为拉丁借词；[abɔʀe] 在本条宽式记作 /abɔʁe/，不把书写 h 读成 /h/。
  - [来源](https://www.cnrtl.fr/definition/abhorrer)

- **ABHOR-MW-HORRIBLE — Merriam-Webster: horrible**
  - 范围：historical_etymology
  - 定位：Word History / headword
  - 已核验具体条目；只用于该词的词史或规范词形。
  - [来源](https://www.merriam-webster.com/dictionary/horrible)

- **ABHOR-MW-HORRID — Merriam-Webster: horrid**
  - 范围：historical_etymology
  - 定位：Word History / headword
  - 已核验具体条目；只用于该词的词史或规范词形。
  - [来源](https://www.merriam-webster.com/dictionary/horrid)

- **ABHOR-MW-ABHORRENT — Merriam-Webster: abhorrent**
  - 范围：historical_etymology
  - 定位：Word History / headword
  - 已核验具体条目；只用于该词的词史或规范词形。
  - [来源](https://www.merriam-webster.com/dictionary/abhorrent)

- **ABHOR-MW-ABHORRENCE — Merriam-Webster: abhorrence**
  - 范围：modern_meaning
  - 定位：Word History / headword
  - 已核验具体条目；只用于该词的词史或规范词形。
  - [来源](https://www.merriam-webster.com/dictionary/abhorrence)

- **ABHOR-MW-HORIZONTAL — Merriam-Webster: horizontal**
  - 范围：historical_etymology
  - 定位：Word History / headword
  - 已核验具体条目；只用于该词的词史或规范词形。
  - [来源](https://www.merriam-webster.com/dictionary/horizontal)

- **ABHOR-MW-HORIZON — Merriam-Webster: horizon**
  - 范围：historical_etymology
  - 定位：Word History / headword
  - 已核验具体条目；只用于该词的词史或规范词形。
  - [来源](https://www.merriam-webster.com/dictionary/horizon)

- **ABHOR-MW-HORSE — Merriam-Webster: horse**
  - 范围：historical_etymology
  - 定位：Word History / headword
  - 已核验具体条目；只用于该词的词史或规范词形。
  - [来源](https://www.merriam-webster.com/dictionary/horse)

- **ABHOR-FR-HORIZONTAL — CNRTL / TLFi: horizontal**
  - 范围：historical_etymology
  - 定位：Étymologie et Histoire
  - 独立核验法语形容词；不属于 horrēre 词族。
  - [来源](https://www.cnrtl.fr/definition/horizontale)

- **ABHOR-ZD-HUO — 汉典：火**
  - 范围：modern_meaning, phonology
  - 定位：基本解释第1、4义；详细解释名词第6义、动词第3义；音标栏
  - 大陆数字辞书平台；本次仅使用基本／详细解释及现代音标 xuo˨˩˦，用 [w] 表示介音。非纸本辞书；不使用国语辞典栏及未校勘古籍。
  - [来源](https://zdic.net/hans/火)

- **ABHOR-ZD-HUOQI — 汉典：火氣**
  - 范围：modern_meaning
  - 定位：词语解释第2、3义
  - 大陆数字辞书平台；核验遇事易动怒及脾气义；正文以简体释述。仅用词语解释，排除国语辞典／网络解释；平台繁体显示不改变来源属性。
  - [来源](https://zdic.net/hans/火氣)

- **ABHOR-ZD-FAHUO — 汉典：發火**
  - 范围：modern_meaning
  - 定位：词语解释第1、3义
  - 大陆数字辞书平台；核验燃烧及发脾气义；正文以简体释述。仅用词语解释，排除国语辞典／网络解释；平台繁体显示不改变来源属性。
  - [来源](https://www.zdic.net/hant/發火)

- **ABHOR-ZD-NUHUO — 汉典：怒火**
  - 范围：modern_meaning
  - 定位：词语解释第1义
  - 大陆数字辞书平台；核验强烈愤怒义；正文以简体释述。仅用词语解释，排除国语辞典／网络解释；平台繁体显示不改变来源属性。
  - [来源](https://zdic.net/hant/怒火)

- **ABHOR-AUTHOR — Jinkai Liu：ABHOR 原始笔记及本次规范表述**
  - 范围：author_observation, literature
  - 定位：用户本次任务原句
  - 作者资料，不是独立语言证据；旧站原始文字另存 source.raw_note。

- **REF-LANGUAGESBOOK-ABHOR — languagesbook.com legacy entry: abhor，憎恶。火 huo。憎恶即对某有火**
  - 范围：
  - 定位：旧站档案
  - author-published legacy website; imported 2026-09-01; original observation preserved independently from evaluation
  - [来源](https://languagesbook.com/glossary/abhor%ef%bc%8c%e6%86%8e%e6%81%b6/)

- **ABHOR-RUBRIC — Unilanguage Mapping Framework / Mapping Score v0.2**
  - 范围：project_rubric
  - 定位：protocol/protocol.mapping-framework.html#evaluation; words/man.html#mapping-score
  - 四维权重30/30/20/20；A/B/C/D按关系类型与强度判断，未核得统一数值阈值。

## Pending 与实验边界

## Focused dialect update｜方言观察更新（2026-09-13）

作者 Jinkai Liu 补充第一手用例：“我对某某有火／对某人有火”，报告义为对某人有意见、不满、反感、厌恶。该记录标为 `Author-attested Dialect Usage`；地区未由作者在与本用法直接相关的资料中指明，故 `Region: Pending identification`。

本轮按 Mainland-first 检索大陆方言词典、地方志、学术论文及语言研究机构资料。检索式覆盖“有火”“对某人有火”“火气”“有意见”“怨气”“不满”“反感”及其组合。没有取得可核验的具体方言条目来独立证明该构式及其地域分布，因此 `Independent dialect evidence: Pending`。检索结果中的泛网页、论坛、小说和未能定位具体词目的材料未作为方言证据。

现有独立辞书材料只证明相邻的普通词汇范围：火气、发火、怒火可表示生气、怒气、易动怒等，即 `ANGER`，并可在具体语境靠近 `DISPLEASURE`。它们不能独立把“对某人有火”证明到 `RESENTMENT`、`AVERSION` 或 `DETESTATION`。这项范围限制不否定作者观察；它只区分作者报告义和已独立核验义。

火的新位置是 `Dialectal / Affective Semantic Candidate`，仍为 D / Low。它不是现代标准词汇对应，是 Featured primary mapping candidate，不是 horrēre 的历史阶段 mapping，也不是历史词源证据。`Historical Relation: Not claimed`，原文学句继续链接到这一作者观察层。

《现代汉语词典》《新华字典》火／火气／发火／怒火具体条目：未取得可核验具体版本条目，不引用页码或以出版社介绍替代。

《汉语大字典》《汉语大词典》及大陆整理原典中的火义历时顺序：未取得可靠具体条目；本条不拟构古音、不虚构首见年代。

独立心理语言实验及语料统计：仅有计划，无受试者结果；软件测试不验证语言假说。

Separate phonetic and semantic judgments; hide author note and spelling from auditory raters; British non-rhotic and American rhotic strata; randomize matched syllable/frequency controls; horizontal and horse as etymological negative controls only, not matched statistical controls; deduplicate HORR family; preregister outcomes, sample size and analysis before collection.

No held-out advantage over matched random pairs, or disappearance after controlling generic negative valence; no upgrade from software tests.

软件回归与发布证据见本次交付报告；本文件不宣称尚未运行的检查已通过。

## v1.3 focused update

Featured Mapping is selected per entry and may differ from Standard Translation; selection must state whether its strength is phonetic, semantic, cognitive, dialectal, or cultural.

Standard Translation: 憎恶 / 厌恶。Featured: 火 huǒ。Modern Standard Semantic Mapping: 恶 wù。Diachronic Semantic Mapping: HORRĒRE → 骇 hài。Historical Relation: Not claimed。

火的 phonetic / semantic / dialectal confidence 均 Low；认知桥梁为间接解释。重读 hor 的 onset /h/ 与 /x/、vowel /ɔː/ 与 /o/、美音 rhoticity、普通话 /w/ glide 和第三声均独立记录，非同音。

本轮定向复查“对某人有火 方言”“有火 方言 厌恶”未取得可验证该构式及地域的独立大陆词典／地方志／学术条目；不据普通媒体、无关同形用例或词典怒气义升级。Independent evidence pending；Region: Pending identification。恶／骇沿用并复核汉典 scoped evidence；纸本与古义首见仍 pending。
