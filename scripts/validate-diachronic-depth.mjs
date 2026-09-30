import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const proposalPath = 'research/depth-upgrades/pilot-001/proposal.json';
const text = value => typeof value === 'string' && value.trim().length > 0;
const list = value => Array.isArray(value) ? value : [];
const fits = new Set(['Low', 'Medium', 'Medium–High', 'High', 'Pending']);
const layers = ['modern_mandarin', 'historical_senses', 'middle_chinese', 'old_chinese', 'character_history_phonetic_series', 'dialect'];
const relationKinds = new Set(['attested coexistence', 'documented semantic development', 'editorial structural comparison', 'unknown chronology']);

// This checks declared research boundaries, never the truth of a historical claim.
export function validateDepth(doc) {
  const errors = [];
  const check = (ok, message) => { if (!ok) errors.push(message); };
  check(doc?.status === 'Depth Freeze Proposal' && doc?.corpus_writeback === false, 'proposal cannot grant acceptance');
  check(Array.isArray(doc?.entries) && doc.entries.length > 0, 'entries required');
  const catalog = doc?.sources || {};
  const refs = (values, label) => {
    check(Array.isArray(values), `${label}: references must be an array`);
    for (const id of list(values)) check(text(catalog[id]?.url) && text(catalog[id]?.scope), `${label}: unknown reference ${id}`);
  };
  const seen = new Set();
  for (const e of list(doc?.entries)) {
    const label = e?.entry || '(missing entry)';
    check(text(e?.candidate_id) && !seen.has(e?.candidate_id), `${label}: unique candidate required`);
    seen.add(e?.candidate_id);
    check(e?.historical_relation === 'Not claimed', `${label}: relation needs separate evidence review, not automatic promotion`);
    check(e?.status === 'Depth Freeze Proposal', `${label}: proposal only`);
    check(text(e?.review_gate) && e.review_gate.includes('Jinkai Liu'), `${label}: editorial gate missing`);
    const stageSets = [];
    for (const key of ['source_stages', 'chinese_stages']) {
      check(Array.isArray(e?.[key]), `${label}: ${key} must be explicit, possibly empty`);
      const ids = new Set();
      for (const n of list(e?.[key])) {
        check(text(n?.id) && !ids.has(n?.id), `${label}: duplicate/missing stage id`);
        ids.add(n?.id);
        for (const field of ['form', 'language', 'period', 'meaning', 'evidence_status']) check(text(n?.[field]), `${label}/${n?.id}: ${field} required`);
        if (key === 'source_stages') {
          check(text(n?.pronunciation), `${label}/${n?.id}: pronunciation or Pending required`);
          check((Array.isArray(n?.coexisting_senses) || text(n?.coexisting_senses)) && text(n?.documented_semantic_change) &&
            text(n?.chronology_confidence), `${label}/${n?.id}: explicit coexistence/change/chronology attempt required`);
        }
        refs(n?.source_refs, `${label}/${n?.id}`);
      }
      stageSets.push(ids);
    }
    let hasPending = false;
    for (const layer of layers) {
      const v = e?.chinese_coverage?.[layer];
      check(['recorded', 'partial', 'Pending', 'Not applicable'].includes(v?.status) && text(v?.detail), `${label}: explicit Chinese availability required: ${layer}`);
      refs(v?.source_refs, `${label}/${layer}`);
      if (['partial', 'Pending'].includes(v?.status)) hasPending = true;
    }
    check(Array.isArray(e?.remaining_pending) && Array.isArray(e?.visible_pending), `${label}: visible Pending arrays required`);
    if (stageSets[0].size === 0) check(list(e?.remaining_pending).length > 0, `${label}: missing source history must be Pending`);
    if (hasPending || stageSets[1].size === 0) check(list(e?.remaining_pending).length > 0, `${label}: missing Chinese evidence must be Pending`);
    for (const p of list(e?.remaining_pending)) check(text(p) && list(e?.visible_pending).includes(p), `${label}: hidden Pending`);
    check(Array.isArray(e?.mappings), `${label}: mappings required`);
    for (const [i, m] of list(e?.mappings).entries()) {
      const tag = `${label}/mapping${i}`;
      check(stageSets[0].has(m?.source_ref), `${tag}: unknown source stage`);
      check(['comparison', 'Pending', 'None found', 'Not selected'].includes(m?.status), `${tag}: invalid status`);
      if (m?.status === 'comparison') check(stageSets[1].has(m?.chinese_ref), `${tag}: unknown Chinese stage`);
      else check(m?.chinese_ref === null || stageSets[1].has(m?.chinese_ref), `${tag}: invalid empty-stage reference`);
      for (const fit of ['semantic_fit', 'phonetic_fit', 'structural_fit']) check(fits.has(m?.[fit]), `${tag}: independent ${fit} required`);
      for (const field of ['unit', 'phonetic_rationale', 'counterevidence']) check(text(m?.[field]), `${tag}: ${field} required`);
      refs(m?.evidence, tag);
      check(m?.historical_relation === 'Not claimed', `${tag}: unsupported common-origin promotion`);
      check(m?.review === 'requires editorial/evidence review', `${tag}: human evidence review required`);
    }
    if (e?.featured?.form !== 'Pending') {
      const i = e?.featured?.mapping_ref;
      const m = Number.isInteger(i) ? list(e?.mappings)[i] : undefined;
      check(text(e?.featured?.scope) && m?.status === 'comparison' && stageSets[0].has(m?.source_ref), `${label}: Featured requires scoped comparison`);
      check(e?.featured?.status === 'Candidate', `${label}: Featured cannot become Proven`);
    }
    for (const r of list(e?.relations)) {
      check(relationKinds.has(r?.kind) && typeof r?.confirmed_chronology === 'boolean', `${label}: relation category required`);
      check(text(r?.description), `${label}: relation explanation required`);
      refs(r?.source_refs, `${label}/relation`);
      if (r?.confirmed_chronology === true) {
        check(r?.kind === 'documented semantic development', `${label}: coexistence/comparison cannot become confirmed chronology`);
        check(text(r?.evidence_review_reference), `${label}: confirmed chronology needs explicit evidence-review reference`);
      }
    }
    check(Array.isArray(e?.relations) && e.relations.length > 0, `${label}: explicit relation/chronology status required`);
    check(['D1', 'D2', 'D3', 'D4', 'D5'].includes(e?.lexical_subclaim_depth_proposal) && text(e?.d1_gate?.reason), `${label}: depth rationale required`);
    if (e?.lexical_subclaim_depth_proposal === 'D1') {
      check(text(e?.d1_gate?.bilateral_evidence_review), `${label}: D1 needs explicit bilateral evidence assessment, not schema validity`);
      for (const [side, key] of [['source', 'source_stages'], ['chinese', 'chinese_stages']]) {
        const id = e?.d1_gate?.[side + '_historical_stage_ref'];
        const n = list(e?.[key]).find(x => x?.id === id);
        check(n?.evidence_layer === 'historical' && n?.evidence_status === 'attested' &&
          list(n?.source_refs).length > 0 && text(n?.period) && !/pending|unknown|modern|current/i.test(n.period),
          `${label}: D1 requires referenced ${side}-side historical evidence, not a modern translation`);
      }
      check(list(e?.mappings).some(m => m?.status === 'comparison' &&
        m.source_ref === e?.d1_gate?.source_historical_stage_ref &&
        m.chinese_ref === e?.d1_gate?.chinese_historical_stage_ref &&
        list(m.evidence).length > 0), `${label}: D1 historical units require an evidenced stage comparison`);
    }
  }
  return {errors, review_required: true, note: 'Passing does not verify attestation, chronology, pronunciation, fit, or D1 sufficiency.'};
}

