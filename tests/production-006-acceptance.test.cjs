const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const prefix='research/production-state/pending/production-006/';
const active=read('data/candidates/production-corpus.v0.1.json'),freeze=read('data/review/production-006-freeze.v0.1.json');
test('006 preserves original proposals and existing corpus; acceptance is separate',()=>{
 const old=JSON.parse(execFileSync('git',['show','fbb4e53923d2a800b8b22f92f2caf81fa8820f09:data/candidates/production-corpus.v0.1.json'],{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024}));
 assert.deepEqual(active.records.slice(0,36),old.records);
 for(const [file,hash] of Object.entries(read(prefix+'manifest.json').files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,prefix+file),'utf8').replace(/\r\n/g,'\n')).digest('hex'),hash);
 const proposal=read(prefix+'research-report.json');
 assert.equal(proposal.accepted,false);assert.equal(freeze.approved_by,'Jinkai Liu');
 assert.equal(active.records.length,44);assert.equal(active.records.filter(r=>r.featured_mapping_status==='Candidate').length,12);
 for(const f of freeze.records){
  assert.deepEqual(f.research_record,proposal.entries.find(x=>x.candidate_id===f.candidate_id));
  assert.equal(f.origin,'unknown');assert.equal(f.author,null);assert.equal(f.historical_relation,'Not claimed');
  assert.equal(f.featured,({forme:'形 xíng','média':'媒 méi'})[f.source_form]||'Pending');
 }
});
test('006 is completed and excluded without dispatch or acceptance of new objects',async()=>{
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');
 const snapshot=prepareSnapshot({root,at:'006-regression'});
 for(const f of freeze.records)assert.ok(snapshot.exclusions.completed_ids.includes(f.candidate_id));
 const {deriveState,validateState}=await import('../scripts/production-state.mjs');
 assert.deepEqual(validateState(root),[]);
 const state=deriveState(root,'006-regression');
 assert.deepEqual(state.pending_freeze_batches,[]);assert.equal(state.eligible_queue_count,17);assert.equal(state.provenance_review_queue_count,5);
 assert.equal(state.automatic_dispatch,false);
});
test('006 editorial gate rejects sense expansion, cultural upgrades and provenance promotion',async()=>{
 const {validateProduction}=await import('../scripts/validate-production-candidates.mjs');
 const archive=read('data/candidates/production-archive.v0.1.json');
 for(const [word,mutate] of [
  ['forme',r=>r.baseline_record.editorial_boundary='All senses including fitness'],
  ['média',r=>r.baseline_record.phonetic_fit='High'],
  ['六十四卦',r=>r.baseline_record.editorial_boundary='Proven origin of all writing'],
  ['神农氏人身牛头',r=>r.baseline_record.pending=[]],
  ['alimentary',r=>r.baseline_record.origin='jinkai_original'],
  ['generation',r=>r.review_status='reviewed'],
  ['couvent',r=>r.publication_status='published'],
  ['alimenter',r=>r.candidate_mapping='Proven']
 ]){const data=structuredClone(active);mutate(data.records.find(r=>r.source_word===word));assert.ok(validateProduction(data,archive).length,word);}
});
