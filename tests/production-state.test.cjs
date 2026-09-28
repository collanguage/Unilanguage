const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
test('Durable state resolves 42/44/2/2, no review-pending proposals and four eligible objects',async()=>{
 const {validateState,deriveState}=await import('../scripts/production-state.mjs');
 assert.deepEqual(validateState(root),[]);
 const m=deriveState(root,'2026-09-28T00:00:00.000Z');
 assert.equal(m.legacy_corpus.count,42);assert.equal(m.active_candidate_corpus.count,44);
 assert.equal(m.archive_count,2);assert.equal(m.control_count,2);
 assert.equal(m.observation_registry.count,85);assert.equal(m.eligible_queue_count,4);
 assert.equal(m.provenance_review_queue_count,13);
 assert.deepEqual(m.pending_freeze_batches.map(b=>[b.batch_id,b.count]),[]);
 assert.deepEqual(m.runtime_external_work_dependencies,[]);
});
test('Repository snapshot excludes every pending and reserved identity without exposing targets',async()=>{
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');
 const {schedule}=await import('../scripts/queue-scheduler.mjs');
 const s=prepareSnapshot({root,at:'2026-09-28T00:00:00.000Z'}),a=schedule(s);
 const pending=read('research/production-state/pending-batches.v1.json').batches.flatMap(b=>b.candidate_ids);
 for(const t of a.selection)assert.ok(![...pending,...s.exclusions.benchmark_ids,...s.exclusions.holdout_ids].includes(t.research_object_id));
 for(const row of s.items.filter(r=>s.exclusions.benchmark_ids.includes(r.candidate_id))) {
  assert.equal(row.source_form,undefined);assert.equal(row.proposed_mapping,undefined);assert.equal(row.provenance,undefined);
 }
 assert.ok(s.sources.every(x=>fs.existsSync(path.join(root,x.file))));
 assert.equal(a.worker_runs,0);assert.equal(a.publication_allowed,false);
});
test('Missing repository exclusion file fails closed; external Work paths cannot repair it',async()=>{
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'production-state-'));
 try {
  fs.mkdirSync(path.join(temp,'research/production-state'),{recursive:true});
  fs.copyFileSync(path.join(root,'research/production-state/queue-seed.v1.json'),path.join(temp,'research/production-state/queue-seed.v1.json'));
  assert.throws(()=>prepareSnapshot({root:temp,outputs:root,at:'2026-09-28T00:00:00Z'}),/reservations/);
 } finally {assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir())+path.sep));fs.rmSync(temp,{recursive:true,force:true});}
});
test('State validator rejects pending loss and unauthorized evidence/content changes',async()=>{
 const {validateState}=await import('../scripts/production-state.mjs');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'production-state-'));
 try {
  for(const dir of ['data','research','scripts'])fs.cpSync(path.join(root,dir),path.join(temp,dir),{recursive:true});
  const evidence=path.join(temp,'research/production-state/pending/production-005/report.md');
  fs.writeFileSync(evidence,fs.readFileSync(evidence,'utf8').replace(/\r?\n/g,'\r\n'));
  assert.deepEqual(validateState(temp),[],'Git CRLF checkout must preserve the integrity contract');
  const p=path.join(temp,'research/production-state/pending-batches.v1.json'),original=fs.readFileSync(p);
  const d=JSON.parse(original);d.next_action='unauthorized change';fs.writeFileSync(p,JSON.stringify(d));
  assert.ok(validateState(temp).some(e=>/stale/.test(e)));fs.writeFileSync(p,original);
  const corpus=path.join(temp,'data/candidates/production-corpus.v0.1.json');
  const c=JSON.parse(fs.readFileSync(corpus));c.records[0].publication_status='published';fs.writeFileSync(corpus,JSON.stringify(c));
  assert.ok(validateState(temp).some(e=>/Preserved content changed/.test(e)));
 } finally {assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir())+path.sep));fs.rmSync(temp,{recursive:true,force:true});}
});
test('Consolidation remains outside product export and does not pretend private backup exists',async()=>{
 const {publicationFileAllowed}=await import('../scripts/publication-file-policy.mjs');
 assert.equal(publicationFileAllowed('research/production-state/pending/production-005/research-report.json'),false);
 const e=read('research/production-state/external-assets.v1.json');
 assert.ok(e.packages.length>0);
 for(const p of e.packages){assert.equal(typeof p.aggregate_sha256,'string');assert.equal(p.target,undefined);assert.match(p.recovery_requirement,/custodian backup/);}
 const inventory=read('research/production-state/asset-inventory.v1.json');
 assert.ok(inventory.assets.length>1000);
 for(const a of inventory.assets.filter(a=>a.location.startsWith('external-package:')))assert.equal(a.sha256,null);
});
