const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const text = p => fs.readFileSync(path.join(root,p),'utf8');
const read = p => JSON.parse(text(p));
const api = require('../js/production-candidate-data.js');
const book = read('data/language-book.v1.0.json');
const corpus = read('data/candidates/production-corpus.v0.1.json');
const pending = ['monstre','monster','reconnaître','lumen','lux','pression'];
const expected = [['presser','RO-57310e87d84a','迫 pò'],['recognize','RO-6ef2f72df212','认 rèn']];

// Exercise the actual page scripts with their real public fixtures and fetch chain.
async function pageHarness(page, query = '', failure = '') {
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {value:'',innerHTML:'',textContent:'',hidden:false,handlers:{},
      addEventListener(type,fn) {this.handlers[type]=fn;}, querySelectorAll(){return [];},
      insertAdjacentHTML(where,html){this.innerHTML=html+this.innerHTML;}});
    return nodes.get(id);
  };
  const ids = page === 'mapper' ? ['mapperForm','mapperInput','mapperState','mapperResult','datasetVersion','languageBrowseGroups']
    : page === 'dictionary' ? ['dictSearch','dictMessage','dictionaryGrid'] : ['searchInput','searchMessage'];
  ids.forEach(node);
  const listeners = {}, requests = [];
  const window = {location:{href:`http://localhost/${page==='mapper'?'semantic-mapper':page}.html?q=${encodeURIComponent(query)}`}};
  const sandbox = {console,URL,URLSearchParams,Intl,window,document:{
    querySelector:s=>nodes.get(s.slice(1)) || null, getElementById:id=>nodes.get(id)||null,
    addEventListener:(type,fn)=>{listeners[type]=fn;}
  },history:{replaceState:(_a,_b,url)=>{window.location.href=String(url);}},fetch:async url=>{
    requests.push(url);
    const isCandidate = url.includes('production-corpus');
    if (failure === 'candidate' && isCandidate || failure === 'legacy' && !isCandidate) return {ok:false,status:503};
    return {ok:true,json:async()=>structuredClone(isCandidate?corpus:book)};
  }};
  vm.createContext(sandbox);
  for (const file of ['language-book-data.js','production-candidate-data.js','second-pipeline.js','diachronic-mapping.js',page==='mapper'?'semantic-mapper.js':'search.js'])
    vm.runInContext(text('js/'+file),sandbox,{filename:file});
  listeners.DOMContentLoaded?.();
  await new Promise(resolve=>setImmediate(resolve));
  return {node,window,sandbox,requests};
}

test('Production 008 resolver preserves exact identities, normalization and legacy independence',()=>{
  const before=JSON.stringify({book,corpus});
  for(const [word,id] of expected) for(const q of [word,word.toUpperCase(),'  '+word+'  ',Array.from(word,c=>String.fromCharCode(c.charCodeAt(0)+0xfee0)).join('')]) {
    const hit=api.resolve(book,corpus,q); assert.equal(hit.kind,'candidate');assert.equal(hit.candidateId,id);assert.equal(hit.matchType,'source-exact');
  }
  for(const word of ['press','sign']) {const hit=api.resolve(book,corpus,word);assert.equal(hit.kind,'legacy');assert.equal(hit.entry.slug,word);assert.ok(!hit.entry.featured_mapping);}
  for(const word of [...pending,'reconnaitre','pres','xyz-unrecorded'])assert.notEqual(api.resolve(book,corpus,word).kind,'candidate');
  assert.equal(api.resolve(book,corpus,'').kind,'empty');
  assert.equal(JSON.stringify({book,corpus}),before);
});

test('Production 008 resolver requires explicit choices for source, retained and legacy-primary conflicts',()=>{
  const c=structuredClone(corpus),r=c.records.find(r=>r.source_word==='presser');
  c.records.push({...r,candidate_id:'TEST-OTHER'});
  assert.equal(api.resolve(book,c,'presser').kind,'ambiguous');
  assert.equal(api.resolve(book,c,'presser',{domain:'candidate',candidateId:r.candidate_id}).candidateId,r.candidate_id);
  const b=structuredClone(book);b.entries.find(e=>e.slug==='press').primary_mapping.source.word='presser';
  assert.equal(api.resolve(b,corpus,'presser').kind,'ambiguous');
  r.baseline_record.candidates=[{form:'sign',disposition:'Retained'}];
  assert.equal(api.resolve(book,c,'sign').kind,'ambiguous');
  assert.equal(api.resolve(book,corpus,'presser',{domain:'legacy',legacyId:'LB-en-press-pression-022'}).entry.slug,'press');
  assert.equal(api.resolve(book,corpus,'presser',{domain:'candidate',candidateId:'missing'}).kind,'invalid-identity');
  assert.equal(api.resolve(book,corpus,'press',{domain:'candidate',candidateId:r.candidate_id}).kind,'invalid-identity');
});

test('Production 008 candidate rendering takes frozen scope and evidence labels without status promotion',()=>{
  for(const [word,id,mapping] of expected){
    const r=api.resolve(book,corpus,word).entry,html=api.renderCandidate(r);
    for(const value of [id,mapping,'Limited Structural-Semantic Candidate','candidate / not_published','D2','Low','Not claimed','Imported legacy / author unknown',r.baseline_record.editorial_boundary]) assert.ok(html.includes(value),value);
    assert.ok(html.includes('candidateId='+id)); assert.ok(!html.includes('Entry Published'));assert.ok(!html.includes('Author: Jinkai Liu'));
  }
  const pendingRecord=corpus.records.find(r=>r.featured_mapping_status==='Pending');
  assert.ok(api.renderCandidate(pendingRecord).includes('Featured Mapping: Pending'));
  const malicious=structuredClone(corpus.records[52]);malicious.source_word='<script>alert(1)</script>';
  assert.ok(!api.renderCandidate(malicious).includes('<script>'));
});

