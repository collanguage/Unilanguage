const {legacyEntry,legacyDataset}=require('./legacy-research-view.cjs'); // Exact pre-migration research compatibility
const { assertLegacyUiEqual } = require('./legacy-ui-compat.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const data=legacyDataset(require('../data/language-book.v1.0.json'));
const api=require('../js/language-book-data.js');
const n=require('../data/entries/abdomen.v1.json');
const a=require('../data/entries/abdominal.v1.json');
test('Abdominal adjective and abdomen noun have independent routes and word classes',()=>{
 assert.equal(data.entries.length,42);
 for(const q of ['abdominal','abdominale','abdominaux','abdominales','腹部的'])assert.equal(api.lookup(data,q).entry.id,a.id,q);
 for(const q of ['abdomen','肚子','腹部'])assert.equal(api.lookup(data,q).entry.id,n.id,q);
 assert.equal(a.languages[0].part_of_speech,'adjective · 形容词');
 assert.equal(n.languages[0].part_of_speech,'noun · 名词');
 assert.equal(a.standard_translation.target,'腹部的');assert.equal(a.translation_status,'Supported');
 assert.equal(a.primary_mapping.target.word,'腹部的');
 assert.equal(a.featured_mapping.source,'abdominal');
 assert.equal(a.featured_mapping.target,'肚');
 assert.equal(a.mapping_status,'Candidate');assert.equal(a.mapping_level,'Unrated');
 assert.equal(a.historical_relation_status,'Not claimed');
 assert.equal(a.etymological_family_id,n.etymological_family_id);
 assert.equal(a.word_family_links[0].entry_id,n.id);assert.equal(n.word_family_links[0].entry_id,a.id);
 assert.match(a.evidence['Phonetic-Semantic'].summary.en,/four syllables/);
 assert.match(a.featured_mapping.boundary.en,/not the standard adjective translation/);
});
test('English and French browse forms have one correct owner and reciprocal pages',()=>{
 const groups=api.languageForms(data);
 for(const [code,word,id]of [['en','abdomen',n.id],['en','abdominal',a.id],['fr','abdomen',n.id],['fr','abdominal',a.id],['fr','abdominale',a.id],['zh-Hans','腹部的',a.id]]){
  const forms=groups.find(g=>g.code===code).forms.filter(x=>x.term===word);
  assert.equal(forms.length,1,word);assert.equal(forms[0].recordId,id,word);
 }
 for(const e of [n,a]){
  const page=fs.readFileSync(path.join(root,e.page),'utf8');
  assert.ok(page.includes('<h1>'+e.slug+' ↔ 肚'));
  assert.ok(page.includes('href="'+(e===n?'abdominal':'abdomen')+'.html"'));
 }
});
test('The split preserves noun literature, unrelated records and frozen Mapper UI',()=>{
 const base='9db955b35a1af9626e622694ae6b0911dc9f110e';
 const get=f=>cp.execFileSync('git',['show',base+':'+f],{cwd:root,maxBuffer:20*1024*1024,encoding:'utf8'}).replace(/\r\n/g,'\n');
 const before=JSON.parse(get('data/language-book.v1.0.json'));
 const others=x=>!['abeyance','aberrant','abdomen','abdominal'].includes(x.slug);
 assert.deepEqual(data.entries.filter(others),before.entries.filter(others));
 assert.deepEqual(n.literary_layer,before.entries.find(x=>x.slug==='abdomen').literary_layer);
 for(const f of ['js/semantic-mapper.js','semantic-mapper.html'])assertLegacyUiEqual(fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n'),get(f));
});
