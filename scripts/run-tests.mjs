import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('..',import.meta.url));
const files=fs.readdirSync(new URL('../tests/',import.meta.url)).filter(f=>f.endsWith('.test.cjs')).sort().map(f=>'tests/'+f);
const result=spawnSync(process.execPath,['--test','--test-concurrency=1',...files],{cwd:root,stdio:'inherit'});
if(result.error)throw result.error;
process.exitCode=result.status??1;
