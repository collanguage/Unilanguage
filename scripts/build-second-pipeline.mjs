import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import render from '../js/second-pipeline.js';
import {validateEditorial,pilotSlugs} from './validate-second-pipeline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dataset=read('data/language-book.v1.0.json'),fragments=read('data/review/second-pipeline-page-fragments.v1.json');
const errors=validateEditorial(dataset);if(errors.length)throw Error(errors.join('\n'));
for(const slug of pilotSlugs){
 const e=dataset.entries.find(e=>e.slug===slug),f=fragments[slug];
 const head=f?.head||`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${slug.toUpperCase()} | Unilanguage</title><link rel="stylesheet" href="../css/sky-case.css"></head>`;
 const styles='<style>.second-pipeline{overflow-wrap:anywhere}.second-pipeline>h2{display:none}.site-nav{max-width:1100px;margin:auto;padding:1rem 1.2rem}.second-pipeline .csl-layer{padding:1rem;border:1px solid #ccd5dc;border-radius:8px;margin:1rem 0}.second-pipeline details{margin:1rem 0}.second-pipeline pre{font-size:.82rem}main{max-width:1100px;margin:auto;padding:1.2rem}img{max-width:100%;height:auto}.csl-archive{overflow-wrap:anywhere}</style>';
 const html=head.replace('</head>',styles+'</head>')+`\n<body><nav class="site-nav"><a href="../index.html">Home</a> · <a href="../dictionary.html">Dictionary</a> · <a href="../semantic-mapper.html?q=${slug}">Semantic Mapper</a></nav><main><header class="word-hero"><h1>${slug.toUpperCase()}</h1><p>Language Book · Second-Pipeline Pilot · Jinkai Liu</p></header>${render.render(e,'../')}${f?`<section aria-label="Author literature"><h2>Author’s Literary / Semantic Creation</h2><p>Literary freedom ≠ historical evidence.${slug==='namcha-barwa'?' Tibetan = Translation Draft / Native review pending.':''}</p>${f.literary}</section><details class="csl-archive"><summary>Original page archive / 历史研究版本</summary><p>Provenance only. Earlier wording is retained for comparison; the frozen classifications above govern the current entry. Historical interpretations below are not newly endorsed.</p>${f.archive}</details>`:''}</main><footer>Unilanguage · Language, a system. · Historical Relation: Not claimed</footer>${slug==='namcha-barwa'?'<script src="../js/literary-tabs.js"></script>':''}</body></html>\n`;
 const target=path.join(root,e.page);
 if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==html)throw Error(`${e.page}: generated page is stale`);}else fs.writeFileSync(target,html);
}
console.log('Second-pipeline pages: 5 · literature preserved · editorial gate PASS');
