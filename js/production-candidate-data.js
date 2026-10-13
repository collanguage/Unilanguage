(function(root, factory) {
 const api = factory(typeof module === "object" && module.exports ? require("./language-book-data.js") : root.UnilanguageData);
 if (typeof module === "object" && module.exports) module.exports = api;
 root.UnilanguageCandidates = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function(legacy) {
 "use strict";
 const normalize = legacy.normalize;
  // Production candidates are an explicit, separate corpus, never legacy entries.
  async function loadCandidateCorpus(url = "data/candidates/production-corpus.v0.1.json") {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Candidate corpus request failed (${response.status})`);
    const corpus = await response.json();
    if (corpus.batch_id !== "PRODUCTION-CANDIDATE-001" || !Array.isArray(corpus.records))
      throw new Error("Not an active production candidate corpus");
    if (corpus.records.some(r => !r || typeof r.candidate_id !== "string" || !r.candidate_id || typeof r.source_word !== "string" || !r.source_word || typeof r.review_status !== "string" || typeof r.publication_status !== "string") || new Set(corpus.records.map(r => r.candidate_id)).size !== corpus.records.length)
      throw new Error("Malformed production candidate identities");
    return corpus;
  }

  function lookupCandidates(corpus, query) {
    const term = normalize(query);
    if (!term) return { kind: "empty", entry: null, candidates: [] };
    if (corpus?.batch_id !== "PRODUCTION-CANDIDATE-001" || !Array.isArray(corpus.records))
      return { kind: "unknown", entry: null, candidates: [] };
    const candidates = corpus.records.filter((r) => r.review_status === "candidate" &&
      r.publication_status === "not_published" &&
      [r.source_word, r.normalized_form, ...(r.baseline_record?.candidates || []).filter(c => ["Retained", "retained"].includes(c.disposition)).map(c => c.form)]
        .some(form => normalize(form) === term));
    return { kind: candidates.length ? "candidate" : "unknown", entry: null, candidates };
  }


  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const activeRecords = corpus => corpus?.batch_id === "PRODUCTION-CANDIDATE-001" && Array.isArray(corpus.records)
    ? corpus.records.filter(r => r.review_status === "candidate" && r.publication_status === "not_published") : [];
  const primaryForms = entry => [entry.primary_mapping?.source?.word, entry.primary_mapping?.target?.word, entry.slug]
    .flatMap(value => String(value ?? "").split(/\s*[\/／]\s*/)).map(normalize).filter(Boolean);
  const candidateForms = record => [record.source_word, record.normalized_form,
    ...(record.baseline_record?.candidates || []).filter(c => ["Retained", "retained"].includes(c.disposition)).map(c => c.form)].map(normalize).filter(Boolean);

  // Identity is resolved before rendering. Never join RO/RQ objects to LB IDs.
  function resolve(dataset, corpus, query, selection = {}) {
    const term = normalize(query), records = activeRecords(corpus);
    const visible = (dataset?.entries || []).filter(e => e.mapping_status !== "Rejected" && e.classification_status !== "rejected");
    const candidates = records.filter(r => candidateForms(r).includes(term));
    const primary = visible.filter(e => primaryForms(e).includes(term));
    const aliases = visible.filter(e => legacy.searchableForms(e).includes(term));
    const candidateChoice = r => ({domain: "candidate", candidateId: r.candidate_id, entry: r,
      matchType: [r.source_word, r.normalized_form].map(normalize).includes(term) ? "source-exact" : "retained-exact"});
    const legacyChoice = e => ({domain: "legacy", legacyId: e.id, entry: legacy.queryView(e, term),
      matchType: primaryForms(e).includes(term) ? "primary-exact" : "related-form-exact"});
    const result = {query: String(query ?? ""), normalizedQuery: term, kind: "unknown", suggestions: [], choices: [], related: []};
    if (!term) return {...result, kind: "empty"};
    if (selection.domain) {
      const chosen = selection.domain === "candidate" ? candidates.find(r => r.candidate_id === selection.candidateId)
        : selection.domain === "legacy" ? aliases.find(e => e.id === selection.legacyId) : null;
      if (!chosen) return {...result, kind: "invalid-identity"};
      const choice = selection.domain === "candidate" ? candidateChoice(chosen) : legacyChoice(chosen);
      return {...result, ...choice, kind: choice.domain, related: selection.domain === "candidate" ? aliases.map(legacyChoice) : []};
    }
    const source = candidates.filter(r => [r.source_word, r.normalized_form].map(normalize).includes(term));
    // A source candidate outranks a legacy alias, but primary/retained conflicts require a choice.
    const choices = source.length ? [...source.map(candidateChoice), ...primary.map(legacyChoice)]
      : candidates.length ? [...candidates.map(candidateChoice), ...primary.map(legacyChoice)]
      : (primary.length ? primary : aliases).map(legacyChoice);
    if (choices.length > 1) return {...result, kind: "ambiguous", choices};
    if (choices.length === 1) return {...result, ...choices[0], kind: choices[0].domain,
      related: choices[0].domain === "candidate" ? aliases.map(legacyChoice) : []};
    return {...result, suggestions: dataset ? legacy.lookup(dataset, query).suggestions : []};
  }

  function mapperUrl(query, identity = {}) {
    const params = new URLSearchParams({q: String(query ?? "")});
    if (identity.domain) params.set("domain", identity.domain);
    if (identity.candidateId) params.set("candidateId", identity.candidateId);
    if (identity.legacyId) params.set("legacyId", identity.legacyId);
    return `semantic-mapper.html?${params}`;
  }

  // Load independently so a failure is visible and never silently becomes a legacy hit.
  async function loadSources() {
    const [book, candidate] = await Promise.allSettled([legacy.loadDataset(), loadCandidateCorpus()]);
    return {dataset: book.status === "fulfilled" ? book.value : null,
      corpus: candidate.status === "fulfilled" ? candidate.value : null,
      legacyError: book.status === "rejected" ? String(book.reason.message) : "",
      candidateError: candidate.status === "rejected" ? String(candidate.reason.message) : ""};
  }

  function availability(sources) {
    return (sources.candidateError ? `<p class="boundary" role="status">Production candidate data unavailable · 生产候选数据暂不可用：${esc(sources.candidateError)}. Candidate identity cannot be checked; any legacy result below is a separate record.</p>` : "")
      + (sources.legacyError ? `<p class="boundary" role="status">Language Book unavailable · 旧词条数据暂不可用：${esc(sources.legacyError)}</p>` : "");
  }

  const displayList = value => Array.isArray(value) ? value : value && typeof value === "object"
    ? Object.entries(value).map(([key, item]) => `${key}: ${JSON.stringify(item)}`) : value ? [String(value)] : [];

  function renderCandidate(record, card = false) {
    const b = record.baseline_record || {}, summary = b.research_record?.featured_summary;
    const featured = record.featured_mapping_status === "Candidate";
    const scope = b.editorial_boundary || summary?.scope;
    const pending = displayList(b.pending || record.blockers);
    const details = [ ["Mapping type", b.mapping_type || summary?.type], ["Scope · 限定义域", scope],
      ["Depth", b.depth_status], ["Phonetic Fit", b.phonetic_fit], ["Historical Relation", b.historical_relation],
      ["Provenance", b.provenance || b.author_observation?.status] ];
    return `<article class="${card ? "card word-card" : "classification-object"}" data-candidate-id="${esc(record.candidate_id)}">
      <p class="label">Production Candidate · ${esc(record.candidate_id)} · ${esc(b.source_language || "Language not recorded")}</p>
      <h2>${esc(record.source_word)}${featured ? ` → ${esc(record.candidate_mapping)}` : ""}</h2>
      <p>Featured Mapping: ${featured ? "Candidate" : "Pending"} · <strong>${esc(record.review_status)} / ${esc(record.publication_status)}</strong></p>
      ${details.filter(([,value]) => value).map(([label,value]) => `<p><strong>${esc(label)}:</strong> ${esc(value)}</p>`).join("")}
      <p>Editorial intake is not Published or proven historical cognacy. · 编辑接纳不等于已发表或历史同源已证。</p>
      <details><summary>Pending / evidence boundaries · 待核与证据边界</summary><ul>${pending.map(v => `<li>${esc(v)}</li>`).join("")}</ul>
      ${displayList(b.research_record?.evidence_boundaries).map(v => `<p>${esc(v)}</p>`).join("")}</details>
      <p class="small">Public source provenance: ${esc(record.source_provenance)}</p>
      <a href="${esc(mapperUrl(record.source_word, {domain:"candidate", candidateId:record.candidate_id}))}">${card ? "Open in Mapper" : "Copy / reopen this candidate link"} →</a>
    </article>`;
  }

  function legacyNotice(entry, query) {
    const related = !primaryForms(entry).includes(normalize(query));
    return `<p class="boundary">Language Book · ${esc(entry.id)}${related ? ` · Query “${esc(query)}” matches a related form of ${esc(entry.slug.toUpperCase())}; this is not an independent Featured Mapping for the query. · 旧词条关联形式，不是此查询的独立 Featured Mapping。` : ""}</p>`;
  }

  function renderChoices(choices, query) {
    return `<div class="empty-state"><h2>Select a recorded identity · 请选择词条身份</h2><ul>${choices.map(c => `<li><a href="${esc(mapperUrl(query,c))}">${esc(c.domain)} · ${esc(c.candidateId || c.legacyId)} · ${esc(c.entry.source_word || c.entry.primary_mapping.source.word)} · ${esc(c.entry.baseline_record?.source_language || c.entry.primary_mapping?.source?.language || "Language not recorded")} · ${esc(c.matchType)}</a></li>`).join("")}</ul></div>`;
  }

  return { loadCandidateCorpus, lookupCandidates, activeRecords, candidateForms, resolve, mapperUrl,
    loadSources, availability, renderCandidate, legacyNotice, renderChoices };

});
