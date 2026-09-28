# Production Batch 003 — Research & Freeze Proposals

本批仅研究提案，未接收进 Candidate Corpus。不是盲测，不产生 benchmark 分数。

选样：原28项中仅WAVE进入本批；另外7项来自同一115项inventory的未排期储备。已研究的COVER/LAND/FINGER/FARM不重跑；gin/gun/gen同GAN归档观察不循环使用；“爱在，世界就在”不重复AT文学层。保留原ID和provenance。

证据规则：中文优先大陆材料；本轮可读汉典基本/详细/词语解释作为研究辅助，不能冒充纸本《现汉》《汉大》等具体条目。国语辞典、百科不计作大陆正式证据。部分正文复读失败如实Pending。读音以现代词典读音/pinyin比较；未造中古/上古音。

Phonetic Fit：Low=只有选择性片段或无稳定相似；Medium=局部音段相似但有元音/声调等差异。Semantic/Structural独立人工研究判断，非总分。Retained只指限定研究候选，不等于Featured或证实。

## WAVE · RQ-e5b9fa065562

**状态：Featured Pending；Featured proposal：Pending。**

**Source Identity Gate：Pass。** English noun/verb wave; excludes capitalized Navy acronym Wave；/weɪv/

Standard：名词：波、波浪；动词：挥动/招手。水只限已有 literary/metonymic sense，不能覆盖全部 wave。 Primary：Cultural–Structural–Literary。

**Author Observation / imported context**：wave / water ↔ 水 / w; w 形状与水语义假说。 Repository raw-note preserved; pre-AI authorship not independently re-adjudicated。
旧编辑候选：水 / w; W shape observation, not a standard translation。

