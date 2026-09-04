# Unilanguage

**Language, a System.**

**语言，一个系统。**

## Language Book Entry Schema v1.0 + Semantic Mapper Data Foundation

Dataset Expansion v1 now also includes a reviewed `abdomen → 肚子` record. It preserves `abdomen ↔ 肚 dù` as a low-confidence phonetic-semantic candidate, keeps Latin `abdōmen` separate from the `domus/dominus` family, and labels `dome/domain/control` as cognitive or speculative association rather than etymology. Typed `related_words` let the Mapper display genuine derivatives and non-historical associations separately.

Language Book is a cross-language comparable semantic database, not a proof that all languages share one historical origin. `data/language-book.v1.0.json` is the canonical browser dataset and `data/language-book-entry.schema.v1.json` defines its machine-readable contract. Entry publication, mapping status, historical relation, evidence tracks and literary status are independent.

Semantic Mapper, Dictionary and Search consume the same `search_terms` and structured entries. Dataset v1.2.4 contains 37 records. English and French browse forms are alphabetized; the Chinese browse index shows one concise preferred form per unified record in Xinhua-style stroke order. Full synonyms remain searchable and preserved inside each record. Universe displays the featured structural mapping `universe ↔ 斡 wò` beside standard translation `宇宙`; Sound displays `sound ↔ 声 shēng` beside standard translation `声音`; Abdomen now displays the low-confidence candidate `abdomen ↔ 肚 dù` beside standard translation `腹部／肚子` and links to a complete editorial page. Their identities and historical boundaries remain separate. The existing Universe record retains its Schema v1.0-compatible `root_level_mapping` extension: documented Latin decomposition, semantic primitives, independently graded Chinese candidates, cognitive geometry, traditional Chinese construction and testable hypotheses remain separate. Legacy Website Import Batch 001 processes the first 20 source pages from the `languagesbook.com` English glossary into 14 new unified records, merges four sources into existing `AT`, `abbey`, `abdomen` and `aberrant` records, combines the two legacy `abbreviate/abbreviation` pages, and defers the unclear `cun，存` item to the Research Queue. No new record is automatically Published. Original Jinkai Liu notes, independent historical evaluation, four evidence tracks, counterevidence and priority scores remain separate. Rebuild with `scripts/build-language-book-v1.mjs`, validate with `scripts/validate-language-book-v1.mjs`, and run the full test suite.

## Package F · Candidate Source Verification + Human Review v0.1

Package F keeps the Package E canonical dataset unchanged and prepares exactly its 19 candidates for human review. `data/candidates/package-f-review-queue.v0.1.json` records source type, exact locator, access/version details, supported and unsupported claims, four separated evidence tracks, conflicts, provisional confidence/mapping level, and an unsigned checklist. `candidate-review.html` renders the queue without any automatic review or publication action. Run `node scripts/validate-package-f.mjs` and `node --test tests/package-f.test.cjs`.

## Package G · Review Decision + Publication Gate v0.1

Package G adds an auditable decision register without changing Package F’s 10 Candidate / 9 Needs Evidence intake result. All 19 human decisions remain Pending and all publication gates remain Not Eligible because no named reviewer or publisher has signed. `review-decisions.html` shows evidence completeness, decision reasons, separate release eligibility, checklists, and audit history. Rebuild with `scripts/build-package-g-review.mjs` and validate with `scripts/validate-package-g.mjs`; Reviewed and Published are enforced as independent human gates.

---

# What is Unilanguage?
# 什么是 Unilanguage？

Unilanguage is an open semantic language protocol designed to build a unified framework for multilingual understanding.

Unilanguage 是一个开放的语义语言协议，旨在建立一个跨语言统一理解框架。

---

# Vision
# 愿景

Our goal is to create a semantic protocol that enables:

我们的目标是建立一种语义协议，实现：

- Human–Human communication
  人与人之间的沟通

- Human–AI communication
  人工智能与人的沟通

- AI–AI semantic interoperability
  人工智能之间的语义互操作

- Future multilingual knowledge systems
  面向未来的多语言知识系统

---

# Project Structure
# 项目结构

## Protocol Book（协议之书）

Defines the semantic protocol and its rules.

定义语义协议及其规则。

---

## Language Book（语言之书）

A multilingual semantic dictionary.

一个多语言语义词典。

---

## UTP Lab

Unilanguage Translation Protocol Laboratory.

共通语言翻译协议实验室。

---

# Website
# 官方网站

https://language.vu

---

# Roadmap
# 路线图

Current

当前阶段

- Website
- GitHub
- SEO

Next

下一阶段

- Protocol Book
- Language Book
- UTP Lab
- Knowledge Graph
- AI Semantic System

---

# Contributing
# 欢迎参与

We welcome contributions in:

欢迎参与：

- Linguistics（语言学）
- Semantic Mapping（语义映射）
- Translation（翻译）
- AI
- Knowledge Graph（知识图谱）
- Literature（文学）

---

Copyright © 2026 Unilanguage
