import {digest, replay} from './observation-registry.mjs';

export const SCHEDULER_VERSION='0.1';
export const DIMENSIONS=['Research Value','Evidence Availability','Protocol Relevance','Novelty','Counterexample Value','Product/Mapper Value','Research Risk','Provenance Confidence'];
const pipelines=['Lexical–Diachronic','Cultural–Structural–Literary'];
const text=v=>typeof v==='string' && v.trim().length>0;
const known=v=>text(v) && !/^(unknown|unresolved|undetermined|pending|not recorded)(\b|$)/i.test(v);
const unique=a=>[...new Set(a)];
const sortText=(a,b)=>a<b?-1:a>b?1:0;
const ratings=['High','Medium','Low','Unknown'];
const cleanDimension=x=>({rating:ratings.includes(x?.rating)?x.rating:'Unknown',rationale:text(x?.rationale)?x.rationale:'No assessment supplied; not inferred by Scheduler.'});

// Trusted intake projection. The Scheduler/Worker consumes this metadata, not
// a private registry file. Reserved/unexposed records export opaque IDs only.
export function registryQueueProjection(registry, descriptors={}) {
  const {observations}=replay(registry), items=[];
  for(const r of observations) {
    const ids=r.linked_candidate_ids.length?r.linked_candidate_ids:[`intake:${r.observation_id}`];
    for(const id of ids) {
      const guarded=r.holdout_status==='reserved' || r.ai_exposure_status==='unexposed';
      const base={candidate_id:id,research_object_id:id,input_channel:'observation_registry',
        observation_ids:[r.observation_id],holdout_status:r.holdout_status,ai_exposure_status:r.ai_exposure_status,
        research_status:r.research_status,observations:[{observation_id:r.observation_id,origin_type:r.origin_type,
          author:guarded?null:r.author,authorship_verified:r.provenance.authorship_verified===true}]};
      if(guarded) {items.push(base);continue;}
      const d=descriptors[id]||{};
      items.push({...d,...base,source_form:r.source_form,source_language:r.source_language,
        provenance:[{source_location:r.provenance.source_location}],created_at:r.created_at});
    }
  }
  return items;
}

export function identityGate(item) {
  const missing=[];
  for(const key of ['source_form','source_language','lexical_identity','meaning_context']) if(!known(item[key]))missing.push(key);
  if(text(item.source_language) && item.source_language.includes('/'))missing.push('single source-language identity');
  if(text(item.source_form) && item.source_form.includes('/'))missing.push('single lexical/root identity');
  if(!Array.isArray(item.provenance) || !item.provenance.some(p=>text(p.source_location)))missing.push('provenance');
  return {status:missing.length?'Provenance/Identity Queue':'Pass',missing,
    scope:'Intake completeness only; not independent lexical/etymological verification'};
}

function route(item) {
  if(pipelines.includes(item.primary_pipeline))return item.primary_pipeline;
  const types=item.mapping_types||[];
  const lexical=types.some(x=>['lexical','diachronic','phonetic_hypothesis'].includes(x));
  const structural=types.some(x=>['structural','transformation','symbolic','cultural','literary','protocol','proper_name','experimental'].includes(x));
  return lexical===structural?'Routing Pending':lexical?pipelines[0]:pipelines[1];
}
function origins(items) {
  const map=new Map();
  for(const item of items) for(const o of item.observations||[]) {
    let type=o.origin_type;
    if(type==='jinkai_original' && (o.author!=='Jinkai Liu'||!o.authorship_verified))type='unknown';
    if(type==='contributor' && (!text(o.author)||o.author==='Jinkai Liu'||!o.authorship_verified))type='unknown';
    if(!['jinkai_original','contributor','ai_discovery','unknown'].includes(type))type='unknown';
    // Same observation ID cannot change authors across input adapters.
    const previous=map.get(o.observation_id);
    if(previous && (previous.origin_type!==type || previous.author!==(type==='unknown'?null:o.author)))throw Error('Conflicting observation attribution');
    map.set(o.observation_id,{observation_id:o.observation_id,origin_type:type,author:type==='unknown'?null:o.author});
  }
  if(!map.size)map.set('unresolved',{observation_id:null,origin_type:'unknown',author:null});
  const values=[...map.values()],types=unique(values.map(x=>x.origin_type));
  const labels={jinkai_original:'Jinkai Liu observation',contributor:'Contributor observation',ai_discovery:'AI discovery',unknown:'unknown provenance'};
  return {label:types.length>1?'multiple origins':labels[types[0]],types,observations:values};
}

