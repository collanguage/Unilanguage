const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const data = require('../data/language-book.v1.0.json');
const e = require('../data/entries/horizon.v1.json');
const api = require('../js/language-book-data.js');
const page = fs.readFileSync(path.join(root,'words/horizon.html'),'utf8');
test('HORIZON is unique and translation remains separate from the creative Candidate', () => {
 assert.equal(data.entries.filter(x=>!['horse','abbreviation','abdominal'].includes(x.slug)).length,39);
 assert.equal(data.entries.filter(x=>x.slug==='horizon').length,1);
 assert.deepEqual(data.entries.find(x=>x.slug==='horizon'),e);
 assert.equal(e.entry_status,'Published');
 assert.equal(e.primary_mapping.target.word,'地平线');
 assert.equal(e.featured_mapping.target,'火');
 assert.equal(e.mapping_status,'Candidate');
 assert.equal(e.mapping_level,'D');
 assert.equal(e.mapping_assessment.dimensions[0].score,5);
 assert.equal(e.mapping_assessment.total,e.mapping_assessment.dimensions.reduce((n,x)=>n+x.score,0));
 assert.equal(e.historical_relation_status,'Not claimed');
 assert.equal(e.featured_mapping.historical_relation,'Not claimed');
 assert.equal(e.direct_lexical_semantic_equivalence,false);
 for(const term of ['horizon','地平线','看远方的地平线']) assert.equal(api.lookup(data,term).entry.slug,'horizon');
});
test('HORIZON rejects surface segmentation as etymology and separates ABHOR families',()=>{
 assert.equal(e.surface_segmentation_observation.is_etymological,false);
 assert.equal(e.surface_segmentation_observation.status,'Not etymology');
 assert.doesNotMatch(JSON.stringify(e.evidence.Historical),/hor\s*\+\s*zone/);
 assert.match(e.evidence.Historical.summary.en,/horos.*horizein.*Latin.*French.*Middle English/);
 assert.equal(e.cross_entry_control.historical_families_distinct,true);
 assert.match(e.cross_entry_control.claim.en,/horrēre/);
 assert.match(e.cross_entry_control.claim.en,/does not establish shared etymology/);
 assert.equal(e.hypotheses[0].counterexamples.length>=5,true);
 assert.equal(e.phonetic_observation[0].rating.UK,'Weak');
 for(const k of ['onset','vowel','rhoticity','glide','tone']) assert.ok(e.phonetic_observation[0].segments[k]);
 assert.match(e.phonetic_observation[0].segments.rhoticity,/both UK and US/);
});
test('HORIZON literary photo retains its exact bytes and cannot become historical evidence',()=>{
 assert.equal(e.literary_layer.is_historical_evidence,false);
 assert.equal(e.literary_layer.author,'Jinkai Liu');
 assert.ok(e.literary_layer.essay_prose[0].text['zh-Hans'].endsWith('到地平线的距离，其实并不远。'));
 const bytes=fs.readFileSync(path.join(root,e.media[0].path));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'2df146394413e5f2379c453420c0ed90525cdd446267e483582bd8168f3075ea');
 assert.equal(bytes.subarray(1,4).toString(),'PNG');
 assert.match(page,/images\/horizon-winter-literary.png/);
 assert.ok(!e.evidence.Historical.source_refs.includes('HZ-AUTHOR'));
 assert.equal(e.future_candidates[0].status,'Future Candidate');
 assert.equal(e.future_candidates[0].historical_relation,'Not claimed');
 assert.equal(e.raw_observations[0].is_evidence,false);
 assert.equal(data.entries.filter(x=>x.slug==='distance').length,0);
});
test('HORIZON page follows template order and all references, assets, indexes resolve',()=>{
 const ids=['literature','basic-meaning','multilingual','etymology','mapping','justification','protocol-references','translation-protocol','examples','community'];
 const pos=ids.map(id=>page.indexOf(`id="${id}"`));
 assert.ok(pos.every((v,i)=>v>=0&&(!i||v>pos[i-1])));
 const known=new Set(e.references.map(x=>x.reference_id));
 function visit(v){if(!v||typeof v!=='object')return;for(const [k,x] of Object.entries(v)){if(k==='source_refs'){for(const id of x)assert.ok(known.has(id),id);}else visit(x);}}
 visit(e);
 for(const f of ['index.html','english.html','chinese.html','french.html','sitemap.xml'])assert.match(fs.readFileSync(path.join(root,f),'utf8'),/words\/horizon.html/);
 for(const [,href] of page.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(href.startsWith('#'))assert.ok(page.includes(`id="${href.slice(1)}"`),href);
  else if(!/^https?:/.test(href))assert.ok(fs.existsSync(path.resolve(root,'words',href.split(/[?#]/)[0])),href);
 }
 const manifest=require('../data/product-manifest.v1.0.json');
 for(const f of ['words/horizon.html',e.media[0].path,'data/entries/horizon.v1.json'])assert.ok(manifest.files.some(x=>x.path===f),f);
});
