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
  "scripts/validate-final-structural.mjs", "scripts/build-final-structural.mjs", "tests/final-structural.test.cjs", "tests/final-structural-compat.cjs", "data/review/final-structural-freeze.v1.json", "data/review/final-structural-page-fragments.v1.json", "docs/research/final-structural-freeze.md", "words/form.html", "words/sign.html", "words/press.html", "words/above.html",
  "scripts/prepare-publication-output.mjs", "tests/publication-output.test.cjs",
  "scripts/build-final-lexical.mjs", "scripts/validate-final-lexical.mjs", "tests/final-lexical.test.cjs", "tests/final-lexical-compat.cjs", "data/review/final-lexical-freeze.v1.json", "data/review/final-lexical-discovery.v1.json", "docs/research/final-lexical-freeze.md", "words/convent.html", "words/fil.html", "words/marchand.html", "words/montrer.html",
  "tests/second-pipeline-compat.cjs", "docs/research/second-pipeline-migration-v0.1.md",
  "js/second-pipeline.js", "scripts/build-second-pipeline.mjs", "scripts/validate-second-pipeline.mjs", "scripts/validate-schema.mjs", "scripts/publication-build.mjs", "tests/second-pipeline.test.cjs", "data/review/second-pipeline-freeze.v1.json", "data/review/second-pipeline-page-fragments.v1.json", "docs/research/second-pipeline-final-freeze.md", "words/at.html", "words/figure.html", "words/water.html", "package.json", "pnpm-lock.yaml", "netlify.toml",
  "scripts/build-tier-c-final-a.mjs", "tests/tier-c-final-a.test.cjs", "words/a-indefinite-article.html", "data/review/tier-c-final-a-discovery.json", "docs/research/tier-c-final-a-freeze.md",
  "scripts/build-tier-c-batch3.mjs", "tests/tier-c-batch3.test.cjs", "docs/research/tier-c-batch3-freeze.md", "data/review/tier-c-batch3-discovery.json",
  "words/generate.html", "words/absolute.html",
  "scripts/build-tier-c-batch2.mjs", "tests/tier-c-batch2.test.cjs", "docs/research/tier-c-batch2-freeze.md", "data/review/tier-c-batch2-discovery.json",
  "words/abridge.html", "words/aliment.html", "words/acumen.html", "words/abound.html",
  "scripts/build-pending-final.mjs", "tests/pending-final.test.cjs", "words/media.html",
  "docs/research/pending-final-decision.md", "docs/research/pending-final-freeze.md", "docs/research/pending-final-discovery.md", "docs/research/pending-final-candidates.md", "data/review/pending-final-discovery.json",
  "scripts/build-tier-b-final.mjs", "tests/tier-b-final.test.cjs", "docs/research/tier-b-final-freeze.md",
  "words/man.html", "words/abbey.html", "tests/abbey-recalibration.test.cjs",
  "scripts/build-editorial-migration-batch2.mjs", "tests/editorial-migration-batch2.test.cjs", "docs/research/editorial-migration-batch2.md",
  "scripts/build-family-migration-batch1.mjs", "tests/family-migration-batch1.test.cjs", "docs/research/family-migration-batch1.md",
  "scripts/build-legacy-migration-pilot.mjs", "tests/legacy-migration.test.cjs", "tests/legacy-research-view.cjs", "docs/research/legacy-migration-pilot-v0.1.md",
  "js/diachronic-mapping.js", "scripts/build-abeyance-pilot.mjs", "tests/diachronic-pilot.test.cjs", "tests/legacy-ui-compat.cjs",
  "docs/research/abeyance-pilot-v0.1.md", "docs/research/abeyance-discovery-v1.0.md",
  "_redirects", "index.html",
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
  "semantic-mapper.html", "dictionary.html", "search.html", "data-foundation.html", "evidence-and-references.html",
  "words/abdominal.html", "tests/abdominal-split.test.cjs", "words/abbreviation.html", "tests/abbreviation-split.test.cjs",
  "words/abeyance.html", "tests/abeyance-recalibration.test.cjs", "words/aberrant.html", "tests/aberrant-recalibration.test.cjs", "protocol/protocol.mapping-framework.html",
  "words/abbreviate.html", "docs/research/abbreviate-source-audit-v1.md", "tests/abbreviate-recalibration.test.cjs",
  "words/abdicate.html", "docs/research/abdicate-source-audit-v1.md", "tests/abdicate-recalibration.test.cjs",
  "words/horse.html", "docs/research/horse-source-audit-v1.md", "tests/horse.test.cjs",
  "words/horizon.html", "images/horizon-winter-literary.png", "docs/research/horizon-source-audit-v1.md", "tests/horizon.test.cjs",
  "words/abhor.html", "docs/research/abhor-huo-source-audit-v1.md", "tests/abhor-recalibration.test.cjs",
  "words/new.html", "docs/research/new-niu-source-audit-v1.md", "tests/new-niu.test.cjs",
  "english.html", "chinese.html", "french.html",
  "words/abandon.html", "docs/abandon-semantic-network-v1.md", "tests/abandon-semantic-network.test.cjs",
  "data/evidence/mainland-source-recalibration.v1.json", "docs/standards/chinese-evidence-source-policy-v1.0.md",
  "docs/research/mainland-source-recalibration-v1.0.md", "tests/mainland-source-recalibration.test.cjs",
  "words/sky.html", "words/aback.html", "words/abash.html", "words/abdomen.html", "words/sound.html", "words/universe.html", "css/sky-case.css",
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
  version: "1.2.47", dataset_version: dataset.dataset_version, created_at: "2026-09-20",
  canonical_dataset: "data/language-book.v1.0.json",
  canonical_schema: "data/language-book-entry.schema.v1.json",
  entry_count: dataset.entries.length,
  published_entry_count: dataset.entries.filter((entry) => entry.entry_status === "Published").length,
  candidate_mapping_count: dataset.entries.filter((entry) => entry.mapping_status === "Candidate").length,
  files: records
};
fs.writeFileSync(path.join(root, "data", "product-manifest.v1.0.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, "data", "product-checksums.v1.0.sha256"), `${records.map((record) => `${record.sha256}  ${record.path}`).join("\n")}\n`);
console.log(`Product manifest v1.2.47 written · ${records.length} files`);
