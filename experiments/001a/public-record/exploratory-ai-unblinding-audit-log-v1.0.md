# Experiment 001A Round 2 — Exploratory AI Unblinding v1.0 Audit Log｜探索性 AI 揭盲审计记录

**Record ID｜记录编号：** `UNI-EXP-001A-R2-AIUNBLIND-AUDIT-1.0`

**Stage｜阶段：** `Exploratory AI Unblinding v1.0｜探索性 AI 揭盲 v1.0`

**Evidentiary label｜证据标签：** `Exploratory AI Result｜探索性 AI 结果`

**Preregistered Human Annotation｜预注册真人标注：** `Pending｜待进行`

**Experiment 001B started｜Experiment 001B 是否启动：** `No｜否`

## Authorization and first restricted access｜授权与首次受限访问

- **Authorization basis:** the user's 2026-08-24 request explicitly authorized the first exploratory AI unblinding, restricted-key access, restoration of M versus Control identities, separate AI-A/AI-B analyses, protocol-justified sensitivity analyses, public-safe reporting, and updating the Experiment 001A public record.
  **授权依据：** 用户在 2026-08-24 的请求明确授权第一次探索性 AI 揭盲、访问受限密钥、恢复 M 与 Control 身份、分开分析 AI-A／AI-B、执行协议允许的敏感性分析、制作公开安全报告并更新 Experiment 001A 公开记录。
- **Authorization received before restricted access｜受限访问前已取得授权：** `Yes｜是`。
- **Restricted artifact｜受限文件：** 冻结私有研究包中的 `restricted/analysis-key.csv`。
- **First-access audit checkpoint (UTC)｜首次访问审计时间点（UTC）：** `2026-08-24T23:14:01.169Z`。
- **Access purpose:** verify the frozen key structure and join `blind_id` to frozen AI-A and AI-B labels.
  **访问目的：** 核对冻结密钥结构，并通过 `blind_id` 分别连接冻结的 AI-A 与 AI-B 标签。
- **Disclosure boundary:** the raw key, row-level identity mapping, surface-form/group joins, and reconstructive data remain private.
  **公开边界：** 原始密钥、逐项身份映射、词形／组别连接和可重建身份的数据继续保持私有。

The first structural read occurred immediately before the timestamped checkpoint. The tool environment did not expose a separate per-file-open timestamp, so this is the earliest explicit retained checkpoint; the limitation is recorded instead of back-dating false precision.

第一次结构性读取发生在上述时间点之前的紧邻步骤。工具环境没有提供独立的逐文件打开时间，因此该时间点是保留下来的最早明确审计时间；这里记录这一限制，而不追溯填写虚假的精确时间。

## Baseline integrity gate｜基线完整性关卡

At `2026-08-24T23:14:01.169Z`, every artifact listed in the frozen Round 2 manifest and AI annotation freeze manifest was re-hashed with SHA-256.

在 `2026-08-24T23:14:01.169Z`，对 Round 2 冻结清单和 AI 标注冻结清单列出的全部文件重新计算了 SHA-256。

- Frozen Round 2 artifacts checked｜已检查 Round 2 冻结文件：`14`
- Frozen AI annotation artifacts checked｜已检查 AI 标注冻结文件：`5`
- Hash mismatches｜哈希不匹配：`0`
- Frozen preregistration edited｜是否编辑冻结预注册：`No｜否`
- Frozen OPS edited｜是否编辑冻结 OPS：`No｜否`
- Frozen AI-A labels/workbook edited｜是否编辑冻结 AI-A 标签／工作簿：`No｜否`
- Frozen AI-B labels/workbook edited｜是否编辑冻结 AI-B 标签／工作簿：`No｜否`
- Existing checksum or freeze-manifest files edited｜是否编辑既有校验和或冻结清单：`No｜否`

Key frozen fingerprints used by the analysis｜分析使用的关键冻结指纹：

- restricted analysis key｜受限分析密钥：`74bfdbfd1ff8fa564520a75db35c92702ea6385209c65a2b80f073d110412ca2`
- AI-A machine-readable labels｜AI-A 机器可读标签：`ccecdd2716bbf3f3180ff1260f2fe9d59161639271753b0cad845b1512bb9c13`
- AI-B machine-readable labels｜AI-B 机器可读标签：`af4644ad15215dfea7e929c303438adee68d4d5091906020b0bcaa0e3169f6a4`
- frozen sample registry｜冻结样本登记表：`74bfdbfd1ff8fa564520a75db35c92702ea6385209c65a2b80f073d110412ca2`

## Public-release gate｜公开发布关卡

Before public deployment, the release was scanned for｜公开部署前扫描以下内容：

- raw `blind_id` values｜原始 `blind_id` 值；
- surface-form/group mappings｜词形／组别映射；
- `analysis-key.csv` rows｜`analysis-key.csv` 数据行；
- selection, matching, or identity-recovery fields｜选择、匹配或身份恢复字段；
- row-level AI-A/AI-B annotations｜逐项 AI-A／AI-B 标注；
- reusable blind-breaking mappings｜可复用的破盲映射。

Only aggregate statistics, methods, bilingual-commented code, input fingerprints, audit/decision records, and appropriately labeled conclusions are public. The raw key and reconstructive item-level data remain private.

公开内容仅包括汇总统计、方法、带双语注释的代码、输入指纹、审计／决策记录和标签恰当的结论。原始密钥及可重建身份的逐项数据继续保持私有。
