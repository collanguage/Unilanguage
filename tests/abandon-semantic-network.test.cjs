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
  assert.match(entry.featured_mapping.display_label,/Diachronic Semantic Path/);
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

test('dual paths retain stage boundaries, complete lexical provenance and candid losses',()=>{
  const d=entry.diachronic_semantic_mapping;
  assert.equal(d.status,'Experimental/Testable');
  assert.equal(d.historical_relation,'Not claimed');
  assert.deepEqual(d.historical_stages.map(s=>s.form),['BANDON','À BANDON','ABANDONNER','ABANDON']);
  assert.ok(!d.historical_stages[0].meaning.includes('RELEASE'));
  assert.match(d.historical_stages[2].note.en,/1100.*12th century/);
  assert.match(d.boundary.en,/not five successive/);
  assert.equal(d.semantic_best_path.nodes.length,5);
  const nodes=[...d.semantic_best_path.nodes,...d.consonant_constrained_path.nodes];
  const stages=new Set(d.historical_stages.map(s=>s.stage_id));
  assert.equal(new Set(nodes.map(n=>n.node_id)).size,nodes.length);
  for(const n of nodes){
    assert.ok(stages.has(n.source_stage_id),n.node_id);
    assert.ok(['High','Medium','Low'].includes(n.semantic_fit));
    for(const key of ['reading','phonetic_group_fit','evidence_status','historical_independence','semantic_loss','semantic_loss_zh'])assert.ok(n[key],`${n.node_id}: ${key}`);
    assert.ok(n.source_refs.length>0);
    assert.ok(n.evidence_note.en&&n.evidence_note['zh-Hans']);
  }
  assert.equal(nodes.find(n=>n.form==='办').semantic_fit,'Low');
  assert.equal(nodes.find(n=>n.form==='拨付').semantic_fit,'Medium');
  assert.equal(nodes.find(n=>n.form==='罢').semantic_fit,'Medium');
  assert.equal(nodes.find(n=>n.form==='抛').semantic_fit,'High');
  assert.match(d.audit.en,/not a blinded/);
  assert.equal(d.scores.hypothesis_support,'Low / untested');
  assert.equal(d.workflow.length,5);
  assert.match(d.workflow[4].en,/d-t-n-l.*g-k-h/);
  const exp=entry.experiments.find(x=>x.experiment_id==='EXP-ABANDON-DUAL-PATH-PLAN');
  assert.equal(exp.status,'Planned / Not run');
  for(const link of d.hypothesis_links)assert.ok(exp.tested_hypotheses.includes(link.hypothesis_id));
});

test('both paths are exposed through the frozen Mapper data contract and page order',()=>{
  const d=entry.diachronic_semantic_mapping;
  for(const path of [d.semantic_best_path,d.consonant_constrained_path]){
    assert.ok(entry.primary_mapping.meaning.en.includes(path.display));
    assert.ok(entry.semantic_structure.relation.includes(path.display));
    for(const n of path.nodes)assert.ok(entry.evidence['Phonetic-Semantic'].items.some(i=>i.evidence_id===n.node_id));
  }
  for(const q of ['bandon','柄','权柄','办','拨','拨付','放','罢','抛','付','弃'])assert.equal(api.lookup(dataset,q).entry.id,entry.id,q);
  const page=fs.readFileSync(path.join(root,entry.page),'utf8');
  assert.match(page,/<h1>ABANDON · 放弃<\/h1>/);
  const order=['historical-etymology','semantic-best-path','consonant-constrained-path','mapping-justification','related-candidates','rejected-segmentation'];
  for(let i=1;i<order.length;i++)assert.ok(page.indexOf(`id="${order[i-1]}"`)<page.indexOf(`id="${order[i]}"`));
  for(const phrase of ['Map the semantic development, not merely the modern translation.','Find the historically meaningful unit first; map to Chinese second.'])assert.ok(page.includes(phrase));
});
