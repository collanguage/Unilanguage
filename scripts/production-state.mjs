import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import {prepareSnapshot} from './prepare-scheduler-snapshot.mjs';
import {schedule} from './queue-scheduler.mjs';
import {replay} from './observation-registry.mjs';

export const STATE_VERSION='1.0';
// Git may convert CRLF/LF on checkout. Only line-ending representation is
// normalized; JSON values, raw observation strings and wording are untouched.
const digest=bytes=>createHash('sha256').update(bytes.toString('utf8').replace(/\r\n/g,'\n')).digest('hex');
export function deriveState(root,at) {
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const snapshot=prepareSnapshot({root,at}),audit=schedule(snapshot,{timestamp:at});
 const pending=read('research/production-state/pending-batches.v1.json');
 const registry=replay(read('research/observations/registry.v0.1.json'));
 const lock=read('research/production-state/preservation-lock.v1.json');
 const versions={};
 for(const name of ['validate-schema.mjs','validate-language-book-v1.mjs','validate-production-candidates.mjs','validate-observation-registry.mjs','validate-queue-scheduler.mjs','validate-production-004.mjs','production-state.mjs','prepare-scheduler-snapshot.mjs','queue-scheduler.mjs'])versions[name]={sha256:digest(fs.readFileSync(path.join(root,'scripts',name)))};
 return {version:STATE_VERSION,assembled_at:at,
  legacy_corpus:{version:'1.0',path:'data/language-book.v1.0.json',count:read('data/language-book.v1.0.json').entries.length},
  active_candidate_corpus:{version:'0.1',path:'data/candidates/production-corpus.v0.1.json',count:read('data/candidates/production-corpus.v0.1.json').records.length,status:'candidate; not Reviewed/Published'},
  archive_count:read('data/candidates/production-archive.v0.1.json').records.length,
  control_count:read('research/controls/production-004.v0.1.json').records.length,
  observation_registry:{version:'0.1',count:registry.observations.length,origins:registry.observations.reduce((a,r)=>(a[r.origin_type]=(a[r.origin_type]||0)+1,a),{})},
  scheduler_version:'0.1',last_accepted_batch:pending.last_accepted_batch || 'Production 004',
  pending_freeze_batches:pending.batches.map(b=>({batch_id:b.batch_id,status:b.status,count:b.candidate_ids.length,proposal_path:b.proposal_path})),
  eligible_queue_count:audit.selection.length+audit.deferred.filter(r=>r.reason.startsWith('Eligible;')).length,
  provenance_review_queue_count:audit.deferred.filter(r=>r.reason.startsWith('Provenance/Identity Queue:')).length,
  identity_resolution_counts:read('research/observations/mixed-form-resolution-v1/resolution.json').counts,
  benchmark_status:'Designed / Frozen / Execution Pending Isolated Evaluator',
  benchmark_reservations:snapshot.exclusions.benchmark_ids.length,
  holdout_status:read('research/production-state/reservations.v1.json').holdout_status,
  registered_holdout_ids:snapshot.exclusions.holdout_ids.length,
  private_assets_manifest:'research/production-state/external-assets.v1.json',
  latest_production_commit:{mode:'resolve from Git history, avoiding self-referential commit hash',command:'git log -1 --format=%H -- research/production-state/manifest.v1.json',previous_production_commit:lock.previous_production_commit},
  validator_versions:versions,input_hashes:snapshot.sources,
  next_action:pending.next_action,automatic_dispatch:false,review_gate:'Jinkai Liu',
  runtime_external_work_dependencies:[],private_recovery:'Private benchmark contents cannot be recovered from Git; custodian backup required. Production scheduling does not read them.'};
}
export function validateState(root) {
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const errors=[],check=(ok,m)=>{if(!ok)errors.push(m);};
 const stored=read('research/production-state/manifest.v1.json');
 check(isDeepStrictEqual(stored,deriveState(root,stored.assembled_at)),'State manifest stale or altered; regenerate only after authorized state changes');
 const lock=read('research/production-state/preservation-lock.v1.json');
 for(const [p,hash] of Object.entries({...lock.unchanged_files,...lock.imported_files}))check(digest(fs.readFileSync(path.join(root,p)))===hash,`Preserved content changed: ${p}`);
 const seed=read('research/production-state/queue-seed.v1.json'),reservation=read('research/production-state/reservations.v1.json');
 const safe=['candidate_id','research_object_id','input_channel','queue_order','benchmark_status'];
 for(const row of seed.items) {
  if(reservation.benchmark_ids.includes(row.candidate_id))check(Object.keys(row).every(k=>safe.includes(k)),'Reserved seed leaked source/target context');
  for(const key of ['original_text','proposed_mapping','author_reasoning','reasoning_raw','featured'])check(!(key in row),'Target field in scheduler seed');
 }
 const pending=read('research/production-state/pending-batches.v1.json');
 const snapshot=prepareSnapshot({root,at:stored.assembled_at}),audit=schedule(snapshot,{timestamp:stored.assembled_at});
 for(const b of pending.batches) {
  check(b.accepted===false&&b.status==='awaiting_jinkai_review','Pending batch promoted without acceptance');
  check(fs.existsSync(path.join(root,b.proposal_path)),'Missing durable pending proposal');
  for(const id of b.candidate_ids)check(!audit.selection.some(r=>r.candidate_ids.includes(id)),'Pending item rescheduled');
 }
 return errors;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const root=fileURLToPath(new URL('..',import.meta.url));
 if(process.argv[2]==='--write') {
  fs.writeFileSync(path.join(root,'research/production-state/manifest.v1.json'),JSON.stringify(deriveState(root,new Date().toISOString()),null,2)+'\n');
  console.log('State manifest assembled; no research or acceptance');
 } else {
  const errors=validateState(root);
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  else console.log('Production state PASS: repository-only inputs, preserved conclusions, pending/holdout boundaries');
 }
}
