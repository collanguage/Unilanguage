import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const authoredEntryFiles = fs.readdirSync(path.join(root, "data", "entries"))
  .filter((name) => name.endsWith(".v1.json"))
  .sort()
  .map((name) => `data/entries/${name}`);
const files = [
  "data/language-book-entry.schema.v1.json", "data/language-book.v1.0.json",
  ...authoredEntryFiles,
  "data/batches/dataset-expansion-batch-001.v1.json",
  "data/batches/legacy-website-import-batch-001.v1.json",
  "docs/language-book-entry-schema-v1.md", "scripts/build-language-book-v1.mjs",
  "docs/dataset-expansion-batch-001.md", "scripts/build-dataset-expansion-batch-001.mjs",
  "docs/legacy-website-import-batch-001.md", "scripts/build-legacy-website-import-batch-001.mjs",
  "scripts/validate-language-book-v1.mjs", "tests/language-book-v1.test.cjs",
  "tests/dataset-expansion-batch-001.test.cjs",
  "tests/legacy-website-import-batch-001.test.cjs",
  "tests/package-g1.test.cjs", "tests/package-g3.test.cjs", "tests/package-g4-light.test.cjs",
  "tests/product-v0.1.test.cjs", "tests/product-v0.2.test.cjs",
  "js/language-book-data.js", "js/semantic-mapper.js", "js/search.js", "js/literary-tabs.js",
  "semantic-mapper.html", "dictionary.html", "search.html", "data-foundation.html",
  "words/sky.html", "words/abdomen.html", "words/sound.html", "words/universe.html", "css/sky-case.css",
  "words/namcha-barwa.html", "css/namcha-barwa.css",
  "images/namcha-barwa-west-cherry933.jpg", "images/namcha-barwa-literary-landscape.png",
  "README.md", "sitemap.xml"
];
const records = files.map((file) => {
  const source = fs.readFileSync(path.join(root, file));
  const isBinary = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(path.extname(file).toLowerCase());
  const bytes = isBinary ? source : Buffer.from(source.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
  return { path: file, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
});
const dataset = JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v1.0.json"), "utf8"));
const manifest = {
  product: "Unilanguage Language Book + Semantic Mapper",
  version: "1.2.7", dataset_version: dataset.dataset_version, created_at: "2026-09-04",
  canonical_dataset: "data/language-book.v1.0.json",
  canonical_schema: "data/language-book-entry.schema.v1.json",
  entry_count: dataset.entries.length,
  published_entry_count: dataset.entries.filter((entry) => entry.entry_status === "Published").length,
  candidate_mapping_count: dataset.entries.filter((entry) => entry.mapping_status === "Candidate").length,
  files: records
};
fs.writeFileSync(path.join(root, "data", "product-manifest.v1.0.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, "data", "product-checksums.v1.0.sha256"), `${records.map((record) => `${record.sha256}  ${record.path}`).join("\n")}\n`);
console.log(`Product manifest v1.2.7 written · ${records.length} files`);
