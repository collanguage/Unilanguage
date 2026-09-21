import fs from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
const freeze=JSON.parse(fs.readFileSync(new URL('../data/review/final-structural-freeze.v1.json',import.meta.url),'utf8'));
export const finalStructuralSlugs=Object.keys(freeze.entries);
// A scoped fixed editorial contract. Builds validate it; builds NEVER regenerate it.
export function validateFinalStructural(dataset, bundle=JSON.parse(fs.readFileSync(new URL('../data/evidence/etymology/light-lai.v0.1.json',import.meta.url),'utf8'))){
 const errors=[];
 for(const slug of finalStructuralSlugs){
  const matches=dataset.entries.filter(e=>e.slug===slug);
  if(matches.length!==1){errors.push(slug+': missing/duplicate frozen entry');continue;}
  const e=matches[0];
  if(!isDeepStrictEqual(e,freeze.entries[slug]))errors.push(slug+': active claims violate focused editorial freeze');
  if(e.featured_mapping||e.featured_mapping_status!=='Pending')errors.push(slug+': forced Featured winner');
  if(e.historical_relation_status!=='Not claimed')errors.push(slug+': cross-language history promotion');
  const refs=new Set(e.references.map(r=>r.reference_id));
  function visit(v){if(!v||typeof v!=='object')return;for(const[k,x]of Object.entries(v)){
   if(k==='legacy_migration')continue;
   if(k==='source_refs')for(const id of x||[])if(!refs.has(id))errors.push(slug+': unresolved '+id);
   visit(x);
  }}visit(e);
 }
 if(!isDeepStrictEqual(bundle,freeze.light_evidence_bundle))errors.push('light: evidence bundle violates frozen branch separation');
 return [...new Set(errors)];
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const d=JSON.parse(fs.readFileSync(new URL('../data/language-book.v1.0.json',import.meta.url),'utf8'));
 const errors=validateFinalStructural(d);if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Final structural Evidence / Editorial Validator: PASS (five bounded entries)');
}
