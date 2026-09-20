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
