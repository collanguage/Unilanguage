const scope=['form','sign','press','above','light'];
function beforeFinalStructural(d){return {...d,entries:d.entries.map(e=>e.legacy_migration?.version==='final-structural-0.1'?require('./legacy-research-view.cjs').legacyEntry(e):e)};}
module.exports={scope,beforeFinalStructural};
