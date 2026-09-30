(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.UnilanguageAbhorReader = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isEntry = e => e?.slug === 'abhor';
  function records(e) {
    if (!isEntry(e)) throw new Error('ABHOR presentation pilot only');
    // Read original frozen assessments; presentation never writes to the record.
    return {modern:e.modern_standard_semantic_mapping,
      historical:e.legacy_migration.previous_diachronic_semantic_mapping.mappings.find(m => m.mapping_id === 'MAP-horrere-hai'),
      dialect:e.dialectal_affective_semantic_candidate};
  }
  const reading = m => `${esc(m.target.word)} ${esc(m.target.pronunciation.split(' ')[0])}`;
  const grade = m => `<span class="status-chip">${esc(m.status)}</span> · Level ${esc(m.mapping_level)} · Evidence ${esc(m.confidence)}`;
  const score = m => { const p = m.mapping_assessment.dimensions.find(d => d.name === 'Phonetic Relation'); return `${p.score}/${p.weight}`; };
  function render(e, mode = 'word') {
    const {modern:m, historical:h, dialect:d} = records(e), a = d.author_attested_usage;
    const heading = mode === 'word' ? 'h1' : 'h2', subheading = mode === 'word' ? 'h2' : 'h3', prefix = mode === 'word' ? '' : 'mapper-';
    return `<section class="word-hero hero abhor-layer-view">
<style>@media(max-width:680px){body:has(.abhor-layer-view) .mapper-hero{grid-template-columns:minmax(0,1fr)}body:has(.abhor-layer-view) .mapper-hero>*{min-width:0}body:has(.abhor-layer-view) .mapper-form{overflow-wrap:anywhere}}.abhor-layer-view{overflow-wrap:anywhere;min-width:0}.abhor-layer-view.hero{padding:1.5rem}.abhor-layer-view h1{margin:.25rem 0;font-size:clamp(2rem,6vw,3.5rem)}.abhor-layer-view .reader-layer{border-top:1px solid var(--border,#31445d);padding:1rem 0}.abhor-layer-view .reader-layer h2,.abhor-layer-view .reader-layer h3{font-size:1.1rem;margin:0 0 .5rem}.abhor-layer-view p{margin:.45rem 0}.abhor-layer-view .status-chip{display:inline-block;border:1px solid currentColor;border-radius:.3rem;padding:.1rem .4rem;font-size:.85em}.abhor-layer-view .layer-guide{font-size:.9rem}.abhor-layer-view a{overflow-wrap:anywhere}</style>
<p>Language Book · One Entry, Multiple Layers</p><${heading}>ABHOR</${heading}>
<p class="standard-translation"><strong>Standard Translation: ${esc(e.standard_translation.target)}</strong></p>
<p class="layer-guide">现代标准 <strong>${reading(m)}</strong> · 历史比较 <strong>${reading(h)}</strong> · 作者方言观察 <strong>${esc(d.target)} ${esc(d.reading)}</strong></p>
<section class="reader-layer" id="${prefix}standard-mapping" data-reader-layer="standard"><${subheading}>1 · Modern Standard Mapping｜现代标准语义</${subheading}>
<p><strong>ABHOR → ${reading(m)}</strong></p><p>${grade(m)} · Phonetic score ${score(m)}</p>
<p>取“憎恶／厌恶”的动词义；恶 wù 较书面，不混 è／ě／wū，也不保证可在每句话中逐字替换。</p></section>
<section class="reader-layer" id="${prefix}stage-mappings" data-reader-layer="historical"><${subheading}>2 · Diachronic Stage Mapping｜历史阶段比较</${subheading}>
<p><strong>Latin HORRĒRE → ${reading(h)}</strong></p><p>${grade(h)} · Phonetic score ${score(h)}</p>
<p>骇以惊惧／受惊义比较 HORRĒRE 的身体反应阶段，不是现代 abhor 的普通翻译，也不覆盖竖毛／战栗的所有义项。</p></section>
<section class="reader-layer" id="${prefix}author-observation" data-reader-layer="author"><${subheading}>3 · Dialect / Author Observation｜作者方言观察</${subheading}>
<p><strong>ABHOR → ${esc(d.target)} ${esc(d.reading)}</strong> · <span class="status-chip">${esc(a.status)}</span></p>
<p>Author: ${esc(a.author)} · “${esc(a.forms.join(' / '))}”<br>Author-reported sense: ${esc(a.reported_meaning)}</p>
<p>Region: ${esc(a.region)}<br>Independent dialect evidence: ${esc(d.independent_dialect_evidence.status)}</p>
<p>火不是 primary standard mapping，不是已独立验证的方言事实，也不是词源证据。既有 Featured 候选身份保留：${esc(d.status)} / Level ${esc(e.mapping_level)} / ${esc(d.confidence)}；不因展示位置改变评级。</p></section>
<section class="reader-layer" id="${prefix}evidence-boundary" data-reader-layer="boundary"><${subheading}>4 · Evidence &amp; Limits｜证据边界</${subheading}>
<p><strong>Standard Mapping ≠ Diachronic Mapping ≠ Author Observation</strong></p>
<p>Supported 只支持恶的限定现代语义；骇仍为 Candidate；火为 Author-attested，独立方言证据与地域仍 Pending。纸本辞书核验缺口保留；语音分数是暂定编辑评分，不是历史概率。</p>
<p>源语词史与跨语言比较分开。三条跨语言 <strong>Historical Relation: ${esc(e.historical_relation_status)}</strong>，不主张共同词源。词条 ${esc(e.entry_status)} 不等于候选已被证明。</p>
<p><a href="${mode === 'word' ? '#research' : esc(e.page)+'#research'}">Research / Evidence · 完整证据、反例与原始评分 →</a></p></section>
</section>`;
  }
  function card(e) {
    const {modern:m,historical:h,dialect:d} = records(e);
    return `<article class="card word-card" data-word="${esc(e.search_terms.join(' '))}" data-reader-summary="abhor"><p class="label">${esc(e.id)}</p><h2>ABHOR · ${esc(e.standard_translation.target)}</h2><p><strong>Modern Standard Mapping: ${reading(m)}</strong> · ${esc(m.status)} / ${esc(m.mapping_level)}</p><p>历史阶段：HORRĒRE → ${reading(h)} · ${esc(h.status)} / ${esc(h.mapping_level)}<br>作者方言观察：${esc(d.target)} ${esc(d.reading)} · Author-attested · Independent evidence ${esc(d.independent_dialect_evidence.status)}</p><p>Entry ${esc(e.entry_status)} · Historical Relation: ${esc(e.historical_relation_status)}</p><a href="${esc(e.page)}">Read entry · 阅读词条 →</a><br><a href="semantic-mapper.html?q=abhor">Open in Mapper · 在映射器中打开 →</a></article>`;
  }
  return {isEntry,render,card};
});
