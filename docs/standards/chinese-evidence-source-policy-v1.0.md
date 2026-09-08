# Chinese Evidence Source Policy v1.0｜中文证据来源政策 v1.0

Author: Jinkai Liu  
Effective: 2026-09-08

## Purpose｜目的

本政策适用于 Unilanguage / Language Book 的现行页面、records、Evidence、References、source metadata 与研究报告。目标是让每个汉语 claim 由最适合、实际取得并核验的证据支持。来源地域不替代证据质量判断；本项目按作者当前编辑要求，在现行中文证据中采用大陆编纂辞书、大陆专业研究、适用国家语言文字规范及已明确版本的原典整理本。

## Selection rules｜选源规则

1. **现代普通话、规范义、拼音、简体规范**：优先核验《现代汉语词典》《新华字典》及适用国家标准。只有实际取得具体条目或版本内容后才可引用；出版社的图书介绍只能证明版本存在，不能证明某个词条内容。
2. **历史字义、历史书证**：优先《汉语大字典》《汉语大词典》及可核验的正式数据库或专业研究。数据库仅有产品介绍或机构访问受限时，列为 desired/pending。
3. **早期字形、古义、音韵**：按 claim 使用《说文解字》《广韵》《集韵》《辞源》等原典或辞书，并优先核对明确的大陆整理版本。数字平台转录必须标明平台中介和版本不确定性。
4. **拟音**：注明学者、体系、版本与被拟音的历史层次。拟音是分析模型，不是确定录音；不同体系可以并列比较。
5. **证据交叉**：Historical Chinese claim 尽量由现代规范资料与历史辞书、原典或专业研究交叉核验。一本现代辞书不能单独证明古义、古音或字源。
6. **逐 claim 分类**：每条 claim 标记为 `modern_meaning`、`historical_meaning`、`orthography`、`phonology`、`attestation` 或 `reconstruction`。同一来源可支持多个 claim，但必须逐项说明范围。
7. **不可访问即 pending**：不得补写未见页码、未见书证或未见条文。缺少合格替代来源时，移除当前引用，并将 claim 标 pending、收窄或降级。

## Reader-facing and metadata rules｜展示与元数据

- 读者文案采用简体中文叙述；书名、专名和原文引文保持准确，历史字形可保留繁体。
- 正文直接写具体书名或平台名；机构、编者、出版社、版本、URL、access date 放入 metadata。
- 汉典按“大陆数字辞书平台”记录，不改称任何纸本辞书，也不把其古籍转录冒充直接校勘。
- 已被移除的引用不在现行报告中复录书名或 URL；Git 历史负责技术追溯。

## Method boundary｜方法边界

**Meaning first, consonant second｜先定语义，再验辅音。** b-p-m-f、d-t-n-l、g-k-h、z-c-s 等组用于 English / French / historical form 与 Chinese pronunciation 的跨语言候选比较，不要求汉语 semantic path 内部同组。辅音组命中不能弥补弱语义，也不能自动升级 Candidate。

Dialect & Diachronic Chinese Evidence 单独记录。现代方言是活态历时证据窗口，不是古汉语的冻结复制品。保留反例、controls 与 etymological-family deduplication；文学层不作为词源或历史证据。

## Release gates｜发布门槛

- 现行数据、页面、政策和报告不得残留已移除来源的标题、域名或 source ID。
- 不增加 entry count，不自动升级 Candidate，不改冻结 Mapper UI。
- schema、dataset、search、Mapper、HTML、JavaScript、build、lint 与浏览器回归全部通过后方可发布。
- 机器可读的逐 claim 决策见 [`data/evidence/mainland-source-recalibration.v1.json`](../../data/evidence/mainland-source-recalibration.v1.json)。
