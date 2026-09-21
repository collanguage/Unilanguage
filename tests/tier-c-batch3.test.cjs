const {beforeSecondPipeline,stripSecondPipeline,isSecondPipelineFile}=require('./second-pipeline-compat.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js'),{legacyEntry}=require('./legacy-research-view.cjs');
const base='16e144fd83c1fe048b3abd84196a0529fe04df3b',slugs=['sky','language','advance','generate','absolute'];
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:40e6}).replace(/\r\n/g,'\n');
const current=beforeSecondPipeline(require('../data/language-book.v1.0.json')),data={...current,entries:current.entries.map(e=>e.legacy_migration?.version==='tier-c-final-a-0.1'?legacyEntry(e):e)},before=JSON.parse(get('data/language-book.v1.0.json'));
const es=slugs.map(s=>data.entries.find(e=>e.slug===s)),cs=e=>e.diachronic_semantic_mapping.mappings.flatMap(m=>m.candidates);
test('Batch 3 scope: all other 37 entries/pages, schema and UI unchanged; exact archive restoration',()=>{
 assert.deepEqual(data.entries.filter(e=>!slugs.includes(e.slug)),before.entries.filter(e=>!slugs.includes(e.slug)));
 for(const dir of ['data/entries','words'])for(const f of fs.readdirSync(dir)){
  if(isSecondPipelineFile(f))continue;
  if([...slugs,'a-indefinite-article'].some(s=>f===s+'.html'||f===s+'.v1.json'))continue;
  const p=dir+'/'+f;if(fs.statSync(p).isFile())assert.equal(stripSecondPipeline(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),get(p),p);
 }
 for(const p of ['data/language-book-entry.schema.v1.json','js/diachronic-mapping.js','js/language-book-data.js','js/semantic-mapper.js','js/search.js','semantic-mapper.html','dictionary.html','search.html'])assert.equal(stripSecondPipeline(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),get(p),p);
 es.forEach(e=>{assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.id===e.id));assert.deepEqual(model.validate(e),[]);assert.deepEqual(e,require('../data/entries/'+e.slug+'.v1.json'));});
});
test('SKY modern sound Candidate is independent from reconstructed COVER research',()=>{
 const e=es[0],f=model.featured(e);assert.equal(f.target.form,'盖');assert.equal(f.comparison.source_stage_ref,'S3');assert.equal(f.semantic_fit.fit,'indirect');assert.equal(f.phonetic_fit.fit,'partial');
 assert.ok(!e.diachronic_semantic_mapping.historical_stages.some(s=>s.stage_id==='SC'||s.stage_id==='S0'));
 assert.equal(e.research_candidate_discovery.independent_comparisons[0].phonetic_fit,'not_evaluated');assert.match(f.semantic_fit.rationale,/not used/);
 assert.deepEqual(e.literary_layer,before.entries.find(x=>x.slug==='sky').literary_layer);
});
test('LANGUAGE 舌 is structural lingua polysemy, with independent Low modern sound',()=>{
 const e=es[1],f=model.featured(e);assert.equal(f.target.form,'舌');assert.equal(f.target.pronunciations[0].value,'shé');assert.equal(f.comparison.source_stage_ref,'L1');assert.equal(e.structural_semantic_mapping.phonetic_fit,'Low');assert.equal(f.phonetic_fit.fit,'not_evaluated');assert.match(e.featured_mapping.status,/Phonetic Fit = Low/);assert.equal(e.standard_translation.target,'语言');
 assert.ok(!e.diachronic_semantic_mapping.historical_stages.some(s=>s.language.name.includes('Chinese')));
});
test('ADVANCE 往 is Research only, 进 and 前 are reader semantic mappings',()=>{
 const e=es[2],w=cs(e).find(c=>c.target.form==='往');assert.equal(model.featured(e),null);assert.equal(w.decision,'reserved');assert.equal(w.phonetic_fit.fit,'weak');assert.match(w.comparison.source_span,/not a historical root/);
 assert.deepEqual(e.diachronic_semantic_mapping.display_selection.stage_cards.map(c=>cs(e).find(x=>x.candidate_id===c.candidate_ref).target.form),['进','前']);assert.match(e.research_provenance.reason,/降为Research/);
});
test('GENERATE Raw sound strings are archived, 生/产 stages stay distinct',()=>{
 const e=es[3];assert.equal(model.featured(e),null);assert.match(e.research_provenance.reason,/gan\/gun\/gin\/gen/);assert.deepEqual(e.diachronic_semantic_mapping.historical_stages.map(s=>s.stage_id),['G1','G2','G3']);
 assert.equal(cs(e).find(c=>c.target.form==='生').comparison.source_stage_ref,'G2');assert.equal(cs(e).find(c=>c.target.form==='产').comparison.source_stage_ref,'G3');
});
test('ABSOLUTE sense branches never assert strict RELEASE to COMPLETE chronology',()=>{
 const e=es[4];assert.equal(model.featured(e),null);assert.match(e.diachronic_semantic_mapping.semantic_path,/not a strict dated sequence/);
 for(const s of e.diachronic_semantic_mapping.historical_stages){assert.match(s.selection_note,/No strict semantic chronology/);for(const r of s.relations)assert.match(r.semantic_operation.description,/not dated successive steps/);}
 assert.deepEqual(e.diachronic_semantic_mapping.display_selection.stage_cards.map(c=>cs(e).find(x=>x.candidate_id===c.candidate_ref).target.form),['解','脱','全']);
});
test('All 39 original records retained; Pending statuses and evidence remain independent',()=>{
 const run=require('../data/review/tier-c-batch3-discovery.json');assert.equal(run.candidates.length,39);
 for(const e of es){assert.deepEqual(e.research_candidate_discovery.candidates,run.candidates.filter(r=>r.entry===e.slug.toUpperCase()));assert.equal(e.historical_relation_status,'Not claimed');
  const old=before.entries.find(x=>x.id===e.id);assert.equal(e.entry_status,old.entry_status);assert.equal(e.mapping_level,old.mapping_level);assert.deepEqual(e.evidence,old.evidence);
  for(const c of cs(e)){assert.equal(c.historical_relation.status,'Not claimed');assert.ok(c.evidence.some(v=>v.status==='pending'));if(!c.comparison.source_pronunciation_ref)assert.equal(c.phonetic_fit.fit,'not_evaluated');}
 }
 for(const e of es.slice(2)){assert.equal(e.featured_mapping_status,'Pending');assert.equal(e.publication_status,'Published');assert.match(model.headline(e),/Featured Mapping: Pending/);assert.equal(api.lookup(data,e.slug).entry.slug,e.slug);}
});
test('Deterministic build, reader budget, literary preservation, all 27 migrations validate',()=>{
 const pages=es.map(e=>fs.readFileSync(e.page,'utf8'));cp.execFileSync(process.execPath,['scripts/build-tier-c-batch3.mjs']);es.forEach((e,i)=>{assert.equal(fs.readFileSync(e.page,'utf8'),pages[i]);assert.equal((pages[i].match(/<h1[ >]/g)||[]).length,1);assert.ok(e.diachronic_semantic_mapping.display_selection.stage_cards.length<=3);assert.deepEqual(e.literary_layer,before.entries.find(x=>x.slug===e.slug).literary_layer);});
 const snap=fs.readFileSync('data/language-book.v1.0.json','utf8');cp.execFileSync(process.execPath,['scripts/build-language-book-v1.mjs']);assert.equal(fs.readFileSync('data/language-book.v1.0.json','utf8'),snap);assert.equal(data.entries.length,42);assert.equal(data.entries.filter(model.isPilot).length,27);data.entries.filter(model.isPilot).forEach(e=>assert.deepEqual(model.validate(e),[]));
});
