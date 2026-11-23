(function () {
  "use strict";

  const buttons = document.querySelectorAll("[data-reader-language]");
  const picker = document.querySelector(".reader-language");
  const root = document.documentElement;
  const fullPage = root.hasAttribute("data-reader-full-page");
  const translatedText = document.querySelectorAll("[data-reader-en][data-reader-zh]");
  const validLanguages = new Set(["en", "zh-Hans"]);
  const preferenceKey = "unilanguage-reader-language";
  let language;

  function preference() {
    const requested = new URL(location.href).searchParams.get("ui");
    if (validLanguages.has(requested)) return requested;
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (validLanguages.has(saved)) return saved;
    } catch {
      // The URL carries the preference when storage is unavailable.
    }
    return fullPage ? "en" : null;
  }

  function updateLink(anchor) {
    const href = anchor.getAttribute("href");
    if (!language || !href || href.startsWith("#") || anchor.hasAttribute("download")) return;
    let target;
    try {
      target = new URL(href, location.href);
    } catch {
      return;
    }
    if (target.origin !== location.origin || !target.pathname.endsWith(".html")) return;
    target.searchParams.set("ui", language);
    anchor.href = target.href;
  }

  function updateLinks(root) {
    if (root.matches?.("a[href]")) updateLink(root);
    root.querySelectorAll("a[href]").forEach(updateLink);
  }

  function apply() {
    root.dataset.readerLanguage = language || "";
    if (fullPage) root.lang = language;
    for (const element of translatedText) {
      const text = language === "zh-Hans" ? element.dataset.readerZh : element.dataset.readerEn;
      if (element.textContent !== text) element.textContent = text;
      element.lang = language;
    }
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.readerLanguage === language));
    }
    updateLinks(document);
  }

  function select(nextLanguage) {
    language = nextLanguage;
    try {
      localStorage.setItem(preferenceKey, language);
    } catch {
      // Update the URL even when storage is unavailable.
    }
    const url = new URL(location.href);
    url.searchParams.set("ui", language);
    history.replaceState(history.state, "", url);
    apply();
  }

  // Mapper links and lookup history share the current reader preference.
  window.UnilanguageInterface = { get language() { return language; } };
  language = preference();
  for (const button of buttons) {
    button.addEventListener("click", () => select(button.dataset.readerLanguage));
  }
  window.addEventListener("pageshow", () => {
    language = preference();
    apply();
  });
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) updateLinks(node);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
  apply();
  picker.hidden = false;
})();
