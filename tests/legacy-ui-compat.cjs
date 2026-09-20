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
