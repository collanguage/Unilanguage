import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pilot from '../js/diachronic-mapping.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = JSON.parse(fs.readFileSync(path.join(root, 'data/entries/abeyance.v1.json'), 'utf8'));
const errors = pilot.validate(entry);
if (errors.length) throw new Error(errors.join('\n'));
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = a => `<ul>${a.map(v => `<li>${esc(v)}</li>`).join('')}</ul>`;
const d = entry.diachronic_semantic_mapping;
const research = d.historical_stages.map(s => `<article><h3>${esc(s.stage_id)} · ${esc(s.form)}</h3><p>${esc(s.language.name)} · ${esc(s.period.label)} · ${esc(s.attestation_status)}</p><p>${esc(s.meaning.gloss)}</p><p>Chinese Mapping: ${esc(s.mapping_selection === 'not_selected' ? 'Not selected' : pilot.statusLabel(d.mappings.find(m => m.stage_ref === s.stage_id).search.status))}</p><p>${esc(s.selection_note)}</p><p>Evidence: ${esc(s.source_refs.join(', '))}</p></article>`).join('') + d.mappings.map(m => `<section><h3>${esc(m.stage_ref)} · ${esc(pilot.statusLabel(m.search.status))}</h3><p>${esc(m.freeze.meaning_note)}</p><p>${esc(m.search.stop_reason)}</p>${m.candidates.map(c => `<article><h4>${esc(c.target.form)} · ${esc(c.target.pronunciations.map(p => p.value).join(' / '))}</h4><p>${esc(c.role)} / ${esc(c.decision)} · ${esc(c.target.lexical_layer)} · ${esc(c.target.language_variety)} · ${esc(c.target.period.label)}</p><p>Documented meaning: ${esc(c.target.meaning.gloss)}</p><p>Semantic Fit: ${esc(c.semantic_fit.fit)} (${esc(c.semantic_fit.confidence)}) — ${esc(c.semantic_fit.rationale)}</p><p>Phonetic Fit: ${esc(c.phonetic_fit.fit)} (${esc(c.phonetic_fit.confidence)}) — ${esc(c.phonetic_fit.rationale)}</p>${list(Object.entries(c.phonetic_fit.features).map(([k,v]) => k + ': ' + v))}<p>Historical Relation: ${esc(c.historical_relation.status)}</p>${list(c.evidence.map(v => `${v.claim_scope}: ${v.status} — ${v.note} [${v.source_refs.join(', ')}]`))}${list(c.confounds)}</article>`).join('')}</section>`).join('') + `<h3>Scoped references｜逐项来源</h3><ul>${entry.references.map(r => `<li>${esc(r.reference_id)}: ${r.url ? `<a href="${esc(r.url)}">${esc(r.title)}</a>` : esc(r.title)} — ${esc(r.locator || '')} ${esc(r.provenance)}</li>`).join('')}</ul>`;
const page = path.join(root,'words/abeyance.html');
let html = fs.readFileSync(page,'utf8');
for (const [name,content] of [['CARDS',pilot.renderCards(entry,'#research')],['RESEARCH',research]]) {
  const regex = new RegExp(`<!-- PILOT-${name}:START -->[\\s\\S]*?<!-- PILOT-${name}:END -->`);
  if (!regex.test(html)) throw new Error(`Missing ${name} marker`);
  html = html.replace(regex, () => `<!-- PILOT-${name}:START -->${content}<!-- PILOT-${name}:END -->`);
}
fs.writeFileSync(page,html);
console.log('ABEYANCE pilot: three display references resolved; research generated from canonical entry');
