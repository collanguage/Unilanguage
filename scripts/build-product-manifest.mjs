import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "data/language-book.schema.json", "data/language-book.v0.2.json", "data/candidates/import-template.json", "data/candidates/README.md", "data/candidates/package-e-batch-001.v0.2.json",
  "semantic-mapper.html", "dictionary.html", "data-foundation.html", "search.html", "index.html", "css/semantic-mapper.css",
  "js/language-book-data.js", "js/semantic-mapper.js", "js/search.js",
  "scripts/validate-language-book.mjs", "scripts/check-product-links.mjs", "tests/product-v0.2.test.cjs",
  "docs/product/semantic-mapper-v0.1.md", "docs/product/semantic-mapper-v0.2.md", "README.md", "sitemap.xml"
];
const records = files.map((file) => {
  // Hash repository/deployment text bytes, not platform-specific CRLF checkouts.
  const bytes = Buffer.from(fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n"), "utf8");
  return { path: file, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
});
const manifest = {
  product: "Unilanguage Semantic Mapper MVP",
  version: "0.2.0",
  dataset_version: "0.2.0",
  created_at: "2026-08-30",
  canonical_dataset: "data/language-book.v0.2.json",
  canonical_schema: "data/language-book.schema.json",
  published_entry_count: JSON.parse(fs.readFileSync(path.join(root, "data/language-book.v0.2.json"), "utf8")).entries.filter((entry) => entry.entry_review_status === "published").length,
  candidate_entry_count: JSON.parse(fs.readFileSync(path.join(root, "data/candidates/package-e-batch-001.v0.2.json"), "utf8")).records.length,
  files: records,
};
fs.writeFileSync(path.join(root, "data", "product-manifest.v0.2.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, "data", "product-checksums.v0.2.sha256"), `${records.map((record) => `${record.sha256}  ${record.path}`).join("\n")}\n`);
const datasetRecord = records.find((record) => record.path === "data/language-book.v0.2.json");
console.log(`Product manifest v0.2.0 written · dataset SHA-256 ${datasetRecord.sha256}`);
