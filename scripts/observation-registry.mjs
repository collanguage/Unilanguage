import {createHash, randomUUID} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import Ajv from 'ajv';

const schema = JSON.parse(fs.readFileSync(new URL('../research/observations/registry.schema.v0.1.json',import.meta.url),'utf8'));
const validateSchema = new Ajv({allErrors:true}).compile(schema);

export const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const copy = value => structuredClone(value);
const requireThat = (ok, message) => { if (!ok) throw Error(message); };
const origins = ['jinkai_original', 'contributor', 'ai_discovery', 'unknown'];
const exposures = ['unexposed', 'exposed_to_ai', 'post_ai_observation', 'unknown'];
const researchStates = ['queued', 'research', 'freeze_proposal', 'accepted_reference', 'archived'];
const timestamp = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

// Immutable content is stored once. All later normalization, links and state
// changes are append-only events, never edits to the original observation.
export function observation(input, now = new Date().toISOString()) {
  const result = {
    observation_id: input.observation_id || `OBS-${randomUUID()}`,
    origin_type: input.origin_type, author: input.author ?? null,
    original_text: input.original_text, source_form: input.source_form,
    source_language: input.source_language, proposed_mapping: input.proposed_mapping ?? null,
    reasoning_raw: input.reasoning_raw ?? '', created_at: now,
    source_date: input.source_date ?? null, provenance: copy(input.provenance),
    ai_exposure_status: input.ai_exposure_status ?? 'unknown',
    research_status: input.research_status ?? 'queued',
    linked_candidate_ids: [], linked_mapping_ids: [],
    holdout_status: input.holdout_status ?? 'not_eligible',
    historical_relation: 'Not claimed', evidence_status: input.evidence_status ?? 'Pending',
    ai_discovery: input.ai_discovery ?? null
  };
  validateObservation(result);
  return result;
}

export function validateObservation(r) {
  for (const k of ['observation_id','original_text','source_form','source_language','evidence_status'])
    requireThat(nonempty(r[k]), `Missing ${k}`);
  requireThat(origins.includes(r.origin_type), 'Invalid origin');
  requireThat(exposures.includes(r.ai_exposure_status), 'Invalid exposure');
  requireThat(researchStates.includes(r.research_status), 'Invalid research state');
  requireThat(timestamp(r.created_at) && (r.source_date === null || nonempty(r.source_date)), 'Invalid date');
  requireThat(r.provenance && nonempty(r.provenance.source_location) && nonempty(r.provenance.attribution_basis), 'Provenance required');
  requireThat(typeof r.reasoning_raw === 'string', 'Raw reasoning must be preserved text');
  requireThat(r.proposed_mapping === null || nonempty(r.proposed_mapping), 'Invalid proposed mapping');
  requireThat(Array.isArray(r.linked_candidate_ids) && Array.isArray(r.linked_mapping_ids), 'Links required');
  requireThat(r.historical_relation === 'Not claimed', 'Observation cannot establish historical relation');
  if (r.origin_type === 'unknown') requireThat(r.author === null, 'Unknown provenance cannot name an author');
  if (r.origin_type === 'jinkai_original') requireThat(r.author === 'Jinkai Liu' && r.provenance.authorship_verified === true, 'Explicit verified authorship required');
  if (r.origin_type === 'contributor') requireThat(nonempty(r.author) && r.author !== 'Jinkai Liu' && r.provenance.authorship_verified === true, 'Contributor identity required');
  if (r.origin_type === 'ai_discovery') {
    const a = r.ai_discovery;
    requireThat(nonempty(r.author) && a, 'AI provenance required');
    for (const k of ['run_reference','model','generation_method','input_scope','candidate','independence_status']) requireThat(nonempty(a[k]), `AI ${k} required`);
    requireThat(Array.isArray(a.controls) && Array.isArray(a.counterexamples), 'AI controls required');
    requireThat(r.ai_exposure_status === 'post_ai_observation', 'AI records are post-AI');
  } else requireThat(r.ai_discovery === null, 'Human/unknown cannot contain AI discovery attribution');
  requireThat(['not_eligible','reserved','revealed'].includes(r.holdout_status), 'Invalid holdout');
  if (r.ai_exposure_status === 'unexposed') requireThat(['jinkai_original','contributor'].includes(r.origin_type) && r.provenance.intake_mode === 'non_llm', 'Unexposed requires non-LLM human intake');
  if (r.holdout_status === 'reserved') requireThat(r.origin_type === 'jinkai_original' && r.ai_exposure_status === 'unexposed' && nonempty(r.proposed_mapping), 'Holdout requires unexposed explicit author target');
}

