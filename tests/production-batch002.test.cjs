const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = p => JSON.parse(fs.readFileSync(path.join(__dirname, '..', p), 'utf8'));
const active = read('data/candidates/production-corpus.v0.1.json');
const archive = read('data/candidates/production-archive.v0.1.json');
const freeze = read('data/review/production-002-freeze.v0.1.json');
const api = require('../js/production-candidate-data.js');

test('Batch002 intake preserves fourteen candidates, two archives and independent statuses', () => {
 assert.equal(active.records.length, 14);
 assert.equal(archive.records.length, 2);
 assert.equal(read('data/language-book.v1.0.json').entries.length, 42);
 for (const r of freeze.records) {
  const archived = r.source_form === 'cun';
  const stored = (archived ? archive : active).records.find(x => x.candidate_id === r.candidate_id);
  assert.deepEqual(stored.baseline_record, r);
  assert.equal(stored.review_status, archived ? 'archived' : 'candidate');
  assert.equal(stored.publication_status, 'not_published');
  assert.equal(r.historical_relation, 'Not claimed');
 }
 assert.equal(active.records.find(r => r.source_word === 'down').candidate_mapping, '下 xià');
 assert.equal(active.records.find(r => r.source_word === 'pressure').candidate_mapping, '压力 yālì');
 for (const word of ['down','pressure']) assert.equal(active.records.find(r => r.source_word === word).baseline_record.phonetic_fit, 'Low');
 for (const word of ['one','convention','middle','illuminate','love']) assert.equal(active.records.find(r => r.source_word === word).featured_mapping_status, 'Pending');
});

test('Batch002 candidate lookup accepts retained forms while archive and rejected forms stay absent', () => {
 for (const word of ['down','pressure','one','convention','middle','illuminate','love']) {
  const hit = api.lookupCandidates(active, word);
  assert.equal(hit.kind, 'candidate'); assert.equal(hit.entry, null);
 }
 for (const [form, word] of [['下','down'],['压力','pressure'],['逼','pressure'],['怜','love']])
  assert.ok(api.lookupCandidates(active, form).candidates.some(r => r.source_word === word));
 for (const form of ['cun','存','半','扶','蹲']) assert.equal(api.lookupCandidates(active, form).kind, 'unknown');
 assert.equal(api.lookupCandidates(archive, 'cun').kind, 'unknown');
 const cun = archive.records.find(r => r.source_word === 'cun').baseline_record;
 assert.equal(cun.status, 'Archive / Provenance unresolved');
 assert.deepEqual(cun.historical_stages, []); assert.deepEqual(cun.candidates, []);
 assert.equal(cun.provenance_verification.original_wording, 'cun，存。');
 assert.equal(cun.provenance_verification.source_language, 'Unresolved');
 assert.equal(cun.provenance_verification.decoded_url_title, '村，存');
});

test('Batch002 editorial gate rejects frozen evidence, identity, feature and state upgrades', async () => {
 const {validateProduction} = await import('../scripts/validate-production-candidates.mjs');
 const changes = [
  (a,z) => a.records.find(r=>r.source_word==='down').baseline_record.phonetic_fit='High',
  (a,z) => a.records.find(r=>r.source_word==='pressure').baseline_record.historical_relation='Proven',
  (a,z) => a.records.find(r=>r.source_word==='middle').candidate_mapping='媒 méi',
  (a,z) => a.records.find(r=>r.source_word==='illuminate').baseline_record.hypothesis_result='Supported',
  (a,z) => a.records.find(r=>r.source_word==='love').publication_status='published',
  (a,z) => a.records.find(r=>r.source_word==='one').review_status='reviewed',
  (a,z) => a.records.find(r=>r.source_word==='convention').blockers=[],
  (a,z) => z.records.find(r=>r.source_word==='cun').baseline_record.provenance_verification.source_language='English',
  (a,z) => a.records.push(z.records.pop()),
 ];
 for (const mutate of changes) {
  const a=structuredClone(active),z=structuredClone(archive); mutate(a,z);
  assert.ok(validateProduction(a,z).length);
 }
});
