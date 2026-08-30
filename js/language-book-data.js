(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.UnilanguageData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DATASET_URL = "data/language-book.v0.6.json";

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .trim()
      .toLocaleLowerCase("en")
      .replace(/[‐‑‒–—]/g, "-")
      .replace(/\s+/g, " ");
  }

  function searchableForms(entry) {
    return [entry.source_word, entry.normalized_form, ...(entry.aliases || [])]
      .map(normalize)
      .filter(Boolean);
  }

  function lookup(dataset, query) {
    const term = normalize(query);
    if (!term) return { kind: "empty", entry: null, suggestions: [] };
    const visible = dataset.entries.filter((entry) => entry.classification_status !== "rejected");
    const exact = visible.find((entry) => searchableForms(entry).includes(term));
    if (exact) return { kind: "exact", entry: exact, suggestions: [] };

    const suggestions = visible
      .filter((entry) => searchableForms(entry).some((form) => form.startsWith(term)))
      .slice(0, 5);
    return { kind: "unknown", entry: null, suggestions };
  }

  function resolveSources(dataset, refs) {
    const sourceMap = new Map(dataset.sources.map((source) => [source.source_id, source]));
    return refs.map((ref) => sourceMap.get(ref)).filter(Boolean);
  }

  function resolveExperiments(dataset, refs) {
    const experimentMap = new Map(
      dataset.experiments.map((experiment) => [experiment.experiment_id, experiment]),
    );
    return refs.map((ref) => experimentMap.get(ref)).filter(Boolean);
  }

  async function loadDataset(url = DATASET_URL) {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Dataset request failed (${response.status})`);
    return response.json();
  }

  return {
    DATASET_URL,
    normalize,
    searchableForms,
    lookup,
    resolveSources,
    resolveExperiments,
    loadDataset,
  };
});
