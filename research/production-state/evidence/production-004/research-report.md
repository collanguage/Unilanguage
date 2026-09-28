# Human–AI Production Batch 004 — Research & Freeze Proposals

完成记录：2026-09-28T01:19:58.937396+00:00。本批仅研究和提案；未接收 Candidate Corpus、未发布。

## 结论

保持 Scheduler 原始八条与顺序：2 条 Ready for Editorial Freeze、4 条 Featured Pending、2 条 Control / Negative。建议 Featured 仅 UP→上 shàng 与 INSIDE→内 nèi，均为 Structural-Semantic Candidate、Phonetic Fit Low；仍待 Jinkai Liu 审核。

输入 8 条全部 unknown provenance；没有把导入资料署名为 Jinkai Liu。AI 本轮报告与原始资料分开。完整原始 source-pointer 对象保存在 research-records.json 的 imported_observations。

## 证据与评分边界

High/Medium/Low 是本轮按具体义项作出的编辑评价，没有综合总分。Limited 表示只有部分现代音段可比，不是历史音系对应。现代普通话为中文比较层；未强配中古/上古音。英语 IPA 为宽式现代读音分析，历史阶段不填未核 IPA。汉典只作为已访问在线基本/详细释义；不把网站转录当作查阅大陆纸本辞书，也不采用其中國語辭典作为大陆证据。所有跨语言 Historical Relation = Not claimed。

Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。

## 八条 Freeze 总表

| Entry | Pipeline | Standard scope | Featured proposal | 最终状态 |
|---|---|---|---|---|
| BOUND | Lexical–Diachronic | 按 identity 分为：被绑/受约束；驶往/准备去；跳跃；边界/界限。禁止合为一个标准义。 | Pending | Control / Negative |
| LAW | Lexical–Diachronic | 法律/法则；本批以规范规则为主，不把科学定律或习惯义无差别并入。 | Pending | Control / Negative |
| ABASHED | Lexical–Diachronic | 窘迫的、难为情的；也可作 abash 的过去式/过去分词，需按句法识别。 | Pending | Featured Pending |
| MEANING | Cultural–Structural–Literary | 意思/意义；按所表达的内容、意图、重要性分别定 scope。 | Pending | Featured Pending |
| HORROR | Lexical–Diachronic | 恐惧/惊骇；某些语境为强烈厌恶，亦有可怕事物和类型标签用法。 | Pending | Featured Pending |
| UP | Cultural–Structural–Literary | 在高处/向上；动向、位置、增加、完成等不强行统一为一个译字。 | 上 shàng — Structural-Semantic Candidate; Phonetic Fit Low | Ready for Editorial Freeze |
| HORRID | Lexical–Diachronic | 可怕的/令人厌恶的/讨厌的；形容词，不能直接复制 HORROR 名词译法。 | Pending | Featured Pending |
| INSIDE | Cultural–Structural–Literary | 里面/在内部/内部的；名词、介词、副词、形容词用法按构式分开。 | 内 nèi — Structural-Semantic Candidate; Phonetic Fit Low | Ready for Editorial Freeze |

## BOUND — RQ-101dda206cb9

**Identity gate：** Conditional: English form confirmed; original intended homonym unresolved. Four research scopes separated; control use safe, single-sense entry acceptance not authorized

**Author Observation：** 未认证；unknown provenance。原导入摘要：Author comparison or semantic association only; not historical derivation.

**AI Research Result / Freeze Proposal：** 保留为同形多源和 ABOUND 错误拆词的 control。四支独立展示于 Research；不将当前含糊 raw context 擅定为其中一支，也不创建四个新任务。

**Standard：** 按 identity 分为：被绑/受约束；驶往/准备去；跳跃；边界/界限。禁止合为一个标准义。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| B1 | bound / bounden ← bind (English / Middle English) | medieval → modern | binding/result state | bind 的屈折结果；不是 abound 的 root |
| B2 | bound ← boun ← búinn (English / Middle English / Old Norse) | medieval → modern | ready / destined / going toward | 独立 ready/destination 分支 |
| B3 | bound ← bond / bondir (English / French) | early modern English; French earlier | leap / rebound | 独立跳跃分支；深源 *bombitire 只按词典重建标记 |
| B4 | bound ← bounde / bodne ← bodina (English / Anglo-French / Medieval Latin) | medieval → modern | limit / boundary | 独立界限分支；不连到 bind |

