(function () {
  "use strict";
  const siteIndex = [
    { keys: ["space", "spatial", "空间"], page: "protocol/protocol.space.html" },
    { keys: ["utp", "translation protocol", "翻译协议"], page: "translation-protocol.html" },
    { keys: ["protocol", "semantic protocol", "协议", "语义协议"], page: "protocol.html" },
    { keys: ["dictionary", "language book", "词典", "语言书"], page: "dictionary.html" }
  ];
  let datasetPromise, filterRevision = 0, searchRevision = 0;
  const production = globalThis.UnilanguageCandidates;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const getDataset = () => datasetPromise || (datasetPromise = production.loadSources());
  async function searchWord() {
    const input = document.getElementById("searchInput"), message = document.getElementById("searchMessage"); if (!input) return;
    const normalized = UnilanguageData.normalize(input.value); if (!normalized) { if (message) message.textContent = "Please enter a word. · 请输入一个词。"; return; }
    const query = input.value, revision = ++searchRevision;
    try {
      const sources = await getDataset(); if (revision !== searchRevision) return;
      const result = production.resolve(sources.dataset, sources.corpus, query);
      if (["candidate", "legacy", "ambiguous"].includes(result.kind) || sources.candidateError || sources.legacyError) {
        window.location.href = production.mapperUrl(query, sources.candidateError || sources.legacyError ? {} : result); return;
      }
      const route = siteIndex.find((item) => item.keys.some((key) => UnilanguageData.normalize(key) === normalized));
      window.location.href = route ? route.page : production.mapperUrl(query);
    } catch (error) { if (message) message.textContent = "The schema dataset is unavailable. · Schema 数据暂不可用。"; }
  }
  function renderDictionary(entries, records, query, sources) {
    const grid = document.getElementById("dictionaryGrid"); if (!grid) return;
    grid.innerHTML = production.availability(sources) + records.map(record => production.renderCandidate(record, true)).join("") + entries.map((entry) => { /* ABHOR-READER:START */ if (globalThis.UnilanguageAbhorReader?.isEntry(entry)) return UnilanguageAbhorReader.card(entry); /* ABHOR-READER:END */ /* SECOND-PIPELINE:START */ if (globalThis.UnilanguageSecondPipeline?.isPilot(entry)) return UnilanguageSecondPipeline.card(entry); /* SECOND-PIPELINE:END */ const separateTranslation = entry.slug === "abash" && entry.translation_status; const mapping = entry.primary_mapping, featured = entry.featured_mapping || entry.root_level_mapping?.featured_structural_mapping, isNamedEntity = entry.record_kind === "named_entity"; const standardGloss = ["abbreviate", "abbreviation", "abdominal", "abeyance"].includes(entry.slug) ? entry.standard_translation.target : entry.slug === "abdicate" ? entry.standard_translation.terms[0] : entry.slug === "abdomen" ? "腹部" : mapping.target.word; const heading = globalThis.UnilanguageDiachronic?.isPilot(entry) ? escapeHtml(UnilanguageDiachronic.headline(entry)) : entry.slug === "abandon" ? `${escapeHtml(mapping.source.word)} ↔ ${escapeHtml(featured.target)} <small>${escapeHtml(featured.reading)}</small>` : separateTranslation ? (featured ? `${escapeHtml(featured.source)} ↔ ${escapeHtml(featured.target)} <small>${escapeHtml(featured.reading)}</small> · ${escapeHtml(standardGloss)}` : escapeHtml(mapping.source.word)) : featured ? `${escapeHtml(featured.source)} ↔ ${escapeHtml(featured.target)} <small>${escapeHtml(featured.reading)}</small> · ${escapeHtml(standardGloss)}` : `${escapeHtml(mapping.source.word)} ↔ ${escapeHtml(mapping.target.word)}${entry.slug === "new" ? ` <small>${escapeHtml(mapping.target.pronunciation)}</small> · ${escapeHtml(entry.languages.find(form => form.role === "standard-translation" && form.code === "zh-Hans").word)}` : ""}`; return `<article class="card word-card" data-word="${escapeHtml(entry.search_terms.join(" "))}"><p class="label">${isNamedEntity ? "Named Entity / Literary Entry · 专名／文学词条" : escapeHtml(entry.id)}</p><h2>${heading}</h2>${separateTranslation ? `<p><strong>Standard Translation · ${escapeHtml(entry.translation_status)}：</strong>${escapeHtml(mapping.gloss["zh-Hans"])}</p><p><strong>Active Association${featured ? "：ABASH ↔ BASH" : " → BASH"}</strong> · ${escapeHtml(entry.active_association_status)} · Cognitive / Pedagogical · NOT etymology</p>` : featured ? `<p><strong>Standard translation · 通用翻译：</strong> ${escapeHtml(["abdicate", "abbreviate", "abbreviation", "abdominal", "abeyance"].includes(entry.slug) ? entry.standard_translation.target : entry.slug === "abdomen" ? "腹部；肚子（口语）" : mapping.target.word)}</p>` : ""}<p>${escapeHtml(mapping.meaning.en)}</p><p lang="zh-Hans">${escapeHtml(mapping.meaning["zh-Hans"])}</p><p><span class="status">Entry ${escapeHtml(entry.entry_status)}</span> <span class="status cultural">${isNamedEntity ? "Named Entity · Place" : `Mapping ${separateTranslation && featured ? `${escapeHtml(featured?.source || "bash")} ↔ ${escapeHtml(featured?.target || "拍")} · ` : ""}${escapeHtml(entry.mapping_status)} · Level ${escapeHtml(entry.mapping_level)}`}</span></p><p><strong>Historical relation · 历史关系：</strong> ${escapeHtml(entry.historical_relation_status)}<br><strong>Literary layer · 文学层：</strong> ${escapeHtml(entry.literary_layer.status)}</p>${entry.page ? `<a href="${escapeHtml(entry.page)}">Read entry · 阅读词条 →</a><br>` : ""}<a href="semantic-mapper.html?q=${encodeURIComponent(mapping.source.word)}">Open in Mapper · 在映射器中打开 →</a></article>`; }).map((html, index) => {
      const entry = entries[index], identity = {domain:"legacy", legacyId:entry.id};
      return html.replace(/href="semantic-mapper\.html\?[^"]*"/g, () => `href="${escapeHtml(production.mapperUrl(entry.primary_mapping.source.word,identity))}"`)
        .replace(/(<article[^>]*>)/, opener => opener + production.legacyNotice(entry, query || entry.primary_mapping.source.word));
    }).join("");
  }

  async function filterDictionary() {
    const input = document.getElementById("dictSearch"), message = document.getElementById("dictMessage"); if (!input) return;
    const query = input.value, revision = ++filterRevision;
    try {
      const sources = await getDataset(); if (revision !== filterRevision) return;
      const term = UnilanguageData.normalize(query);
      const entries = (sources.dataset?.entries || []).filter(entry => entry.mapping_status !== "Rejected" && entry.classification_status !== "rejected" && (!term || UnilanguageData.searchableForms(entry).some(form => form.includes(term))));
      const records = production.activeRecords(sources.corpus).filter(record => !term || production.candidateForms(record).some(form => form.includes(term)));
      renderDictionary(entries.map(entry => UnilanguageData.queryView(entry, term)), records, query, sources);
      if (message) message.textContent = `${entries.length} Language Book record(s) · ${sources.corpus ? records.length : "unavailable"} separate production candidate(s) (candidate / not_published)`;
    } catch (error) { document.getElementById("dictionaryGrid").innerHTML = '<article class="card"><h2>Dataset unavailable · 数据暂不可用</h2></article>'; }
  }
  window.searchWord = searchWord; window.filterDictionary = filterDictionary;
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput"); if (searchInput) searchInput.addEventListener("keydown", (event) => { if (event.key === "Enter") searchWord(); });
    const dictInput = document.getElementById("dictSearch"); if (dictInput) { dictInput.addEventListener("input", filterDictionary); dictInput.addEventListener("keydown", (event) => { if (event.key === "Enter") filterDictionary(); }); filterDictionary(); }
  });
})();
