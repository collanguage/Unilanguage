import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
// Does not read Work outputs or private stores. No research or deployment.
const root=fileURLToPath(new URL('..',import.meta.url));
const dest=fs.mkdtempSync(path.join(os.tmpdir(),'unilanguage-recovery-'));
const reportArg=process.argv[2];
if(!reportArg)throw Error('Usage: recover-production-check.mjs NEW_REPORT_PATH');
const reportPath=path.resolve(root,reportArg);
if(fs.existsSync(reportPath))throw Error('Refusing to overwrite recovery evidence');
// Compatibility regressions deliberately inspect historical commits. Use a
// full independent Git clone, not a history-free ZIP or shared object store.
execFileSync('git',['clone','--quiet','--no-local',root,dest],{stdio:'ignore'});
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean).sort();
const fingerprints=[];
for(const file of files) {
 const src=path.join(root,file),target=path.join(dest,file);
 if(!path.resolve(target).startsWith(path.resolve(dest)+path.sep))throw Error('Unsafe recovery path');
 if(fs.lstatSync(src).isSymbolicLink())throw Error('Recovery refuses repository symlinks');
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(src,target);
 fingerprints.push([file,createHash('sha256').update(fs.readFileSync(src)).digest('hex')]);
}
// Standard runtime dependency cache only, not state or Work data. Fresh hosts
// install this from package.json/pnpm-lock.yaml instead.
// pnpm junction layout cannot simply be dereferenced into a flat top-level
// ajv folder: dependencies live beside the real package. Copy the resolved
// dependency closure, preserving installed versions and rejecting conflicts.
const copiedPackages=new Map();
function copyPackage(name,from) {
 const req=createRequire(from);
 let dir=path.dirname(req.resolve(name));
 while(!fs.existsSync(path.join(dir,'package.json'))||JSON.parse(fs.readFileSync(path.join(dir,'package.json'))).name!==name){const parent=path.dirname(dir);if(parent===dir)throw Error('Package root not found: '+name);dir=parent;}
 const pkg=JSON.parse(fs.readFileSync(path.join(dir,'package.json')));
 if(copiedPackages.has(name)){if(copiedPackages.get(name)!==pkg.version)throw Error('Dependency version conflict: '+name);return;}
 copiedPackages.set(name,pkg.version);
 fs.cpSync(dir,path.join(dest,'node_modules',name),{recursive:true,dereference:true});
 for(const dependency of Object.keys(pkg.dependencies||{}))copyPackage(dependency,path.join(dir,'package.json'));
}
for(const name of Object.keys(JSON.parse(fs.readFileSync(path.join(root,'package.json'))).devDependencies||{}))copyPackage(name,path.join(root,'package.json'));
execFileSync('git',['add','--all'],{cwd:dest,stdio:'ignore'});
execFileSync('git',['-c','user.name=Recovery Fixture','-c','user.email=recovery@example.invalid','commit','-qm','Repository-only recovery fixture'],{cwd:dest});
const commands=[];
function run(args) {
 const output=execFileSync(process.execPath,args,{cwd:dest,env:{...process.env,NODE_PATH:''},encoding:'utf8',maxBuffer:16*1024*1024,timeout:240000});
 commands.push({args,exit_code:0,output_tail:output.slice(-1800),output_sha256:createHash('sha256').update(output).digest('hex')});
 console.log('PASS '+args.join(' '));return output;
}
for(const v of ['validate-schema.mjs','validate-language-book-v1.mjs','validate-production-candidates.mjs','validate-observation-registry.mjs','validate-queue-scheduler.mjs','validate-production-004.mjs','production-state.mjs'])run(['scripts/'+v]);
run(['scripts/prepare-scheduler-snapshot.mjs',path.join(dest,'recovery-snapshot.json')]);
run(['scripts/run-queue-scheduler.mjs',path.join(dest,'recovery-snapshot.json'),path.join(dest,'recovery-audit.json')]);
run(['scripts/run-tests.mjs']);
run(['scripts/publication-build.mjs']);
const state=JSON.parse(fs.readFileSync(path.join(dest,'research/production-state/manifest.v1.json')));
const audit=JSON.parse(fs.readFileSync(path.join(dest,'recovery-audit.json')));
const report={version:'1.0',at:new Date().toISOString(),status:'PASS',method:'Copied only repository tracked/pending-addition files plus installed package dependencies into independent temporary Git checkout. No Work output tree or private package mounted/copied.',source_tree_sha256:createHash('sha256').update(JSON.stringify(fingerprints)).digest('hex'),source_file_count:files.length,dependency_source:'Existing node_modules copied as standard dependency cache; fresh checkout uses pinned package install',temporary_checkout:dest,commands,counts:{legacy:state.legacy_corpus.count,active:state.active_candidate_corpus.count,archive:state.archive_count,controls:state.control_count,observations:state.observation_registry.count,pending_batches:state.pending_freeze_batches,eligible:state.eligible_queue_count,identity_pending:state.provenance_review_queue_count},dry_run:{selected:audit.selection.length,worker_runs:audit.worker_runs,publication_allowed:audit.publication_allowed},next_action:state.next_action,remaining_external_dependencies:['Node/package runtime installation','Private benchmark/holdout contents intentionally external; not required for Production scheduling','Research sources and Jinkai review needed only when separately authorized future work starts'],limitations:'Filesystem fixture validates code dependencies, not OS sandboxing of a hostile process. No isolated benchmark evaluator is claimed. Temporary fixture is retained for inspection.'};
fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log('Recovery evidence saved: '+reportPath);
