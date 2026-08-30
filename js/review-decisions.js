(function () {
  "use strict";

  const DATA_URL = "data/candidates/package-g-decision-register.v0.1.json";
  let data;

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function checks(items, includeBasis = false) {
    return `<ul class="check-list">${items.map((item) => `<li class="${item.complete ? "complete" : "open"}"><span><strong>${escapeHtml(item.label)}</strong>${includeBasis ? `<small>${escapeHtml(item.basis)}</small>` : item.evidence_reference ? `<small>${escapeHtml(item.evidence_reference)}</small>` : ""}</span></li>`).join("")}</ul>`;
  }

  function audit(events) {
    return `<div class="audit-list">${events.map((event) => `<article class="audit-event"><strong>${escapeHtml(event.event_type)}</strong><p>${escapeHtml(event.occurred_at)} · ${escapeHtml(event.actor.actor_type)}:${escapeHtml(event.actor.actor_id)}</p><p>${escapeHtml(event.rationale)}</p><small>${escapeHtml(event.reason_code)}</small></article>`).join("")}</div>`;
  }

  function card(record) {
    const decision = record.decision_record;
    const evidence = record.evidence_completeness;
    const publication = record.publication_gate;
    const intake = record.package_f_source.intake_status;
    return `<article class="review-card decision-card" data-intake="${escapeHtml(intake)}" data-search="${escapeHtml(JSON.stringify(record).toLocaleLowerCase("en"))}">
      <header>
        <div><p class="eyebrow">${escapeHtml(record.candidate_id)}</p><h3>${escapeHtml(record.source_word)}</h3><p>Package F intake: <strong>${escapeHtml(intake.replace("_", " "))}</strong></p></div>
        <div class="badge-row"><span class="status-badge decision-${escapeHtml(decision.status)}">decision ${escapeHtml(decision.status)}</span><span class="meta-badge eligibility-${escapeHtml(publication.eligibility_status)}">publication ${escapeHtml(publication.eligibility_status.replace("_", " "))}</span><span class="meta-badge">not published</span></div>
      </header>
      <div class="mapping-summary"><strong>${escapeHtml(decision.status_reason)}</strong><span>${escapeHtml(record.package_f_source.provisional_reason)}</span></div>
      <div class="reason-codes">${decision.reason_codes.map((code) => `<span class="reason-code">${escapeHtml(code)}</span>`).join("")}</div>
      <div class="gate-grid">
        <section class="gate-panel"><h4>Evidence completeness · 证据完整性</h4><p><strong>${escapeHtml(evidence.status.replaceAll("_", " "))}</strong></p>${checks(evidence.checks, true)}<p>${escapeHtml(evidence.eligibility_reason)}</p></section>
        <section class="gate-panel"><h4>Human decision gate · 人工决策门槛</h4><p><strong>${escapeHtml(decision.status)}</strong> · reviewer not assigned</p>${checks(decision.checklist)}${decision.remediation_required.length ? `<p><strong>Remediation:</strong></p><ul>${decision.remediation_required.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}<p>Reviewed requires every check, evidence reference, rationale, reviewer, and date.</p></section>
        <section class="gate-panel"><h4>Publication eligibility · 发布资格</h4><p><strong>${escapeHtml(publication.eligibility_status.replace("_", " "))}</strong></p><p>${escapeHtml(publication.eligibility_reason)}</p>${checks(publication.checklist)}<p><strong>Publisher approval:</strong> absent · automatic promotion disabled</p></section>
      </div>
      <details><summary>Audit history · 审计记录 (${record.audit_log.length})</summary>${audit(record.audit_log)}</details>
    </article>`;
  }

  function renderSummary() {
    const summary = data.status_summary;
    document.getElementById("summaryGrid").innerHTML = [
      [summary.human_decisions.pending, "Pending decisions"],
      [summary.human_decisions.reviewed, "Reviewed"],
      [summary.publication_gate.published, "Published"],
    ].map(([value, label]) => `<div class="summary-card"><strong>${value}</strong><span>${label}</span></div>`).join("");
  }

  function applyFilters() {
    const intake = document.getElementById("intakeFilter").value;
    const query = document.getElementById("decisionSearch").value.trim().toLocaleLowerCase("en");
    let visible = 0;
    document.querySelectorAll(".decision-card").forEach((item) => {
      const matches = (intake === "all" || item.dataset.intake === intake) && (!query || item.dataset.search.includes(query));
      item.hidden = !matches;
      if (matches) visible += 1;
    });
    document.getElementById("decisionSummary").textContent = `${visible} shown · 19 Pending · 0 Reviewed · 0 Eligible · 0 Published`;
  }

  async function init() {
    const queue = document.getElementById("decisionQueue");
    try {
      const response = await fetch(DATA_URL, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Decision data request failed (${response.status})`);
      data = await response.json();
      renderSummary();
      queue.innerHTML = data.records.map(card).join("");
      document.getElementById("intakeFilter").addEventListener("change", applyFilters);
      document.getElementById("decisionSearch").addEventListener("input", applyFilters);
      applyFilters();
    } catch (error) {
      queue.innerHTML = '<div class="empty-state"><h2>Decision data unavailable · 决策数据暂不可用</h2><p>No fallback decisions were generated.</p></div>';
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
