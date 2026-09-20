import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import model from '../js/diachronic-mapping.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Deliberately bounded. Expanding the migration is a separate editorial decision.
for(const slug of ['abandon','abhor','abdicate','aberrant']) {
 const e=JSON.parse(fs.readFileSync(path.join(root,`data/entries/${slug}.v1.json`),'utf8'));
 const errors=model.validate(e);if(errors.length)throw new Error(errors.join('\n'));
 const d=e.diachronic_semantic_mapping,f=e.featured_mapping;
 const reader=`<section class="word-hero hero"><p>Language Book · Author: Jinkai Liu</p><h1>${esc(slug.toUpperCase())}</h1><p class="standard-translation"><strong>Standard Translation: ${esc(e.standard_translation?.target||e.primary_mapping.target.word)}</strong></p><p><strong>Featured Mapping: ${esc(f.target)} ${esc(f.reading)}</strong></p>${model.renderFeatured(e)}<p>Featured 是编辑选择，不是证据等级。Historical Relation: Not claimed。</p></section><section class="word-section section" id="stage-mappings"><h2>Diachronic Stage Mappings｜重要阶段</h2>${model.renderCards(e,'#research')}</section>`;
 const research=`<p>${esc(d.historical_path)}</p><p>${esc(d.semantic_path)}</p><p>${esc(d.boundary['zh-Hans'])}</p>`+d.historical_stages.map(s=>`<article><h3>${esc(s.form)} · ${esc(s.meaning.gloss)}</h3><p>${esc(s.language.name)} · ${esc(s.period.label)}</p><p>Chinese Mapping: ${esc(s.mapping_selection==='not_selected'?'Not selected':model.statusLabel(d.mappings.find(m=>m.stage_ref===s.stage_id).search.status))}</p><p>${esc(s.selection_note)}</p>${s.relations.map(r=>`<p>${esc(r.relation_type)} from ${esc(r.from_stage_ref)}: ${esc(r.semantic_operation.description)}</p>`).join('')}<p>Source refs: ${esc(s.source_refs.join(', '))}</p></article>`).join('')+d.mappings.map(m=>m.candidates.map(c=>`<article><h3>${esc(c.target.form)} · ${esc(c.role)} / ${esc(c.decision)}</h3><p>Source unit: ${esc(c.comparison.source_span)} · ${esc(c.comparison.scope)}</p><p>Chinese layer: ${esc(c.target.lexical_layer)} · ${esc(c.target.language_variety)} · ${esc(c.target.period.label)}</p><p>${esc(c.target.pronunciations.map(p=>p.value+' ['+p.phonological_layer+']').join('; '))}</p><p>Semantic Fit: ${esc(c.semantic_fit.fit)} (${esc(c.semantic_fit.confidence)}) — ${esc(c.semantic_fit.rationale)}</p><p>Phonetic Fit: ${esc(c.phonetic_fit.fit)} (${esc(c.phonetic_fit.confidence)}) — ${esc(c.phonetic_fit.rationale)}</p><ul>${Object.entries(c.phonetic_fit.features).map(([k,v])=>`<li>${esc(k)}: ${esc(v)}</li>`).join('')}</ul><p>Historical Relation: Not claimed</p><ul>${c.evidence.map(v=>`<li>${esc(v.claim_scope)}: ${esc(v.status)} — ${esc(v.note)} [${esc(v.source_refs.join(', '))}]</li>`).join('')}</ul></article>`).join('')).join('')+`<p>Migration baseline: ${esc(e.legacy_migration.baseline_commit)}. 原有评级、评分、反例及逐项来源见本页各折叠研究章节；未进行新的语言学核验。</p><a href="../data/entries/${slug}.v1.json">完整结构化研究记录</a>`;
 const file=path.join(root,`words/${slug}.html`);let html=fs.readFileSync(file,'utf8');
 for(const [name,content] of [['READER',reader],['RESEARCH',research]]) {
  const pattern=new RegExp(`<!-- LEGACY-${name}:START -->[\\s\\S]*?<!-- LEGACY-${name}:END -->`);
  if(!pattern.test(html))throw new Error(`Missing ${name} marker: ${slug}`);
  html=html.replace(pattern,()=>`<!-- LEGACY-${name}:START -->${content}<!-- LEGACY-${name}:END -->`);
 }
 fs.writeFileSync(file,html);
 console.log(`${slug}: ${d.historical_stages.length} source stages / ${d.mappings.length} mappings / ${d.display_selection.stage_cards.length} cards`);
}
