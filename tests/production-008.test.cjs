const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),base='research/production-008/';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
test('Production 008 preserves Scheduler selection and validates all eight native v1.1 proposals',async()=>{
 const {validateWorkerOutput}=await import('../scripts/production-worker.mjs');
 const p=read(base+'proposal.json'),a=read(base+'selection-audit.json');
 assert.deepEqual(p.candidate_ids,a.selection.map(x=>x.research_object_id));
 assert.deepEqual(a.selection.map(x=>x.source_form),['monstre','monster','presser','recognize','reconnaître','lumen','lux','pression']);
 for(const file of p.outputs){const o=read(file);assert.deepEqual(validateWorkerOutput(o).errors,[]);assert.equal(o.corpus_writeback,false);assert.equal(o.depth_status,'D2');assert.match(o.author_observation,/author unknown/);}
 assert.equal(read('data/candidates/production-corpus.v0.1.json').records.length,54);
});
test('Production 008 cannot promote incomplete Chinese history to D1 or remove Featured scope',async()=>{
 const {validateWorkerOutput}=await import('../scripts/production-worker.mjs');
 const o=read(base+'outputs/presser.json');
 const d=structuredClone(o);d.depth_status='D1';d.depth_record.entries[0].lexical_subclaim_depth_proposal='D1';
 assert.ok(validateWorkerOutput(d).errors.some(x=>/D1/.test(x)));
 const s=structuredClone(o);delete s.depth_record.entries[0].featured.scope;s.featured_summary=s.depth_record.entries[0].featured;
 assert.ok(validateWorkerOutput(s).errors.some(x=>/Featured/.test(x)));
 const c=structuredClone(o);c.depth_record.entries[0].relations[0].confirmed_chronology=true;
 assert.ok(validateWorkerOutput(c).errors.some(x=>/chronology/.test(x)));
});
test('Production 008 integrity and original observations survive checkout without provenance rewrite',async()=>{
 const m=read(base+'freeze-manifest.json');
 for(const [file,hash]of Object.entries(m.files))assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,base,file),'utf8').replace(/\r\n/g,'\n')).digest('hex'),hash,file);
 const {replay}=await import('../scripts/observation-registry.mjs');
 const registry=replay(read('research/observations/registry.v0.1.json')).observations;
 for(const o of read(base+'observations.json').observations){assert.deepEqual(o,registry.find(x=>x.observation_id===o.observation_id));assert.equal(o.origin_type,'unknown');}
});
test('Production 008 Pending review reserves objects without accepting or dispatching another batch',async()=>{
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');
 const {schedule}=await import('../scripts/queue-scheduler.mjs');
 const p=read(base+'proposal.json'),a=schedule(prepareSnapshot({root,at:'2026-10-12T00:00:00Z'}));
 assert.equal(a.selection.length,1);assert.equal(a.worker_runs,0);
 for(const x of a.selection)assert.ok(!p.candidate_ids.includes(x.research_object_id));
 assert.equal(p.accepted,false);assert.equal(p.publication_allowed,false);
});

test('Production 008 partial acceptance preserves original 52 and excludes all six Pending',async()=>{
 const a=read('research/production-state/acceptance-008.v1.json'),f=read('data/review/production-008-freeze.v0.1.json'),c=read('data/candidates/production-corpus.v0.1.json');
 const original=structuredClone(c);original.records=original.records.slice(0,52);
 assert.equal(createHash('sha256').update(JSON.stringify(original,null,2)+'\n').digest('hex'),a.preserved_active_prefix.sha256_utf8_lf);
 assert.deepEqual(f.records.map(r=>r.source_form),['presser','recognize']);
 assert.deepEqual(c.records.slice(52).map(r=>r.candidate_id),a.candidate_ids);
 for(const id of a.remaining_pending_ids)assert.ok(!c.records.some(r=>r.candidate_id===id));
 for(const r of f.records){assert.deepEqual(r.research_record,read(r.research_proposal_path));assert.equal(r.depth_status,'D2');assert.equal(r.phonetic_fit,'Low');assert.equal(r.historical_relation,'Not claimed');assert.equal(r.provenance,'Imported legacy / author unknown');assert.equal(r.editorial_boundary,r.research_record.featured_summary.scope);}
 const {validateProduction}=await import('../scripts/validate-production-candidates.mjs');
 for(const mutate of [r=>r.baseline_record.editorial_boundary='all senses',r=>r.baseline_record.depth_status='D1',r=>r.baseline_record.phonetic_fit='High',r=>r.baseline_record.origin='Jinkai Liu',r=>r.blockers=[],r=>r.publication_status='published']){const bad=structuredClone(c);mutate(bad.records[52]);assert.ok(validateProduction(bad,read('data/candidates/production-archive.v0.1.json')).length);}
 const {prepareSnapshot}=await import('../scripts/prepare-scheduler-snapshot.mjs');const {schedule}=await import('../scripts/queue-scheduler.mjs');
 const snapshot=prepareSnapshot({root,at:'partial-acceptance-test'}),audit=schedule(snapshot);
 for(const id of a.candidate_ids)assert.ok(snapshot.exclusions.completed_ids.includes(id));
 for(const id of [...a.candidate_ids,...a.remaining_pending_ids])assert.ok(!audit.selection.some(r=>r.research_object_id===id));
 assert.equal(audit.worker_runs,0);assert.equal(a.commit_authorized,false);assert.equal(a.push_authorized,false);assert.equal(a.deploy_authorized,false);assert.equal(a.production_009_experiment_authorized,false);
});
