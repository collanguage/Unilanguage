const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
test('007 acceptance copies frozen results without evidence or publication promotion',async()=>{
 const proposal=read('research/production-state/pending/production-007/research-report.json');
 const freeze=read('data/review/production-007-freeze.v0.1.json');
 const corpus=read('data/candidates/production-corpus.v0.1.json');
 assert.equal(corpus.records.length,52);assert.equal(corpus.records.filter(r=>r.featured_mapping_status==='Candidate').length,13);
 for(const e of proposal.entries){const f=freeze.records.find(r=>r.candidate_id===e.candidate_id),c=corpus.records.find(r=>r.candidate_id===e.candidate_id);assert.deepEqual(f.research_record,e);assert.deepEqual(f.research_common,proposal.common);assert.equal(c.review_status,'candidate');assert.equal(c.publication_status,'not_published');assert.equal(f.phonetic_fit,'Low');assert.equal(f.origin,'unknown');}
 const {validateProduction}=await import('../scripts/validate-production-candidates.mjs');
 const archive=read('data/candidates/production-archive.v0.1.json');assert.deepEqual(validateProduction(corpus,archive),[]);
 for(const mutate of [r=>r.publication_status='published',r=>r.review_status='reviewed',r=>r.baseline_record.historical_relation='Established',r=>r.baseline_record.editorial_boundary='all senses',r=>r.blockers=[]]){const bad=structuredClone(corpus);mutate(bad.records.find(r=>r.source_word==='convenir'));assert.ok(validateProduction(bad,archive).length);}
 const {deriveState}=await import('../scripts/production-state.mjs');const s=deriveState(root,'test');assert.deepEqual(s.pending_freeze_batches,[]);assert.equal(s.eligible_queue_count,9);assert.equal(s.provenance_review_queue_count,5);assert.equal(s.last_accepted_batch,'Production 007');
});
