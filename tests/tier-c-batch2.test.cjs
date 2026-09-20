const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js'),{legacyEntry}=require('./legacy-research-view.cjs');
const candidates=e=>e.diachronic_semantic_mapping.mappings.flatMap(m=>m.candidates);
const base='e6109656fc350375a9719941f720294afb1db2b2',slugs=['abridge','aliment','acumen','abound'];
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:40e6}).replace(/\r\n/g,'\n');
const data=require('../data/language-book.v1.0.json'),before=JSON.parse(get('data/language-book.v1.0.json'));
const entries=slugs.map(s=>data.entries.find(e=>e.slug===s));
test('Tier C Batch 2 only: other 38 records/pages, schema and UI remain unchanged',()=>{
 assert.deepEqual(data.entries.filter(e=>!slugs.includes(e.slug)),before.entries.filter(e=>!slugs.includes(e.slug)));
 for(const dir of ['data/entries','words'])for(const f of fs.readdirSync(dir)){
  if(slugs.some(s=>f===s+'.html'||f===s+'.v1.json'))continue;
  const p=dir+'/'+f;if(fs.statSync(p).isFile())assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 }
 for(const p of ['data/language-book-entry.schema.v1.json','js/diachronic-mapping.js','js/language-book-data.js','js/semantic-mapper.js','js/search.js','semantic-mapper.html','dictionary.html','search.html'])assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 entries.forEach(e=>{assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.id===e.id));assert.deepEqual(model.validate(e),[]);assert.deepEqual(e,require('../data/entries/'+e.slug+'.v1.json'));});
});
test('Three Published pages retain Featured Pending independently of entry/evidence status',()=>{
 for(const e of entries.filter(e=>e.slug!=='acumen')){
  assert.equal(model.featured(e),null);assert.equal(e.featured_mapping_status,'Pending');assert.equal(e.publication_status,'Published');assert.match(model.headline(e),/Featured Mapping: Pending/);
  const old=before.entries.find(x=>x.id===e.id);assert.equal(e.entry_status,old.entry_status);assert.equal(e.mapping_level,old.mapping_level);assert.deepEqual(e.evidence,old.evidence);
 }
});
test('ABRIDGE does not reuse 瘪 as Featured or bridge ancestry; exact 约/省 readings',()=>{
 const e=entries[0],d=e.diachronic_semantic_mapping,cs=candidates(e);
 assert.ok(d.historical_stages.some(s=>s.form==='brevis'));assert.ok(!d.historical_stages.some(s=>s.form==='bridge'));
 assert.equal(cs.find(c=>c.target.form==='省').target.pronunciations[0].value,'shěng');
 assert.equal(cs.find(c=>c.target.form==='约').target.pronunciations[0].value,'yuē');
 assert.equal(cs.find(c=>c.target.form==='瘪').decision,'reserved');assert.match(cs.find(c=>c.target.form==='瘪').decision_reason,/Rejected for Featured/);
 assert.ok(!d.display_selection.stage_cards.some(x=>x.candidate_ref==='TC2-ABRIDGE-03'));
});
test('ALIMENT noun and verb branch from alimentum; 养 is verb, 粮 is restricted',()=>{
 const e=entries[1],d=e.diachronic_semantic_mapping;
 assert.equal(d.historical_stages.find(s=>s.stage_id==='ALV').relations[0].from_stage_ref,'AL2');
 assert.equal(d.historical_stages.find(s=>s.stage_id==='AL3').relations[0].from_stage_ref,'AL2');
 assert.equal(candidates(e).find(c=>c.target.form==='养').comparison.source_stage_ref,'ALV');
 assert.match(candidates(e).find(c=>c.target.form==='粮').confounds.join(' '),/奶、蛋/);
});
test('ACUMEN 锐 Featured is structural; modern sound Low and historical sound unevaluated',()=>{
 const e=entries[2],f=model.featured(e),cs=candidates(e);
 assert.equal(f.target.form,'锐');assert.equal(f.target.pronunciations[0].value,'ruì');assert.equal(f.comparison.source_stage_ref,'AC2');
 assert.equal(e.featured_mapping.display_label,'Structural-Semantic Candidate');assert.equal(e.structural_semantic_mapping.phonetic_fit,'Low');
 assert.equal(f.phonetic_fit.fit,'not_evaluated');assert.equal(cs.find(c=>c.candidate_id==='TC2-ACUMEN-RUI-AC3').phonetic_fit.fit,'weak');
 assert.equal(cs.find(c=>c.target.form==='快').decision,'reserved');assert.match(e.structural_semantic_mapping.claim,/Pending/);
 assert.ok(!e.diachronic_semantic_mapping.historical_stages.some(s=>s.form==='cum'));
});
test('ABOUND has separate overflow and abundance cards; 满 and 蹦 are not Featured',()=>{
 const e=entries[3],d=e.diachronic_semantic_mapping;
 assert.deepEqual(d.display_selection.stage_cards.map(x=>candidates(e).find(c=>c.candidate_id===x.candidate_ref).target.form),['溢','丰']);
 assert.equal(candidates(e).find(c=>c.target.form==='溢').comparison.source_stage_ref,'AO2');
 assert.equal(candidates(e).find(c=>c.target.form==='丰').comparison.source_stage_ref,'AO4');
 assert.equal(candidates(e).find(c=>c.target.form==='蹦').decision,'rejected');
});
test('All 28 Discovery records remain exact; no promotion of group hits or historical claims',()=>{
 const run=require('../data/review/tier-c-batch2-discovery.json');assert.equal(run.candidates.length,28);
 for(const e of entries){assert.deepEqual(e.research_candidate_discovery.candidates,run.candidates.filter(c=>c.entry===e.slug.toUpperCase()));
  for(const c of candidates(e)){assert.equal(c.historical_relation.status,'Not claimed');assert.ok(c.evidence.some(v=>v.status==='pending'));if(!c.comparison.source_pronunciation_ref)assert.equal(c.phonetic_fit.fit,'not_evaluated');}
 }
});
test('Deterministic pages/data; reader budget; all 22 migrations and lookup remain valid',()=>{
 const snapshots=entries.map(e=>fs.readFileSync(e.page,'utf8'));cp.execFileSync(process.execPath,['scripts/build-tier-c-batch2.mjs']);
 entries.forEach((e,i)=>{const h=fs.readFileSync(e.page,'utf8');assert.equal(h,snapshots[i]);assert.equal((h.match(/<h1[ >]/g)||[]).length,1);assert.ok(e.diachronic_semantic_mapping.display_selection.stage_cards.length<=3);assert.ok(h.includes(e.source.raw_note));assert.equal(api.lookup(data,e.slug).entry.slug,e.slug);});
 const snapshot=fs.readFileSync('data/language-book.v1.0.json','utf8');cp.execFileSync(process.execPath,['scripts/build-language-book-v1.mjs']);assert.equal(fs.readFileSync('data/language-book.v1.0.json','utf8'),snapshot);
 assert.equal(data.entries.length,42);assert.equal(data.entries.filter(model.isPilot).length,22);data.entries.filter(model.isPilot).forEach(e=>assert.deepEqual(model.validate(e),[]));
});