export function validatePilotFiles() {
  const doc = JSON.parse(fs.readFileSync(path.join(root, proposalPath), 'utf8'));
  const result = validateDepth(doc);
  for (const [file, expected] of [
    ['data/candidates/production-corpus.v0.1.json', doc.corpus_sha256],
    ['research/calibration/convenir-depth-v1/REPORT.md', doc.calibration_sha256]
  ]) {
    const bytes = fs.readFileSync(path.join(root, file));
    const hash = createHash('sha256').update(bytes).digest('hex');
    // Original byte hashes remain in the frozen proposal. A separate acceptance
    // record provides LF-normalized checksums for cross-platform Git recovery.
    const acceptance = JSON.parse(fs.readFileSync(path.join(root, 'research/depth-upgrades/pilot-001/acceptance.json'), 'utf8'));
    const normalized = createHash('sha256').update(bytes.toString('utf8').replace(/\r\n/g, '\n')).digest('hex');
    const approved = acceptance.preserved_inputs?.[file];
    if (hash !== expected && !(approved?.original_sha256 === expected && approved?.lf_sha256 === normalized))
      result.errors.push(`Frozen input changed: ${file}; explicitly rebase proposal, never silently rewrite checksum.`);
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = validatePilotFiles();
    if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1; }
    else console.log('Depth pilot mechanical checks passed; editorial/evidence review still required.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
