const scope=['convent','fil','marchand','montrer'];
function beforeFinalLexical(d){return {...d,entries:d.entries.map(e=>e.legacy_migration?.version==='final-lexical-0.1'?require('./legacy-research-view.cjs').legacyEntry(e):e)};}
module.exports={beforeFinalLexical,scope};
