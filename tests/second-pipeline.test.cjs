const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const data=require('../data/language-book.v1.0.json'),renderer=require('../js/second-pipeline.js'),api=require('../js/language-book-data.js');
const scope=['at','figure','new','water','namcha-barwa'],base='f35857436a743045645c1e8f06afb932bbc4db63';
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:40e6}).replace(/\r\n/g,'\n');
let cachedOriginal;const baseline=()=>cachedOriginal ||= JSON.parse(get('data/language-book.v1.0.json'));
test('Second pipeline changes only five entries; unchanged schema and experiments',()=>{
 assert.equal(data.entries.length,42);
 assert.deepEqual(data.entries.filter(e=>!scope.includes(e.slug)),baseline().entries.filter(e=>!scope.includes(e.slug)));
 assert.equal(fs.readFileSync('data/language-book-entry.schema.v1.json','utf8').replace(/\r\n/g,'\n'),get('data/language-book-entry.schema.v1.json'));
 for(const file of cp.execFileSync('git',['ls-files','experiments/002'],{encoding:'utf8'}).trim().split('\n'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),get(file),file);
 assert.equal(data.entries.filter(e=>e.diachronic_semantic_mapping?.model_version==='0.1').length,28);
 assert.equal(data.entries.filter(renderer.isPilot).length,5);
 assert.equal(42-28-5,9);
});
test('Frozen schema-valid dataset passes independent editorial gate',async()=>{
 const {validateEditorial}=await import('../scripts/validate-second-pipeline.mjs');
 const {validateSchema}=await import('../scripts/validate-schema.mjs');
 assert.ok(validateSchema(data),JSON.stringify(validateSchema.errors));assert.deepEqual(validateEditorial(data),[]);
});
test('Layer 1 rejects missing required fields and invalid evidence enums',async()=>{
 const {validateSchema}=await import('../scripts/validate-schema.mjs');
 const missing=structuredClone(data);delete missing.entries.find(e=>e.slug==='at').primary_mapping.target;
 assert.equal(validateSchema(missing),false);
 const invalid=structuredClone(data);invalid.entries.find(e=>e.slug==='water').evidence.Historical.status='Inconclusive';
 assert.equal(validateSchema(invalid),false,'Inconclusive belongs to experiment result, not the historical evidence enum');
});
const mutations=[
 ['AT literature promoted to history','at',e=>{e.evidence.Historical.items.push({claim:{en:'在 → 爱 proves etymology','zh-Hans':'文学证明词源'},status:'Supported',confidence:'High',source_refs:[]});}],
 ['NEW culture promoted to etymology','new',e=>{e.semantic_associations[1].is_etymological=true;e.semantic_associations[1].status='Supported';}],
 ['WATER entry promoted to experiment support','water',e=>{e.experiments[0].status='Supported';}],
 ['NAMCHA poetry promoted to factual name etymology','namcha-barwa',e=>{e.evidence.Historical.items.push({claim:{en:'Poem proves the sole etymology','zh-Hans':'诗歌证明唯一词源'},status:'Established',confidence:'High',source_refs:[]});}],
 ['Tibetan draft promoted to reviewed','namcha-barwa',e=>{e.literary_layer.translations.find(t=>t.language_code==='bo').status='Reviewed';}],
 ['FIGURE Pending silently promoted','figure',e=>{e.featured_mapping_status='Reviewed';}],
 ['Transformation reinterpreted as chronology','figure',e=>{e.semantic_associations[1].relation='Verified historical sequence: Concept → Representation → Geometry → Symbol';}],
 ['Experimental endpoint broadened','water',e=>{e.experiments[0].title.en='W means all LIQUID';}],
 ['Frozen entry removed','at',(e,d)=>{d.entries=d.entries.filter(x=>x.slug!=='at');}],
 ['Freeze membership bypass','water',e=>{delete e.legacy_migration;}],
 ['Cross-language common origin','new',e=>{e.historical_relation_status='Established';}],
 ['Unresolved evidence reference','figure',e=>{e.evidence.Cognitive.source_refs.push('NONEXISTENT');}]
];
for(const [name,slug,mutate]of mutations)test(`Editorial validator REJECTS: ${name}`,async()=>{
 const {validateEditorial}=await import('../scripts/validate-second-pipeline.mjs');
 const {validateSchema}=await import('../scripts/validate-schema.mjs');
 const bad=structuredClone(data);mutate(bad.entries.find(e=>e.slug===slug),bad);
 assert.ok(validateSchema(bad),'negative fixture should be schema-valid: '+JSON.stringify(validateSchema.errors));
 assert.ok(validateEditorial(bad).length>0,'editorial gate must reject schema-valid unauthorized claim');
});
test('Five archives exactly restore baseline and preserve literature, sources and evidence grades',()=>{
 for(const slug of scope){const e=data.entries.find(x=>x.slug===slug),old=baseline().entries.find(x=>x.slug===slug),restored=structuredClone(e),a=e.legacy_migration;
  assert.equal(a.baseline_commit,base);Object.assign(restored,a.previous_fields);for(const k of a.previously_absent_fields)delete restored[k];delete restored.legacy_migration;assert.deepEqual(restored,old);
  assert.deepEqual(e.literary_layer,old.literary_layer);assert.deepEqual(e.evidence,old.evidence);assert.deepEqual(e.experiments,old.experiments);assert.equal(e.mapping_level,old.mapping_level);assert.equal(e.entry_status,old.entry_status);
 }
});
test('Reader/Mapper/dictionary preserve five scoped identities and all pending boundaries',()=>{
 for(const slug of scope){const e=data.entries.find(x=>x.slug===slug),html=renderer.render(e),card=renderer.card(e);assert.ok(api.lookup(data,slug).entry);assert.match(html,/Historical Relation: Not claimed/);assert.match(html,/Research \/ Evidence/);assert.ok(card.includes(e.standard_translation.target.replace(/&/g,'&amp;')));
  if(slug==='figure'){assert.match(html,/Featured Mapping: Pending/);assert.match(html,/NOT historical chronology/);}
  if(slug==='water')assert.match(html,/Tested-Inconclusive/);
  if(slug==='namcha-barwa')assert.match(html,/Translation Draft \/ Native review pending/);
 }
});
test('Static pages are deterministic, literature unchanged and deployment invokes both gates',()=>{
 cp.execFileSync(process.execPath,['scripts/build-second-pipeline.mjs','--check']);
 const fragments=require('../data/review/second-pipeline-page-fragments.v1.json');
 for(const [slug,f]of Object.entries(fragments))assert.ok(fs.readFileSync(`words/${slug}.html`,'utf8').includes(f.literary));
 const build=fs.readFileSync('scripts/publication-build.mjs','utf8');assert.match(build,/validate-schema/);assert.match(build,/validate-language-book/);assert.match(build,/second-pipeline.test/);
 assert.match(fs.readFileSync('scripts/validate-language-book-v1.mjs','utf8'),/validateEditorial\(dataset\)/);
});
