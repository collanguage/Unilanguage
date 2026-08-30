(function () {
  "use strict";

  const ui = {
    form: document.querySelector("#mapperForm"), input: document.querySelector("#mapperInput"),
    state: document.querySelector("#mapperState"), result: document.querySelector("#mapperResult"),
    version: document.querySelector("#datasetVersion"),
  };
  let dataset;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const text = (value) => `${escapeHtml(value.en)}<span lang="zh-Hans">${escapeHtml(value["zh-Hans"])}</span>`;
  const byId = (items, key) => new Map(items.map((item) => [item[key], item]));

  function reviewStrip(item) {
    const source = item.source_verification;
    const ai = item.ai_review;
    const sourceMap = byId(dataset.sources, "source_id");
    const sources = source.source_refs.map((id) => sourceMap.get(id)).filter(Boolean);
    const sourceLinks = sources.length ? `<details class="source-details"><summary>Sources · 来源 (${sources.length})</summary><ul>${sources.map((record) => `<li>${record.url ? `<a href="${escapeHtml(record.url)}" target="_blank" rel="noopener">${escapeHtml(record.title)}</a>` : escapeHtml(record.title)}${record.source_quality ? ` <small>${escapeHtml(record.source_quality)}</small>` : ""}</li>`).join("")}</ul><p>${text(source.notes)}</p></details>` : `<p class="source-limit">${text(source.notes)}</p>`;
    return `<div class="object-reviews" aria-label="Object reviews">
      <span><strong>Source Verification · 来源核验</strong>${escapeHtml(source.status)}</span>
      <span><strong>AI Review · AI 审核</strong>${escapeHtml(ai.status)}</span>
    </div>${sourceLinks}`;
  }

  function identityBadge(identity) {
    const labels = {
      "source-backed-lexical-mapping": "Fact / Source-backed · 来源支持",
      "author-idea": "Author Idea · 作者原创想法",
      "historical-claim": "Historical Claim · 历史词源主张",
      "author-hypothesis": "Author Hypothesis · 作者假说",
      "author-note": "Author Note · 作者笔记",
      "experimental-result": "Experimental Result · 实验结果",
    };
    return `<span class="identity-badge identity-${escapeHtml(identity)}">${escapeHtml(labels[identity] || identity)}</span>`;
  }

  function mappingCard(mapping) {
    return `<article class="classification-object">
      <div class="object-heading">${identityBadge(mapping.identity)}<span class="status-chip">${escapeHtml(mapping.status)}</span></div>
      <h4>${escapeHtml(mapping.chinese_form)}${mapping.pinyin ? ` <small>${escapeHtml(mapping.pinyin)}</small>` : ""}</h4>
      <p><strong>Basis · 依据：</strong>${escapeHtml(mapping.mapping_basis)} · <strong>Role · 角色：</strong>${escapeHtml(mapping.role)}</p>
      ${reviewStrip(mapping)}
    </article>`;
  }

  function rationaleCard(item) {
    return `<article class="classification-object author-object">
      <div class="object-heading">${identityBadge(item.identity)}<span class="status-chip">${escapeHtml(item.status)}</span></div>
      <p>${text(item.statement)}</p>${reviewStrip(item)}
    </article>`;
  }

  function etymologyCard(item) {
    return `<article class="classification-object fact-object">
      <div class="object-heading">${identityBadge(item.identity)}<span class="status-chip">${escapeHtml(item.status)}</span></div>
      <p class="etymology-chain">${item.chain.map(escapeHtml).join(" <span aria-hidden=\"true\">←</span> ")}</p>
      <p>${text(item.summary)}</p>${reviewStrip(item)}
    </article>`;
  }

  function hypothesisCard(item) {
    const evidence = item.evidence_refs.length ? item.evidence_refs.map(escapeHtml).join(" · ") : "None recorded · 尚无证据记录";
    return `<article class="classification-object hypothesis-object">
      <div class="object-heading">${identityBadge(item.identity)}<span class="status-chip">${escapeHtml(item.status)} · confidence ${escapeHtml(item.confidence)}</span></div>
      <h4>${text(item.label)}</h4><p>${text(item.statement)}</p>
      <p><strong>Type · 类型：</strong>${escapeHtml(item.hypothesis_type)}<br><strong>Evidence refs · 证据引用：</strong>${evidence}</p>
      ${reviewStrip(item)}
    </article>`;
  }

  function noteCard(item) {
    return `<article class="classification-object note-object">
      <div class="object-heading">${identityBadge(item.identity)}<span class="status-chip">${escapeHtml(item.status)}</span></div>
      <p>${text(item.text)}</p>${reviewStrip(item)}
    </article>`;
  }

  function experimentCard(item) {
    const m = item.metrics || {};
    const metrics = item.experiment_id === "UNI-EXP-002" ? `<div class="metric-grid">
      <div><span>W</span><strong>${m.w_target}/${m.w_total}</strong><small>${m.w_rate_percent}%</small></div>
      <div><span>Controls</span><strong>${m.control_target}/${m.control_total}</strong><small>${m.control_rate_percent}%</small></div>
      <div><span>RR</span><strong>${m.risk_ratio}</strong><small>95% CI ${m.risk_ratio_95_ci.join("–")}</small></div>
      <div><span>RD</span><strong>${m.risk_difference_percentage_points} pp</strong><small>95% CI ${m.risk_difference_95_ci_percentage_points.join(" to ")}</small></div>
      <div><span>Fisher</span><strong>p=${m.fisher_two_sided_p}</strong><small>two-sided</small></div>
    </div>` : "";
    return `<article class="classification-object experiment-object">
      <div class="object-heading">${identityBadge(item.identity)}<span class="status-chip">${escapeHtml(item.status)}</span></div>
      <h4>${escapeHtml(item.experiment_id)} · ${text(item.title)}</h4>
      <p><strong>Tested condition · 检验条件</strong><br>${text(item.tested_condition)}</p>
      <p><strong>Result · 结果</strong><br>${text(item.result)}</p>
      <p><strong>Hypothesis reference · 假说引用：</strong>${item.hypothesis_refs.map(escapeHtml).join(" · ")}</p>
      ${metrics}${reviewStrip(item)}
      ${item.experiment_id === "UNI-EXP-002" ? '<p><a href="experiments/002/results.html">Open frozen result · 查看冻结结果 →</a></p>' : ""}
    </article>`;
  }

  const emptyLayer = (message) => `<p class="empty-layer">${message}</p>`;
  function layer(letter, title, description, content) {
    return `<section class="classification-layer"><div class="layer-label">${letter}</div><div class="layer-content"><h3>${title}</h3><p class="layer-description">${description}</p>${content}</div></section>`;
  }

  function renderEntry(entry) {
    const hypothesisMap = byId(dataset.hypotheses, "hypothesis_id");
    const experimentMap = byId(dataset.experiments, "experiment_id");
    const hypotheses = entry.sound_symbol_hypothesis_refs.map((id) => hypothesisMap.get(id)).filter(Boolean);
    const experiments = entry.experimental_validation_refs.map((id) => experimentMap.get(id)).filter(Boolean);
    const allObjects = [entry.primary_chinese_mapping, ...entry.secondary_chinese_mappings, ...entry.mapping_rationales, ...entry.historical_etymologies, ...hypotheses, ...entry.other_author_notes, ...experiments];
    const sourceCounts = allObjects.reduce((acc, item) => { acc[item.source_verification.status] = (acc[item.source_verification.status] || 0) + 1; return acc; }, {});
    const aiCounts = allObjects.reduce((acc, item) => { acc[item.ai_review.status] = (acc[item.ai_review.status] || 0) + 1; return acc; }, {});

    ui.state.innerHTML = "";
    ui.result.hidden = false;
    ui.result.innerHTML = `<header class="entry-header"><div><p class="mapper-kicker">English word record · 英语词记录</p><h2>${escapeHtml(entry.source_word)}</h2><p class="entry-language">${escapeHtml(entry.language)}${entry.pronunciation ? ` · ${escapeHtml(entry.pronunciation)}` : ""}</p></div><span class="record-badge status-${escapeHtml(entry.classification_status)}">${escapeHtml(entry.classification_status)}<br>Not a shared evidence status</span></header>
      <section class="lexical-meaning"><h3>Lexical Meaning · 词义</h3><p>${text(entry.lexical_meaning)}</p></section>
      <p class="evidence-boundary"><strong>Classification boundary · 分类边界：</strong> a mapping does not become etymology; a hypothesis does not become a result; an experiment tests a cited hypothesis and cannot create a universal sound law. · Mapping 不等于词源；假说不等于结果；实验只检验所引用的假说，不能自动产生普遍声音法则。</p>
      <div class="classification-stack">
        ${layer("A", "Primary Chinese Mapping · 主要汉语映射", "Exactly one primary mapping object; secondary mappings remain separate. · primary 恰好一个，secondary 独立保存。", mappingCard(entry.primary_chinese_mapping) + (entry.secondary_chinese_mappings.length ? `<details><summary>Secondary mappings · 次要映射 (${entry.secondary_chinese_mappings.length})</summary>${entry.secondary_chinese_mappings.map(mappingCard).join("")}</details>` : ""))}
        ${layer("B", "Mapping Rationale / Author Idea · 映射理由／作者想法", "Why the author proposed the mapping; never presented as established fact. · 保存作者为何提出此对应，不作为既成事实。", entry.mapping_rationales.length ? entry.mapping_rationales.map(rationaleCard).join("") : emptyLayer("No separate rationale recorded · 尚无独立理由记录"))}
        ${layer("C", "Historical Etymology · 历史词源", "Only historical lineage claims belong here; cross-language resemblance is excluded. · 这里只放历史语言学链条，跨语言相似性不得替代词源。", entry.historical_etymologies.length ? entry.historical_etymologies.map(etymologyCard).join("") : emptyLayer("No historical etymology object recorded · 尚无历史词源对象"))}
        ${layer("D", "Sound / Consonant / Symbol Hypotheses · 声音／辅音／符号假说", "Each hypothesis has its own status, evidence, confidence and reviews. · 每个假说独立记录状态、证据、置信度与审核。", hypotheses.length ? hypotheses.map(hypothesisCard).join("") : emptyLayer("No linked sound or symbol hypothesis · 尚无声音或符号假说"))}
        ${layer("E", "Other Author Notes · 其他作者笔记", "Unclassified ideas are preserved without forced interpretation. · 未分类想法保留原意，不强行解释。", entry.other_author_notes.length ? entry.other_author_notes.map(noteCard).join("") : emptyLayer("No other author notes · 暂无其他作者笔记"))}
        ${layer("F", "Experimental Validation · 实验验证", "Only actually run experiments appear here, linked back to hypotheses. · 只有实际执行的实验进入此层，并反向引用假说。", experiments.length ? experiments.map(experimentCard).join("") : emptyLayer("No experiment linked; absence is not negative evidence. · 尚无关联实验；没有实验不等于反证。"))}
        ${layer("G", "Object-level Source Verification + AI Review · 对象级来源核验与 AI 审核", "Reviews are counted per object, not inherited from the word record. · 审核逐对象进行，不从词条整体继承。", `<div class="review-summary"><div><strong>Source Verification</strong>${Object.entries(sourceCounts).map(([key, value]) => `<span>${escapeHtml(key)}: ${value}</span>`).join("")}</div><div><strong>AI Review</strong>${Object.entries(aiCounts).map(([key, value]) => `<span>${escapeHtml(key)}: ${value}</span>`).join("")}</div></div><p><a href="object-review-method.html">Open G.2 object-review rubric · 查看 G.2 对象审核规则 →</a></p>`)}
      </div>`;
  }

  function renderUnknown(query, suggestions) {
    ui.result.hidden = true;
    const suggestionHtml = suggestions.length ? `<p>Possible recorded entries · 可能的已记录词条：</p><div class="suggestions">${suggestions.map((entry) => `<button type="button" data-query="${escapeHtml(entry.source_word)}">${escapeHtml(entry.source_word)}</button>`).join("")}</div>` : "";
    ui.state.innerHTML = `<div class="empty-state"><p class="mapper-kicker">No classified word record · 暂无分类词条</p><h2>“${escapeHtml(query)}” is not in dataset v${escapeHtml(dataset.dataset_version)}.</h2><p>The separate 19-record review queue is not exposed as canonical word records, and no result is generated. · 独立的 19 条审核队列不会作为 canonical 词条展示，系统也不会临时生成结果。</p>${suggestionHtml}</div>`;
    ui.state.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => runLookup(button.dataset.query)));
  }

  function runLookup(raw) {
    const query = String(raw ?? ui.input.value).trim();
    ui.input.value = query;
    if (!query) { ui.result.hidden = true; ui.state.innerHTML = '<div class="empty-state"><p>Enter an English word or recorded form. · 请输入英语词或已记录形式。</p></div>'; return; }
    const result = UnilanguageData.lookup(dataset, query);
    if (result.kind === "exact") renderEntry(result.entry); else renderUnknown(query, result.suggestions);
    const url = new URL(window.location.href); url.searchParams.set("q", query); history.replaceState(null, "", url);
  }

  async function init() {
    try {
      dataset = await UnilanguageData.loadDataset();
      const published = dataset.entries.filter((entry) => entry.classification_status === "published").length;
      const candidates = dataset.entries.filter((entry) => entry.classification_status === "candidate").length;
      ui.version.textContent = `Dataset v${dataset.dataset_version} · Schema ${dataset.schema_version} · ${published} published / ${candidates} calibration candidates`;
      document.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => runLookup(button.dataset.example)));
      ui.form.addEventListener("submit", (event) => { event.preventDefault(); runLookup(); });
      const query = new URL(window.location.href).searchParams.get("q");
      if (query) runLookup(query); else runLookup("water");
    } catch (error) {
      ui.state.innerHTML = `<div class="empty-state error"><h2>Dataset unavailable · 数据暂不可用</h2><p>${escapeHtml(error.message)}</p></div>`;
    }
  }

  init();
})();
