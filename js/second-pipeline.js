(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const isPilot=e=>e?.legacy_migration?.version==='second-pipeline-0.1';
 function render(e,prefix='') {
  const f=e.featured_mapping;
  const featured=e.featured_mapping_status==='Not applicable'?'Proper-name identity; Featured lexical mapping: Not applicable':f?`Featured Candidate: ${esc(f.target)} ${esc(f.reading)} · ${esc(f.display_label)}`:'Featured Mapping: Pending';
  const layers=(e.semantic_associations||[]).map(a=>`<section class="classification-object csl-layer"><h3>${esc(a.association_id.split('-').at(-1))}</h3><p>${esc(a.relation)}</p><p class="small">${esc(a.status)} · Historical Relation: Not claimed</p></section>`).join('');
  const notes=e.editorial_notes.slice(-3).map(n=>`<p>${esc(n.en)}</p>`).join('');
  const refs=e.references.map(r=>`<li>${/^https:\/\//.test(r.url||'')?`<a href="${esc(r.url)}" rel="noreferrer">${esc(r.title)}</a>`:esc(r.title)} · ${esc(r.reference_id)}</li>`).join('');
  const research=Object.fromEntries(['historical_etymology','evidence','hypotheses','experiments','name_analysis','cultural_associations','related_words','source','legacy_migration'].filter(k=>e[k]).map(k=>[k,e[k]]));
  return `<div class="second-pipeline"><h2>${esc(e.slug.toUpperCase())}</h2><p class="standard-translation"><strong>Standard Meaning / Identity</strong><br>${esc(e.standard_translation.target)}</p><p class="csl-featured"><strong>${featured}</strong></p><p>Evidence Status: ${esc(e.mapping_status)} · ${esc(e.mapping_level)} (entry mapping only). Featured selection is editorial, not an evidence grade. Pending is a valid research result.</p>${layers}<section class="csl-boundary"><h3>Evidence boundaries / 证据边界</h3>${notes}</section><details class="csl-research"><summary>Research / Evidence / Counterinterpretation</summary><ol>${refs}</ol><pre style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(JSON.stringify(research,null,2))}</pre></details>${prefix===''?`<p><a href="${esc(e.page)}">Full entry and literary layers →</a></p>`:''}</div>`;
 }
 function card(e){const f=e.featured_mapping;return `<article class="card word-card"><p>${esc(e.id)}</p><h2>${esc(e.slug.toUpperCase())} · ${f?`Featured Candidate: ${esc(f.target)} ${esc(f.reading)}`:e.featured_mapping_status==='Pending'?'Featured Mapping: Pending':'Proper-name identity'}</h2><p>Standard Meaning / Identity: ${esc(e.standard_translation.target)}</p><p>${esc(e.mapping_status)} · ${esc(e.mapping_level)} · Historical Relation: Not claimed</p><p>${esc(e.editorial_notes.at(-2).en)}</p><a href="${esc(e.page)}">Read entry →</a><br><a href="semantic-mapper.html?q=${esc(e.slug)}">Open in Mapper →</a></article>`;}
 const api={isPilot,render,card};if(typeof module==='object'&&module.exports)module.exports=api;root.UnilanguageSecondPipeline=api;
})(typeof globalThis==='object'?globalThis:this);
