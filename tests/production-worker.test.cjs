const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/worker-v1.1-lexical.json'),'utf8'));
const api=import('../scripts/production-worker.mjs');

test('new Scheduler task carries v1.1 and fixture meets its complete lexical output contract',async()=>{
  const {schedule}=await import('../scripts/queue-scheduler.mjs');
  const row={candidate_id:'fixture-lexical',research_object_id:'fixture-lexical',
    ...fixture.source_identity,provenance:[{source_location:'synthetic fixture'}],
    primary_pipeline:'Lexical–Diachronic',research_status:'queued',holdout_status:'not_eligible',
    ai_exposure_status:'exposed_to_ai'};
  const audit=schedule({items:[row],exclusions:{benchmark_ids:[],holdout_ids:[],completed_ids:[],archive_ids:[]}});
  assert.equal(audit.worker_method_version,'1.1');
  assert.deepEqual(audit.selection[0].worker_contract.steps,(await api).LEXICAL_STEPS);
  assert.equal(audit.selection[0].dispatch_allowed,false);
  assert.deepEqual((await api).validateWorkerOutput(fixture).errors,[]);
  assert.ok(fixture.depth_record.entries[0].source_stages.length);
  assert.ok(fixture.depth_record.entries[0].chinese_stages.length);
  for(const key of ['source_stages','chinese_coverage','mappings']){
    const f=structuredClone(fixture);delete f.depth_record.entries[0][key];
    assert.ok((await api).validateWorkerOutput(f).errors.length,key);
  }
});

test('modern-only translation cannot become D1 even with a claimed review',async()=>{
  const f=structuredClone(fixture),e=f.depth_record.entries[0];
  f.depth_status=e.lexical_subclaim_depth_proposal='D1';
  e.d1_gate={reason:'attempted promotion',bilateral_evidence_review:'claimed review',
    source_historical_stage_ref:'s-modern',chinese_historical_stage_ref:'c-modern'};
  assert.ok((await api).validateWorkerOutput(f).errors.some(x=>x.includes('historical evidence')));
});

test('bilateral D1 requires both referenced historical sides and an actual comparison, still human-reviewed',async()=>{
  const f=structuredClone(fixture),e=f.depth_record.entries[0];
  f.depth_status=e.lexical_subclaim_depth_proposal='D1';
  f.depth_record.sources={s:{url:'https://example.invalid/synthetic-source',scope:'synthetic test only'}};
  for(const n of [...e.source_stages,...e.chinese_stages])
    Object.assign(n,{period:'synthetic earlier period',evidence_layer:'historical',evidence_status:'attested',source_refs:['s']});
  e.mappings[0].evidence=['s'];
  e.d1_gate={reason:'synthetic bilateral declaration',bilateral_evidence_review:'fixture review, not real research',
    source_historical_stage_ref:'s-modern',chinese_historical_stage_ref:'c-modern'};
  const result=(await api).validateWorkerOutput(f);
  assert.deepEqual(result.errors,[]);assert.equal(result.review_required,true);
  e.chinese_stages[0].source_refs=[];
  assert.ok((await api).validateWorkerOutput(f).errors.length);
});

test('second pipeline without lexical claims stays D4; adding a claim requires depth record',async()=>{
  const f=structuredClone(fixture);
  f.primary_pipeline='Cultural–Structural–Literary';f.depth_status='D4';
  f.featured_summary={form:'Pending'};delete f.depth_record;
  assert.deepEqual((await api).validateWorkerOutput(f).errors,[]);
  f.has_lexical_historical_claims=true;
  assert.ok((await api).validateWorkerOutput(f).errors.length);
});

test('Worker cannot hide Pending, detach Featured, bypass review or validate malformed input',async()=>{
  for(const mutate of [f=>f.visible_pending=[],f=>f.featured_summary.scope='all senses',
    f=>f.corpus_writeback=true,f=>f.review_by='AI',f=>f.status='Published']){
    const f=structuredClone(fixture);mutate(f);
    assert.ok((await api).validateWorkerOutput(f).errors.length);
  }
  assert.ok((await api).validateWorkerOutput(null).errors.length);
});

test('accepted depth research preserves frozen artifacts across Git line endings and does not upgrade Active corpus',()=>{
  const crypto=require('node:crypto');
  const read=p=>fs.readFileSync(path.join(__dirname,'..',p));
  const a=JSON.parse(read('research/depth-upgrades/pilot-001/acceptance.json'));
  assert.equal(a.corpus_writeback,false);
  assert.deepEqual(a.depth_counts,{D1:0,D2:8});
  assert.equal(a.entries.length,8);
  assert.equal(a.entries.find(e=>e.entry==='pressure').featured_action,'Narrow');
  for(const [p,h] of Object.entries({...a.preserved_inputs,...a.frozen_artifacts}))
    assert.equal(crypto.createHash('sha256').update(read(p).toString('utf8').replace(/\r\n/g,'\n')).digest('hex'),h.lf_sha256,p);
  assert.equal(JSON.parse(read('data/candidates/production-corpus.v0.1.json')).records.length,52);
});
