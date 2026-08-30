(function () {
  "use strict";

  const DATA_URL = "data/candidates/package-f-review-queue.v0.1.json";
  let data;

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function list(items) {
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function sourceCard(source) {
    const isExternal = /^https?:/.test(source.url);
    const attributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<article class="source-card">
      <a href="${escapeHtml(source.url)}"${attributes}>${escapeHtml(source.title)}</a>
      <dl>
        <dt>Type · 类型</dt><dd>${escapeHtml(source.source_type)}</dd>
        <dt>Exact location · 具体出处</dt><dd>${escapeHtml(source.locator)} · ${escapeHtml(source.specific_location)}</dd>
        <dt>Access / version · 访问／版本</dt><dd>${escapeHtml(source.accessed_at)} · ${escapeHtml(source.version_info)}</dd>
        <dt>Verifiable content · 可核验内容</dt><dd>${escapeHtml(source.verifiable_content)}</dd>
        <dt>Supports · 支持</dt><dd>${list(source.supports)}</dd>
        <dt>Does not support · 不支持</dt><dd>${list(source.does_not_support)}</dd>
      </dl>
    </article>`;
  }

  function trackRow(name, value) {
    const labels = {
      linguistic_etymological: "Linguistic / etymological · 语言学／词源",
      phonetic: "Phonetic · 语音",
      semantic_cognitive: "Semantic / cognitive · 语义／认知",
      speculative_association: "Speculative association · 推测关联",
    };
    return `<div class="track-row"><strong>${labels[name]}</strong><span class="track-status track-${escapeHtml(value.status)}">${escapeHtml(value.status)}</span><p>${escapeHtml(value.supports)}</p><small>${escapeHtml(value.limits)}</small></div>`;
  }

  function reviewCard(record) {
    const assessment = record.provisional_assessment;
    const statusLabel = assessment.review_status.replace("_", " ");
    return `<article class="review-card ${assessment.review_status.replace("_", "-")}" data-status="${escapeHtml(assessment.review_status)}" data-search="${escapeHtml(JSON.stringify(record).toLocaleLowerCase("en"))}">
      <header>
        <div><p class="eyebrow">${escapeHtml(record.candidate_id)}</p><h3>${escapeHtml(record.source_word)}</h3><p>${escapeHtml(record.scoped_analysis.selected_sense)} · ${escapeHtml(record.scoped_analysis.part_of_speech)}</p></div>
        <div class="badge-row"><span class="status-badge status-${escapeHtml(assessment.review_status)}">${escapeHtml(statusLabel)}</span><span class="meta-badge">confidence ${escapeHtml(assessment.confidence)}</span><span class="meta-badge">provisional level ${escapeHtml(assessment.mapping_level)}</span><span class="meta-badge">not published</span></div>
      </header>
      <div class="mapping-summary"><strong>${escapeHtml(record.scoped_analysis.reviewed_candidate_mapping)}</strong><span>${escapeHtml(record.scoped_analysis.claim_boundary)}</span></div>
      <div class="review-grid">
        <section class="review-panel"><h4>Provisional decision · 暂定判断</h4><p>${escapeHtml(assessment.reason)}</p><p><strong>Human decision:</strong> pending · reviewer not assigned</p></section>
        <section class="review-panel"><h4>Counterexamples / uncertainty / conflicts · 反例／不确定性／冲突</h4>${list(record.counterexamples_uncertainties_conflicts)}</section>
        <section class="review-panel"><h4>Evidence tracks · 证据轨道</h4><div class="track-grid">${Object.entries(record.evidence_tracks).map(([name, value]) => trackRow(name, value)).join("")}</div></section>
        <section class="review-panel"><h4>Human checklist · 人工审核清单</h4><ul class="checklist">${record.human_review.checklist.map((item) => `<li>${escapeHtml(item.item)}</li>`).join("")}</ul><p><strong>Allowed decision:</strong> Reviewed / Rejected / Needs Evidence. Published is separate.</p></section>
      </div>
      <details><summary>Source verification · 来源核验 (${record.source_verification.length})</summary><div class="source-list">${record.source_verification.map(sourceCard).join("")}</div></details>
    </article>`;
  }

  function applyFilters() {
    const status = document.getElementById("statusFilter").value;
    const query = document.getElementById("reviewSearch").value.trim().toLocaleLowerCase("en");
    let visible = 0;
    document.querySelectorAll(".review-card").forEach((card) => {
      const matches = (status === "all" || card.dataset.status === status) && (!query || card.dataset.search.includes(query));
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    document.getElementById("queueSummary").textContent = `${visible} shown · ${data.status_summary.candidate} Candidate · ${data.status_summary.needs_evidence} Needs Evidence · 0 Reviewed · 0 Published`;
  }

  async function init() {
    const queue = document.getElementById("reviewQueue");
    try {
      const response = await fetch(DATA_URL, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Review data request failed (${response.status})`);
      data = await response.json();
      queue.innerHTML = data.records.map(reviewCard).join("");
      document.getElementById("statusFilter").addEventListener("change", applyFilters);
      document.getElementById("reviewSearch").addEventListener("input", applyFilters);
      applyFilters();
    } catch (error) {
      queue.innerHTML = '<div class="empty-state"><h2>Review data unavailable · 审核数据暂不可用</h2><p>No fallback records were generated.</p></div>';
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
