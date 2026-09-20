const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js'),{legacyEntry}=require('./legacy-research-view.cjs');
const base='8d462232767d89290516dcb5086704a729a36be6',slugs=['abbreviate','abbreviation','abdomen','abdominal'];
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:30e6}).replace(/\r\n/g,'\n');
const es=slugs.map(s=>require('../data/entries/'+s+'.v1.json')),data=require('../data/language-book.v1.0.json');
test('Batch 1 scope: all other entries/pages, schema and Mapper UI remain byte-identical',()=>{
 const before=JSON.parse(get('data/language-book.v1.0.json'));
 const b2=['universe','human','abbey','abash','horizon','horse','media','aback','sound','abridge','aliment','acumen','abound'];
 assert.deepEqual(data.entries.filter(e=>!slugs.includes(e.slug)).map(e=>b2.includes(e.slug)?legacyEntry(e):e),before.entries.filter(e=>!slugs.includes(e.slug)));
 for(const dir of ['data/entries','words'])for(const file of fs.readdirSync(dir)){
  if([...slugs,'universe','man','abbey','abash','horizon','horse','media','aback','sound','abridge','aliment','acumen','abound'].some(s=>file===s+'.html'||file===s+'.v1.json'))continue;
  const p=dir+'/'+file;if(fs.statSync(p).isFile())assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 }
 for(const p of ['data/language-book-entry.schema.v1.json','js/diachronic-mapping.js','semantic-mapper.html','dictionary.html','search.html'])assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 for(const e of es){assert.deepEqual(model.validate(e),[]);assert.deepEqual(data.entries.find(x=>x.id===e.id),e);assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.id===e.id));}
});
test('Family stages, semantic-only modern meanings and independent Featured selections',()=>{
 const expected=[[3,2,2],[3,2,2],[2,1,1],[2,1,2]];
 es.forEach((e,i)=>{const d=e.diachronic_semantic_mapping;assert.deepEqual([d.historical_stages.length,d.mappings.length,d.mappings.flatMap(m=>m.candidates).length],expected[i]);assert.equal(d.display_selection.stage_cards.length,1);assert.equal(d.display_selection.review_status,'approved');
  for(const c of d.mappings.flatMap(m=>m.candidates)){assert.equal(c.historical_relation.status,'Not claimed');assert.ok(!('total' in c.semantic_fit));assert.ok(!('total' in c.phonetic_fit));if(c.comparison.scope==='semantic_only')assert.equal(c.phonetic_fit.fit,'not_evaluated');}
 });
 assert.deepEqual(es.map(e=>model.featured(e).target.form),['瘪','瘪','肚','肚']);
 assert.equal(model.featured(es[0]).family_key,model.featured(es[1]).family_key);
 assert.notEqual(model.featured(es[0]).candidate_id,model.featured(es[1]).candidate_id);
 assert.equal(model.featured(es[0]).comparison.source_span,'brev-/brevi-');
 assert.equal(model.featured(es[1]).comparison.source_span,'brev-/brevi-');
 assert.match(es[1].diachronic_semantic_mapping.historical_stages.at(-1).pronunciations[0].value,/ˈeɪ/);
 assert.match(es[1].phonetic_observation[0].claim.en,/abbreviation \/əˌbriː.viˈeɪ.ʃən\//);
 assert.doesNotMatch(es[1].phonetic_observation[0].claim.en,/əˈbriː.vi.eɪt/);
 assert.match(es[0].diachronic_semantic_mapping.historical_stages.at(-1).pronunciations[0].value,/ˈbriː/);
 assert.match(es[0].standard_translation.target,/使简略/);assert.match(es[1].standard_translation.target,/形式/);
 assert.equal(model.featured(es[3]).comparison.scope,'morpheme');assert.equal(model.featured(es[3]).comparison.source_stage_ref,'MODERN');
 assert.equal(es[3].standard_translation.target,'腹部的');
});
test('False ancestry excluded, frozen polyphonic readings and Pending evidence retained',()=>{
 for(const e of es.slice(2)){
  const d=e.diachronic_semantic_mapping;assert.equal(d.historical_stages[0].form,'abdōmen');assert.equal(d.historical_stages[0].mapping_selection,'not_selected');
  assert.ok(!d.historical_stages.some(s=>['dom','dome','ab.dom.en','ab.dom.inal'].includes(s.form)));
  assert.equal(model.featured(e).target.pronunciations[0].value,'dù [tu˥˩]');assert.ok(e.source.raw_note.includes('dome'));
  assert.ok(e.source_audit_pending.every(x=>x.status==='pending'));
 }
 for(const e of es.slice(0,2)){assert.equal(model.featured(e).target.pronunciations[0].value,'biě [piɛ˨˩˦]');assert.equal(e.mapping_level,'D');assert.equal(model.featured(e).phonetic_fit.fit,'weak');}
 for(const e of es)assert.ok(model.featured(e).evidence.some(v=>v.status==='pending'));
});
test('Lookup, family links, deterministic page build, archived paragraphs and anchor compatibility',()=>{
 for(const [q,i] of [['abbreviate',0],['abréger',0],['abbreviation',1],['缩写形式',1],['abdomen',2],['肚子',2],['abdominal',3],['腹部的',3]])assert.equal(api.lookup(data,q).entry.id,es[i].id,q);
 const pages=es.map(e=>fs.readFileSync(e.page,'utf8'));cp.execFileSync(process.execPath,['scripts/build-family-migration-batch1.mjs']);
 es.forEach((e,i)=>{const h=fs.readFileSync(e.page,'utf8');assert.equal(h,pages[i]);assert.equal((h.match(/<h1>/g)||[]).length,1);assert.equal((h.match(/diachronic-stage-card"/g)||[]).length,1);
  for(const block of get(e.page).match(/<(?:p|blockquote)\b[^>]*>[\s\S]*?<\/(?:p|blockquote)>/g)||[])assert.ok(h.includes(block),e.slug+' original paragraph lost');
  for(const m of get(e.page).matchAll(/id="([^"]+)"/g))assert.ok(h.includes(m[0]),e.slug+' anchor '+m[1]);
  assert.ok(h.includes('revealLegacyEvidence'));assert.match(h,/Research \/ Evidence/);
 });
});
