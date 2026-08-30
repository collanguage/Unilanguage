import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "semantic-mapper.html", "dictionary.html", "data-foundation.html", "search.html"];
const errors = [];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|#)/.test(ref)) continue;
    const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!clean) continue;
    const target = path.resolve(path.dirname(path.join(root, page)), clean);
    if (!target.startsWith(root) || !fs.existsSync(target)) errors.push(`${page} → ${ref}`);
  }
}
if (errors.length) {
  console.error("Broken product links:");
  errors.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`${pages.length} critical pages: all local links resolve`);
