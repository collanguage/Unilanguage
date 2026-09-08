const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dataset=require('../data/language-book.v1.0.json');
const api=require('../js/language-book-data.js');
const entry=dataset.entries.find(e=>e.slug==='abandon');

test('ABANDON reuses its record and related terms resolve without new published entries',()=>{
  assert.equal(dataset.entries.length,37);
  assert.equal(entry.id,'LB-en-abandon-033');
  assert.equal(entry.entry_status,'Published');
  for(const term of ['abandon','放弃','抛弃','离弃','旁','放到一旁','ban','甭','banal','一般','般','donner','捅','band','bande']){
    const result=api.lookup(dataset,term);
    assert.equal(result.kind,'exact',term);
    assert.equal(result.entry.id,entry.id,term);
    assert.ok(api.searchableForms(entry).includes(api.normalize(term)),term);
  }
  assert.ok(!dataset.entries.some(e=>['ban','banal','donner'].includes(e.slug)));
});

test('translation, association, candidate and rejected segmentation states remain independent',()=>{
  assert.equal(entry.translation_status,'Supported');
  assert.equal(entry.mapping_status,'Supported');
  assert.equal(entry.featured_mapping.target,'放弃');
  assert.equal(entry.featured_mapping.historical_relation,'Not claimed');
  assert.match(entry.featured_mapping.display_label,/Historical Semantic Path/);
  assert.match(entry.primary_mapping.target.word,/放弃.*抛弃.*离弃/);
  assert.ok(!entry.primary_mapping.target.word.includes('甭'));
  assert.equal(entry.hypotheses.find(h=>h.hypothesis_id==='UNI-LEGACY-ABANDON-001').status,'Rejected');
  for(const id of ['HYP-BAN-BENG-001','HYP-BANAL-BAN-001']){
    const h=entry.hypotheses.find(h=>h.hypothesis_id===id);
    assert.equal(h.status,'Candidate');assert.equal(h.semantic_strength,'moderate');
    assert.equal(h.historical_relation_status,'Not claimed');assert.equal(h.experiment_link,null);
  }
  assert.match(entry.related_words.find(r=>r.word.startsWith('donner')).status,/Weak/);
  assert.equal(entry.author_usage_observation.standard_reading,'tǒng');
  assert.equal(entry.author_usage_observation.author_reading,'tōng');
  assert.ok(entry.semantic_associations.every(a=>!a.is_etymological));
});

test('author observations are preserved while scoped sources and corrections are explicit',()=>{
  for(const text of ['a.ban.don','禁止给=放弃','捅钱','旁边的旁字','band','donate','动【dong】'])assert.ok(entry.source.raw_note.includes(text),text);
  assert.equal(entry.revision_history[0].previous_source.raw_note,'abandon，放弃。甭 beng。ban 与甭同音。');
  assert.match(entry.evidence.Historical.summary.en,/abandounen.*14th century.*abanduner/);
  assert.match(entry.evidence.Speculative.summary.en,/unattested/);
  assert.match(entry.related_words.find(r=>r.word==='French ban').relation_to_entry.en,/masculine noun/);
  assert.ok(entry.editorial_notes.some(n=>n.en.includes('does not automatically invalidate')));
  const refs=new Set(entry.references.map(r=>r.reference_id));
  function visit(value){
    if(!value||typeof value!=='object')return;
    for(const [key,item] of Object.entries(value)){
      if(key==='source_refs'||key==='translation_source_refs')for(const ref of item)assert.ok(refs.has(ref),ref);
      else visit(item);
    }
  }
  visit(entry);
  const page=fs.readFileSync(path.join(root,entry.page),'utf8');
  for(const id of ['historical-etymology','active-association','ban-beng','banal-ban','rejected-segmentation','author-association','mapping-justification'])assert.ok(page.includes(`id="${id}"`),id);
  assert.match(page,/Translation Status/);assert.match(page,/family deduplication/);
});

test('meaning-first mapping separates historical development from cross-language pairs',()=>{
  const h=entry.diachronic_semantic_mapping,c=entry.consonant_group_mapping;
  assert.deepEqual(h.historical_stages.map(s=>s.form),['BANDON','À BANDON','ABANDONNER','ABANDON']);
  assert.ok(!h.historical_stages[0].meaning.includes('RELEASE'));
  assert.ok(!h.consonant_constrained_path&&!h.semantic_best_path);
  assert.equal(c.workflow.length,7);
  assert.deepEqual(c.predicted_groups,['b-p-m-f','d-t-n-l','g-k-h','z-c-s']);
  const candidate=c.candidates[0];
  assert.equal(candidate.source_unit,'bandon');
  assert.equal(candidate.target,'办 / 辦');
  assert.equal(candidate.status,'Phonetic-Semantic Candidate');
  assert.equal(candidate.historical_relation,'Not claimed');
  assert.equal(candidate.scores.semantic_fit_power_authority,'Low');
  assert.equal(candidate.scores.semantic_fit_contextual_handling,'Medium');
  assert.match(candidate.consonant_comparison.label,/b ↔ b/);
  assert.match(candidate.consonant_comparison.note.en,/Pinyin b.*unaspirated/);
  assert.match(c.independent_observations.en,/does not make them prove each other/);
  assert.match(c.dialect_diachronic_chinese_evidence.note.en,/not frozen copies/);
  assert.ok(!entry.experiments.some(x=>x.experiment_id==='EXP-ABANDON-DUAL-PATH-PLAN'));
  assert.equal(entry.experiments.find(x=>x.experiment_id==='EXP-BANDON-BAN-CORRESPONDENCE-PLAN').status,'Planned / Not run');
  assert.ok(!entry.evidence['Phonetic-Semantic'].items.some(x=>/^(best-|bpmf-)/.test(x.evidence_id)));
});

test('corrected record and page expose the candidate without a Chinese constraint path',()=>{
  for(const q of ['bandon','办','辦','柄','权柄','ban','甭','banal','一般'])assert.equal(api.lookup(dataset,q).entry.id,entry.id,q);
  const page=fs.readFileSync(path.join(root,entry.page),'utf8');
  assert.match(page,/<h1>ABANDON · 放弃<\/h1>/);
  assert.ok(!page.includes('id="consonant-constrained-path"'));
  assert.ok(!page.includes('id="semantic-best-path"'));
  assert.ok(!entry.semantic_structure.relation.includes('柄'));
  for(const id of ['historical-etymology','bandon-ban','method','mapping-justification','experiment','dialect-evidence'])assert.ok(page.includes(`id="${id}"`));
  assert.match(page,/Meaning first, consonant second/);
  assert.match(page,/b ↔ b/);
  assert.ok(page.indexOf('id="historical-etymology"')<page.indexOf('id="bandon-ban"'));
  assert.match(page,/abash ↔ 怕 pà/);assert.match(page,/bash ↔ 拍 pāi/);
});
