import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateDepth} from './validate-diachronic-depth.mjs';

export const WORKER_METHOD_VERSION = '1.1';
export const INSTRUCTIONS = 'research/methods/diachronic-depth-v1.1/WORKER.md';
export const LEXICAL_STEPS = [
  'Source Identity', 'Source Diachrony', 'Source Stage Meaning Freeze',
  'Chinese Candidate Discovery', 'Chinese Diachrony', 'Stage-to-Stage Mapping',
  'Phonetic Comparison', 'Evidence / Counterevidence', 'Featured Summary',
  'Depth Classification', 'Editorial Freeze Proposal'
];

// A task contract, not an autonomous model runner or an acceptance capability.
// Input must already have passed Scheduler identity and reservation gates.
export function workerContract(pipeline) {
  if (!['Lexical–Diachronic', 'Cultural–Structural–Literary'].includes(pipeline))
    throw Error('Approved primary pipeline required');
  const lexical = pipeline === 'Lexical–Diachronic';
  return {
    version: WORKER_METHOD_VERSION, instructions: INSTRUCTIONS,
    pipeline, depth_scope: lexical ? 'full lexical research object' : 'actual lexical-historical claims only',
    steps: lexical ? [...LEXICAL_STEPS] : [
      'Source Identity', 'Standard Meaning', 'Structural / Cultural / Literary Analysis',
      'Evidence Separation', 'Lexical Claim Depth Check if applicable', 'Editorial Freeze Proposal'
    ],
    required_output: ['source_identity', 'author_observation', 'ai_research_result',
      'featured_summary', 'depth_status', 'visible_pending', 'evidence_boundaries',
      'depth_record (lexical object or actual lexical-historical claims only)'],
    depth_record_fields: ['source_stages', 'chinese_stages', 'chinese_coverage',
      'mappings', 'relations', 'featured.scope', 'lexical_subclaim_depth_proposal'],
    missing_evidence: 'Pending; bounded research, not a reason to fabricate or search indefinitely',
    historical_relation_default: 'Not claimed',
    d1_is_quota: false, review_by: 'Jinkai Liu', stop_at: 'Editorial Freeze Proposal',
    corpus_writeback: false, publication_allowed: false
  };
}

export function validateWorkerOutput(output) {
  const errors = [];
  const text = x => typeof x === 'string' && x.trim().length > 0;
  const check = (ok, message) => { if (!ok) errors.push(message); };
  check(output?.worker_method_version === WORKER_METHOD_VERSION, 'Worker method v1.1 required');
  check(['Lexical–Diachronic', 'Cultural–Structural–Literary'].includes(output?.primary_pipeline), 'Approved pipeline required');
  check(output?.status === 'Editorial Freeze Proposal' && output?.corpus_writeback === false &&
    output?.review_by === 'Jinkai Liu', 'Worker cannot accept/publish its output');
  for (const key of ['source_form', 'source_language', 'lexical_identity', 'meaning_context', 'provenance'])
    check(text(output?.source_identity?.[key]), 'Source identity field required: ' + key);
  check(text(output?.author_observation) && text(output?.ai_research_result), 'Separate observation and AI result required; unknown must remain explicit');
  check(Array.isArray(output?.visible_pending) && Array.isArray(output?.evidence_boundaries), 'Pending and evidence boundaries required');
  check(typeof output?.has_lexical_historical_claims === 'boolean', 'Explicit lexical claim scope required');
  const lexical = output?.primary_pipeline === 'Lexical–Diachronic';
  if (lexical || output?.has_lexical_historical_claims) {
    errors.push(...validateDepth(output?.depth_record).errors);
    const entry = output?.depth_record?.entries?.[0];
    check(output?.depth_record?.entries?.length === 1, 'One research object per Worker output');
    check(entry?.candidate_id === output?.candidate_id, 'Depth record belongs to another object');
    check(JSON.stringify(output?.featured_summary) === JSON.stringify(entry?.featured), 'Featured summary must reference the deeper record');
    check(!lexical || output?.depth_status === entry?.lexical_subclaim_depth_proposal, 'Lexical depth status mismatch');
    for (const p of entry?.visible_pending || []) check(output?.visible_pending?.includes(p), 'Worker summary hides depth Pending');
  } else {
    check(output?.depth_status === 'D4', 'Non-lexical primary scope is D4');
    const f = output?.featured_summary;
    check(f?.form === 'Pending' || (text(f?.scope) && text(f?.semantic_fit) && text(f?.phonetic_fit) &&
      f?.historical_relation === 'Not claimed' && f?.status === 'Candidate'), 'Scoped non-lexical Featured with separate fits required');
  }
  return {errors, review_required: true,
    note: 'Mechanical contract only. Historical truth, sufficiency and fit require evidence/editorial review.'};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (!process.argv[2]) throw Error('Usage: node scripts/production-worker.mjs OUTPUT.json (validation only)');
    const result = validateWorkerOutput(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')));
    if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1; }
    else console.log('Worker v1.1 output contract passed; Jinkai Liu review remains required.');
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
