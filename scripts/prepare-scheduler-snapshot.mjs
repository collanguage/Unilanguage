import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {DIMENSIONS,registryQueueProjection} from './queue-scheduler.mjs';

// Custodian-side adapter. It never opens hidden packages. ID-only reservation
// metadata is applied before any source context or author fields are projected.
export function prepareSnapshot({outputs,root,at}) {
  const sources=[];
  const read=(base,file)=>{const bytes=fs.readFileSync(path.join(base,file));sources.push({file,sha256:createHash('sha256').update(bytes).digest('hex')});return JSON.parse(bytes);};
  const prior=read(outputs,'production-research-batch-003/selection-manifest.json');
  const isolation=read(outputs,'production-research-queue-batch-001/isolation-manifest.json');
  const inventory=read(outputs,'production-pipeline-v0.1/deduplicated-candidate-inventory.json');
  const legacy=read(root,'data/language-book.v1.0.json');
  const active=read(root,'data/candidates/production-corpus.v0.1.json');
  const archive=read(root,'data/candidates/production-archive.v0.1.json');
  const registry=read(root,'research/observations/registry.v0.1.json');
  const benchmark_ids=[...new Set([...prior.reserved_ids,...Object.keys(isolation.excluded_inventory_ids)])];
  const completedForms=new Set([...prior.prior_discovery_exclusions,...prior.processed_production_forms,...prior.selected.map(x=>x.source_form)].map(x=>x.toLowerCase()));
  const completed_ids=[...active.records.map(x=>x.candidate_id),...prior.selected.map(x=>x.candidate_id),...legacy.entries.map(x=>`legacy:${x.id}`)];
  const archive_ids=archive.records.map(x=>x.candidate_id),items=[];
  const dimensionKey={'Novelty':'Candidate Novelty','Product/Mapper Value':'Product / Mapper Value'};
  inventory.candidates.forEach((r,index)=>{
    const id=r.candidate_id,base={candidate_id:id,research_object_id:id,input_channel:'research_queue',queue_order:index};
    if(benchmark_ids.includes(id)){items.push({...base,benchmark_status:'reserved'});return;}
    if(completedForms.has(r.source_word_form.toLowerCase()))completed_ids.push(id);
    const imported=(r.imported_observations||[]).flatMap(x=>{try{return [JSON.parse(x)];}catch{return [];}});
    // Existing English standard gloss/context only. No Chinese match, author
    // reasoning, hypotheses or prior Featured is used to infer source identity.
    const context=imported.map(x=>x.lexical_meaning?.en||x.meaning||x.relation_to_entry?.en).find(x=>typeof x==='string')||null;
    const negative=(r.provenance||[]).some(x=>x.json_pointer?.includes('/negative_controls/'))||imported.some(x=>x.relationship_type==='surface similarity');
    const duplicate=r.source_word_form.match(/^(gun|gin|gen)$/)?'GAN archived raw sound-string':r.source_word_form==='爱在，世界就在'?'Legacy AT literary observation':null;
    const provenance=(r.provenance||[]).map(p=>({source_location:`${p.path}#${p.json_pointer}`,repository_commit:p.repository_commit}));
    const priority_dimensions=Object.fromEntries(DIMENSIONS.map(k=>[k,k==='Provenance Confidence'?{rating:'Low',rationale:'Traceable repository extraction; original authorship not authenticated.'}:r.priority_dimensions?.[dimensionKey[k]||k]||{rating:'Unknown',rationale:'No intake assessment'}]));
    items.push({...base,source_form:r.source_word_form,source_language:r.language,
      lexical_identity:context && !r.source_word_form.includes('/')?`${r.language} lexical item: ${r.source_word_form}; scope is the recorded context`:null,
      meaning_context:context,provenance,priority_dimensions,
      primary_pipeline:r.primary_pipeline==='Pipeline 1 — Lexical–Diachronic'?'Lexical–Diachronic':r.primary_pipeline==='Pipeline 2 — Cultural–Structural–Literary'?'Cultural–Structural–Literary':null,
      observations:[{observation_id:`inventory:${id}`,origin_type:'unknown',author:null,authorship_verified:false}],observation_ids:[`inventory:${id}`],
      ai_exposure_status:'exposed_to_ai',holdout_status:'not_eligible',research_status:'queued',
      sampling_role:negative?'negative':'ordinary',created_at:null,
      benchmark_eligibility:'Benchmark-ineligible after production exposure',duplicate_of:duplicate});
  });
  // Registry already contains the frozen AI Discovery pool: it is not copied
  // into a new origin or reclassified as human. All currently processed items
  // stay excluded. A future active AI observation uses the same API.
  const projected=registryQueueProjection(registry);
  items.push(...projected.map(x=>({...x,input_channel:x.observations.some(o=>o.origin_type==='ai_discovery')?'ai_discovery_pool':'observation_registry'})));
  const snapshot={version:'0.1',snapshot_id:'PRODUCTION-SCHEDULER-DRY-004',captured_at:at,sources,
    exclusions:{benchmark_ids,holdout_ids:[],completed_ids:[...new Set(completed_ids)],archive_ids:[...new Set(archive_ids)]},items,
    scope_notes:[
      'Frozen reservation IDs inherited conservatively from approved Production isolation manifest; no hidden packages opened.',
      'No populated Future Holdout file supplied. Registry projection independently excludes unexposed/reserved observations. New deployment must refresh exclusion metadata before each run.',
      'Inventory observations are references to old extraction occurrences, not newly authenticated human or independently generated AI origins.',
      'Source completeness uses existing standard gloss/context. Research and etymological verification have NOT run.',
      'Three completed Production batches and prior discovery forms excluded; Batch 003 remains awaiting review, not accepted by this run.'
    ]};
  return snapshot;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const [outputs,out]=process.argv.slice(2);
  if(!outputs||!out)throw Error('Usage: prepare-scheduler-snapshot.mjs OUTPUTS_DIR NEW_SNAPSHOT_FILE');
  const snapshot=prepareSnapshot({outputs,root:process.cwd(),at:new Date().toISOString()});
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
  console.log(`Sanitized snapshot: ${snapshot.items.length} rows; no research executed`);
}
