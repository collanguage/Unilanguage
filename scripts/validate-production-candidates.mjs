import fs from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
const read = name => JSON.parse(fs.readFileSync(new URL('../'+name,import.meta.url),'utf8'));
const freezes = ['data/review/production-001-freeze.v0.1.json', 'data/review/production-002-freeze.v0.1.json'].map(path => ({path, records:read(path).records}));
export function validateProduction(active, archive) {
 const errors=[];
 const check=(condition,message)=>{if(!condition)errors.push(message);};
 const expected=freezes.flatMap(f=>f.records.map(record=>({record,path:f.path})));
 const archivedRecord=r=>r.status.startsWith('Archive');
 const ids=new Set();
 for (const [batch,id,count,archived] of [[active,'PRODUCTION-CANDIDATE-001',14,false],[archive,'PRODUCTION-ARCHIVE-001',2,true]]) {
  check(batch?.batch_id===id,'wrong corpus identity');
  for(const key of ['created_at','created_by','review_status','source_note'])check(typeof batch?.[key]==='string' && batch[key].length>0,`missing envelope ${key}`);
  check(batch?.review_status==='candidate','envelope cannot promote review');
  check(Array.isArray(batch?.records)&&batch.records.length===count,'wrong record count');
  for(const r of batch?.records || []) {
   check(!ids.has(r.candidate_id),'duplicate candidate ID');ids.add(r.candidate_id);
   const frozen=expected.find(x=>x.record.candidate_id===r.candidate_id);
   const contract=frozen?.record;
   check(!!contract,'unknown freeze identity');
   check(r.source_word===contract?.source_form && r.normalized_form===contract?.source_form,'source identity changed');
   check(!!contract && archivedRecord(contract)===archived,'archive/active contamination');
   check(r.review_status===(archived?'archived':'candidate'),'review promotion');
   check(r.publication_status==='not_published','publication promotion');
   check(r.featured_mapping_status===(contract?.featured==='Pending'?'Pending':'Candidate'),'Featured promotion');
   check(r.candidate_mapping===contract?.featured,'Featured changed');
   check(r.source_provenance===frozen?.path+'#'+r.candidate_id,'provenance missing');
   check(isDeepStrictEqual(r.blockers,contract?.pending),'Pending evidence removed');
   check(isDeepStrictEqual(r.baseline_record,contract),'frozen evidence/author/research changed');
   check(r.baseline_record?.historical_relation==='Not claimed','unauthorized historical relation');
  }
 }
 return errors;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const errors=validateProduction(read('data/candidates/production-corpus.v0.1.json'),read('data/candidates/production-archive.v0.1.json'));
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log('Production import structure + Evidence/Editorial gate PASS: 14 Candidate, 2 Archive; 0 Reviewed/Published promotions.');
}
