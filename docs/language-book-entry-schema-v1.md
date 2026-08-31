# Language Book Entry Schema v1.0

Language Book is a **cross-language comparable semantic database**. It records mappings that can be searched, compared, reviewed and tested. It is not a proof that all languages share one historical origin.

## Editorial policy

> 词条可以发表，假说必须标级，文学可以自由展开，证据必须独立核验。  
> An entry may be published; a hypothesis must be graded; literature may explore freely; evidence must be evaluated independently.

> 一个英语词 → 一个主要汉语 Mapping → 独立历史词源 → 独立声音假说 → 独立实验验证。  
> One English word → one primary Chinese mapping → separate historical etymology → separate sound-semantic hypothesis → separate experimental validation.

`entry_status`, `mapping_status`, `historical_relation_status` and `literary_layer.status` are independent axes. `Published` means that an editorial object is public; it never means that a mapping, hypothesis, historical relation or experiment has been proved.

## Canonical files

- Dataset: `data/language-book.v1.0.json`
- JSON Schema: `data/language-book-entry.schema.v1.json`
- Deterministic migration: `scripts/build-language-book-v1.mjs`
- Validation: `scripts/validate-language-book-v1.mjs`
- Browser adapter: `js/language-book-data.js`

The v0.6 dataset and earlier package records remain in the repository as migration provenance. v1.0 copies each old entry into `legacy` so that no reviewed object is silently discarded.

## Entry fields

| Field | Meaning |
|---|---|
| `id`, `slug`, `title` | Stable identity, URL/search slug and bilingual display title. |
| `languages` | Source, target and optional literary-transformation forms with language and pronunciation. |
| `primary_mapping` | Exactly one source word and one primary Chinese target, plus gloss, meaning, type and rationale. It does not contain historical etymology. |
| `entry_status` | Editorial lifecycle of the entry itself. |
| `mapping_status`, `mapping_level` | Independent classification and A–D research level of the cross-language mapping. |
| `historical_relation_status` | Independent judgment about a historical relation. `Not claimed` is different from `Unestablished`. |
| `evidence` | Four independent tracks: `Historical`, `Phonetic-Semantic`, `Cognitive`, `Speculative`; every track has its own `status` and `confidence`. |
| `phonetic_observation` | Modern-form observations and explicit limitations. An observation is not a regular sound law. |
| `semantic_structure` | Comparable conceptual units and their relation, such as `LOCATION → PRESENCE`. |
| `hypotheses` | Individually graded consonantal, root-consonant, vowel or other candidate rules. |
| `experiments` | Plans or results linked to the hypotheses they test. No experiment is inferred from publication. |
| `literary_layer` | Proposition, prose, poem/lyrics, translations and archival manuscript references. `is_historical_evidence` must be `false`. |
| `media` | Typed media with bilingual alt/caption and source/provenance. Unknown values are recorded as `unknown`, never guessed. |
| `references` | Source records used by evidence objects. |
| `author`, `version`, `dates` | Editorial authorship and version history. The project author convention is `Jinkai Liu`. |
| `editorial_notes` | Bilingual scope and evidence-boundary notes. |
| `search_terms` | Canonical search aliases consumed by Search, Dictionary and Semantic Mapper. |

## Enumerations

- Entry: `Draft`, `Reviewed`, `Published`, `Archived`
- Mapping: `Candidate`, `Reviewed`, `Supported`, `Rejected`
- Mapping level: `A`, `B`, `C`, `D`, `Unrated`
- Historical relation: `Established`, `Supported`, `Unestablished`, `Rejected`, `Not claimed`
- Literary layer: `Draft`, `Reviewed`, `Published`, `Not present`
- Evidence: `Established`, `Supported`, `Candidate`, `Interpretive`, `Under review`, `Unestablished`, `Rejected`, `Not claimed`, `Not evaluated`
- Confidence: `High`, `Medium`, `Low`, `Unknown`

Compatibility rule: reader-facing pages may retain older labels such as “B · Experimental” or `retain_without_promotion`; the adapter maps them to the v1 axes without rewriting the original page.

## Hypothesis object

Every hypothesis includes `hypothesis_id`, `type`, bilingual `claim`, `status`, `confidence`, `supporting_cases`, `counterexamples`, bilingual `testability`, `experiment_link` and `source_refs`. Supported types include Consonantal Semantic Skeleton, Root Consonant Semantic Stability, vowel relation and other candidate rules. A null `experiment_link` means “not linked”, not “disproved”.

## Media policy

Allowed types are `archival image`, `original manuscript`, `illustration`, `generated illustration` and `research figure`. `alt`, `caption`, `source` and `provenance` are required. When the creation method or source is not documented, use `unknown`. A generated illustration or literary visual is not research evidence merely because it appears on a published page.

