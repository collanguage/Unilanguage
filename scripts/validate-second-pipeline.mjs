import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
const frozen=JSON.parse(fs.readFileSync(new URL('../data/review/second-pipeline-freeze.v1.json',import.meta.url),'utf8'));
export const pilotSlugs=Object.keys(frozen.entries);
// An editorial freeze is a reviewed contract, not a general-purpose truth engine.
// New evidence requires a new human-approved freeze, never an automatic promotion.
export function validateEditorial(dataset) {
 const errors=[];
 for(const slug of pilotSlugs) {
  const matches=dataset.entries.filter(e=>e.slug===slug);
  if(matches.length!==1){errors.push(`${slug}: missing/duplicate frozen entry`);continue;}
  const e=matches[0], contract=frozen.entries[slug];
  if(e.legacy_migration?.version!=='second-pipeline-0.1') errors.push(`${slug}: migration provenance missing`);
  for(const [key,value] of Object.entries(contract))
   if(!isDeepStrictEqual(e[key],value)) errors.push(`${slug}: ${key} violates approved evidence/editorial freeze`);
  for(const key of ['featured_mapping','name_analysis','cultural_associations','historical_etymology','related_words'])
   if(!(key in contract) && key in e) errors.push(`${slug}: unreviewed ${key}`);
  if(e.diachronic_semantic_mapping)errors.push(`${slug}: non-diachronic pilot must not acquire an unreviewed chronology`);
  if(e.historical_relation_status!=='Not claimed')errors.push(`${slug}: cross-language historical claim not authorized`);
  if(e.literary_layer?.is_historical_evidence!==false)errors.push(`${slug}: literature is not historical evidence`);
  for(const a of e.semantic_associations||[])if(a.is_etymological)errors.push(`${slug}: structural/cultural/literary association crossed into etymology`);
  const refs=new Set((e.references||[]).map(r=>r.reference_id));
  const visit=(value)=>{
   if(!value||typeof value!=='object')return;
   for(const [key,child] of Object.entries(value)) {
    if(key==='legacy_migration')continue; // Original research stays an archive.
    if(key==='source_refs'&&Array.isArray(child)) {
     for(const id of child)if(!refs.has(id))errors.push(`${slug}: unresolved reference ${id}`);
    }
    visit(child);
   }
  };
  visit(e);
 }
 return [...new Set(errors)];
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const dataset=JSON.parse(fs.readFileSync(new URL('../data/language-book.v1.0.json',import.meta.url),'utf8'));
 const errors=validateEditorial(dataset);
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Evidence / Editorial Validator: PASS (5 frozen entries; no automatic evidence promotion)');
}
