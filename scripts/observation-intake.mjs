import fs from 'node:fs';
import {privateIntake} from './observation-registry.mjs';

// Run by a trusted non-LLM intake operator. Pipe a JSON note through stdin;
// neither its text nor its target appears in command-line arguments or stdout.
// There is intentionally no implicit/default route.
const [file,route,authorizationRef]=process.argv.slice(2);
if(!file || !route || !authorizationRef) throw Error('Usage: node scripts/observation-intake.mjs OUTSIDE_REPO_REGISTRY production|holdout HUMAN_AUTHORIZATION_REF < note.json');
try {
  const input=JSON.parse(fs.readFileSync(0,'utf8'));
  const result=privateIntake({file,route,input,repoRoot:process.cwd(),humanAuthorizationRef:authorizationRef});
  console.log(JSON.stringify(result));
} catch {
  // Parser/schema exceptions can contain private snippets. Never echo them.
  console.error('Intake rejected. Check the private input, route, provenance and store permissions locally. No target content is printed.');
  process.exitCode=1;
}