## Complete compact example

The canonical AT record contains additional references and literary/media objects; this compact object shows every required field:

```json
{
  "id": "LB-en-at-003",
  "slug": "at",
  "title": { "en": "AT · 在 · 爱 | Love Is Presence", "zh-Hans": "AT · 在 · 爱｜爱在，世界就在" },
  "languages": [
    { "role": "source", "code": "en", "name": "English", "word": "at", "pronunciation": "/æt/" },
    { "role": "target", "code": "zh-Hans", "name": "Chinese", "word": "在", "pronunciation": "zài /tsaɪ̯/" }
  ],
  "primary_mapping": {
    "mapping_id": "MAP-at-primary-zai",
    "source": { "language": "English", "word": "at", "pronunciation": "/æt/" },
    "target": { "language": "Chinese", "word": "在", "pronunciation": "zài /tsaɪ̯/" },
    "gloss": { "en": "Location → presence", "zh-Hans": "位置 → 在场／存在" },
    "meaning": { "en": "Candidate semantic comparison", "zh-Hans": "候选语义比较" },
    "mapping_type": "Phonetic-semantic candidate",
    "rationale": { "en": "LOCATION → PRESENCE is the strongest relation.", "zh-Hans": "最强关系是 LOCATION → PRESENCE。" }
  },
  "entry_status": "Published",
  "mapping_status": "Candidate",
  "mapping_level": "C",
  "historical_relation_status": "Not claimed",
  "evidence": {
    "Historical": { "status": "Unestablished", "confidence": "High", "summary": { "en": "Independent histories; no common origin claimed.", "zh-Hans": "各有独立历史；不主张共同来源。" }, "items": [], "source_refs": [] },
    "Phonetic-Semantic": { "status": "Candidate", "confidence": "Low", "summary": { "en": "Limited modern-form observation.", "zh-Hans": "有限的现代词形观察。" }, "items": [], "source_refs": [] },
    "Cognitive": { "status": "Interpretive", "confidence": "Medium", "summary": { "en": "LOCATION → PRESENCE", "zh-Hans": "位置 → 在场" }, "items": [], "source_refs": [] },
    "Speculative": { "status": "Candidate", "confidence": "Low", "summary": { "en": "Untested.", "zh-Hans": "尚未测试。" }, "items": [], "source_refs": [] }
  },
  "phonetic_observation": [],
  "semantic_structure": { "concepts": ["LOCATION", "PRESENCE"], "relation": "LOCATION → PRESENCE", "status": "Interpretive" },
  "hypotheses": [],
  "experiments": [],
  "literary_layer": {
    "status": "Published",
    "is_historical_evidence": false,
    "proposition": { "en": "Love is presence. Where love is, the world is.", "zh-Hans": "爱就是在。爱在，世界就在。" },
    "essay_prose": [], "poem_lyrics": [], "translations": [], "archival_manuscript_media": [],
    "evidence_boundary": { "en": "在 → 爱 is literature, not etymology.", "zh-Hans": "在 → 爱属于文学，不属于词源。" }
  },
  "media": [],
  "references": [],
  "author": "Jinkai Liu",
  "version": "1.0",
  "dates": { "created": null, "modified": "2026-08-30", "published": "2026-08-30" },
  "editorial_notes": [{ "en": "The status axes are independent.", "zh-Hans": "各状态轴彼此独立。" }],
  "search_terms": ["at", "在", "爱", "love", "presence"],
  "page": "words/at.html",
  "legacy": null
}
```

## Editing and validation workflow

Edit the migration source or a future data-authoring source, regenerate v1.0, run `validate-language-book-v1.mjs`, then run the browser-data tests and link checks. Do not bypass a failed validator. Missing evidence, dates or provenance remain `null`, `unknown`, `Not claimed` or `Not evaluated` as appropriate.

## Dataset Expansion v1 workflow

New reviewed records are authored one per file in `data/entries/*.v1.json`; `scripts/build-language-book-v1.mjs` sorts and merges them after the deterministic legacy migration. Each record must preserve the author's source/raw note, independently verify historical claims, use the standard lexical equivalent as `primary_mapping`, and keep phonetic observations, hypotheses and literature on their own status tracks. Search aliases belong in `search_terms`, including accented and unaccented forms when both are reasonable queries.

Before adding a batch: compare stable IDs/slugs, leave unknown fields null or unclaimed, run the builder and validator, test English plus at least one non-English alias through `UnilanguageData.lookup`, run the full test suite and link checker, then regenerate the product manifest/checksums. A record may be Reviewed without being Published; a literary proposition may be Reviewed while its phonetic hypothesis remains Candidate or Unestablished.
