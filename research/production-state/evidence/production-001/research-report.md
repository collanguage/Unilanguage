# Production Research Queue — Batch 001

本轮为非盲生产研究；截止Editorial Freeze Proposal。Benchmark保持 Designed / Frozen / Execution Pending Isolated Evaluator。未运行任何benchmark。

## 隔离、作者身份与证据范围

保守排除Track A全部29、Track B全部10及有inventory ID的Track C控制，并做source identity检查。没有打开sealed target内容。Future Holdout在可访问输出中只有policy，未发现已填充pool；不推断外部不存在holdout。完整inventory已由本协调者读取，非保留项一律追加exposed状态，不能以后包装成新的blind holdout。详见isolation-manifest.json。

前六条来自旧AI extraction，没有可逐字归给作者的观察；LUMINOUS是旧hypothesis motivation，GAN有raw-note。保留原文与provenance，不把导入词义当作者原创。

中文采用汉典基本/详细解释的在线条目；不将其等同《现代汉语词典》等纸本核验，不使用混入页面的台湾国语辞典作为大陆正式依据。历史书证本轮是在线转录线索，未独立核纸本；中古/上古IPA不补造。欧洲历史使用Etymonline编纂摘要，原始文本首证仍有待精核。

Semantic Fit与Phonetic Fit独立；本批声音比较均Low。英语IPA为现代读音参考，不倒投古语。分组只记检索特征。

## 八条选择与最终状态

|ID / Source|选择理由|Pipeline|状态|Featured proposal|
|---|---|---|---|---|
|RQ-417206bbfa07 / TIME|Duration / moment / occasion separation; semantic baseline without expecting a sound winner|2 — Structural-Semantic|Featured Pending|Pending|
|RQ-e83d95e92d32 / CONTAINMENT|Test correction of imported container schema against actual containment restriction sense|2 — Structural-Semantic|Needs Targeted Verification|Pending|
|RQ-680eb4dd434f / MOVE|Motion and emotional effect permit a bounded structural comparison|1 — Lexical–Diachronic|Ready for Editorial Freeze|动 dòng — proposed Structural-Semantic Candidate; Phonetic Low|
|RQ-6c9011e4d1cb / CHANGE|Exchange vs alteration; preserve a semantic parallel without inventing common chronology|1 — Lexical–Diachronic|Ready for Editorial Freeze|易 yì — proposed Structural-Semantic Candidate; Phonetic Low|
|RQ-aa23b583d404 / BOUNDARY|Region / edge / limit distinction, plus a limited labial-group test|2 — Structural-Semantic|Ready for Editorial Freeze|Pending|
|RQ-844c76097b97 / PATH|Route versus traversal action; keeps uncertain deeper etymology explicit|2 — Structural-Semantic|Ready for Editorial Freeze|Pending|
|RQ-894dc4c4c357 / LUMINOUS|L hypothesis test with explicit lexeme/cluster separation|1 — Lexical–Diachronic|Needs Targeted Verification|Pending|
|RQ-d6832f467fc7 / GAN|Negative/weak identity case, deliberately not forced into a word or root|1 — Lexical–Diachronic|Archive / insufficient value|Pending|

## TIME — Research + Freeze Proposal

**Standard**：时间；具体时刻/次数须按语境另译。Source pronunciation：/taɪm/。

**Author Observation**：No verbatim author observation in inventory; do not attribute imported extraction to Jinkai Liu。

**Imported observation**：["时间 · temps"]；hypothesis：None。

**Provenance**：data/candidates/package-e-batch-001.v0.2.json /records/0; data/candidates/package-f-review-queue.v0.1.json /records/0; data/candidates/package-g-decision-register.v0.1.json /records/0

**Historical Stage Map**：
- T1 · Old English tīma · before 1100 · 有限时段、持续时间
- T2 · English time · late Middle English–present · 连续时间、时点与次数等不同用法；本项只研究时间

