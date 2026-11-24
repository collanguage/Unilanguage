const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const data = require("../data/language-book.v1.0.json");
const { mapperUrl, resolve } = require("../js/production-candidate-data.js");

test("publication navigation supports nested pages and preserves archival text", async () => {
  const { integrateSiteInterface } = await import("../scripts/integrate-site-interface.mjs");
  const source = '<html lang="en"><head></head><body><main>Archived text</main></body></html>';
  const output = integrateSiteInterface("experiments/002/results.html", source);
  assert.match(output, /href="\.\.\/\.\.\/book\.html#learning-title"/);
  assert.match(output, /src="\.\.\/\.\.\/js\/reader-language\.js"/);
  assert.match(output, /Archived text<\/main>/);
  assert.match(output, /Original page material/);
  assert.match(output, /declares English as its language/);
  assert.equal(integrateSiteInterface("templates/sample.html", source), source);
  assert.equal(integrateSiteInterface("experiments/002/results.html", output), output);
});

test("Mapper resolves recorded forms and reopens a chosen legacy identity", () => {
  const sign = structuredClone(data.entries.find((entry) => entry.slug === "sign"));
  sign.search_terms = [];
  const dataset = { entries: [sign] };
  const match = resolve(dataset, null, "signe");
  assert.equal(match.kind, "legacy");
  assert.equal(match.legacyId, sign.id);
  assert.equal(resolve(dataset, null, "signe", { domain: "legacy", legacyId: sign.id }).kind, "legacy");
  assert.equal(resolve(dataset, null, "signe", { domain: "legacy", legacyId: "wrong" }).kind, "invalid-identity");
});

test("Mapper result links keep the language and the selected identity", () => {
  globalThis.UnilanguageInterface = { language: "zh-Hans" };
  try {
    const url = new URL(mapperUrl("signe", { domain: "legacy", legacyId: "chosen" }), "https://example.test");
    assert.deepEqual(Object.fromEntries(url.searchParams), { q: "signe", ui: "zh-Hans", domain: "legacy", legacyId: "chosen" });
  } finally {
    delete globalThis.UnilanguageInterface;
  }
});

test("ten primary reader destinations have bilingual guides and translation scope notices", async () => {
  const { integrateSiteInterface } = await import("../scripts/integrate-site-interface.mjs");
  for (const page of ["index", "semantic-mapper", "protocol", "translation-protocol", "hypothesis-lab", "dictionary", "search", "data-foundation", "evidence-and-references", "graph"]) {
    const name = page + ".html";
    const source = readFileSync(join(__dirname, "..", name), "utf8");
    const output = integrateSiteInterface(name, source);
    const guide = output.match(/<aside class="reader-guide".*?<\/aside>/s)?.[0];
    assert.match(guide, /lang="en"/, name);
    assert.match(guide, /lang="zh-Hans"/, name);
    assert.match(output, /译文以页面所示为准/, name);
  }
});
