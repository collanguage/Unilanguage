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
    await page.locator(".reader-original").getByText(/浏览器操作界面为英文/).waitFor();
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
    const english = navigation.getByRole("button", { name: "English" });
    const relation = page.locator("#symbol-relation");
    const mark = page.locator("#symbol-mark");
    const status = page.getByRole("status");
    await page.getByRole("heading", { name: "航天共通语言计划", exact: true }).waitFor();
    await page.getByRole("navigation", { name: "主导航", exact: true }).waitFor();
    const contents = page.getByRole("navigation", { name: "计划页面目录", exact: true });
    await contents.getByRole("link", { name: "共同研究与讨论", exact: true }).waitFor();
    assert.match(await page.title(), /^航天共通语言计划/);
    assert.equal(await page.locator("html").getAttribute("lang"), "zh-Hans");
    const chineseRelation = page.getByRole("combobox", { name: "拟表达的关系", exact: true });
    await chineseRelation.selectOption("inside");
    await page.getByRole("combobox", { name: "标记", exact: true }).selectOption("▲");
    assert.deepEqual(await relation.locator("option").allTextContents(), ["上方", "内部", "旁侧"]);
    assert.deepEqual(await mark.locator("option").allTextContents(), ["圆点", "三角形", "十字形"]);
    assert.match(await status.innerText(), /三角形在方框内部/);
    assert.doesNotMatch(await status.innerText(), /Triangle/);
    const chineseTree = await page.locator("main").ariaSnapshot();
    assert.match(chineseTree, /请选择空间关系和标记/);
    assert.match(chineseTree, /无需注册或提交资料/);
    assert.match(chineseTree, /楔形文字字符表（英文原件）/);
    assert.doesNotMatch(chineseTree, /Community Research|Choose a relation|Keep notes offline|Cuneiform chart/);
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      for (const code of ["en", "zh-Hans"]) {
        const button = code === "en" ? english : chinese;
        await button.focus();
        await page.keyboard.press("Enter");
        assert.equal(await button.getAttribute("aria-pressed"), "true");
        assert.equal(await page.locator("html").getAttribute("lang"), code);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
      }
    }
    await relation.evaluate((select) => {
      select.selectedIndex = -1;
      select.dispatchEvent(new Event("change"));
    });
    assert.match(await status.innerText(), /^无法显示预览/);
    await english.click();
    assert.match(await status.innerText(), /^Preview unavailable/);
    assert.doesNotMatch(await status.innerText(), /无法显示预览/);
    await page.getByRole("navigation", { name: "Initiative sections", exact: true }).waitFor();
    await page.getByRole("combobox", { name: "Proposed relation", exact: true }).selectOption("inside");
    assert.equal(await mark.inputValue(), "▲");
    assert.match(await status.innerText(), /Triangle inside a frame/);
    assert.deepEqual(await relation.locator("option").allTextContents(), ["Above", "Inside", "Beside"]);
    const englishTree = await page.locator("main").ariaSnapshot();
    assert.match(englishTree, /Choose a relation and a marker/);
    assert.match(englishTree, /Keep notes offline/);
    assert.match(englishTree, /Cuneiform chart/);
    assert.doesNotMatch(englishTree, /共同研究与讨论|请选择空间关系和标记|英文原件/);
    await page.reload();
    assert.equal(await english.getAttribute("aria-pressed"), "true");
    await page.getByRole("heading", { name: "Space Language Initiative", exact: true }).waitFor();
    await navigation.getByRole("link", { name: "Home", exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get("ui"), "en");
    await page.locator(".reader-guide").getByText("Explore Unilanguage", { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    const withoutScripts = await browser.newPage({ javaScriptEnabled: false });
    await withoutScripts.goto(base);
    await withoutScripts.locator(".reader-guide").getByText("Explore Unilanguage", { exact: true }).waitFor();
    await withoutScripts.locator(".reader-guide").getByText("探索 Unilanguage", { exact: true }).waitFor();
    assert.equal(await withoutScripts.getByRole("button", { name: "简体中文" }).count(), 0);
    await withoutScripts.goto(base + "/space-language.html?ui=zh-Hans");
    await withoutScripts.getByRole("heading", { name: /Space Language Initiative.*航天共通语言计划/ }).waitFor();
    await withoutScripts.getByText(/如果无法使用控件/).waitFor();
    await withoutScripts.getByText(/If the controls are unavailable/).waitFor();
    assert.equal(await withoutScripts.getByRole("combobox").count(), 0);
    assert.ok(requests.every((request) => request.startsWith(base)));
    console.log("PASS: keyboard language selection, reader interface routes, nested archive, French Mapper lookup and reload, mobile and desktop layouts, fully localized Space Initiative with accessible options and feedback, no-script bilingual fallback.");
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
