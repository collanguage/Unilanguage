const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js'),{legacyEntry}=require('./legacy-research-view.cjs');
const base='be8bc2dcb1d3f517ba41bbaa2dacc8574335565b',slugs=['media','aback','sound'];
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:40e6}).replace(/\r\n/g,'\n');
const current=require('../data/language-book.v1.0.json'),data={...current,entries:current.entries.map(e=>['tier-c-batch2-0.1','tier-c-batch3-0.1','tier-c-final-a-0.1'].includes(e.legacy_migration?.version)?legacyEntry(e):e)},before=JSON.parse(get('data/language-book.v1.0.json'));
const es=slugs.map(s=>data.entries.find(e=>e.slug===s));
test('Pending batch changes only three entries; other 39 entries and pages/schema remain exact',()=>{
 assert.deepEqual(data.entries.filter(e=>!slugs.includes(e.slug)),before.entries.filter(e=>!slugs.includes(e.slug)));
 for(const dir of ['data/entries','words'])for(const f of fs.readdirSync(dir)){
  if([...slugs,'abridge','aliment','acumen','abound','sky','language','advance','generate','absolute','a-indefinite-article'].some(s=>f===s+'.html'||f===s+'.v1.json'))continue;
  const p=dir+'/'+f;if(fs.statSync(p).isFile())assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 }
 for(const p of ['data/language-book-entry.schema.v1.json','js/diachronic-mapping.js','js/language-book-data.js','js/search.js','semantic-mapper.html','dictionary.html','search.html'])assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 const renderer=fs.readFileSync('js/semantic-mapper.js','utf8').replace(/\r\n/g,'\n');
 const addition='${entry.legacy_migration?.version === "pending-final-0.1" && !featured ? "<p>Featured Mapping is optional. Pending 是有效研究结果，不是页面错误。</p>" : ""}';
 assert.ok(renderer.includes(addition));assert.equal(renderer.replace(addition,''),get('js/semantic-mapper.js'));
 es.forEach(e=>{assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.id===e.id));assert.deepEqual(model.validate(e),[]);assert.deepEqual(e,require('../data/entries/'+e.slug+'.v1.json'));});
});
test('MEDIA bridge Candidate is not promoted; mad and English middle never become ancestor stages',()=>{
 const e=es[0],b=before.entries.find(x=>x.slug==='media'),f=model.featured(e),d=e.diachronic_semantic_mapping;
 assert.equal(e.standard_translation.target,'媒体');assert.equal(f.target.form,'媒');assert.equal(f.target.pronunciations[0].value,'méi');assert.equal(f.semantic_fit.fit,'partial');assert.equal(f.phonetic_fit.fit,'weak');
 assert.equal(e.mapping_level,b.mapping_level);assert.deepEqual(e.evidence,b.evidence);
 assert.deepEqual(d.historical_stages.map(s=>s.form),['medius / medium','medium','media']);
 assert.equal(e.historical_family_comparisons[0].form,'middle');assert.equal(e.historical_family_comparisons[0].not_ancestor,true);
 assert.equal(e.rejected_historical_family_observations[0].form,'mad');
 assert.ok(!d.historical_stages.some(s=>s.form==='mad'||s.form==='middle'));
});
test('ABACK and SOUND can be Published with Featured Pending; semantic candidates remain separate',()=>{
 for(const e of es.slice(1)){
  assert.equal(e.entry_status,'Published');assert.equal(e.publication_status,'Published');assert.equal(e.featured_mapping_status,'Pending');assert.equal(e.featured_mapping,undefined);assert.equal(model.featured(e),null);
  assert.match(model.headline(e),/Featured Mapping: Pending/);assert.equal(model.renderFeatured(e),'');
  const invalid=structuredClone(e);invalid.featured_mapping={target:'错误'};assert.ok(model.validate(invalid).some(s=>s.includes('Pending Featured')));
 }
 const a=es[1].diachronic_semantic_mapping;
 assert.equal(a.mappings.find(m=>m.stage_ref==='A3').candidates.some(c=>c.target.form==='背'),false);
 assert.equal(a.mappings.find(m=>m.stage_ref==='A1').candidates.find(c=>c.target.form==='背').comparison.source_stage_ref,'A1');
 assert.equal(a.mappings.find(m=>m.stage_ref==='A2').search.status,'pending');assert.equal(a.mappings.find(m=>m.stage_ref==='A2').candidates.length,0);
 const s=es[2],d=s.diachronic_semantic_mapping;
 assert.equal(s.standard_translation.target,'声音');assert.equal(s.mapping_status,'Supported'); // Applies to lexical semantics, not Featured.
 assert.equal(d.mappings.find(m=>m.stage_ref==='S-A3').candidates.find(c=>c.target.form==='声').semantic_fit.fit,'direct');
 assert.equal(d.mappings.find(m=>m.stage_ref==='S-A3').candidates.find(c=>c.target.form==='嗓').decision,'reserved');
 for(const id of ['S-H','S-P','S-W'])assert.deepEqual(d.historical_stages.find(s=>s.stage_id===id).relations,[]);
 for(const st of d.historical_stages.filter(s=>s.stage_id.startsWith('S-A')))assert.ok(st.relations.every(r=>r.from_stage_ref.startsWith('S-A')));
 assert.equal(s.lexical_identities.filter(i=>i.identity_id.startsWith('SOUND-')).length,4);
});
test('39 Discovery rows, negative controls and rejected candidates survive without new discovery',()=>{
 const discovery=require('../data/review/pending-final-discovery.json');
 assert.equal(es.flatMap(e=>e.research_candidate_discovery.candidates).length,39);
 es.forEach(e=>{
  assert.deepEqual(e.research_candidate_discovery.candidates,discovery.candidates.filter(c=>c.entry===e.slug.toUpperCase()));
  for(const c of e.diachronic_semantic_mapping.mappings.flatMap(m=>m.candidates)){
   assert.equal(c.historical_relation.status,'Not claimed');assert.ok(c.evidence.some(v=>v.status==='pending'));assert.ok(!('total' in c.semantic_fit));
   if(!c.comparison.source_pronunciation_ref)assert.equal(c.phonetic_fit.fit,'not_evaluated');
  }
 });
 assert.equal(discovery.candidates.filter(c=>c.retrieval_route==='expansion').length,10);
 assert.equal(discovery.candidates.filter(c=>c.retrieval_route==='expansion'&&c.decision==='rejected').length,4);
});
test('Reader budget, old literary prose/anchors and deterministic build',()=>{
 const expected=[[3,3,12,1],[3,3,12,2],[6,3,15,2]];
 const snapshots=slugs.map(s=>fs.readFileSync('words/'+s+'.html','utf8'));
 cp.execFileSync(process.execPath,['scripts/build-pending-final.mjs']);
 es.forEach((e,i)=>{
  const d=e.diachronic_semantic_mapping;assert.deepEqual([d.historical_stages.length,d.mappings.length,d.mappings.flatMap(m=>m.candidates).length,d.display_selection.stage_cards.length],expected[i]);
  const h=fs.readFileSync(e.page,'utf8');assert.equal(h,snapshots[i]);assert.equal((h.match(/<h1[ >]/g)||[]).length,1);
  if(e.slug!=='media')for(const p of get(e.page).match(/<(?:p|blockquote)\b[^>]*>[\s\S]*?<\/(?:p|blockquote)>/g)||[])assert.ok(h.replace(/\r\n/g,'\n').includes(p),'archived paragraph lost '+e.slug);
  if(e.slug!=='media')for(const m of get(e.page).matchAll(/id="([^"]+)"/g))assert.ok(h.includes(m[0]),'anchor lost');
 });
 const snap=fs.readFileSync('data/language-book.v1.0.json','utf8');cp.execFileSync(process.execPath,['scripts/build-language-book-v1.mjs']);assert.equal(fs.readFileSync('data/language-book.v1.0.json','utf8'),snap);
});
test('Lookup resolves Pending entries and all 18 migrations coexist without touching C/D',()=>{
 for(const s of slugs){const e=api.lookup(data,s).entry;assert.equal(e.slug,s);assert.deepEqual(model.validate(e),[]);}
 assert.equal(data.entries.length,42);assert.equal(data.entries.filter(e=>model.isPilot(e)).length,18);
 const remaining=data.entries.filter(e=>!model.isPilot(e));assert.equal(remaining.length,24);assert.ok(remaining.every(e=>!slugs.includes(e.slug)));
});
