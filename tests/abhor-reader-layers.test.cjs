const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const cp = require('node:child_process');
const vm = require('node:vm');
const reader = require('../js/abhor-reader-layers.js');
const entry = require('../data/entries/abhor.v1.json');
const api = require('../js/language-book-data.js');
const dataset = require('../data/language-book.v1.0.json');
const base = '31d074804a0c37c9ce1f16ac43921fe5849df6bb';
const text = p => fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const before = p => cp.execFileSync('git',['show',`${base}:${p}`],{encoding:'utf8',maxBuffer:50e6}).replace(/\r\n/g,'\n');
test('reader pilot preserves all canonical research, schema and unrelated word pages',()=>{
  for(const p of cp.execFileSync('git',['ls-files','data','words'],{encoding:'utf8'}).trim().split('\n')) {
    if(p==='words/abhor.html')continue;
    assert.equal(text(p),before(p),p);
  }
});
test('three mapping identities and scores are separate, sourced and read-only',()=>{
  const snap=JSON.stringify(entry), out=reader.render(entry);
  assert.equal(JSON.stringify(entry),snap);
  assert.ok(out.indexOf('data-reader-layer="standard"')<out.indexOf('data-reader-layer="historical"'));
  assert.ok(out.indexOf('data-reader-layer="historical"')<out.indexOf('data-reader-layer="author"'));
  assert.match(out,/ABHOR → 恶 wù/);assert.match(out,/Supported<\/span> · Level A · Evidence Medium · Phonetic score 2\/30/);
  assert.match(out,/Latin HORRĒRE → 骇 hài/);assert.match(out,/Candidate<\/span> · Level C · Evidence Medium · Phonetic score 5\/30/);
  for(const s of ['Author-attested Dialect Usage','Region: Pending identification','Independent dialect evidence: Pending','Jinkai Liu','我对某某有火 / 对某人有火','Historical Relation: Not claimed','不是 primary standard mapping'])assert.ok(out.includes(s),s);
  assert.match(out,/overflow-wrap:anywhere;min-width:0/);
});
test('generated ABHOR reader matches shared renderer, original research outside reader is preserved',()=>{
  const page=text('words/abhor.html'), old=before('words/abhor.html');
  const marker=/<!-- LEGACY-READER:START -->[\s\S]*?<!-- LEGACY-READER:END -->/;
  assert.equal(page.match(marker)[0],`<!-- LEGACY-READER:START -->${reader.render(entry)}<!-- LEGACY-READER:END -->`);
  const strip=s=>s.replace(marker,'').replace(/<title>.*?<\/title>/,'');
  assert.equal(strip(page),strip(old));
});
test('Dictionary summary uses standard identity and never labels fire as translation',async()=>{
  const elements={dictionaryGrid:{innerHTML:''},dictSearch:{value:'abhor',addEventListener(){}},dictMessage:{textContent:''}};
  const context={UnilanguageData:{...api,loadDataset:async()=>dataset},UnilanguageAbhorReader:reader,window:{},document:{getElementById:id=>elements[id]||null,addEventListener(){}}};
  vm.runInNewContext(text('js/search.js'),context);await context.window.filterDictionary();
  const out=elements.dictionaryGrid.innerHTML;
  assert.match(out,/Modern Standard Mapping: 恶 wù/);assert.match(out,/HORRĒRE → 骇 hài/);
  assert.match(out,/作者方言观察：火 huǒ · Author-attested · Independent evidence Pending/);
  assert.doesNotMatch(out,/Standard translation[^<]*火|<h2>[^<]*Featured: 火/);
});
test('shared renderer changes are only the bounded ABHOR branch and cache hooks',()=>{
  const strip=s=>s.replace(/    \/\/ ABHOR-READER:START\n[\s\S]*?    \/\/ ABHOR-READER:END\n/,'')
    .replace(/\/\* ABHOR-READER:START \*\/.*?\/\* ABHOR-READER:END \*\/ /g,'')
    .replace(/<!-- ABHOR-READER:START -->[\s\S]*?<!-- ABHOR-READER:END -->\n/g,'')
    .replace(/(js\/(?:search|semantic-mapper)\.js\?v=1\.2\.37)-abhor1/g,'$1');
  for(const p of ['js/search.js','js/semantic-mapper.js','dictionary.html','search.html','semantic-mapper.html'])assert.equal(strip(text(p)),before(p),p);
  for(const slug of ['horse','horizon','new'])assert.equal(reader.isEntry(dataset.entries.find(e=>e.slug===slug)),false);
});
test('lookup preserves abhor, standard, historical and author aliases without data projection mutation',()=>{
  for(const q of ['abhor','恶','骇','horrēre','火'])assert.equal(api.lookup(dataset,q).entry.slug,'abhor');
  assert.equal(entry.featured_mapping.target,'火');
});
