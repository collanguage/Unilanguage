# Tier C Discovery Batch 1 — ABACK / SOUND / MEDIA

Discovery only · 2026-09-20 · 基线 `be8bc2dcb1d3f517ba41bbaa2dacc8574335565b`。采用已批准的 Diachronic Cross-Language Mapping Model v0.1 与 Candidate Discovery Protocol v0.2。**本轮没有修改 entry、schema、页面或其他仓库文件，没有 commit / push / deploy。**

本轮的主要结果是重新限定比较单位，而不是找到三个新的同音汉字。三条均可提交 **Editorial Freeze**，但这不是发布许可：词义对应与历史来源已有足够边界；纸本辞书、历史音和方言证据的 Pending 继续保留。

|Entry|本轮 shortlist，按研究优先级|建议比较单位|最终状态|
|---|---|---|---|
|ABACK|背 bèi；却 què；蒙 mēng（了）|背只比较 back 历史成分／后部义；却研究退却；蒙限突发失措|**Ready for Editorial Freeze**|
|SOUND|声 shēng；响 xiǎng；嗓 sǎng（限人声）|现代 auditory whole-word lexical mapping 优先；嗓为限定义子类|**Ready for Editorial Freeze**|
|MEDIA|媒 méi；介 jiè|媒对应 intermediary；介对应 BETWEEN／INTERMEDIATE 结构|**Ready for Editorial Freeze**|

不要求 shortlist 都成为 Featured。语义控制“愕、退、音、中、间”等完全可能比某个音组候选更适合解释阶段；它们没有因声音弱而被删除。**所有跨语言 Historical Relation = Not claimed。**

完整交付：

- [39 项完整 Candidate Table，包括全部控制与淘汰项](pending-final-candidates.md)
- [可复核的候选数据与运行记录 JSON](../../data/review/pending-final-discovery.json)
- 本报告：历史阶段、Meaning Freeze、评分规则、shortlist、Pending 与方法评价。

## 1. 证据与评分口径

本轮首先读取现有三个 records 的现代义、Featured、原始作者笔记与来源。现有基线为 ABACK 的背，SOUND 的声／响，MEDIA 的媒／中间；不把它们当答案。检索先用“后方／向后／退却／惊愕”“声音／发声／人声”“中间／介于／中介／媒人”等语义种子，再补查规定的声母组。完整表是这个**有限检索范围**的全部被评估项，不是整个汉语的候选全集。

