import fs from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
const freeze=JSON.parse(fs.readFileSync(new URL('../data/review/final-lexical-freeze.v1.json',import.meta.url),'utf8'));
export const finalLexicalSlugs=Object.keys(freeze.entries);
// A fixed review contract guards scoped claims. Publication must never regenerate it.
export function validateFinalLexical(dataset){
 const errors=[];
 for(const slug of finalLexicalSlugs){
  const matches=dataset.entries.filter(e=>e.slug===slug);
  if(matches.length!==1){errors.push(`${slug}: missing/duplicate frozen entry`);continue;}
  const e=matches[0];
  for(const [key,value] of Object.entries(freeze.entries[slug]))
   if(!isDeepStrictEqual(e[key],value))errors.push(`${slug}: ${key} violates focused review freeze`);
  if(e.featured_mapping)errors.push(`${slug}: Featured Pending cannot acquire a winner`);
  if(e.legacy_migration?.version!=='final-lexical-0.1')errors.push(`${slug}: missing migration provenance`);
  const refs=new Set(e.references.map(r=>r.reference_id));
  function visit(v){if(!v||typeof v!=='object')return;for(const[k,x]of Object.entries(v)){
   if(k==='legacy_migration')continue;
   if(['source_refs','run_refs'].includes(k))for(const id of x||[])if(!refs.has(id))errors.push(`${slug}: unresolved ${id}`);
   visit(x);
  }}visit(e);
 }
 return [...new Set(errors)];
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const d=JSON.parse(fs.readFileSync(new URL('../data/language-book.v1.0.json',import.meta.url),'utf8'));
 const errors=validateFinalLexical(d);
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Final lexical Evidence / Editorial Validator: PASS (four entries; Featured Pending)');
}
