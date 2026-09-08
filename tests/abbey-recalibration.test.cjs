const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const data=require('../data/language-book.v1.0.json');
const api=require('../js/language-book-data.js');
const manifest=require('../data/batches/legacy-entry-recalibration-001.v1.json');
const entry=data.entries.find(e=>e.slug==='abbey');
test('ABBEY recalibrates one identity without changing publication counts',()=>{
 assert.equal(entry.id,'LB-en-abbey-010');
 assert.equal(data.entries.length,manifest.entry_count_before);
 assert.equal(data.entries.filter(e=>e.entry_status==='Published').length,manifest.published_entry_count_before);
 assert.equal(data.entries.filter(e=>e.slug==='abbey').length,1);
 for(const q of ['abbey','abbaye','abbé','abbot','abbess','abba','修道院','爸','蓓','蓓蕾'])assert.equal(api.lookup(data,q).entry.id,entry.id,q);
});
test('father query presents root candidate and kinship control without mutating standard translation',()=>{
 for(const q of ['爸','爸爸','abba','bà']){
  const view=api.lookup(data,q).entry;
  assert.equal(view.primary_mapping.source.word,'ABBA');
  assert.equal(view.primary_mapping.target.word,'爸');
  assert.match(view.primary_mapping.mapping_type,/Root-level.*Candidate/);
  assert.match(view.primary_mapping.meaning.en,/Kinship control.*early-child/);
  assert.equal(view.historical_relation_status,'Not claimed');
 }
 assert.equal(entry.primary_mapping.target.word,'修道院');
 assert.equal(entry.translation_status,'Supported');
 assert.equal(entry.recalibration.root_candidate.historical_relation,'Not claimed');
});
test('source traceability, preserved author note and independent literary status',()=>{
 assert.match(entry.source.raw_note,/这个词应该从犹太教的阿比而来/);
 assert.equal(entry.literary_layer.status,'Published');
 assert.equal(entry.literary_layer.is_historical_evidence,false);
 for(const ref of entry.recalibration.path_source_refs)assert.ok(entry.references.find(r=>r.reference_id===ref)?.url);
 assert.match(entry.recalibration.root_candidate.consonant_comparison.target,/unaspirated \/p\//);
 assert.equal(entry.recalibration.workflow.length,7);
 assert.ok(entry.recalibration.kinship_research_note.research_queue.length);
});
test('ABBEY page separates hero scopes and all local resources resolve',()=>{
 const file=path.resolve(__dirname,'../',entry.page),html=fs.readFileSync(file,'utf8');
 assert.match(html,/<h1>ABBEY · 修道院<\/h1>/);
 assert.doesNotMatch(html,/<h1>[^<]*abbey\s*↔\s*爸/i);
 assert.match(html,/Root Mapping Candidate: ABBA ↔ 爸 bà/);
 assert.equal((html.match(/<h2>/g)||[]).length,10);
 for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https?:|#)/.test(ref))continue;
  assert.ok(fs.existsSync(path.resolve(path.dirname(file),ref.split(/[?#]/)[0])),ref);
 }
});
test('queue only recommends existing records with reproducible priority scores',()=>{
 assert.ok(manifest.queue.length>=5 && manifest.queue.length<=10);
 for(const q of manifest.queue){
  assert.ok(data.entries.find(e=>e.id===q.record_id));
  assert.equal(q.priority_score,8*q.factors.risk+6*q.factors.source_readiness+6*q.factors.reuse_impact);
  assert.equal(q.status,'Recommended only; not edited');
 }
});
