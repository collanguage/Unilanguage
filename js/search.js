/*
 * Unilanguage Semantic Search
 * Version 1.1 · Sky and Space Edition
 * 统一语言语义搜索 · Sky 与 Space 版
 */

const dictionary = [
  {
    keys: ["sky", "skies", "heaven", "天空", "天", "昊", "盖", "ciel", "firmament", "乾", "qian"],
    page: "words/sky.html"
  },
  {
    keys: ["space", "spatial", "spatial semantics", "空间", "空间语义", "盖天", "position", "direction", "boundary"],
    page: "protocol/protocol.space.html"
  },
  {
    keys: ["universe", "cosmos", "宇宙", "世界", "univers", "monde"],
    page: "dictionary.html#universe"
  },
  {
    keys: ["human", "person", "人", "人类", "humain", "homme"],
    page: "dictionary.html#human"
  },
  {
    keys: ["language", "speech", "语言", "言语", "langue", "langage"],
    page: "dictionary.html#language"
  },
  {
    keys: ["knowledge", "know", "知识", "知", "connaissance", "savoir"],
    page: "dictionary.html#knowledge"
  },
  {
    keys: ["time", "时间", "时", "temps", "chrono"],
    page: "dictionary.html#time"
  },
  {
    keys: ["life", "生活", "生命", "vie", "living"],
    page: "dictionary.html#life"
  },
  {
    keys: ["nature", "自然"],
    page: "dictionary.html#nature"
  },
  {
    keys: ["emotion", "feeling", "情感", "感情", "émotion", "sentiment"],
    page: "dictionary.html#emotion"
  }
];

function normalizeSearchValue(value) {
  return value.trim().toLocaleLowerCase();
}

function findDictionaryItem(value) {
  const exactMatch = dictionary.find(item =>
    item.keys.some(key => normalizeSearchValue(key) === value)
  );

  if (exactMatch) {
    return exactMatch;
  }

  return dictionary.find(item =>
    item.keys.some(key => {
      const normalizedKey = normalizeSearchValue(key);
      return normalizedKey.includes(value) || value.includes(normalizedKey);
    })
  );
}

function searchWord() {
  const input = document.getElementById("searchInput");

  if (!input) {
    return;
  }

  const value = normalizeSearchValue(input.value);

  if (!value) {
    alert("Please enter a word. · 请输入一个词。");
    input.focus();
    return;
  }

  const result = findDictionaryItem(value);

  if (result) {
    window.location.href = result.page;
    return;
  }

  alert("Word not found yet. · 暂未收录该词。");
}

function filterDictionary() {
  const input = document.getElementById("dictSearch");

  if (!input) {
    return;
  }

  const value = normalizeSearchValue(input.value);
  const cards = Array.from(document.querySelectorAll(".word-card"));

  cards.forEach(card => {
    const words = normalizeSearchValue(card.getAttribute("data-word") || "");
    card.hidden = Boolean(value) && !words.includes(value);
  });
}

document.addEventListener("keydown", event => {
  if (event.key !== "Enter") {
    return;
  }

  if (document.activeElement?.id === "searchInput") {
    searchWord();
  }

  if (document.activeElement?.id === "dictSearch") {
    filterDictionary();
  }
});

