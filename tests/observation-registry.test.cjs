const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.resolve(__dirname,'..');
const modulePromise=import('../scripts/observation-registry.mjs');
const at='2026-09-22T00:00:00.000Z';
const human=(overrides={})=>({observation_id:'OBS-H1',origin_type:'jinkai_original',author:'Jinkai Liu',original_text:'Synthetic test: testword ↔ 例',source_form:'testword',source_language:'Test only',proposed_mapping:'例',reasoning_raw:'Synthetic reasoning',provenance:{source_location:'synthetic fixture',authorship_verified:true,attribution_basis:'Synthetic identity fixture, not a real author note',intake_mode:'non_llm'},ai_exposure_status:'exposed_to_ai',...overrides});
async function fixture() {
 const m=await modulePromise;let r=m.emptyRegistry();
 r=m.append(r,'object',{id:'C1',kind:'candidate',source_ref:'synthetic:C1'});
 r=m.append(r,'object',{id:'M1',kind:'mapping',source_ref:'synthetic:M1'});
 return {m,r};
}
test('Registry preserves two human origins and a third AI origin for one research mapping',async()=>{
 let {m,r}=await fixture();
 const inputs=[human(),human({observation_id:'OBS-H2',origin_type:'contributor',author:'Test contributor'}),human({observation_id:'OBS-AI',origin_type:'ai_discovery',author:'Test AI',ai_exposure_status:'post_ai_observation',ai_discovery:{run_reference:'test-run',model:'test-model',generation_method:'synthetic',input_scope:'synthetic',candidate:'例',independence_status:'Not claimed',controls:[],counterexamples:[]}})];
 for(const input of inputs){r=m.append(r,'ingest',m.observation(input,at));for(const id of ['C1','M1'])r=m.append(r,'link',{observation_id:input.observation_id,object_id:id});}
 const state=m.replay(r),tasks=m.productionTasks(r);
 assert.equal(state.observations.length,3);assert.equal(tasks.length,1);assert.equal(tasks[0].observation_ids.length,3);
 assert.deepEqual(state.observations.map(x=>x.author),['Jinkai Liu','Test contributor','Test AI']);
 assert.ok(state.observations.every(x=>x.linked_mapping_ids[0]==='M1'));
});
test('Normalization cannot overwrite immutable original, author, evidence or exposure',async()=>{
 let {m,r}=await fixture();r=m.append(r,'ingest',m.observation(human(),at));
 const before=structuredClone(r);r=m.append(r,'normalize',{observation_id:'OBS-H1',normalized:{original_text:'AI rewritten',author:'AI',evidence:'Proven',exposure:'unexposed'}},'ai_worker');
 const actual=m.replay(r).observations[0];assert.equal(actual.original_text,human().original_text);assert.equal(actual.author,'Jinkai Liu');assert.equal(actual.evidence_status,'Pending');assert.equal(actual.ai_exposure_status,'exposed_to_ai');
 m.assertAppendOnly(before,r);assert.throws(()=>m.append(r,'edit',{observation_id:'OBS-H1',original_text:'overwrite'}));
});
test('Exposure is monotonic, including unknown and post-AI states',async()=>{
 for(const status of ['exposed_to_ai','unknown','post_ai_observation']) {
  let {m,r}=await fixture();r=m.append(r,'ingest',m.observation(human({ai_exposure_status:status}),at));
  assert.throws(()=>m.append(r,'exposure',{observation_id:'OBS-H1',status:'unexposed'}),/regress/);
 }
});
test('Unknown origin never inherits corpus author; contributor cannot masquerade as Jinkai',async()=>{
 const m=await modulePromise;
 assert.throws(()=>m.observation(human({origin_type:'unknown'})),/Unknown provenance/);
 assert.throws(()=>m.observation(human({origin_type:'contributor'})),/Contributor identity/);
 assert.throws(()=>m.observation(human({provenance:{...human().provenance,authorship_verified:false}})),/verified authorship/);
 const r=m.observation(human({origin_type:'unknown',author:null}));assert.equal(r.author,null);
});
test('Dedup merges candidate work, never observation occurrences; duplicate IDs are rejected',async()=>{
 let {m,r}=await fixture();
 for(const id of ['OBS-H1','OBS-H2']){r=m.append(r,'ingest',m.observation(human({observation_id:id}),at));r=m.append(r,'link',{observation_id:id,object_id:'C1'});}
 assert.equal(m.productionTasks(r).length,1);assert.equal(m.replay(r).observations.length,2);
 assert.throws(()=>m.append(r,'ingest',m.observation(human(),at)),/already exists/);
 assert.throws(()=>m.append(r,'link',{observation_id:'OBS-H1',object_id:'missing'}),/Unknown object/);
});
test('Reserved holdout reveals no text, target, reasoning, source or derived fields to production',async()=>{
 let {m,r}=await fixture();const input=human({ai_exposure_status:'unexposed',holdout_status:'reserved',source_form:'SECRET_SOURCE',original_text:'SECRET_RAW',proposed_mapping:'SECRET_TARGET',reasoning_raw:'SECRET_REASON'});
 r=m.append(r,'ingest',m.observation(input,at),'human_intake');
 for(const [kind,payload] of [['link',{object_id:'C1'}],['normalize',{normalized:{target:'SECRET_TARGET'}}],['research',{status:'research'}],['exposure',{status:'exposed_to_ai'}]])assert.throws(()=>m.append(r,kind,{observation_id:'OBS-H1',...payload}));
 assert.deepEqual(m.productionTasks(r),[]);
 assert.doesNotMatch(JSON.stringify(m.publicMetadata(r)),/SECRET|source_location|proposed_mapping|reasoning|hash/);
 assert.throws(()=>m.append(r,'reveal',{observation_id:'OBS-H1',authorization_ref:'test'},'ai_worker'),/Human reveal/);
 r=m.append(r,'reveal',{observation_id:'OBS-H1',authorization_ref:'human-explicit-production-consent'},'human_intake');
 assert.equal(m.replay(r).observations[0].ai_exposure_status,'exposed_to_ai');
 assert.throws(()=>m.append(r,'exposure',{observation_id:'OBS-H1',status:'unexposed'}));
});
test('Worker and scheduler stop at Freeze Proposal; no Reviewed/Published or acceptance event',async()=>{
 let {m,r}=await fixture();r=m.append(r,'ingest',m.observation(human(),at));
 for(const status of ['research','freeze_proposal'])r=m.append(r,'research',{observation_id:'OBS-H1',status},'scheduler');
 for(const status of ['accepted_reference','canonical_candidate','reviewed','published'])assert.throws(()=>m.append(r,'research',{observation_id:'OBS-H1',status},'scheduler'),/Review Gate/);
 for(const kind of ['accept','publish','review'])assert.throws(()=>m.append(r,kind,{observation_id:'OBS-H1'},'scheduler'));
 assert.equal(m.replay(r).observations[0].publication_status,'not_published');
});
test('Schema rejects unsupported fields, independent evidence gate rejects historical promotion',async()=>{
 let {m,r}=await fixture();const input=m.observation(human(),at);
 assert.throws(()=>m.append(r,'ingest',{...input,review_status:'published'}),/schema/);
 assert.throws(()=>m.append(r,'ingest',{...input,historical_relation:'Proven'}));
 assert.throws(()=>m.append(r,'ingest',{...input,origin_type:'unknown'}),/Unknown provenance/);
});
test('Hash plus committed-prefix gate detects editing, deletion and rehashed history',async()=>{
 let {m,r}=await fixture();r=m.append(r,'ingest',m.observation(human(),at));
 const edited=structuredClone(r);edited.events[2].payload.original_text='tampered';
 assert.throws(()=>m.replay(edited),/Broken event chain/);
 const {hash,...body}=edited.events[2];edited.events[2].hash=m.digest(body);
 m.replay(edited);assert.throws(()=>m.assertAppendOnly(r,edited),/Immutable history/);
 assert.throws(()=>m.assertAppendOnly(r,{...r,events:r.events.slice(0,2)}),/Immutable history/);
});
test('Private intake is outside checkout, no stdout content, no retroactive holdout',async()=>{
 const m=await modulePromise,dir=fs.mkdtempSync(path.join(os.tmpdir(),'observation-test-'));
 const file=path.join(dir,'registry.json');
 const args={file,repoRoot:root,input:human({ai_exposure_status:'unexposed'}),route:'holdout',humanAuthorizationRef:'test-human-intake'};
 assert.throws(()=>m.privateIntake({...args,file:path.join(root,'registry-private-test.json')}),/outside repository/);
 assert.throws(()=>m.privateIntake({...args,input:human()}),/pre-AI/);
 const output=m.privateIntake(args);assert.deepEqual(Object.keys(output),['observation_id','created_at','holdout_status']);
 const loaded=m.loadRegistry(file);assert.equal(m.replay(loaded).observations[0].original_text,human().original_text);
 const file2=path.join(dir,'production.json');m.privateIntake({...args,file:file2,route:'production'});
 assert.throws(()=>m.privateIntake({...args,file:file2,input:human({observation_id:'NEW-ID',ai_exposure_status:'unexposed'})}),/Previously exposed/);
});
test('Persistence rejects stale writers and preserves existing content',async()=>{
 let {m,r}=await fixture();const file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'observation-test-')),'registry.json');m.saveRegistry(file,r);
 const stale=structuredClone(r);r=m.append(r,'ingest',m.observation(human(),at));m.saveRegistry(file,r);
 assert.throws(()=>m.saveRegistry(file,stale),/Immutable history/);assert.deepEqual(m.loadRegistry(file),r);
});
test('AI Discovery pool joins human queue through the same association layer, archive stays out',async()=>{
 let {m,r}=await fixture();r=m.append(r,'ingest',m.observation(human(),at));r=m.append(r,'link',{observation_id:'OBS-H1',object_id:'C1'});
 assert.equal(m.productionTasks(r).length,1);r=m.append(r,'research',{observation_id:'OBS-H1',status:'archived'});
 assert.deepEqual(m.productionTasks(r),[]);assert.equal(m.replay(r).observations[0].original_text,human().original_text);
});
test('Migration preserves exact source text, 42+14+2 and valid associations',async()=>{
 const {validateRegistry}=await import('../scripts/validate-observation-registry.mjs');const report=validateRegistry(root);
 assert.equal(report.observations,66);assert.deepEqual(report.origins,{unknown:52,ai_discovery:14});assert.equal(report.production_tasks,0);
 const m=await modulePromise,state=m.replay(m.loadRegistry(path.join(root,'research/observations/registry.v0.1.json')));
 assert.equal(state.objects.filter(x=>x.kind==='candidate').length,58);
 assert.equal(state.objects.filter(x=>x.kind==='mapping').length,51);
 assert.ok(state.observations.every(x=>x.review_status==='unreviewed' && x.publication_status==='not_published'));
});
test('Publication excludes research registry and sealed material but preserves reader datasets',async()=>{
 const {publicationFileAllowed:allowed}=await import('../scripts/publication-file-policy.mjs');
 for(const p of ['research/observations/registry.v0.1.json','RESEARCH/private.json','private-research-packages/key.json','experiments/x/private-research-package/hidden.json','experiments/x/analysis-key.json'])assert.equal(allowed(p),false);
 assert.equal(allowed('data/language-book.v1.0.json'),true);assert.equal(allowed('data/candidates/production-corpus.v0.1.json'),true);
});
