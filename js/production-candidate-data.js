(function(root, factory) {
 const api = factory(typeof module === "object" && module.exports ? require("./language-book-data.js") : root.UnilanguageData);
 if (typeof module === "object" && module.exports) module.exports = api;
 root.UnilanguageCandidates = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function(legacy) {
 "use strict";
 const normalize = legacy.normalize;
  // Production candidates are an explicit, separate corpus, never legacy entries.
  async function loadCandidateCorpus(url = "data/candidates/production-corpus.v0.1.json") {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Candidate corpus request failed (${response.status})`);
    const corpus = await response.json();
    if (corpus.batch_id !== "PRODUCTION-CANDIDATE-001" || !Array.isArray(corpus.records))
      throw new Error("Not an active production candidate corpus");
    return corpus;
  }

  function lookupCandidates(corpus, query) {
    const term = normalize(query);
    if (!term) return { kind: "empty", entry: null, candidates: [] };
    if (corpus?.batch_id !== "PRODUCTION-CANDIDATE-001" || !Array.isArray(corpus.records))
      return { kind: "unknown", entry: null, candidates: [] };
    const candidates = corpus.records.filter((r) => r.review_status === "candidate" &&
      r.publication_status === "not_published" &&
      [r.source_word, r.normalized_form, ...(r.baseline_record?.candidates || []).filter(c => ["Retained", "retained"].includes(c.disposition)).map(c => c.form)]
        .some(form => normalize(form) === term));
    return { kind: candidates.length ? "candidate" : "unknown", entry: null, candidates };
  }

  return { loadCandidateCorpus, lookupCandidates };
});
