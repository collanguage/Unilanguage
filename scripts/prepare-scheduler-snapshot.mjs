import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {registryQueueProjection} from './queue-scheduler.mjs';

// Repository-only state adapter. No raw inventory, private target or Work path.
export function prepareSnapshot({root,at}) {
  const sources=[];
  const read=file=>{const text=fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');sources.push({file,sha256:createHash('sha256').update(text).digest('hex'),hash_algorithm:'sha256-utf8-lf'});return JSON.parse(text);};
  const seed=read('research/production-state/queue-seed.v1.json');
  const reservations=read('research/production-state/reservations.v1.json');
  const pending=read('research/production-state/pending-batches.v1.json');
  const legacy=read('data/language-book.v1.0.json');
  const active=read('data/candidates/production-corpus.v0.1.json');
  const archive=read('data/candidates/production-archive.v0.1.json');
  const controls=read('research/controls/production-004.v0.1.json');
  const registry=read('research/observations/registry.v0.1.json');
  const completions=read('research/scheduler/production-completions.v0.1.json');
  if(!Array.isArray(reservations.benchmark_ids)||!Array.isArray(reservations.holdout_ids)||!Array.isArray(pending.batches))throw Error('Missing reservation/pending state; fail closed');
  const pendingIds=new Set(pending.batches.filter(b=>b.status==='awaiting_jinkai_review').flatMap(b=>b.candidate_ids));
  const reserved=new Set([...reservations.benchmark_ids,...reservations.holdout_ids]);
  const items=seed.items.map(row=>{
    if(reserved.has(row.candidate_id)||reserved.has(row.research_object_id))return {candidate_id:row.candidate_id,research_object_id:row.research_object_id,input_channel:'research_queue',queue_order:row.queue_order,benchmark_status:reservations.benchmark_ids.includes(row.candidate_id)?'reserved':undefined,holdout_status:'reserved'};
    const item=structuredClone(row);
    if(pendingIds.has(item.candidate_id)||pendingIds.has(item.research_object_id))item.research_status='review_pending';
    return item;
  });
  const projected=registryQueueProjection(registry).map(x=>({...x,input_channel:x.observations.some(o=>o.origin_type==='ai_discovery')?'ai_discovery_pool':'observation_registry'}));
  for(const item of projected)if(pendingIds.has(item.candidate_id))item.research_status='review_pending';
  items.push(...projected);
  return {version:'0.1',snapshot_id:`PRODUCTION-QUEUE-${at}`,batch_name:'Production selection — proposal only',captured_at:at,sources,
    exclusions:{benchmark_ids:reservations.benchmark_ids,holdout_ids:reservations.holdout_ids,
      completed_ids:[...new Set([...seed.prior_processed_ids,...completions.records.map(x=>x.candidate_id),...active.records.map(x=>x.candidate_id),...controls.records.map(x=>x.candidate_id),...legacy.entries.map(x=>`legacy:${x.id}`)])],
      archive_ids:archive.records.map(x=>x.candidate_id)},items,
    scope_notes:['Repository-only scheduling inputs; no Work output dependency.','Pending proposals are excluded without accepting or archiving them.','Private target contents remain external; custodian must register opaque IDs before any new protected intake.','No research, acceptance, author attribution or publication executed.']};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2);
  if(args.length!==1)throw Error('Usage: prepare-scheduler-snapshot.mjs NEW_SNAPSHOT_FILE (repository-only; old OUTPUTS_DIR argument removed)');
  const root=fileURLToPath(new URL('..',import.meta.url)),out=path.resolve(root,args[0]);
  const snapshot=prepareSnapshot({root,at:new Date().toISOString()});
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
  console.log(`Repository-only snapshot: ${snapshot.items.length} rows; no research executed`);
}
