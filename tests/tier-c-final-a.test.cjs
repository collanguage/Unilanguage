const {beforeSecondPipeline,stripSecondPipeline,isSecondPipelineFile}=require('./second-pipeline-compat.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js'),{legacyEntry}=require('./legacy-research-view.cjs');
const base='3b9901d47f0cd9d13252e96329b96dded0be972d',slug='a-indefinite-article';
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:40e6}).replace(/\r\n/g,'\n');
const data=beforeSecondPipeline(require('../data/language-book.v1.0.json')),before=JSON.parse(get('data/language-book.v1.0.json')),e=data.entries.find(x=>x.slug===slug),d=e.diachronic_semantic_mapping,cs=d.mappings.flatMap(m=>m.candidates);
test('Final A scope: other 41 entries and all existing pages/schema/shared UI remain unchanged',()=>{
 assert.deepEqual(data.entries.filter(x=>x.slug!==slug),before.entries.filter(x=>x.slug!==slug));assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.slug===slug));
 for(const dir of ['data/entries','words'])for(const f of fs.readdirSync(dir)){
  if(isSecondPipelineFile(f))continue;
  if(f===slug+'.html'||f===slug+'.v1.json')continue;
  const p=dir+'/'+f;if(fs.statSync(p).isFile())assert.equal(stripSecondPipeline(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),get(p),p);
 }
 for(const p of ['data/language-book-entry.schema.v1.json','js/diachronic-mapping.js','js/language-book-data.js','js/semantic-mapper.js','js/search.js','semantic-mapper.html','dictionary.html','search.html'])assert.equal(stripSecondPipeline(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),get(p),p);
});
test('A Published and Featured Pending are independent; no lexical equivalence inferred',()=>{
 assert.equal(e.featured_mapping_status,'Pending');assert.equal(e.publication_status,'Published');assert.equal(e.entry_status,'Reviewed');assert.equal(model.featured(e),null);assert.equal(e.standard_function.source,'a/an');assert.equal(e.structural_semantic_mapping.lexical_equivalence,false);
 assert.match(e.structural_semantic_mapping.source_construction,/singular count noun/);assert.equal(e.structural_semantic_mapping.target_construction,'一 + classifier + noun');assert.equal(e.structural_semantic_mapping.phonetic_fit,'Low');
});
test('ONE is a historical semantic comparison; modern a/an are coexisting forms',()=>{
 assert.equal(d.historical_stages.length,3);assert.equal(d.mappings.length,2);assert.equal(cs.length,8);
 const yi=cs.find(c=>c.candidate_id==='TCA-C01');assert.equal(yi.target.form,'一');assert.equal(yi.target.pronunciations[0].value,'yī');assert.equal(yi.semantic_fit.fit,'direct');assert.equal(yi.comparison.source_stage_ref,'A1');assert.equal(yi.phonetic_fit.fit,'not_evaluated');
 assert.match(d.historical_stages[2].relations[0].semantic_operation.description,/coexist/);assert.ok(!d.historical_stages.some(s=>s.form==='one'));
});
test('甲 current readings corrected; rejected raw provenance and 安 control preserved',()=>{
 const j=cs.find(c=>c.candidate_id==='TCA-C05');assert.equal(j.decision,'rejected');assert.deepEqual(j.target.pronunciations.map(p=>p.value),['jiǎ','gaap3']);
 assert.equal(e.related_words.find(x=>x.word.startsWith('甲')).word,'甲 gaap3');assert.match(e.evidence['Phonetic-Semantic'].summary.en,/Rejected/);
 const an=cs.find(c=>c.candidate_id==='TCA-K02');assert.equal(an.role,'sound_control');assert.equal(an.semantic_fit.fit,'mismatch');assert.equal(an.decision,'rejected');
 assert.ok(!d.display_selection.stage_cards.some(c=>['TCA-C05','TCA-K02'].includes(c.candidate_ref)));assert.ok(JSON.stringify(e.legacy_migration.previous_fields).includes('甲 gaa3'));
});
test('All eight research records retained, group expansion N/A, counterexamples and evidence Pending',()=>{
 const run=require('../data/review/tier-c-final-a-discovery.json');assert.deepEqual(e.research_candidate_discovery.candidates,run.candidates);assert.equal(run.candidates.length,8);
 assert.equal(e.consonant_group_expansion.status,'Not applicable');assert.match(e.structural_semantic_mapping.counterexamples.join(' '),/a teacher/);assert.match(e.structural_semantic_mapping.counterexamples.join(' '),/三个人 \/ 这个人/);
 for(const c of cs){assert.equal(c.historical_relation.status,'Not claimed');assert.equal(c.comparison.hypothesis.hit,false);assert.equal(c.comparison.hypothesis.group,null);assert.ok(c.evidence.some(v=>v.status==='pending'));}
});
test('a/an route to article, AT unchanged, two reader cards and deterministic builds; 28/42 migrated',()=>{
 for(const q of ['a','an',slug])assert.equal(api.lookup(data,q).entry.slug,slug);assert.equal(api.lookup(data,'at').entry.slug,'at');assert.match(model.headline(e),/Featured Mapping: Pending/);
 const p=e.page,snap=fs.readFileSync(p,'utf8');assert.match(snap,/Standard Function: English indefinite article a\/an/);assert.match(snap,/Structural Mapping ≠ lexical equivalence/);assert.equal((snap.match(/class="classification-object diachronic-stage-card"/g)||[]).length,2);assert.equal((snap.match(/<h1[ >]/g)||[]).length,1);
 cp.execFileSync(process.execPath,['scripts/build-tier-c-final-a.mjs']);assert.equal(fs.readFileSync(p,'utf8'),snap);
 const ds=fs.readFileSync('data/language-book.v1.0.json','utf8');cp.execFileSync(process.execPath,['scripts/build-language-book-v1.mjs']);assert.equal(fs.readFileSync('data/language-book.v1.0.json','utf8'),ds);
 assert.equal(data.entries.length,42);assert.equal(data.entries.filter(model.isPilot).length,28);data.entries.filter(model.isPilot).forEach(x=>assert.deepEqual(model.validate(x),[]));
});
