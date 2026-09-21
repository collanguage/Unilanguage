import fs from 'node:fs';
import path from 'node:path';

// Netlify can restore yesterday's generated output. Preserve it rather than
// deleting it or publishing stale files beside the newly validated release.
export function preparePublicationOutput(root){
 const workspace=fs.realpathSync(root),out=path.join(workspace,'dist');
 if(fs.existsSync(out)){
  const stat=fs.lstatSync(out);
  if(stat.isSymbolicLink()||!stat.isDirectory()||fs.realpathSync(out)!==out)
   throw Error('Refusing an unexpected publication output target');
  const backup=fs.mkdtempSync(path.join(workspace,'.publication-backup-'));
  fs.renameSync(out,path.join(backup,'dist'));
 }
 fs.mkdirSync(out);
 return out;
}