// Pure, dry-run-only planner: no tools, filesystem writes, registry mutation,
// research calls, evidence writes, holdout release or acceptance capability.
export function schedule(snapshot,{batchSize=8,timestamp=new Date().toISOString()}={}) {
  if(batchSize!==8)throw Error('v0.1 dry run is fixed at eight; explicit future policy revision required');
  if(!snapshot?.exclusions || !Array.isArray(snapshot.items))throw Error('Exclusion manifest and queue snapshot required');
  for(const k of ['benchmark_ids','holdout_ids','completed_ids','archive_ids'])if(!Array.isArray(snapshot.exclusions[k]))throw Error(`Missing ${k}; fail closed`);
  const ex=snapshot.exclusions,groups=new Map(),deferred=[],eligible=[];
  for(const item of snapshot.items) {
    if(!text(item.candidate_id)||!text(item.research_object_id))throw Error('Explicit candidate/object identity required');
    if(!groups.has(item.research_object_id))groups.set(item.research_object_id,[]);
    groups.get(item.research_object_id).push(item);
  }
  for(const [id,items] of groups) {
    const ids=unique(items.flatMap(x=>[x.candidate_id,x.research_object_id,...(x.alias_ids||[])]));
    const has=list=>ids.some(x=>list.includes(x));
    // Exclusion precedence and object-level taint prevent a duplicate row from
    // laundering a reserved target back into Production. No sensitive strings
    // or content digests appear in these audit rows.
    let denial=null;
    if(has(ex.benchmark_ids)||items.some(x=>x.benchmark_status==='reserved'))denial='Frozen benchmark exclusion';
    else if(has(ex.holdout_ids)||items.some(x=>['reserved','future_holdout'].includes(x.holdout_status)))
      denial=items.some(x=>['exposed_to_ai','post_ai_observation'].includes(x.ai_exposure_status))?'Holdout anomaly: exposed but still reserved':'Holdout reserved';
    else if(items.some(x=>x.ai_exposure_status==='unexposed'))denial='Holdout decision pending; explicit human production consent required';
    else if(items.some(x=>!['not_eligible','revealed'].includes(x.holdout_status)))denial='Holdout decision unknown; fail closed';
    else if(has(ex.archive_ids)||items.some(x=>x.research_status==='archived'))denial='Archive: explicit human reopen required (not implemented by Scheduler)';
    else if(has(ex.completed_ids)||items.some(x=>['accepted_reference','completed','freeze_proposal','review_pending'].includes(x.research_status)))denial='Already processed / review pending';
    else if(items.some(x=>x.research_status==='research'))denial='Research already in progress';
    else if(items.some(x=>x.research_status!=='queued'))denial='Research status unresolved; intake review required';
    else if(items.some(x=>x.duplicate_of))denial='Duplicate research scope; existing object retained';
    else if(items.some(x=>!['exposed_to_ai','post_ai_observation'].includes(x.ai_exposure_status)))denial='Exposure status unknown; intake decision required';
    if(denial){deferred.push({research_object_id:id,candidate_ids:ids,reason:denial});continue;}
    const item=items[0], composition=origins(items);
    const conflicts=['source_form','source_language','lexical_identity','meaning_context','primary_pipeline'].filter(key=>unique(items.map(x=>x[key]).filter(text)).length>1);
    const merged={...item};
    for(const key of ['source_form','source_language','lexical_identity','meaning_context','primary_pipeline'])merged[key]=items.map(x=>x[key]).find(text) ?? null;
    merged.provenance=items.flatMap(x=>x.provenance||[]);
    const gate=identityGate(merged),primary=route(merged);
    const dimensions=Object.fromEntries(DIMENSIONS.map(k=>[k,cleanDimension(merged.priority_dimensions?.[k])]));
    const clean={research_object_id:id,candidate_ids:ids,source_form:merged.source_form,source_language:merged.source_language,
      lexical_identity:merged.lexical_identity,meaning_context:merged.meaning_context,origin_composition:composition,
      observation_ids:unique(items.flatMap(x=>x.observation_ids||[])),primary_pipeline:primary,
      priority_dimensions:dimensions,source_identity_gate:gate,benchmark_holdout_status:'Cleared against supplied exclusion snapshot; production-exposed, not blind-eligible',
      input_channels:unique(items.map(x=>x.input_channel)),queue_order:Math.min(...items.map(x=>Number.isFinite(x.queue_order)?x.queue_order:Number.MAX_SAFE_INTEGER)),
      created_at:items.map(x=>x.created_at).filter(text).sort()[0]||null,
      sampling_role:items.some(x=>['control','negative','high_uncertainty'].includes(x.sampling_role))?'control_or_uncertain':'ordinary',
      provenance:merged.provenance};
    if(conflicts.length){deferred.push({...clean,reason:`Provenance/Identity Queue: conflicting metadata ${conflicts.join(', ')}`});continue;}
    if(gate.status!=='Pass'){deferred.push({...clean,reason:`Provenance/Identity Queue: missing ${gate.missing.join(', ')}`});continue;}
    if(primary==='Routing Pending'){deferred.push({...clean,reason:'Routing Pending: no unambiguous approved primary pipeline'});continue;}
    eligible.push(clean);
  }
  // No sum. Human quota uses oldest receipt first; all other ties preserve
  // persisted queue order and then explicit object ID. No target-fit ranking.
  const order=(a,b)=>a.queue_order-b.queue_order || sortText(a.created_at||'9999',b.created_at||'9999') || sortText(a.research_object_id,b.research_object_id);
  eligible.sort(order);
  const selected=[],selectedIds=new Set();
  const pick=(pool,n,reason)=>{
    for(const x of pool){if(n===0||selected.length===batchSize)break;if(selectedIds.has(x.research_object_id))continue;
      selected.push({...x,why_selected:reason,task_status:'dry_run_proposal',stop_at:'Editorial Freeze Proposal',requires_review_by:'Jinkai Liu',dispatch_allowed:false});selectedIds.add(x.research_object_id);n--;}
  };
  const human=x=>x.origin_composition.types.some(t=>['jinkai_original','contributor'].includes(t));
  const ai=x=>x.origin_composition.types.includes('ai_discovery');
  // Keep two AI-only slots available before filling human slots. Multiple-origin
  // items keep every origin but consume only one slot.
  pick(eligible.filter(x=>ai(x)&&!human(x)),2,'AI composition allocation; persisted queue order');
  pick(eligible.filter(human).sort((a,b)=>sortText(a.created_at||'9999',b.created_at||'9999')||order(a,b)),4,'Human/contributor allocation; oldest receipt first');
  pick(eligible.filter(x=>x.sampling_role==='control_or_uncertain'),2,'Control/uncertainty allocation; preserve negative research value');
  // Vacant quotas are not invented. Alternate existing pipelines for backfill.
  while(selected.length<batchSize){const before=selected.length;for(const p of pipelines)pick(eligible.filter(x=>x.primary_pipeline===p),1,'Unfilled composition slots; pipeline-balanced backfill in persisted queue order');if(selected.length===before)break;}
  for(const x of eligible)if(!selectedIds.has(x.research_object_id))deferred.push({...x,reason:'Eligible; deferred by eight-item capacity and transparent composition/backfill order'});
  return {scheduler_version:SCHEDULER_VERSION,mode:'dry_run',timestamp,batch_name:'Production Batch 004 — proposal only',
    queue_snapshot:{snapshot_id:snapshot.snapshot_id,scheduling_view_sha256:digest({eligible,deferred}),item_rows:snapshot.items.length,research_objects:groups.size,sources:snapshot.sources||[]},
    rules:{batch_size:8,preferred_slots:{human:4,ai:2,control_or_uncertain:2},ranking:'Human oldest-receipt; otherwise persisted queue order then stable object ID. Separate dimensions are descriptive; no aggregate score.',backfill:'Alternate approved pipelines; no quota fabrication'},
    selection:selected,deferred,
    holdout_exclusions:deferred.filter(x=>/Holdout|holdout|Exposure/.test(x.reason)).map(x=>({research_object_id:x.research_object_id,reason:x.reason})),
    benchmark_exclusions:deferred.filter(x=>x.reason==='Frozen benchmark exclusion').map(x=>({research_object_id:x.research_object_id,reason:x.reason})),
    composition:{human:selected.filter(human).length,ai:selected.filter(ai).length,control_or_uncertain:selected.filter(x=>x.sampling_role==='control_or_uncertain').length,unknown:selected.filter(x=>x.origin_composition.types.includes('unknown')).length,
      note:'Composition dimensions can overlap; observations are not relabeled to fill quotas.'},
    shortfall:8-selected.length,worker_runs:0,registry_mutations:0,publication_allowed:false};
}
