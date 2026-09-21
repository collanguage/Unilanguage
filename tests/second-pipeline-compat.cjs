const scope=['at','figure','new','water','namcha-barwa'];
function beforeSecondPipeline(d){d=require('./final-lexical-compat.cjs').beforeFinalLexical(d);return {...d,entries:d.entries.map(e=>e.legacy_migration?.version==='second-pipeline-0.1'?require('./legacy-research-view.cjs').legacyEntry(e):e)};}
function isSecondPipelineFile(f){return [...scope,...require('./final-lexical-compat.cjs').scope,...require('./final-structural-compat.cjs').scope].some(s=>f===s+'.html'||f===s+'.v1.json');}
function stripSecondPipeline(s){return s
 .replace(/    \/\/ SECOND-PIPELINE:START\n[\s\S]*?    \/\/ SECOND-PIPELINE:END\n/,'')
 .replace(/\/\* SECOND-PIPELINE:START \*\/.*?\/\* SECOND-PIPELINE:END \*\/ /g,'')
 .replace(/<script src="js\/second-pipeline.js\?v=1\.2\.(?:45|47)"><\/script>\n/g,'');}
module.exports={beforeSecondPipeline,isSecondPipelineFile,stripSecondPipeline};
