(function () {
  "use strict";

  const ui = {};
  let dataset;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function statusLabel(status) {
    const labels = {
      Untested: "Untested · 未测试",
      "Tested-Supported": "Tested — Supported · 已测试—支持",
      "Tested-Inconclusive": "Tested — Inconclusive · 已测试—不确定",
      "Tested-Not-Supported": "Tested — Not Supported · 已测试—不支持",
      Invalid: "Invalid · 无效",
    };
    return labels[status] || status;
  }

  function experimentCard(experiment) {
    const m = experiment.metrics || {};
    if (experiment.experiment_id !== "UNI-EXP-002") return "";
    return `<section class="experiment-card" aria-label="Experiment 002 frozen result">
      <div class="result-heading">
        <p class="mapper-kicker">Experimentally Tested Result · 实验检验结果</p>
        <span class="evaluation-status inconclusive">${escapeHtml(statusLabel(experiment.status))}</span>
      </div>
      <h4>${escapeHtml(experiment.experiment_id)} · ${escapeHtml(experiment.title.en)}</h4>
      <div class="metric-grid">
        <div><span>W</span><strong>${m.w_target}/${m.w_total}</strong><small>${m.w_rate_percent}%</small></div>
        <div><span>Controls</span><strong>${m.control_target}/${m.control_total}</strong><small>${m.control_rate_percent}%</small></div>
        <div><span>Risk Ratio</span><strong>${m.risk_ratio}</strong><small>95% CI ${m.risk_ratio_95_ci.join("–")}</small></div>
        <div><span>Risk Difference</span><strong>+${m.risk_difference_percentage_points} pp</strong><small>95% CI ${m.risk_difference_95_ci_percentage_points.join(" to ")}</small></div>
        <div><span>Fisher exact</span><strong>p=${String(m.fisher_two_sided_p).replace(/^0/, "")}</strong><small>two-sided · 双侧</small></div>
      </div>
      <p class="boundary"><strong>Primary conclusion · 主结论：</strong> INCONCLUSIVE. The direction is compatible with the hypothesis, but the evidence is insufficient; this is neither support nor a common-origin claim. · 方向与假说相容，但证据不足；这既不是支持结论，也不是共同词源证明。</p>
      <a href="experiments/002/results.html">Open frozen result · 查看冻结结果 →</a>
    </section>`;
  }

  function mappingCard(mapping, index) {
    const sources = UnilanguageData.resolveSources(dataset, mapping.source_provenance);
    const experiments = UnilanguageData.resolveExperiments(dataset, mapping.experiment_links);
    const sourceLinks = sources
      .map((source) => `<a href="${escapeHtml(source.path)}">${escapeHtml(source.title)}</a>`)
      .join(" · ");
    const hypothesisLinks = mapping.hypothesis_links.length
      ? mapping.hypothesis_links.map(escapeHtml).join(" · ")
      : "None · 无";

    return `<article class="mapping-result">
      <div class="result-heading">
        <p class="mapper-kicker">${escapeHtml(mapping.claim_kind)} · Mapping ${index + 1}</p>
        <span class="mapping-level level-${mapping.mapping_level.toLowerCase()}">Level ${escapeHtml(mapping.mapping_level)}</span>
      </div>
      <h3>${escapeHtml(mapping.mapping_form)}</h3>
      <dl class="mapping-details">
        <div><dt>Mapping type · 映射类型</dt><dd>${escapeHtml(mapping.mapping_type)}</dd></div>
        <div><dt>Mapping language · 映射语言</dt><dd>${escapeHtml(mapping.mapping_language)}</dd></div>
        <div><dt>Phonetic relation · 语音关系</dt><dd>${escapeHtml(mapping.phonetic_relation || "No evidenced phonetic relation recorded · 暂无有证据的语音关系")}</dd></div>
        <div><dt>Semantic structure · 语义结构</dt><dd><code>${escapeHtml(mapping.semantic_structure)}</code></dd></div>
        <div><dt>Etymology / evidence · 词源／证据</dt><dd>${escapeHtml(mapping.etymology_evidence.en)}<span lang="zh-Hans">${escapeHtml(mapping.etymology_evidence["zh-Hans"])}</span></dd></div>
        <div><dt>Evidence tracks · 证据轨道</dt><dd>${mapping.evidence_tracks.map((track) => `<span class="track">${escapeHtml(track)}</span>`).join(" ")}</dd></div>
        <div><dt>Evaluation status · 评估状态</dt><dd><span class="evaluation-status ${mapping.experiment_status === "Tested-Inconclusive" ? "inconclusive" : ""}">${escapeHtml(statusLabel(mapping.experiment_status))}</span></dd></div>
        <div><dt>Hypothesis link · 假说链接</dt><dd>${hypothesisLinks}</dd></div>
        <div><dt>Review · 审核</dt><dd>${escapeHtml(mapping.review_status)} · confidence ${escapeHtml(mapping.confidence)} <span class="review-dot" aria-label="reviewed provenance">●</span></dd></div>
        <div><dt>Provenance · 来源</dt><dd>${sourceLinks}</dd></div>
      </dl>
      <p class="mapping-note">${escapeHtml(mapping.notes.en)}<span lang="zh-Hans">${escapeHtml(mapping.notes["zh-Hans"])}</span></p>
      ${experiments.map(experimentCard).join("")}
    </article>`;
  }

  function renderEntry(entry) {
    const sources = UnilanguageData.resolveSources(dataset, entry.source_provenance);
    ui.state.hidden = true;
    ui.result.hidden = false;
    ui.result.innerHTML = `<header class="entry-header">
      <div>
        <p class="mapper-kicker">${escapeHtml(entry.entry_id)} · dataset ${escapeHtml(dataset.dataset_version)}</p>
        <h2>${escapeHtml(entry.source_word)}</h2>
        <p class="entry-language">${escapeHtml(entry.language)}${entry.pronunciation ? ` · ${escapeHtml(entry.pronunciation)}` : ""}</p>
      </div>
      <span class="published-badge">Reviewed · Published<br>已审核 · 已发布</span>
    </header>
    <section class="lexical-meaning">
      <h3>Lexical Meaning · 词汇意义</h3>
      <p>${escapeHtml(entry.lexical_meaning.en)}</p>
      <p lang="zh-Hans">${escapeHtml(entry.lexical_meaning["zh-Hans"])}</p>
    </section>
    <section>
      <h3 class="section-title">Cross-language Candidate Mapping(s) · 跨语言候选映射</h3>
      <p class="evidence-boundary">Observed mappings, hypotheses and experimentally tested results are different claim types. Mapping Level measures the current framework classification; it does not prove common origin. · 已观察映射、假说与实验检验结果属于不同主张类型。Mapping Level 表示当前框架分类，不证明共同起源。</p>
      <div class="mapping-list">${entry.candidate_cross_language_mappings.map(mappingCard).join("")}</div>
    </section>
    <footer class="entry-provenance">
      <strong>Entry provenance · 词条来源：</strong>
      ${sources.map((source) => `<a href="${escapeHtml(source.path)}">${escapeHtml(source.title)}</a>`).join(" · ")}
      <span>${escapeHtml(entry.version)} · ${escapeHtml(entry.author)}</span>
    </footer>`;
  }

  function renderUnknown(query, suggestions) {
    ui.result.hidden = true;
    ui.state.hidden = false;
    const suggestionHtml = suggestions.length
      ? `<p>Possible reviewed entries · 可能的已审核词条：</p><div class="suggestions">${suggestions.map((entry) => `<button type="button" data-query="${escapeHtml(entry.source_word)}">${escapeHtml(entry.source_word)}</button>`).join("")}</div>`
      : "";
    ui.state.innerHTML = `<div class="empty-state"><p class="mapper-kicker">No reviewed mapping · 暂无已审核映射</p><h2>“${escapeHtml(query)}” is not in dataset v${escapeHtml(dataset.dataset_version)}.</h2><p>Unilanguage will not generate evidence or mappings for an unknown term. You can try another form or return after a reviewed entry is published. · Unilanguage 不会为未知词临时生成证据或映射；请尝试其他形式，或等待词条完成审核并发布。</p>${suggestionHtml}</div>`;
    ui.state.querySelectorAll("[data-query]").forEach((button) => {
      button.addEventListener("click", () => runLookup(button.dataset.query));
    });
  }

  function runLookup(forcedQuery) {
    const query = forcedQuery ?? ui.input.value;
    ui.input.value = query;
    const result = UnilanguageData.lookup(dataset, query);
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);

    if (result.kind === "exact") renderEntry(result.entry);
    else if (result.kind === "unknown") renderUnknown(query, result.suggestions);
    else {
      ui.result.hidden = true;
      ui.state.hidden = false;
      ui.state.innerHTML = '<div class="empty-state"><h2>Enter a word · 输入一个词</h2><p>Try sky, universe, man, W or water. · 可尝试 sky、universe、man、W 或 water。</p></div>';
    }
  }

  async function init() {
    ui.form = document.getElementById("mapperForm");
    ui.input = document.getElementById("mapperInput");
    ui.state = document.getElementById("mapperState");
    ui.result = document.getElementById("mapperResult");
    try {
      dataset = await UnilanguageData.loadDataset();
      document.getElementById("datasetVersion").textContent = `Dataset v${dataset.dataset_version} · ${dataset.entries.length} reviewed entries`;
      ui.form.addEventListener("submit", (event) => {
        event.preventDefault();
        runLookup();
      });
      document.querySelectorAll("[data-example]").forEach((button) =>
        button.addEventListener("click", () => runLookup(button.dataset.example)),
      );
      const query = new URLSearchParams(window.location.search).get("q") || "";
      runLookup(query);
    } catch (error) {
      ui.state.innerHTML = `<div class="empty-state error"><h2>Dataset unavailable · 数据暂不可用</h2><p>The versioned evidence layer could not be loaded. No generated fallback will be used. · 版本化证据层无法加载，系统不会使用生成式替代内容。</p></div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
