import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
// Both validators are hard publication gates. Do not generate a new freeze here.
for(const script of ['validate-schema.mjs','validate-language-book-v1.mjs'])execFileSync(process.execPath,[`scripts/${script}`],{stdio:'inherit'});
execFileSync(process.execPath,['--test','--test-name-pattern=Layer 1|Editorial validator|Frozen schema-valid|Reader/Mapper|Static pages','tests/second-pipeline.test.cjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/build-second-pipeline.mjs','--check'],{stdio:'inherit'});
execFileSync(process.execPath,['--test','--test-name-pattern=Final lexical gate|Final lexical REJECTS|Final lexical reader','tests/final-lexical.test.cjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/build-final-lexical.mjs','--check'],{stdio:'inherit'});
// Publish only tracked files; ignored private research and dependencies never ship.
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const out=path.resolve('dist');
if(fs.existsSync(out))throw Error('dist already exists: use a clean build directory');
fs.mkdirSync(out);
for(const name of files){
 if(name.startsWith('dist/')||name.startsWith('node_modules/')||name.split('/').includes('..'))throw Error(`Unsafe deployment path: ${name}`);
 if(!fs.existsSync(name))throw Error(`Missing tracked artifact: ${name}`);
 const dest=path.join(out,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(name,dest);
}
console.log(`Publication build passed: ${files.length} tracked files; schema + evidence/editorial gates.`);
