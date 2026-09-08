# Mainland Source Recalibration Report v1.0｜大陆中文来源再校准报告

Author: Jinkai Liu  
Date: 2026-09-08  
Scope: current Unilanguage / Language Book pages, authored records, generated dataset, Evidence / References, metadata and policy

## Outcome｜结果

现行有效中文引用已按 Chinese Evidence Source Policy v1.0 重新校准。旧引用类别的书名、链接、source ID 和迁移清单均不在当前仓库保留；技术追溯仅依赖 Git 历史。本次未增加 entry，未修改冻结 Mapper UI，未自动升级任何 Candidate，也不把来源迁移解释为对既有资料学术质量的否定。

## Selection criteria｜选源标准

1. 来源必须实际打开并核验到可支持该 claim 的内容；仅见图书介绍时，只能核验版本元数据。
2. 现代义、规范字形、拼音、历史义、书证、音韵和拟音分别判断，不用一本现代辞书包办历史论证。
3. 读者面写具体书名或平台名；机构、版本、URL 和 access date 进入 metadata。
4. 汉典作为大陆数字辞书平台使用。其现代释义可支持限定的现代词义；所转录古籍只算平台中介证据，不冒充直接核对的整理本。
5. 纸本或付费数据库无法取得具体条目时标 `desired_pending`；不补写页码、释义、反切或书证。
6. Meaning first, consonant second。b-p-m-f 等辅音组只用于跨语言候选对应，不能提升弱语义或证明历史同源。

## Claim-to-source mapping｜逐 claim 映射

| Entry / claim | Claim type | Current source | Decision |
|---|---|---|---|
| ABANDON：放、弃、抛、罢、办／辦、甭、般 | modern meaning | 汉典具体条目；《通用规范汉字表》用于字形边界 | retained / scoped |
| ABANDON：bandon ↔ 办；柄／权柄 | historical meaning | 汉典：办、辦、柄；法语词史仍由 CNRTL 支持 | 办收窄为处理义；柄支持 POWER/AUTHORITY；Candidate 不变 |
| ABANDON：donner ↔ 捅 | modern meaning | 汉典：捅 | 未见稳定“给”义，保留为作者用法观察，证据 pending |
| ABASH/BASH：怕、拍 | modern / historical meaning; phonology | 汉典具体条目；现有 CUHK 研究平台作平行核验 | 平台转录与原典区分；两个 b↔p Candidate 不变 |
| ABBEY：爸、父、爹、爷 | modern meaning / attestation | 汉典具体条目；《明清以来西南官话区地方志方言俗语集成》中期检查报告 | 只支持称谓分层与地域／历史多样性；首见年代 pending |
| UNIVERSE：斡、涡、窝、蜗、周、转 | modern / historical meaning | 现有汉典具体条目与已标明的原典数字文本 | 保留；不建立共同汉语词源或拉汉历史关系 |
| ABDOMEN：肚、腹 | modern / historical meaning | 汉典：肚、腹 | 替换并交叉；平台历史材料明确为中介 |
| ABERRANT：讹 | modern meaning | 汉典：讹 | 替换；只支持错误／谬误义 |
| SKY / LIGHT / AT | targeted audit | 现有具体来源；适用处使用汉典、国家规范 | 不机械堆来源，现有分层不变 |
| Namcha Barwa | attestation | 既有大陆政府与科学院资料 | 保留，无迁移 |

完整机器可读映射见 [`data/evidence/mainland-source-recalibration.v1.json`](../../data/evidence/mainland-source-recalibration.v1.json)。

## Adopted mainland sources｜实际采用

- 《通用规范汉字表》：仅用于规范字形范围。
- GB/T 16159-2012《汉语拼音正词法基本规则》：仅用于拼音正词法边界，不当作 IPA 或历史音证据。
- 汉典：按字词具体 URL 支持限定的现代词义；历史释义、反切与书证均标平台中介。
- 《明清以来西南官话区地方志方言俗语集成》中期检查报告：支持地域父称的活态与历史多样性。
- 既有大陆政府、科研机构资料：继续支持 Namcha Barwa 等非辞书 claim。

## Desired / pending｜所需但未冒充已核验

- 《现代汉语词典》第7版：商务印书馆页面已核验版本元数据；目标词条未取得。
- 《新华字典》第13版：商务印书馆页面已核验版本元数据；目标字条目未取得。
- 《汉语大词典》数据库：产品与访问说明已核验；无条目级访问。
- 《汉语大字典》第二版：本轮未取得权威目标字条目与可核页码。
- 《辞源》第三版：版本元数据已核验；目标条目未取得。
- 郑张尚芳体系、Baxter–Sagart 2014：只核验体系／资源元数据；未逐字取得目标拟音，因此没有填写拟音值。

## Evidence changes and downgraded claims｜证据变化与收窄

- `bandon ↔ 办`：继续区分 bandon 的 POWER/AUTHORITY 与办的处理／办理义。`柄／权柄` 是更强的 meaning-first 语义支持；声音不参与该选择。
- `donner ↔ 捅`：未取得标准普通话“给”义证据，保持 Original Author Usage Observation，不成为词典义。
- 父称历史：现有证据支持爸／爹／爷的地域、时期和语体差异，不支持全国统一替代顺序或最早年代。
- 怕／拍及斡／涡／窝／蜗的历史拟音：因未完成命名体系逐字核验，维持 pending；不得用普通话读音代替中古／上古拟音。
- 腹、肚、讹的现行词义已由大陆平台限定支持；所有跨语言 Candidate 与 Historical Relation 状态保持原值。

## Integrity constraints｜完整性约束

- 37 records 前后相同；不增加 Published entry。
- ABBEY Legacy Recalibration、ABANDON 整词与词根双层、ABASH/BASH、Universe、Sky、Light、AT、abdomen、aberrant、Namcha Barwa 均纳入回归。
- 反例、baby-talk articulatory confound、方言边界、controls 与 etymological-family deduplication 保留。
- 文学层继续可检索，但不转化为词源或历史证据。
- 发布验证结果、commit 与线上状态在完成部署后写入 release handoff，不预先声称成功。
