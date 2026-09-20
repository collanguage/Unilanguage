const {legacyEntry,legacyDataset}=require('./legacy-research-view.cjs'); // Exact pre-migration research compatibility
const { assertLegacyUiEqual } = require('./legacy-ui-compat.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const e = require('../data/entries/abbreviate.v1.json');
const data = legacyDataset(require('../data/language-book.v1.0.json'));
const api = require('../js/language-book-data.js');
const page = fs.readFileSync(path.join(root,'words/abbreviate.html'),'utf8');
const baseline = '7a331b0b8040bb850c7a38dfce3b2fb8b53b1d25';
const before = JSON.parse(cp.execFileSync('git',['show',baseline+':data/language-book.v1.0.json'],{cwd:root,maxBuffer:20*1024*1024}));

test('ABBREVIATE preserves its identity, source, literature and every unrelated record',()=>{
 assert.equal(e.id,'LB-en-abbreviate-035');
 assert.equal(data.entries.length,before.entries.length+2);
 assert.equal(data.entries.filter(x=>x.slug==='abbreviate').length,1);
 assert.deepEqual(data.entries.find(x=>x.id===e.id),e);
 assert.deepEqual(data.entries.filter(x=>x.id!==e.id&&!['abeyance','aberrant','abbreviation','abdominal','abdomen'].includes(x.slug)),before.entries.filter(x=>x.id!==e.id&&!['abeyance','aberrant','abbreviation','abdominal','abdomen'].includes(x.slug)));
 const old=before.entries.find(x=>x.id===e.id);
 assert.deepEqual(e.source,old.source);
 assert.deepEqual(e.literary_layer,old.literary_layer);
 assert.equal(data.entries.filter(x=>x.entry_status==='Published').length,before.entries.filter(x=>x.entry_status==='Published').length+2);
 for(const file of ['js/semantic-mapper.js','semantic-mapper.html',...['horizon','horse','new'].map(x=>'words/'+x+'.html')]){
  assertLegacyUiEqual(fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n'),cp.execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n'),file);
 }
});
test('Featured 瘪 and standard verb senses remain separate across page and data',()=>{
 assert.doesNotMatch(e.related_words.find(x=>x.word==='瘪 biě').relationship_type,/etymological|historical/i);
 assert.match(e.related_words.find(x=>x.word==='abréviation').relationship_type,/historical/);
 assert.equal(e.featured_mapping.target,'瘪'); assert.equal(e.featured_mapping.reading,'biě');
 assert.equal(e.primary_mapping.target.word,'瘪');
 assert.equal(e.standard_translation.target,'缩写／简略');
 assert.deepEqual(e.standard_translation.terms,['缩写','使简略','缩短']);
 assert.equal(e.standard_translation.is_featured_mapping,false);
 assert.match(page,/<h1>ABBREVIATE ↔ 瘪 biě · 缩写／简略<\/h1>/);
 assert.match(page,/瘪不是“缩写”的标准汉语动词/);
 const noun=e.related_words.find(x=>x.word==='abbreviation');
 assert.equal(require('../data/entries/abbreviation.v1.json').languages[0].part_of_speech,'noun · 名词');
 assert.match(noun.relationship_type,/historical noun/);
 assert.match(require('../data/entries/abbreviation.v1.json').evidence.Historical.summary.en,/Anglo-French/);
});
test('Root comparison uses actual segments, and cognition never becomes lexical evidence',()=>{
 const d=e.diachronic_semantic_mapping.mappings[0];
 assert.equal(d.source.word,'brev-/brevi-');
 assert.notEqual(d.mapping_id,e.primary_mapping.mapping_id);
 assert.equal(d.status,'Candidate'); assert.equal(d.historical_relation_status,'Not claimed');
 assert.equal(e.historical_relation_status,'Not claimed');
 assert.equal(e.direct_lexical_semantic_equivalence,false);
 assert.deepEqual(Object.keys(d.phonetic_observation.segments),['consonants','vowel','syllables','stress','tone']);
 assert.match(d.phonetic_observation.segments.consonants.en,/unaspirated \[p\]/);
 assert.match(d.phonetic_observation.reference_system,/No uniform Late Latin/);
 assert.equal(e.transformation_mapping.status,'Candidate');
 assert.deepEqual(e.transformation_mapping.operations,['COMPRESS','REDUCE']);
 assert.equal(e.semantic_structure.relation,'SHORT → REDUCE → COMPRESS');
 const lexical=e.chinese_evidence.filter(x=>x.form==='瘪'&&x.claim_type==='modern_meaning');
 assert.equal(lexical.length,1); assert.match(lexical[0].claim,/No abbreviation sense/);
 assert.match(page,/辞书提供两端词义，不证明这条桥梁/);
 assert.equal(e.mapping_status,'Candidate');assert.equal(e.mapping_level,'D');assert.equal(e.confidence,'Low');
 for(const a of [e.mapping_assessment,d.mapping_assessment]){
  assert.equal(a.total,a.dimensions.reduce((n,x)=>n+x.score,0));
  assert.equal(a.total,35); assert.match(a.method,/Unvalidated/);
 }
});
test('蹩 is rejected by meaning; French and historical forms stay correctly scoped',()=>{
 const alt=e.secondary_candidates.find(x=>x.target==='蹩');
 assert.match(alt.reading,/bié/);assert.equal(alt.status,'Rejected');
 assert.equal(alt.label,'Alternative / Rejected-by-meaning-first');
 assert.match(alt.reason,/missing semantic bridge/);
 assert.equal(e.languages.find(x=>x.code==='fr').word,'abréger');
 assert.equal(require('../data/entries/abbreviation.v1.json').languages.find(x=>x.word==='abréviation').part_of_speech,'nom féminin');
 assert.match(e.evidence.Historical.summary.en,/abbreviātus/);
 assert.match(e.evidence.Historical.summary.en,/Latin abbreviatio/);
 assert.match(e.legacy_calibration.corrections.join(' '),/historical Anglo-French abreviation remains correct/);
 assert.equal(e.source_audit_pending.length,5);
 assert.ok(e.source_audit_pending.every(x=>x.status==='pending'));
 const ids=new Set(e.references.map(x=>x.reference_id));
 function visit(x){if(!x||typeof x!=='object')return; for(const [k,v]of Object.entries(x)){if(k==='source_refs')for(const id of v)assert.ok(ids.has(id),id);else visit(v);}}
 visit(e);
});
test('Aliases resolve to the single recalibrated entry and public word page',()=>{
 for(const q of ['abbreviate','瘪','biě','brev-','brevi-','brevis','abréger','蹩']){
  const found=api.lookup(data,q).entry;assert.equal(found?.id,e.id,q);assert.equal(found.page,'words/abbreviate.html');
 }
 for(const id of ['literature','basic-meaning','multilingual','etymology','mapping','justification','protocol','utp','examples','community','references'])assert.ok(page.includes('id="'+id+'"'));
});
test('Dictionary rendered card names 瘪 as featured and never as standard translation',async()=>{
 const elements={dictSearch:{value:'abbreviate'},dictMessage:{},dictionaryGrid:{}};
 const context={window:{},document:{getElementById:id=>elements[id],addEventListener:()=>{}},UnilanguageData:{...api,loadDataset:async()=>data}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'js/search.js'),'utf8'),context);
 await context.window.filterDictionary();
 const out=elements.dictionaryGrid.innerHTML;
 assert.match(out,/ABBREVIATE ↔ 瘪 <small>biě<\/small> · 缩写／简略/);
 assert.match(out,/Standard translation · 通用翻译：<\/strong> 缩写／简略/);
 assert.doesNotMatch(out,/Standard translation · 通用翻译：<\/strong> 瘪/);
 assert.match(out,/href="words\/abbreviate.html"/);
});
