const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = require('../data/language-book.v1.0.json');
const entry = require('../data/entries/new.v1.json');
const api = require('../js/language-book-data.js');
const page = fs.readFileSync(path.join(root, 'words/new.html'), 'utf8');

test('NEW adds exactly one unreviewed candidate and preserves independent status axes', () => {
  assert.equal(data.entries.filter(e => !['horizon','horse'].includes(e.slug)).length, 38);
  assert.equal(data.entries.filter(e => e.slug === 'new').length, 1);
  assert.deepEqual(data.entries.find(e => e.slug === 'new'), entry);
  assert.equal(entry.entry_status, 'Draft');
  assert.equal(entry.mapping_status, 'Candidate');
  assert.equal(entry.mapping_level, 'D');
  assert.equal(entry.historical_relation_status, 'Not claimed');
  assert.equal(entry.direct_lexical_semantic_equivalence, false);
  assert.equal(entry.primary_mapping.target.word, '牛');
  assert.match(entry.primary_mapping.meaning.en, /Direct lexical-semantic equivalence: No/);
  assert.deepEqual(entry.experiments, []);
  assert.equal(entry.dates.published, null);
});

test('NEW search, dictionary and Mapper adapter resolve one multilingual record', () => {
  for (const q of ['new', 'NEW', '牛', 'niú', 'niu', 'nouveau', '新的', '丑牛']) {
    const result = api.lookup(data, q);
    assert.equal(result.kind, 'exact', q);
    assert.equal(result.entry.id, entry.id, q);
    assert.equal(api.queryView(result.entry, q).mapping_status, 'Candidate');
  }
  for (const [code, term] of [['en', 'new'], ['zh-Hans', '牛'], ['fr', 'nouveau']]) {
    assert.ok(api.languageForms(data).find(g => g.code === code).forms.some(f => f.term === term && f.recordId === entry.id));
  }
});

test('NEW separates cultural facts, author hypothesis, history and speculative archive', () => {
  assert.doesNotMatch(JSON.stringify(entry.evidence.Historical), /Nibiru|Anunnaki|神农|丑牛/);
  assert.ok(entry.evidence.Historical.items.every(i => i.source_refs.every(r => ['NEW-MW', 'NEW-FR'].includes(r))));
  assert.equal(entry.evidence.Cognitive.items.find(i => i.evidence_id === 'NEW-CULT-HYP').status, 'Candidate');
  assert.deepEqual(entry.evidence.Cognitive.items.find(i => i.evidence_id === 'NEW-CULT-HYP').source_refs, ['NEW-AUTHOR']);
  assert.equal(entry.literary_layer.is_historical_evidence, false);
  assert.ok(entry.cultural_associations.every(a => a.is_etymological === false));
  assert.match(entry.source.raw_note, /子不代表新/);
  assert.match(entry.source.raw_note, /Not evidence for etymology or historical relation/);
  assert.equal(entry.evidence.Speculative.items.length, 0);
});

test('NEW pronunciation and source audit retain accent differences and pending boundaries', () => {
  const p = entry.phonetic_observation[0];
  for (const key of ['onset', 'glide', 'nucleus', 'coda', 'tone']) assert.ok(p.segments[key]);
  assert.equal(p.rating.UK, 'Moderate');
  assert.equal(p.rating.US, 'Limited-to-moderate');
  assert.match(p.rating.method, /unvalidated/);
  assert.ok(entry.source_audit_pending.some(x => x.claim === '牛现代规范音义' && x.status === 'pending'));
  const known = new Set(entry.references.map(r => r.reference_id));
  function visit(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const [k,v] of Object.entries(obj)) {
      if (k === 'source_refs') for (const id of v) assert.ok(known.has(id), id);
      else visit(v);
    }
  }
  visit(entry);
  assert.match(page, /01:00–03:00/);
  assert.match(page, /未找到合格依据证明丑时普遍是日界/);
  assert.match(page, /Direct lexical equivalence/);
});

test('NEW follows master section order and integrates static entry points', () => {
  assert.equal(fs.readFileSync(path.join(root, '_redirects'), 'utf8').trim(), '/new /words/new.html 301');
  const ids = ['literature', 'basic-meaning', 'multilingual', 'etymology', 'mapping', 'justification', 'protocol-references', 'translation-protocol', 'examples', 'community'];
  const positions = ids.map(id => page.indexOf(`id="${id}"`));
  assert.ok(positions.every((p,i) => p >= 0 && (!i || p > positions[i-1])));
  for (const file of ['index.html', 'english.html', 'chinese.html', 'french.html', 'sitemap.xml']) assert.match(fs.readFileSync(path.join(root,file),'utf8'), /words\/new\.html/);
  assert.match(page, /css\/sky-case\.css/);
  assert.doesNotMatch(page, /languagesbook/);
});
