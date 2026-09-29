const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),folder='research/production-state/pending/production-007/';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const r=read(folder+'research-report.json');
test('007 uses frozen selection, preserves original observations and stops at review',async()=>{
 const selection=read(folder+'selection.json').selection;
 assert.deepEqual(r.entries.map(e=>e.source_form),['brief','brevity','convene','convenir','figurative','figurer','marché','merchant']);
 assert.deepEqual(r.entries.map(e=>e.candidate_id),selection.map(e=>e.research_object_id));
 const {replay}=await import('../scripts/observation-registry.mjs');
 const obs=replay(read('research/observations/registry.v0.1.json')).observations;
 for(const original of read(folder+'original-observations.json'))assert.deepEqual(original,obs.find(o=>o.observation_id===original.observation_id));
 assert.equal(r.common.historical_relation,'Not claimed');assert.equal(r.common.author,null);
 for(const k of ['accepted','reviewed','published'])assert.equal(r.common[k],false);
 const manifest=read(folder+'manifest.json');
 for(const [file,hash] of Object.entries(manifest.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,folder,file),'utf8').replace(/\r\n/g,'\n')).digest('hex'),hash);
});
test('007 independent scopes and expansion accounting do not inherit conclusions',()=>{
 assert.equal(r.entries.filter(e=>e.featured==='Pending').length,7);
 assert.equal(r.entries.find(e=>e.source_form==='convenir').featured,'合 hé');
 assert.equal(r.common.phonetic_fit,'Low');assert.equal(r.family_reuse.conclusion_inheritance,false);
 for(const e of r.entries){assert.equal(e.candidates.length,3);assert.equal(e.controls.length,2);assert.ok(e.counterexample);assert.ok(e.historical_stages.length>=3);for(const c of e.candidates)assert.ok(c.reading&&c.target&&c.limit&&c.evidence);}
 const expansions=r.entries.filter(e=>e.expansion).map(e=>e.expansion);
 assert.equal(expansions.reduce((n,e)=>n+e.generated,0),2);
 assert.equal(expansions.reduce((n,e)=>n+e.retained,0),0);
 for(const e of expansions)assert.equal(e.generated,e.retained+e.not_selected+e.semantic_mismatch+e.evidence_failure);
});
test('007 pending children cannot be selected again; corpus and Registry remain unchanged',async()=>{
 const {execFileSync}=require('node:child_process');
 for(const file of ['data/language-book.v1.0.json','data/candidates/production-corpus.v0.1.json','data/candidates/production-archive.v0.1.json','research/observations/registry.v0.1.json']){
  const old=JSON.parse(execFileSync('git',['show',r.baseline_commit+':'+file],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}));if(file==='data/candidates/production-corpus.v0.1.json')assert.deepEqual(read(file).records.slice(0,44),old.records);else assert.deepEqual(read(file),old);
 }
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs'),{schedule}=await import('../scripts/queue-scheduler.mjs');
 const a=schedule(prepareSnapshot({root,at:'test'}));
 for(const e of r.entries)assert.ok(!a.selection.some(s=>s.research_object_id===e.candidate_id));
 assert.equal(a.selection.length+a.deferred.filter(d=>d.reason.startsWith('Eligible;')).length,9);
 assert.equal(a.worker_runs,0);assert.equal(a.publication_allowed,false);
});
