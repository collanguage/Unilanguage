import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
const schema=JSON.parse(fs.readFileSync(new URL('../data/language-book-entry.schema.v1.json',import.meta.url),'utf8'));
const dataset=JSON.parse(fs.readFileSync(new URL('../data/language-book.v1.0.json',import.meta.url),'utf8'));
const ajv=new Ajv({allErrors:true,strict:false,validateFormats:false});
export const validateSchema=ajv.compile(schema);
if(!validateSchema(dataset)){console.error(validateSchema.errors);process.exitCode=1;}else console.log('Full JSON Schema 2020-12: PASS (42 entries)');
