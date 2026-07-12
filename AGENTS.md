# Unilanguage Engineering Manual v2.0

> Language, a system.  
> 语言，一个系统。

This file defines the engineering, content, repository, and AI collaboration standards for the Unilanguage project.

It is intended for Codex, ChatGPT, future AI agents, developers, editors, researchers, and contributors.

---

## 1. Project Vision

Unilanguage is a long-term project for building a cross-language Semantic Protocol.

Its purpose is to study, document, test, and publish systematic relationships among:

- sound
- space
- meaning
- language
- human cognition
- knowledge
- translation

The project is not only a dictionary and not only a website.

It is designed as:

1. a semantic research system;
2. a multilingual Language Book;
3. a Protocol Book;
4. a translation evaluation laboratory;
5. an AI-readable knowledge structure;
6. a future multimedia publishing system.

The project slogan is:

> Language, a system.

---

## 2. Engineering Philosophy

The repository values:

- semantic consistency over visual novelty;
- reusable templates over isolated page design;
- evidence over unsupported certainty;
- clear structure over unnecessary complexity;
- long-term maintainability over quick temporary fixes;
- human-readable code over clever but difficult code;
- cross-page consistency over local optimization.

Do not make isolated improvements that weaken the overall system.

Do not redesign the repository structure without explicit approval.

Do not remove core semantic content merely to shorten a page.

---

## 3. Core Project Architecture

The project contains three primary books or systems.

### 3.1 Protocol Book

The Protocol Book explains the theoretical rules of the Unilanguage system.

Its main concepts include:

- Sound
- Space
- Time
- Meaning
- Language
- Human
- Knowledge

Protocol pages define semantic principles, operations, relationships, and system positions.

Core value:

> Rules.

---

### 3.2 Language Book

The Language Book contains multilingual word pages.

Each page studies one word or concept through:

- literary introduction;
- basic meaning;
- multilingual mapping;
- etymology;
- Unilanguage mapping;
- mapping level;
- mapping justification;
- protocol references;
- translation protocol;
- examples;
- community contribution.

Core value:

> Mapping Justification.

Mapping Justification is the most important section of every Language Book page.

---

### 3.3 UTP Lab

UTP means:

> Unilanguage Translation Protocol Laboratory.

UTP pages are used to test, compare, explain, and evaluate translation.

They may include:

- literal translation;
- semantic translation;
- Unilanguage mapping;
- mapping justification;
- evidence;
- AI comparison;
- benchmark;
- result;
- community contribution.

Core value:

> Evidence and AI Comparison.

---

## 4. Repository Architecture

The recommended repository structure is:

```text
Unilanguage/
│
├── AGENTS.md
├── README.md
├── LICENSE
│
├── index.html
├── search.html
├── dictionary.html
├── english.html
├── chinese.html
├── french.html
├── translation-protocol.html
│
├── protocol/
│   ├── protocol.sound.html
│   ├── protocol.space.html
│   ├── protocol.time.html
│   ├── protocol.meaning.html
│   ├── protocol.language.html
│   ├── protocol.human.html
│   └── protocol.knowledge.html
│
├── words/
│   ├── language.html
│   ├── sound.html
│   ├── sky.html
│   ├── time.html
│   ├── human.html
│   ├── knowledge.html
│   └── music.html
│
├── translation/
│   ├── sky.utp.html
│   └── sound.utp.html
│
├── templates/
│   ├── protocol-template.html
│   ├── language-template.html
│   └── utp-template.html
│
├── css/
│   └── style.css
│
├── js/
│   └── search.js
│
├── images/
│
├── media/
│   ├── comics/
│   ├── audio/
│   ├── short-video/
│   └── lecture-video/
│
└── docs/
    ├── research/
    ├── standards/
    └── roadmap/
```

Do not rename or move major folders without explicit approval.

---

## 5. Folder Responsibilities

### Root directory

Contains the main entry pages, project documentation, license, and configuration files.

### `protocol/`

Contains Protocol Book pages.

Each file explains one theoretical concept or semantic rule system.

### `words/`

Contains Language Book word pages.

Each file represents one word or concept.

### `translation/`

Contains UTP Lab experiments and translation evaluation pages.

### `templates/`

Contains the three master templates.

These templates are the required basis for future pages.

