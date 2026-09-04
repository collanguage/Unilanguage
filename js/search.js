(function () {
  "use strict";
  const siteIndex = [
    { keys: ["space", "spatial", "空间"], page: "protocol/protocol.space.html" },
    { keys: ["utp", "translation protocol", "翻译协议"], page: "translation-protocol.html" },
    { keys: ["protocol", "semantic protocol", "协议", "语义协议"], page: "protocol.html" },
    { keys: ["dictionary", "language book", "词典", "语言书"], page: "dictionary.html" }
  ];
  let datasetPromise;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const getDataset = () => datasetPromise || (datasetPromise = UnilanguageData.loadDataset());
  async function searchWord() {
    const input = document.getElementById("searchInput"), message = document.getElementById("searchMessage"); if (!input) return;
    const normalized = UnilanguageData.normalize(input.value); if (!normalized) { if (message) message.textContent = "Please enter a word. · 请输入一个词。"; return; }
    try {
      const dataset = await getDataset(), result = UnilanguageData.lookup(dataset, input.value);
      if (result.kind === "exact") { window.location.href = `semantic-mapper.html?q=${encodeURIComponent(input.value)}`; return; }
      const route = siteIndex.find((item) => item.keys.some((key) => UnilanguageData.normalize(key) === normalized));
      window.location.href = route ? route.page : `semantic-mapper.html?q=${encodeURIComponent(input.value)}`;
    } catch (error) { if (message) message.textContent = "The schema dataset is unavailable. · Schema 数据暂不可用。"; }
  }
  function renderDictionary(entries) {
    const grid = document.getElementById("dictionaryGrid"); if (!grid) return;
    grid.innerHTML = entries.map((entry) => { const mapping = entry.primary_mapping, featured = entry.featured_mapping || entry.root_level_mapping?.featured_structural_mapping, isNamedEntity = entry.record_kind === "named_entity"; const heading = featured ? `${escapeHtml(featured.source)} ↔ ${escapeHtml(featured.target)} <small>${escapeHtml(featured.reading)}</small> · ${escapeHtml(mapping.target.word)}` : `${escapeHtml(mapping.source.word)} ↔ ${escapeHtml(mapping.target.word)}`; return `<article class="card word-card" data-word="${escapeHtml(entry.search_terms.join(" "))}"><p class="label">${isNamedEntity ? "Named Entity / Literary Entry · 专名／文学词条" : escapeHtml(entry.id)}</p><h2>${heading}</h2>${featured ? `<p><strong>Standard translation · 通用翻译：</strong> ${escapeHtml(mapping.target.word)}</p>` : ""}<p>${escapeHtml(mapping.meaning.en)}</p><p lang="zh-Hans">${escapeHtml(mapping.meaning["zh-Hans"])}</p><p><span class="status">Entry ${escapeHtml(entry.entry_status)}</span> <span class="status cultural">${isNamedEntity ? "Named Entity · Place" : `Mapping ${escapeHtml(entry.mapping_status)} · Level ${escapeHtml(entry.mapping_level)}`}</span></p><p><strong>Historical relation · 历史关系：</strong> ${escapeHtml(entry.historical_relation_status)}<br><strong>Literary layer · 文学层：</strong> ${escapeHtml(entry.literary_layer.status)}</p>${entry.page ? `<a href="${escapeHtml(entry.page)}">Read entry · 阅读词条 →</a><br>` : ""}<a href="semantic-mapper.html?q=${encodeURIComponent(mapping.source.word)}">Open in Mapper · 在映射器中打开 →</a></article>`; }).join("");
  }
  async function filterDictionary() {
    const input = document.getElementById("dictSearch"), message = document.getElementById("dictMessage"); if (!input) return;
    try {
      const dataset = await getDataset(), term = UnilanguageData.normalize(input.value);
      const entries = dataset.entries.filter((entry) => entry.mapping_status !== "Rejected" && (!term || UnilanguageData.searchableForms(entry).some((form) => form.includes(term))));
      renderDictionary(entries); if (message) message.textContent = entries.length ? `${entries.length} schema record(s) · ${entries.length} 个统一数据词条` : "No entry found. · 未找到词条。";
    } catch (error) { document.getElementById("dictionaryGrid").innerHTML = '<article class="card"><h2>Dataset unavailable · 数据暂不可用</h2></article>'; }
  }
  window.searchWord = searchWord; window.filterDictionary = filterDictionary;
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput"); if (searchInput) searchInput.addEventListener("keydown", (event) => { if (event.key === "Enter") searchWord(); });
    const dictInput = document.getElementById("dictSearch"); if (dictInput) { dictInput.addEventListener("input", filterDictionary); dictInput.addEventListener("keydown", (event) => { if (event.key === "Enter") filterDictionary(); }); filterDictionary(); }
  });
})();
