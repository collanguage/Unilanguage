const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const data=require('../js/language-book-data.js');
const candidatesAPI=require('../js/production-candidate-data.js');
const active=read('data/candidates/production-corpus.v0.1.json');
const archive=read('data/candidates/production-archive.v0.1.json');
test('Production 7+1 intake passes separate structural/editorial gate',async()=>{
 const {validateProduction}=await import('../scripts/validate-production-candidates.mjs');
 assert.deepEqual(validateProduction(active,archive),[]);
});
test('Production gate rejects review/publication/evidence/Featured/archive upgrades',async()=>{
 const {validateProduction}=await import('../scripts/validate-production-candidates.mjs');
 for(const mutate of [
  a=>a.records[0].review_status='reviewed',
  a=>a.records[0].publication_status='published',
  a=>a.records[0].featured_mapping_status='Proven',
  a=>a.records[0].baseline_record.historical_relation='Proven',
  a=>a.records.find(r=>r.source_word==='move').baseline_record.phonetic_fit='High',
  a=>a.records.find(r=>r.source_word==='luminous').baseline_record.pending=[],
  a=>a.records[0].baseline_record.author_observation.status='Author verified',
  a=>a.records.push(archive.records[0]),
  a=>a.records[0].blockers=[],
 ]){const a=structuredClone(active);mutate(a);assert.ok(validateProduction(a,archive).length);}
});
test('Explicit candidate search keeps Pending usable and archive absent',()=>{
 for(const r of active.records){const hit=candidatesAPI.lookupCandidates(active,r.source_word.toUpperCase());assert.equal(hit.kind,'candidate');assert.equal(hit.entry,null);assert.equal(hit.candidates[0].review_status,'candidate');assert.equal(hit.candidates[0].publication_status,'not_published');}
 assert.equal(candidatesAPI.lookupCandidates(active,'gan').kind,'unknown');
 assert.equal(candidatesAPI.lookupCandidates(archive,'gan').kind,'unknown');
 assert.equal(candidatesAPI.lookupCandidates(active,'动').candidates[0].source_word,'move');
 assert.equal(candidatesAPI.lookupCandidates(active,'易').candidates[0].source_word,'change');
 assert.equal(candidatesAPI.lookupCandidates(active,'步').kind,'unknown');
 assert.equal(candidatesAPI.lookupCandidates(active,'').kind,'empty');
});
test('Legacy Mapper/search API unchanged by independent candidate corpus',()=>{
 const legacy=read('data/language-book.v1.0.json');
 const before=JSON.stringify(legacy);
 assert.equal(legacy.entries.length,42);
 const old=data.lookup(legacy,'sky');
 for(const r of active.records)candidatesAPI.lookupCandidates(active,r.source_word);
 assert.deepEqual(data.lookup(legacy,'sky'),old);
 assert.equal(JSON.stringify(legacy),before);
 assert.equal(data.DATASET_URL,'data/language-book.v1.0.json');
 for(const r of active.records)assert.ok(!legacy.entries.some(e=>e.id===r.candidate_id));
});
test('Candidate loader rejects archive and never fetches automatically',async()=>{
 const saved=global.fetch;let calls=[];
 try{
  global.fetch=async url=>{calls.push(url);return {ok:true,json:async()=>active};};
  assert.equal(await candidatesAPI.loadCandidateCorpus(),active);assert.deepEqual(calls,['data/candidates/production-corpus.v0.1.json']);
  global.fetch=async()=>({ok:true,json:async()=>archive});
  await assert.rejects(candidatesAPI.loadCandidateCorpus(),/active production/);
 }finally{global.fetch=saved;}
});
