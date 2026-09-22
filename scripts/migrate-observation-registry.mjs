import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {append, digest, emptyRegistry, observation, replay, saveRegistry} from './observation-registry.mjs';

// Deliberately restricted to the calibrated corpus and the two accepted
// production freezes. No inventory, benchmark key or hidden package is read.
export function migrate(root, at) {
  let registry = emptyRegistry();
  const commit = execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
  const inputs = [];
  const read = name => { const bytes=fs.readFileSync(`${root}/${name}`); const data=JSON.parse(bytes); inputs.push({path:name,sha256:digest(data)}); return data; };
  const event = (kind,payload) => { registry=append(registry,kind,payload,'conservative_migration',at); };
  const object = (id,kind,source_ref) => event('object',{id,kind,source_ref});
  const add = ({text,ref,form,language,candidate,mappings=[],ai=null,archived=false}) => {
    if(typeof text !== 'string' || !text.trim()) return;
    const id=`OBS-${digest({ref,text}).slice(0,24)}`;
    const r=observation({observation_id:id,origin_type:ai?'ai_discovery':'unknown',author:ai?'AI research worker':null,
      original_text:text,source_form:form,source_language:language || 'unknown',
      proposed_mapping:null,reasoning_raw:'',source_date:null,
      provenance:{source_location:ref,repository_commit:commit,authorship_verified:false,
        attribution_basis:ai?'Frozen Production AI research; exact model and independent-discovery status not recorded.':'Exact repository text preserved. Repository author labels and editorial paraphrases do not authenticate original authorship.',intake_mode:'migration'},
      ai_exposure_status:ai?'post_ai_observation':'exposed_to_ai',research_status:archived?'archived':'accepted_reference',
      ai_discovery:ai,evidence_status:'Pending — attribution is not lexical evidence'},at);
    event('ingest',r); event('link',{observation_id:id,object_id:candidate});
    for(const mapping of mappings) event('link',{observation_id:id,object_id:mapping});
  };
  const legacyPath='data/language-book.v1.0.json';
  const legacy=read(legacyPath);
  const missing=[];
  legacy.entries.forEach((r,i)=>{
    const ref=`${legacyPath}#/entries/${i}`,id=`legacy:${r.id}`;
    object(id,'candidate',ref);
    // Linking to the entry records context, not endorsement of every mapping.
    if(r.source?.raw_note) add({text:r.source.raw_note,ref:`${ref}/source/raw_note`,form:r.slug||r.id,language:'See linked multilingual legacy entry',candidate:id});
    else missing.push({id,reason:'No source.raw_note; no original note invented'});
  });
  for(const name of ['data/candidates/production-corpus.v0.1.json','data/candidates/production-archive.v0.1.json']) {
    const data=read(name);
    data.records.forEach((record,i)=>{
      const r=record.baseline_record, ref=`${name}#/records/${i}/baseline_record`,id=record.candidate_id;
      const archived=record.review_status==='archived';
      object(id,'candidate',`${name}#/records/${i}`);
      const a=r.author_observation||{};
      let rawCount=0;
      for(const key of ['original','imported_editorial_observations','imported_expanded_wording_preserved']) {
        (a[key]||[]).forEach((text,j)=>{rawCount++;add({text,ref:`${ref}/author_observation/${key}/${j}`,form:record.source_word,language:r.source_language,candidate:id,archived});});
      }
      if(r.imported_prior_observation) {
        const texts=Array.isArray(r.imported_prior_observation)?r.imported_prior_observation:[r.imported_prior_observation];
        texts.forEach((text,j)=>{rawCount++;add({text:typeof text==='string'?text:JSON.stringify(text),ref:`${ref}/imported_prior_observation${Array.isArray(r.imported_prior_observation)?'/'+j:''}`,form:record.source_word,language:r.source_language,candidate:id,archived});});
      }
      if(!rawCount) missing.push({id,reason:'No original or imported observation text; AI result linked separately'});
      const mappings=(r.candidates||[]).map((c,j)=>{
        const mapping=`mapping:${id}:${j}`; object(mapping,'mapping',`${ref}/candidates/${j}`); return mapping;
      });
      if(mappings.length) add({text:JSON.stringify(r.candidates),ref:`${ref}/candidates`,form:record.source_word,language:r.source_language,candidate:id,mappings,archived,
        ai:{run_reference:record.source_provenance,model:'unknown — not recorded in freeze',generation_method:'Production research (imported frozen result)',input_scope:'Author-aware production; not blind discovery',candidate:JSON.stringify(r.candidates),controls:r.controls||[],counterexamples:r.counterexamples||[],independence_status:'Not claimed'}});
    });
  }
  const state=replay(registry),origins={jinkai_original:0,contributor:0,ai_discovery:0,unknown:0};
  for(const r of state.observations)origins[r.origin_type]++;
  return {registry,report:{version:'0.1',at,repository_commit:commit,inputs,observation_count:state.observations.length,origins,
    object_count:state.objects.length,mapping_count:state.objects.filter(x=>x.kind==='mapping').length,
    missing_raw_notes:missing,holdouts_imported:0,benchmark_packages_read:0,
    boundary:'Migration is repository-text preservation, not authentication of original authorship. No historical unexposed state is inferred. Different source occurrences remain separate; no claim of independent origin.',
    corpus_counts:{legacy:legacy.entries.length,active:14,archive:2}}};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const root=process.cwd(), file=`${root}/research/observations/registry.v0.1.json`;
  if(fs.existsSync(file)) throw Error('One-time migration already exists; use append-only intake, never overwrite');
  const {registry,report}=migrate(root,new Date().toISOString());
  saveRegistry(file,registry);
  fs.writeFileSync(`${root}/research/observations/migration-report.v0.1.json`,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({count:report.observation_count,origins:report.origins}));
}