来源：[MW-bound](https://www.merriam-webster.com/dictionary/bound)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 绑 bǎng | 捆缚 → B1 | High (被绑状态需构式) | Limited | Medium | [ZD-绑](https://zdic.net/hans/绑); semantic retrieval; retained | 绑是动作；bound 可为结果或义务；不能覆盖其他三支 |
| 界 jiè | 边限 → B4 | High | Low | High | [ZD-界](https://zdic.net/hans/界); semantic retrieval; retained | 不是 be bound to 的目的地或必然义 |
| 蹦 bèng | 跳跃 → B3 | High within leap | Limited | Medium | [ZD-蹦](https://zdic.net/hans/蹦); semantic retrieval; retained | 元音、鼻尾与 /aʊnd/ 不同；不能用绑的语义证明蹦 |
| 赴 fù | 前往 → B2 | Medium | Low | Medium | [ZD-赴](https://zdic.net/hans/赴); semantic retrieval; retained | 赴为动作；bound for 可表示意图/朝向，不保证已到达 |
| 绊 bàn | 束缚/牵制（羁绊） → B1 restraint | High within restraint | Limited | Medium | [ZD-绊](https://zdic.net/hans/绊); phonetic expansion; retained | 词条确有束缚义，不仅绊倒；不能覆盖 B2/B3/B4，也不证明历史音对应 |

**声音评估：** 现代 bound /baʊnd/ 对 bǎng、bèng：英语浊塞音与普通话不送气 /p/ 不是相同音值；/aʊnd/ 对 /ɑŋ, əŋ/ 韵母和辅音尾不同。fù 的 b-p-m-f group hit 仅生成特征；赴来自语义基线，不计扩展新增。

**Shortlist：** 绑 @ B1；界 @ B4；蹦 @ B3；绊 @ B1 restraint

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 棒 bàng | phonetic | 声母/鼻尾局部相似；棍棒不等于四个目标义 |
| 磅 bàng | phonetic | 重量单位，不是 bound 的历史单位 |
| 约束 yuēshù | semantic | 限制义强，声音弱 |
| 边界 biānjiè | semantic | 仅 B4 强，不覆盖其他 identity |

- abound 不能拆成 a + 本词任何 bound 来证明同源。
- bound for London 与 hands bound 的语法和来源不同。

**Rejected / not selected：** 

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** No inherited mapping

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## LAW — RQ-562d6cb07a1c

**Identity gate：** Pass: research scope confirmed

**Author Observation：** 未认证；unknown provenance。原导入摘要：rule

**AI Research Result / Freeze Proposal：** 保留 LAW 作为 L→光假说的负面语义样本，同时保留真实法律义。一个负例不足以推翻整个统计假说，不能把它解释成潜在光义来挽救假说。

**Standard：** 法律/法则；本批以规范规则为主，不把科学定律或习惯义无差别并入。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| L1 | lagu / lǫg (Old English / Old Norse) | medieval | law / rules | 英语借入斯堪的纳维亚形式；不属于 LIGHT 词源 |
| L2 | law (English) | modern | rule / legal system / regularity | 多义范围并列，不造严格时间顺序 |

来源：[MW-law](https://www.merriam-webster.com/dictionary/law)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 法 fǎ | 法律/规范 → L2 | High for legal rule | Low | Medium | [ZD-法](https://zdic.net/hans/法); semantic retrieval; retained | 办法、法国等同字义不参与 |
| 律 lǜ | 规则/条文 → L2 | High scoped | Limited | Medium | [ZD-律](https://zdic.net/hans/律); semantic retrieval; retained | law /l/ 与 lǜ 声母相近，元音明显不同；乐律不是所有 law |
| 规 guī | 法则/章程 → L2 | Medium–High | Low | Medium | [ZD-规](https://zdic.net/hans/规); semantic retrieval; retained | 规则比成文法律宽，不等同一切 law |
| 令 lìng | 命令 → L2 | Medium–Low | Limited | Low | [ZD-令](https://zdic.net/hans/令); phonetic expansion; not selected | 命令不必是法律；d-t-n-l 扩展不能补语义缺口 |

**声音评估：** 现代 /lɔː/（口音有变体）与 lǜ 仅 /l/ 较接近；/y/ 与后元音差异大。律已由意义产生，不算扩展收益。

**Shortlist：** 法；律

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 捞 lāo | phonetic | 近 /l/ 起首和低元音；捞取与规则无关 |
| 老 lǎo | phonetic | 声音局部相近；年老不是法律 |
| 法律 fǎlǜ | semantic | 标准法律义，不是新同源论据 |
| 规则 guīzé | semantic | 一般规则强，但范围宽于法律 |

- law 的 L 起首不能推出 light meaning。
- scientific law 不等于某次行政命令。

**Rejected / not selected：** 令 — not selected: 命令不必是法律；d-t-n-l 扩展不能补语义缺口

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** Imported negative-control role retained; no target-package access

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## ABASHED — RQ-73a0d89d12dc

**Identity gate：** Pass: research scope confirmed

**Author Observation：** 未认证；unknown provenance。原导入摘要：Derivative of the related word abash, not of violent-hit bash.

**AI Research Result / Freeze Proposal：** Modern semantic mappings 窘/羞；早期惊愕只保留历史说明。本轮不足以把某个单字提升为具有额外研究价值的 Featured。

**Standard：** 窘迫的、难为情的；也可作 abash 的过去式/过去分词，需按句法识别。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| A1 | baer / esbaer / esbahir → abair (Old French / Anglo-French) | medieval | 张口/惊愕相关历史基础 | 复用 ABASH 引文；不得加入 violent-hit BASH → 拍 |
| A2 | abaissen / abaschen → abash (Middle English / English) | 14th century onward | 失去镇定/使窘迫 | 借入后英语动词；现代及物义单列 |
| A3 | abashed (English) | 14th century onward; modern focus | 窘迫的结果状态 | 分词/形容词，不继承 ABASH Featured |

来源：[MW-abash](https://www.merriam-webster.com/dictionary/abash)；[CNRTL-ebahir](https://www.cnrtl.fr/etymologie/%C3%A9bahir)；[MW-abashed](https://www.merriam-webster.com/dictionary/abashed)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 窘 jiǒng | 难为情/尴尬 → A3 | High | Low | High | [ZD-窘](https://zdic.net/hans/窘); semantic retrieval; retained | 只用窘迫义，不用穷困或强迫义 |
| 羞 xiū | 难为情 → A3 | High scoped | Low | Medium | [ZD-羞](https://zdic.net/hans/羞); semantic retrieval; retained | 不要求所有 abashed 都有道德羞耻 |
| 惭 cán | 惭愧 → A3 | Medium | Low | Medium | Specific lexical evidence Pending; semantic retrieval; evidence pending | 更偏自愧，未必覆盖窘迫；本次词条访问失败 |
| 怕 pà | 害怕 → A1/A3 | Low for modern A3 | Limited | Low | [ZD-怕](https://zdic.net/hans/怕); phonetic expansion; semantic mismatch | 惊愕、窘迫不等于怕；不可继承旧研究结论 |

**声音评估：** 现代 /əˈbæʃt/ 对 pà 只比较重读 b 与 p 类塞音；首弱音节、/æ/、/ʃt/ 和声调都不匹配。窘/羞的 Phonetic Fit Low 不因语义强升级。

**Shortlist：** 窘；羞

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 拍 pāi | phonetic | 击打义不能作为 ABASHED 的祖先或现代义 |
| 芭 bā | phonetic | 仅局部声音，植物字义不相关 |
| 难为情 nánwéiqíng | semantic | 状态义强，整词声音弱 |
| 局促不安 júcù bùān | semantic | 部分语境合适，不保证每例都紧张 |

- 感到窘迫可以没有危险恐惧。
- abashed 的 -ed 与状态构式不能被删掉后当 whole-word 声音对应。

**Rejected / not selected：** 惭 — evidence pending: 更偏自愧，未必覆盖窘迫；本次词条访问失败；怕 — semantic mismatch: 惊愕、窘迫不等于怕；不可继承旧研究结论

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** ABASH → ABASHED: verified historical references reused; no Chinese conclusion inherited

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## MEANING — RQ-9132e6719bd4

**Identity gate：** Pass: research scope confirmed

**Author Observation：** 未认证；unknown provenance。原导入摘要：What a sign, word, act or structure conveys or makes interpretable.

**AI Research Result / Freeze Proposal：** 建立 CONTENT / INTENTION / SIGNIFICANCE 三个并列 scope；不把 meaning、sense、signification、intention 当无差别同义词。保留 Standard 与 Protocol 关系，Featured Pending。

**Standard：** 意思/意义；按所表达的内容、意图、重要性分别定 scope。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| M1 | mǣnan → menen → mean (Old English / Middle English / English) | Old English → modern | intend / have in mind / signify | 不是 mean=average 的 medianus 分支 |
| M2 | meaning (noun) (English) | 14th century onward | 表达内容/意图/意义 | 结构比较层：表达者、载体、解释；不宣称严格历史次序 |

来源：[MW-mean](https://www.merriam-webster.com/dictionary/mean)；[MW-meaning](https://www.merriam-webster.com/dictionary/meaning)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 意 yì | 意图/心思 → M1/M2 intention | High scoped | Low | High | [ZD-意](https://zdic.net/hans/意); semantic retrieval; retained | 意图不等于所有客观词义；不要求所有信号有作者意图 |
| 义 yì | 意思/词义 → M2 content | High scoped | Low | High | [ZD-义](https://zdic.net/hans/义); semantic retrieval; retained | 只选含义义项，不用正义/义亲义 |
| 意义 yìyì | 意思/重要性 → M2 | High scoped | Low | High | Specific lexical evidence Pending; semantic retrieval; retained | 内容与价值需分开；复合词具体大型辞书条目待核 |

**声音评估：** 现代 /ˈmiːnɪŋ/ 对 yì 无有力整体声音对应；名/明只有音段片段，不用于主候选。Protocol 主任务不运行辅音组扩展。

**Shortlist：** 义 @ content；意 @ intention

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 名 míng | phonetic | 命名不等于意义；鼻音局部相似不足 |
| 明 míng | phonetic | 明亮/明白不自动成为 meaning |
| 含义 hányì | semantic | 表达内容基线 |
| 意图 yìtú | semantic | 只适用 intention，不包办词义 |

- 烟可以意味着火，却无需烟有意图。
- 一词可以有词义而在特定语境没有重要意义。

**Rejected / not selected：** 

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** No inherited Featured; raw package gloss preserved as unauthenticated intake

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## HORROR — RQ-2070e35dd27a

**Identity gate：** Pass: research scope confirmed

**Author Observation：** 未认证；unknown provenance。原导入摘要：Latin horror ← horrēre

**AI Research Result / Freeze Proposal：** 保留 horrēre 家族和身体反应比较；不同英语义项与中文构式分开。单字相似不足以选 Featured，火留负面/control 身份。

**Standard：** 恐惧/惊骇；某些语境为强烈厌恶，亦有可怕事物和类型标签用法。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| H1 | horrēre / horror (Latin) | ancient Latin; exact attestation not frozen | 竖立/发抖与恐惧、厌恶相关语义 | 派生关系；并列词义不等于已证明的单线演变 |
| H2 | horrour → horror (Anglo-French / Middle English / English) | medieval; English 14th century onward | 恐惧/令人恐惧的事物 | 借入路径；ABHOR 是相关支，不是必经祖先 |

来源：[MW-horror](https://www.merriam-webster.com/dictionary/horror)；[MW-abhor](https://www.merriam-webster.com/dictionary/abhor)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 骇 hài | 惊惧 → H2 | High for fear | Limited | Medium | [ZD-骇](https://zdic.net/hans/骇); semantic retrieval; retained | 不覆盖纯厌恶或影片类型；不可继承 ABHOR 评分 |
| 恐 kǒng | 害怕/惊恐 → H2 | High for fear | Low | Medium | [ZD-恐](https://zdic.net/hans/恐); semantic retrieval; retained | 动词性单字常需恐惧构词；k/h group 不是声音证据 |
| 悚 sǒng | 恐惧；毛骨悚然构式 → H1/H2 | High scoped | Low | High | [ZD-悚](https://zdic.net/hans/悚); semantic retrieval; retained | 身体反应是语义比较；汉语历史次序未证明 |
| 寒 hán | 冷；害怕 → H1/H2 fear/shiver | Medium–High within fear | Limited | High as scoped parallel | [ZD-寒](https://zdic.net/hans/寒); phonetic expansion; retained | 词条有害怕义，保留冷/惧并列比较；不证明中文严格演变次序，也不覆盖 disgust/genre |

**声音评估：** 现代 horror 两音节，MW 记 ˈhȯr-ər/ˈhär-；hài 的 h 为普通话舌根擦音，元音/韵尾与英语不同。只给 Limited，非历史音对应。

**Shortlist：** 悚 @ bodily-fear comparison；骇 @ fear；寒 @ cold/fear parallel

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 火 huǒ | phonetic | 火可令人害怕但恐惧不必有火；因果不等于词义 |
| 荷 hé | phonetic | 音首局部接近，荷花无恐惧义 |
| 恐惧 kǒngjù | semantic | 现代 fear 标准基线 |
| 厌恶 yànwù | semantic | 仅 disgust 语境，不能泛化 |

- horror of cruelty 可偏道德厌恶，不涉及火或寒冷。
- HORSE/HORIZON 与 horrēre 不因 hor 拼写相同而并族。

**Rejected / not selected：** 

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** ABHOR/horrēre reference bundle reused; horror modern noun evaluated independently

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## UP — RQ-7894011e782d

**Identity gate：** Pass: research scope confirmed

**Author Observation：** 未认证；unknown provenance。原导入摘要：Toward or in a higher position.

**AI Research Result / Freeze Proposal：** 建议 Featured 上，仅限高位/上向关系。Modern lexical examples 与 Space Protocol 坐标关系分别保存；不继承 ABOVE 或 DOWN 的 Featured/Evidence。

**Standard：** 在高处/向上；动向、位置、增加、完成等不强行统一为一个译字。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| U1 | ūp / uppe → up (Old English / Middle English / English) | before 12th century onward | 向高处/处于高位 | 位置和方向来源并列；Protocol 非重建词源 |
| U2 | up (spatial uses) (English) | modern | higher position / upward path | 本批 Protocol scope；其他短语动词用法在边界外 |

来源：[MW-up](https://www.merriam-webster.com/dictionary/up)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 上 shàng | 高处/向高处 → U2 relation/path | High scoped | Low | High | [ZD-上](https://zdic.net/hans/上); semantic retrieval; retained | 不含 shǎng 上声；give up、eat up 不能逐字译上 |
| 升 shēng | 向上/提高 → U2 motion | High for rise | Low | High | [ZD-升](https://zdic.net/hans/升); semantic retrieval; retained | 位置不是必然正在上升；容量单位升排除 |
| 高 gāo | 高度大/位置高 → U2 state | Medium–High | Low | Medium | [ZD-高](https://zdic.net/hans/高); semantic retrieval; retained | 标量形容性质，不等于所有上行路径 |

**声音评估：** 现代 /ʌp/ 对 shàng 不匹配；Feature 来自结构可解释性，不来自声音。辅音扩展 Not applicable。

**Shortlist：** 上；升

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 啊 ā | phonetic | 元音近似很弱且没有向上义 |
| 扑 pū | phonetic | 倒置/截取 p 不构成整词同音；扑不必向上 |
| 向上 xiàngshàng | semantic | 方向明确，声音不匹配 |
| 升高 shēnggāo | semantic | 变化明确，不等于静态处于高位 |

- eat up 可表示吃完，并非朝上吃。
- being up 与 rising 的静态/动态不同。

**Rejected / not selected：** 

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** Space Protocol interface reused conceptually; not a shared etymology

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## HORRID — RQ-248f91f7b08f

**Identity gate：** Pass: research scope confirmed

**Author Observation：** 未认证；unknown provenance。原导入摘要：Latin horridus ← horrēre

**AI Research Result / Freeze Proposal：** 现代形容词义与拉丁物理义分别记录；毛是可进一步编辑的语义结构比较，不做已证实历时平行。Featured Pending，恶的精准书证继续 Pending。

**Standard：** 可怕的/令人厌恶的/讨厌的；形容词，不能直接复制 HORROR 名词译法。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| R1 | horrēre → horridus (Latin) | ancient Latin | 粗硬/竖立、令人发抖/可怕 | 派生为形容词，非 modern horror → horrid |
| R2 | horrid (English) | late 16th century onward; modern focus | 令人害怕、厌恶、很不愉快 | 现代 sense 单独核验 |

来源：[MW-horrid](https://www.merriam-webster.com/dictionary/horrid)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 可怕 kěpà | 令人害怕 → R2 fear-causing | High scoped | Low | Medium | [ZD-怕](https://zdic.net/hans/怕); semantic retrieval; retained | 讨厌气味等不必恐惧；词组层词性适合 |
| 恶 è | 坏/恶劣 → R2 unpleasant | Medium | Low | Medium | Specific lexical evidence Pending; semantic retrieval; evidence pending | 冻结 è，不借 ABHOR 的 wù 读音；本次页面稳定提取不足，具体义项证据 Pending |
| 毛 máo | 粗糙/毛发；口语惊慌 → R1 physical comparison | Medium | Low | Medium–High | [ZD-毛](https://zdic.net/hans/毛); semantic retrieval; retained | 毛的多义可比较，未证明先后变化；不能把 horrid person 直译毛人 |
| 慌 huāng | 惊慌 → R2 | Low | Limited | Low | [ZD-慌](https://zdic.net/hans/慌); phonetic expansion; semantic mismatch | 体验者状态不等于对象令人厌恶/可怕的性质 |

**声音评估：** 现代 horrid 的 /h/ 及后续音节与 huāng/huǒ 只局部相似；恐惧状态与致恐性质仍有语义角色差异。所有 retained 候选声音 Low。

**Shortlist：** 可怕 @ fear-causing；毛 @ physical comparison

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 火 huǒ | phonetic | 愤怒/火焰不能泛化为 horrid；旧 ABHOR featured 不能继承 |
| 获 huò | phonetic | 获得义不相关 |
| 讨厌的 tǎoyàn de | semantic | unpleasant 人或物语境 |
| 粗糙的 cūcāo de | semantic | 仅历史物理义，不覆盖现代人格评价 |

- horrid manners 可指讨厌的举止，不是恐怖事件。
- 同源 horror 名词不能自动成为本词翻译或 Featured。

**Rejected / not selected：** 恶 — evidence pending: 冻结 è，不借 ABHOR 的 wù 读音；本次页面稳定提取不足，具体义项证据 Pending；慌 — semantic mismatch: 体验者状态不等于对象令人厌恶/可怕的性质

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** horrēre bundle reused; Latin horridus and modern adjective independently verified

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## INSIDE — RQ-a5233aa38dc4

**Identity gate：** Pass: research scope confirmed

**Author Observation：** 未认证；unknown provenance。原导入摘要：In or into an interior area.

**AI Research Result / Freeze Proposal：** 建议 Featured 内，限定 INTERIOR/WITHIN；inside=位置关系，containment 的限制/控制为不同 scope。对象可在开放区域内部，不要求封闭容器。

**Standard：** 里面/在内部/内部的；名词、介词、副词、形容词用法按构式分开。

### Historical / sense map

| ID | Source form / language | Period | Meaning | Relation |
|---|---|---|---|---|
| I1 | ynneside / in + side (Middle English) | late 14th century | 身体内部部分 | 组合构词；不得把 Latin contain 当祖先 |
| I2 | inside (English) | c.1500 general interior; modern spatial focus | 内部区域/处于或进入其内 | 现代结构比较；INNER REGION 不等于 CONTROL |

来源：[ETY-inside](https://www.etymonline.com/word/inside)；[MW-inside](https://www.merriam-webster.com/dictionary/inside)

### Candidate table

| Chinese / reading | 义项 → source stage | Semantic | Phonetic | Structural | Evidence / disposition | Boundary |
|---|---|---|---|---|---|---|
| 内 nèi | 内部/与外相对 → I2 region/relation | High scoped | Low | High | [ZD-内](https://zdic.net/hans/内); semantic retrieval; retained | 不用 nà 收纳读音；inside information 需另译内幕，不逐词恒等 |
| 里 lǐ | 内部；方位构式 → I2 locative | High | Low | High | [ZD-里](https://zdic.net/hans/里); semantic retrieval; retained | 选择裏/裡对应内部义，不用里程、乡里义 |
| 中 zhōng | 一定范围以内 → I2 within scope | Medium–High | Low | Medium | [ZD-中](https://zdic.net/hans/中); semantic retrieval; retained | inside 不必位于中心；不用 zhòng 中选义 |

**声音评估：** 现代 /ɪnˈsaɪd/ 对 nèi/lǐ/zhōng 没有有力 whole-word 声音对应；内的韵母不能由片段倒排来补足。辅音组扩展 Not applicable。

**Shortlist：** 内；里

### Controls / counterexamples

| Control | Type | Why retained as control |
|---|---|---|
| 因 yīn | phonetic | 只似首音节；原因不是内部 |
| 赛 sài | phonetic | 只似后一片段；竞赛不是空间关系 |
| 内部 nèibù | semantic | 区域基线，非约束行为 |
| 里面 lǐmiàn | semantic | 方位基线，不暗示控制/限制 |

- inside a circle 不必有实体容器。
- inside information 的知情范围不等于物理内壁。

**Rejected / not selected：** 

**Evidence Pending：** Pending: 《现代汉语词典》《汉语大词典》《汉语大字典》等具体纸本条目/版本页码未取得；不伪造书证。 原始作者身份仍未知；没有提出 attribution update。

**Reuse：** CONTAINMENT identity boundary reused as structural contrast; no lexical genealogy or Featured inherited

**Reader-facing 提案：** 将来仅 Standard + Featured/Pending + 最多 1–3 个重要 scope；其余候选及反证进入 Research。本轮不生成页面。

## Family-aware reuse

复用 2 类历史证据包（ABASH、horrēre）到 3 条记录；复用 1 类结构范围边界（CONTAINMENT）到 INSIDE。共 4 条复用边，省去 4 次从零整理既有基础包；现代词义、词性、候选和评分仍逐条完成。未记录工时，因此不声称节省多少小时或百分比。HORROR 与 HORRID 共享证据，不算两个独立家族实验。

## Scheduler first-live-run audit

原 dry run 保持 dispatch_allowed=false：此次研究来自用户另行批准，并由本任务执行，不伪称已部署无人值守 Scheduler 服务。沿用冻结 selection，未重排、未补选、未派发 deferred 项。

原快照 181 输入行 / 149 对象 / 8 selected / 141 deferred：60 已处理或待审；42 benchmark 排除；19 identity/provenance queue；2 archive；4 duplicate scope；14 capacity deferred。完整 IDs/reasons 保存在 selection-manifest.json。没有打开 hidden targets。生产曝光状态写在本研究 sidecar，未静默修改 Registry。

Source Identity Gate：8 个英语形式可核；BOUND 的原始 intended sense 仍含糊，分四个同形来源研究，保留 control，不擅选其中一个入库。Scheduler 原 Gate 已说明只检完整性，因此这是新增 research-scope 限定，不把它误报为原程序验证失败。

Routing：研究者复核 8/8 保留原 primary pipeline；没有独立 adjudicator/gold，不能称为 100% routing accuracy。Unknown provenance 使 8/8 作者贡献不可归属，但没有阻止有范围的词义研究；不能推断它导致了 BOUND 多义。真实 human/AI/contributor 混合配比仍未在本批得到验证。

公开 deferred 示例：abandonment / abhorrence / abundance / absolve / acuity 均由原快照容量和顺序 deferred；本轮未研究它们。其余排除以原清单为准。

## Production metrics

```json
{
  "processed": 8,
  "outcome_counts": {
    "Control / Negative": 2,
    "Featured Pending": 4,
    "Ready for Editorial Freeze": 2
  },
  "featured_proposals": 2,
  "featured_pending_including_controls": 6,
  "serious_candidate_rows": 30,
  "semantic_baseline_rows": 25,
  "expansion_generated": 5,
  "expansion_outcomes": {
    "retained": 2,
    "not selected": 1,
    "semantic mismatch": 2
  },
  "control_rows": 32,
  "counterexample_statements": 16,
  "source_identity_unresolvable_forms": 0,
  "source_identity_scope_ambiguities": 1,
  "unknown_input_provenance": 8,
  "author_observations_downgraded": "N/A: no authenticated author observations in input",
  "new_to_current_record_useful_candidates": 25,
  "novelty_caveat": "Research-added comparisons, not a claim of global originality; not blind rediscovery",
  "routing_review": "8/8 primary routes retained by same research worker; descriptive self-review, not independent accuracy",
  "automatic_candidate_acceptance": 0,
  "published": 0,
  "average_serious_candidates": 3.75
}
```

扩展只计标记 phonetic expansion 的 5 行；其余 25 行来自 semantic retrieval。绑、蹦、律虽落入某组，但由语义产生，不能重复记作扩展收益。2 retained（绊、寒）/ 1 not selected（令）/ 2 semantic mismatch（怕、慌）/ 0 evidence-failure disposition。首次草稿按窄义排除绊/寒，补充核验发现束缚/害怕义后，于交付 Freeze Proposal 前修正；不伪称早期判断已冻结。这不是预注册盲测，不能证明别的 semantic-only 检索不会发现它们，也不报告 precision improvement。部分候选缺纸本证据不自动算 evidence-failure；本轮没有因找不到必需来源而独立淘汰的扩展项。

new_to_current_record_useful_candidates 指本报告 retained 的研究比较行，不声称此前全项目从未想过，也不是原创率。没有 authenticated author target，因此不报告作者候选命中、降级比例或 blind rediscovery。

## 建议

Scheduler v0.1 可以成为默认选批入口，但继续保留 Source Identity 范围确认与 Jinkai Liu Review Gate。下一批仍为 8 条：本批是一次执行，且全为 unknown origins，有同族相关样本，无法验证扩大到 10–12 后的质量和人工审核成本。无需第三条流水线或 schema 扩展，也不在本轮修改 Scheduler。

本轮停在八条 Editorial Freeze Proposal。Legacy 42 / Production 14 Active / 2 Archives 保持不变；不启动下一批。

## 验证结果

仓库 Schema、含 Evidence/Editorial 的 Language Book、Production、Observation、Scheduler validators 全部通过。完整回归从正确仓库目录运行：298/298 passed。首次从报告目录启动的运行出现相对路径 ENOENT，原日志保留，未当作产品失败隐去。

研究 sidecar 的选择一致性、引用、scope、状态边界检查通过；7 项故意非法升级均被拒绝。它们检查编辑契约，不证明语言学结论。现有 repository validators 仅验证未变动的生产数据，未伪称研究提案已通过 canonical ingestion。

受保护输入与原 scheduler 快照一致，测试后 Git working tree clean。未 commit/push/deploy。
