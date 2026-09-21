const {beforeSecondPipeline,stripSecondPipeline,isSecondPipelineFile}=require('./second-pipeline-compat.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js'),{legacyEntry}=require('./legacy-research-view.cjs');
const base='dcfc3dc3f6ae5424beb61ef22b6f55ca3ecebde2',slugs=['horizon','horse'];
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:30e6}).replace(/\r\n/g,'\n');
const data=beforeSecondPipeline(require('../data/language-book.v1.0.json')),before=JSON.parse(get('data/language-book.v1.0.json'));
const es=slugs.map(s=>data.entries.find(e=>e.slug===s));
test('Final batch changes exactly two records and preserves other pages, schema and UI',()=>{
 assert.deepEqual(data.entries.filter(e=>!slugs.includes(e.slug)).map(e=>["media","aback","sound","abridge","aliment","acumen","abound","sky","language","advance","generate","absolute","a-indefinite-article"].includes(e.slug)?legacyEntry(e):e),before.entries.filter(e=>!slugs.includes(e.slug)));
 for(const dir of ['data/entries','words'])for(const file of fs.readdirSync(dir)){
  if(isSecondPipelineFile(file))continue;
  if([...slugs,"media","aback","sound","abridge","aliment","acumen","abound","sky","language","advance","generate","absolute","a-indefinite-article"].some(s=>file===s+'.html'||file===s+'.v1.json'))continue;
  const p=dir+'/'+file;if(fs.statSync(p).isFile())assert.equal(stripSecondPipeline(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),get(p),p);
 }
 for(const p of ['data/language-book-entry.schema.v1.json','js/diachronic-mapping.js','js/language-book-data.js','js/search.js','semantic-mapper.html','dictionary.html','search.html'])assert.equal(stripSecondPipeline(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),get(p),p);
 es.forEach(e=>{assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.id===e.id));assert.deepEqual(model.validate(e),[]);assert.deepEqual(e,require('../data/entries/'+e.slug+'.v1.json'));});
});
test('HORIZON separates DELIMIT Featured from modern translation and visual fire',()=>{
 const e=es[0],d=e.diachronic_semantic_mapping,c=model.featured(e);
 assert.equal(e.standard_translation.target,'地平线');assert.equal(c.target.form,'划');assert.equal(c.target.pronunciations[0].value,'huà');assert.equal(c.comparison.source_stage_ref,'GREEK-DELIMIT');assert.equal(c.comparison.scope,'semantic_only');assert.equal(c.phonetic_fit.fit,'not_evaluated');
 assert.deepEqual(d.historical_stages.map(s=>s.form),['horizein','horizōn (kuklos)','horizon']);
 assert.equal(d.historical_stages[1].mapping_selection,'not_selected');
 const fire=d.mappings.flatMap(m=>m.candidates).find(c=>c.target.form==='火');assert.equal(fire.decision,'reserved');assert.match(fire.decision_reason,/Secondary Cultural/);assert.equal(fire.phonetic_fit.fit,'not_evaluated');assert.equal(e.secondary_associations[0].is_etymology,false);
 for(const q of ['horizon','划','huà','划界'])assert.equal(api.lookup(data,q).entry.slug,'horizon');
});
test('HORSE cultural systems and independent sound observation never become ancestry',()=>{
 const e=es[1],d=e.diachronic_semantic_mapping,cs=d.mappings[0].candidates;
 assert.equal(e.standard_translation.target,'马');assert.equal(model.featured(e).target.form,'马');
 assert.deepEqual(d.historical_stages.map(s=>s.form),['hors','horse']);assert.equal(d.historical_stages[0].mapping_selection,'not_selected');
 assert.deepEqual(e.cultural_classification_mapping.links.map(l=>[l.source,l.target]),[['马','午'],['午','火']]);assert.notEqual(e.cultural_classification_mapping.links[0].system,e.cultural_classification_mapping.links[1].system);
 for(const c of cs.filter(c=>c.family_key.startsWith('CHINESE-CULTURAL'))){assert.equal(c.comparison.scope,'semantic_only');assert.match(c.decision_reason,/Chinese Cultural Classification/);assert.equal(c.phonetic_fit.fit,'not_evaluated');}
 const sound=cs.find(c=>c.role==='sound_control');assert.equal(sound.semantic_fit.fit,'mismatch');assert.equal(sound.phonetic_fit.fit,'weak');assert.deepEqual(sound.phonetic_fit.source_refs,['HS-CAM','HS-HUO']);assert.equal(e.cultural_classification_mapping.phonetic_bonus,0);assert.equal(e.cultural_classification_mapping.historical_bonus,0);
 es.forEach(e=>{assert.equal(new Set(Object.values(e.cross_entry_control.families)).size,3);assert.match(e.cross_entry_control.rule,/No shared HOR/);for(const c of e.diachronic_semantic_mapping.mappings.flatMap(m=>m.candidates))assert.equal(c.historical_relation.status,'Not claimed');});
});
test('Reader limits, exact literary/archive preservation, photo and reproducible builds',()=>{
 const expected=[[3,2,3,1],[2,1,4,2]];
 const pages=slugs.map(s=>fs.readFileSync('words/'+s+'.html','utf8'));cp.execFileSync(process.execPath,['scripts/build-tier-b-final.mjs']);
 es.forEach((e,i)=>{const d=e.diachronic_semantic_mapping;assert.deepEqual([d.historical_stages.length,d.mappings.length,d.mappings.flatMap(m=>m.candidates).length,d.display_selection.stage_cards.length],expected[i]);
  const h=fs.readFileSync('words/'+e.slug+'.html','utf8');assert.equal(h,pages[i]);assert.equal((h.match(/<h1>/g)||[]).length,1);
  for(const m of get('words/'+e.slug+'.html').matchAll(/id="([^"]+)"/g))assert.ok(h.includes(m[0]));
  for(const p of get('words/'+e.slug+'.html').match(/<(?:p|blockquote)\b[^>]*>[\s\S]*?<\/(?:p|blockquote)>/g)||[])assert.ok(h.replace(/\r\n/g,'\n').includes(p),e.slug+' lost archived prose');
 });
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync('images/horizon-winter-literary.png')).digest('hex'),'2df146394413e5f2379c453420c0ed90525cdd446267e483582bd8168f3075ea');
 const snapshot=fs.readFileSync('data/language-book.v1.0.json','utf8');cp.execFileSync(process.execPath,['scripts/build-language-book-v1.mjs']);assert.equal(fs.readFileSync('data/language-book.v1.0.json','utf8'),snapshot);
});
test('Original Tier B ten-entry inventory is now migrated without evidence promotion',()=>{
 const tierB=['universe','human','abash','abbey','abbreviate','abbreviation','abdomen','abdominal','horizon','horse'];
 for(const s of tierB){const e=data.entries.find(e=>e.slug===s);assert.equal(e.diachronic_semantic_mapping.model_version,'0.1');assert.deepEqual(model.validate(e),[]);}
 es.forEach(e=>assert.ok(e.diachronic_semantic_mapping.mappings.flatMap(m=>m.candidates).every(c=>c.evidence.some(v=>v.status==='pending'))));
});
