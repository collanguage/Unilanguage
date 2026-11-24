import path from "node:path";
import { readerGuides, readerHeadings } from "./reader-guides.mjs";

const destinations = [
  ["index.html", "Home", "首页"],
  ["book.html", "Language Book Explorer", "语言书浏览器"],
  ["semantic-mapper.html", "Semantic Mapper", "语义映射器"],
  ["book.html#learning-title", "Learning", "学习导览"],
  ["space-language.html", "Space Language Initiative", "航天共通语言计划"],
];
const bookScope = [
  "The interface and learning guides follow your language selection. Recorded forms, source titles and research text without a translation remain in their original languages.",
  "操作界面和学习导览随语言切换。已收录词形、来源标题及缺少译文的研究内容保留原文。",
];

function escapeHtml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
  return value.replace(/[&<>"]/g, (character) => entities[character]);
}

function bilingual(english, chinese, renderText = escapeHtml) {
  return '<span data-reader-text><span lang="en">' + renderText(english) +
    '</span><span class="reader-separator"> · </span><span lang="zh-Hans">' +
    renderText(chinese) + '</span></span>';
}

const sharedPaths = new Set(destinations.map(([href]) => href));
const utilityLabels = {
  "dictionary.html": ["Dictionary", "词典"],
  "search.html": ["Search", "检索"],
  "graph.html": ["Knowledge Graph", "知识图谱"],
  "protocol.html": ["Protocol Book", "协议书"],
  "data-foundation.html": ["Data Foundation", "数据基础"],
  "hypothesis-lab.html": ["Hypothesis Lab", "假说实验室"],
  "translation-protocol.html": ["UTP Lab", "翻译协议实验室"],
  "evidence-and-references.html": ["Evidence and references", "证据与参考资料"],
};

function readerHeader(html) {
  return html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/i, header => {
    const localLinks = content => Array.from(content.matchAll(/<a\b([^>]*\bhref="([^"]+)"[^>]*)>([\s\S]*?)<\/a\s*>/gi))
      .filter(([, , href]) => !sharedPaths.has(href))
      .map(([link, attributes, href]) => utilityLabels[href]
        ? "<a" + attributes + ">" + bilingual(...utilityLabels[href]) + "</a>"
        : link).join("\n");
    const utilities = (_, content) => {
      const links = localLinks(content);
      return links ? '<nav class="reader-utilities" aria-labelledby="reader-utilities-label">' +
        '<span id="reader-utilities-label" class="reader-visually-hidden">' +
        bilingual("Related resources", "相关资源") + '</span>' + links + '</nav>' : "";
    };
    return header.replace(/<nav\b[^>]*>([\s\S]*?)<\/nav>/i, utilities)
      .replace(/<div class="lang">([\s\S]*?)<\/div>/i, utilities);
  });
}

function originalMaterial(html) {
  const language = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1].toLowerCase();
  const declared = language?.startsWith("zh") ? ["Chinese", "中文"] :
    language?.startsWith("en") ? ["English", "英语"] : null;
  const scope = declared
    ? [
      "The original page declares " + declared[0] + " as its language and may include passages in other languages. Translations are available where shown.",
      "原页面标注语言为" + declared[1] + "，部分段落可能使用其他语言。译文以页面所示为准。",
    ]
    : [
      "Research and archival material appears in its original languages. Translations are available where shown.",
      "研究与存档资料保留原有语言。译文以页面所示为准。",
    ];
  return '<p class="reader-original"><strong>' + bilingual("Original page material", "页面原有资料") +
    '</strong> ' + bilingual(...scope) + '</p>';
}

// Repair obsolete links in the published copy of archived pages.
function repairArchiveLinks(name, html) {
  if (["english.html", "chinese.html", "french.html"].includes(name)) {
    return html.replace(/href="dictionary\.html#(language|human|universe)"/g, (_, entry) =>
      'href="words/' + (entry === "human" ? "man" : entry) + '.html"');
  }
  if (name === "protocol/protocol.mapping-framework.html") {
    return html.replaceAll("sky.html#sky-discovery", "sky.html#archive-sky-discovery")
      .replaceAll("sky.html#sky-transformation", "sky.html#archive-sky-transformation")
      .replaceAll("universe.html#etymology", "universe.html#historical");
  }
  if (name === "words/language.html") {
    return html.replace('<a href="human.html">Human</a>', '<a href="man.html">Human</a>')
      .replace('<a href="knowledge.html">Knowledge</a>', 'Knowledge')
      .replace('<a href="time.html">Time</a>', 'Time');
  }
  if (name === "words/media.html") {
    return html.replace('<a href="../protocol/protocol.meaning.html">Meaning Protocol</a>', 'Meaning Protocol');
  }
  return html;
}

