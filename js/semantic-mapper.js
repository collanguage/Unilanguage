(function () {
  "use strict";
  const ui = { form: document.querySelector("#mapperForm"), input: document.querySelector("#mapperInput"), state: document.querySelector("#mapperState"), result: document.querySelector("#mapperResult"), version: document.querySelector("#datasetVersion"), languageGroups: document.querySelector("#languageBrowseGroups") };
  let dataset;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const localized = (value) => value ? `${escapeHtml(value.en)}<span lang="zh-Hans">${escapeHtml(value["zh-Hans"])}</span>` : "Unknown · 未知";
  const layer = (letter, title, description, content) => `<section class="classification-layer"><div class="layer-label">${letter}</div><div class="layer-content"><h3>${title}</h3><p class="layer-description">${description}</p>${content}</div></section>`;
  const empty = (message) => `<p class="empty-layer">${message}</p>`;
  const statusCard = (label, value, css = "candidate") => `<div class="status-card ${css}"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`;
  const safeUrl = (value) => /^https:\/\//i.test(String(value || "")) ? String(value) : null;

  function evidenceCard(name, track) {
    const items = track.items.length ? `<div class="evidence-items">${track.items.map((item) => `<div class="evidence-item"><p><strong>${escapeHtml(item.evidence_id || "Evidence item")}</strong> <span class="status-chip">${escapeHtml(item.status || "Not evaluated")} · ${escapeHtml(item.confidence || "Unknown")}</span></p><p>${localized(item.claim)}</p></div>`).join("")}</div>` : "";
    return `<article class="classification-object"><div class="object-heading"><span class="identity-badge">${escapeHtml(name)}</span><span class="status-chip">${escapeHtml(track.status)} · ${escapeHtml(track.confidence)}</span></div><p>${localized(track.summary)}</p>${items}<p><strong>Independent items · 独立对象：</strong> ${track.items.length} · <strong>Source refs · 来源：</strong> ${track.source_refs.length}</p></article>`;
  }

  function referencesCard(entry) {
    const references = entry.references.map((item) => {
      const url = safeUrl(item.url);
      const title = url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>` : escapeHtml(item.title);
      return `<li>${title}<br><span class="small">${escapeHtml(item.type)} · ${escapeHtml(item.provenance)}</span></li>`;
    }).join("");
    const sourceNote = entry.source?.raw_note ? `<details class="source-note"><summary>Author source/raw note · 作者原始研究笔记</summary><p><strong>${escapeHtml(entry.source.status)}</strong></p><p>${escapeHtml(entry.source.normalization)}</p><p lang="zh-Hans">${escapeHtml(entry.source.raw_note)}</p></details>` : "";
    return `<article class="classification-object"><p><strong>References · 参考：</strong> ${entry.references.length} · <strong>Media · 媒体：</strong> ${entry.media.length} · <strong>Author · 作者：</strong> ${escapeHtml(entry.author)}</p>${references ? `<ol>${references}</ol>` : ""}${sourceNote}${entry.page ? `<p><a href="${escapeHtml(entry.page)}">Open published/editorial page · 打开词条页面 →</a></p>` : ""}</article>`;
  }

  function hypothesisCard(item) {
    return `<article class="classification-object hypothesis-object"><div class="object-heading"><span class="identity-badge identity-author-hypothesis">Author Hypothesis · 作者假说</span><span class="status-chip">${escapeHtml(item.status)} · ${escapeHtml(item.confidence)}</span></div><h4>${escapeHtml(item.hypothesis_id)}</h4><p>${localized(item.claim)}</p><p><strong>Type · 类型：</strong> ${escapeHtml(item.type)}<br><strong>Supporting cases · 支持案例：</strong> ${item.supporting_cases.length}<br><strong>Counterexamples / limits · 反例／边界：</strong> ${item.counterexamples.length}<br><strong>Experiment · 实验：</strong> ${escapeHtml(item.experiment_link || "not linked")}</p><p>${localized(item.testability)}</p></article>`;
  }

  function experimentCard(item) {
    return `<article class="classification-object experiment-object"><div class="object-heading"><span class="identity-badge identity-experimental-result">Experimental Result · 实验结果</span><span class="status-chip">${escapeHtml(item.status)}</span></div><h4>${escapeHtml(item.experiment_id)}</h4><p>${localized(item.title)}</p><p><strong>Result · 结果：</strong><br>${localized(item.result)}</p>${item.path ? `<p><a href="${escapeHtml(item.path)}">Open record · 查看记录 →</a></p>` : ""}</article>`;
  }

  function relatedWordCard(item) {
    const kind = /etymological|historical/i.test(item.relationship_type) ? "Etymological relation · 词源关系" : "Semantic/speculative association · 语义／推测联想";
    return `<article class="classification-object"><div class="object-heading"><span class="identity-badge">${kind}</span><span class="status-chip">${escapeHtml(item.status)}</span></div><h4>${escapeHtml(item.word)} · ${escapeHtml(item.language)}</h4><p><strong>Relation type · 关系类型：</strong> ${escapeHtml(item.relationship_type)}<br><strong>Family · 词族：</strong> ${escapeHtml(item.family)}</p><p>${localized(item.relation_to_entry)}</p></article>`;
  }

  function renderEntry(entry) {
    const mapping = entry.primary_mapping;
    const evidence = Object.entries(entry.evidence).map(([name, track]) => evidenceCard(name, track)).join("");
    const literature = entry.literary_layer;
    ui.state.innerHTML = ""; ui.result.hidden = false;
    ui.result.innerHTML = `<header class="entry-header"><div><p class="mapper-kicker">Language Book Entry Schema v1.0</p><h2>${escapeHtml(mapping.source.word)} ↔ ${escapeHtml(mapping.target.word)}</h2><p class="entry-language">${escapeHtml(mapping.source.language)} ${escapeHtml(mapping.source.pronunciation)} → ${escapeHtml(mapping.target.language)} ${escapeHtml(mapping.target.pronunciation)}</p></div><span class="record-badge status-${entry.entry_status.toLowerCase()}">${escapeHtml(entry.entry_status)}<br>Entry status only</span></header>
      <div class="status-grid">${statusCard("Entry Status · 词条", entry.entry_status, entry.entry_status === "Published" ? "published" : "candidate")}${statusCard("Mapping Status · 映射", entry.mapping_status)}${statusCard("Mapping Level · 层级", entry.mapping_level)}${statusCard("Historical Relation · 历史关系", entry.historical_relation_status, "unestablished")}${statusCard("Literary Layer · 文学层", literature.status, literature.status === "Published" ? "published" : "planned")}</div>
      <section class="lexical-meaning"><h3>Mapping Summary · 映射摘要</h3><p>${localized(mapping.meaning)}</p><p><strong>${escapeHtml(mapping.mapping_type)}</strong> · ${localized(mapping.rationale)}</p></section>
      <p class="evidence-boundary"><strong>Editorial boundary · 编辑边界：</strong> An entry may be published; a hypothesis must be graded; literature may explore freely; evidence must be evaluated independently. · 词条可以发表，假说必须标级，文学可以自由展开，证据必须独立核验。</p>
      <div class="classification-stack">
        ${layer("A", "Primary Mapping · 主要 Mapping", "One source word → one primary Chinese mapping. Historical etymology is not embedded here. · 一个来源词 → 一个主要汉语 Mapping；历史词源不嵌入此对象。", `<article class="classification-object"><h4>${escapeHtml(mapping.source.word)} → ${escapeHtml(mapping.target.word)}</h4><p>${localized(mapping.gloss)}</p><p><strong>Type · 类型：</strong> ${escapeHtml(mapping.mapping_type)}</p></article>`)}
        ${layer("B", "Four Independent Evidence Tracks · 四条独立证据轨", "Each track has its own status and confidence. · 每条轨道独立记录状态与置信度。", evidence)}
        ${layer("C", "Phonetic Observations · 语音观察", "Modern-form observations do not establish regular sound change or cognacy. · 现代词形观察不建立规律音变或同源关系。", entry.phonetic_observation.length ? entry.phonetic_observation.map((item) => `<article class="classification-object"><div class="object-heading"><span class="identity-badge">Observation · 观察</span><span class="status-chip">${escapeHtml(item.status)}</span></div><p>${localized(item.claim)}</p><p>${localized(item.limitations)}</p></article>`).join("") : empty("No phonetic observation recorded · 未记录语音观察"))}
        ${layer("D", "Semantic Structure · 语义结构", "A comparable conceptual model, independently classified. · 可计算比较的概念模型，独立分类。", `<article class="classification-object"><h4>${escapeHtml(entry.semantic_structure.relation)}</h4><p><strong>Status · 状态：</strong> ${escapeHtml(entry.semantic_structure.status)}</p></article>`)}
        ${layer("E", "Related Words · 关联词", "Etymological relations and semantic/speculative associations carry different labels. Similar spelling is not a root. · 词源关系与语义／推测联想使用不同标签；拼写相似不等于同根。", entry.related_words?.length ? entry.related_words.map(relatedWordCard).join("") : empty("No typed related words recorded · 未记录分类关联词"))}
        ${layer("F", "Hypotheses · 假说", "Consonantal, root, vowel and other candidate rules remain individually graded. · 辅音、词根、元音及其他候选规则逐条分级。", entry.hypotheses.length ? entry.hypotheses.map(hypothesisCard).join("") : empty("No hypothesis linked · 尚无关联假说"))}
        ${layer("G", "Experimental Validation · 实验验证", "An experiment tests a linked hypothesis; it does not inherit publication status. · 实验检验关联假说，不继承发表状态。", entry.experiments.length ? entry.experiments.map(experimentCard).join("") : empty("Not tested; absence is not negative evidence. · 尚未测试；没有实验不等于反证。"))}
        ${layer("H", "Literary Layer · 文学层", "Literature is preserved and searchable, but explicitly excluded from historical evidence. · 文学内容被保留并可检索，但明确排除于历史证据之外。", `<article class="classification-object note-object"><div class="object-heading"><span class="identity-badge identity-author-note">${escapeHtml(literature.status)}</span><span class="status-chip">Historical evidence: no</span></div><h4>${literature.proposition ? localized(literature.proposition) : "No proposition recorded · 未记录命题"}</h4><p>${localized(literature.evidence_boundary)}</p><p><strong>Prose · 散文：</strong> ${literature.essay_prose.length} · <strong>Poem/lyrics · 诗／歌词：</strong> ${literature.poem_lyrics.length} · <strong>Archive · 档案：</strong> ${literature.archival_manuscript_media.length}</p></article>`)}
        ${layer("I", "Sources, Media and Entry · 来源、媒体与词条", "Unknown provenance remains unknown; it is never guessed. · 未知来源保持 unknown，不作猜测。", referencesCard(entry))}
      </div>`;
  }

  function renderUnknown(query, suggestions) {
    ui.result.hidden = true;
    const buttons = suggestions.length ? `<div class="suggestions">${suggestions.map((entry) => `<button type="button" data-query="${escapeHtml(entry.primary_mapping.source.word)}">${escapeHtml(entry.primary_mapping.source.word)}</button>`).join("")}</div>` : "";
    ui.state.innerHTML = `<div class="empty-state"><p class="mapper-kicker">No schema or classified word record · 暂无 schema／分类词条</p><h2>“${escapeHtml(query)}” is not in dataset v${escapeHtml(dataset.dataset_version)}.</h2><p>No result is generated from missing data. · 不根据缺失数据临时生成结论。</p>${buttons}</div>`;
    ui.state.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => runLookup(button.dataset.query)));
  }

  function renderLanguageBrowse() {
    const groups = UnilanguageData.languageForms(dataset);
    ui.languageGroups.innerHTML = groups.map((group) => `<section class="language-group" aria-labelledby="language-${escapeHtml(group.code)}"><h3 id="language-${escapeHtml(group.code)}">${escapeHtml(group.label)}</h3><div class="language-form-list">${group.forms.map((form) => `<button type="button" data-language-form="${escapeHtml(form.term)}" title="${escapeHtml(form.role)} · ${escapeHtml(form.slug)}">${escapeHtml(form.term)}</button>`).join("")}</div></section>`).join("");
    ui.languageGroups.querySelectorAll("[data-language-form]").forEach((button) => button.addEventListener("click", () => runLookup(button.dataset.languageForm)));
  }

  function runLookup(raw) {
    const query = String(raw ?? ui.input.value).trim(); ui.input.value = query;
    if (!query) { ui.result.hidden = true; ui.state.innerHTML = '<div class="empty-state"><p>Enter a recorded form. · 请输入已记录形式。</p></div>'; return; }
    const result = UnilanguageData.lookup(dataset, query); if (result.kind === "exact") renderEntry(result.entry); else renderUnknown(query, result.suggestions);
    const url = new URL(window.location.href); url.searchParams.set("q", query); history.replaceState(null, "", url);
  }

  async function init() {
    try {
      dataset = await UnilanguageData.loadDataset();
      const published = dataset.entries.filter((entry) => entry.entry_status === "Published").length;
      const candidates = dataset.entries.filter((entry) => entry.mapping_status === "Candidate").length;
      ui.version.textContent = `Dataset v${dataset.dataset_version} · Entry Schema ${dataset.schema_version} · ${published} published entries / ${candidates} candidate mappings`;
      renderLanguageBrowse();
      ui.form.addEventListener("submit", (event) => { event.preventDefault(); runLookup(); });
      const query = new URL(window.location.href).searchParams.get("q"); runLookup(query || "at");
    } catch (error) { ui.state.innerHTML = `<div class="empty-state error"><h2>Dataset unavailable · 数据暂不可用</h2><p>${escapeHtml(error.message)}</p></div>`; }
  }
  init();
})();
