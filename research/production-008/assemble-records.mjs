// Packaging frozen research notes into the EXISTING Worker 1.1 contract.
// No candidate generation, scheduler dispatch, acceptance, or publication.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {replay} from '../../scripts/observation-registry.mjs';
import {validateWorkerOutput} from '../../scripts/production-worker.mjs';
const dir=fileURLToPath(new URL('.',import.meta.url)),root=path.resolve(dir,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,d)=>fs.writeFileSync(path.join(dir,p),JSON.stringify(d,null,2)+'\n');
const notes=read('research/production-008/research-notes.json');
const audit=read('research/production-008/selection-audit.json');
const sources=structuredClone(notes.sources);
const traditional={认:'認',识:'識',谢:'謝',压:'壓',压力:'壓',压强:'壓'};
for(const [c,v] of Object.entries(notes.chinese)) sources['zh-'+c]={
 url:'https://www.zdic.net/hans/'+(traditional[c]||c),
 scope:['压力','压强'].includes(c)?'Only 壓 character history; compound formation and terminology history explicitly Pending.':v[2]+' '+v[3],
 limitations:'Digital dictionary transcription accessed in this research session. Original print edition/page, palaeography and reconstructed phonology not independently verified.'
};
fs.mkdirSync(path.join(dir,'outputs'),{recursive:true});
const outputs=[];
const scopes={monstre:['abnormal/fabulous creature','fabulous creature (not every exceptional person)','Latin portent/omen'],monster:['abnormal/fabulous creature','fabulous creature (not successful performance)','Latin portent/omen'],presser:['urge / urgency','apply downward force','squeeze / crowd'],recognize:['identify a previously known entity / acknowledge','identify / know','gratitude: NOT an independently supported English equivalent'],reconnaître:['identify / acknowledge','identify on seeing again','gratitude constructions only'],lumen:['physical light','figurative clarity','lamp / light source'],lux:['sunlight','day / daylight','figurative clarity'],pression:['pressing action','abstract/social pressure','modern physical pressure per unit area']};
for(const [i,n] of notes.entries.entries()) {
 const sel=audit.selection[i]; if(sel.source_form!==n.entry)throw Error('Frozen selection mismatch');
 const refs=n.candidates.map(c=>'zh-'+c),pending=[
  'Chinese exact print edition/page and textual variants Pending; digital transcriptions only',
  'Old Chinese reconstruction and period-aligned phonetic comparison Pending',
  'Dated Chinese semantic-development links Pending; no shared chronology claimed'
 ];
 if(['lumen','pression','monstre','monster'].includes(n.entry))pending.push('Graph/compound identity: '+({lumen:'灯 / 燈 / 鐙',pression:'压力 / 压强 terminology',monstre:'妖 / 𡝩 / 䄏',monster:'妖 / 𡝩 / 䄏'}[n.entry]));
 const source_stages=n.stages.map(([form,language,period,meaning],j)=>({
  id:'s'+j,form,language,period,meaning,evidence_status:'dictionary-supported; historical assessment remains editorial',
  pronunciation:'Pending: historical reconstruction/IPA not independently checked; dictionary Latin quantity marks retained where provided',
  source_refs:[n.source],coexisting_senses:meaning,
  documented_semantic_change:'Dated attestations only as stated. Dictionary sense order is not a confirmed chronological chain.',
  chronology_confidence:'Source dictionary dates recorded; full semantic-development chronology Pending'
 }));
 const chinese_stages=[],mappings=[],candidate_table=[];
 n.candidates.forEach((c,j)=>{
  const [pron,modern,hist,phon,limit]=notes.chinese[c],sid='s'+n.source_indices[j],ref='zh-'+c;
  const excluded=n.entry==='recognize'&&c==='谢';
  chinese_stages.push({id:'c'+j+'m',form:c,language:'Chinese',period:'Modern Mandarin',meaning:modern,evidence_status:'sense-scoped semantic comparison',source_refs:[ref]},
   {id:'c'+j+'h',form:c,language:'Chinese',period:'Historical lexicographic layer; see named work; exact edition/chronology Pending',meaning:hist,evidence_status:'digital transcription lead, not independently checked original edition',source_refs:[ref]});
  const common={source_ref:sid,phonetic_fit:'Low',structural_fit:excluded?'Low':j===0?'Medium–High':'Medium',
   phonetic_rationale:'No strong modern sound match. Historical fanqie is a documentary lead, not reconstructed IPA or evidence of shared origin.',
   counterevidence:limit+'；'+n.counterexample,evidence:[n.source,ref],historical_relation:'Not claimed',review:'requires editorial/evidence review'};
  mappings.push({...common,source_unit:scopes[n.entry][j],chinese_ref:'c'+j+'m',status:excluded?'Not selected':'comparison',semantic_fit:excluded?'Low':j===0?'High':'Medium',unit:scopes[n.entry][j]+' ↔ '+modern+'; limited sense only'});
  mappings.push({...common,source_unit:scopes[n.entry][j],chinese_ref:'c'+j+'h',status:excluded?'Not selected':['灯','压力','压强'].includes(c)?'Pending':'comparison',semantic_fit:excluded?'Low':'Medium',phonetic_fit:'Pending',unit:'Historical-stage comparison: '+scopes[n.entry][j]+' ↔ '+hist});
  candidate_table.push({candidate:c,modern_pronunciation:pron,modern_meaning:modern,historical_sense:hist,
   middle_chinese:phon,old_chinese:'Pending: reconstruction system and edition not independently verified',
   character_history:'Traditional analysis above where available; palaeographic assessment Pending',dialect:'Not applicable to present bounded claim',
   source_refs:[ref],status:excluded?'semantic control / not selected':'serious candidate'});
 });
 const featured=n.featured==='Pending'?{form:'Pending'}:{form:n.featured,scope:n.scope,mapping_ref:0,status:'Candidate',type:'Limited Structural-Semantic Candidate',role:'reader-facing summary, not research object'};
 const coverage={};
 for(const [layer,status,detail] of [
  ['modern_mandarin','recorded','Sense-scoped comparison, not unrestricted lexical equivalence.'],
  ['historical_senses','partial','Candidate-specific digital transcription leads recorded; exact edition and semantic development Pending.'],
  ['middle_chinese','partial','Fanqie/rhyme leads individually recorded; no invented reconstruction.'],
  ['old_chinese','Pending','System/version and lexical matching not independently established.'],
  ['character_history_phonetic_series','partial','Traditional dictionary analysis distinguished from modern palaeographic confirmation.'],
  ['dialect','Not applicable','No dialect-dependent claim proposed.']
 ])coverage[layer]={status,detail,source_refs:status==='Not applicable'?[]:refs};
 const entry={candidate_id:sel.research_object_id,entry:n.entry,status:'Depth Freeze Proposal',historical_relation:'Not claimed',review_gate:'Jinkai Liu; no corpus writeback',
  source_stages,chinese_stages,chinese_coverage:coverage,mappings,featured,
  relations:[{kind:'attested coexistence',confirmed_chronology:false,description:'Multiple dictionary senses; their presentation order does not prove chronology.',source_refs:[n.source]},
   {kind:'editorial structural comparison',confirmed_chronology:false,description:n.analysis,source_refs:[n.source,...refs]}],
  remaining_pending:pending,visible_pending:pending,lexical_subclaim_depth_proposal:'D2',
  d1_gate:{reason:'Source foundation available. Chinese textual/graph identity, historical phonology and semantic-development assessment remain partial, insufficient for bilateral D1.'},
  candidate_table,controls:[{type:'sense boundary',observation:n.counterexample,outcome:'Reject unrestricted equivalence; preserve bounded comparisons'},
   {type:'false family / evidence promotion',observation:'Shared family, Chinese gloss or L-group hit does not establish cross-language history.',outcome:'Historical Relation Not claimed'}],
  expansion:{performed:false,generated:0,retained:0,not_selected:0,semantic_mismatch:0,evidence_failure:0,reason:'Optional systematic expansion not run; this is not a zero-retention experimental result.'}
 };
 const author='Imported legacy / author unknown; no authenticated human or AI authorship inferred. See immutable Registry observations '+sel.observation_ids.join(', ')+'.';
 const output={worker_method_version:'1.1',candidate_id:sel.research_object_id,primary_pipeline:'Lexical–Diachronic',status:'Editorial Freeze Proposal',corpus_writeback:false,review_by:'Jinkai Liu',
  source_identity:{source_form:n.entry,source_language:sel.source_language,lexical_identity:sel.lexical_identity,meaning_context:source_stages.at(-1).meaning,provenance:author},
  author_observation:author,observation_references:sel.observation_ids,ai_research_result:n.analysis,featured_summary:featured,depth_status:'D2',visible_pending:pending,
  evidence_boundaries:notes.method_limits,has_lexical_historical_claims:true,
  depth_record:{version:'1.1',status:'Depth Freeze Proposal',corpus_writeback:false,sources,entries:[entry]},
  editorial_action:n.featured==='Pending'?'Accept with Featured Pending (proposal only)':'Review limited Featured proposal'};
 const validation=validateWorkerOutput(output);if(validation.errors.length)throw Error(validation.errors.join('\n'));
 outputs.push(output);write('outputs/'+n.entry+'.json',output);
}
const ids=[...new Set(audit.selection.flatMap(s=>s.observation_ids))];
const registry=replay(read('research/observations/registry.v0.1.json'));
const observations=registry.observations.filter(o=>ids.includes(o.observation_id));
if(observations.length!==ids.length)throw Error('Missing scoped original observation');
write('observations.json',{source:'research/observations/registry.v0.1.json',status:'read-only scoped copy; original unchanged',observations});
write('proposal.json',{batch_id:'production-008',status:'awaiting_jinkai_review',accepted:false,worker_method_version:'1.1',
 selection_audit:'research/production-008/selection-audit.json',selection_frozen_at:audit.timestamp,record_completed_date:notes.record_date,
 candidate_ids:outputs.map(o=>o.candidate_id),outputs:outputs.map(o=>'research/production-008/outputs/'+o.source_identity.source_form+'.json'),
 depth_counts:{D1:0,D2:8,D3:0,D4:0,D5:0},publication_allowed:false,corpus_writeback:false,
 family_reuse:notes.family_reuse,selection_execution:'User authorized research from frozen dry-run selection; dry-run audit remains unchanged. No second Scheduler selection.',
 exposure:'All eight production-exposed; benchmark-ineligible. Unknown origin preserved.',
 corpus_counts_unchanged:{legacy:42,active:52,archives:2,controls:2},
 method_limits:notes.method_limits});
const files=['queue-snapshot.json','selection-audit.json','research-notes.json','observations.json','proposal.json',...outputs.map(o=>'outputs/'+o.source_identity.source_form+'.json')];
write('freeze-manifest.json',{version:'1.0',status:'proposal integrity, not editorial acceptance',record_date:notes.record_date,hash_algorithm:'sha256-utf8-lf',files:Object.fromEntries(files.map(f=>[f,createHash('sha256').update(fs.readFileSync(path.join(dir,f),'utf8').replace(/\r\n/g,'\n')).digest('hex')]))});
console.log('Eight Worker v1.1 proposals validated and saved; no corpus writes.');