// Add the reader interface to the publication copy without editing frozen research HTML.
export function integrateSiteInterface(name, html) {
  if (!name.endsWith(".html") || name.startsWith("templates/") || html.includes("data-reader-navigation")) return html;
  html = repairArchiveLinks(name, html);
  const main = html.match(/<main\b[^>]*>/i);
  if (!main || !/<\/head>/i.test(html)) return html;
  const prefix = path.posix.relative(path.posix.dirname(name), ".");
  const base = prefix ? prefix + "/" : "";
  const links = destinations.map(([href, en, zh]) => {
    const current = href === name ? ' aria-current="page"' : "";
    return '<a href="' + base + href + '"' + current + '>' + bilingual(en, zh) + '</a>';
  });
  const navigation = '<nav class="reader-navigation" data-reader-navigation aria-labelledby="reader-navigation-label">' +
    '<span id="reader-navigation-label" class="reader-visually-hidden">' + bilingual("Reader navigation", "读者导航") + '</span>' +
    links.join("\n") + '<span class="reader-language" role="group" aria-labelledby="reader-language-label" hidden>' +
    '<span id="reader-language-label" class="reader-visually-hidden">' + bilingual("Reading language", "阅读语言") + '</span>' +
    '<button type="button" lang="en" data-reader-language="en" aria-pressed="false">English</button>' +
    '<button type="button" lang="zh-Hans" data-reader-language="zh-Hans" aria-pressed="false">简体中文</button>' +
    '</span></nav>';
  const guide = readerGuides[name];
  const overview = guide
    ? '<aside class="reader-guide" aria-labelledby="reader-guide-title"><p id="reader-guide-title"><strong>' +
      bilingual(...guide.heading) + '</strong></p><p>' + bilingual(...guide.text) + '</p></aside>'
    : "";
  const notes = name === "space-language.html" ? "" :
    name === "book.html" ? '<p class="reader-original">' + bilingual(...bookScope) + '</p>' :
    overview + originalMaterial(html);
  let output = html.replace(main[0], () => main[0] + navigation + notes);
  if (guide || name === "book.html" || name === "space-language.html") output = readerHeader(output);
  if (guide) {
    const [en, zh] = name === "index.html" ? ["Semantic Language Protocol", "语义语言协议"] : guide.heading;
    output = output.replace(/<title>([\s\S]*?)<\/title>/i, (_, original) =>
      '<title data-reader-en="' + escapeHtml(en + " | Unilanguage") +
      '" data-reader-zh="' + escapeHtml(zh + " | Unilanguage") + '">' + original + '</title>');
  }
  output = output.replace(/<\/head>/i, '<link rel="stylesheet" href="' + base + 'css/reader-interface.css">\n' +
    '<script defer src="' + base + 'js/reader-language.js"></script>\n</head>');

  const heading = readerHeadings[name];
  if (heading) {
    output = output.replace("<h1>" + heading[0] + "</h1>", () => "<h1>" +
      bilingual(heading[0].replace("&amp;", "&"), heading[1]) + "</h1>");
  }
  if (name === "graph.html") {
    output = output.replace("<p>Knowledge Graph</p>", () => "<p>" + bilingual("Knowledge Graph", "知识图谱") + "</p>");
  }
  if (name === "semantic-mapper.html") {
    output = output.replace("<html ", "<html data-mapper-reader ")
      .replace('href="#mapperResult"', 'href="#mapperForm"')
      .replace('id="mapperForm"', 'id="mapperForm" tabindex="-1"')
      .replace("Skip to results · 跳到结果", () => bilingual("Skip to lookup", "跳到查询"))
      .replace("Language Book Entry Schema v1.0 · Semantic Mapper Data Foundation", () =>
        bilingual("Language Book Entry Schema v1.0 · Semantic Mapper Data Foundation", "语言书词条架构 v1.0 · 语义映射器数据基础"))
      .replace("See what is fact-backed, author-proposed or experimentally tested. · 一眼分辨来源事实、作者假说与实验结果。", () =>
        bilingual("See what is fact-backed, author-proposed or experimentally tested.", "分辨有来源支持的事实、作者提案和已检验的结论。"))
      .replace("One English word → one primary Chinese mapping → separate etymology → separate hypothesis → separate experiment. No layer inherits another layer's evidence status. · 一个英语词 → 一个主要汉语 Mapping → 独立词源 → 独立假说 → 独立实验；各层不共享或冒用证据身份。", () =>
        bilingual("One English word → one primary Chinese mapping → separate etymology → separate hypothesis → separate experiment. No layer inherits another layer's evidence status.",
          "一个英语词对应一个主要中文映射。词源、假说和实验各自记录，各层的证据状态彼此独立。"))
      .replace("Browse by Language｜按语言浏览", () => bilingual("Browse by language", "按语言浏览"))
      .replace("Different language forms may resolve to the same semantic record｜不同语言形式可映射到同一语义记录。<br>English and French: A–Z. Chinese: one concise form per record, in Xinhua-style stroke order｜英法词汇按字母排列；中文每条只显示一个简明解释，并按新华字典式笔画序排列。", () =>
        bilingual("Different forms can identify the same record. English and French use alphabetical order. Chinese displays one form per record, sorted by stroke count.",
          "不同词形可能对应同一条记录。英法词形按字母顺序排列。中文每条显示一个词形，按笔画顺序排列。"))
      .replace("Semantic Mapper v1.0 · Entry, mapping, evidence, hypothesis, experiment and literature remain independent.", () =>
        bilingual("Semantic Mapper v1.0 · Entry, mapping, evidence, hypothesis, experiment and literature remain independent.",
          "语义映射器 v1.0 · 词条、映射、证据、假说、实验和文学内容分别记录。"))
      .replace("Loading versioned dataset · 正在加载版本化数据", () => bilingual("Loading versioned dataset", "正在加载数据集"))
      .replace("Enter a word.</h1>", () => bilingual("Enter a word.", "输入一个词。") + "</h1>")
      .replace("Word, proper name or recorded form · 词、专名或已记录形式", () =>
        bilingual("Word, proper name or recorded form", "词、专名或已记录形式"))
      .replace(">Map · 映射</button>", () => ">" + bilingual("Map", "映射") + "</button>")
      .replace('<section id="mapperState"', () => '<p class="reader-explorer-link"><a href="book.html#explorer">' +
        bilingual("Compare entries and evidence in the Language Book Explorer", "在语言书浏览器中比较词条与证据") +
        '</a></p><section id="mapperState"')
      .replace('<script src="js/semantic-mapper.js?', '<script defer src="js/semantic-mapper.js?');
  }
  return output;
}


