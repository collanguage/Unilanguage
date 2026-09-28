import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
import {schedule} from './queue-scheduler.mjs';

const [inputArg,outputArg]=process.argv.slice(2);
const input=inputArg && path.resolve(root,inputArg),output=outputArg && path.resolve(root,outputArg);
if(!input||!output)throw Error('Usage: run-queue-scheduler.mjs SANITIZED_SNAPSHOT NEW_AUDIT_FILE (dry run only)');
const snapshot=JSON.parse(fs.readFileSync(input,'utf8'));
const audit=schedule(snapshot);
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(audit,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({selected:audit.selection.map(x=>({id:x.research_object_id,source:x.source_form})),deferred:audit.deferred.length,composition:audit.composition,worker_runs:0},null,2));
