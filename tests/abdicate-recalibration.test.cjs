const {legacyEntry,legacyDataset}=require('./legacy-research-view.cjs'); // Exact pre-migration research compatibility
const { assertLegacyUiEqual } = require('./legacy-ui-compat.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const e = legacyEntry(require('../data/entries/abdicate.v1.json'));
const data = legacyDataset(require('../data/language-book.v1.0.json'));
const api = require('../js/language-book-data.js');
const page = fs.readFileSync(path.join(root, 'words/abdicate.html'), 'utf8');
const baseline = '6fe36930ff4395adc4b7cf71dab43109efff158b';

test('ABDICATE recalibrates one existing ID and preserves every other record and raw note', () => {
  const before = JSON.parse(cp.execFileSync('git', ['show', baseline + ':data/language-book.v1.0.json'], {cwd: root, maxBuffer: 15*1024*1024}));
  assert.equal(data.entries.length, 42);
  assert.equal(data.entries.filter(x => x.slug === 'abdicate').length, 1);
  assert.equal(e.id, 'LB-en-abdicate-036');
  assert.deepEqual(data.entries.find(x => x.slug === 'abdicate'), e);
  assert.deepEqual(data.entries.filter(x => !['abeyance','aberrant','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(x.slug)), before.entries.filter(x => !['abeyance','aberrant','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(x.slug)));
  assert.deepEqual(e.source, before.entries.find(x => x.slug === 'abdicate').source);
  for (const f of ['js/semantic-mapper.js','semantic-mapper.html']) {
    assertLegacyUiEqual(fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n'), cp.execFileSync('git',['show',baseline+':'+f],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n'));
  }
});

test('Modern whole-word meaning, historical morpheme and dicāre candidate stay independent', () => {
  assert.equal(e.primary_mapping.target.word, '啼');
  assert.equal(e.featured_mapping.target, '啼');
  assert.ok(e.standard_translation.terms.includes('退位'));
  assert.equal(e.mapping_status, 'Candidate');
  assert.equal(e.modern_standard_semantic_mapping.mapping_level, 'A');
  const m = e.diachronic_semantic_mapping.mappings[0];
  assert.equal(m.source.word, 'dicāre');
  assert.equal(m.target.word, '啼');
  assert.match(m.target.pronunciation, /^tí /);
  assert.equal(m.status, 'Candidate');
  assert.equal(m.mapping_level, 'D');
  assert.equal(m.confidence, 'Low');
  for (const x of [e,m,e.modern_standard_semantic_mapping,...e.secondary_candidates]) assert.equal(x.historical_relation_status, 'Not claimed');
  assert.equal(e.historical_calibration.ab_prefix.ordinary_negation, false);
  assert.equal(e.historical_calibration.three_levels[0].is_modern_chinese_abandon, false);
  assert.match(page, /退对应整个现代词，不对应 ab-/);
  assert.match(page, /Present-day Mapping ≠ Diachronic Mapping/);
});

test('Historical dic-/diqu- extraction survives without inventing a modern French verb or suffix', () => {
  const f = e.historical_calibration.french_surface_segmentation;
  assert.match(f.status, /extraction retained/);
  assert.match(f.modern_lexical_boundary, /not deleted/);
  assert.match(f.historical_unit, /Latin dic-/);
  assert.match(f.suffix_boundary, /-que/);
  assert.match(e.historical_calibration.explanatory_gloss_boundary, /not a strict word-for-word/);
  assert.doesNotMatch(page, /删除旧笔记|diquer 是现代法语动词/);
  assert.match(page, /保留用户/);
  assert.match(page, /-que 当一般法语后缀/);
  assert.match(e.evidence.Historical.summary.en, /1548/);
  assert.match(e.historical_calibration.french_path.en, /1375/);
  for (const w of ['direct','direction']) assert.equal(e.related_words.find(x=>x.word===w).relationship_type,'negative control');
  for (const w of ['dictate','dicter']) assert.match(e.related_words.find(x=>x.word===w).family,/dīcere/);
});

test('Meaning-first scoring and secondary 谛 preserve counterevidence and evidence boundaries', () => {
  const p = e.phonetic_observation[0];
  assert.equal(p.rating.score,7);
  assert.equal(p.consonant_group.pair,'d↔t');
  assert.equal(p.consonant_group.status,'cross-language consonant-group hypothesis');
  for (const k of ['onset','vowel','consonants','syllables','tone']) assert.ok(p.segments[k]);
  assert.match(p.segments.onset.en,/voicing and aspiration/);
  const s=e.secondary_candidates[0];
  assert.equal(s.role,'secondary'); assert.equal(s.status,'Rejected');
  assert.match(s.label,/Rejected-by-meaning-first/);
  assert.equal(e.literary_layer.proposition['zh-Hans'],'退位，即不再啼叫。');
  assert.equal(e.literary_layer.is_historical_evidence,false);
  assert.equal(e.literary_layer.is_independent_evidence,false);
  assert.equal(e.experiment_plan.completed,false);
  assert.deepEqual(e.experiments,[]);
  assert.equal(e.source_audit_pending.length,6);
  assert.ok(e.source_audit_pending.every(x=>x.status==='pending'));
  assert.equal(new Set(e.references.map(x=>x.reference_id)).size,e.references.length);
  const known=new Set(e.references.map(x=>x.reference_id));
  function visit(o) { if (!o || typeof o!=='object') return; for(const [k,v] of Object.entries(o)) { if(k==='source_refs') for(const id of v) assert.ok(known.has(id),id); else visit(v); } }
  visit(e);
  for(const a of [e.mapping_assessment,e.diachronic_semantic_mapping.mappings[0].mapping_assessment]) assert.equal(a.total,a.dimensions.reduce((n,d)=>n+d.score,0));
});

test('Dictionary, search and Mapper aliases route to the same current record and page', () => {
  for (const term of ['abdicate','退位','啼','谛','dicāre','dic-','diqu-','abdiquer']) {
    const found=api.lookup(data,term).entry;
    assert.equal(found?.id,e.id,term); assert.equal(found.page,'words/abdicate.html');
  }
  assert.match(page,/<h1>ABDICATE<\/h1>/);
  assert.match(page,/DICĀRE ↔ 啼 tí/);
  for (const id of ['literature','basic-meaning','multilingual','etymology','mapping','justification','protocol','utp','examples','community','references']) assert.ok(page.includes('id="'+id+'"'));
});

test('Featured selection changes prominence without upgrading the historical-unit candidate or downgrading modern meaning', () => {
 const before=JSON.parse(cp.execFileSync('git',['show',baseline+':data/entries/abdicate.v1.json'],{cwd:root}));
 assert.deepEqual(e.diachronic_semantic_mapping,before.diachronic_semantic_mapping);
 const modern={...e.modern_standard_semantic_mapping,mapping_id:before.modern_standard_semantic_mapping.mapping_id};
 assert.deepEqual(modern,before.modern_standard_semantic_mapping);
 assert.equal(e.standard_translation.target,'退位');
 assert.equal(e.modern_standard_semantic_mapping.target.word,'退');
 assert.equal(e.modern_standard_semantic_mapping.status,'Supported');
 assert.equal(e.mapping_level,'D'); assert.equal(e.confidence,'Low');
 assert.equal(e.direct_lexical_semantic_equivalence,false);
 assert.equal(e.featured_mapping_assessment.compared_unit,'DICĀRE / DIC-');
 assert.match(page,/Standard Translation ≠ Featured Mapping ≠ Diachronic\/Historical-unit Mapping/);
 assert.match(page,/Featured Historical-unit Phonetic-Semantic Candidate｜特色历史单位音义候选/);
 assert.match(page,/啼叫不等于 declare\/proclaim/);
 assert.match(page,/ab- → AWAY\/OFF\/FROM；dicāre → DECLARE\/PROCLAIM；abdicāre → RENOUNCE\/RELINQUISH/);
});
