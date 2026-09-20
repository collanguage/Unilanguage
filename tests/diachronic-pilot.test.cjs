const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), cp=require('node:child_process');
const pilot=require('../js/diachronic-mapping.js'), e=require('../data/entries/abeyance.v1.json'), data=require('../data/language-book.v1.0.json');
const api=require('../js/language-book-data.js');
const clone=()=>structuredClone(e);
test('only ABEYANCE migrates; all other entry objects and author literature preserved',()=>{
 const before=JSON.parse(cp.execFileSync('git',['show','a95c8379277d8d98b6add555f82ea1b29b2727d7:data/language-book.v1.0.json'],{encoding:'utf8',maxBuffer:30e6}));
 assert.deepEqual(data.entries.filter(x=>x.slug!=='abeyance'),before.entries.filter(x=>x.slug!=='abeyance'));
 const old=before.entries.find(x=>x.slug==='abeyance');
 assert.deepEqual(e.literary_layer,old.literary_layer);assert.deepEqual(e.source,old.source);
 assert.deepEqual(pilot.validate(e),[]);
 for(const slug of ['abandon','abhor','abdicate','aberrant']) assert.equal(pilot.isPilot(data.entries.find(x=>x.slug===slug)),false);
});
test('Pending and Not selected are valid; None found needs a bounded search and no active candidate',()=>{
 const x=clone(),m=x.diachronic_semantic_mapping.mappings[0];
 m.candidates=[];assert.deepEqual(pilot.validate(x),[]);
 m.search.status='none_found';m.search.run_refs=[];assert.ok(pilot.validate(x).some(x=>x.includes('bounded')));
 m.search.run_refs=['ABEY-PILOT-AUDIT'];assert.deepEqual(pilot.validate(x),[]);
 m.candidates=clone().diachronic_semantic_mapping.mappings[0].candidates;assert.ok(pilot.validate(x).some(x=>x.includes('conflicts')));
});
test('reject dangling stages, evidence, mismatched phonological layers and unearned historical claim',()=>{
 for(const mutate of [
  x=>x.diachronic_semantic_mapping.mappings[0].stage_ref='missing',
  x=>x.diachronic_semantic_mapping.historical_stages[0].source_refs.push('missing'),
  x=>x.diachronic_semantic_mapping.mappings[0].candidates[0].comparison.source_pronunciation_ref='PR-ABE-EN',
  x=>x.diachronic_semantic_mapping.mappings[0].candidates[0].phonetic_fit.fit='strong',
  x=>x.diachronic_semantic_mapping.mappings[0].candidates[0].historical_relation.status='Established',
  x=>x.diachronic_semantic_mapping.display_selection.stage_cards.push(x.diachronic_semantic_mapping.display_selection.stage_cards[0])
 ]) {const x=clone();mutate(x);assert.ok(pilot.validate(x).length);}
});
test('Featured Pending does not inherit old 闭; three references render, controls remain research-only',()=>{
 assert.equal(pilot.featured(e),null);assert.equal(e.featured_mapping,undefined);
 assert.equal(e.legacy_calibration.previous_featured_mapping.target,'闭');
 assert.match(pilot.headline(e),/Featured Mapping: Pending/);
 const html=pilot.renderCards(e,'words/abeyance.html#research');
 assert.equal((html.match(/diachronic-stage-card/g)||[]).length,3);
 assert.ok(!html.includes('八'));assert.ok(!html.includes('喷'));
 const page=fs.readFileSync('words/abeyance.html','utf8');
 assert.ok(!page.includes('Featured Mapping Candidate：闭'));assert.match(page,/<details><summary>展开历史链/);
});
test('sound-group flag is independent of semantic/evidence; new queries resolve the same entry',()=>{
 const x=clone(),c=x.diachronic_semantic_mapping.mappings[1].candidates[0],before=JSON.stringify([c.semantic_fit,c.evidence]);
 c.comparison.hypothesis.hit=false;assert.equal(JSON.stringify([c.semantic_fit,c.evidence]),before);
 for(const q of ['abeyance','巴望','巴不得','擘大嘴','盼望','bayer','abeiance']) assert.equal(api.lookup(data,q).entry.id,e.id,q);
 assert.equal(e.diachronic_semantic_mapping.historical_stages.length,5);
});
