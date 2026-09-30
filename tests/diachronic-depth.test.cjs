const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const base = JSON.parse(fs.readFileSync(path.join(__dirname, '../research/depth-upgrades/pilot-001/proposal.json'), 'utf8'));
const api = import('../scripts/validate-diachronic-depth.mjs');
test('depth pilot keeps corpus/calibration frozen and requires evidence review', async () => {
  const {validatePilotFiles} = await api;
  const result = validatePilotFiles();
  assert.deepEqual(result.errors, []);
  assert.equal(result.review_required, true);
});
const invalid = {
  'unscoped Featured': e => { delete e.featured.scope; },
  'dangling Featured stage': e => { e.mappings[0].source_ref = 'invented'; },
  'coexistence promoted to chronology': e => { e.relations[0].kind = 'attested coexistence'; e.relations[0].confirmed_chronology = true; },
  'modern gloss replacing Chinese coverage': e => { e.chinese_coverage = {modern_mandarin: e.chinese_coverage.modern_mandarin}; },
  'phonetic score inherited from semantics': e => { delete e.mappings[0].phonetic_fit; },
  'parallel promoted to common origin': e => { e.mappings[0].historical_relation = 'Common origin'; },
  'Pending hidden from summary': e => { e.visible_pending = []; },
  'Featured made Proven': e => { e.featured.status = 'Proven'; },
  'automatic D1 on valid shape': e => { e.lexical_subclaim_depth_proposal = 'D1'; },
  'unregistered evidence': e => { e.mappings[0].evidence = ['invented-source']; }
};
for (const [name, mutate] of Object.entries(invalid)) test(`reject ${name}`, async () => {
  const doc = structuredClone(base); mutate(doc.entries[0]);
  assert.ok((await api).validateDepth(doc).errors.length > 0);
});
test('unmapped source stage is valid Pending/None found, with no forced character', async () => {
  for (const status of ['Pending', 'None found', 'Not selected']) {
    const doc = structuredClone(base);
    doc.entries[0].mappings.at(-1).status = status;
    assert.deepEqual((await api).validateDepth(doc).errors, []);
  }
});
test('entire Chinese layer may be Pending without modern gloss masquerading as history', async () => {
  const doc = structuredClone(base), e = doc.entries[0];
  e.featured = {form: 'Pending'}; e.chinese_stages = [];
  e.mappings = [{...e.mappings[0], chinese_ref: null, status: 'Pending', semantic_fit: 'Pending', structural_fit: 'Pending'}];
  assert.deepEqual((await api).validateDepth(doc).errors, []);
});
test('malformed input reports errors instead of silently passing', async () => {
  for (const doc of [null, {}, {entries: [null]}, {entries: 'wrong'}]) assert.ok((await api).validateDepth(doc).errors.length);
});
test('depth CLI resolves repository independently of shell working directory', () => {
  const run = spawnSync(process.execPath, [path.join(__dirname, '../scripts/validate-diachronic-depth.mjs')], {cwd: os.tmpdir(), encoding: 'utf8'});
  assert.equal(run.status, 0, run.stderr);
});
