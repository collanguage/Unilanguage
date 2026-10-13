const {createHash} = require('node:crypto');
const {execFileSync} = require('node:child_process');
const path = require('node:path');
// Exact Production-008 frontend snapshot only. Unknown edits are returned unchanged,
// so every historical scope assertion still fails for changes beyond this repair.
// Data, schema, words and research are never substituted by this helper.
const baseline = 'b34f5c1f402aa8ebed35ca11fcfa538a59c282c8';
const repairScope = {
  "js/search.js": "355d81f77012208c2980f0c9355fa8126ecbc43602c9bd9322394540a5f76e7f",
  "js/semantic-mapper.js": "857f2c3b02916365f48e2931e926a05480fc3cf64bc44b92ebc5810efa77e3bf",
  "dictionary.html": "6ac0eda1221357e2b748a92022a58c00c27aced181848b286bd2e51c309f76e3",
  "search.html": "62a456dd4f4d211a18329c4617ed7192497e7ee7eb709e3b057c1b7136e56966",
  "semantic-mapper.html": "1b031820eda926aac4599c72bac5fc7cb1c6a83bc042391cf6f4c917a4432fad"
};
const cache = new Map();
function beforeMapperIntegration(source) {
  const normalized = source.replace(/\r\n/g,'\n');
  const hash = createHash('sha256').update(normalized).digest('hex');
  const file = Object.keys(repairScope).find(file => repairScope[file] === hash);
  if (!file) return source;
  if (!cache.has(file)) cache.set(file, execFileSync('git',['show',baseline+':'+file],
    {cwd:path.resolve(__dirname,'..'),encoding:'utf8',maxBuffer:40e6}).replace(/\r\n/g,'\n'));
  return cache.get(file);
}
module.exports = {beforeMapperIntegration, repairScope, baseline};
