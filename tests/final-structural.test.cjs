const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto');
const data=require('../data/language-book.v1.0.json'),renderer=require('../js/second-pipeline.js'),api=require('../js/language-book-data.js');
const scope=['form','sign','press','above','light'],base='c0cab379544cc6f55db6daecb6e3a694347415e9';
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:40e6});
test('Final structural scope: five only, exact reversible archive and unchanged schema',()=>{
 const old=JSON.parse(get('data/language-book.v1.0.json'));
 assert.deepEqual(data.entries.filter(e=>!scope.includes(e.slug)),old.entries.filter(e=>!scope.includes(e.slug)));
 assert.equal(data.entries.length,42);assert.equal(data.entries.filter(e=>e.diachronic_semantic_mapping?.model_version==='0.1'||renderer.isPilot(e)).length,42);
 assert.equal(fs.readFileSync('data/language-book-entry.schema.v1.json','utf8').replace(/\r\n/g,'\n'),get('data/language-book-entry.schema.v1.json').replace(/\r\n/g,'\n'));
 for(const slug of scope){const e=data.entries.find(x=>x.slug===slug),o=old.entries.find(x=>x.slug===slug);assert.deepEqual(require('./legacy-research-view.cjs').legacyEntry(e),o);assert.deepEqual(e.source,o.source);assert.deepEqual(e.literary_layer,o.literary_layer);assert.equal(e.mapping_level,o.mapping_level);}
 for(const e of old.entries.filter(x=>x.legacy_migration?.version==='second-pipeline-0.1'))assert.equal(renderer.render(e),renderer.render(data.entries.find(x=>x.id===e.id)));
});
test('Final structural gate: schema, editorial contract and independent Pending states',async()=>{
 const {validateSchema}=await import('../scripts/validate-schema.mjs');const {validateFinalStructural}=await import('../scripts/validate-final-structural.mjs');
 assert.ok(validateSchema(data),JSON.stringify(validateSchema.errors));assert.deepEqual(validateFinalStructural(data),[]);
 for(const slug of scope){const e=data.entries.find(x=>x.slug===slug);assert.equal(e.featured_mapping_status,'Pending');assert.ok(!e.featured_mapping);assert.equal(e.historical_relation_status,'Not claimed');assert.ok(e.semantic_associations.length<=3);assert.ok(e.semantic_associations.every(a=>a.is_etymological===false));assert.ok(e.research_candidate_discovery.candidates.every(c=>c.historical_relation==='Not claimed'));}
 const l=data.entries.find(e=>e.slug==='light');assert.ok(l.hypotheses.every(h=>h.status==='Untested'));assert.ok(l.experiments.every(e=>e.status==='Untested'&&Object.keys(e.metrics).length===0));
});
const mutations=[
 ['farm ancestry','form',e=>e.research_candidate_discovery.historical_path='farm → form'],
 ['transformation promoted to chronology','form',e=>e.semantic_associations[1].is_etymological=true],
 ['cognition ancestor of sign','sign',e=>e.research_candidate_discovery.stages[0].form='cognoscere → sign'],
 ['symbolic operation promoted to fact','sign',e=>e.semantic_associations[1].status='Established'],
 ['physical-first chronology','press',e=>e.research_candidate_discovery.historical_path='Physical force always historically precedes urgency'],
 ['pressure implies fear','press',e=>e.primary_mapping.meaning.en='Press proves peur and 怕'],
 ['protocol as etymology','above',e=>e.semantic_associations[1].is_etymological=true],
 ['unconditional above equals up','above',e=>e.primary_mapping.gloss.en='above = up in all senses'],
 ['lux as intermediate','light',e=>e.evidence.Historical.items[1].chain.splice(2,0,'Latin lux')],
 ['poem as historical evidence','light',e=>e.evidence.Historical.items.push({claim:'The poem proves the common origin of light and 籁',status:'Established',source_refs:['SRC-RUGUANG-TIANLAI']})],
 ['L hypothesis supported','light',e=>e.hypotheses[1].status='Supported'],
 ['untested experiment supported','light',e=>e.experiments[0].status='Supported'],
 ['poetry validates phonetics','light',e=>e.evidence['Phonetic-Semantic'].status='Established'],
 ['Pending print evidence upgraded','form',e=>e.research_candidate_discovery.candidates[0].evidence_status='Verified mainland print page'],
 ['forced Featured','above',e=>e.featured_mapping_status='Selected'],
 ['common origin','press',e=>e.historical_relation_status='Established'],
 ['archive erased','sign',e=>delete e.legacy_migration]
];
for(const [name,slug,mutate] of mutations)test('Final structural REJECTS '+name,async()=>{
 const {validateSchema}=await import('../scripts/validate-schema.mjs'),{validateFinalStructural}=await import('../scripts/validate-final-structural.mjs');const d=structuredClone(data);mutate(d.entries.find(e=>e.slug===slug));assert.ok(validateSchema(d),'mutation must be structurally valid to test Layer 2');assert.ok(validateFinalStructural(d).length>0);
});
test('Final structural REJECTS stale external LIGHT evidence chain',async()=>{
 const {validateFinalStructural}=await import('../scripts/validate-final-structural.mjs');const b=structuredClone(require('../data/evidence/etymology/light-lai.v0.1.json'));b.tracks[1].chain.splice(2,0,'Latin lux');assert.ok(validateFinalStructural(data,b).length);
});
test('Final structural reader: five pages, Mapper, search and intact literature',()=>{
 for(const slug of scope){const e=api.lookup(data,slug).entry;assert.equal(e.slug,slug);assert.ok(renderer.isPilot(e));assert.match(renderer.render(e),/Featured Mapping: Pending/);assert.match(renderer.render(e),/Counterinterpretation/);assert.match(renderer.card(e),/Pending/);const html=fs.readFileSync(e.page,'utf8');assert.equal((html.match(/class="classification-object csl-layer"/g)||[]).length,e.semantic_associations.length);assert.match(html,/Featured Mapping: Pending/);assert.match(html,/① Literary/);assert.match(html,/⑩ Community/);}
 const f=require('../data/review/final-structural-page-fragments.v1.json').light,html=fs.readFileSync('words/light.html','utf8');assert.ok(html.includes(f.literary));assert.equal(crypto.createHash('sha256').update(f.literary).digest('hex'),f.literary_sha256);assert.ok(f.original_page.includes(f.literary));assert.ok((html.match(/class="literary-pair/g)||[]).length>=20);assert.match(html,/Music of Heaven, Like Light/);
});
