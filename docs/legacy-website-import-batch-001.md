# Legacy Website Import Batch 001

Date: 2026-09-01  
Author: Jinkai Liu  
Source: `languagesbook.com` English glossary, page 1  
Schema: Language Book Entry Schema v1.0 (unchanged)  
Dataset release: v1.2.0

## Dashboard

| Metric | Result |
|---|---:|
| Legacy source pages processed | 20 |
| New unified records | 14 |
| Existing records merged, no duplicate | 4 (`AT`, `abbey`, `abdomen`, `aberrant`) |
| Duplicate legacy page merged | 1 (`abbreviation` → `abbreviate`) |
| Research Queue | 1 (`cun，存`) |
| New Published records | 0 |
| Reviewed disposition | 6 |
| Candidate disposition | 8 |
| Historical corrections / distinctions | 14 |
| Expected dataset change | 23 → 37 records |

The fixed batch boundary is page 1 of the legacy English glossary: 20 source pages out of the site's displayed 1,548 items and 78 pages. Importing a source page does not make its sound comparison historical evidence. All original notes remain attributed to Jinkai Liu and are stored beside, not inside, the independent evaluation.

## Priority scoring

`Priority = 30% Verifiability + 25% Semantic Clarity + 20% Mapping Value + 15% Literary/Cognitive Value + 10% Novelty`, rounded to one decimal. It is an editorial triage aid, not a scientific score.

Top scores are `abhor` 91.8, `absolute` 90.8, `abdicate` 90.8, `abandon` 90.7 and `abbreviate` 90.5.

## Historical corrections

| Unified record | Independent result |
|---|---|
| `abeyance` | Anglo-French waiting/suspension history; not negative `a- + bey` or Chinese 闭. |
| `abound` | Latin `abundare`, `unda` “wave”; not English `bound` or Chinese 蹦. |
| `abridge` | Late Latin `abbreviare`, `brevis` “short”; related to `abbreviate`, not `a + bridge`. |
| `acumen` | Latin `acumen/acuere` “sharpness/sharpen”; `cum` is not a gather-root here. |
| `aliment` | Latin `alimentum < alere` “nourish”; 粮 is semantic, not historical. |
| `a` | Reduced `an`, from Old English `ān` “one”; the Cantonese/甲 comparison remains a research hypothesis. |
| `above` | Old English/Germanic spatial history; 上 is a standard semantic mapping, not a cognate claim. |
| `absolute` | Latin `absolutus < absolvere`; the `solve` family is real, the 炒 image is literary. |
| `aback` | Old English `on bæc` and English `back` are historical; 背 is a modern phonetic-semantic candidate. |
| `abandon` | Anglo-French `abandun/abanduner`; not modern `ban + donner`. |
| `abash` | Anglo-French/Middle English “gape, be amazed”; modern meaning is embarrass/disconcert, not simply surprise. |
| `abbreviate` | Latin `abbreviare/brevis`; combines both legacy `abbreviate` and `abbreviation` pages. |
| `abdicate` | Latin `abdicare` “renounce/withdraw”, related to SAY/STATE; “不再啼叫” is literature. |
| `abhor` | Latin `ab- + horrere` “shudder/bristle”; not 火, horse or horizontal. |

## Reconciliation rule

The Mapper receives one record per reviewed lexical headword, not one entry per legacy URL. Therefore `abbreviate` and `abbreviation` share one record, while `AT` and the indefinite article `a` remain separate records. Exact query `a` resolves to the article; `at` continues to resolve to the published literary entry.
