// Run after pnpm build with Playwright and a local Chromium installed.
// PLAYWRIGHT_CORE and CHROMIUM can point to tools outside the repository.
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright");

const dist = path.resolve(__dirname, "../dist");
const mime = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".json": "application/json" };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://127.0.0.1").pathname;
    const file = path.resolve(dist, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(dist + path.sep)) throw new Error("Invalid path");
    const body = await fs.readFile(file);
    res.writeHead(200, { "Content-Type": (mime[path.extname(file)] || "application/octet-stream") + "; charset=utf-8" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});

async function run() {
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const base = "http://127.0.0.1:" + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/usr/bin/chromium" });
    const page = await browser.newPage({ viewport: { width: 320, height: 760 } });
    page.setDefaultTimeout(5000);
    const errors = [];
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(base);
    const navigation = page.locator(".reader-navigation");
    const chinese = navigation.getByRole("button", { name: "简体中文" });
    await chinese.focus();
    await page.keyboard.press("Enter");
    assert.equal(await chinese.getAttribute("aria-pressed"), "true");
    await page.locator(".reader-guide").getByText("探索 Unilanguage", { exact: true }).waitFor();
    await navigation.getByRole("link", { name: "学习导览", exact: true }).click();
    await page.waitForURL("**/book.html?ui=zh-Hans#learning-title");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

    await page.locator(".book-guides").getByRole("link", { name: /Protocol Book/ }).click();
    await page.getByRole("heading", { name: "语义协议", exact: true }).waitFor();
    await page.locator(".reader-guide").getByText(/可从「空间」一章/).waitFor();
    const chapter = page.locator('main a[href*="protocol.space.html"]').first();
    assert.equal(new URL(await chapter.getAttribute("href")).searchParams.get("ui"), "zh-Hans");
    await chapter.click();
    await page.getByText("页面原有资料", { exact: true }).waitFor();
    assert.match(await page.locator(".reader-original").innerText(), /原页面标注语言/);
    await navigation.getByRole("link", { name: "学习导览", exact: true }).click();
    await page.locator(".book-guides").getByRole("link", { name: /UTP Lab/ }).click();
    await page.getByRole("heading", { name: "翻译协议实验室", exact: true }).waitFor();

    await navigation.getByRole("link", { name: "语义映射器", exact: true }).click();
    const query = page.getByRole("searchbox", { name: "词、专名或已记录形式" });
    await page.waitForFunction(() => new URL(location.href).searchParams.has("q"));
    await query.fill("signe");
    await query.press("Enter");
    await page.waitForFunction(() => new URL(location.href).searchParams.get("q") === "signe");
    const result = new URL(page.url());
    assert.equal(result.searchParams.get("ui"), "zh-Hans");
    assert.equal(result.searchParams.get("domain"), "legacy");
    assert.ok(result.searchParams.get("legacyId"));
    await page.reload();
    await page.waitForFunction(() => !document.querySelector("#mapperResult").hidden);
    assert.equal(await query.inputValue(), "signe");
    assert.equal(await chinese.getAttribute("aria-pressed"), "true");
    assert.equal(new URL(page.url()).searchParams.get("legacyId"), result.searchParams.get("legacyId"));

    await navigation.getByRole("link", { name: "航天共通语言计划", exact: true }).click();
    await page.getByRole("heading", { name: /共通符号创造实验室/ }).waitFor();
    await page.getByRole("combobox", { name: /拟表达的关系/ }).selectOption("inside");
    await page.getByRole("combobox", { name: /标记/ }).selectOption("▲");
    assert.match(await page.locator('#symbol-description [lang="zh-Hans"]').innerText(), /三角形在方框内部/);
    assert.match(await page.locator('#symbol-description [lang="en"]').innerText(), /Triangle inside a frame/);
    await page.setViewportSize({ width: 1280, height: 900 });
    await navigation.getByRole("button", { name: "English" }).click();
    await navigation.getByRole("link", { name: "Home", exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get("ui"), "en");
    await page.locator(".reader-guide").getByText("Explore Unilanguage", { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    const withoutScripts = await browser.newPage({ javaScriptEnabled: false });
    await withoutScripts.goto(base);
    await withoutScripts.locator(".reader-guide").getByText("Explore Unilanguage", { exact: true }).waitFor();
    await withoutScripts.locator(".reader-guide").getByText("探索 Unilanguage", { exact: true }).waitFor();
    assert.equal(await withoutScripts.getByRole("button", { name: "简体中文" }).count(), 0);
    assert.ok(requests.every((request) => request.startsWith(base)));
    console.log("PASS: keyboard language selection, reader interface routes, nested archive, French Mapper lookup and reload, mobile and desktop layouts, bilingual Space Initiative, no-script fallback.");
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
