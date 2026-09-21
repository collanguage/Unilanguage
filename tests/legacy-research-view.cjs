const assert=require('node:assert/strict');
const cp=require('node:child_process');
const path=require('node:path');
const baseline='5ed87f6b6d2aa99523368bd26aa4c7d43b8deb3b';
const scope=new Set(['abandon','abhor','abdicate','aberrant']);
const cache=new Map();
// Historical research tests keep testing the exact original claims, not a new
// grading rubric. New active-model behavior is tested in legacy-migration.test.cjs.
// Never silently drop arbitrary changed fields: the restored record must exactly
// equal the approved baseline, including every original evidence/status field.
function legacyEntry(e) {
 if(!e.legacy_migration)return e;
 if(e.legacy_migration.version==='final-structural-0.1') {
  assert.ok(['form','sign','press','above','light'].includes(e.slug));
  const b='c0cab379544cc6f55db6daecb6e3a694347415e9';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  Object.assign(restored,a.previous_fields);
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  if(!cache.has(b))cache.set(b,JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:40e6})));
  assert.deepEqual(restored,cache.get(b).entries.find(x=>x.id===e.id),'Final structural archive must exactly restore baseline');
  return restored;
 }

 if(e.legacy_migration.version==='final-lexical-0.1') {
  assert.ok(['convent','fil','marchand','montrer'].includes(e.slug));
  const b='1388f4283b37179b4d5eaddc93257333ce21e1c8';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  Object.assign(restored,a.previous_fields);
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  if(!cache.has(b))cache.set(b,JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:40e6})));
  assert.deepEqual(restored,cache.get(b).entries.find(x=>x.id===e.id),'Final lexical archive must exactly restore original');
  return restored;
 }
 if(e.legacy_migration.version==='second-pipeline-0.1') {
  assert.ok(['at','figure','new','water','namcha-barwa'].includes(e.slug));
  const b='f35857436a743045645c1e8f06afb932bbc4db63';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  for(const [k,v] of Object.entries(a.previous_fields))restored[k]=v;
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:40e6})).entries.find(x=>x.id===e.id);
  assert.deepEqual(restored,original,'Second-pipeline archive must exactly restore baseline');
  return restored;
 }

 if(e.legacy_migration.version==='tier-c-final-a-0.1') {
  assert.ok(['a-indefinite-article'].includes(e.slug));
  const b='3b9901d47f0cd9d13252e96329b96dded0be972d';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  for(const [k,v] of Object.entries(a.previous_fields))restored[k]=v;
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:30e6})).entries.find(x=>x.id===e.id);
  assert.deepEqual(restored,original,'Tier B final archive must exactly restore every baseline field');
  return restored;
 }
 if(e.legacy_migration.version==='tier-c-batch3-0.1') {
  assert.ok(['sky','language','advance','generate','absolute'].includes(e.slug));
  const b='16e144fd83c1fe048b3abd84196a0529fe04df3b';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  for(const [k,v] of Object.entries(a.previous_fields))restored[k]=v;
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:30e6})).entries.find(x=>x.id===e.id);
  assert.deepEqual(restored,original,'Tier B final archive must exactly restore every baseline field');
  return restored;
 }
 if(e.legacy_migration.version==='tier-c-batch2-0.1') {
  assert.ok(['abridge','aliment','acumen','abound'].includes(e.slug));
  const b='e6109656fc350375a9719941f720294afb1db2b2';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  for(const [k,v] of Object.entries(a.previous_fields))restored[k]=v;
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:30e6})).entries.find(x=>x.id===e.id);
  assert.deepEqual(restored,original,'Tier B final archive must exactly restore every baseline field');
  return restored;
 }
 if(e.legacy_migration.version==='pending-final-0.1') {
  assert.ok(['media','aback','sound'].includes(e.slug));
  const b='be8bc2dcb1d3f517ba41bbaa2dacc8574335565b';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  for(const [k,v] of Object.entries(a.previous_fields))restored[k]=v;
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:30e6})).entries.find(x=>x.id===e.id);
  assert.deepEqual(restored,original,'Tier B final archive must exactly restore every baseline field');
  return restored;
 }
 if(e.legacy_migration.version==='tier-b-final-0.1') {
  assert.ok(['horizon','horse'].includes(e.slug));
  const b='dcfc3dc3f6ae5424beb61ef22b6f55ca3ecebde2';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  for(const [k,v] of Object.entries(a.previous_fields))restored[k]=v;
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:30e6})).entries.find(x=>x.id===e.id);
  assert.deepEqual(restored,original,'Tier B final archive must exactly restore every baseline field');
  return restored;
 }
 if(e.legacy_migration.version==='batch-2-0.1') {
  assert.ok(['universe','human','abbey','abash'].includes(e.slug));
  const b='158a2a4839de709569cb309b1966ebb6ff72f9d0';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  for(const [k,v] of Object.entries(a.previous_fields))restored[k]=v;
  for(const k of a.previously_absent_fields)delete restored[k];
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/language-book.v1.0.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:30e6})).entries.find(x=>x.id===e.id);
  assert.deepEqual(restored,original,'Batch 2 archive must exactly restore every baseline field');
  return restored;
 }
 if(e.legacy_migration.version==='batch-1-0.1') {
  assert.ok(['abbreviate','abbreviation','abdomen','abdominal'].includes(e.slug));
  const b='8d462232767d89290516dcb5086704a729a36be6';
  assert.equal(e.legacy_migration.baseline_commit,b);
  const restored=structuredClone(e),a=restored.legacy_migration;
  const allowed=new Set(['diachronic_semantic_mapping','featured_mapping','standard_translation','source_audit_pending','phonetic_observation']);
  for(const [k,v] of Object.entries(a.previous_fields)){assert.ok(allowed.has(k));restored[k]=v;}
  for(const k of a.previously_absent_fields){assert.ok(allowed.has(k));delete restored[k];}
  delete restored.legacy_migration;
  const original=JSON.parse(cp.execFileSync('git',['show',`${b}:data/entries/${e.slug}.v1.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:5e6}));
  assert.deepEqual(restored,original,'Batch 1 must archive exact original fields and preserve all other research');
  return restored;
 }
 assert.ok(scope.has(e.slug),'migration outside approved scope');
 assert.equal(e.legacy_migration.baseline_commit,baseline);
 const restored=structuredClone(e);
 restored.diachronic_semantic_mapping=restored.legacy_migration.previous_diachronic_semantic_mapping;
 delete restored.legacy_migration;delete restored.featured_mapping.candidate_ref;
 if(!cache.has(e.slug))cache.set(e.slug,JSON.parse(cp.execFileSync('git',['show',`${baseline}:data/entries/${e.slug}.v1.json`],{cwd:path.resolve(__dirname,'..'),maxBuffer:5e6})));
 assert.deepEqual(restored,cache.get(e.slug),'migration must preserve every pre-existing claim');
 return restored;
}
function legacyDataset(d){return {...d,entries:d.entries.map(legacyEntry)};}
module.exports={legacyEntry,legacyDataset};
