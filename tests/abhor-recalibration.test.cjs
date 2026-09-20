const {legacyEntry,legacyDataset}=require('./legacy-research-view.cjs'); // Exact pre-migration research compatibility
const { assertLegacyUiEqual } = require('./legacy-ui-compat.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const entry = legacyEntry(require('../data/entries/abhor.v1.json'));
const data = legacyDataset(require('../data/language-book.v1.0.json'));
const api = require('../js/language-book-data.js');
const page = fs.readFileSync(path.join(root, 'words/abhor.html'), 'utf8');

test('ABHOR recalibrates one existing ID without changing the other 37 records', () => {
  const before = JSON.parse(cp.execFileSync('git', ['show', 'f0bbff3a8ec0adeef387f87ef5694352f4081e3a:data/language-book.v1.0.json'], {cwd:root, maxBuffer:10*1024*1024}));
  assert.equal(data.entries.filter(e => !['horizon','horse','abbreviation','abdominal'].includes(e.slug)).length, 38);
  assert.equal(data.entries.filter(e => e.slug === 'abhor').length, 1);
  assert.equal(entry.id, 'LB-en-abhor-037');
  assert.deepEqual(data.entries.find(e => e.slug === 'abhor'), entry);
  assert.deepEqual(data.entries.filter(e => !['abeyance','aberrant','abhor','horizon','horse','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(e.slug)), before.entries.filter(e => !['abeyance','aberrant','abhor','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(e.slug)));
  assert.equal(entry.source.raw_note, before.entries.find(e => e.slug === 'abhor').source.raw_note);
});

test('Featured, standard translation and modern semantics retain separate assessments', () => {
  assert.equal(entry.entry_status, 'Published');
  assert.equal(entry.primary_mapping.target.word, '火');
  assert.match(entry.primary_mapping.target.pronunciation, /^huǒ /);
  assert.equal(entry.featured_mapping.target, '火');
  assert.equal(entry.mapping_status, 'Candidate');
  assert.equal(entry.mapping_level, 'D');
  assert.equal(entry.historical_relation_status, 'Not claimed');
  assert.equal(entry.direct_lexical_semantic_equivalence, false);
  assert.match(entry.primary_mapping.meaning.en, /Direct lexical-semantic equivalence: No/);
  assert.deepEqual(entry.standard_translation.terms, ['憎恶','厌恶']);
  assert.equal(entry.standard_translation.target, '憎恶 / 厌恶');
  assert.equal(entry.standard_translation.status, 'Supported');
  const m = entry.modern_standard_semantic_mapping;
  assert.equal(m.target.word, '恶');
  assert.match(m.target.pronunciation, /^wù /);
  assert.equal(m.mapping_type, 'Modern Standard Semantic Mapping');
  assert.equal(m.status, 'Supported');
  assert.equal(m.mapping_level, 'A');
  assert.equal(m.direct_lexical_semantic_equivalence, true);
  assert.match(m.meaning['zh-Hans'], /不混用 è／ě／wū/);
  assert.equal(m.mapping_assessment.total, 60);
  assert.equal(m.mapping_assessment.dimensions[0].score, 2);
  assert.equal(entry.mapping_assessment.total, 29);
  assert.equal(entry.mapping_assessment.dimensions[0].score, 10);
  assert.equal(entry.mapping_assessment.total, entry.mapping_assessment.dimensions.reduce((n,d) => n+d.score,0));
  assert.equal(entry.secondary_affective_literary_associations[0].is_etymological, false);
  assert.deepEqual(entry.experiments, []);
  assert.equal(entry.experiment_plan.completed, false);
  assert.equal(entry.experiment_plan.results, null);
  assert.match(page, /Featured Unilanguage Mapping Candidate: ABHOR ↔ 火 huǒ/);
  assert.match(page, /Standard Translation: 憎恶 \/ 厌恶/);
  assert.match(page, /Standard Translation ≠ Featured Mapping ≠ Diachronic Mapping/);
});

test('HORR relatives and surface controls have distinct historical families', () => {
  const family = entry.related_words.filter(w => w.relationship_type === 'historical relative').map(w => w.word);
  assert.deepEqual(family.sort(), ['horror','horrible','horrid','abhorrent','abhorrence'].sort());
  for (const w of ['horizontal','horse']) {
    const control = entry.related_words.find(r => r.word === w);
    assert.match(control.relationship_type, /negative control/);
    assert.notEqual(control.family, 'Latin horrēre');
    assert.ok(control.source_refs.length);
  }
  assert.equal(entry.future_candidates[0].is_evidence_for_abhor, false);
  assert.match(page, /horizont- \+ -al/);
  assert.match(page, /不能将它的路径套用给 abhor/);
});

test('Author intuition is preserved separately from evidence and cognitive endpoints remain unequal', () => {
  assert.equal(entry.literary_layer.proposition['zh-Hans'], '憎恶即对某人有火');
  assert.equal(entry.literary_layer.is_historical_evidence, false);
  assert.equal(entry.literary_layer.is_independent_evidence, false);
  const evidence = JSON.stringify(entry.evidence);
  assert.doesNotMatch(evidence, /憎恶即对某人有火|ABHOR-AUTHOR|REF-LANGUAGESBOOK-ABHOR/);
  assert.equal(entry.cognitive_paths.endpoints_equal, false);
  assert.equal(entry.cognitive_paths.is_historical_relation, false);
  assert.match(entry.counterevidence[0].statement.en, /ANGER ≠ AVERSION/);
  assert.ok(entry.source_audit_pending.every(p => p.status === 'pending'));
  const known = new Set(entry.references.map(r => r.reference_id));
  function visit(o) {
    if (!o || typeof o !== 'object') return;
    for (const [k,v] of Object.entries(o)) {
      if (k === 'source_refs') for (const id of v) assert.ok(known.has(id), id);
      else visit(v);
    }
  }
  visit(entry);
});

test('火 is an author-attested dialect candidate with independent evidence kept separate', () => {
  const d = entry.dialectal_affective_semantic_candidate;
  assert.equal(d.target, '火');
  assert.equal(d.label, 'Dialectal / Affective Semantic Candidate');
  assert.equal(d.status, 'Candidate');
  assert.equal(d.is_primary_mapping, true);
  assert.equal(d.is_modern_standard_lexical_equivalent, false);
  assert.equal(d.historical_relation_status, 'Not claimed');
  assert.equal(d.author_attested_usage.status, 'Author-attested Dialect Usage');
  assert.equal(d.author_attested_usage.author, 'Jinkai Liu');
  assert.equal(d.author_attested_usage.region, 'Pending identification');
  assert.deepEqual(d.author_attested_usage.forms, ['我对某某有火', '对某人有火']);
  assert.match(d.author_attested_usage.reported_meaning, /不满.*反感.*厌恶/);
  assert.equal(d.independent_dialect_evidence.status, 'Pending');
  assert.equal(d.independent_dialect_evidence.region, 'Pending identification');
  assert.deepEqual(d.independent_dialect_evidence.verified_meaning_scope, []);
  assert.deepEqual(d.semantic_strength_boundary.independently_supported_for_the_construction, []);
  assert.deepEqual(d.semantic_strength_boundary.related_standard_lexical_evidence, ['ANGER', 'DISPLEASURE']);
  assert.match(d.semantic_strength_boundary.note, /does not independently verify.*aversion or detestation/);
  assert.match(page, /Author-attested Dialect Usage/);
  assert.match(page, /Independent dialect evidence: Pending/);
  assert.match(page, /Region: Pending identification/);
  assert.match(page, /ANGER \/ RESENTMENT \/ DISPLEASURE \/ AVERSION \/ DETESTATION/);
});

test('Phonetic assessment includes the unmatched features and both major reference accents', () => {
  const primary = entry.phonetic_observation[0];
  assert.equal(primary.scope, 'modern_standard_semantic_mapping');
  assert.equal(primary.rating.score, 2);
  assert.match(primary.segments.syllables.en, /Two English syllables/);
  const phon = entry.phonetic_observation[1];
  assert.equal(phon.scope, 'primary_mapping');
  for (const k of ['onset','glide','vowel','rhoticity','coda','tone','whole_word']) assert.ok(phon.segments[k]);
  assert.match(phon.rating.method, /unvalidated/);
  assert.match(phon.rating.US, /rhotic/);
  assert.match(phon.secondary_french.en, /weaker/);
  assert.match(phon.claim.en, /not homophony/);
});

test('ABHOR is reachable through search, dictionary forms and the unchanged Mapper adapter', () => {
  for (const term of ['abhor','ABHOR','恶','wù','wu','骇','hài','hai','horrēre','horrere','火','huǒ','huo','abhorrer','憎恶','怒火']) {
    const result = api.lookup(data, term);
    assert.equal(result.kind, 'exact', term);
    assert.equal(result.entry.id, entry.id, term);
    assert.equal(api.queryView(result.entry, term).mapping_status, 'Candidate');
    assert.equal(result.entry.primary_mapping.target.word, '火');
    assert.equal(result.entry.diachronic_semantic_mapping.mappings[0].target.word, '骇');
  }
  for (const [code,term] of [['en','abhor'],['zh-Hans','火'],['fr','abhorrer']]) {
    assert.ok(api.languageForms(data).find(g => g.code === code).forms.some(f => f.term === term && f.recordId === entry.id));
  }
  const ids = ['literature','basic-meaning','multilingual','etymology','mapping','justification','protocol-references','translation-protocol','examples','community'];
  const positions = ids.map(id => page.indexOf(`id="${id}"`));
  assert.ok(positions.every((p,i) => p>=0 && (!i || p>positions[i-1])));
  assert.match(page, /<html lang="zh-Hans">/);
  for (const file of ['index.html','english.html','chinese.html','french.html','sitemap.xml']) {
    assert.match(fs.readFileSync(path.join(root,file),'utf8'), /words\/abhor\.html/);
  }
});

test('Historical unit mapping preserves sense, phonetic and historical boundaries', () => {
  const d = entry.diachronic_semantic_mapping;
  const m = d.mappings[0];
  assert.equal(m.source.word, 'horrēre');
  assert.equal(m.source.language, 'Latin');
  assert.equal(m.target.word, '骇');
  assert.match(m.target.pronunciation, /^hài /);
  assert.match(m.target_sense, /惊惧／惊骇／受惊/);
  assert.equal(m.status, 'Candidate');
  assert.equal(m.mapping_level, 'C');
  assert.equal(m.confidence, 'Medium');
  assert.equal(m.historical_relation_status, 'Not claimed');
  assert.equal(m.mapping_assessment.total, 43);
  assert.equal(m.phonetic_observation.rating.score, 5);
  for (const feature of ['onset','vowel','consonants','syllables','tone']) assert.ok(m.phonetic_observation.segments[feature]);
  assert.match(m.boundary.en, /not a literal equivalent/);
  assert.match(d.semantic_path, /HORRĒRE.*BRISTLE.*骇.*RECOIL.*ABHOR.*恶/);
  assert.notEqual(m.mapping_id, entry.primary_mapping.mapping_id);
  assert.ok(d.historical_stages.every(s => s.target !== '火'));
  assert.match(page, /Modern Standard Semantic Mapping/);
  assert.match(page, /Diachronic Semantic Mapping/);
  assert.match(page, /Present-day Mapping ≠ Diachronic Mapping/);
  assert.match(data.editorial_policy.featured_mapping_selection.en, /Featured Mapping is selected per entry and may differ from Standard Translation/);
  for (const rid of ['ABHOR-ZD-WU','ABHOR-ZD-HAI']) {
    const ref = entry.references.find(r => r.reference_id === rid);
    assert.ok(ref.claim_scope.includes('modern_meaning'));
    assert.match(ref.provenance, /大陆数字辞书平台/);
  }
  assert.ok(entry.source_audit_pending.some(p => /恶 wù／骇 hài/.test(p.claim)));
  assert.ok(entry.source_audit_pending.some(p => /骇的古义/.test(p.claim)));
});

test('Focused revision preserves every unrelated record from the latest base', () => {
 const before = JSON.parse(cp.execFileSync('git', ['show','92154ed5d7ab511df6e70dd69fc2ec38f9e59efa:data/language-book.v1.0.json'], {cwd:root,maxBuffer:10*1024*1024}));
 assert.deepEqual(data.entries.filter(e=>!['abeyance','aberrant','abhor','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(e.slug)), before.entries.filter(e=>!['abeyance','aberrant','abhor','abdicate','abbreviate','abbreviation','abdominal','abdomen'].includes(e.slug)));
 assert.equal(data.entries.length,42);
 assert.equal(entry.diachronic_semantic_mapping.historical_stages.at(-1).modern_semantic_mapping_ref,entry.modern_standard_semantic_mapping.mapping_id);
});

test('Frozen Mapper layout and browse adapter only gain the focused translation/form changes', () => {
 const baseline='92154ed5d7ab511df6e70dd69fc2ec38f9e59efa';
 const get=f=>cp.execFileSync('git',['show',baseline+':'+f],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n');
 const current=f=>fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n');
 require('./legacy-ui-compat.cjs').assertLegacyDataEqual(current('js/language-book-data.js'), get('js/language-book-data.js').replace('abhor: "恶"','abhor: "火"').replace('abbreviate: "缩写",', 'abbreviate: "缩写", abbreviation: "缩写形式",').replace('abdomen: "肚子",','abdomen: "肚子", abdominal: "腹部的",'));
 assertLegacyUiEqual(current('js/semantic-mapper.js'), get('js/semantic-mapper.js')
  .replace('const standardGloss = entry.slug === "abdomen" ? "腹部" : mapping.target.word;', 'const standardGloss = entry.standard_translation?.target || (entry.slug === "abdomen" ? "腹部" : mapping.target.word);')
  .replace('escapeHtml(entry.slug === "abdomen" ? standardTranslations : mapping.target.word)','escapeHtml(entry.standard_translation?.target || (entry.slug === "abdomen" ? standardTranslations : mapping.target.word))')
  .replace('entry.slug === "abdomen" ? "" : `<small>', '(entry.standard_translation || entry.slug === "abdomen") ? "" : `<small>'));
});
