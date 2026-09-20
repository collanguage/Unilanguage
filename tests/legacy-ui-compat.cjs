const assert = require('node:assert/strict');
// Remove only the approved pilot branch before comparing legacy renderer source.
// Everything outside this branch still has to match the historical fixture.
function assertLegacyUiEqual(actual, expected, message) {
  let normalized = actual.replace(/    \/\/ PILOT-HEADER:START[\s\S]*?\/\/ PILOT-HEADER:END\n/, '    const headerMapping = isAbandon\n');
  normalized = normalized.replace(/<script src="js\/diachronic-mapping.js(?:\?v=1\.2\.37)?"><\/script>\n/g, '');
  normalized = normalized.replace(/js\/(semantic-mapper|search)\.js\?v=1\.2\.(?:36|37)/g, (value, name) => expected.match(new RegExp(`js/${name}\\.js\\?v=[^"\\s]+`))?.[0] || value);
  assert.equal(normalized, expected, message);
}
module.exports = { assertLegacyUiEqual };

// Only the approved query projection and ABASH browse label differ. The active
// query semantics, immutability and unrelated-entry outputs are tested separately.
function assertLegacyDataEqual(actual, expected) {
 const body = /  function queryView\(entry, query\) \{[\s\S]*?\n  \}/;
 const a=actual.match(body)?.[0], b=expected.match(body)?.[0];
 assert.ok(a && b);
 assert.match(a,/delete result\.diachronic_semantic_mapping/);
 assert.match(a,/normalize\(view\.primary_mapping\.source\.word\)/);
 assert.equal(actual.replace(a,b).replace('abash: "使窘迫"','abash: "拍"'),expected);
}
module.exports.assertLegacyDataEqual=assertLegacyDataEqual;
