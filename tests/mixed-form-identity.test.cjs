const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const folder='research/observations/mixed-form-resolution-v1/',resolution=read(folder+'resolution.json');
test('Mixed identity resolution is append-only, preserves authorship and all original observations',async()=>{
 const {replay,assertAppendOnly}=await import('../scripts/observation-registry.mjs');
 const p='research/observations/registry.v0.1.json';
 const old=JSON.parse(execFileSync('git',['show',resolution.baseline_commit+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024})),now=read(p);
 assertAppendOnly(old,now);const before=replay(old),after=replay(now);
 assert.equal(after.observations.length,85);assert.equal(after.objects.length-before.objects.length,19);
 for(const b of before.observations){const a=after.observations.find(x=>x.observation_id===b.observation_id);for(const k of ['original_text','origin_type','author','reasoning_raw','ai_exposure_status','evidence_status','proposed_mapping'])assert.deepEqual(a[k],b[k]);}
 for(const o of resolution.objects){assert.ok(after.observations.find(x=>x.observation_id===o.parent_observation_id).linked_candidate_ids.includes(o.id));assert.equal(o.origin,'unknown');assert.equal(o.featured,'Not selected');assert.equal(o.evidence_status,'Pending');assert.equal(o.family_relation,'Not adjudicated; co-occurrence is not ancestry');}
 assert.deepEqual(resolution.counts,{parent_observations:13,objects:23,new:19,linked_existing:1,retained_pending:3,historical_only:4,identity_pending:5});
 assert.equal(resolution.objects.find(o=>o.form==='pression').id,'RQ-f512afb4860a');
});
test('Split identities do not duplicate existing objects; historical and ambiguous scopes remain gated',async()=>{
 const {schedule}=await import('../scripts/queue-scheduler.mjs');const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');
 const audit=schedule(prepareSnapshot({root,at:'test'}));
 assert.equal(audit.selection.length+audit.deferred.filter(x=>x.reason.startsWith('Eligible;')).length,9);
 assert.equal(audit.deferred.filter(x=>x.reason.startsWith('Provenance/Identity')).length,5);
 assert.equal(audit.deferred.filter(x=>x.reason.startsWith('Historical-only')).length,4);
 for(const p of resolution.parents.filter(x=>x.superseded))assert.ok(audit.deferred.some(x=>x.research_object_id===p.candidate_id&&x.reason.startsWith('Duplicate')));
 assert.equal([...audit.selection,...audit.deferred].filter(x=>x.research_object_id==='RQ-f512afb4860a').length,1);
 for(const t of audit.selection){assert.equal(t.origin_composition.label,'unknown provenance');assert.equal(t.dispatch_allowed,false);}
 const saved=read(folder+'scheduler-dry-run.json');assert.deepEqual(schedule(read(folder+'queue-snapshot.json'),{timestamp:saved.timestamp}),saved);
});
test('Parent benchmark and holdout exclusions taint children without leaking forms',async()=>{
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');const {schedule}=await import('../scripts/queue-scheduler.mjs');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'identity-isolation-'));
 try{
  for(const dir of ['data','research'])fs.cpSync(path.join(root,dir),path.join(temp,dir),{recursive:true});
  const file=path.join(temp,'research/production-state/reservations.v1.json'),original=JSON.parse(fs.readFileSync(file));
  const parent=resolution.parents[0];
  for(const key of ['benchmark_ids','holdout_ids']){
   const r=structuredClone(original);r[key].push(parent.candidate_id);fs.writeFileSync(file,JSON.stringify(r));
   const s=prepareSnapshot({root:temp,at:'test'}),a=schedule(s);
   for(const id of parent.child_object_ids){assert.ok(!a.selection.some(x=>x.research_object_id===id));for(const row of s.items.filter(x=>x.research_object_id===id)){assert.equal(row.source_form,undefined);assert.equal(row.provenance,undefined);}}
  }
 }finally{assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir())+path.sep));fs.rmSync(temp,{recursive:true,force:true});}
});