### `css/`

Contains shared visual styles.

The default shared stylesheet is:

```text
css/style.css
```

### `js/`

Contains shared interactive behavior such as search and navigation logic.

### `images/`

Contains website images and reusable visual assets.

### `media/`

Contains multimedia outputs derived from Protocol Book, Language Book, and UTP Lab content.

### `docs/`

Contains research notes, standards, roadmaps, papers, and long-form documentation.

---

## 6. Naming Convention

Use lowercase English filenames.

Use clear, stable, descriptive names.

Do not use spaces in filenames.

Do not use names such as:

```text
new-page.html
final2.html
test-copy.html
page-latest.html
```

Use permanent semantic names.

---

### 6.1 Protocol Book filenames

Format:

```text
protocol/protocol.[concept].html
```

Examples:

```text
protocol/protocol.sound.html
protocol/protocol.space.html
protocol/protocol.time.html
protocol/protocol.meaning.html
```

---

### 6.2 Language Book filenames

Format:

```text
words/[word].html
```

Examples:

```text
words/sound.html
words/language.html
words/sky.html
words/music.html
```

---

### 6.3 UTP Lab filenames

Format:

```text
translation/[topic].utp.html
```

Examples:

```text
translation/sky.utp.html
translation/sound.utp.html
translation/time.utp.html
```

---

### 6.4 Template filenames

The three master templates are:

```text
templates/protocol-template.html
templates/language-template.html
templates/utp-template.html
```

Do not create alternative templates unless explicitly approved.

---

### 6.5 Media filenames

Recommended formats:

```text
media/comics/sky-comic-01.png
media/audio/sky-narration-en.mp3
media/audio/sky-narration-zh.mp3
media/short-video/sky-60s.mp4
media/lecture-video/sky-5min.mp4
```

Use the page topic as the filename prefix.

---

## 7. Template Rules

Always use the existing templates when generating new pages.

### Protocol page

Use:

```text
templates/protocol-template.html
```

### Language Book page

Use:

```text
templates/language-template.html
```

### UTP page

Use:

```text
templates/utp-template.html
```

Do not invent a new page structure when an appropriate template already exists.

When a template changes, review related pages and update them consistently when required.

Preserve the semantic order of all major sections.

---

## 8. HTML Coding Standard

Use valid HTML5.

Every page should begin with:

```html
<!DOCTYPE html>
<html lang="en">
```

