# Unilanguage

**Language, a System.**

**语言，一个系统。**

## Semantic Mapper MVP v0.2

The public product entry is `semantic-mapper.html`. It performs exact and normalized lookup against the versioned canonical Language Book dataset at `data/language-book.v0.2.json`; unknown terms never receive generated evidence.

The same dataset powers Semantic Mapper, Dictionary and reviewed-word Search. Package E tracks six published entries plus a separate 19-record candidate batch; candidates do not appear in formal lookup. Architecture and governance are documented in `docs/product/semantic-mapper-v0.1.md` and `docs/product/semantic-mapper-v0.2.md`. Validate with `scripts/validate-language-book.mjs`, run `tests/product-v0.2.test.cjs`, check critical links with `scripts/check-product-links.mjs`, and regenerate release records with `scripts/build-product-manifest.mjs`.

## Package F · Candidate Source Verification + Human Review v0.1

Package F keeps the Package E canonical dataset unchanged and prepares exactly its 19 candidates for human review. `data/candidates/package-f-review-queue.v0.1.json` records source type, exact locator, access/version details, supported and unsupported claims, four separated evidence tracks, conflicts, provisional confidence/mapping level, and an unsigned checklist. `candidate-review.html` renders the queue without any automatic review or publication action. Run `node scripts/validate-package-f.mjs` and `node --test tests/package-f.test.cjs`.

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
