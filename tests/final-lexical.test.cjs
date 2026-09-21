const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const data=require('../data/language-book.v1.0.json'),model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js');
const scope=['convent','fil','marchand','montrer'],base='1388f4283b37179b4d5eaddc93257333ce21e1c8';
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:40e6}).replace(/\r\n/g,'\n');
test('Final lexical scope: four records only; all other 38 and schema unchanged',()=>{
 const data=require('./final-structural-compat.cjs').beforeFinalStructural(require('../data/language-book.v1.0.json'));
 const old=JSON.parse(get('data/language-book.v1.0.json'));
 assert.deepEqual(data.entries.filter(e=>!scope.includes(e.slug)),old.entries.filter(e=>!scope.includes(e.slug)));
 assert.equal(data.entries.length,42);
 assert.equal(data.entries.filter(e=>e.diachronic_semantic_mapping?.model_version==='0.1').length,32);
 assert.equal(data.entries.filter(e=>e.legacy_migration?.version==='second-pipeline-0.1').length,5);
 assert.equal(fs.readFileSync('data/language-book-entry.schema.v1.json','utf8').replace(/\r\n/g,'\n'),get('data/language-book-entry.schema.v1.json'));
 for(const slug of scope){const e=data.entries.find(x=>x.slug===slug),o=old.entries.find(x=>x.slug===slug);
  assert.deepEqual(require('./legacy-research-view.cjs').legacyEntry(e),o);
  assert.deepEqual(e.source,o.source);assert.deepEqual(e.evidence,o.evidence);assert.equal(e.mapping_level,o.mapping_level);
 }
});
test('Final lexical gate: schema and editorial validators accept bounded freeze',async()=>{
 const {validateSchema}=await import('../scripts/validate-schema.mjs');
 const {validateFinalLexical}=await import('../scripts/validate-final-lexical.mjs');
 assert.ok(validateSchema(data),JSON.stringify(validateSchema.errors));assert.deepEqual(validateFinalLexical(data),[]);
 for(const slug of scope){const e=data.entries.find(x=>x.slug===slug),d=e.diachronic_semantic_mapping;
  assert.deepEqual(model.validate(e),[]);assert.equal(e.featured_mapping_status,'Pending');assert.equal(d.display_selection.featured_candidate_ref,null);
  const cs=d.mappings.flatMap(m=>m.candidates);assert.equal(cs.filter(c=>c.role==='candidate').length,3);assert.equal(cs.filter(c=>c.role!=='candidate').length,2);
  assert.ok(cs.every(c=>c.historical_relation.status==='Not claimed'&&c.evidence.some(x=>x.status==='pending')));
 }
});
const mutations=[
 ['convention placed in convent ancestry','convent',e=>e.diachronic_semantic_mapping.historical_stages[2].form='convention'],
 ['fille placed in thread ancestry','fil',e=>e.diachronic_semantic_mapping.historical_stages[0].form='filia / fille'],
 ['marcher substituted as merchant source','marchand',e=>e.diachronic_semantic_mapping.historical_stages[0].form='marcher'],
 ['reconstructed Latin promoted to attested','marchand',e=>e.diachronic_semantic_mapping.historical_stages[1].attestation_status='attested'],
 ['monitor placed in montrer ancestry','montrer',e=>e.diachronic_semantic_mapping.historical_stages[0].form='monitor'],
 ['forced Featured winner','fil',e=>e.featured_mapping_status='Supported'],
 ['paper Pending promoted to direct','fil',e=>e.diachronic_semantic_mapping.mappings[0].candidates[0].evidence[2].status='direct'],
 ['consonant group used as semantic proof','marchand',e=>e.diachronic_semantic_mapping.mappings[1].candidates.find(c=>c.target.form==='马').semantic_fit.fit='direct'],
 ['cross-language common origin','convent',e=>e.historical_relation_status='Established'],
 ['sound control promoted to shortlist','montrer',e=>{const c=e.diachronic_semantic_mapping.mappings[0].candidates.find(x=>x.target.form==='梦');c.role='candidate';c.decision='shortlisted';}],
 ['archive removed','convent',e=>delete e.legacy_migration],
 ['false linear chain restored','fil',e=>e.semantic_structure.relation='THREAD → DAUGHTER']
];
for(const [name,slug,mutate]of mutations)test('Final lexical REJECTS: '+name,async()=>{
 const {validateSchema}=await import('../scripts/validate-schema.mjs');const {validateFinalLexical}=await import('../scripts/validate-final-lexical.mjs');
 const bad=structuredClone(data);mutate(bad.entries.find(e=>e.slug===slug));
 assert.ok(validateSchema(bad),JSON.stringify(validateSchema.errors));assert.ok(validateFinalLexical(bad).length,'Schema-valid wrong claim must be rejected independently');
});
test('Final lexical reader: Pending works in Mapper/search/dictionary and static pages',()=>{
 for(const slug of scope){const e=data.entries.find(x=>x.slug===slug);assert.equal(api.lookup(data,slug).entry.id,e.id);assert.match(model.headline(e),/Featured Mapping: Pending/);assert.equal(model.featured(e),null);
  const html=fs.readFileSync(e.page,'utf8');assert.match(html,/Featured Mapping: Pending/);assert.match(html,/Research \/ Evidence/);assert.equal((html.match(/data-stage=/g)||[]).length,2);assert.match(html,/Historical Relation: Not claimed/);
 }
 cp.execFileSync(process.execPath,['scripts/build-final-lexical.mjs','--check']);
});
