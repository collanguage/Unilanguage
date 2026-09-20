(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.UnilanguageDiachronic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isPilot = e => e.diachronic_semantic_mapping?.model_version === '0.1';
  const statusLabel = s => ({pending:'Pending', none_found:'None found (within recorded scope)', candidates_recorded:'Candidates recorded', not_selected:'Not selected'})[s] || s;
  function candidates(e) { return (e.diachronic_semantic_mapping?.mappings || []).flatMap(m => m.candidates || []); }
  function featured(e) {
    if (!isPilot(e)) return null;
    return candidates(e).find(c => c.candidate_id === e.diachronic_semantic_mapping.display_selection.featured_candidate_ref) || null;
  }
  function headline(e) {
    const c = featured(e);
    return `${e.primary_mapping.source.word.toUpperCase()} · ${e.standard_translation?.target || e.primary_mapping.target.word} · ${c ? `Featured: ${c.target.form}` : 'Featured Mapping: Pending'}`;
  }
  function renderCards(e, researchUrl) {
    if (!isPilot(e)) return '';
    const d = e.diachronic_semantic_mapping;
    return d.display_selection.stage_cards.map(card => {
      const m = d.mappings.find(x => x.stage_mapping_id === card.stage_mapping_ref);
      const s = d.historical_stages.find(x => x.stage_id === m.stage_ref);
      const c = m.candidates.find(x => x.candidate_id === card.candidate_ref);
      return `<article class="classification-object diachronic-stage-card" data-stage="${esc(s.stage_id)}"><h3>${esc(s.form)} · ${esc(s.meaning.gloss)}</h3><p>${esc(s.language.name)} · ${esc(s.period.label)}</p>${c ? `<p><strong>Stage candidate: ${esc(c.target.form)}</strong> · ${esc(c.target.pronunciations[0]?.value)}</p><p>Semantic: ${esc(c.semantic_fit.fit)} · Phonetic: ${esc(c.phonetic_fit.fit)} · Historical Relation: Not claimed</p><p>${esc(c.decision_reason)}</p>` : `<p><strong>Chinese Mapping: ${esc(statusLabel(m.search.status))}</strong></p><p>${esc(m.search.stop_reason)}</p>`}<a href="${esc(researchUrl)}">Research / Evidence · 研究与证据</a></article>`;
    }).join('');
  }
  // Cross-reference and semantic invariants complement (rather than replace) JSON Schema.
  function validate(e) {
    if (!isPilot(e)) return [];
    const errors = [], check = (v, msg) => { if (!v) errors.push(`${e.id}: ${msg}`); };
    const d = e.diachronic_semantic_mapping, stages = d.historical_stages || [], maps = d.mappings || [];
    const refs = new Set((e.references || []).map(r => r.reference_id));
    const stageIds = new Set(stages.map(s => s.stage_id)), mapIds = new Set(maps.map(m => m.stage_mapping_id));
    const all = candidates(e), candidateIds = new Set(all.map(c => c.candidate_id));
    check(stageIds.size === stages.length, 'duplicate stage ID');
    check(mapIds.size === maps.length, 'duplicate stage mapping ID');
    check(candidateIds.size === all.length, 'duplicate candidate ID');
    const walkRefs = value => {
      if (!value || typeof value !== 'object') return;
      for (const [key, v] of Object.entries(value)) {
        if (key === 'source_refs' || key === 'run_refs') for (const id of v || []) check(refs.has(id), `unresolved evidence reference ${id}`);
        else if (v && typeof v === 'object') walkRefs(v);
      }
    };
    walkRefs(d);
    for (const s of stages) {
      const ms = maps.filter(m => m.stage_ref === s.stage_id);
      check(s.mapping_selection === 'selected' ? ms.length === 1 : ms.length === 0, `selection/mapping mismatch ${s.stage_id}`);
      for (const r of s.relations || []) check(stageIds.has(r.from_stage_ref) && r.from_stage_ref !== s.stage_id, `invalid stage relation ${s.stage_id}`);
    }
    for (const m of maps) {
      const s = stages.find(x => x.stage_id === m.stage_ref);
      check(!!s, `unresolved stage ${m.stage_ref}`);
      check(m.selection_reasons?.length > 0, 'mapping needs a selection reason');
      if (m.search?.status === 'none_found') {
        check(m.search.run_refs?.length && m.search.scope?.note && m.search.stop_reason, 'None found requires bounded completed search');
        check(!m.candidates.some(c => ['proposed','shortlisted'].includes(c.decision) && c.role === 'candidate'), 'None found conflicts with active candidate');
      }
      if (m.search?.status === 'candidates_recorded') check(m.candidates.some(c => c.role === 'candidate' && ['proposed','shortlisted'].includes(c.decision)), 'Candidates recorded needs a proposed or shortlisted candidate');
      for (const c of m.candidates || []) {
        check(c.comparison.source_stage_ref === m.stage_ref, 'candidate comparison stage mismatch');
        const sourceId = c.comparison.source_pronunciation_ref;
        check(sourceId === null || s?.pronunciations.some(p => p.pronunciation_id === sourceId), 'source pronunciation does not belong to stage');
        check(c.comparison.target_pronunciation_ref === null || c.target.pronunciations.some(p => p.pronunciation_id === c.comparison.target_pronunciation_ref), 'target pronunciation does not belong to candidate');
        check(sourceId !== null || c.phonetic_fit.fit === 'not_evaluated', 'missing historical source sound cannot receive a sound-fit grade');
        check(c.historical_relation.status === 'Not claimed', 'pilot does not establish Chinese historical relations');
        check(!('total' in c.semantic_fit) && !('total' in c.phonetic_fit), 'no combined ranking score');
        check(c.evidence.some(v => v.claim_scope === 'chinese_sense'), 'missing Chinese lexical evidence assessment');
      }
    }
    const display = d.display_selection;
    check(display.stage_cards.length <= 3, 'at most three reader-facing stage cards');
    check(display.featured_candidate_ref === null || candidateIds.has(display.featured_candidate_ref), 'unresolved featured candidate');
    if (display.featured_candidate_ref !== null) check(all.find(c => c.candidate_id === display.featured_candidate_ref)?.decision !== 'rejected', 'rejected candidate cannot be featured');
    for (const card of display.stage_cards) {
      const m = maps.find(x => x.stage_mapping_id === card.stage_mapping_ref);
      check(!!m, 'unresolved display mapping');
      check(card.candidate_ref === null || m?.candidates.some(c => c.candidate_id === card.candidate_ref && c.decision !== 'rejected' && c.role === 'candidate'), 'invalid display candidate');
    }
    if (display.featured_candidate_ref === null) check(!e.featured_mapping, 'Pending Featured must not retain an active legacy Featured');
    return errors;
  }
  return { isPilot, featured, headline, renderCards, validate, statusLabel };
});
