const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
test('Publication output: cached dist is preserved and new output contains no stale files',async()=>{
 const {preparePublicationOutput}=await import('../scripts/prepare-publication-output.mjs');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'unilanguage-output-test-'));
 const out=preparePublicationOutput(root);fs.writeFileSync(path.join(out,'stale.txt'),'old release');
 assert.equal(preparePublicationOutput(root),out);assert.deepEqual(fs.readdirSync(out),[]);
 const backups=fs.readdirSync(root).filter(n=>n.startsWith('.publication-backup-'));assert.equal(backups.length,1);
 assert.equal(fs.readFileSync(path.join(root,backups[0],'dist/stale.txt'),'utf8'),'old release');
});
test('Publication output: refuses a file in place of output',async()=>{
 const {preparePublicationOutput}=await import('../scripts/prepare-publication-output.mjs');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'unilanguage-output-test-'));fs.writeFileSync(path.join(root,'dist'),'preserve');
 assert.throws(()=>preparePublicationOutput(root),/unexpected/);assert.equal(fs.readFileSync(path.join(root,'dist'),'utf8'),'preserve');
});
test('Publication output: refuses a linked directory without moving its contents',async()=>{
 const {preparePublicationOutput}=await import('../scripts/prepare-publication-output.mjs');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'unilanguage-output-test-')),outside=fs.mkdtempSync(path.join(os.tmpdir(),'unilanguage-output-target-'));
 fs.writeFileSync(path.join(outside,'preserve.txt'),'not output');fs.symlinkSync(outside,path.join(root,'dist'),process.platform==='win32'?'junction':'dir');
 assert.throws(()=>preparePublicationOutput(root),/unexpected/);assert.equal(fs.readFileSync(path.join(outside,'preserve.txt'),'utf8'),'not output');
});
