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
