import fs from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
import {schedule,DIMENSIONS} from './queue-scheduler.mjs';

export function validateSchedulerAudit(snapshot,audit) {
  const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
  check(audit.scheduler_version==='0.1' && audit.mode==='dry_run','Wrong schema/mode');
  check(Number.isFinite(Date.parse(audit.timestamp)),'Timestamp required');
  check(audit.worker_runs===0 && audit.registry_mutations===0 && audit.publication_allowed===false,'Permission escalation');
  check(Array.isArray(audit.selection) && audit.selection.length<=8,'Invalid batch size');
  check(new Set(audit.selection.map(x=>x.research_object_id)).size===audit.selection.length,'Duplicate tasks');
  const denied=new Set([...snapshot.exclusions.benchmark_ids,...snapshot.exclusions.holdout_ids,...snapshot.exclusions.completed_ids,...snapshot.exclusions.archive_ids]);
  for(const t of audit.selection) {
    check(![t.research_object_id,...t.candidate_ids].some(id=>denied.has(id)),'Reserved/processed task selected');
    check(t.source_identity_gate.status==='Pass','Source identity gate bypass');
    check(['Lexical–Diachronic','Cultural–Structural–Literary'].includes(t.primary_pipeline),'Unsupported routing');
    check(t.stop_at==='Editorial Freeze Proposal' && t.requires_review_by==='Jinkai Liu' && t.dispatch_allowed===false,'Review/dispatch gate bypass');
    check(DIMENSIONS.every(d=>t.priority_dimensions[d]?.rating && t.priority_dimensions[d]?.rationale),'Missing dimension');
    check(!('featured' in t) && !('publication_status' in t) && !('evidence' in t),'Scheduler cannot adjudicate content');
  }
  check(isDeepStrictEqual(schedule(snapshot,{timestamp:audit.timestamp}),audit),'Audit is not reproducible from frozen queue snapshot');
  return errors;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
  const input=read('research/scheduler/batch004-input.v0.1.json'),audit=read('research/scheduler/batch004-dry-run.v0.1.json');
  const errors=validateSchedulerAudit(input,audit);
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  else console.log(`Scheduler schema + editorial audit PASS: ${audit.selection.length} proposals; ${audit.deferred.length} deferred; 0 workers/acceptance/publication.`);
}
