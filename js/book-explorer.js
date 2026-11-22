(function () {
    "use strict";

    const data = window.UnilanguageData;
    const query = document.querySelector("#book-query");
    const language = document.querySelector("#book-language");
    const left = document.querySelector("#book-left");
    const right = document.querySelector("#book-right");
    const results = document.querySelector("#book-results");
    const comparison = document.querySelector("#book-comparison");
    const status = document.querySelector("#book-status");
    const controls = document.querySelector("#book-controls");
    const matchesPanel = document.querySelector(".book-matches");
    const languages = Array.from(language.options).filter((option) => option.value);

    function element(tag, text, parent) {
        const node = document.createElement(tag);
        node.textContent = text;
        parent.append(node);
        return node;
    }

    function link(text, href, parent) {
        element("a", text, parent).href = href;
    }

    function matches(entry, term, code) {
        const forms = entry.languages.filter((form) => !code || form.code === code);
        if (code && !forms.length) return false;
        const values = forms.flatMap((form) => [form.word, form.pronunciation]);
        if (!code) values.push(...data.searchableForms(entry));
        return values.some((value) => data.normalize(value).includes(term));
    }

    function renderEntry(entry) {
        const card = element("article", "", comparison);
        card.className = "book-item";
        element("h3", entry.title.en || entry.slug, card);
        const forms = element("dl", "", card);
        for (const { value: code, text, lang } of languages) {
            element("dt", text, forms).lang = lang;
            const formsInLanguage = entry.languages.filter((form) => form.code === code);
            const list = element("dd", "", forms);
            if (!formsInLanguage.length) element("span", "No recorded form", list);
            for (const form of formsInLanguage) {
                const line = element("div", "", list);
                element("span", form.word, line).lang = code;
                const reading = form.pronunciation && form.pronunciation !== "unknown" ? " " + form.pronunciation : "";
                line.append(reading + " · " + form.role.replaceAll("-", " "));
            }
        }

        const gloss = entry.primary_mapping.gloss;
        element("p", gloss.en, card).lang = "en";
        if (gloss["zh-Hans"]) element("p", gloss["zh-Hans"], card).lang = "zh-Hans";
        const translation = entry.standard_translation;
        if (translation) {
            element("p", "Standard translation · " + translation.source + " → " + translation.target + " · " + translation.status, card);
        }
        const featured = entry.featured_mapping;
        if (featured) {
            element("p", "Featured mapping · " + featured.source + " → " + featured.target + " · " + featured.status, card);
        } else if (entry.featured_mapping_status) {
            element("p", "Featured mapping · " + entry.featured_mapping_status, card);
        }
        const structure = entry.semantic_structure;
        element("p", "Semantic structure · " + structure.relation + " · " + structure.status, card);
        const grades = element("p", "", card);
        grades.textContent = [
            "Entry · " + entry.entry_status,
            "Mapping · " + entry.mapping_status,
            "Historical relation · " + entry.historical_relation_status,
        ].join(" | ");
        const evidence = element("details", "", card);
        element("summary", "Evidence by category", evidence);
        for (const [category, record] of Object.entries(entry.evidence)) {
            const group = element("section", "", evidence);
            element("h4", category + " · " + record.status + " · " + record.confidence + " confidence", group);
            element("p", record.summary.en, group).lang = "en";
            const sources = data.resolveSources(entry, [...new Set(record.source_refs)]);
            if (sources.length) {
                const list = element("ul", "", group);
                for (const source of sources) {
                    const item = element("li", "", list);
                    if (source.url && /^https?:\/\//i.test(source.url)) link(source.title, source.url, item);
                    else item.textContent = source.title;
                }
            }
        }
        link("Read Language Book entry", entry.page, element("p", "", card));
        link("Open in Semantic Mapper", "semantic-mapper.html?" + new URLSearchParams({ q: entry.primary_mapping.source.word }), element("p", "", card));
    }

    data.loadDataset().then((dataset) => {
        const entries = dataset.entries.filter((entry) =>
            entry.mapping_status !== "Rejected" && entry.classification_status !== "rejected");
        const byId = new Map(entries.map((entry) => [entry.id, entry]));
        const label = (entry) => entry.title.en || entry.slug;

        for (const entry of entries) {
            element("option", label(entry), left).value = entry.id;
            element("option", label(entry), right).value = entry.id;
        }

        function compare() {
            comparison.replaceChildren();
            for (const id of new Set([left.value, right.value])) {
                if (byId.has(id)) renderEntry(byId.get(id));
            }
        }

        function search() {
            const term = data.normalize(query.value);
            const filtered = entries.filter((entry) => matches(entry, term, language.value));
            status.textContent = filtered.length + (filtered.length === 1 ? " record" : " records");
            results.replaceChildren();
            for (const entry of filtered) {
                const item = element("li", "", results);
                const button = element("button", label(entry), item);
                button.type = "button";
                button.addEventListener("click", () => {
                    left.value = entry.id;
                    compare();
                    left.focus();
                });
            }
        }

        left.value = entries.find((entry) => entry.slug === "sky")?.id || "";
        right.value = entries.find((entry) => entry.slug === "sound")?.id || "";
        function showMatches() {
            search();
            matchesPanel.open = true;
        }

        query.addEventListener("input", showMatches);
        language.addEventListener("change", showMatches);
        left.addEventListener("change", compare);
        right.addEventListener("change", compare);
        controls.hidden = false;
        search();
        compare();
    }).catch(() => {
        controls.hidden = true;
        status.textContent = "The Explorer could not load. Try reloading or browse the Dictionary.";
    });
})();