// Keep the frozen Mapper source intact and localize the operational messages in the publication copy.
export function integrateMapperMessages(source) {
  const mapperText = value => value.split(/(\$\{[^}]+\})/g).map(part =>
    part.startsWith("${") ? part : escapeHtml(part)).join("");
  const messages = [
    ["No schema or classified word record · 暂无 schema／分类词条", "No schema or classified word record", "未找到已分类的词条"],
    ["No active production candidate or Language Book record for “${escapeHtml(query)}”.",
      "No active production candidate or Language Book record for “${escapeHtml(query)}”.",
      "未找到与「${escapeHtml(query)}」匹配的活跃候选或语言书词条。"],
    ["No result is generated from missing data. Pending research objects outside Active Corpus are not resolved here or promoted. · 缺失数据不生成结论；Active 以外的 Pending 研究对象不在此升级。",
      "No result is generated from missing data. Pending research outside the active corpus remains pending.",
      "缺失数据不会生成结果。活跃语料库之外的待审研究仍保留原状态。"],
    ["Recorded identity unavailable · 指定身份不可用", "Recorded identity unavailable", "指定身份不可用"],
    ["No substitution is made for this domain / ID. · 不替换成其他词条。", "No substitution is made for this domain / ID.", "此类别和编号不会被替换成其他词条。"],
    ["Enter a recorded form. · 请输入已记录形式。", "Enter a recorded form.", "请输入已收录的词形。"],
    ["Dataset unavailable · 数据暂不可用", "Dataset unavailable", "数据暂不可用"],
  ];
  for (const [original, en, zh] of messages) {
    if (!source.includes(original)) throw new Error("Mapper reader message changed: " + original);
    // These strings also occur in single-quoted JavaScript HTML literals.
    source = source.replace(original, () => bilingual(en, zh, mapperText));
  }
  const version = 'Language Book v${dataset?.dataset_version || "unavailable"} · ${published} published entries · ${sources.corpus ? production.activeRecords(sources.corpus).length : "unavailable"} separate production candidates (candidate / not_published)';
  if (!source.includes(version)) throw new Error("Mapper dataset status changed");
  return source.replace("ui.version.textContent", "ui.version.innerHTML").replace(version, () => bilingual(
    'Language Book version: ${escapeHtml(dataset?.dataset_version || "unavailable")} · ${published} published entries · separate production candidates: ${sources.corpus ? production.activeRecords(sources.corpus).length : "unavailable"} (unpublished)',
    '语言书版本：${escapeHtml(dataset?.dataset_version || "不可用")} · 已发表词条 ${published} 条 · 独立生产候选：${sources.corpus ? production.activeRecords(sources.corpus).length : "不可用"}（未发表）',
    mapperText,
  ));
}


// The legacy Search script is archived. Preserve the reader preference on its
// built-in page shortcuts in the publication copy.
export function integrateSearchNavigation(source) {
  const original = "route ? route.page : production.mapperUrl(query)";
  if (!source.includes(original)) throw new Error("Search shortcut changed");
  return source.replace(original,
    "route ? (globalThis.UnilanguageInterface?.url(route.page) ?? route.page) : production.mapperUrl(query)");
}