词源摘要来源：[Etymonline time](https://www.etymonline.com/word/time)。

**AI Research Result / Freeze Proposal**：时与期分别表示一般时间和限定时段；段仅在一段时间等构式比较。停止于古英语及现代义；不把更深重建当跨语言证据。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|时 shí|T1/T2 / 时间、时刻|High|Low — /t/与sh不相同；/aɪm/与shi韵尾不合|semantic / None|Retained — Not a whole-word substitute in every construction|[online entry](https://zdic.net/hans/时); print Pending|
|期 qī|T1 / 规定或限定的一段时间|High for bounded period|Low — /t/与q、韵核及/m/尾均不匹配|semantic / None|Retained — 不用 jī 周年义；不能覆盖所有 time|[online entry](https://zdic.net/hans/期); print Pending|
|段 duàn|T1/T2 construction / 事物或时间的一节|Medium; construction-scoped|Low — t/d组命中但/aɪm/≠/uan/，m/n不同|expansion / d-t-n-l|Retained — 一段时间中的量词/分段结构，不等于 time|[online entry](https://zdic.net/hans/段); print Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 钛 tài · phonetic · tai仅对应time部分声音，金属义无关
- 时期 shí qī · semantic · 适合period，不覆盖times=次数

**Counterexamples**：
- three times 是三次，不是三个时。
- a time of hardship 是时期，不是一个钟点。

**Shortlist**：时 / 期

**Rejected / not selected**：Controls不升级；不新造historical rejection

**Pending**：古英语具体文本日期及大陆纸本书证；不影响限定现代语义proposal

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Featured Pending。Historical Relation：Not claimed。

## CONTAINMENT — Research + Freeze Proposal

**Standard**：控制、抑制、阻止扩散；容纳/包含只作限定容器结构。Source pronunciation：/kənˈteɪnmənt/。

**Author Observation**：No verbatim author observation in inventory; do not attribute imported extraction to Jinkai Liu。

**Imported observation**：["容纳／包含 · contenance／inclusion"]；hypothesis：None。

**Provenance**：data/candidates/package-e-batch-001.v0.2.json /records/3; data/candidates/package-f-review-queue.v0.1.json /records/3; data/candidates/package-g-decision-register.v0.1.json /records/3

**Historical Stage Map**：
- C1 · Latin continēre · Classical Latin · 持在一起、容纳
- C2 · Old French contenir → English contain · medieval; English c.1300 onward · 约束/控制与包含义并存
- C3 · containment · 17th century–present · contain派生名词；现代限制扩散义另列

词源摘要来源：[Etymonline containment](https://www.etymonline.com/word/contain)。
- [sense reference](https://dictionary.cambridge.org/dictionary/english-chinese-simplified/containment)

**AI Research Result / Freeze Proposal**：把旧容纳/包含降为容器义scope；以遏制/控制检验现行词义。不是把空间容器概念当完整词典释义。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|容 róng|C1 / C2 contain / 容纳、盛|High for container; Low for restraining spread|Low — 与kənteɪn全词差异大|semantic / None|Retained — 容纳不等于控制火势、疫情的蔓延|[online entry](https://zdic.net/hans/容); print Pending|
|遏 è|C2/C3 / 阻止、抑制|High for restraint|Low — 无相应辅音或音节轮廓|semantic / None|Retained — Not a whole-word substitute in every construction|[online entry](https://zdic.net/hans/遏); print Pending|
|困 kùn|C3 trial / 围困、陷入困境|Medium/Low|Low — 只与非重读kən粗近，忽略teɪnmənt|expansion / g-k-h|Not selected — 围困对象≠所有containment；特定义域不泛化|[online entry](https://zdic.net/hans/困); print Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 肯 kěn · phonetic · 仅非重读首音节近似，允肯不是containment
- 控制 kòng zhì · semantic · 现代限制sense很强，不代表容器几何或同源

**Counterexamples**：
- containment of a fire 不是对火的宽容。
- container capacity 与 containment policy 不能同义评分。

**Shortlist**：遏 / 容

**Rejected / not selected**：困: 围困对象≠所有containment；特定义域不泛化

**Pending**：确定产品条目以哪一sense为主；若选择工程containment，须独立行业词典，不能套一般容器义

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Needs Targeted Verification。Historical Relation：Not claimed。

## MOVE — Research + Freeze Proposal

**Standard**：移动；搬动；使感动（分sense）。Source pronunciation：/muːv/。

**Author Observation**：No verbatim author observation in inventory; do not attribute imported extraction to Jinkai Liu。

**Imported observation**：["移动 · déplacer／bouger"]；hypothesis：None。

**Provenance**：data/candidates/package-e-batch-001.v0.2.json /records/5; data/candidates/package-f-review-queue.v0.1.json /records/5; data/candidates/package-g-decision-register.v0.1.json /records/5

**Historical Stage Map**：
- M1 · Latin movēre · Classical Latin · 使运动、移动
- M2 · Old French movoir / Anglo-French mover · medieval · 移动、使运动
- M3 · English move · late 13th century–present · 物理移动与情感触动；本轮不规定二者首次出现先后

词源摘要来源：[Etymonline move](https://www.etymonline.com/word/move)。
- [sense reference](https://dictionary.cambridge.org/dictionary/english-chinese-simplified/move)

**AI Research Result / Freeze Proposal**：拟以动为Structural-Semantic Candidate：身体运动与情感触动平行。不是两种语言共同历史演变。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|移 yí|M1/M3 physical / 移动、更换位置|High|Low — 无/m/及/v/对应|semantic / None|Retained — Not a whole-word substitute in every construction|[online entry](https://zdic.net/hans/移); print Pending|
|动 dòng|M3 physical/emotional / 离开静止；使感情变化|High; separate senses|Low — /m/与d、/uːv/与ong不近|semantic / None|Retained — 不是所有move构式都用单字动|[online entry](https://zdic.net/hans/动); print Pending|
|搬 bān|M3 transitive/relocation / 移动、迁移|High within scope|Low — m/b唇音组但鼻音/塞音不同，韵尾v/n不同|expansion / b-p-m-f|Retained — 搬重物/搬家适用；被诗感动不译搬|[online entry](https://zdic.net/hans/搬); print Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 木 mù · phonetic · m/u部分近似但木材不是移动；缺/v/
- 移动 yí dòng · semantic · 位置变化标准义，声音弱

**Counterexamples**：
- The speech moved me 不能译演说搬了我。
- move a resolution 为提出议案，本批不纳入动的全义claim。

**Shortlist**：动 / 移 / 搬

**Rejected / not selected**：Controls不升级；不新造historical rejection

**Pending**：具体古汉语动的感情义首证与大陆纸本定位；本proposal仅使用已见现代双义

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Ready for Editorial Freeze。Historical Relation：Not claimed。

## CHANGE — Research + Freeze Proposal

**Standard**：改变/变化；交换/更换（分sense）。Source pronunciation：/tʃeɪndʒ/。

**Author Observation**：No verbatim author observation in inventory; do not attribute imported extraction to Jinkai Liu。

**Imported observation**：["改变／变化 · changer／changement"]；hypothesis：None。

**Provenance**：data/candidates/package-e-batch-001.v0.2.json /records/6; data/candidates/package-f-review-queue.v0.1.json /records/6; data/candidates/package-g-decision-register.v0.1.json /records/6

**Historical Stage Map**：
- G1 · Late Latin cambiare · Late Latin · 交换、易货
- G2 · Old French changier · medieval · 改变、交换
- G3 · English change · c.1200–present · 改变、替换；名词零钱独立限制

词源摘要来源：[Etymonline change](https://www.etymonline.com/word/change)。

**AI Research Result / Freeze Proposal**：易具有交换/改变双义，作为结构语义平行proposal；声音Low。不采用更深弯曲→交换的确定叙事。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|易 yì|G1/G3 / 交换、改变|High for paired senses|Low — 英语塞擦音及尾音与yì不匹配|semantic / None|Retained — 不用容易义；不能当口语全构式直接替换|[online entry](https://zdic.net/hans/易); print Pending|
|换 huàn|G1/G3 / 交换、更改|High for replacement/exchange|Low — 起始音、元音与尾辅音不合|semantic / None|Retained — change colour 可为变色，不必存在对象交换|[online entry](https://zdic.net/hans/换); print Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 称 chēng · phonetic · 字母ch不是英语/tʃ/全同；称呼不是改变
- 改变 gǎi biàn · semantic · alteration强，但不是所有change包括零钱

**Counterexamples**：
- keep the change 的change是零钱。
- change colour 不要求互换两个物体。

**Shortlist**：易 / 换

**Rejected / not selected**：Controls不升级；不新造historical rejection

**Pending**：中文双义年代序列Pending；不要求它与欧洲历史同步

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Ready for Editorial Freeze。Historical Relation：Not claimed。

## BOUNDARY — Research + Freeze Proposal

**Standard**：边界 / 界限。Source pronunciation：/ˈbaʊndəri/。

**Author Observation**：No verbatim author observation in inventory; do not attribute imported extraction to Jinkai Liu。

**Imported observation**：["边界 · limite／frontière"]；hypothesis：None。

**Provenance**：data/candidates/package-e-batch-001.v0.2.json /records/10; data/candidates/package-f-review-queue.v0.1.json /records/10; data/candidates/package-g-decision-register.v0.1.json /records/10

**Historical Stage Map**：
- B1 · Old French bonde / English bound noun · 12th–14th century · 界限、界标；不是bind过去式
- B2 · English boundary · 1620s–present · 界限或分隔区域的标记/线

词源摘要来源：[Etymonline boundary](https://www.etymonline.com/word/boundary)。

**AI Research Result / Freeze Proposal**：界作为区域分隔和限制结构；畔只保留田界/边侧。boundary不是bound跳跃义的派生。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|界 jiè|B1/B2 / 区域边限、分界|High|Low — 首音、韵母和音节数不合|semantic / None|Retained — Not a whole-word substitute in every construction|[online entry](https://zdic.net/hans/界); print Pending|
|边 biān|B2 / 外缘、地区交界|High for edge|Low — 英语b有声与汉语b不送气不同；/aʊnd/与ian不合|semantic / None|Retained — 在身边可仅表示旁侧，不等于boundary|[online entry](https://zdic.net/hans/边); print Pending|
|畔 pàn|B1/B2 restricted / 田界、边侧|High for field boundary; Medium overall|Low — b/p组近但送气、韵母及d/后续音节不同|expansion / b-p-m-f|Retained — 河畔不必是行政边界；不能全义替换界|[online entry](https://zdic.net/hans/畔); print Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 棒 bàng · phonetic · b和鼻尾粗近，棒不是界线
- 界限 jiè xiàn · semantic · 强语义，不因此提高声音分

**Counterexamples**：
- bound as tied 不进入boundary名词来源链。
- 河畔表示附近，不必划分两地。

**Shortlist**：界 / 边 / 畔

**Rejected / not selected**：Controls不升级；不新造historical rejection

**Pending**：更深bodina/Gaulish来源仍不确定；大陆纸本田界书证Pending

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Ready for Editorial Freeze。Historical Relation：Not claimed。

## PATH — Research + Freeze Proposal

**Standard**：小路 / 路径 / 途径（依sense）。Source pronunciation：/pɑːθ/ (UK), /pæθ/ (US)。

**Author Observation**：No verbatim author observation in inventory; do not attribute imported extraction to Jinkai Liu。

**Imported observation**：["路径／道路 · chemin／trajet"]；hypothesis：None。

**Provenance**：data/candidates/package-e-batch-001.v0.2.json /records/14; data/candidates/package-f-review-queue.v0.1.json /records/14; data/candidates/package-g-decision-register.v0.1.json /records/14

**Historical Stage Map**：
- P1 · Old English paþ / pæþ · before 1100 · 步行形成的路、通道
- P2 · English path · present · 实体小路或路线；抽象途径作结构比较，不补首次年代

词源摘要来源：[Etymonline path](https://www.etymonline.com/word/path)。

**AI Research Result / Freeze Proposal**：径jìng对应小路；途tú对应路程/途径。path更深来源争议不用于推进中文同源。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|径 jìng|P1/P2 / 小路、道路或方法|High|Low — /p/与j及韵尾不相似|semantic / None|Retained — 仅jìng小路义；不用jīng历史经过义混读|[online entry](https://zdic.net/hans/径); print Pending|
|途 tú|P2 / 道路|High|Low — 英语/p/及/θ/无相应映射|semantic / None|Retained — 图论/计算机专义需另核|[online entry](https://zdic.net/hans/途); print Pending|
|步 bù|P1 trial / 行走、一步|Low for noun route|Low — p/b组但元音和θ不同|expansion / b-p-m-f|Semantic mismatch rejected — 走路动作/单位不是路本身|[online entry](https://zdic.net/hans/步); print Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 帕 pà · phonetic · /p/和开元音部分近；缺θ；帕巾不是path
- 小路 xiǎo lù · semantic · physical path很强，声音弱

**Counterexamples**：
- path是可走的路线，不是一次step。
- Iranian借词解释存在争议，不作为已证深源。

**Shortlist**：径 / 途

**Rejected / not selected**：步: 走路动作/单位不是路本身

**Pending**：抽象path首次年代；更深词源；计算机/数学分支不纳入本freeze

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Ready for Editorial Freeze。Historical Relation：Not claimed。

## LUMINOUS — Research + Freeze Proposal

**Standard**：发光的 / 明亮的。Source pronunciation：/ˈluːmɪnəs/。

**Author Observation**：No verbatim author observation in inventory; do not attribute imported extraction to Jinkai Liu。

**Imported observation**：[]；hypothesis：['UNI-L-LIGHT-CLUSTER-001: Untested']。

**Provenance**：data/hypotheses/l-light-semantic-cluster.v0.1.json /positive_observations/4

**Historical Stage Map**：
- L1 · Latin lumen / luminis → luminosus · Latin · 光；充满光/发亮
- L2 · English luminous · early 15th century–present · 发光或明亮

词源摘要来源：[Etymonline luminous](https://www.etymonline.com/word/luminous)。
- [sense reference](https://www.collinsdictionary.com/dictionary/english-chinese/luminous)

**AI Research Result / Freeze Proposal**：亮/明为已核现代语义；L→LIGHT总体假说仍Untested。不把luminous、lumen等同族视为独立实验正例。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|亮 liàng|L2 / 明、有光|High for bright|Low — 只有/l/相同，/uːmɪnəs/和iang不合|semantic / None|Retained — 亮物体可能只是反光，不一定自身发光|[online entry](https://zdic.net/hans/亮); print Pending|
|明 míng|L2 / 亮、清楚|High for bright|Low — 不是l起首；不能挑英语内部m当词首相同|semantic / None|Retained — Not a whole-word substitute in every construction|[online entry](https://zdic.net/hans/明); print Pending|
|朗 lǎng|L2 / 明亮、光线充足|Medium; scoped brightness|Low — 仅/l/相同，其余音节不匹配|expansion / same-onset L hypothesis; not group validation|Retained — 朗读的声音清楚义不等于发光|[online entry](https://zdic.net/hans/朗); print Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 鹿 lù · phonetic · /lu/局部近，动物义不支持light
- 发光的 fā guāng de · semantic · 标准译义强而声音不匹配

**Counterexamples**：
- L开头的词不都指光；鹿lù也不支持L必然光义。
- 多个同族light词不能重复算独立统计支持。

**Shortlist**：亮 / 明

**Rejected / not selected**：Controls不升级；不新造historical rejection

**Pending**：若以假说身份公开，需实验抽样单位与负例基线；目前词汇义ready但实验claim不ready

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Needs Targeted Verification。Historical Relation：Not claimed。

## GAN — Research + Freeze Proposal

**Standard**：未确定：无语言、词性、声调及可核source lexical identity。Source pronunciation：Not established; raw romanization only。

**Author Observation**：Repository raw-note; attribution inherited, no new authorship authentication。

> 干 gan，gun、gin，gen，generate。

以上为adjudicated supporting raw span。Inventory中较长的重述仅作为imported expanded wording保留在JSON，不冒充逐字作者原文。

**Imported observation**：["干; contextual proposal, reading/sense unresolved"]；hypothesis：['g-k-h (provisional spelling only) generation hypothesis; group hit ≠ evidence']。

**Provenance**：data/language-book.v1.0.json /entries/32/source/raw_note

**Historical Stage Map**：
- Pending / lexical identity not established; no invented chain.

**AI Research Result / Freeze Proposal**：暂存原文，不把gan命名成真实拉丁/日耳曼词根；gān干燥与gàn做不同，不能自动切成generate来源。

|Chinese / reading|Stage / precise sense|Semantic|Phonetic / reason|Retrieval|Disposition / counterevidence|Evidence|
|---|---|---|---|---|---|---|
|None|Unresolved identity|Not scoreable|Not scoreable|Not applicable|Do not invent source/candidate|Pending|

所有表内candidate为现代普通话层（现在）；历史义若未注明，不能反推年代。Historical Relation均Not claimed。

**Controls**：
- 干 gān · reading/sense control · 干燥/盾等义不可与gàn做事混用
- 干 gàn · reading/sense control · 做不自动等于生育/产生；未确定source不能比较
- 生 shēng · conditional semantic control · 仅当将来明确source为produce/beget才相关；本轮不将其算gan候选

**Counterexamples**：
- 无语言和词性时不能从无声调gan选择任意汉字义。
- generate的历史资料不能为所有gan/gun/gin串提供词源身份。

**Shortlist**：None

**Rejected / not selected**：gan identity not established; retain raw wording

**Pending**：作者若提供具体source语言、原句、读音可重新路由；无需为了生产批次数量搜索

**Reader-facing proposal**：Standard meaning + Featured (or Pending) + at most 1–3 scoped mappings; full controls in Research. Proposal only, not a page.

**Final status**：Archive / insufficient value。Historical Relation：Not claimed。

## Production metrics

四个最终状态互斥计数；Featured字段Pending另行计数。

```json
{
  "candidates_processed": 8,
  "ready_for_freeze": 4,
  "featured_pending_primary_status": 1,
  "targeted_verification_needed": 2,
  "archived": 1,
  "featured_pending_field_total": 6,
  "serious_candidate_records_considered": 20,
  "retained_scoped_candidate_records": 18,
  "average_serious_candidates_per_entry": 2.5,
  "controls": 17,
  "counterexamples": 16,
  "expansion_added": 6,
  "expansion_retained": 4,
  "expansion_not_selected": 1,
  "expansion_semantic_mismatch_rejected": 1,
  "expansion_evidence_failure": 0,
  "old_author_observations_newly_downgraded": 0,
  "old_author_observation_restriction_reaffirmed": [
    "gan: identity/reading ambiguity; prior raw/rejected status not counted again"
  ],
  "imported_editorial_glosses_scope_corrected": [
    "containment: 容纳/包含 is not the general restraint sense"
  ],
  "useful_new_to_selected_record_forms": [
    {
      "source": "time",
      "forms": [
        "期",
        "段"
      ]
    },
    {
      "source": "containment",
      "forms": [
        "遏"
      ]
    },
    {
      "source": "move",
      "forms": [
        "搬"
      ]
    },
    {
      "source": "change",
      "forms": [
        "易",
        "换"
      ]
    },
    {
      "source": "boundary",
      "forms": [
        "畔"
      ]
    },
    {
      "source": "path",
      "forms": [
        "途"
      ]
    },
    {
      "source": "luminous",
      "forms": [
        "亮",
        "明",
        "朗"
      ]
    },
    {
      "source": "gan",
      "forms": []
    }
  ],
  "novelty_definition": "New relative only to selected inventory proposed_chinese_mapping strings; NOT globally new to author/project and not independent rediscovery.",
  "causal_limit": "Manual bounded production pass; baseline/expansion labels are generation categories, not preregistered experimental arms. Retention is scope-specific research retention, NOT Featured acceptance or precision improvement.",
  "next_batch_recommendation": "Keep 8; do not expand to 10–15 before editorial review of two targeted cases and external-source/identity intake.",
  "new_useful_candidates_discovered_local": 11
}
```

本批4个扩展项保留的是限定研究价值，不是4个新Featured：段、搬、畔、朗。困暂不选，步对path名词错配。不能由此声称辅音扩展提高precision，也不能把普通语义候选数量称为原创发现。

## 下一步

建议先审核MOVE/CHANGE的结构候选及BOUNDARY/PATH的限定短名单；TIME接受Featured Pending；CONTAINMENT只定向确定主sense；LUMINOUS只核假说发布边界；GAN归档等待source identity。下一批维持8条，暂不扩大10–15条。没有自动Freeze、canonical creation或publication。

## 双层校验说明

仓库Schema与Evidence/Editorial Validator只证明现有数据未被破坏，不为本批新claim背书。本批研究记录另做完整性/证据边界检查，结果见validation.json；这是内部机械检查，不能代替Jinkai Liu编辑裁定。所有在线定义均限制在本条候选scope，无新增同源claim。

## Adjudicated provenance cross-check

以下沿用已审核身份，不重新判定作者身份：
- time: D — Package E declares created_by Codex extraction; target is an editorial bilingual/protocol gloss. No original author pair located; this target-instance permanently excluded.
- containment: D — Package E declares created_by Codex extraction; target is an editorial bilingual/protocol gloss. No original author pair located; this target-instance permanently excluded.
- move: D — Package E declares created_by Codex extraction; target is an editorial bilingual/protocol gloss. No original author pair located; this target-instance permanently excluded.
- change: D — Package E declares created_by Codex extraction; target is an editorial bilingual/protocol gloss. No original author pair located; this target-instance permanently excluded.
- boundary: D — Package E declares created_by Codex extraction; target is an editorial bilingual/protocol gloss. No original author pair located; this target-instance permanently excluded.
- path: D — Package E declares created_by Codex extraction; target is an editorial bilingual/protocol gloss. No original author pair located; this target-instance permanently excluded.
- luminous: E — L-hypothesis positive motivation/derivative record has no explicit Chinese target or author quote; classify provenance uncertain rather than invent authorship.
- gan: B — Original author sound/root/co-occurrence observation exists; no uniquely aligned Chinese target for this exact source identity. Do not borrow nearby word gloss or turn pinyin into an independent source word.
