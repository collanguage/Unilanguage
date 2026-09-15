const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const e=require('../data/entries/horse.v1.json');
const data=require('../data/language-book.v1.0.json');
const api=require('../js/language-book-data.js');
const page=fs.readFileSync(path.join(root,'words/horse.html'),'utf8');
const baseline='443b57199ecdb6c1c86c777cc09cc8b83ddcc0c2';
test('HORSE remains additive while the focused ABHOR record may advance independently',()=>{
 const before=JSON.parse(cp.execFileSync('git',['show',baseline+':data/language-book.v1.0.json'],{cwd:root,maxBuffer:12*1024*1024}));
 assert.equal(data.entries.length,42);
 assert.deepEqual(data.entries.filter(x=>!['aberrant','horse','abhor','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(x.slug)),before.entries.filter(x=>!['aberrant','abhor','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(x.slug)));
 assert.deepEqual(data.entries.find(x=>x.slug==='horse'),e);
 for(const f of ['words/horizon.html','data/entries/horizon.v1.json'])assert.equal(fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n'),cp.execFileSync('git',['show',baseline+':'+f],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n'),f);
 assert.equal(e.provenance.baseline_horse_entry_count,0);
});
test('HORSE translation is 马 while the cultural mapping has independent Candidate status',()=>{
 assert.equal(e.primary_mapping.target.word,'马');
 assert.equal(e.primary_mapping.target.pronunciation,'mǎ');
 assert.equal(e.translation_status,'Supported');
 assert.equal(e.featured_mapping.target,'马');
 assert.equal(e.featured_mapping.status,'Supported');
 assert.equal(e.entry_status,'Published');
 assert.equal(e.mapping_status,'Candidate');
 assert.equal(e.mapping_level,'D');
 assert.equal(e.cultural_classification_mapping.direct_lexical_equivalence,false);
 assert.equal(e.historical_relation_status,'Not claimed');
 assert.equal(e.cultural_classification_mapping.historical_relation,'Not claimed');
 assert.match(page,/<h1>HORSE ·\s*<span lang="zh-Hans">马 mǎ<\/span>\s*<\/h1>/);
 assert.doesNotMatch(page,/<h1>[^<]*horse\s*↔\s*火/i);
});
test('HORSE independently sourced Chinese links are typed and do not become etymology',()=>{
 const c=e.cultural_classification_mapping;
 assert.deepEqual(c.links.map(x=>[x.source,x.target]),[['马','午'],['午','火']]);
 assert.notEqual(c.links[0].system,c.links[1].system);
 for(const edge of c.links){assert.equal(edge.evidence_status,'Supported');assert.ok(edge.source_refs.includes('HS-CHEN'));assert.ok(!edge.source_refs.includes('HS-AUTHOR'));}
 assert.ok(c.links[0].source_refs.includes('HS-FMPRC'));
 assert.ok(c.links[0].source_refs.includes('HS-NMC'));
 assert.ok(c.links[1].source_refs.includes('HS-SHNU'));
 assert.ok(!c.links[0].source_refs.includes('HS-SHNU'));
 assert.ok(!c.links[1].source_refs.includes('HS-FMPRC'));
 assert.match(c.historical_boundary,/生年生肖/);
 assert.match(page,/王充.*反驳/);
 assert.equal(e.literary_layer.is_historical_evidence,false);
 assert.ok(e.pending_evidence.length>=2);
 const ids=new Set(e.references.map(x=>x.reference_id));
 function visit(v){if(!v||typeof v!=='object')return;for(const [k,x]of Object.entries(v)){if(k==='source_refs'||k==='translation_source_refs'){for(const id of x)assert.ok(ids.has(id),id);}else visit(x);}}
 visit(e);
});
test('HORSE history excludes HORR and HORIZON families and cultural facts add no scores',()=>{
 assert.match(e.evidence.Historical.summary.en,/Old English hors/);
 assert.match(e.evidence.Historical.summary.en,/unknown/);
 for(const word of ['horror','abhor','horizon','horizontal'])assert.ok(e.historical_family.excluded.includes(word));
 assert.ok(!e.historical_family.members.includes('horizon'));
 assert.equal(e.cross_entry_control.historical_families_distinct,true);
 assert.deepEqual(e.phonetic_observation.map(x=>[x.target,x.rating.score,x.cultural_bonus]),[['火',5,0],['马',1,0]]);
 assert.equal(e.cultural_classification_mapping.phonetic_bonus,0);
 assert.equal(e.cultural_classification_mapping.historical_bonus,0);
 assert.equal(e.mapping_assessment.historical_score,null);
 assert.equal(e.mapping_assessment.total,e.mapping_assessment.dimensions.reduce((a,x)=>a+x.score,0));
 assert.deepEqual(e.experiments,[]);
 assert.match(page,/Planned-Not tested/);
});
test('HORSE resolves in dictionary/search/Mapper and all page and manifest references exist',()=>{
 for(const q of ['horse','HORSE','马','mǎ','午马','午火']){const v=api.lookup(data,q);assert.equal(v.entry.slug,'horse',q);assert.equal(api.queryView(v.entry,q).primary_mapping.target.word,'马');}
 for(const f of ['index.html','english.html','chinese.html','french.html','sitemap.xml'])assert.match(fs.readFileSync(path.join(root,f),'utf8'),/words\/horse.html/);
 const ids=['literature','basic-meaning','multilingual','etymology','mapping','justification','protocol-references','translation-protocol','examples','community'];
 const pos=ids.map(id=>page.indexOf(`id="${id}"`));assert.ok(pos.every((v,i)=>v>=0&&(!i||v>pos[i-1])));
 for(const [,href]of page.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(href.startsWith('#'))assert.ok(page.includes(`id="${href.slice(1)}"`),href);
  else if(!/^https?:/.test(href))assert.ok(fs.existsSync(path.resolve(root,'words',href.split(/[?#]/)[0])),href);
 }
 const m=require('../data/product-manifest.v1.0.json');assert.equal(m.entry_count,42);
 for(const f of ['words/horse.html','data/entries/horse.v1.json','docs/research/horse-source-audit-v1.md','tests/horse.test.cjs'])assert.ok(m.files.some(x=>x.path===f),f);
});
