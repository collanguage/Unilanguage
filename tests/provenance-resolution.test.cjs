const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const folder='research/observations/provenance-resolution-v1/';
test('Resolution preserves previous Registry event prefix and all linguistic corpora',async()=>{
 const {assertAppendOnly}=await import('../scripts/observation-registry.mjs');
 const r=read(folder+'resolution.json');
 const old=p=>JSON.parse(execFileSync('git',['show',r.baseline_commit+':'+p],{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024}));
 assertAppendOnly(old('research/observations/registry.v0.1.json'),read('research/observations/registry.v0.1.json'));
 for(const p of ['data/language-book.v1.0.json','data/candidates/production-corpus.v0.1.json','data/candidates/production-archive.v0.1.json','research/controls/production-004.v0.1.json'])
  assert.deepEqual(read(p),old(p));
});
test('Nineteen imported scopes resolve exact sources, preserve raw text and do not infer authors or targets',async()=>{
 const {replay}=await import('../scripts/observation-registry.mjs'),state=replay(read('research/observations/registry.v0.1.json'));
 const r=read(folder+'resolution.json');assert.equal(r.records.length,19);
 assert.deepEqual(r.classification_counts,{J:0,C:0,AI:0,I:19,U:0});
 for(const row of r.records){
  let [file,ptr]=row.source_location.split('#'),v=read(file);for(const part of ptr.slice(1).split('/'))v=v[part];
  const o=state.observations.find(x=>x.observation_id===row.observation_id);
  assert.equal(o.original_text,typeof v==='string'?v:JSON.stringify(v));
  assert.equal(o.author,null);assert.equal(o.origin_type,'unknown');assert.equal(o.proposed_mapping,null);
  assert.equal(o.ai_exposure_status,'exposed_to_ai');assert.equal(o.holdout_status,'not_eligible');
  assert.equal(o.evidence_status,'Pending');assert.equal(o.historical_relation,'Not claimed');
  assert.equal(row.independent_observation,false);
 }
});
test('Only six identity rows change eligibility; thirteen compound identities stay blocked; prior six untouched',async()=>{
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs'),{schedule}=await import('../scripts/queue-scheduler.mjs');
 const resolution=read(folder+'resolution.json'),now=read('research/production-state/queue-seed.v1.json');
 const old=JSON.parse(execFileSync('git',['show',resolution.baseline_commit+':research/production-state/queue-seed.v1.json'],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024}));
 const audited=new Set(resolution.records.map(x=>x.candidate_id));
 assert.deepEqual(now.items.filter(x=>!audited.has(x.candidate_id)),old.items.filter(x=>!audited.has(x.candidate_id)));
 const a=schedule(prepareSnapshot({root,at:'regression'}));
 assert.equal(a.selection.length,8);assert.equal(a.deferred.filter(x=>x.reason.startsWith('Eligible;')).length,4);
 assert.equal(a.deferred.filter(x=>x.reason.startsWith('Provenance/Identity Queue:')).length,13);
 for(const r of resolution.records.filter(x=>x.identity_status!=='Pass'))assert.ok(a.deferred.some(x=>x.research_object_id===r.candidate_id&&x.reason.startsWith('Provenance/Identity Queue:')));
 assert.equal(a.worker_runs,0);assert.equal(a.publication_allowed,false);
});
test('Saved dry run is reproducible and cannot be mistaken for research execution',async()=>{
 const {schedule}=await import('../scripts/queue-scheduler.mjs');
 const s=read(folder+'queue-snapshot.json'),a=read(folder+'scheduler-dry-run.json');
 assert.deepEqual(schedule(s,{timestamp:a.timestamp}),a);
 assert.equal(a.worker_runs,0);assert.equal(a.registry_mutations,0);
 for(const t of a.selection){assert.equal(t.dispatch_allowed,false);assert.equal(t.requires_review_by,'Jinkai Liu');}
});
