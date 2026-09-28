const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const args=()=>['data/review/production-004-freeze.v0.1.json','data/candidates/production-corpus.v0.1.json','research/controls/production-004.v0.1.json','research/scheduler/production-completions.v0.1.json','research/scheduler/production-policy.v0.1.json'].map(read);
test('Batch 004 intake preserves six candidates, two controls, unknown origins and review boundary',async()=>{
 const {validateAcceptance}=await import('../scripts/validate-production-004.mjs');assert.deepEqual(validateAcceptance(...args()),[]);
 for(const mutate of [a=>a[2].records[0].featured='绑',a=>a[1].records.push(a[2].records[0]),a=>a[0].records[0].origin='Jinkai Liu',a=>a[4].forbidden=[],a=>a[4].batch_size=12,a=>a[3].records.pop()]){const a=args();mutate(a);assert.ok(validateAcceptance(...a).length);}
});
test('Candidate lookup exposes new candidates without controls or publication',()=>{
 const api=require('../js/production-candidate-data.js'),a=read('data/candidates/production-corpus.v0.1.json');
 assert.equal(a.records.length,20);
 for(const form of ['abashed','horror','horrid','meaning','up','inside','上','内'])assert.equal(api.lookupCandidates(a,form).kind,'candidate');
 for(const form of ['bound','law'])assert.equal(api.lookupCandidates(a,form).kind,'unknown');
});
test('Scheduler and audit CLI resolve repository paths from unrelated cwd',()=>{
 const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'unilanguage-audit-'));
 try{
  for(const file of ['validate-queue-scheduler.mjs','validate-observation-registry.mjs','validate-production-004.mjs'])assert.match(execFileSync(process.execPath,[path.join(root,'scripts',file)],{cwd,encoding:'utf8'}),/PASS/);
  const target=path.join(cwd,'audit.json');execFileSync(process.execPath,[path.join(root,'scripts/run-queue-scheduler.mjs'),'research/scheduler/batch004-input.v0.1.json',target],{cwd});
  assert.deepEqual(JSON.parse(fs.readFileSync(target)).selection.map(x=>x.research_object_id),read('research/scheduler/batch004-dry-run.v0.1.json').selection.map(x=>x.research_object_id));
 }finally{fs.rmSync(cwd,{recursive:true,force:true});}
});
test('Completed controls are excluded like completed active candidates; frozen dry run remains reproducible',async()=>{
 const {schedule}=await import('../scripts/queue-scheduler.mjs');
 const s=read('research/scheduler/batch004-input.v0.1.json');
 // Fixture limited to the already-completed eight: no next batch is generated.
 const ids=read('research/scheduler/production-completions.v0.1.json').records.map(x=>x.candidate_id);
 s.items=s.items.filter(x=>ids.includes(x.research_object_id));s.exclusions.completed_ids.push(...ids);
 const a=schedule(s);assert.equal(a.selection.length,0);assert.equal(a.deferred.length,8);
});

test('Snapshot preparation from foreign cwd consumes completion ledger without selecting next batch',()=>{
 const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'unilanguage-snapshot-'));
 const write=(name,data)=>{const p=path.join(cwd,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(data));};
 try{
  const output=path.join(cwd,'snapshot.json');
  execFileSync(process.execPath,[path.join(root,'scripts/prepare-scheduler-snapshot.mjs'),output],{cwd});
  const snapshot=JSON.parse(fs.readFileSync(output));
  for(const r of read('research/scheduler/production-completions.v0.1.json').records)assert.ok(snapshot.exclusions.completed_ids.includes(r.candidate_id));
  assert.equal(snapshot.selection,undefined);
 }finally{fs.rmSync(cwd,{recursive:true,force:true});}
});