export const emptyRegistry = () => ({version:'0.1', events:[]});

export function append(registry, kind, payload, actor = 'intake', at = new Date().toISOString()) {
  const next = copy(registry);
  const event = {sequence:next.events.length + 1, at, actor, kind, payload:copy(payload), previous_hash:next.events.at(-1)?.hash ?? null};
  event.hash = digest(event);
  next.events.push(event);
  replay(next);
  return next;
}

export function replay(registry) {
  requireThat(validateSchema(registry), `Registry schema invalid: ${JSON.stringify(validateSchema.errors)}`);
  requireThat(registry.version === '0.1' && Array.isArray(registry.events), 'Invalid registry envelope');
  const observations = new Map(), objects = new Map();
  let previous = null;
  registry.events.forEach((e, index) => {
    const {hash, ...body} = e;
    requireThat(e.sequence === index+1 && e.previous_hash === previous && digest(body) === hash && timestamp(e.at), 'Broken event chain');
    previous = hash;
    const p = e.payload;
    if (e.kind === 'ingest') {
      validateObservation(p);
      requireThat(!observations.has(p.observation_id), 'Observation ID already exists');
      requireThat(p.linked_candidate_ids.length === 0 && p.linked_mapping_ids.length === 0, 'Use link events');
      observations.set(p.observation_id, {...copy(p), normalizations:[], review_status:'unreviewed', publication_status:'not_published'});
      return;
    }
    if (e.kind === 'object') {
      requireThat(nonempty(p.id) && ['candidate','mapping'].includes(p.kind) && nonempty(p.source_ref), 'Invalid research object');
      requireThat(!objects.has(p.id), 'Duplicate research object');
      // Object IDs are adjudicated identities, not fuzzy spelling/family matches.
      objects.set(p.id, copy(p)); return;
    }
    const r = observations.get(p.observation_id);
    requireThat(r, 'Unknown observation reference');
    if (e.kind === 'normalize') {
      requireThat(p.normalized && typeof p.normalized === 'object', 'Normalization required');
      requireThat(r.holdout_status !== 'reserved', 'Reserved holdout cannot be normalized by research');
      r.normalizations.push({at:e.at, actor:e.actor, value:copy(p.normalized)});
    } else if (e.kind === 'link') {
      const obj = objects.get(p.object_id);
      requireThat(obj, 'Unknown object reference');
      requireThat(r.holdout_status !== 'reserved', 'Reserved holdout cannot link into production');
      const ids = obj.kind === 'candidate' ? r.linked_candidate_ids : r.linked_mapping_ids;
      if (!ids.includes(obj.id)) ids.push(obj.id);
    } else if (e.kind === 'exposure') {
      requireThat(exposures.includes(p.status), 'Invalid exposure');
      const allowed = {unexposed:['exposed_to_ai'], unknown:['exposed_to_ai'], exposed_to_ai:[], post_ai_observation:[]};
      requireThat(p.status === r.ai_exposure_status || allowed[r.ai_exposure_status].includes(p.status), 'Exposure cannot regress or rewrite history');
      requireThat(r.holdout_status !== 'reserved', 'Explicit reveal required');
      r.ai_exposure_status = p.status;
    } else if (e.kind === 'reveal') {
      requireThat(e.actor === 'human_intake' && nonempty(p.authorization_ref) && r.holdout_status === 'reserved', 'Human reveal authorization required');
      r.holdout_status = 'revealed'; r.ai_exposure_status = 'exposed_to_ai';
    } else if (e.kind === 'research') {
      requireThat(r.holdout_status !== 'reserved', 'Reserved holdout cannot enter production');
      const transitions = {queued:['research','archived'], research:['freeze_proposal','archived'], freeze_proposal:['research','archived'], accepted_reference:[], archived:[]};
      requireThat(transitions[r.research_status].includes(p.status), 'Review Gate: worker stops at Freeze Proposal');
      r.research_status = p.status;
    } else throw Error(`Unsupported event: ${e.kind}`);
  });
  return {observations:[...observations.values()], objects:[...objects.values()]};
}

