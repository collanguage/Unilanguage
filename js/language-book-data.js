(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.UnilanguageData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DATASET_URL = "data/language-book.v1.0.json";
  const BROWSE_LANGUAGES = [
    { code: "en", label: "English｜英语", sortLabel: "A–Z" },
    { code: "zh-Hans", label: "中文｜Chinese", sortLabel: "新华字典式笔画序" },
    { code: "fr", label: "Français｜法语", sortLabel: "A–Z" },
  ];

  const BROWSE_COLLATION = {
    en: new Intl.Collator("en", { sensitivity: "base", numeric: true }),
    "zh-Hans": new Intl.Collator("zh-Hans-u-co-stroke", { sensitivity: "base", numeric: true }),
    fr: new Intl.Collator("fr", { sensitivity: "base", numeric: true }),
  };

  // Schema v1.0 search_terms are strings without language metadata. Keep the
  // small number of browseable aliases that are not already in languages here
  // in the adapter layer instead of changing the core schema.
  const SEARCH_TERM_LANGUAGE_HINTS = {
    at: { presence: "en" },
    sky: { 盖: "zh-Hans" },
    sound: { 声: "zh-Hans" },
  };

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .trim()
      .toLocaleLowerCase("en")
      .replace(/[‐‑‒–—]/g, "-")
      .replace(/\s+/g, " ");
  }

  function searchableForms(entry) {
    return [
      entry.primary_mapping?.source?.word,
      entry.primary_mapping?.target?.word,
      entry.slug,
      ...(entry.search_terms || []),
      entry.source_word,
      entry.normalized_form,
      ...(entry.aliases || []),
    ]
      .map(normalize)
      .filter(Boolean);
  }

  function splitRecordedForm(value) {
    return String(value ?? "")
      .split(/\s*[\/／]\s*/)
      .map((form) => form.trim())
      .filter(Boolean);
  }

  function languageForms(dataset) {
    const groups = BROWSE_LANGUAGES.map((language) => ({ ...language, forms: [] }));
    const groupMap = new Map(groups.map((group) => [group.code, group]));
    const seen = new Map(groups.map((group) => [group.code, new Set()]));
    const visible = dataset.entries.filter((entry) => entry.mapping_status !== "Rejected" && entry.classification_status !== "rejected");
    const primaryOwners = new Map();
    for (const entry of visible) {
      for (const value of [entry.primary_mapping?.source?.word, entry.primary_mapping?.target?.word, entry.slug]) {
        for (const form of splitRecordedForm(value)) {
          const key = normalize(form);
          if (!primaryOwners.has(key)) primaryOwners.set(key, entry.id);
        }
      }
    }

    function add(entry, code, term, role, source) {
      const group = groupMap.get(code);
      const key = normalize(term);
      if (primaryOwners.has(key) && primaryOwners.get(key) !== entry.id) return;
      if (!group || !key || seen.get(code).has(key)) return;
      seen.get(code).add(key);
      group.forms.push({ term, recordId: entry.id, slug: entry.slug, role, source });
    }

    for (const entry of visible) {
      for (const form of entry.languages || []) {
        const parts = splitRecordedForm(form.word);
        const searchable = new Set(searchableForms(entry));
        const terms = parts.every((term) => searchable.has(normalize(term))) ? parts : [form.word];
        for (const term of terms) add(entry, form.code, term, form.role, "languages");
      }
      const hints = SEARCH_TERM_LANGUAGE_HINTS[entry.slug] || {};
      for (const term of entry.search_terms || []) {
        const code = hints[normalize(term)];
        if (code) add(entry, code, term, "query-alias", "search_terms");
      }
    }

    for (const group of groups) {
      const collator = BROWSE_COLLATION[group.code];
      group.forms.sort((left, right) => collator.compare(left.term, right.term));
    }
    return groups;
  }

  function lookup(dataset, query) {
    const term = normalize(query);
    if (!term) return { kind: "empty", entry: null, suggestions: [] };
    const visible = dataset.entries.filter((entry) => entry.mapping_status !== "Rejected" && entry.classification_status !== "rejected");
    const primary = visible.find((entry) => [entry.primary_mapping?.source?.word, entry.primary_mapping?.target?.word, entry.slug]
      .flatMap(splitRecordedForm).map(normalize).includes(term));
    if (primary) return { kind: "exact", entry: primary, suggestions: [] };
    const exact = visible.find((entry) => searchableForms(entry).includes(term));
    if (exact) return { kind: "exact", entry: exact, suggestions: [] };

    const suggestions = visible
      .filter((entry) => searchableForms(entry).some((form) => form.startsWith(term)))
      .slice(0, 5);
    return { kind: "unknown", entry: null, suggestions };
  }

  function resolveSources(entry, refs) {
    const sourceMap = new Map(entry.references.map((source) => [source.reference_id, source]));
    return refs.map((ref) => sourceMap.get(ref)).filter(Boolean);
  }

  function resolveExperiments(dataset, refs) {
    const experimentMap = new Map(
      dataset.entries.flatMap((entry) => entry.experiments).map((experiment) => [experiment.experiment_id, experiment]),
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
    languageForms,
    lookup,
    resolveSources,
    resolveExperiments,
    loadDataset,
  };
});
