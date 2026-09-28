import fs from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
export function validateAcceptance(freeze,active,controls,completions,policy) {
 const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
 check(freeze.records.length===8 && freeze.approved_by==='Jinkai Liu','Freeze approval missing');
 const expectedActive=['abashed','meaning','horror','up','horrid','inside'];
 check(isDeepStrictEqual(controls.records.map(r=>r.source_form),['bound','law']),'Control scope changed');
 check(controls.not_archive===true && controls.not_active===true,'Control is not Archive or Active');
 check(policy.status==='Default Production Batch Selector' && policy.batch_size===8 && policy.automatic_dispatch===false,'Scheduler policy escalation');
 check(policy.stop_at==='Editorial Freeze Proposal' && policy.reviewer==='Jinkai Liu','Review gate bypass');
 check(isDeepStrictEqual(policy.forbidden,['featured_final_approval','reviewed','published','holdout_release','author_attribution']),'Forbidden powers changed');
 check(isDeepStrictEqual(policy.family_reuse_metrics,['historical_research_reused','sources_reused','new_research_avoided','conclusion_inheritance_blocked']),'Reuse metrics missing');
 check(completions.records.filter(r=>freeze.records.some(f=>f.candidate_id===r.candidate_id)).length===8,'Completed controls must not be rescheduled');
 for(const r of freeze.records){
  check(r.origin==='unknown provenance' && r.author_observation.author===null && r.authenticated_author_observation===null,'Unknown provenance promoted');
  check(r.historical_relation==='Not claimed' && r.candidates.every(c=>c.historical_relation==='Not claimed'),'Relation promoted');
  check(r.featured===({up:'上 shàng',inside:'内 nèi'}[r.source_form]||'Pending'),'Featured changed');
  if(['up','inside'].includes(r.source_form))check(r.phonetic_fit==='Low' && r.featured_type==='Structural-Semantic Candidate','Structural evidence promoted');
  const target=expectedActive.includes(r.source_form)?active.records.find(x=>x.candidate_id===r.candidate_id)?.baseline_record:controls.records.find(x=>x.candidate_id===r.candidate_id);
  check(isDeepStrictEqual(target,r),'Acceptance differs from freeze');
  if(!expectedActive.includes(r.source_form))check(!active.records.some(x=>x.candidate_id===r.candidate_id),'Control leaked into active');
  check(completions.records.some(x=>x.candidate_id===r.candidate_id && x.disposition===r.status && x.origin==='unknown'),'Completion/origin incorrect');
 }
 check(freeze.records.find(r=>r.source_form==='bound').historical_stages.length===4,'BOUND identities collapsed');
 return errors;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const errors=validateAcceptance(read('data/review/production-004-freeze.v0.1.json'),read('data/candidates/production-corpus.v0.1.json'),read('research/controls/production-004.v0.1.json'),read('research/scheduler/production-completions.v0.1.json'),read('research/scheduler/production-policy.v0.1.json'));
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Batch 004 acceptance / evidence / scheduler policy PASS: 6 Active + 2 Control');
}
