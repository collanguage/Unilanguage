(function () {
  "use strict";
  const siteIndex = [
    { keys: ["space", "spatial", "空间", "above", "cover"], page: "protocol/protocol.space.html" },
    { keys: ["utp", "translation protocol", "翻译实验室", "翻译协议"], page: "translation-protocol.html" },
    { keys: ["protocol", "protocol book", "semantic protocol", "协议", "语义协议"], page: "protocol.html" },
    { keys: ["dictionary", "language book", "词典", "语言书"], page: "dictionary.html" },
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
      if (message) message.textContent = "The reviewed dataset is unavailable. No generated result was substituted. · 已审核数据暂不可用，系统未生成替代结论。";
    }
  }
  function renderDictionary(entries) {
    const grid = document.getElementById("dictionaryGrid");
    if (!grid) return;
    grid.innerHTML = entries.map((entry) => {
      const mappings = entry.candidate_cross_language_mappings;
      const levels = [...new Set(mappings.map((mapping) => mapping.mapping_level))].join(" / ");
      const statuses = [...new Set(mappings.map((mapping) => mapping.experiment_status))].join(" · ");
      const forms = mappings.map((mapping) => mapping.mapping_form).join(" · ");
      return `<article class="card word-card" data-word="${escapeHtml([entry.source_word, ...entry.aliases].join(" "))}">
        <p class="label">${escapeHtml(entry.entry_id)}</p><h2>${escapeHtml(entry.source_word)}</h2>
        <p>${escapeHtml(entry.lexical_meaning.en)}</p><p lang="zh-Hans">${escapeHtml(entry.lexical_meaning["zh-Hans"])}</p>
        <p><strong>Mapping(s) · 映射：</strong> ${escapeHtml(forms)}</p>
        <p><span class="status">Level ${escapeHtml(levels)}</span> <span class="status ${statuses.includes("Inconclusive") ? "cultural" : ""}">${escapeHtml(statuses)}</span></p>
        <a href="semantic-mapper.html?q=${encodeURIComponent(entry.source_word)}">Open in Mapper · 在映射器中打开 →</a></article>`;
    }).join("");
  }
  async function filterDictionary() {
    const input = document.getElementById("dictSearch");
    const message = document.getElementById("dictMessage");
    const grid = document.getElementById("dictionaryGrid");
    if (!input || !grid) return;
    try {
      const dataset = await getDataset();
      const term = UnilanguageData.normalize(input.value);
      const entries = dataset.entries.filter((entry) => entry.entry_review_status === "published" && (!term || UnilanguageData.searchableForms(entry).some((form) => form.includes(term))));
      renderDictionary(entries);
      if (message) message.textContent = entries.length ? `${entries.length} reviewed result(s) · ${entries.length} 个已审核结果` : "No reviewed mapping found. · 未找到已审核映射。";
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

