const {legacyEntry,legacyDataset}=require('./legacy-research-view.cjs'); // Exact pre-migration research compatibility
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const e=require('../data/entries/abeyance.v1.json'),d=legacyDataset(require('../data/language-book.v1.0.json')),api=require('../js/language-book-data.js');
const page=fs.readFileSync('words/abeyance.html','utf8');
test('ABEYANCE updates one existing record and preserves unrelated entries and Mapper UI',()=>{
 const get=f=>cp.execFileSync('git',['show','5cae56daf73cf36fba628d37f3660709178e2e75:'+f],{encoding:'utf8',maxBuffer:20*1024*1024}).replace(/\r\n/g,'\n');
 const before=JSON.parse(get('data/language-book.v1.0.json'));
 assert.equal(e.id,'LB-en-abeyance-024');assert.equal(d.entries.length,42);
 assert.deepEqual(d.entries.filter(x=>x.slug!=='abeyance'),before.entries.filter(x=>x.slug!=='abeyance'));
 assert.deepEqual(d.entries.find(x=>x.id===e.id),e);
 for(const f of ['js/language-book-data.js'])require('./legacy-ui-compat.cjs').assertLegacyDataEqual(fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n'),get(f));
 assert.ok(e.source.raw_note.startsWith(before.entries.find(x=>x.id===e.id).source.raw_note));
});
test('Translation, featured candidate, modern sound segment and history remain separate',()=>{
 assert.equal(e.featured_mapping,undefined);assert.equal(e.legacy_calibration.previous_featured_mapping.target,'闭');
 assert.equal(e.primary_mapping.target.word,'暂缓／搁置');assert.equal(e.translation_status,'Supported');
 assert.equal(e.historical_relation_status,'Not claimed');assert.equal(e.mapping_status,'Candidate');assert.equal(e.mapping_level,'Unrated');assert.equal(e.legacy_calibration.previous_entry_mapping_level,'C');
 assert.equal(e.legacy_calibration.previous_mapping_assessment.confidence,'Low');assert.equal(e.experiments.length,0);
 assert.match(e.evidence.Historical.summary.en,/not negative/);assert.match(e.evidence.Historical.summary.en,/open\/gape/);
 assert.match(e.evidence['Phonetic-Semantic'].summary.en,/three syllables/);
 assert.equal(e.phonetic_observation[0].historical_root_claimed,false);
 assert.equal(e.phonetic_observation[0].whole_word_homophony,false);
 assert.match(e.legacy_calibration.previous_featured_mapping.boundary.en,/does not inherently encode temporary/);
 assert.ok(e.chinese_lexical_evidence.every(x=>x.source_refs.includes('ABEY-ZD-BI')));
 assert.ok(e.source_audit_pending.every(x=>x.status==='pending'));
 assert.match(e.related_words.find(x=>x.word==='abeyant').relationship_type,/back-formation/);
 assert.match(e.related_words.find(x=>x.word.startsWith('bay')).relation_to_entry.en,/tentative/);
 assert.match(page,/<h1>ABEYANCE · 暂缓／搁置<\/h1>/);
});
test('Author bilingual green-rain prose survives verbatim and is not evidence',()=>{
 const zh='默默的看着绿色的雨中，因为有众多的叶子的绿色的陪衬，用蜡笔绘出纸上的绿色也成为乐趣，暂时忘记了這悠悠的烦恼。雨中烦恼也关閉了。';
 const en='I silently watched the green rain. Because of the green background of many leaves, it was fun to draw the green on the paper with crayons. I temporarily forgot about the worries. The worries were also closed in the rain.';
 assert.equal(e.literary_layer.essay_prose[0].text['zh-Hans'],zh);assert.equal(e.literary_layer.essay_prose[0].text.en,en);
 assert.equal(e.literary_layer.is_historical_evidence,false);
 for(const text of [zh,en]){assert.ok(page.includes(text));assert.ok(e.source.raw_note.includes(text));}
 for(const q of ['abeyance','闭','閉','暂缓','in abeyance','en suspens','green rain'])assert.equal(api.lookup(d,q).entry.id,e.id,q);
 assert.notEqual(api.lookup(d,'abeyant').kind,'exact');
 assert.equal(api.languageForms(d).find(g=>g.code==='en').forms.filter(x=>x.term==='abeyance').length,1);
});