原出处：`data/batches/dataset-expansion-batch-001.v1.json#/deferred_queue/0/raw_note` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| W1 | wafian / Old English / before c.1100 | wave with the hands | Recorded ancestor of English verb; not WATER root | [Merriam-Webster: wave](https://www.merriam-webster.com/dictionary/wave) |
| W2 | wave / English / verb attested 14th c.; noun water ridge attested 1526; modern other senses | oscillatory motion, water-surface ridge, gesture, physical/figurative wave | Modern sense branches, not asserted strict chronology | [Merriam-Webster: wave](https://www.merriam-webster.com/dictionary/wave) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 波 bō | W2 | 水面起伏；波动/物理波 | High for noun | Low — /w/ versus Mandarin /p/; /eɪv/ versus /o/; not a regular correspondence | High: recurring variation | semantic retrieval / retained | 波不指所有挥手动作；water≠wave [汉典：波](https://www.zdic.net/hans/%E6%B3%A2) |
| 浪 làng | W2 | 水波/波浪 | High for water noun | Low — /l/ and /w/ differ, Mandarin nasal coda absent in wave | Medium | semantic retrieval / retained | 不能覆盖电磁波和挥手 [汉典：浪](https://www.zdic.net/hans/%E6%B5%AA) |
| 挥 huī | W1/W2 | 挥动、摇动手或物 | High for gesture/action | Low — /xw/ versus /w/ and /ei/ vs /eɪ/ offer limited local interest; English /v/ unmatched | Medium | semantic retrieval / retained | 不是 liquid noun；局部相似不等于全词声音强 [汉典：挥](https://www.zdic.net/hans/%E6%8C%A5) |
| 水 shuǐ | W2 | 水这种物质 | Low globally; limited literary metonymy | Low — /ʂw/ versus /w/, different rhyme and coda | Low | semantic retrieval / retained | MW permits literary water/sea; does not make normal wave=water nor validate W hypothesis [Merriam-Webster: wave](https://www.merriam-webster.com/dictionary/wave) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 波动 bōdòng | semantic / 起伏变动 | Semantic High; Phonetic Low | noun/process control |
| 挥手 huīshǒu | semantic / 挥动手 | Semantic High; Phonetic Low | gesture control |
| 威 wēi | phonetic / 威势 | Semantic Low; local sound Medium | /w/ and diphthong near; no wave meaning |
| 味 wèi | phonetic / 味道 | Semantic Low; local sound Medium | missing /v/, unrelated meaning |

- Radio wave 不以水为媒介，不能从 W 推断 WATER。
- Wave a hand 是动作；wave=水只在文学转喻范围可接受。

Shortlist：波 / 挥 / 浪。

Expansion scope：Not applicable

Rejected/not selected：无；不存在必须凑淘汰数的配额。

Pending：W形状假说仍不具有实验支持；本条不重跑 Experiment 002。；OE verb to noun derivation details beyond cited entry remain Pending. Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：Pending；Pending。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes：原记录保留；水从广义对应缩窄为文学转喻/作者实验观察。；No b-p-m-f expansion: /w/ not silently added to the approved group. Historical Relation = Not claimed。

## KNOWLEDGE · RQ-85c25b0fa6c8

**状态：Featured Pending；Featured proposal：Pending。**

**Source Identity Gate：Pass。** English noun knowledge, not French savoir verb；/ˈnɑlɪdʒ/ (US broad)

Standard：知识；具体知晓/了解须按构式，不把所有 awareness 都翻成知识。 Primary：Cultural–Structural–Literary。

**Author Observation / imported context**：没有可引用的作者原话。 No verbatim author statement available; prior editorial/imported observation is not author evidence。
旧编辑候选：知识 · connaissance／savoir。

原出处：`data/candidates/package-e-batch-001.v0.2.json#/records/4` @ `278885ae`; `data/candidates/package-f-review-queue.v0.1.json#/records/4` @ `278885ae`; `data/candidates/package-g-decision-register.v0.1.json#/records/4` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| K1 | knowlege / knowlechen / knowen / Middle English / 14th c. noun attestation | knowing/acknowledgement | Recorded English derivation; no know+ledge folk split | [Merriam-Webster: knowledge](https://www.merriam-webster.com/dictionary/knowledge) |
| K2 | knowledge / Modern English / modern | acquired knowledge / awareness of a fact | Separate current roles, not one obligatory Chinese noun | [Merriam-Webster: knowledge](https://www.merriam-webster.com/dictionary/knowledge) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 知识 zhīshi | K2 | 学习/实践所得的认识 | High for acquired content | Low — two syllables, different onset/rhyme/coda | Medium | semantic retrieval / retained | without my knowledge 要依构式译不知情，不是没有我的知识 [汉典：知识](https://www.zdic.net/hans/%E7%9F%A5%E8%AF%86) |
| 知 zhī | K1/K2 | 知道/学识；限定 zhī | High for knowing, scoped for noun | Low — /ʈʂ/ versus /n/; monosyllable vs polysyllable | Medium | semantic retrieval / retained | 知 zhì=智 不借用；不能让动词/名词自动等价 [汉典：知](https://www.zdic.net/hans/%E7%9F%A5) |
| 了解 liǎojiě | K2 | 知晓、理解某事 | High for awareness construction | Low — different syllables and onsets | Medium | semantic retrieval / retained | 特定义项和构式待纸本核；不覆盖知识总量 [汉典：了解](https://www.zdic.net/hans/%E4%BA%86%E8%A7%A3) |
| 念 niàn | K2 | 念头、思念/诵读 | Low for knowledge | Low — /n/ matches only; rest differs | Low | phonetic expansion / semantic mismatch | 有念头不意味着拥有知识；n-group does not license semantic equivalence [汉典：念](https://www.zdic.net/hans/%E5%BF%B5) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 学问 xuéwen | semantic / 学识 | Semantic High; Phonetic Low | learning/content only |
| 知情 zhīqíng | semantic / 知道情况 | Semantic High; Phonetic Low | awareness role |
| 糯 nuò | phonetic / 糯性 | Semantic Low; local sound Low | initial /n/ only |
| 脑 nǎo | phonetic / 脑 | Semantic Low; local sound Medium | organ supporting cognition is not knowledge |

- Knowing a fact 不等于相信/想到一个想法。
- French savoir 可以是名词也可为动词；不能作为 knowledge 全部语法等价。

Shortlist：知识 / 知。

Expansion scope：Modern /n/; silent written k is not a g-k-h onset.

Rejected/not selected：念 (semantic mismatch)

Pending：了解的具体词条复核；不扩展到法语第三语言研究。 Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：Pending；Pending。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes： Historical Relation = Not claimed。

## EXIST · RQ-dbf7cb31b8cd

**状态：Featured Pending；Featured proposal：Pending。**

**Source Identity Gate：Pass。** English intransitive verb exist；/ɪɡˈzɪst/

Standard：存在；特定构式可译有；生存/维持生活另限 animate/context。 Primary：Cultural–Structural–Literary。

**Author Observation / imported context**：没有可引用的作者原话。 No verbatim author statement available; prior editorial/imported observation is not author evidence。
旧编辑候选：存在 · exister。

原出处：`data/candidates/package-e-batch-001.v0.2.json#/records/7` @ `278885ae`; `data/candidates/package-f-review-queue.v0.1.json#/records/7` @ `278885ae`; `data/candidates/package-g-decision-register.v0.1.json#/records/7` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| E1 | ex(s)istere / Latin / Classical Latin; precise earliest citation not fixed | appear / come into being | ex- + sistere; whole form does not simply mean stand | [Merriam-Webster: exist](https://www.merriam-webster.com/dictionary/exist) |
| E2 | exsistere / exister / exist / Late Latin / Middle French / English / Late Latin → Middle French; English attested 1570 | have real being / be present; modern exist | Borrowing and semantic history as reported; no Chinese chronology inferred | [Merriam-Webster: exist](https://www.merriam-webster.com/dictionary/exist) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 存在 cúnzài | E2 | 具有实际存在状态 | High | Low — no reliable segmental correspondence to /ɪɡˈzɪst/ | High for existence relation | semantic retrieval / retained | 词条精确核验Pending；不等于物体可见 [汉典：存在](https://www.zdic.net/hans/%E5%AD%98%E5%9C%A8) |
| 有 yǒu | E2 | 有某物/存在；区别领有 | High in existential construction | Low — glide /j/ not source consonant; different rhyme | High but construction-specific | semantic retrieval / retained | 我有一本书的领有结构不等于我存在一本书 [汉典：有](https://www.zdic.net/hans/%E6%9C%89) |
| 现 xiàn | E1 | 出现、显露 | High for appear; Low for modern exist generally | Low — /ɕ/ compared with /z/ offers little full-word match | Medium | semantic retrieval / retained | 事物可存在而未显现；禁止现=exist无条件对应 [汉典：现](https://www.zdic.net/hans/%E7%8E%B0) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 生存 shēngcún | semantic / 继续活着 | Semantic High for survive role; Phonetic Low | not inanimate existence |
| 实有 shíyǒu | semantic / 确实存在 | Semantic High in restricted usage; Phonetic Low | not philosophical universal gold |
| 译 yì | phonetic / 翻译 | Semantic Low; Phonetic Low | initial vowel resemblance only |
| 锡 xī | phonetic / 金属锡 | Semantic Low; Phonetic Low | selective /i,s/ resemblance is insufficient |

- An undiscovered particle may exist without appearing to an observer.
- exist on little money 的 survive 用法不能泛化为全部存在。

Shortlist：存在 / 有 / 现。

Expansion scope：Not applicable

Rejected/not selected：无；不存在必须凑淘汰数的配额。

Pending：存在/有条目正文复读失败；纸本核验Pending。；不研究与归档CUN的声音串关系。 Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：Pending；Pending。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes： Historical Relation = Not claimed。

## DIRECTION · RQ-63f75c562c69

**状态：Ready for Editorial Freeze；Featured proposal：向 xiàng。**

**Source Identity Gate：Pass。** English noun direction; spatial focus, management/instruction secondary；/dəˈrɛkʃən/; /daɪˈrɛkʃən/

Standard：空间方向/朝向；指导、指示另列。 Primary：Cultural–Structural–Literary。

**Author Observation / imported context**：没有可引用的作者原话。 No verbatim author statement available; prior editorial/imported observation is not author evidence。
旧编辑候选：方向 · direction。

原出处：`data/candidates/package-e-batch-001.v0.2.json#/records/17` @ `278885ae`; `data/candidates/package-f-review-queue.v0.1.json#/records/17` @ `278885ae`; `data/candidates/package-g-decision-register.v0.1.json#/records/17` @ `278885ae`; `data/language-book.v1.0.json#/entries/16/related_words/4` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| D1 | dīrigere → dīrēctiō / Latin / Latin; exact attestation not fixed | direct / arrangement | Latin participial/nominal derivation; not dic-/dict- | [American Heritage: direction](https://ahdictionary.com/word/search.html?q=direction) |
| D2 | direction / Middle/Modern English / Middle English arrangement; modern spatial/guidance senses | course/orientation vs guidance/instructions | Sense branches; do not impose spatial-first timeline | [American Heritage: direction](https://ahdictionary.com/word/search.html?q=direction); [Merriam-Webster: direction](https://www.merriam-webster.com/dictionary/direction) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 向 xiàng | D2 | 方向、朝着某对象/方位 | High for directional relation | Low — /ɕj/ and /də/ differ; whole-word resemblance weak | High: orientation toward referent | semantic retrieval / retained | 不能替换全部 direction 名词，也不等于所有朝/往构式 [汉典：向](https://www.zdic.net/hans/%E5%90%91); [中国华文教育网《朝・向》](https://www.hwjyw.com/article/3982.html) |
| 方向 fāngxiàng | D2 | 朝向/行进所指的方位 | High for spatial noun | Low — different onsets, rhyme and syllable alignment | High | semantic retrieval / retained | 指南/操作 instructions 不总译方向 [汉典：方向](https://www.zdic.net/hans/%E6%96%B9%E5%90%91) |
| 导 dǎo | D1/D2 | 引导/指导 | High for directing action; scoped for direction noun | Low — initial d spelling hides /t/ Mandarin vs /d/ English; rhyme differs | Medium | semantic retrieval / retained | 管理行为≠空间向量 [汉典：导](https://www.zdic.net/hans/%E5%AF%BC) |
| 领 lǐng | D2 | 带领/引领 | Medium for guidance, Low for spatial noun | Low — /l/ versus /d/; group hit does not fix rhyme/length | Medium | phonetic expansion / retained | 仅 guidance 侧义研究候选，不替代空间Standard [汉典：领](https://www.zdic.net/hans/%E9%A2%86) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 朝向 cháoxiàng | semantic / 面对方向 | Semantic High; Phonetic Low | orientation control |
| 指导 zhǐdǎo | semantic / 引导 | Semantic High for management; Phonetic Low | sense-specific control |
| 滴 dī | phonetic / 液滴/滴落 | Semantic Low; Phonetic Low | source initial only |
| 笛 dí | phonetic / 乐器 | Semantic Low; Phonetic Low | shared onset cannot bridge meaning |

- Read the directions 是读说明，不是看空间方向。
- 向某人学习的目标关系不等于三维移动方向；朝与向并非全可互换。

Shortlist：向 / 方向 / 导。

Expansion scope：Modern initial /d/; compare d-t-n-l for retrieval only.

Rejected/not selected：无；不存在必须凑淘汰数的配额。

Pending：方向/导大型纸本条目Pending；不做全面介词替换规则。 Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：向 xiàng；Limited Structural-Semantic Candidate。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes：Proposal only: Featured is limited structural relation, not lexical identity or cognacy. Historical Relation = Not claimed。

## TRANSLATION · RQ-c6096ae58707

**状态：Featured Pending；Featured proposal：Pending。**

**Source Identity Gate：Pass。** English noun translation; process/result separated；/trænzˈleɪʃən/; /trænsˈleɪʃən/

Standard：语言转换过程=翻译；结果=译文；几何平移为独立现代技术义。 Primary：Lexical–Diachronic。

**Author Observation / imported context**：没有可引用的作者原话。 No verbatim author statement available; prior editorial/imported observation is not author evidence。
旧编辑候选：翻译 · traduction。

原出处：`data/candidates/package-e-batch-001.v0.2.json#/records/18` @ `278885ae`; `data/candidates/package-f-review-queue.v0.1.json#/records/18` @ `278885ae`; `data/candidates/package-g-decision-register.v0.1.json#/records/18` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| T1 | transferre / translātus / Latin / Classical Latin; exact attestations not fixed | carry/transfer and translate | Historical unit via translate: not inferred from modern spelling alone | [Merriam-Webster: translate](https://www.merriam-webster.com/dictionary/translate) |
| T2 | translater / translate; translation / Anglo-French / Middle English / English / English translate and translation attested 14th c. | render between languages | Verb family path attested; exact independent noun borrowing path Pending | [Merriam-Webster: translate](https://www.merriam-webster.com/dictionary/translate); [Merriam-Webster: translation](https://www.merriam-webster.com/dictionary/translation) |
| T3 | translation / Modern English / modern technical senses; dates Pending | geometric translation / transfer of representation | Independent sense comparison, not forced chronology | [Merriam-Webster: translation](https://www.merriam-webster.com/dictionary/translation) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 译 yì | T2 | 语言文字依意义改用另一语言文字 | High for language operation | Low — monosyllable /i/ vs entire multi-syllable source | Medium | semantic retrieval / retained | 不适用于全部几何/生物学 translation [汉典：译](https://www.zdic.net/hans/%E8%AF%91) |
| 翻译 fānyì | T2 | 语言转述过程；译文为结果 | High | Low — /f/ versus /tr/; no systematic full-word match | Medium | semantic retrieval / retained | 翻译过程、翻译者与译文须按词性/构式分开 [汉典：翻译](https://www.zdic.net/hans/%E7%BF%BB%E8%AF%91) |
| 移 yí | T1/T3 | 移动、更改位置 | High for transfer; scoped for geometry | Low — no onset match; different rhyme and word length | Medium | semantic retrieval / retained | 平移不包含旋转；移不是语言翻译的无条件同义词 [汉典：移](https://www.zdic.net/hans/%E7%A7%BB) |
| 通 tōng | T2 | 连通/通达、沟通 | Low–Medium for communication, not translation | Low — /tʰ/ vs /tr/ cluster; different rhyme | Low | phonetic expansion / not selected | 同一语言也能沟通；转换语言才是本次目标操作 [汉典：通](https://www.zdic.net/hans/%E9%80%9A) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 译文 yìwén | semantic / 翻译产物 | Semantic High; Phonetic Low | product versus process |
| 平移 píngyí | semantic / 不旋转的同向等量移动 | Semantic High for geometry; Phonetic Low | not proof that language transfer is geometry |
| 摊 tān | phonetic / 铺开 | Semantic Low; local Phonetic Low | cluster simplification is not a sound law |
| 兰 lán | phonetic / 兰花 | Semantic Low; local Phonetic Low | selective medial-syllable comparison |

- 译文是结果，翻译也是活动；不能单靠词形固定词性角色。
- Geometry translation 不等于任意 transformation，亦非语言词义必经历史阶段。

Shortlist：译 / 翻译 / 移。

Expansion scope：Modern /tr/ onset, t comparison only; never discard /r/ to inflate fit.

Rejected/not selected：通 (not selected)

Pending：本轮确认 translate family；translation 名词独立借入路径只作Pending，不补链。 Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：Pending；Pending。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes： Historical Relation = Not claimed。

## ACUTE · RQ-aa43773b0cfc

**状态：Featured Pending；Featured proposal：Pending。**

**Source Identity Gate：Pass。** English adjective acute; physical, mental, medical and angle senses separated；/əˈkjuːt/

Standard：尖锐的/敏锐的；急性的/严重的按义项；锐角仅角度义。 Primary：Lexical–Diachronic。

**Author Observation / imported context**：没有可引用的作者原话。 No verbatim author statement available; prior editorial/imported observation is not author evidence。
旧编辑候选：无预设中文目标。

原出处：`data/language-book.v1.0.json#/entries/26/related_words/0` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| A1 | acuere → acūtus / Latin / Classical Latin | sharpened/pointed, discerning, violent onset; angle sense | Latin already polysemous; not a single dated semantic ladder | [Merriam-Webster: acute](https://www.merriam-webster.com/dictionary/acute) |
| A2 | acute / Middle/Modern English / 14th c. English attestation, medical severity first cited; modern polysemy | sharp/sensitive/intense/rapid-onset/acute-angle | English sense branches; do not borrow acumen chronology | [Merriam-Webster: acute](https://www.merriam-webster.com/dictionary/acute) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 锐 ruì | A1/A2 | 尖锐/锐利；敏锐构式 | High within sharp/perceptive senses | Low — /ɻ/ versus /kj/; vowel and final consonant differ | High: scoped physical/mental parallel | semantic retrieval / retained | 急性病不能译锐病；继承ACUMEN Featured不是本条选中理由 [汉典：锐](https://www.zdic.net/hans/%E9%94%90); [汉典：尖锐](https://www.zdic.net/hans/%E5%B0%96%E9%8A%B3); [汉典：敏锐](https://www.zdic.net/hant/%E6%95%8F%E9%94%90) |
| 尖 jiān | A1/A2 | 末端细小尖锐 | High for pointed physical form | Low — /tɕ/ versus /kj/ cluster; /jɛn/ vs /uːt/ | Medium | semantic retrieval / retained | 不覆盖敏锐判断或急性疾病 [汉典：尖](https://www.zdic.net/hans/%E5%B0%96) |
| 敏 mǐn | A1/A2 | 灵敏；限定感知/理解 | High for perception | Low — /m/ versus /kj/; unmatched rhyme | Medium | semantic retrieval / retained | 不能覆盖锐角/尖端；单字义与敏锐复合词证据分开 [汉典：敏](https://www.zdic.net/hans/%E6%95%8F); [汉典：敏锐](https://www.zdic.net/hant/%E6%95%8F%E9%94%90) |
| 急 jí | A2 | 急迫/急性；rapid-onset构式 | High only urgent/acute compounds | Low — Mandarin /tɕ/ not English /kj/; no final /t/ | Medium | semantic retrieval / retained | 急性≠一律严重；不从急反推physical sharpness [汉典：急](https://www.zdic.net/hans/%E6%80%A5) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 尖锐 jiānruì | semantic / 锐利/尖锐 | Semantic High scoped; Phonetic Low | physical versus figurative |
| 敏锐 mǐnruì | semantic / 感知精细 | Semantic High; Phonetic Low | mental/perceptual sense |
| 哭 kū | phonetic / 哭泣 | Semantic Low; local sound Low–Medium | /kʰu/ resembles stressed nucleus only, /t/ absent |
| 去 qù | phonetic / 离去 | Semantic Low; local sound Low | no phonological justification for equating /tɕʰy/ and /kjuːt/ |

- Acute illness 的时间进程与 severe 的程度不同。
- Latin acūtus 已有多个义；不能把English physical→mental→medical绘成确证顺序。

Shortlist：锐 / 敏 / 急。

Expansion scope：Not run: vowel-initial whole word; no covert extraction of /k/ as a new rule.

Rejected/not selected：无；不存在必须凑淘汰数的配额。

Pending：锐/尖/敏/急纸本义项和年代；本轮不复核ACUMEN entry。 Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：Pending；Pending。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes：锐可保留高结构兴趣，但不因与旧条共享字而自动Featured。 Historical Relation = Not claimed。

## FILAMENT · RQ-0d3877658122

**状态：Featured Pending；Featured proposal：Pending。**

**Source Identity Gate：Pass。** English filament noun primary; French filament noun independently identified；English /ˈfɪləmənt/; French /filamɑ̃/

Standard：细丝/丝状物；灯丝、花丝等按专业 sense。 Primary：Lexical–Diachronic。

**Author Observation / imported context**：没有可引用的作者原话。 No verbatim author statement available; prior editorial/imported observation is not author evidence。
旧编辑候选：无预设中文目标。

原出处：`data/language-book.v1.0.json#/entries/30/related_words/1` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| F1 | filare → filamentum / Late / Medieval Latin / late/medieval; exact dates Pending | spin → thread-like formation | MW historical derivation; CNRTL Latin borrowing agrees on filamentum, detailed formation not over-unified | [Merriam-Webster: filament](https://www.merriam-webster.com/dictionary/filament); [CNRTL/TLFi: filament](https://www.cnrtl.fr/etymologie/filament) |
| F2 | filament / Middle French / English / French earliest citation Pending; English 1594 | thread / slender threadlike object or part | Borrowing into English; modern specialist branches not ancestry | [Merriam-Webster: filament](https://www.merriam-webster.com/dictionary/filament); [CNRTL/TLFi: filament](https://www.cnrtl.fr/etymologie/filament); [CNRTL/TLFi: filament pronunciation](https://www.cnrtl.fr/definition/filament) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 丝 sī | F2 | 丝及细长似丝物 | High for threadlike structure | Low — /s/ vs /f/; length and rhyme mismatch | High | semantic retrieval / retained | 生物/灯泡的filament不都是蚕丝 [汉典：丝](https://www.zdic.net/hans/%E4%B8%9D) |
| 纤维 xiānwéi | F2 | 纤细丝状结构 | Medium–High depending material/discipline | Low — /ɕ/ vs /f/; no full-word match | Medium | semantic retrieval / retained | 单丝、纤维束和花丝不完全同类；专业定义Pending [汉典：纤维](https://www.zdic.net/hans/%E7%BA%A4%E7%BB%B4) |
| 缕 lǚ | F2 | 细线；亦可作量词 | Medium scoped | Low — /l/ compares medial /l/ only; /y/ differs | Medium | semantic retrieval / retained | 量词一缕不等于任何filament名词 [汉典：缕](https://www.zdic.net/hans/%E7%BC%95) |
| 纺 fǎng | F1 | 把纤维制成纱线 | High for filare=spin, not modern noun | Low — /f/ shared with modern family form; /ɑŋ/ vs /ɪl/ or /ila/ differs; historical pronunciation not reconstructed | Medium | phonetic expansion / retained | 只留历史动词单位；不写 filament=纺 [汉典：纺](https://www.zdic.net/hans/%E7%BA%BA); [Merriam-Webster: filament](https://www.merriam-webster.com/dictionary/filament) |
| 缝 féng | F1/F2 | 针线缝合 | Low–Medium related craft, not spinning/thread | Low — /f/ match only; /əŋ/ vs source remainder | Low | phonetic expansion / not selected | 缝合利用线，不是纺线；fèng=缝隙不混用 [汉典：缝](https://www.zdic.net/hans/%E7%BC%9D) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 细丝 xìsī | semantic / 细长丝状物 | Semantic High; Phonetic Low | general structural equivalent |
| 灯丝 dēngsī | semantic / 灯泡内发光细丝 | Semantic High specialized; Phonetic Low | specialist subset only |
| 肥 féi | phonetic / 肥胖/肥沃 | Semantic Low; local sound Low | f-initial alone |
| 肺 fèi | phonetic / 呼吸器官 | Semantic Low; local sound Low | f-initial does not establish thread meaning |

- A tungsten filament 是钨丝而非蚕丝，形状比较不能偷换材料。
- English /ˈfɪləmənt/ 与 French /filamɑ̃/ 分开；fille 不因近形进入thread链。

Shortlist：丝 / 纺 / 缕。

Expansion scope：f-initial family; historical filare unit fixed before evaluating 纺; not a noun translation.

Rejected/not selected：缝 (not selected)

Pending：French最早书证及filamentum构词细节Pending；English及French词身份已确认。；纤维/花丝等专门术语的具体词条另限范围。 Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：Pending；Pending。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes： Historical Relation = Not claimed。

## LONG · RQ-4d9a99ebe809

**状态：Ready for Editorial Freeze；Featured proposal：长 cháng。**

**Source Identity Gate：Pass。** English adjective/adverb long length/duration; verb long for segregated；/lɒŋ/ (UK); /lɔŋ/ (US variant)

Standard：长的/长时间；本条不以 long for=渴望 为主对象。 Primary：Lexical–Diachronic。

**Author Observation / imported context**：没有可引用的作者原话。 No verbatim author statement available; prior editorial/imported observation is not author evidence。
旧编辑候选：无预设中文目标。

原出处：`data/hypotheses/l-light-semantic-cluster.v0.1.json#/negative_controls/4` @ `278885ae`。精确选中记录和hash核对见 provenance-check.json。

### Historical / meaning map

| ID | Form / language / period | Meaning | Relation / scope | Evidence |
|---|---|---|---|---|
| G1 | long / lang / Old English / Middle English / before 12th c. attestation | great length; inherited adjective | Related Germanic forms; Latin longus is a relative, not English direct ancestor | [Merriam-Webster: long](https://www.merriam-webster.com/dictionary/long) |
| G2 | long / Modern English / modern | great spatial extent or duration | Synchronic space/time comparison; no claimed Chinese chronological parallel | [Merriam-Webster: long](https://www.merriam-webster.com/dictionary/long) |

### AI candidate table

以下中文全部属于现代普通话层；与欧洲阶段不要求同代。历史中文书证若未核版，不冒充已证历时演变。所有 Historical Relation = Not claimed。

| Form / reading | Source stage | Meaning | Semantic | Phonetic / reason | Structural | Generation / status | Counterevidence / sources |
|---|---|---|---|---|---|---|---|
| 长 cháng | G1/G2 | 空间距离大或时间延续久；与短相对 | High | Low — /ʈʂʰɑŋ/ vs /lɒŋ/: nasal rhyme similarity, onset differs | High: measurable extent across space/time | semantic retrieval / retained | zhǎng=成长/长辈不混入；long for不译长 [汉典：长](https://www.zdic.net/hans/%E9%95%BF) |
| 久 jiǔ | G2 | 时间长 | High for duration; Low for length | Low — /tɕjoʊ/ vs /lɒŋ/ differs | Medium | semantic retrieval / retained | 不能说一根久的绳子 [汉典：久](https://www.zdic.net/hans/%E4%B9%85) |
| 延 yán | G2 | 延长/延续 | Medium: process increasing extent | Low — /jɛn/ vs /lɒŋ/; no aligned onset | Medium | semantic retrieval / retained | 动作延长≠形容词已经很长 [汉典：延](https://www.zdic.net/hans/%E5%BB%B6) |
| 连 lián | G2 | 相连/连续 | Low–Medium for continuity only | Low — /l/ matches but rhyme differs | Medium | phonetic expansion / not selected | 连续未必长，短链也可连续 [汉典：连](https://www.zdic.net/hans/%E8%BF%9E) |
| 隆 lóng | G2 | 高起/盛大 | Low for length/duration | Medium local segmental resemblance — /l/ and /ŋ/ align, /ʊ/ versus /ɒ,ɔ/ differs and tone unpaired | Low | phonetic expansion / semantic mismatch | 隆长复合词的长/久不能反推隆单字=long；height≠length [汉典：隆](https://www.zdic.net/hans/%E9%9A%86); [汉典：隆长](https://www.zdic.net/hans/%E9%9A%86%E9%95%B7) |

### Controls / counterexamples

| Control | Role | Fit | Boundary |
|---|---|---|---|
| 长久 chángjiǔ | semantic / 持续很久 | Semantic High for duration; Phonetic Low | duration baseline |
| 绵长 miáncháng | semantic / 延续很长 | Semantic High scoped; Phonetic Low | extent/continuity |
| 龙 lóng | phonetic / 龙 | Semantic Low; local sound Medium | dragon morphology is cultural association, not long meaning |
| 笼 lóng | phonetic / 笼子 | Semantic Low; local sound Medium | shared l/ŋ does not imply length |

- long begins with L but does not mean light; individual case cannot measure entire L-cluster hypothesis.
- Long for home 是渴望；长辈 zhǎng 与长 cháng不混读。

Shortlist：长 / 久。

Expansion scope：Modern /l/ d-t-n-l retrieval; L→光 remains Untested, not validated or globally refuted here.

Rejected/not selected：连 (not selected)；隆 (semantic mismatch)

Pending：Imported pie_del_1 label not independently deep-etymology verified; retained as imported grouping, not active PIE claim。；中文空间/时间义共存有在线支持；确切演变先后及纸本Pending。 Mainland-first: online Chinese entry/support as individually marked; 《现代汉语词典》《新华字典》《汉语大词典》《汉语大字典》《辞源》具体版次/页码/条目 Pending. No publisher introduction used as entry proof.

Freeze proposal：长 cháng；Limited Structural-Semantic Candidate。Standard sense + Featured Candidate/Pending + at most 1–3 relevant comparisons; controls and raw observations in Research layer.

Editorial notes：既有实验负例身份保留，但不是 benchmark-specific control；本条作为新的独立Production词义研究，不重跑实验。 Historical Relation = Not claimed。

## Source access / limits

Merriam-Webster为本轮英语词义/历史主要来源；AHD补DIRECTION真实历史单位；CNRTL的FILAMENT历史页复读失败，仅使用可见检索摘要和现代法语读音，最早法语例证不填。中文访问存在正文复读失败及直接HTTP403，未绕过限制。

| Source | Scope | Status |
|---|---|---|
| [Merriam-Webster: wave](https://www.merriam-webster.com/dictionary/wave) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: knowledge](https://www.merriam-webster.com/dictionary/knowledge) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: exist](https://www.merriam-webster.com/dictionary/exist) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: direction](https://www.merriam-webster.com/dictionary/direction) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: translation](https://www.merriam-webster.com/dictionary/translation) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: translate](https://www.merriam-webster.com/dictionary/translate) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: acute](https://www.merriam-webster.com/dictionary/acute) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: filament](https://www.merriam-webster.com/dictionary/filament) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [Merriam-Webster: long](https://www.merriam-webster.com/dictionary/long) | English identity, selected senses, and Word History where present; not Chinese mapping evidence | Entry inspected; paraphrase only |
| [American Heritage: direction](https://ahdictionary.com/word/search.html?q=direction) | Latin dīrēctiō / dīrigere, Middle English arrangement; modern senses | Entry inspected; paraphrase only |
| [CNRTL/TLFi: filament](https://www.cnrtl.fr/etymologie/filament) | Latin filamentum borrowing into French; precise earliest French citation remains Pending | Etymological search excerpt inspected; repeated full-page fetch failed |
| [CNRTL/TLFi: filament pronunciation](https://www.cnrtl.fr/definition/filament) | Modern French noun and /filamɑ̃/ | Search excerpt inspected; page refetch failed |
| [中国华文教育网《朝・向》](https://www.hwjyw.com/article/3982.html) | 2022-05-02 华文教学通讯: directional constructions and limits of 朝/向 substitution | Entry inspected; paraphrase only |
| [汉典：波](https://www.zdic.net/hans/%E6%B3%A2) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：浪](https://www.zdic.net/hans/%E6%B5%AA) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：挥](https://www.zdic.net/hans/%E6%8C%A5) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：知识](https://www.zdic.net/hans/%E7%9F%A5%E8%AF%86) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：知](https://www.zdic.net/hans/%E7%9F%A5) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：了解](https://www.zdic.net/hans/%E4%BA%86%E8%A7%A3) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Specific entry not retrieved this run; ordinary-use candidate, lexicographic verification Pending |
| [汉典：念](https://www.zdic.net/hans/%E5%BF%B5) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：存在](https://www.zdic.net/hans/%E5%AD%98%E5%9C%A8) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：有](https://www.zdic.net/hans/%E6%9C%89) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：现](https://www.zdic.net/hans/%E7%8E%B0) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：向](https://www.zdic.net/hans/%E5%90%91) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：方向](https://www.zdic.net/hans/%E6%96%B9%E5%90%91) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Specific entry not retrieved this run; ordinary-use candidate, lexicographic verification Pending |
| [汉典：导](https://www.zdic.net/hans/%E5%AF%BC) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：领](https://www.zdic.net/hans/%E9%A2%86) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：译](https://www.zdic.net/hans/%E8%AF%91) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：翻译](https://www.zdic.net/hans/%E7%BF%BB%E8%AF%91) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：移](https://www.zdic.net/hans/%E7%A7%BB) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：通](https://www.zdic.net/hans/%E9%80%9A) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：锐](https://www.zdic.net/hans/%E9%94%90) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：尖](https://www.zdic.net/hans/%E5%B0%96) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：敏](https://www.zdic.net/hans/%E6%95%8F) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：急](https://www.zdic.net/hans/%E6%80%A5) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：丝](https://www.zdic.net/hans/%E4%B8%9D) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：纤维](https://www.zdic.net/hans/%E7%BA%A4%E7%BB%B4) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：缕](https://www.zdic.net/hans/%E7%BC%95) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：纺](https://www.zdic.net/hans/%E7%BA%BA) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：缝](https://www.zdic.net/hans/%E7%BC%9D) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：长](https://www.zdic.net/hans/%E9%95%BF) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：久](https://www.zdic.net/hans/%E4%B9%85) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：延](https://www.zdic.net/hans/%E5%BB%B6) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：连](https://www.zdic.net/hans/%E8%BF%9E) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Page resolved but full relevant sense not recovered on repeat; detailed verification Pending |
| [汉典：隆](https://www.zdic.net/hans/%E9%9A%86) | Only 基本解释/详细解释/词语解释; not 国语辞典/百科 as Mainland proof; no new historical chronology | Entry/search excerpt inspected; large printed dictionary entry Pending |
| [汉典：隆长](https://www.zdic.net/hans/%E9%9A%86%E9%95%B7) | Compound 高而长 / 宏大而长久; does not establish standalone 隆 = long | Entry inspected; paraphrase only |
| [汉典：敏锐](https://www.zdic.net/hant/%E6%95%8F%E9%94%90) | Perceptual sharpness; compound support, not independent history of 敏 | Entry inspected; paraphrase only |
| [汉典：尖锐](https://www.zdic.net/hans/%E5%B0%96%E9%8A%B3) | Physical pointedness and figurative incisiveness; no dated causal sequence | Entry inspected; paraphrase only |