export function assertAppendOnly(previous, next) {
  replay(previous); replay(next);
  requireThat(next.events.length >= previous.events.length && isDeepStrictEqual(previous.events, next.events.slice(0, previous.events.length)), 'Immutable history changed');
}

// No acceptance/publication writer is exposed. A future human-review service
// must bind approval to a proposal digest; the worker API stops at proposal.
export function productionTasks(registry) {
  const state = replay(registry), tasks = new Map();
  for (const r of state.observations) {
    if (r.holdout_status === 'reserved' || ['unexposed','unknown'].includes(r.ai_exposure_status) || ['archived','accepted_reference'].includes(r.research_status)) continue;
    for (const id of r.linked_candidate_ids) {
      if (!tasks.has(id)) tasks.set(id, {candidate_id:id, observation_ids:[], observations:[], status:'research_only', benchmark_eligibility:'Benchmark-ineligible after exposure', stop_at:'freeze_proposal'});
      const task = tasks.get(id);
      task.observation_ids.push(r.observation_id);
      task.observations.push({observation_id:r.observation_id, origin_type:r.origin_type, author:r.author, original_text:r.original_text, proposed_mapping:r.proposed_mapping, reasoning_raw:r.reasoning_raw, source_form:r.source_form, source_language:r.source_language, evidence_status:r.evidence_status, historical_relation:'Not claimed'});
    }
  }
  return [...tasks.values()];
}

export function publicMetadata(registry) {
  // Whitelist only opaque IDs and states. No source, target, provenance paths,
  // normalization, content hashes or derived semantic fields escape holdouts.
  return replay(registry).observations.map(r => ({observation_id:r.observation_id, origin_type:r.origin_type, ai_exposure_status:r.ai_exposure_status, holdout_status:r.holdout_status}));
}

export function loadRegistry(file) { return JSON.parse(fs.readFileSync(file,'utf8')); }
export function saveRegistry(file, registry) {
  replay(registry);
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const lock = `${file}.lock`;
  const fd = fs.openSync(lock,'wx');
  try {
    if (fs.existsSync(file)) assertAppendOnly(loadRegistry(file), registry);
    const temporary = `${file}.${randomUUID()}.tmp`;
    try { fs.writeFileSync(temporary, JSON.stringify(registry,null,2)+'\n',{flag:'wx',mode:0o600}); fs.renameSync(temporary,file); }
    finally { if(fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}

export function privateIntake({file, repoRoot, input, route, humanAuthorizationRef}) {
  requireThat(['production','holdout'].includes(route), 'Choose production or holdout');
  // Existing parent directory required: realpath prevents junction/symlink escape.
  const parent = fs.realpathSync(path.dirname(file)), root = fs.realpathSync(repoRoot);
  const relative = path.relative(root,parent);
  requireThat(relative.startsWith('..'+path.sep) || path.isAbsolute(relative), 'Private intake must be outside repository');
  requireThat(!fs.existsSync(file) || !fs.lstatSync(file).isSymbolicLink(), 'Private registry cannot be a symlink');
  requireThat(nonempty(humanAuthorizationRef), 'Human intake authorization required');
  if(route === 'holdout') requireThat(input.ai_exposure_status === 'unexposed', 'Holdout requires explicit pre-AI exposure attestation');
  const registry = fs.existsSync(file) ? loadRegistry(file) : emptyRegistry();
  if(route === 'holdout') requireThat(!replay(registry).observations.some(r =>
    r.ai_exposure_status !== 'unexposed' && (r.original_text === input.original_text ||
      (r.source_form === input.source_form && r.source_language === input.source_language && r.proposed_mapping === input.proposed_mapping))), 'Previously exposed observation/target cannot become holdout');
  const r = observation({...input, provenance:{...input.provenance,intake_mode:'non_llm',intake_authorization:humanAuthorizationRef}, ai_exposure_status:route === 'holdout'?'unexposed':'exposed_to_ai', holdout_status:route === 'holdout'?'reserved':'not_eligible'});
  saveRegistry(file, append(registry,'ingest',r,'human_intake',r.created_at));
  return {observation_id:r.observation_id, created_at:r.created_at, holdout_status:r.holdout_status};
}
