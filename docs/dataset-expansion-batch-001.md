# Dataset Expansion Batch 001

Date: 2026-09-01  
Author: Jinkai Liu  
Schema: Language Book Entry Schema v1.0 (unchanged)  
Dataset release: v1.1.0

## Dashboard

| Metric | Result |
|---|---:|
| Formal records processed | 10 |
| Published | 0 |
| Reviewed disposition | 6 |
| Candidate disposition | 4 |
| Research Queue | 1 (`wave/water ↔ 水/w`) |
| Existing record checked | 1 (`advance ↔ 往`, no duplicate) |
| Historical corrections / distinctions | 8 |
| Validator status | Pass: Schema v1.0, Mapper/search regression and full repository test suite |

No record is automatically Published. `entry_status`, `mapping_status`, historical evidence and literary status remain independent.

## Priority scoring

`Priority = 30% Verifiability + 25% Semantic Clarity + 20% Mapping Value + 15% Literary/Cognitive Value + 10% Novelty`, rounded to one decimal. The score is editorial triage, not a scientific measurement.

Top scores: `media` 90.8; `generate`, `fil`, and `convent` 90.0; `sign/cognition` 89.6; `marchand/march` 89.5.

## Final triage and independent historical evaluation

| Record | Score | Disposition | Historical result |
|---|---:|---|---|
| generate ↔ 干/根 | 90.0 | Reviewed | Latin `generare/gener-/genus` is established; Chinese comparison is non-cognate candidate only. |
| form ↔ farm | 89.0 | Candidate | `form` ← Latin `forma`; `farm` follows `firmus/firmare` through rent/lease history. |
| media ↔ middle ↔ 媒 | 90.8 | Reviewed | `media/medium` and Germanic `middle` are deeper Indo-European relatives; 媒 is a strong semantic mapping, not historical cognacy. |
| sign ↔ cognitive | 89.6 | Candidate | Latin `signum` SIGN/MARK and `cognoscere/cognitio` KNOW are separate historical clusters. |
| montrer ↔ monitor | 86.3 | Reviewed | Both connect more deeply through Latin `monere`, via distinct `monstrare` and `monitor` paths. |
| fil ↔ filière ↔ fille | 90.0 | Reviewed | `filière` derives from `fil`; `fille` ← Latin `filia` is a negative calibration. |
| figure ↔ finger | 86.8 | Candidate | Latin `figura/fingere` and inherited Germanic `finger` are not an established family. |
| marchand ↔ march | 89.5 | Candidate | `marchand` belongs to the market/commerce family; `marcher/march` follows a Germanic walking/marking path. |
| press ↔ pression ↔ 压 | 86.4 | Reviewed | English/French forms belong to the Latin `premere/pressare/pressio` family; 压 is a strong semantic mapping only. |
| convent ↔ convention | 90.0 | Reviewed | Both derive from Latin `convenire`; convention did not derive from the monastery sense of convent. |

## Quality gate

Reviewed requires a standard meaning and part of speech, sourced word history, four independent evidence tracks, preserved raw note, explicit counterevidence, typed related words and passing Mapper tests. Published additionally requires a dedicated editorial/publication decision and, where appropriate, a public word page. Candidate records are structurally complete but retain exploratory mapping status.
