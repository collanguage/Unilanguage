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

function bilingual(english, chinese) {
  return '<span data-reader-text><span lang="en">' + escapeHtml(english) +
    '</span><span class="reader-separator"> · </span><span lang="zh-Hans">' +
    escapeHtml(chinese) + '</span></span>';
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

// Add the reader interface to the publication copy without editing frozen research HTML.
export function integrateSiteInterface(name, html) {
  if (!name.endsWith(".html") || name.startsWith("templates/") || html.includes("data-reader-navigation")) return html;
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
  output = output.replace(/<\/head>/i, '<link rel="stylesheet" href="' + base + 'css/reader-interface.css">\n' +
    '<script defer src="' + base + 'js/reader-language.js"></script>\n</head>');

  const heading = readerHeadings[name];
  if (heading) {
    output = output.replace("<h1>" + heading[0] + "</h1>", () => "<h1>" +
      bilingual(heading[0].replace("&amp;", "&"), heading[1]) + "</h1>");
  }
  if (name === "semantic-mapper.html") {
    output = output.replace("Enter a word.</h1>", () => bilingual("Enter a word.", "输入一个词。") + "</h1>")
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