Every page should include:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Prefer semantic HTML elements:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
```

Use headings in logical order:

```text
h1 → h2 → h3
```

Do not skip heading levels without a structural reason.

Use consistent indentation.

Recommended indentation:

```text
4 spaces
```

Avoid unnecessary inline styles.

Prefer reusable CSS classes.

Avoid duplicated markup when shared structures can be standardized.

Keep links relative and correct for the current folder depth.

Examples:

From a root page:

```html
<link rel="stylesheet" href="css/style.css">
```

From a page inside `words/`, `protocol/`, or `translation/`:

```html
<link rel="stylesheet" href="../css/style.css">
```

All pages must be readable on desktop and mobile screens.

---

## 9. CSS Standard

Use the shared stylesheet:

```text
css/style.css
```

Do not create a separate CSS file for every page unless there is a clear system-level reason.

Avoid duplicated style rules.

Use reusable classes for:

- page layout;
- cards;
- section headings;
- navigation;
- mapping levels;
- quotation blocks;
- buttons;
- protocol references;
- evidence boxes;
- related links;
- previous and next navigation.

Class names should describe function, not temporary appearance.

Prefer:

```css
.mapping-level
.protocol-reference
.literary-introduction
.evidence-card
```

Avoid:

```css
.blue-box
.big-text-2
.left-thing
```

Preserve accessibility and readability.

Maintain sufficient color contrast.

Do not reduce body text to an uncomfortable size.

---

## 10. JavaScript Standard

Use JavaScript only when it improves usability.

Examples include:

- dictionary search;
- page filtering;
- navigation;
- multilingual display;
- expandable sections;
- media controls;
- knowledge graph interactions.

Keep scripts in the `js/` folder when they are shared.

Avoid putting large scripts directly inside HTML pages.

Do not introduce a framework unless the existing project clearly requires one and approval is given.

Do not break basic website navigation when JavaScript is disabled.

Search logic should use stable page metadata or a structured index.

---

## 11. Navigation Rules

Every major page should use consistent navigation.

Recommended main navigation:

- Home
- Search
- Dictionary
- Protocol
- Literature
- Knowledge Graph
- UTP
- Community

Do not use different names for the same destination across pages.

Examples of inconsistent naming to avoid:

```text
Dictionary
Language Dictionary
Word Book
Lexicon
```

Use the approved project term:

```text
Dictionary
```

Language Book pages should link to:

- their related Protocol Book pages;
- their related UTP page when available;
- related Language Book entries;
- Dictionary;
- Home.

Protocol pages should link to:

- previous protocol;
- next protocol;
- related Language Book entries;
- UTP examples where available.

UTP pages should link to:

- the source Language Book entry;
- related Protocol Book pages;
- other relevant UTP experiments.

When adding a page, update all relevant indexes and navigation.

---

## 12. Protocol Book Writing Standard

Every Protocol Book page must follow the fixed ten-section structure.

### 1. Literary Introduction

Open with a literary passage, scene, image, or reflective paragraph.

The literary introduction should illuminate the concept.

It should not be decorative filler.

### 2. Definition

Define the concept clearly.

Explain what it means inside the Unilanguage system.

### 3. Multilingual Mapping

Show how the concept appears in multiple languages.

English, Chinese, and French should be included when appropriate.

Additional languages may be added as evidence.

### 4. Etymology

Explain relevant historical word origins.

Etymology is supporting evidence, not the sole basis of a mapping.

### 5. Unilanguage Interpretation

Explain how Unilanguage understands the concept.

Connect the concept to the wider semantic system.

### 6. Semantic Rules

List the semantic rules or operations related to the concept.

Rules should be stated clearly enough to be tested or applied.

### 7. Protocol Position

Explain where the concept appears inside the Semantic Protocol.

Show its relationship to other protocol concepts.

### 8. Related Concepts

Link to related ideas, words, and protocol pages.

### 9. Reflection

Provide a deeper philosophical or research reflection.

Clearly distinguish reflection from proven evidence.

### 10. Contribute

Invite readers to submit examples, corrections, evidence, and alternative analyses.

---

## 13. Language Book Writing Standard

Every Language Book page must follow the fixed structure below.

### 1. Literary Introduction

Begin with a literary sentence, paragraph, scene, or image.

The introduction should create semantic context for the word.

### 2. Basic Meaning

Include:

- word;
- pronunciation;
- part of speech;
- English meaning;
- Chinese meaning;
- French meaning.

Additional languages may be included when useful.

### 3. Multilingual Mapping

Display the selected cross-language correspondences.

Do not imply that all compared words are historically related.

Distinguish among:

- etymological relation;
- phonetic resemblance;
- semantic resemblance;
- metaphorical relation;
- cultural association;
- proposed Unilanguage mapping.

### 4. Etymology

Provide relevant etymological information.

Do not invent etymologies.

Mark uncertain or disputed origins clearly.

### 5. Unilanguage Mapping

State the proposed Unilanguage correspondence.

Example:

```text
sky ↔ 盖 gài
```

The mapping should be concise.

### 5A. Mapping Level

Every Language Book page must classify the proposed mapping as:

- Strong
- Medium
- Weak

The level describes confidence in the Unilanguage mapping.

It does not automatically claim historical cognacy.

### 6. Mapping Justification

This is the most important section.

It should explain:

- phonetic relationship;
- consonant relationship;
- vowel relationship;
- spatial relationship;
- semantic relationship;
- metaphorical relationship;
- cultural relationship;
- historical evidence;
- limitations;
- alternative interpretations.

The justification must distinguish evidence from interpretation.

Do not hide uncertainty.

### 7. Protocol References

Link to the relevant Protocol Book pages.

Examples:

- Sound Protocol
- Space Protocol
- Meaning Protocol
- Time Protocol

### 8. Translation Protocol

Link to or summarize the related UTP Lab experiment.

If a UTP page does not yet exist, indicate that it is planned.

### 9. Examples

Provide useful sentences, literary examples, translation examples, or cultural examples.

Examples should support the proposed meaning and mapping.

### 10. Community

Invite readers to contribute:

- multilingual equivalents;
- literary examples;
- etymological evidence;
- mapping objections;
- protocol suggestions;
- translation cases.

---

## 14. UTP Lab Writing Standard

Every UTP page must follow the fixed ten-section structure.

### 1. Translation Task

State the source text, source language, target language, and translation problem.

### 2. Literal Translation

Provide a direct translation close to the source form.

### 3. Semantic Translation

Provide a translation that reconstructs the intended meaning.

### 4. Unilanguage Mapping

Show the semantic units, spatial relationships, sounds, metaphors, or protocol operations involved.

### 5. Mapping Justification

Explain why the selected mapping is appropriate.

### 6. Evidence

Include relevant evidence such as:

- dictionaries;
- historical texts;
- classical literature;
- inscriptions;
- linguistic research;
- cultural usage;
- parallel translations.

Do not fabricate citations.

### 7. AI Comparison

Compare outputs from AI systems when actual outputs are available.

Do not invent model results.

Record:

- model name;
- date;
- prompt conditions;
- output;
- strengths;
- weaknesses.

### 8. Benchmark

Define evaluation criteria.

Possible criteria include:

- literal accuracy;
- semantic reconstruction;
- cultural preservation;
- metaphor preservation;
- readability;
- ambiguity handling;
- protocol consistency.

### 9. Result

Present a clear conclusion.

State limitations and unresolved questions.

### 10. Community

Invite alternative translations, evidence, corrections, and benchmark proposals.

---

## 15. Unilanguage Mapping Principles

Unilanguage mappings may be based on one or more of the following:

- shared pronunciation;
- consonant similarity;
- vowel similarity;
- sound symbolism;
- semantic similarity;
- spatial metaphor;
- directional metaphor;
- conceptual metaphor;
- cultural metaphor;
- historical evolution;
- grammatical function;
- literary association;
- cognitive structure.

A mapping does not need to be a historical cognate to be studied.

However, non-etymological mappings must not be presented as proven etymology.

Use clear labels such as:

- historical relation;
- possible relation;
- phonetic association;
- semantic association;
- proposed mapping;
- literary interpretation;
- cultural interpretation.

---

## 16. Core Semantic Principles

The project currently studies a semantic sequence such as:

```text
Sound
↓
Space
↓
Meaning
↓
Language
↓
Knowledge
```

The project also uses semantic operations such as:

- MOVE
- CHANGE
- EXIST
- UP
- DOWN

Current exploratory sound and space principles may include:

- `a` as outward direction;
- `i` and `u` as downward direction;
- `o` as inward direction;
- tonal movement as spatial or semantic movement;
- consonants as relatively stable structural signals;
- vowels as directional or emotional signals.

These principles are research hypotheses.

Do not present them as universally proven linguistic laws.

Preserve the distinction between:

- confirmed evidence;
- working rule;
- research hypothesis;
- poetic interpretation.

---

## 17. Mapping Level Standard

### Strong

Use Strong when several independent forms of support converge.

Possible support includes:

- close sound relationship;
- close semantic relationship;
- historical evidence;
- repeated cross-language patterns;
- clear protocol consistency.

### Medium

Use Medium when the mapping is meaningful and supported but remains interpretive or incomplete.

### Weak

Use Weak when the mapping is exploratory, metaphorical, culturally suggestive, or supported by limited evidence.

Every Mapping Level should include a short explanation.

Do not use a high level merely because the interpretation is attractive.

---

## 18. Literature Standard

Literature is part of the semantic method.

It should:

- introduce lived experience;
- reveal metaphor;
- show emotional direction;
- create cultural context;
- support memory;
- help readers understand abstract protocol concepts.

Literary passages should not replace evidence.

Keep original user-authored literary passages when modifying pages.

Do not rewrite them extensively unless explicitly requested.

Clearly identify quotations from external authors.

Do not include copyrighted text beyond appropriate quotation limits.

---

## 19. Evidence Standard

Evidence must be traceable.

Preferred evidence sources include:

- authoritative dictionaries;
- academic research;
- historical texts;
- primary sources;
- reliable language corpora;
- classical works;
- documented cultural usage.

Do not fabricate:

- quotations;
- books;
- dictionary entries;
- historical forms;
- AI outputs;
- academic citations.

Mark uncertainty with phrases such as:

```text
This may suggest...
One possible interpretation is...
The available evidence is limited...
This is a proposed Unilanguage mapping rather than an established etymology.
```

---

## 20. Community Standard

Community contributions may include:

- new word mappings;
- new language equivalents;
- literary introductions;
- etymological corrections;
- protocol proposals;
- translation cases;
- classical evidence;
- multimedia contributions;
- software improvements.

Contributors should respect the distinction between evidence and interpretation.

Submissions should connect, when possible, to the seven main conceptual areas:

- Sound
- Space
- Time
- Meaning
- Language
- Human
- Knowledge

---

## 21. GitHub Workflow

Use a simple, reviewable workflow.

Recommended sequence:

```text
1. Read AGENTS.md
2. Inspect related templates and existing pages
3. Make one coherent change
4. Check all affected links
5. Review the changed files
6. Commit with a clear message
7. Push to GitHub
8. Allow Netlify to deploy
9. Verify the live website
```

Recommended commit messages:

```text
Add sky Language Book page
Add Space Protocol chapter
Update navigation across protocol pages
Fix broken relative links
Add sky UTP experiment
Improve mobile layout
```

Avoid unclear commit messages such as:

```text
update
change
fix stuff
new
```

Do not commit temporary files, editor backups, or unrelated downloads.

---

## 22. Codex Workflow

Before changing the repository, Codex should:

1. read `AGENTS.md`;
2. inspect the repository tree;
3. open the relevant master template;
4. inspect at least one existing related page;
5. identify all files affected by the requested change;
6. preserve existing semantic content;
7. apply consistent updates across related files;
8. check relative paths;
9. summarize the changes;
10. report unresolved issues honestly.

When creating a Language Book page, Codex should also consider updating:

- `dictionary.html`;
- `search.html` or the search index;
- related word links;
- related Protocol references;
- related UTP links;
- previous and next navigation.

When creating a Protocol page, Codex should also consider updating:

- the Protocol index;
- previous and next navigation;
- related Language Book pages;
- related UTP pages.

When creating a UTP page, Codex should also consider updating:

- `translation-protocol.html`;
- the related Language Book page;
- the related Protocol pages;
- UTP navigation.

Codex must not claim that a file was tested, deployed, or verified unless it actually performed that action.

---

## 23. AI Collaboration Rules

When generating new pages:

- do not invent new structures;
- always follow the existing templates;
- preserve the approved ten-section order;
- use the shared CSS;
- maintain navigation consistency;
- update related indexes when appropriate.

When modifying pages:

- preserve the original semantic content;
- preserve user-authored literary passages;
- preserve Mapping Justification;
- preserve Protocol References;
- preserve evidence and uncertainty labels;
- do not simplify away important distinctions.

If multiple files require identical updates:

- apply the update consistently;
- inspect for path differences;
- avoid partial repository-wide changes.

AI agents should prioritize:

- semantic consistency;
- repository consistency;
- factual accuracy;
- transparent uncertainty;
- maintainability;
- accessibility.

AI agents should not prioritize:

- novelty for its own sake;
- unnecessary redesign;
- invented evidence;
- unsupported certainty;
- decorative complexity;
- isolated page perfection that breaks project consistency.

Do not modify project architecture without explicit approval.

Do not remove major content sections without explicit approval.

Do not rename established project terms without explicit approval.

---

## 24. Future AI Collaboration Rules

Future AI systems should treat the repository as a structured semantic knowledge project, not merely a collection of webpages.

AI-generated content should be reviewable by humans.

Every important interpretation should make clear whether it is:

- evidence;
- established linguistic knowledge;
- project rule;
- hypothesis;
- metaphor;
- literary reflection.

Future automated workflows may generate:

- word pages;
- protocol pages;
- UTP experiments;
- search indexes;
- knowledge graph data;
- multimedia scripts;
- storyboards;
- subtitles;
- narration;
- benchmark reports.

Automation must not erase human editorial control.

---

## 25. Video and Comic Pipeline

Website content is the source for multimedia publishing.

Recommended workflow:

```text
Protocol Book / Language Book / UTP Lab
↓
Core semantic summary
↓
Literary script
↓
60-second script
↓
5-minute lecture script
↓
Storyboard
↓
Comic panels
↓
Narration
↓
Animation or video
↓
Subtitles
↓
Website embedding
```

Each major Protocol chapter may produce:

- one 60-second explanation;
- one 5-minute lecture;
- one comic sequence.

Each core Language Book word may produce:

- one webpage;
- one comic;
- one 60-second video;
- one optional 5-minute explanation.

UTP pages may produce:

- translation comparison videos;
- AI comparison videos;
- evidence-based case studies.

Multimedia outputs must remain consistent with the source page.

Do not introduce new claims in a video that are absent from or unsupported by the source content.

---

## 26. Multimedia File Standard

For each topic, recommended source files include:

```text
docs/media-scripts/sky-60s-script.md
docs/media-scripts/sky-5min-script.md
docs/storyboards/sky-storyboard.md
media/comics/sky-comic-01.png
media/audio/sky-narration-en.mp3
media/audio/sky-narration-zh.mp3
media/short-video/sky-60s.mp4
media/lecture-video/sky-5min.mp4
```

Subtitle files may use:

```text
sky-60s-en.srt
sky-60s-zh.srt
sky-5min-en.srt
sky-5min-zh.srt
```

Keep the topic name consistent across all related files.

---

## 27. Accessibility Standard

Pages should remain usable for readers with different devices and abilities.

Requirements include:

- meaningful page titles;
- descriptive link text;
- `alt` text for informative images;
- keyboard-accessible navigation;
- readable font sizes;
- sufficient contrast;
- responsive layout;
- captions or subtitles for videos;
- transcripts for important audio and video;
- language attributes where multilingual text is used.

Do not use images as the only way to communicate essential information.

---

## 28. Link and Path Verification

Before completing a change, verify:

- stylesheet paths;
- JavaScript paths;
- image paths;
- Home links;
- Dictionary links;
- Protocol links;
- UTP links;
- previous and next links;
- related word links;
- media links.

Remember:

Root pages normally use:

```text
css/style.css
js/search.js
```

Pages one folder deep normally use:

```text
../css/style.css
../js/search.js
```

Do not assume a link works merely because the filename exists.

Check spelling, capitalization, and folder depth.

---

## 29. New Page Checklist

Before creating a new page:

- identify the correct book;
- identify the correct template;
- confirm the filename;
- confirm the folder;
- inspect a related existing page;
- collect the required content;
- identify related pages;
- identify navigation updates.

After creating a new page:

- verify the title;
- verify all ten sections;
- verify CSS and JS paths;
- verify navigation;
- verify related links;
- update indexes;
- update search data;
- check mobile readability;
- review evidence and uncertainty labels;
- verify the live deployment after publishing.

---

## 30. Protected Project Decisions

The following decisions should not be changed casually:

- the project name is `Unilanguage`;
- the slogan is `Language, a system.`;
- the three main systems are Protocol Book, Language Book, and UTP Lab;
- Mapping Justification is the core of Language Book;
- Evidence and AI Comparison are core parts of UTP Lab;
- the three master templates are authoritative;
- shared styles belong in `css/style.css`;
- Language Book, Protocol Book, and UTP pages use stable section structures;
- semantic consistency has priority over visual novelty.

Changes to these decisions require explicit approval.

---

## 31. Current Priority

The current priority is to build the first complete connected cases.

A complete case should include:

```text
Protocol Book page
↓
Language Book page
↓
UTP Lab page
```

Example:

```text
protocol/protocol.space.html
↓
words/sky.html
↓
translation/sky.utp.html
```

Each complete case should have working cross-links.

After the first cases are stable, the project may expand to more words and protocols.

---

## 32. Long-Term Roadmap

The long-term project may develop into:

- an open Semantic Protocol;
- a large multilingual Language Book;
- a translation benchmark;
- a semantic knowledge graph;
- AI training and evaluation data;
- multimedia learning materials;
- academic papers;
- GitHub community collaboration;
- published books;
- an interface for human and AI semantic interoperability.

Future expansion must preserve the core architecture and semantic principles defined in this manual.

---

## 33. Final Instruction to AI Agents

Before making any repository change:

> Read this file, inspect the relevant templates, preserve semantic content, and make the smallest coherent change that strengthens the whole Unilanguage system.

When uncertain:

> Do not invent. State the uncertainty, preserve the existing structure, and request human review when necessary.
