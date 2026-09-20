const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js');
const data=require('../data/language-book.v1.0.json'),{legacyEntry}=require('./legacy-research-view.cjs');
const base='5ed87f6b6d2aa99523368bd26aa4c7d43b8deb3b',slugs=['abandon','abhor','abdicate','aberrant'];
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:30e6});
const entries=slugs.map(s=>require(`../data/entries/${s}.v1.json`));
test('only four approved entries migrate; every existing research field survives exactly',()=>{
 const before=JSON.parse(get('data/language-book.v1.0.json'));
 assert.deepEqual(data.entries.filter(e=>!slugs.includes(e.slug)),before.entries.filter(e=>!slugs.includes(e.slug)));
 for(const e of entries){
  assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.slug===e.slug));
  assert.deepEqual(data.entries.find(x=>x.slug===e.slug),e);
  assert.deepEqual(model.validate(e),[]);assert.equal(model.isPilot(e),true);
 }
 for(const dir of ['data/entries','words'])for(const name of fs.readdirSync(dir)){
  if(slugs.some(s=>name===s+'.v1.json'||name===s+'.html'))continue;
  if(!name.endsWith('.json')&&!name.endsWith('.html'))continue;
  const p=dir+'/'+name;
  assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p).replace(/\r\n/g,'\n'),p);
 }
 assert.equal(fs.readFileSync('data/language-book-entry.schema.v1.json','utf8').replace(/\r\n/g,'\n'),get('data/language-book-entry.schema.v1.json').replace(/\r\n/g,'\n'),'no schema expansion needed');
});
test('source stages, selected mappings, candidates and card counts are distinct',()=>{
 const expected=[[4,2,3,1],[3,2,3,2],[3,2,2,2],[3,3,4,2]];
 entries.forEach((e,i)=>{const d=e.diachronic_semantic_mapping;assert.deepEqual([d.historical_stages.length,d.mappings.length,d.mappings.flatMap(m=>m.candidates).length,d.display_selection.stage_cards.length],expected[i]);
  for(const c of d.mappings.flatMap(m=>m.candidates)){assert.equal(c.historical_relation.status,'Not claimed');assert.ok(!('total' in c.semantic_fit));assert.ok(!('total' in c.phonetic_fit));}
 });
 const abandon=entries[0].diachronic_semantic_mapping;
 assert.deepEqual(abandon.historical_stages.filter(s=>s.mapping_selection==='not_selected').map(s=>s.stage_id),['a-bandon','abandonner']);
 const err=entries[3].diachronic_semantic_mapping;
 assert.equal(err.mappings[0].search.status,'pending');assert.ok(err.mappings[0].candidates.every(c=>c.role==='meaning_control'));
 for(const s of err.historical_stages)assert.ok(!s.relations.some(r=>r.from_stage_ref==='ERROR'),'err must not become an ancestor of aberrant');
 assert.equal(err.historical_stages.find(s=>s.stage_id==='ERROR').relations[0].relation_type,'related_family');
 assert.equal(err.historical_stages.find(s=>s.stage_id==='MODERN-ABERRANT').relations[0].from_stage_ref,'LATIN-WANDER');
});
test('Featured choices resolve without upgrading evidence or conflating temporal layers',()=>{
 assert.deepEqual(entries.map(e=>model.featured(e).target.form),['放','火','啼','讹']);
 const huo=model.featured(entries[1]);assert.equal(huo.target.lexical_layer,'Dialect');assert.ok(huo.target.pronunciations[0].phonological_layer.includes('not dialect audio'));assert.equal(huo.evidence[0].status,'pending');
 assert.equal(model.featured(entries[2]).comparison.source_stage_ref,'dicare');
 assert.equal(model.featured(entries[3]).comparison.source_stage_ref,'ERROR');
 const ban=entries[0].diachronic_semantic_mapping.mappings[0].candidates[0];assert.equal(ban.comparison.source_pronunciation_ref,null);assert.equal(ban.phonetic_fit.fit,'not_evaluated');
 for(const alter of [e=>e.featured_mapping.candidate_ref='missing',e=>e.featured_mapping.target='错',e=>model.featured(e).decision='rejected',e=>model.featured(e).role='sound_control']){
  const e=structuredClone(entries[0]);alter(e);assert.ok(model.validate(e).length);
 }
 const abe=require('../data/entries/abeyance.v1.json');assert.equal(model.featured(abe),null);assert.equal(model.renderFeatured(abe),'');
});
test('active-model aliases still use original identities and translations',()=>{
 for(const [i,terms] of [['0',['abandon','bandon','放','办','权柄']],['1',['abhor','火','恶','骇','horrēre']],['2',['abdicate','退位','啼','谛','dicāre']],['3',['aberrant','err','讹','errāre']]])for(const q of terms)assert.equal(api.lookup(data,q).entry?.id,entries[i].id,q);
 for(const e of entries){const cards=model.renderCards(e,'#research');assert.equal((cards.match(/diachronic-stage-card/g)||[]).length,e.diachronic_semantic_mapping.display_selection.stage_cards.length);assert.match(model.renderFeatured(e),/featured-boundary/);}
 assert.ok(!model.renderCards(entries[3],'#research').includes('Stage candidate: 游'));
});
test('page build is deterministic and preserves original research and literary paragraphs',()=>{
 const pages=entries.map(e=>fs.readFileSync(e.page,'utf8'));
 cp.execFileSync(process.execPath,['scripts/build-legacy-migration-pilot.mjs']);
 entries.forEach((e,i)=>{
  const page=fs.readFileSync(e.page,'utf8');assert.equal(page,pages[i]);
  assert.equal((page.match(/<h1>/g)||[]).length,1);assert.match(page,/id="research"/);
  const old=get(e.page);
  // Original blocks survive byte-for-byte; only their enclosing headings/wrappers move.
  for(const block of old.match(/<(?:p|blockquote)\b[^>]*>[\s\S]*?<\/(?:p|blockquote)>/g)||[])assert.ok(page.includes(block),`${e.slug}: lost original paragraph ${block.slice(0,90)}`);
  for(const m of old.matchAll(/id="([^"]+)"/g))assert.ok(page.includes(m[0]),`${e.slug}: lost anchor ${m[1]}`);
 });
});
