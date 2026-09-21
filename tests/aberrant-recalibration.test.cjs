const {legacyEntry,legacyDataset}=require('./legacy-research-view.cjs'); // Exact pre-migration research compatibility
const { assertLegacyUiEqual } = require('./legacy-ui-compat.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),vm=require('node:vm');
const e=legacyEntry(require('../data/entries/aberrant.v1.json')),d=legacyDataset(require('../data/language-book.v1.0.json')),api=require('../js/language-book-data.js');
const page=fs.readFileSync('words/aberrant.html','utf8');
test('ABERRANT recalibration preserves identity and all unrelated data and frozen UI',()=>{
 const base='0e8bc2671acde7808aaa98befadb42d5147c2013';
 const get=f=>cp.execFileSync('git',['show',base+':'+f],{maxBuffer:20*1024*1024,encoding:'utf8'}).replace(/\r\n/g,'\n');
 const before=JSON.parse(get('data/language-book.v1.0.json'));
 assert.equal(d.entries.length,42);assert.equal(e.id,'LB-en-aberrant-011');assert.equal(d.entries.filter(x=>x.slug==='aberrant').length,1);
 assert.deepEqual(d.entries.filter(x=>!['aberrant','abeyance'].includes(x.slug)),before.entries.filter(x=>!['aberrant','abeyance'].includes(x.slug)));
 assert.deepEqual(d.entries.find(x=>x.slug==='aberrant'),e);
 assert.deepEqual(e.source,before.entries.find(x=>x.slug==='aberrant').source);
 // Four migrated pages are checked against the approved baseline in legacy-migration.test.cjs.
 // ABBREVIATE now has an approved Batch 1 page migration, independently checked in family-migration-batch1.test.cjs.
 // HORIZON/HORSE are now covered by exact archive and scope tests in tier-b-final.test.cjs.
 for(const f of ['js/semantic-mapper.js','semantic-mapper.html'])assertLegacyUiEqual(fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n'),get(f),f);
});
test('Adjective translation and featured historical-unit candidate are independent',()=>{
 assert.equal(e.languages[0].part_of_speech,'adjective · 形容词');assert.equal(e.languages.find(x=>x.word==='err').part_of_speech,'verb · 动词');
 assert.equal(e.standard_translation.target,'反常的／偏离常规的');assert.equal(e.standard_translation.is_featured_mapping,false);
 assert.equal(e.primary_mapping.target.word,e.standard_translation.target);assert.equal(e.featured_mapping.target,'讹');assert.equal(e.featured_mapping.reading,'é');
 assert.match(e.featured_mapping.display_label,/ERR \/ ERROR/);assert.match(e.featured_mapping.boundary.en,/not a translation of the whole adjective/);
 assert.equal(e.featured_mapping_assessment.mapping_id,e.diachronic_semantic_mapping.mappings[0].mapping_id);
 assert.match(page,/<h1>ABERRANT<\/h1>/);
});
test('Latin prefix, French pathway and author hypotheses stay distinct',()=>{
 assert.match(e.evidence.Historical.summary.en,/ab-.*errare/);assert.match(e.evidence.Historical.summary.en,/adjectivized present participle/);
 assert.equal(e.hypotheses.find(x=>x.hypothesis_id==='UNI-ABERRANT-BRIDGE-B-002').status,'Rejected');
 assert.match(e.legacy_calibration.corrections.join(' '),/not English intervocalic insertion/);assert.match(e.legacy_calibration.corrections.join(' '),/English borrowing is not supported/);
 assert.match(e.source.raw_note,/a.b.err.ant/);assert.equal(e.historical_relation_status,'Not claimed');
});
test('Diachronic stages permit pending mappings without forced language-by-language characters',()=>{
 const stages=e.diachronic_semantic_mapping.historical_stages,lat=stages.find(x=>x.stage_id==='LATIN-WANDER');
 assert.equal(lat.status,'Mapping pending');assert.equal(lat.target,null);assert.equal(lat.candidate_review.length,2);
 assert.equal(e.modern_semantic_mapping.target,'偏');assert.equal(e.modern_semantic_mapping.confidence,'Medium');
 for(const s of stages){assert.ok(s.source_refs.length);assert.ok(s.status);assert.ok(s.confidence);assert.equal(s.historical_relation_status,'Not claimed');}
 assert.match(d.editorial_policy.present_day_vs_diachronic.en,/not one character per language/);
 assert.match(d.editorial_policy.present_day_vs_diachronic.en,/Each stage records its own evidence, status and confidence/);
 assert.match(fs.readFileSync('protocol/protocol.mapping-framework.html','utf8'),/id="diachronic-stage-principle"/);
});
test('Accent-sensitive phonology, scoped Mainland evidence and honest scoring',()=>{
 const p=e.phonetic_observation[0];for(const k of ['onset','vowel','rhoticity','tone','syllables'])assert.ok(p.segments[k]);
 assert.match(p.segments.rhoticity.en,/Non-rhotic/);assert.match(p.segments.syllables.en,/two syllables/);
 assert.equal(p.rating.score,10);assert.equal(e.mapping_assessment.dimensions[1].score,22);
 assert.equal(e.mapping_assessment.total,e.mapping_assessment.dimensions.reduce((n,x)=>n+x.score,0));
 assert.match(e.mapping_assessment.method,/Unvalidated/);assert.equal(e.mapping_status,'Candidate');assert.equal(e.mapping_level,'C');assert.equal(e.confidence,'Low');
 assert.ok(e.source_audit_pending.every(x=>x.status==='pending'));assert.match(e.chinese_evidence[0].claim,/讹诈不可译/);
 const ids=new Set(e.references.map(x=>x.reference_id));function walk(x){if(!x||typeof x!=='object')return;for(const[k,v]of Object.entries(x)){if(k==='source_refs')v.forEach(id=>assert.ok(ids.has(id),id));else walk(v);}}walk(e);
});
test('Author literature is preserved and excluded from evidence',()=>{
 assert.equal(e.literary_layer.proposition['zh-Hans'],'错讹的时候，是一种如天鹅般美丽还是家鹅的讹音？不，那爱充满美艺。');
 assert.equal(e.author,'Jinkai Liu');assert.equal(e.literary_layer.is_historical_evidence,false);assert.match(e.literary_layer.evidence_boundary.en,/does not support/);
});
test('Search aliases and dictionary card expose the candidate with correct translation and route',async()=>{
 for(const q of ['aberrant','err','error','erreur','讹','错讹','errāre','errare']){assert.equal(api.lookup(d,q).entry.id,e.id,q);assert.equal(api.lookup(d,q).entry.page,'words/aberrant.html');}
 const els={dictSearch:{value:'aberrant'},dictMessage:{},dictionaryGrid:{}};
 const ctx={window:{},document:{getElementById:id=>els[id],addEventListener:()=>{}},UnilanguageData:{...api,loadDataset:async()=>d}};
 vm.runInNewContext(fs.readFileSync('js/search.js','utf8'),ctx);await ctx.window.filterDictionary();const out=els.dictionaryGrid.innerHTML;
 assert.match(out,/ABERRANT ↔ 讹 <small>é<\/small> · 反常的／偏离常规的/);assert.match(out,/Standard translation · 通用翻译：<\/strong> 反常的／偏离常规的/);assert.match(out,/words\/aberrant.html/);assert.match(out,/ERROR/);
 for(const id of ['literature','basic-meaning','multilingual','etymology','mapping','justification','protocol','utp','examples','community','references'])assert.ok(page.includes('id="'+id+'"'));
});