Semantic Fit：direct / partial / indirect / mismatch，均限定本行义项。Phonetic Fit：只比较明确的整个词或明确的成分，分辨声母、韵核、韵尾、音节及韵律。中文 pinyin 是词条读音；表中的少量方括号是本轮宽式音段分析，不是方言实测。英语现代参考读音来自 Oxford：aback /əˈbæk/、back /bæk/、sound /saʊnd/、media /ˈmiːdiə/。历史阶段没有可靠音值时明确 **not_evaluated**，不能拿现代读音冒充古音。[Oxford aback](https://www.oxfordlearnersdictionaries.com/definition/english/aback)、[back](https://www.oxfordlearnersdictionaries.com/definition/english/back_1)、[sound](https://www.oxfordlearnersdictionaries.com/definition/english/sound_1)、[media](https://www.oxfordlearnersdictionaries.com/definition/english/media)。

没有候选获得 strong 的整词声音等级。partial 只表示可描述的局部音段接近，绝不等于规则音变。评价信心：现代词义范围与明显错配多为 High；宽式声音相似度为 Medium 的分析判断；古音、语义首证与方言路径未冻结部分为 Unknown / Pending。没有综合总分。

中文证据按命题分级：

- 汉典的具体“基本／详细解释、词语解释”可直接支持它所列的当代义与拼音；其“国语辞典”栏不作 Mainland 正式证据，百科栏也不作词源依据。
- 识典古籍确实展示了标名《汉语大词典》的**背、聲、媒、介条目摘要**，并非出版社介绍。本轮作为 mediated 词条证据；尚未取得具体版次、原页及完整书证，不升级为直接纸本核验。[背](https://www.shidianguji.com/character/背)、[聲](https://www.shidianguji.com/character/聲)、[媒](https://www.shidianguji.com/character/媒)、[介](https://www.shidianguji.com/character/介)。
- 《现代汉语词典》《新华字典》《汉语大字典》《辞源》及大陆整理古籍的所需具体原条仍 Pending。网页转引《说文》《广韵》不能宣称已经核过这些整理本。
- 汉语历史拟音专项另引作者自己的 Baxter–Sagart 数据，不用非大陆拟音材料替代 Mainland 中文词义证据。
- 未获得足以固定地点、调查年代、义项与音值的方言条目，**不新增方言赢家**。这是该证据层 Pending，不是“所有方言 None found”。

## 2. ABACK

### Historical Stage Map 与 Meaning Freeze

|ID|Source form / language / approximate period|冻结义及关系|是否寻找中文|
|---|---|---|---|
|A0，成分节点|`bæc`，Old English（约450–1100）；现代 `back` 只作可核声音参照|背部／后部。它是构词成分，不是 aback 整词的前一版拼写|背可比较此成分；古英语具体音值 Pending|
|A1|`on bæc` → `aback`，OE→ME（约1100–1500）|在后／向后；短语凝固。位置与向后运动分成检索子域，不凭空造一个“反转义”历史词形|背后、退、却；反／返、北作为边界候选|
|A2|`aback / taken aback`，英语航海用法，早期现代英语；所查资料列1754的构式见证|帆的前表面承受风，正常前进被阻；不是“返航”或“整个船掉头”|使用反向／退却作解释控制；精确汉语航海术语 **Pending**|
|A3|`taken aback`，晚18世纪后至现代；资料列1792比喻见证|突遇情况而惊讶、受冲击、失措。现代冻结单位是构式，不能只把副词译成后背|愕为强语义控制；蒙了为受限口语候选；怕待淘汰|

Oxford 支持 `on bæc` 的历史来源与现代惊讶构式；MW 同时列向后、帆受风及惊讶三义。Etymonline 为1754／1792提供本轮采用的历史说明，但这些是所查辞书报告的见证时间，不宣称绝对最早。MW 的“12世纪以前”与 Etymonline 的“约1200”口径不同，本轮保留范围而不硬选单一年。[Oxford](https://www.oxfordlearnersdictionaries.com/definition/english/aback)、[MW](https://www.merriam-webster.com/dictionary/aback)、[Etymonline](https://www.etymonline.com/word/aback)。

**movement / reversal 没有被强建成额外必经阶段。** 向后运动是 A1 的子域；被反向风阻住是 A2 的具体情境。A2→A3 可解释为从行动受阻到心理失措的比喻发展，不能夸成严格反义化。更深 `back` 日耳曼来源在资料中有重建，域外联系未明；本轮止于此，不借“背”的形义补 PIE。

### Shortlist 与旧 Mapping 校准

1. **背 bèi（A01）**：保留为 `back` 成分的音义候选。后背义强，现代声音仅 weak；/bæk/ 与 bèi 并不同音。`aback ↔ 背` 必须标成 component comparison，不能充当 A3 标准翻译。背后（A02）更直接表达位置，但不另算一个音义成功。[汉典背](https://zdic.net/hans/背)。
2. **却 què（A04）**：新发现的高价值**语义阶段候选**；退却义合适，声音不合。不能因为 English back 有末尾 /k/ 就把普通话 q 声母算成 g-k-h 命中。[汉典却](https://zdic.net/hans/却)。
3. **蒙 mēng（了）（A08）**：适合“突发消息使人一时反应不过来”的 A3 子义。比怕更贴近失措，仍比普通 surprise 窄；声音 weak。杜永道2019年的大陆语言专栏明确区分“蒙了”的 mēng 与“懵懂”的 měng，因而本轮不保留未分义的“懵”作为候选赢家。[《人民日报海外版》2019-03-02第5版，杜永道语言栏目](https://paper.people.com.cn/rmrbhwb/page/2019-03/02/05/rmrbhwb2019030205.pdf)。

**控制与淘汰**：退、愕（然）是声音不合但意义强的控制；白、百有相近唇塞起首却完全不同义。怕只表示恐惧，不能代表一切意外惊讶；懵的无知状态不等于突然蒙住；反／返的回归原点不能替代帆受反向风；北的败逃义附带军事限制。保留这些记录，不把每个相关词都列为赢家。

**应拒绝的旧 claim**：`a-` 在这里无意义；字母 a 的名称可以代表 aback 的首音；back 与背“同音”；背可以不分词性直接作现代“吃惊地”之映射。诗歌《文明在你背后》仍属于文学层，研究结论不要求删诗；本轮也没有修改页面。

**Evidence Pending**：航海构式的历史原文及确切汉译；背／却的指定大陆纸本条目与义项书证；蒙的专栏与最新规范辞书交叉核验；北的败逃义若做古音比较需单独绑定对应词义。状态：**Ready for Editorial Freeze**，但只冻结上述边界，A2 可明确 Pending。

## 3. SOUND

### Historical Stage Map：分支，不能串成一条链

|ID / family|Source form / period|冻结义与词史边界|Chinese Mapping 范围|
|---|---|---|---|
|S-A1 acoustic，Latin|`sonus`（名词）、`sonāre`（动词），古典拉丁语层，约前1世纪—后2世纪作为层标签，非首证日期|声音／发声；两词同家族，不能把名词和动词词性抹掉|古义可检索声／音，但不自动评分拉丁音|
|S-A2 acoustic，medieval forms|Anglo-French `son / sun / soun`、相关动词 `soner / suner`；Middle English `soun / sounen`，中世纪，英语13世纪有见证|借入并延续声音义。AF与ME记录各自语言，合并展示只因义项连续，不是混成一种语言|不强配新汉字；历史语音 **Pending**|
|S-A3 acoustic，modern|`sound`，现代 /saʊnd/；末尾-d在中古后期至16世纪定型|声音名词／发声动词；名词、动词分别比较|声／声音；响；受限人声嗓|
|S-H healthy，独立支|OE `gesund` → ME / modern `sound`，古英语层至今|健康无损，后有牢靠、无缺陷等引申。不是 sonus 的一个义变阶段|健为健康义控制；其他义不强配字|
|S-P probing，独立支|French `sonde / sonder` → ME / modern `sound`，英语约14—15世纪起|测水深、探察，后来试探意见。法语前史与 sund 的联系有 probably / perhaps 限定|探／测（深）为义项隔离控制|
|S-W water，边界控制支|OE / Old Norse `sund` → English `sound`（水道），中世纪至今|水域／游泳相关词族。与测深支可能有关，不与 acoustic 支合并|本轮 **Not selected**，不扩展中文池|

MW 明确分列同形词；Oxford 给出 auditory `soun` 的来源及 -d 定型边界；CNRTL 的 son 条提供法语多种听觉用例。OE `swinn` 等即使被列为 acoustic 家族的亲缘比较，也不是 English sound 的直接日耳曼祖先。[MW sound](https://www.merriam-webster.com/dictionary/sound)、[Oxford sound](https://www.oxfordlearnersdictionaries.com/definition/english/sound_1)、[CNRTL son](https://www.cnrtl.fr/etymologie/son/substantif)。

深源说明：Etymonline 把 acoustic 支联系到重建的 *swen- 一系，把健康支列为另一日耳曼词源，把水道支关联游泳。**相似的重建拼写不能抹去词族分支。** 测深支更早来源带不确定性，资料对年代亦有14／15世纪差异；CNRTL sonde/sonder本轮正文访问失败，不能把搜索摘要当已解决争议。[Etymonline sound](https://www.etymonline.com/word/sound)。

### 三种 Mapping 类型的判断

|类型|判断|理由|
|---|---|---|
|Whole-word lexical mapping|**当前最合适**|现代 sound 的听觉义→声／声音；不及物发声→响。语义可直接核验，不依赖声音很像|
|Historical-root mapping|**Pending，不能优先发布**|拉丁／法语历史音层尚未冻结；不能用现代 sǎng/sòng 的声音去冒充古代 sonus 对应|
|Sound-symbolic mapping|**仅 Research 子类型**|嘶、飒、啧可研究特定声象，但“表示声音”不等于“本词是拟声词”；本轮没有实验或历史证据证明 sound↔声的拟声生成关系|

### Shortlist、控制、淘汰

1. **声 shēng（S01）**：保留现代声音义 lexical candidate；语义 direct，声音 weak。/s/ 与 /ʂ/ 不同，韵核和 -nd／-ng 更不相同。**sh 不属于已冻结的 z-c-s**，不为保留它临时改组。[汉典声](https://zdic.net/hans/声)。
2. **响 xiǎng（S02）**：用于“不及物发出声音／响起”，语义 direct、声音 weak；sound a bell 等使动结构须另行表达，不机械复制名词评分。[汉典响](https://zdic.net/hans/响)。
3. **嗓 sǎng（S05）**：新发现的人声子域候选，局部声形比声接近一些，但只 partial。现代 /s/ 相同，a类元音与鼻尾部分接近；ŋ与nd、单元音与双元音、声调都不相同。必须选嗓音义，不能取喉咙器官义，更不能译水声／钟声。[汉典嗓](https://zdic.net/hans/嗓)。

**强语义控制**：音、鸣分别显示名词和特定发声动作；健、探、测显示同形异源隔离有效。**音近义远控制**：桑与嗓的现代音段几乎同形，依然没有声义；耸的高起义也不能由耸人听闻补成“声音”。

噪和啧是 z-c-s 扩展得到的受限子类型，不能作为一般 sound 的新同义赢家。诵被淘汰为通用映射：诵读内容和方式过窄。嘶、飒继续保留 Research 子类；不能把所有 s- 的发声词当独立同源证据。

**旧 Mapping 处理**：不必否定声／响的译义；应禁止把记录中的 Supported/A 读成语音或历史等级。“声音义来自健康日耳曼支”“所有sound同源”“宽泛sibilant即规则对应”均拒绝。文学《当小提琴声音响起》不参与语言学评分。

**Evidence Pending**：大陆纸本声／响／嗓原条与历史书证；AF/ME的实际音值；sonus深源需专门历史音系材料；方言人声词的具体地点与调查来源。状态：**Ready for Editorial Freeze**，限 auditory whole-word＋同形词隔离，historical-root / sound-symbolic 留 Pending。

## 4. MEDIA

### Historical Stage Map 与 Meaning Freeze

|ID|Source form / period|冻结义与关系|中文搜索|
|---|---|---|---|
|M1|Latin `medius`；中性形及名词用法 `medium`，古典拉丁语层|中间／居间；词形变化与词性使用。不是先有English middle再变成Latin medium|中 zhōng、间 jiān、介 jiè；不得强找m字|
|M2|English `medium`，16世纪末起；中介机构／手段义约1600已有记录|中间之物／状态→居间手段、传递条件；这是可检验的语义扩展，不是每次都在几何中点|媒／媒介；保山、伐柯只限人的中介子域|
|M3|English `media`，medium 的复数；大众传播集合义20世纪早期明确|plural morphology 与传播义专门化分别记录；现代媒体可作集合用法|媒体为通用译词；媒只是比较其语义成分|

MW 支持 medium 来自 Latin medius 的中性形式；Oxford 说明 media 的复数来源及现代传播集合用法；Etymonline 报告 mass-media 1923、media 传播集合义1927等见证。年份均是所查辞书记录，非绝对首用。[MW medium](https://www.merriam-webster.com/dictionary/medium)、[Oxford media](https://www.oxfordlearnersdictionaries.com/definition/english/media)、[Etymonline media](https://www.etymonline.com/word/media)。

`middle`：英语本族的 OE midd-/middel 一系；与 Latin medius 有词族亲缘比较依据，可画 **related-family** 分支，不是 `media → middle` 或 `middle → media` 必经祖先。印欧重建 *medhyo- 属来源说明，非实录词形。`mad`：MW 追到 OE gemǣd / gemād 一系，不能因m-d骨架加入中间词族。[MW mid](https://www.merriam-webster.com/dictionary/mid)、[Etymonline middle](https://www.etymonline.com/word/middle)、[MW mad](https://www.merriam-webster.com/dictionary/mad)。

### Shortlist、控制、淘汰

1. **媒 méi（M01）**：M2 中介义最强；现代 media /ˈmiːdiə/ 对 méi 仅 weak 整词声音对应。共同 m 起首不足以抵消元音和 -diə 差异。单字媒不是“几何中间”的已证本义，也不是整个 mass media 的万能翻译。媒体／媒介按对象选择标准译法。[汉典媒](https://zdic.net/hans/媒)、[媒介](https://zdic.net/hans/媒介)、[媒体](https://zdic.net/hans/媒体)。
2. **介 jiè（M05）**：新的高优先级 semantic-structural candidate；“介于两者之间”可连接 M1 BETWEEN 与 M2 中介结构。声音 mismatch；不能因语义好而添声音分。识典《汉语大词典》摘要还列介的“居间”“传宾主之言的人”等义，提供历史中介角色的线索；具体首证与年代仍 Pending，不将这些义强串为演化链。[介条摘要](https://www.shidianguji.com/character/介)。中、间仍是强语义控制，不因它们没有m起首而淘汰。[汉典介](https://zdic.net/hans/介)、[中](https://zdic.net/hans/中)、[间](https://zdic.net/hans/间)。

**组扩展的实际新增**：保山 bǎo shān 的媒人义，伐柯 fá kē 的做媒义有具体条目，分别提供 b-、f- 的中介子域候选；但它们是复合／典故表达，声音 mismatch，也不是大众媒体义。保山不可拆成“保＝所有媒介”，伐柯不可拆成“伐＝middle”。两项只列 Research，未进本轮 top shortlist。[保山](https://zdic.net/hans/保山)、[伐柯](https://zdic.net/hans/伐柯)。

**音近义远控制**：米 mǐ、谜 mí 的 m+i 起首甚至比媒更像 modern media；美 měi 与媒音段相同。三个都无中介／中间义。这直接限制只看首音节的解释力。**淘汰**凭：凭借关系不是中介实体；半：二分之一不等于中间位置。`mad` 只保留旧观察的反例记录，不入历史家族。

**Evidence Pending**：媒从婚姻介绍扩展至一般中介的具体历史书证、媒介／媒体现代术语史、Latin 的冻结音层、介的指定历史义与纸本原条；保山／伐柯做媒义的首证与时代不能只由典故故事确定。状态：**Ready for Editorial Freeze**，只冻结媒的中介单位与介的结构语义；不预定 Featured 的最终角色。

## 5. 历史音核验：避免只保留有利的层次

作者官网的 Baxter–Sagart 2014-09-20 表（核对其2020勘误入口）提供以下**指定系统**结果；MC是作者转写，不是IPA；OC是重建，不是录音。OC层约第一千纪BCE，MC是中古韵书音系层约6—7世纪的参考，不要求与欧语年代同步。PDF 页数指电子文件序号，不是擅造纸本页码。[作者材料入口](https://sites.lsa.umich.edu/ocbaxtersagart/)、[2014表](https://sites.lsa.umich.edu/ocbaxtersagart/wp-content/uploads/sites/1415/2025/03/BaxterSagartOCbyMandarinMC2014-09-20.pdf)。

|字／具体义|MC转写|OC重建|定位|本轮影响|
|---|---|---|---|---|
|背：后背|pwojH|*pˤək-s|PDF第6页，bèi / GSR0909e|具有-k成分的历史比较可另研究；不能抹掉-s，也不能说现代bèi与back同音|
|背：背向／转背|bwojH|*m-pˤək-s|同页，同字另一义|说明具体词义与拟音必须绑定，不能选一个有利的音配另一个义|
|聲：声音|syeng|*[l̥]eŋ|PDF第101页，shēng / GSR0822a|现代声的卷舌起首不能直接回投成古代s；不支持“古来都同s”的推理|
|媒：媒人／中介者|mwoj|*C.mˤə|PDF第76页，méi / GSR0948c|保留未知前置辅音C；此重建不含medius的d成分，不能隐去差异|

这些是原作者数据直接支持的**拟音命题**，不提升英汉历史关系。由于本轮未冻结对应 OE/Latin 的完整音系，**历史对历史 Phonetic Fit 仍 not_evaluated**；现代声音评分保持原值。北的败逃、古“响”、方言声等没有获得本轮足够逐义证据，不能借邻项音值补齐。

## 6. Protocol v0.2 的运行结果

本轮记录 **39项候选／控制行：ABACK 12、SOUND 15、MEDIA 12**。背与背后、媒与媒介各去一项家族重复，反／返已合并，得到 **37个审计家族组**；不等于37次独立成功。语言分支中的同形词控制不计作声音义发现。

### 新发现与扩展价值

“以前没想到”无法从人的记忆验证。可核的说法是：**相对于本轮读到的三个 records 的显式映射基线，新增6条值得保留的研究线索**：却、蒙（了）、嗓、介、保山、伐柯。其中却、蒙、嗓、介进入所列 shortlist；后两项只是受限 Research。普通译义控制和故意设置的反例不冒充创新。

|词|本轮标记为组扩展的新增行|保留用途|淘汰为目标通用映射|进入 shortlist|
|---|---|---|---|---|
|ABACK，b→p/m/f|反／返、怕、蒙、懵：4|反／返作方向边界；蒙作有限失措候选|怕、懵：2|蒙：1|
|SOUND，s→z/c|噪、啧：2|特定noise／口声子类|0，但都不升级为一般sound|0|
|MEDIA，m→b/p/f|保山、伐柯、凭、半：4|保山、伐柯作人的中介／文学对照|凭、半：2|0|
|合计|10|6个受限保留项|4个扩展误配|1个有限语义候选；**0个新增强音义赢家**|

本表不是等预算盲测：检索有人工引导和自适应跟进，检索路径标记用于追踪，**不能据此声称组扩展因果上优于 meaning-first，不能给总体precision/recall**。只能报告这10项中的4项被拒，以及只找b/m/s字会漏掉部分有价值的语义范围。反／返本来也可能由自由语义检索发现，不应把它独占归功于音组。

另有 **7个故意设置的声音控制**：白、百；桑、耸；米、美、谜，全部未入选。这7个不是自动系统偶然产生的错误，不能和4个扩展误配合并计算错误率。诵是本轮普通语义检索中另一个被拒的通用映射，不属于上述10项扩展分母。

### 三种任务对模型的压力

- **ABACK** 测试构式义变：模型能分开名词成分、方向副词、帆状态及心理构式，发现“整体词义不等于成分义”和“蒙／懵”的风险。
- **SOUND** 测试同形异源：先拆词族比扩大汉字池更重要。若没有这一步，健康、测深、声学可被错拼成一个漂亮而错误的故事。
- **MEDIA** 测试亲缘分支与语义角色：middle可以是相关家族，mad不可以；位置、关系、中介者、传播载体不能因都含m而同分。保山／伐柯还测试了多词表达与文学层。

### 自动化与下一批范围

可自动／半自动：收集具体词条、抽取form＋sense＋period、按冻结义生成词池、引用去重、标记多音／词性冲突、生成控制、检查语义与声音独立字段、保存拒绝项与来源失败记录。

仍需 Jinkai Liu 判断：比较单位和语义粒度、Featured编辑角色、文学表达是否有展示价值、哪些Pending可随研究候选公开、是否接受受限的蒙／嗓；历史音与方言升级需对应领域的证据审核。AI提出的“direct/partial”也是待审判断，不能因为表格齐全变成公认结论。

**建议下一批扩大到4条，暂不默认5条。** 按词族分支数而不只按词条数控制工作量；最多包含一个像SOUND这样的多源同形词。先限定每词8–15项候选／控制、冻结声母组和比较单位，保存同资源／等预算的baseline检索；下一批才能更可靠地衡量组扩展的新增价值。不要让Discovery自动转成Migration。

## 7. 检索范围与失败记录

日期2026-09-20；执行方式为AI辅助定向检索与人工式语义核对，没有声称实现无人运行检索器或盲评。原始协议版本虽写“待审核”，本轮按用户最新明确批准执行，不改动该文件。

来源检索模板：`site:merriam-webster.com dictionary aback/sound/medium`；Oxford具体词条；CNRTL son/sonde/sonder；`site.zdic.net 保 媒人`、`懵 měng`、`媒介 介绍`；“后退／却步／败北／返回／惊愕”“声音／发声／嗓音／诵读／风声”“中间／介于／媒介／保山／伐柯”；`Baxter Sagart reconstruction site:umich.edu`。并尝试大陆学术站点的方言声／响、背词项查询，未取得可核的完整方言条目。

失败与限制：Cambridge三个具体词页403，改用Oxford读音；CNRTL sonde/sonder返回空正文；Bosworth–Toller检索入口未能读取；Baxter PDF本地下载403，但作者网页的PDF解析可逐行定位，音值按表保留括号与未知成分；报纸HTML未取得，使用官方同版PDF。没有以这些失败访问支持正面主张。

停止规则：每条已有可复核的主词史、至少两类控制及少量shortlist后结束本轮开放检索；未取得的专门层明确Pending。**39项是本轮终止后的记录范围，未冒充事先注册的固定样本；没有全面None found的结论。**
