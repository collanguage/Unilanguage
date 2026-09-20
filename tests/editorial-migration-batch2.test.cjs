const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../js/diachronic-mapping.js'),api=require('../js/language-book-data.js'),{legacyEntry}=require('./legacy-research-view.cjs');
const base='158a2a4839de709569cb309b1966ebb6ff72f9d0',slugs=['universe','human','abbey','abash'],pages=['universe','man','abbey','abash'];
const get=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:30e6}).replace(/\r\n/g,'\n');
const data=require('../data/language-book.v1.0.json'),before=JSON.parse(get('data/language-book.v1.0.json'));
const es=slugs.map(s=>data.entries.find(e=>e.slug===s));
test('Batch 2 scope and exact archive restoration: no other entry or page changes',()=>{
 assert.equal(data.entries.length,before.entries.length);
 assert.deepEqual(data.entries.filter(e=>!slugs.includes(e.slug)).map(e=>['horizon','horse','media','aback','sound','abridge','aliment','acumen','abound'].includes(e.slug)?legacyEntry(e):e),before.entries.filter(e=>!slugs.includes(e.slug)));
 for(const dir of ['data/entries','words'])for(const file of fs.readdirSync(dir)){
  if([...pages,'horizon','horse','media','aback','sound','abridge','aliment','acumen','abound'].some(s=>file===s+'.html'||file===s+'.v1.json'))continue;
  const p=dir+'/'+file;if(fs.statSync(p).isFile())assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 }
 for(const p of ['data/language-book-entry.schema.v1.json','js/diachronic-mapping.js','semantic-mapper.html','dictionary.html','search.html'])assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),get(p),p);
 es.forEach((e,i)=>{assert.deepEqual(legacyEntry(e),before.entries.find(x=>x.id===e.id));assert.deepEqual(model.validate(e),[]);assert.deepEqual(e,require('../data/entries/'+pages[i]+'.v1.json'));});
});
test('Four model scopes, independent evidence and intentional empty selections',()=>{
 const expected=[[2,2,3,1],[2,1,1,1],[4,3,6,2],[3,3,4,2]];
 es.forEach((e,i)=>{const d=e.diachronic_semantic_mapping;assert.deepEqual([d.historical_stages.length,d.mappings.length,d.mappings.flatMap(m=>m.candidates).length,d.display_selection.stage_cards.length],expected[i]);
  for(const c of d.mappings.flatMap(m=>m.candidates)){assert.equal(c.historical_relation.status,'Not claimed');assert.ok(!('total' in c.semantic_fit));assert.ok(!('total' in c.phonetic_fit));assert.ok(c.evidence.some(v=>v.status==='pending'));if(!c.comparison.source_pronunciation_ref)assert.equal(c.phonetic_fit.fit,'not_evaluated');}
 });
 const u=es[0].diachronic_semantic_mapping,wo=model.featured(es[0]),struct=u.mappings[0].candidates.find(c=>c.candidate_id==='B2-U-STRUCTURE');
 assert.equal(wo.target.form,'斡');assert.equal(wo.comparison.scope,'morpheme');assert.match(wo.comparison.source_span,/vertere/);assert.equal(wo.phonetic_fit.fit,'not_evaluated');
 assert.notEqual(struct.candidate_id,wo.candidate_id);assert.equal(struct.target.form,'宇 + 宙');assert.equal(struct.comparison.scope,'semantic_only');assert.match(struct.decision_reason,/不是逐字同构/);
 const man=model.featured(es[1]);assert.equal(man.semantic_fit.fit,'direct');assert.equal(man.phonetic_fit.fit,'weak');assert.equal(man.comparison.hypothesis.group,'UNI-SOUND-MN-001');assert.equal(man.comparison.hypothesis.hit,false);assert.ok(es[1].chinese_historical_research.old_chinese.includes('*nˤ[ə]m'));
 const ba=model.featured(es[2]);assert.equal(es[2].standard_translation.target,'修道院');assert.equal(ba.comparison.source_stage_ref,'ARAMAIC');assert.equal(ba.target.form,'爸');assert.equal(ba.phonetic_fit.fit,'not_evaluated');
 const cs=es[2].diachronic_semantic_mapping.mappings[0].candidates;assert.deepEqual(cs.slice(1,4).map(c=>c.target.pronunciations[0].value),['fù','diē','yé']);assert.equal(cs.at(-1).decision,'reserved');assert.equal(cs.at(-1).target.form,'阿比');
});
test('ABASH calibrates identity; BASH stays independent and cannot inherit stages or translation',()=>{
 const e=es[3],d=e.diachronic_semantic_mapping;assert.equal(e.primary_mapping.source.word,'abash');assert.equal(model.featured(e),null);assert.equal(e.featured_mapping,undefined);
 assert.ok(d.historical_stages.every(s=>!/^bash$/i.test(s.form)));
 const pa=d.mappings.flatMap(m=>m.candidates).find(c=>c.target.form==='怕');assert.equal(pa.comparison.source_stage_ref,'MODERN');assert.equal(pa.semantic_fit.fit,'partial');assert.equal(pa.phonetic_fit.fit,'weak');assert.equal(pa.decision,'proposed');
 for(const q of ['abash','abashed','怕','pà']){const v=api.lookup(data,q).entry;assert.equal(v.primary_mapping.source.word,'abash');assert.equal(model.featured(v),null);assert.equal(model.isPilot(v),true);}
 for(const q of ['bash','拍','pāi','猛击']){const v=api.lookup(data,q).entry;assert.equal(v.primary_mapping.source.word,'bash');assert.equal(v.featured_mapping.target,'拍');assert.equal(model.isPilot(v),false);assert.equal(v.standard_translation,undefined);}
 for(const q of ['abba','爸']){const v=api.lookup(data,q).entry;assert.equal(v.primary_mapping.source.word,'ABBA');assert.equal(model.isPilot(v),false);assert.equal(v.standard_translation,undefined);}
 assert.equal(e.primary_mapping.source.word,'abash','lookup must not mutate host');
 assert.equal(api.languageForms(data).find(g=>g.code==='zh-Hans').forms.find(f=>f.recordId===e.id).term,'使窘迫');
 assert.match(fs.readFileSync('js/search.js','utf8'),/Mapping \$\{separateTranslation && featured \?/);
 assert.equal(es[1].page,'words/man.html');
});
test('Bounded page build preserves literature, old anchors and reproducible canonical data',()=>{
 const oldPages=pages.map(s=>fs.readFileSync('words/'+s+'.html','utf8'));cp.execFileSync(process.execPath,['scripts/build-editorial-migration-batch2.mjs']);
 pages.forEach((s,i)=>{const h=fs.readFileSync('words/'+s+'.html','utf8');assert.equal(h,oldPages[i]);assert.equal((h.match(/<h1>/g)||[]).length,1);assert.match(h,/Research \/ Evidence/);
  for(const m of get('words/'+s+'.html').matchAll(/id="([^"]+)"/g))assert.ok(h.includes(m[0]),s+' lost anchor '+m[1]);
  for(const p of get('words/'+s+'.html').match(/<(?:p|blockquote)\b[^>]*>[\s\S]*?<\/(?:p|blockquote)>/g)||[])assert.ok(h.includes(p),s+' lost archived text');
 });
 const snapshot=fs.readFileSync('data/language-book.v1.0.json','utf8');cp.execFileSync(process.execPath,['scripts/build-language-book-v1.mjs']);assert.equal(fs.readFileSync('data/language-book.v1.0.json','utf8'),snapshot);
});
