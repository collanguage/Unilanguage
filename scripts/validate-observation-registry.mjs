import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {digest, loadRegistry, replay, assertAppendOnly, productionTasks} from './observation-registry.mjs';

const registryPath='research/observations/registry.v0.1.json';
export function validateRegistry(root) {
  const registry=loadRegistry(`${root}/${registryPath}`),state=replay(registry);
  // A valid hash is insufficient: historical events must also match the
  // committed prefix. Deleted/rehashed history fails this independent gate.
  const tracked=execFileSync('git',['ls-tree','--name-only','HEAD','--',registryPath],{cwd:root,encoding:'utf8'}).trim();
  if(tracked) assertAppendOnly(JSON.parse(execFileSync('git',['show',`HEAD:${registryPath}`],{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024})),registry);
  const report=JSON.parse(fs.readFileSync(`${root}/research/observations/migration-report.v0.1.json`,'utf8'));
  for(const input of report.inputs) {
    if(digest(JSON.parse(fs.readFileSync(`${root}/${input.path}`,'utf8'))) !== input.sha256) throw Error(`Protected corpus changed: ${input.path}`);
  }
  for(const r of state.observations) {
    if(r.holdout_status === 'reserved' || r.ai_exposure_status === 'unexposed') throw Error('Private/unexposed observations must not enter tracked registry');
    if(r.provenance.intake_mode === 'migration') {
      const [file,pointer]=r.provenance.source_location.split('#');
      if(!report.inputs.some(x=>x.path===file)) throw Error('Migration outside allowlisted corpus');
      let raw=JSON.parse(fs.readFileSync(`${root}/${file}`,'utf8'));
      for(const part of pointer.slice(1).split('/'))raw=raw[part.replaceAll('~1','/').replaceAll('~0','~')];
      if((typeof raw === 'string'?raw:JSON.stringify(raw)) !== r.original_text) throw Error(`Original text mismatch: ${r.observation_id}`);
    }
  }
  const resolve=ref=>{
    const [file,pointer]=ref.split('#');
    if(!report.inputs.some(x=>x.path===file) || !pointer?.startsWith('/'))throw Error('Object reference outside allowlist');
    let value=JSON.parse(fs.readFileSync(`${root}/${file}`,'utf8'));
    for(const part of pointer.slice(1).split('/'))value=value?.[part.replaceAll('~1','/').replaceAll('~0','~')];
    if(value===undefined)throw Error(`Unresolved object reference ${ref}`);
  };
  for(const o of state.objects)resolve(o.source_ref);
  const counts={};for(const r of state.observations)counts[r.origin_type]=(counts[r.origin_type]||0)+1;
  return {observations:state.observations.length,origins:counts,objects:state.objects.length,production_tasks:productionTasks(registry).length};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) console.log('Observation schema + Evidence/Editorial gate PASS',JSON.stringify(validateRegistry(process.cwd())));