test('Production 008 Search, Dictionary and Mapper load the candidate adapter in dependency order',()=>{
  for(const page of ['search.html','dictionary.html','semantic-mapper.html']){
    const html=text(page),names=['language-book-data.js','production-candidate-data.js',page==='semantic-mapper.html'?'semantic-mapper.js':'search.js'];
    assert.ok(names.every((name,i)=>html.includes(name)&&(!i||html.indexOf(names[i-1])<html.indexOf(name))));
  }
});

test('Production 008 actual Mapper init and submit render candidates, legacy and Pending boundaries',async()=>{
  const h=await pageHarness('mapper','presser');
  assert.ok(h.requests.includes('data/candidates/production-corpus.v0.1.json'));
  for(const [word,id,mapping] of expected){h.node('mapperInput').value=word;h.node('mapperForm').handlers.submit({preventDefault(){}});assert.ok(h.node('mapperResult').innerHTML.includes(id));assert.ok(h.node('mapperResult').innerHTML.includes(mapping));assert.ok(h.window.location.href.includes('candidateId='+id));}
  for(const word of ['press','sign']){h.node('mapperInput').value=word;h.node('mapperForm').handlers.submit({preventDefault(){}});assert.ok(h.node('mapperResult').innerHTML.includes('Language Book'));assert.ok(h.node('mapperResult').innerHTML.includes('Featured Mapping: Pending'));}
  for(const word of pending){h.node('mapperInput').value=word;h.node('mapperForm').handlers.submit({preventDefault(){}});assert.ok(!h.node('mapperResult').innerHTML.includes('data-candidate-id'));assert.ok((h.node('mapperState').innerHTML+h.node('mapperResult').innerHTML).includes('No active production candidate'));}
  assert.ok(h.node('mapperResult').innerHTML.includes('not an independent Featured Mapping'));
  h.node('mapperInput').value='';h.node('mapperForm').handlers.submit({preventDefault(){}});assert.equal(h.node('mapperResult').innerHTML,'');
});

test('Production 008 actual Search and Dictionary preserve domain and ID in links',async()=>{
  const h=await pageHarness('search');h.node('searchInput').value='presser';await h.sandbox.window.searchWord();
  assert.ok(h.window.location.href.includes('domain=candidate'));assert.ok(h.window.location.href.includes('candidateId=RO-57310e87d84a'));
  const d=await pageHarness('dictionary');d.node('dictSearch').value='presser';await d.sandbox.window.filterDictionary();
  const html=d.node('dictionaryGrid').innerHTML;assert.ok(html.includes('迫 pò'));assert.ok(html.includes('candidateId=RO-57310e87d84a'));assert.ok(html.includes('domain=legacy'));assert.ok(html.includes('legacyId=LB-en-press-pression-022'));assert.ok(html.includes('not an independent Featured Mapping'));
  d.node('dictSearch').value='monstre';await d.sandbox.window.filterDictionary();assert.ok(!d.node('dictionaryGrid').innerHTML.includes('data-candidate-id'));
});

test('Production 008 failed source loading remains visible instead of a silent legacy fallback',async()=>{
  const m=await pageHarness('mapper','presser','candidate');assert.ok(m.node('mapperState').innerHTML.includes('Production candidate data unavailable'));assert.ok(m.node('mapperResult').innerHTML.includes('Language Book'));
  const d=await pageHarness('dictionary','','candidate');assert.ok(d.node('dictionaryGrid').innerHTML.includes('Production candidate data unavailable'));
  const b=await pageHarness('mapper','recognize','legacy');assert.ok(b.node('mapperState').innerHTML.includes('Language Book unavailable'));assert.ok(b.node('mapperResult').innerHTML.includes('认 rèn'));
  const saved=global.fetch;
  try {for(const data of [{batch_id:'archive',records:[]},{batch_id:'PRODUCTION-CANDIDATE-001',records:[{}]},{batch_id:'PRODUCTION-CANDIDATE-001',records:[corpus.records[52],corpus.records[52]]}]){global.fetch=async()=>({ok:true,json:async()=>data});await assert.rejects(api.loadCandidateCorpus());}}
  finally {global.fetch=saved;}
});

test('Production 008 local repair keeps six Pending excluded and all eight benchmark-ineligible',()=>{
  const decision=read('research/production-008/editorial-decision-2026-10-12.json');
  assert.match(decision.benchmark_eligibility,/All eight.*benchmark-ineligible/);
  assert.equal(decision.entries.length,8);
  for(const word of pending){const row=decision.entries.find(e=>e.source_form===word);assert.equal(row.featured_decision,'Pending');assert.ok(!corpus.records.some(r=>r.candidate_id===row.research_object_id));}
});


test('Production 008 historical UI compatibility permits only exact scoped frontend snapshots',()=>{
  const {beforeMapperIntegration,repairScope,baseline}=require('./production-008-mapper-compat.cjs');
  const cp=require('node:child_process');
  for(const file of Object.keys(repairScope)) {
    const current=text(file).replace(/\r\n/g,'\n');
    assert.equal(beforeMapperIntegration(current),cp.execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n'));
    assert.equal(beforeMapperIntegration(current+'// unauthorized delta'),current+'// unauthorized delta');
  }
  for(const record of corpus.records) {
    assert.doesNotThrow(()=>api.renderCandidate(record,true),record.source_word);
    assert.doesNotThrow(()=>api.renderChoices([{domain:"candidate",candidateId:record.candidate_id,entry:record}],record.source_word),record.source_word);
  }
});
