const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const active=read('data/candidates/production-corpus.v0.1.json');
test('003/005 acceptance preserves all frozen research and limits Featured to approved four',()=>{
 const featured={direction:'向 xiàng',long:'长 cháng',outside:'外 wài',source:'源 yuán'};
 for(const n of ['003','005']){
  const f=read('data/review/production-'+n+'-freeze.v0.1.json');
  const p=read(f.research_proposal_path),original=p.records||p.entries;
  assert.equal(f.approved_by,'Jinkai Liu');assert.equal(f.records.length,8);
  for(const r of f.records){
   assert.deepEqual(r.research_record,original.find(x=>x.candidate_id===r.candidate_id));
   assert.equal(r.featured,featured[r.source_form]||'Pending');
   if(featured[r.source_form])assert.equal(r.phonetic_fit,'Low');
   assert.equal(r.historical_relation,'Not claimed');
   const a=active.records.find(x=>x.candidate_id===r.candidate_id);
   assert.deepEqual(a.baseline_record,r);assert.deepEqual(a.blockers,r.research_record.pending);
   assert.equal(a.review_status,'candidate');assert.equal(a.publication_status,'not_published');
  }
 }
 assert.equal(active.records.length,44);assert.equal(active.records.filter(r=>r.featured_mapping_status==='Pending').length,32);
});
test('Existing twenty candidate records remain unchanged by appended acceptance',()=>{
 const old=JSON.parse(execFileSync('git',['show','53507311c5a5048d46f66f593d067d7f5904901a:data/candidates/production-corpus.v0.1.json'],{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024}));
 assert.deepEqual(active.records.slice(0,20),old.records);
});
test('Accepted sixteen are completed, not pending or dispatchable; other queues unchanged',async()=>{
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');
 const {schedule}=await import('../scripts/queue-scheduler.mjs');
 const s=prepareSnapshot({root,at:'acceptance-regression'}),a=schedule(s);
 const acceptance=read('research/production-state/acceptance-003-005.v1.json');
 const ids=acceptance.batches.flatMap(b=>b.candidate_ids);
 assert.equal(ids.length,16);
 for(const id of ids){assert.ok(s.exclusions.completed_ids.includes(id));assert.ok(!a.selection.some(t=>t.candidate_ids.includes(id)));}
 const pending=read('research/production-state/pending-batches.v1.json').batches.flatMap(b=>b.candidate_ids);
 assert.ok(ids.every(id=>!pending.includes(id)));
 assert.equal(a.selection.length+a.deferred.filter(r=>r.reason.startsWith('Eligible;')).length,4);
 assert.equal(a.deferred.filter(r=>r.reason.startsWith('Provenance/Identity Queue:')).length,13);
 assert.equal(a.worker_runs,0);
});
test('003/005 evidence gate rejects evidence promotion and loss of frozen limits',async()=>{
 const {validateProduction}=await import('../scripts/validate-production-candidates.mjs');
 const archive=read('data/candidates/production-archive.v0.1.json');
 for(const mutate of [
  r=>r.baseline_record.research_record.pending=[],
  r=>r.baseline_record.research_record.counterexamples=[],
  r=>r.baseline_record.phonetic_fit='High',
  r=>r.publication_status='published',
  r=>r.review_status='reviewed',
  r=>r.candidate_mapping='Proven'
 ]){
  const d=structuredClone(active);mutate(d.records.find(r=>r.source_word==='direction'));
  assert.ok(validateProduction(d,archive).length);
 }
});
