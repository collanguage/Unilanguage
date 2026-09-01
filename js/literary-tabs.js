(() => {
  const tablists = document.querySelectorAll("[data-literary-tabs]");

  tablists.forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs
      .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
      .filter(Boolean);

    const select = (nextTab, focus = false) => {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== nextTab.getAttribute("aria-controls");
      });
      if (focus) nextTab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        select(tabs[nextIndex], true);
      });
    });

    const initial = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    if (initial) select(initial);
  });
})();
