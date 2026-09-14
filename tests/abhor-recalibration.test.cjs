const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const entry = require('../data/entries/abhor.v1.json');
const data = require('../data/language-book.v1.0.json');
const api = require('../js/language-book-data.js');
const page = fs.readFileSync(path.join(root, 'words/abhor.html'), 'utf8');

test('ABHOR recalibrates one existing ID without changing the other 37 records', () => {
  const before = JSON.parse(cp.execFileSync('git', ['show', 'f0bbff3a8ec0adeef387f87ef5694352f4081e3a:data/language-book.v1.0.json'], {cwd:root, maxBuffer:10*1024*1024}));
  assert.equal(data.entries.filter(e => !['horizon','horse'].includes(e.slug)).length, 38);
  assert.equal(data.entries.filter(e => e.slug === 'abhor').length, 1);
  assert.equal(entry.id, 'LB-en-abhor-037');
  assert.deepEqual(data.entries.find(e => e.slug === 'abhor'), entry);
  assert.deepEqual(data.entries.filter(e => !['abhor','horizon','horse'].includes(e.slug)), before.entries.filter(e => e.slug !== 'abhor'));
  assert.equal(entry.source.raw_note, before.entries.find(e => e.slug === 'abhor').source.raw_note);
});

test('ABHOR selected modern sense is independent of publication and the old hypothesis', () => {
  assert.equal(entry.entry_status, 'Published');
  assert.equal(entry.mapping_status, 'Supported');
  assert.equal(entry.mapping_level, 'A');
  assert.equal(entry.historical_relation_status, 'Not claimed');
  assert.equal(entry.direct_lexical_semantic_equivalence, true);
  assert.equal(entry.primary_mapping.target.word, '恶');
  assert.match(entry.primary_mapping.target.pronunciation, /^wù /);
  assert.equal(entry.primary_mapping.mapping_type, 'Modern Semantic Mapping');
  assert.match(entry.primary_mapping.meaning.en, /Direct lexical-semantic equivalence: Yes/);
  assert.match(entry.primary_mapping.meaning['zh-Hans'], /动词/);
  assert.match(entry.primary_mapping.meaning['zh-Hans'], /不混用 è／ě／wū/);
  assert.ok(entry.languages.some(l => l.role === 'standard-translation' && l.word === '憎恶／厌恶'));
  assert.equal(entry.mapping_assessment.total, entry.mapping_assessment.dimensions.reduce((n,d) => n+d.score, 0));
  assert.equal(entry.mapping_assessment.total, 60);
  assert.equal(entry.mapping_assessment.dimensions[0].score, 2);
  const secondary = entry.secondary_affective_literary_associations[0];
  assert.equal(secondary.target, '火');
  assert.equal(secondary.label, 'Dialectal / Affective Semantic Candidate');
  assert.equal(secondary.status, 'Candidate');
  assert.equal(secondary.mapping_assessment.level, 'D');
  assert.equal(secondary.mapping_assessment.total, 29);
  assert.equal(secondary.is_etymological, false);
  assert.match(secondary.boundary, /Not etymological evidence/);
  assert.deepEqual(entry.experiments, []);
  assert.equal(entry.experiment_plan.completed, false);
  assert.equal(entry.experiment_plan.results, null);
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
  assert.equal(d.is_primary_mapping, false);
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
  assert.equal(primary.scope, 'primary_mapping');
  assert.equal(primary.rating.score, 2);
  assert.match(primary.segments.syllables.en, /Two English syllables/);
  const phon = entry.phonetic_observation[1];
  assert.equal(phon.scope, 'secondary_affective_literary_association');
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
    assert.equal(api.queryView(result.entry, term).mapping_status, 'Supported');
    assert.equal(result.entry.primary_mapping.target.word, '恶');
    assert.equal(result.entry.diachronic_semantic_mapping.mappings[0].target.word, '骇');
  }
  for (const [code,term] of [['en','abhor'],['zh-Hans','恶'],['fr','abhorrer']]) {
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
  assert.match(page, /Modern Semantic Mapping/);
  assert.match(page, /Diachronic Semantic Mapping/);
  assert.match(page, /Present-day Mapping ≠ Diachronic Mapping/);
  assert.match(data.editorial_policy.present_day_vs_diachronic.en, /One primary modern mapping/);
  for (const rid of ['ABHOR-ZD-WU','ABHOR-ZD-HAI']) {
    const ref = entry.references.find(r => r.reference_id === rid);
    assert.ok(ref.claim_scope.includes('modern_meaning'));
    assert.match(ref.provenance, /大陆数字辞书平台/);
  }
  assert.ok(entry.source_audit_pending.some(p => /恶 wù／骇 hài/.test(p.claim)));
  assert.ok(entry.source_audit_pending.some(p => /骇的古义/.test(p.claim)));
});
