const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const mod=import('../scripts/queue-scheduler.mjs'),reg=import('../scripts/observation-registry.mjs');
const at='2026-09-22T12:00:00.000Z';
const item=(id,more={})=>({candidate_id:id,research_object_id:id,source_form:id,source_language:'English',lexical_identity:'synthetic noun',meaning_context:'synthetic meaning',provenance:[{source_location:'synthetic-only'}],primary_pipeline:'Lexical–Diachronic',ai_exposure_status:'exposed_to_ai',holdout_status:'not_eligible',research_status:'queued',input_channel:'research_queue',observation_ids:[`O-${id}`],observations:[{observation_id:`O-${id}`,origin_type:'unknown',author:null,authorship_verified:false}],queue_order:1,...more});
const snapshot=items=>({snapshot_id:'TEST',items,exclusions:{benchmark_ids:[],holdout_ids:[],completed_ids:[],archive_ids:[]}});
test('Scheduler blocks benchmark, holdout anomalies, exposure unknown and no consent without leaking targets',async()=>{
 const {schedule}=await mod,s=snapshot([
  item('B',{proposed_mapping:'SECRET_TARGET',original_text:'SECRET_RAW',source_form:'SECRET_FORM'}),
  item('H',{holdout_status:'reserved',proposed_mapping:'SECRET_TARGET'}),
  item('U',{ai_exposure_status:'unexposed',reasoning_raw:'SECRET_REASON'}),
  item('X',{ai_exposure_status:'unknown'}),item('OK')]);
 s.exclusions.benchmark_ids=['B'];s.exclusions.holdout_ids=['H'];
 const result=schedule(s,{timestamp:at});assert.deepEqual(result.selection.map(x=>x.research_object_id),['OK']);
 assert.doesNotMatch(JSON.stringify(result),/SECRET/);assert.equal(result.benchmark_exclusions.length,1);assert.equal(result.holdout_exclusions.length,3);
 assert.match(result.deferred.find(x=>x.research_object_id==='H').reason,/anomaly/);
 const other=structuredClone(s);other.items[0].proposed_mapping='ANOTHER_SECRET';
 assert.deepEqual(schedule(other,{timestamp:at}),result,'Even scheduling digest must not depend on excluded target content');
});
test('Object-level protection survives duplicate rows and candidate aliases',async()=>{
 const {schedule}=await mod,s=snapshot([item('reserved',{research_object_id:'same'}),item('clean',{research_object_id:'same'}),item('alias',{alias_ids:['reserved']})]);s.exclusions.benchmark_ids=['reserved'];
 assert.equal(schedule(s).selection.length,0);
});
test('Archive/completed/review-pending/in-progress stay out; Scheduler cannot reopen',async()=>{
 const {schedule}=await mod,s=snapshot([item('archive',{research_status:'archived',reopen:true}),item('done'),item('proposal',{research_status:'freeze_proposal'}),item('running',{research_status:'research'})]);s.exclusions.completed_ids=['done'];
 const result=schedule(s);assert.equal(result.selection.length,0);assert.equal(result.deferred.length,4);assert.equal(result.worker_runs,0);
});
test('Source Identity Gate defers missing language/context instead of inferring it from Chinese',async()=>{
 const {schedule}=await mod,s=snapshot([item('cun',{source_language:'Undetermined raw form',lexical_identity:null,meaning_context:null,proposed_mapping:'存'}),item('mixed',{source_language:'English/French'}),item('routing',{primary_pipeline:null}),item('ok')]);
 const result=schedule(s);assert.deepEqual(result.selection.map(x=>x.research_object_id),['ok']);
 assert.match(result.deferred.find(x=>x.research_object_id==='cun').reason,/Provenance\/Identity/);assert.match(result.deferred.find(x=>x.research_object_id==='routing').reason,/Routing Pending/);
});
test('Three origins remain separate while one mapping/candidate consumes one research slot',async()=>{
 const {schedule}=await mod,rows=['jinkai_original','contributor','ai_discovery'].map((origin_type,i)=>item(`I-${i}`,{research_object_id:'same',observation_ids:[`O${i}`],observations:[{observation_id:`O${i}`,origin_type,author:['Jinkai Liu','Test Contributor','Test AI'][i],authorship_verified:true}],source_form:'same'}));
 const result=schedule(snapshot(rows));assert.equal(result.selection.length,1);assert.equal(result.selection[0].observation_ids.length,3);assert.equal(result.selection[0].origin_composition.label,'multiple origins');assert.equal(result.selection[0].origin_composition.observations.length,3);
});
test('Unknown provenance cannot enter human quota by using Jinkai display name',async()=>{
 const {schedule}=await mod;
 const result=schedule(snapshot([item('x',{observations:[{observation_id:'O1',origin_type:'jinkai_original',author:'Jinkai Liu',authorship_verified:false}]})]));
 assert.equal(result.selection[0].origin_composition.label,'unknown provenance');assert.equal(result.selection[0].origin_composition.observations[0].author,null);assert.equal(result.composition.human,0);
});
test('Composition reserves AI capacity despite many human notes; no synthetic quota padding',async()=>{
 const {schedule}=await mod;const rows=[];
 for(let i=0;i<10;i++)rows.push(item(`H${i}`,{observations:[{observation_id:`OH${i}`,origin_type:'jinkai_original',author:'Jinkai Liu',authorship_verified:true}],created_at:`2026-09-${String(i+1).padStart(2,'0')}T00:00:00Z`}));
 for(let i=0;i<4;i++)rows.push(item(`A${i}`,{observations:[{observation_id:`OA${i}`,origin_type:'ai_discovery',author:'AI'}]}));
 for(let i=0;i<2;i++)rows.push(item(`N${i}`,{sampling_role:'negative'}));
 const r=schedule(snapshot(rows));assert.equal(r.selection.length,8);assert.equal(r.composition.human,4);assert.equal(r.composition.ai,2);assert.equal(r.composition.control_or_uncertain,2);
 assert.equal(schedule(snapshot([item('alone')])).shortfall,7);
});
test('Sorting is deterministic and eight priority dimensions are independent, no aggregate score',async()=>{
 const {schedule,DIMENSIONS}=await mod,s=snapshot([item('second',{queue_order:2}),item('first',{queue_order:1})]);
 const first=schedule(s,{timestamp:at});assert.deepEqual(first,schedule(s,{timestamp:at}));assert.equal(first.selection[0].source_form,'first');
 assert.deepEqual(Object.keys(first.selection[0].priority_dimensions),DIMENSIONS);assert.equal(first.selection[0].score,undefined);
});
test('Scheduler cannot publish, dispatch or mutate input including Original Observation',async()=>{
 const {schedule}=await mod,s=snapshot([item('x',{original_text:'original',publication_status:'published',featured:'desired',evidence:'Supported'})]);const before=JSON.stringify(s),r=schedule(s);
 assert.equal(JSON.stringify(s),before);assert.equal(r.publication_allowed,false);assert.equal(r.registry_mutations,0);assert.equal(r.worker_runs,0);
 assert.equal(r.selection[0].dispatch_allowed,false);assert.equal(r.selection[0].stop_at,'Editorial Freeze Proposal');assert.equal(r.selection[0].requires_review_by,'Jinkai Liu');
 assert.equal(r.selection[0].featured,undefined);assert.equal(r.selection[0].evidence,undefined);assert.equal(r.selection[0].publication_status,undefined);
});
test('Synthetic raw human note freezes unexposed, waits for decision, then joins contributor and AI without overwriting',async()=>{
 const m=await reg,{registryQueueProjection,schedule}=await mod;
 let r=m.emptyRegistry();r=m.append(r,'object',{id:'C',kind:'candidate',source_ref:'synthetic'});r=m.append(r,'object',{id:'M',kind:'mapping',source_ref:'synthetic'});
 const base={source_form:'synthetic',source_language:'English',original_text:'Synthetic original preserved exactly.',proposed_mapping:'例',provenance:{source_location:'synthetic',attribution_basis:'test fixture',authorship_verified:true,intake_mode:'non_llm'}};
 r=m.append(r,'ingest',m.observation({...base,observation_id:'H',origin_type:'jinkai_original',author:'Jinkai Liu',ai_exposure_status:'unexposed',holdout_status:'reserved'},at),'human_intake');
 const frozen=structuredClone(r);const projected=registryQueueProjection(r);assert.equal(projected[0].source_form,undefined);assert.equal(schedule(snapshot(projected)).selection.length,0);
 r=m.append(r,'reveal',{observation_id:'H',authorization_ref:'synthetic human decision'},'human_intake');
 for(const id of ['C','M'])r=m.append(r,'link',{observation_id:'H',object_id:id});
 r=m.append(r,'ingest',m.observation({...base,observation_id:'P',origin_type:'contributor',author:'Test Contributor',ai_exposure_status:'exposed_to_ai'},at));
 r=m.append(r,'ingest',m.observation({...base,observation_id:'A',origin_type:'ai_discovery',author:'Test AI',ai_exposure_status:'post_ai_observation',ai_discovery:{run_reference:'test',model:'test',generation_method:'test',input_scope:'synthetic only',candidate:'例',independence_status:'Not claimed',controls:[],counterexamples:[]}},at));
 for(const who of ['P','A'])for(const id of ['C','M'])r=m.append(r,'link',{observation_id:who,object_id:id});
 const before=JSON.stringify(r),view=registryQueueProjection(r,{C:{lexical_identity:'synthetic noun',meaning_context:'synthetic context',primary_pipeline:'Lexical–Diachronic'}}),result=schedule(snapshot(view));
 assert.equal(result.selection.length,1);assert.equal(result.selection[0].observation_ids.length,3);assert.equal(result.selection[0].origin_composition.label,'multiple origins');assert.equal(JSON.stringify(r),before);
 m.assertAppendOnly(frozen,r);assert.equal(m.replay(r).observations[0].original_text,base.original_text);
});
test('Exclusion manifest missing fields fails closed, conflicting observation attribution rejected',async()=>{
 const {schedule}=await mod;
 assert.throws(()=>schedule({items:[]}),/Exclusion/);assert.throws(()=>schedule({items:[],exclusions:{}}),/Missing/);
 const a=item('x'),b=item('x',{observations:[{observation_id:'O-x',origin_type:'ai_discovery',author:'AI'}]});assert.throws(()=>schedule(snapshot([a,b])),/Conflicting/);
 assert.equal(schedule(snapshot([item('unknown-holdout',{holdout_status:undefined}),item('unknown-state',{research_status:'published'})])).selection.length,0);
});
test('Real dry run is replayable with eight proposals, no corpus acceptance or research',async()=>{
 const {schedule}=await mod,root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const input=read('research/scheduler/batch004-input.v0.1.json'),audit=read('research/scheduler/batch004-dry-run.v0.1.json');
 assert.deepEqual(schedule(input,{timestamp:audit.timestamp}),audit);assert.equal(audit.selection.length,8);assert.ok(audit.deferred.length>=5);assert.equal(audit.worker_runs,0);
 assert.equal(read('data/language-book.v1.0.json').entries.length,42);assert.equal(read('data/candidates/production-corpus.v0.1.json').records.length,14);assert.equal(read('data/candidates/production-archive.v0.1.json').records.length,2);
});
test('Independent Scheduler audit rejects dispatch, review, exclusion and selection tampering',async()=>{
 const {schedule}=await mod,{validateSchedulerAudit}=await import('../scripts/validate-queue-scheduler.mjs');
 const s=snapshot([item('ok'),item('reserved')]);s.exclusions.benchmark_ids=['reserved'];const audit=schedule(s,{timestamp:at});
 assert.deepEqual(validateSchedulerAudit(s,audit),[]);
 for(const mutate of [a=>a.worker_runs=1,a=>a.publication_allowed=true,a=>a.selection[0].dispatch_allowed=true,a=>a.selection[0].requires_review_by='AI',a=>a.selection[0].featured='chosen',a=>a.selection[0].candidate_ids.push('reserved'),a=>a.selection[0].source_identity_gate.status='Pending']) {
  const changed=structuredClone(audit);mutate(changed);assert.ok(validateSchedulerAudit(s,changed).length);
 }
});
