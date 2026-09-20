const { assertLegacyUiEqual } = require('./legacy-ui-compat.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const data=require('../data/language-book.v1.0.json');
const api=require('../js/language-book-data.js');
const v=require('../data/entries/abbreviate.v1.json');
const n=require('../data/entries/abbreviation.v1.json');
test('Verb and noun have distinct IDs, source words, pages and exact lookup routes',()=>{
 assert.equal(data.entries.length,42);
 assert.equal(n.id,'LB-en-abbreviation-041');assert.notEqual(v.id,n.id);
 for(const q of ['abbreviation','abbreviations','abréviation','缩写形式','缩写词'])assert.equal(api.lookup(data,q).entry.id,n.id,q);
 for(const q of ['abbreviate','abréger'])assert.equal(api.lookup(data,q).entry.id,v.id,q);
 assert.equal(n.languages[0].part_of_speech,'noun · 名词');
 assert.equal(n.standard_translation.target,'缩写形式／缩略');
 assert.match(n.evidence.Historical.summary.en,/Anglo-French/);
 assert.equal(n.featured_mapping.source,'ABBREVIATION');
 assert.equal(n.mapping_status,'Candidate');assert.equal(n.mapping_level,'D');
 assert.equal(n.historical_relation_status,'Not claimed');
 assert.equal(n.etymological_family_id,v.etymological_family_id);
 assert.ok(!v.search_terms.includes('abbreviation'));
 assert.equal(n.word_family_links[0].entry_id,v.id);
 assert.equal(v.word_family_links[0].entry_id,n.id);
});
test('English and French browse buttons belong to the matching independent entry',()=>{
 const groups=api.languageForms(data);
 for(const [code,word,id]of [['en','abbreviate',v.id],['en','abbreviation',n.id],['fr','abréger',v.id],['fr','abréviation',n.id],['zh-Hans','缩写形式',n.id]]){
  const forms=groups.find(g=>g.code===code).forms.filter(x=>x.term===word);
  assert.equal(forms.length,1,word);assert.equal(forms[0].recordId,id,word);
 }
 for(const e of [v,n]){
  const page=fs.readFileSync(path.join(root,e.page),'utf8');
  assert.ok(page.includes('<h1>'+e.title.en+'</h1>'));
  assert.ok(page.includes('href="'+(e===v?'abbreviation':'abbreviate')+'.html"'));
 }
});
test('The split preserves every unrelated record and frozen Mapper UI',()=>{
 const base='63185d7eb2aa9bf5ea3d6e9d6d419efa6750d707';
 const before=JSON.parse(cp.execFileSync('git',['show',base+':data/language-book.v1.0.json'],{cwd:root,maxBuffer:20*1024*1024}));
 const others=x=>!['abeyance','aberrant','abbreviate','abbreviation','abdomen','abdominal'].includes(x.slug);
 assert.deepEqual(data.entries.filter(others),before.entries.filter(others));
 for(const f of ['js/semantic-mapper.js','semantic-mapper.html'])assertLegacyUiEqual(fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n'),cp.execFileSync('git',['show',base+':'+f],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n'));
});
