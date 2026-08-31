(function () {
  "use strict";
  const siteIndex = [
    { keys: ["space", "spatial", "空间", "above", "cover"], page: "protocol/protocol.space.html" },
    { keys: ["utp", "translation protocol", "翻译实验室", "翻译协议"], page: "translation-protocol.html" },
    { keys: ["protocol", "protocol book", "semantic protocol", "协议", "语义协议"], page: "protocol.html" },
    { keys: ["dictionary", "language book", "词典", "语言书"], page: "dictionary.html" },
    { keys: ["如光天籁", "ru guang tian lai"], page: "words/light.html#literary" },
    { keys: ["at", "在", "爱", "愛", "love", "presence", "love is presence", "爱在", "愛在", "第一次遇见你的时候", "一个美丽的向往，在那太空", "a beautiful yearning in space"], page: "words/at.html" },
    { keys: ["experiment 001a", "001a", "实验001a"], page: "experiments/001a/ai-annotation-record.html" },
    { keys: ["experiment 002", "002", "实验002"], page: "experiments/002/results.html" },
  ];
  let datasetPromise;
  function escapeHtml(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
  function getDataset() { if (!datasetPromise) datasetPromise = UnilanguageData.loadDataset(); return datasetPromise; }
  async function searchWord() {
    const input = document.getElementById("searchInput");
    const message = document.getElementById("searchMessage");
    if (!input) return;
    const value = input.value;
    const normalized = UnilanguageData.normalize(value);
    if (!normalized) { if (message) message.textContent = "Please enter a word. · 请输入一个词。"; return; }
    try {
      const dataset = await getDataset();
      const result = UnilanguageData.lookup(dataset, value);
      if (result.kind === "exact") { window.location.href = `semantic-mapper.html?q=${encodeURIComponent(value)}`; return; }
      const route = siteIndex.find((item) => item.keys.some((key) => UnilanguageData.normalize(key) === normalized));
      if (route) { window.location.href = route.page; return; }
      window.location.href = `semantic-mapper.html?q=${encodeURIComponent(value)}`;
    } catch (error) {
      if (message) message.textContent = "The classified dataset is unavailable. No generated result was substituted. · 分类数据暂不可用，系统未生成替代结论。";
    }
  }
  function renderDictionary(entries, includeAtEntry) {
    const grid = document.getElementById("dictionaryGrid");
    if (!grid) return;
    const classifiedCards = entries.map((entry) => {
      const primary = entry.primary_chinese_mapping;
      const secondary = entry.secondary_chinese_mappings;
      const forms = [primary, ...secondary].map((mapping) => `${mapping.chinese_form}${mapping.pinyin ? ` ${mapping.pinyin}` : ""}`).join(" · ");
      const isLight = UnilanguageData.normalize(entry.source_word) === "light";
      const literaryForms = isLight ? " 光 光明 籁 籟 lai lài lumière 如光天籁" : "";
      const publicEntryLink = isLight ? '<a href="words/light.html">Read the Published Light Entry / 《如光天籁》 · 阅读公开词条 →</a><br>' : "";
      return `<article class="card word-card" data-word="${escapeHtml([entry.source_word, ...entry.aliases].join(" ") + literaryForms)}">
        <p class="label">${escapeHtml(entry.entry_id)}</p><h2>${escapeHtml(entry.source_word)}</h2>
        <p>${escapeHtml(entry.lexical_meaning.en)}</p><p lang="zh-Hans">${escapeHtml(entry.lexical_meaning["zh-Hans"])}</p>
        <p><strong>Primary / secondary · 主要／次要映射：</strong> ${escapeHtml(forms)}</p>
        <p><span class="status">${escapeHtml(entry.classification_status)}</span> <span class="status cultural">${entry.sound_symbol_hypothesis_refs.length} hypothesis · ${entry.experimental_validation_refs.length} experiment</span></p>
        ${publicEntryLink}<a href="semantic-mapper.html?q=${encodeURIComponent(entry.source_word)}">Open in Mapper · 在映射器中打开 →</a></article>`;
    }).join("");
    const atCard = includeAtEntry ? `<article class="card word-card" data-word="at 在 爱 愛 love presence 爱在 世界 第一次遇见你的时候 一个美丽的向往 在那太空">
        <p class="label">Public Entry 003 · 文学词条</p><h2>AT · 在 · 爱</h2>
        <p>Location becomes presence; presence becomes relation and world. · 位置成为在；在成为关系与世界。</p>
        <p><strong>Candidate observation · 候选观察：</strong> at /æt/ ↔ 在 zài /tsaɪ̯/</p>
        <p><span class="status supported">Entry Published · 词条已发表</span> <span class="status cultural">Mapping Candidate · 历史关系未确立</span></p>
        <a href="words/at.html">Read AT · 在 · 爱 / Love Is Presence · 阅读词条 →</a></article>` : "";
    grid.innerHTML = atCard + classifiedCards;
  }
  async function filterDictionary() {
    const input = document.getElementById("dictSearch");
    const message = document.getElementById("dictMessage");
    const grid = document.getElementById("dictionaryGrid");
    if (!input || !grid) return;
    try {
      const dataset = await getDataset();
      const term = UnilanguageData.normalize(input.value);
      const atForms = ["at", "在", "爱", "愛", "love", "presence", "爱在", "愛在", "world", "世界", "第一次遇见你的时候", "一个美丽的向往，在那太空", "a beautiful yearning in space"];
      const includeAtEntry = !term || atForms.some((form) => UnilanguageData.normalize(form).includes(term));
      const entries = dataset.entries.filter((entry) => {
        if (entry.classification_status === "rejected") return false;
        const extraForms = UnilanguageData.normalize(entry.source_word) === "light" ? ["光", "光明", "籁", "籟", "lai", "lài", "lumière", "如光天籁"] : [];
        return !term || [...UnilanguageData.searchableForms(entry), ...extraForms].some((form) => UnilanguageData.normalize(form).includes(term));
      });
      renderDictionary(entries, includeAtEntry);
      const total = entries.length + (includeAtEntry ? 1 : 0);
      if (message) message.textContent = total ? `${entries.length} classified record(s), ${includeAtEntry ? 1 : 0} public literary entry · ${entries.length} 个分类记录，${includeAtEntry ? 1 : 0} 个公开文学词条` : "No entry found. · 未找到词条。";
    } catch (error) {
      grid.innerHTML = '<article class="card"><h2>Dataset unavailable · 数据暂不可用</h2><p>No generated fallback is used. · 不使用生成式替代内容。</p></article>';
    }
  }
  window.searchWord = searchWord;
  window.filterDictionary = filterDictionary;
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("keydown", (event) => { if (event.key === "Enter") searchWord(); });
    const dictInput = document.getElementById("dictSearch");
    if (dictInput) { dictInput.addEventListener("input", filterDictionary); dictInput.addEventListener("keydown", (event) => { if (event.key === "Enter") filterDictionary(); }); filterDictionary(); }
  });
})();
