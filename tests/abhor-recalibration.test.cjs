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
  assert.equal(data.entries.filter(e => e.slug !== 'horizon').length, 38);
  assert.equal(data.entries.filter(e => e.slug === 'abhor').length, 1);
  assert.equal(entry.id, 'LB-en-abhor-037');
  assert.deepEqual(data.entries.find(e => e.slug === 'abhor'), entry);
  assert.deepEqual(data.entries.filter(e => !['abhor','horizon'].includes(e.slug)), before.entries.filter(e => e.slug !== 'abhor'));
  assert.equal(entry.source.raw_note, before.entries.find(e => e.slug === 'abhor').source.raw_note);
});

test('ABHOR publication never upgrades the hypothesis or implies lexical equivalence', () => {
  assert.equal(entry.entry_status, 'Published');
  assert.equal(entry.mapping_status, 'Candidate');
  assert.equal(entry.mapping_level, 'D');
  assert.equal(entry.historical_relation_status, 'Not claimed');
  assert.equal(entry.direct_lexical_semantic_equivalence, false);
  assert.equal(entry.primary_mapping.target.word, '火');
  assert.match(entry.primary_mapping.meaning.en, /Direct lexical-semantic equivalence: No/);
  assert.ok(entry.languages.some(l => l.role === 'standard-translation' && l.word === '憎恶／厌恶'));
  assert.equal(entry.mapping_assessment.total, entry.mapping_assessment.dimensions.reduce((n,d) => n+d.score, 0));
  assert.equal(entry.mapping_assessment.total, 29);
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

test('Phonetic assessment includes the unmatched features and both major reference accents', () => {
  const phon = entry.phonetic_observation[0];
  for (const k of ['onset','glide','vowel','rhoticity','coda','tone','whole_word']) assert.ok(phon.segments[k]);
  assert.match(phon.rating.method, /unvalidated/);
  assert.match(phon.rating.US, /rhotic/);
  assert.match(phon.secondary_french.en, /weaker/);
  assert.match(phon.claim.en, /not homophony/);
});

test('ABHOR is reachable through search, dictionary forms and the unchanged Mapper adapter', () => {
  for (const term of ['abhor','ABHOR','火','huǒ','huo','abhorrer','憎恶','怒火']) {
    const result = api.lookup(data, term);
    assert.equal(result.kind, 'exact', term);
    assert.equal(result.entry.id, entry.id, term);
    assert.equal(api.queryView(result.entry, term).mapping_status, 'Candidate');
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
