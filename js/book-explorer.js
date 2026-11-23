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
    const recovery = document.querySelector("#book-recovery");
    const controls = document.querySelector("#book-controls");
    const matchesPanel = document.querySelector(".book-matches");
    const languages = Array.from(language.options).filter(option => option.value);
    let entries;
    let byId;
    let failed = false;

    const categories = {
        Historical: "历史",
        "Phonetic-Semantic": "语音—语义",
        Cognitive: "认知",
        Speculative: "推测",
    };
    const confidence = { High: "高", Medium: "中", Low: "低", Unknown: "未知" };
    const statuses = {
        Published: "已发表", Candidate: "候选", Supported: "有依据支持", Established: "已确立",
        Interpretive: "解释性", Pending: "待定", Reviewed: "已审核", Rejected: "已驳回", Draft: "草稿",
        "Not claimed": "未提出主张", "Not evaluated": "未评估", Unestablished: "尚未确立",
        "Not applicable": "不适用", "Layered: Established + Interpretive": "分层：已确立＋解释性",
        "Candidate · Medium partial sound": "候选 · 部分语音相似性为中等",
        "Candidate / scoped comparison; legacy observations in Research": "候选／限定范围的比较；既有观察见研究资料",
        "Candidate; semantic and phonetic evidence independently graded": "候选；语义证据和语音证据分别评级",
        "Candidate · Phonetic Fit = Low; historical sound not_evaluated": "候选 · 语音契合度低；历史语音未评估",
        "Frozen editorial scope; source-specific evidence retained": "编辑范围已锁定；保留各来源的证据",
        "Frozen sense-specific semantic scope; not historical equivalence": "特定义项的语义范围已锁定；不代表历史等同",
        "Reviewed comparison; Featured Pending": "比较已审核；精选映射待定",
        "Phonetic-Semantic Candidate · Low confidence": "语音—语义候选 · 置信度低",
        "Historical semantic abstraction; independent of consonant-group mapping": "历史语义抽象；独立于辅音组映射",
        "Source-backed history; cross-language candidate remains limited": "历史部分有来源支持；跨语言候选的支持仍有限",
        "Candidate · Low confidence": "候选 · 置信度低",
        "Candidate · Phonetic Fit = Low (modern reference); historical sound not_evaluated": "候选 · 语音契合度低（现代参照）；历史语音未评估",
        "Candidate · semantic support; historical sound Pending": "候选 · 有语义支持；历史语音待定",
        "Candidate; fire imagery separately classified": "候选；火的意象单独归类",
        "Supported (translation only); cultural candidate separately D / Low": "有依据支持（仅指翻译）；文化候选另评为 D／低",
        "Candidate · Low confidence · phonetic fit weak; no evidence promotion": "候选 · 置信度低 · 语音契合度弱；证据等级未提升",
    };
    const roles = {
        source: "源词形", target: "目标词形", featured: "精选", comparison: "比较词形", candidate: "候选",
        "standard-translation": "通用译词", "standard-equivalent": "常用对应词",
        "featured-phonetic-semantic-candidate": "精选语音—语义候选",
        "historically-related-form": "历史相关词形", "standard-semantic-comparison": "通用语义比较",
        "verb-equivalent": "对应动词", "historically-related-verb": "历史相关动词",
        "literary-transformation": "文学转化", "historical-spatial-candidate": "历史空间语义候选",
        "related-word": "相关词", "translation-of-back": "back 的译词", "active-association": "主动联想",
        "abash-phonetic-semantic-candidate": "abash 的语音—语义候选",
        "related-source-with-independent-candidate": "相关源词（候选单独记录）",
        "related-standard-translation": "相关通用译词", "historically-related-title": "历史相关称谓",
        "phonetic-candidate": "语音候选", "literary-candidate": "文学候选", "root-level-candidate": "词根层候选",
        "historical-root": "历史词根", "modern-semantic": "现代语义", "phonetic-semantic-candidate": "语音—语义候选",
        "historically-related-derivative": "历史相关派生词", "historically-related-root-family": "历史相关词根族",
        "historical-form": "历史词形", "modern-semantic-mapping": "现代语义映射",
        "standard-equivalent-phrase": "通用对应短语", "modern-standard-semantic-mapping": "现代通用语义映射",
        "diachronic-comparison": "历时比较", "historically-related-or-compared-form": "历史相关或比较词形",
        "cultural-association": "文化联想", "tibetan-name": "藏文名称", "romanized-name": "罗马字转写名称",
        "chinese-name": "中文名称", "short-chinese-name": "中文简称",
    };

    const locale = () => window.UnilanguageInterface?.language === "zh-Hans" ? "zh-Hans" : "en";
    const t = (en, zh) => locale() === "zh-Hans" ? zh : en;

    function element(tag, text, parent) {
        const node = document.createElement(tag);
        node.textContent = text;
        parent.append(node);
        return node;
    }

    function link(text, href, parent) {
        element("a", text, parent).href = href;
    }

    function nonEmptyText(value) {
        return typeof value === "string" && value.trim() ? value : "";
    }

    function recordedField(value) {
        const text = nonEmptyText(value);
        return /^(?:undefined|null|\[object Object\])$/i.test(text.trim()) ? "" : text;
    }

    function notRecorded() {
        return t("Not recorded", "未记录");
    }

    function statusLabel(value) {
        const status = recordedField(value);
        return status ? t(status, statuses[status] ?? status) : notRecorded();
    }

    function mappingLabel(source, target) {
        return (source || notRecorded()) + " → " + (target || notRecorded());
    }

    function row(card, field, label, values) {
        const paragraph = element("p", [label, ...values].join(" · "), card);
        paragraph.dataset.bookField = field;
    }

    function recordedText(record, fallback = "") {
        const code = locale();
        const value = nonEmptyText(record?.[code]);
        const english = nonEmptyText(record?.en);
        const chinese = nonEmptyText(record?.["zh-Hans"]);
        // Some Chinese slots repeat the English source verbatim.
        const untranslated = code === "zh-Hans" && value === english && !/\p{Script=Han}/u.test(value || "");
        if (value && !untranslated) return { text: value, code };
        return { text: english || chinese || fallback, code: english || !chinese ? "en" : "zh-Hans" };
    }

    function showResearch(record, parent) {
        const { text, code } = recordedText(record);
        if (!text) return;
        const paragraph = element("p", "", parent);
        if (code !== locale()) paragraph.append(t("Chinese original · ", "英文原文 · "));
        element("span", text, paragraph).lang = code;
    }

    function title(entry, node) {
        const label = recordedText(entry.title, entry.slug);
        node.textContent = label.text;
        node.lang = label.code;
    }

    function matches(entry, term, code) {
        const forms = entry.languages.filter(form => !code || form.code === code);
        if (code && !forms.length) return false;
        const values = forms.flatMap(form => [form.word, form.pronunciation]);
        if (!code) values.push(...data.searchableForms(entry));
        return values.some(value => data.normalize(value).includes(term));
    }

    function renderEntry(entry, evidenceOpen) {
        const card = element("article", "", comparison);
        card.className = "book-item";
        card.dataset.entryId = entry.id;
        title(entry, element("h3", "", card));
        const forms = element("dl", "", card);
        for (const { value: code, dataset } of languages) {
            element("dt", t(dataset.readerEn, dataset.readerZh), forms);
            const formsInLanguage = entry.languages.filter(form => form.code === code);
            const list = element("dd", "", forms);
            if (!formsInLanguage.length) element("span", t("No recorded form", "未收录该语言的词形"), list);
            for (const form of formsInLanguage) {
                const line = element("div", "", list);
                const word = nonEmptyText(form.word);
                if (word) element("span", word, line).lang = code;
                else line.append(notRecorded());
                const reading = recordedField(form.pronunciation);
                if (reading && !/^(?:unknown|not recorded)$/i.test(reading)) line.append(" " + reading);
                else if (/^not recorded$/i.test(reading)) line.append(" · " + t("Pronunciation not recorded", "读音未记录"));
                const role = recordedField(form.role);
                if (role) line.append(" · " + t(role.replaceAll("-", " "), roles[role] ?? role.replaceAll("-", " ")));
            }
        }

        const primary = entry.primary_mapping;
        showResearch(primary?.gloss, card);
        const translation = entry.standard_translation;
        const translationStatus = recordedField(translation?.status) || recordedField(entry.translation_status);
        const source = recordedField(translation?.source) || recordedField(primary?.source?.word);
        // Legacy records with a separate translation status use the primary pair in the Mapper.
        // An incomplete explicit translation must not borrow a possibly unrelated mapping target.
        const target = recordedField(translation?.target) ||
            (!translation && translationStatus ? recordedField(primary?.target?.word) : "");
        const translationValues = target || recordedField(translation?.source)
            ? [mappingLabel(source, target), statusLabel(translationStatus)]
            : [notRecorded(), ...(translationStatus ? [statusLabel(translationStatus)] : [])];
        row(card, "translation", t("Standard translation", "通用译义"), translationValues);

        const featured = entry.featured_mapping;
        const featuredSource = recordedField(featured?.source);
        const featuredTarget = recordedField(featured?.target);
        const featuredStatus = recordedField(featured?.status) || recordedField(entry.featured_mapping_status);
        const featuredValues = featuredSource || featuredTarget
            ? [mappingLabel(featuredSource, featuredTarget), statusLabel(featuredStatus)]
            : [statusLabel(featuredStatus)];
        row(card, "featured", t("Featured mapping", "精选映射"), featuredValues);

        const structure = entry.semantic_structure;
        row(card, "structure", t("Semantic structure", "语义结构"), [
            recordedField(structure?.relation) || notRecorded(), statusLabel(structure?.status),
        ]);
        const grades = element("p", [
            t("Entry", "词条") + " · " + statusLabel(entry.entry_status),
            t("Mapping", "映射") + " · " + statusLabel(entry.mapping_status),
            t("Historical relation", "历史关系") + " · " + statusLabel(entry.historical_relation_status),
        ].join(" | "), card);
        grades.dataset.bookField = "statuses";
        const evidence = element("details", "", card);
        evidence.open = evidenceOpen;
        element("summary", t("Evidence by category", "按类别查看证据"), evidence);
        element("p", t(
            "Each category has its own status and confidence. A candidate mapping does not establish a historical relation.",
            "各证据类别分别记录状态和置信度。候选映射不代表历史关系已经确立。",
        ), evidence);
        for (const [category, record] of Object.entries(entry.evidence ?? {})) {
            const group = element("section", "", evidence);
            const recordedGrade = recordedField(record?.confidence);
            const grade = recordedGrade
                ? t(recordedGrade + " confidence", "置信度：" + (confidence[recordedGrade] ?? recordedGrade))
                : t("Confidence: not recorded", "置信度：未记录");
            element("h4", t(category, categories[category] ?? category) + " · " + statusLabel(record?.status) + " · " + grade, group);
            showResearch(record?.summary, group);
            const sources = data.resolveSources(entry, [...new Set(record?.source_refs ?? [])]);
            if (sources.length) {
                element("p", t("Sources · Original titles", "来源 · 标题保留原文"), group);
                const list = element("ul", "", group);
                for (const source of sources) {
                    const item = element("li", "", list);
                    if (source.url && /^https?:\/\//i.test(source.url)) link(source.title, source.url, item);
                    else item.textContent = source.title;
                }
            }
        }
        link(t("Read Language Book entry", "阅读语言书词条"), entry.page, element("p", "", card));
        const mapperSource = recordedField(primary?.source?.word);
        if (mapperSource) {
            const mapper = new URLSearchParams({ q: mapperSource });
            link(t("Open in Semantic Mapper", "在语义映射器中打开"), "semantic-mapper.html?" + mapper, element("p", "", card));
        }
    }

    function compare() {
        const expanded = new Set(Array.from(comparison.querySelectorAll("article"), card =>
            card.querySelector("details").open ? card.dataset.entryId : null));
        comparison.replaceChildren();
        for (const [side, id] of [["left", left.value], ["right", right.value]]) {
            if (side === "right" && id && id === left.value) {
                element("p", t("Both sides use the same record.", "两侧选中了同一词条。"), comparison);
            } else if (byId.has(id)) {
                renderEntry(byId.get(id), expanded.has(id));
            } else {
                element("p", side === "left"
                    ? t("Choose a left record to compare.", "请选择左侧词条。")
                    : t("Choose a right record to compare.", "请选择右侧词条。"), comparison);
            }
        }
    }

    function search() {
        const term = data.normalize(query.value);
        const filtered = entries.filter(entry => matches(entry, term, language.value));
        status.textContent = filtered.length
            ? t(filtered.length + (filtered.length === 1 ? " record" : " records"), filtered.length + " 条匹配词条")
            : t("No matching records. Try another form or language.", "没有匹配词条。请尝试其他词形或语言。");
        results.replaceChildren();
        for (const entry of filtered) {
            const item = element("li", "", results);
            const button = element("button", "", item);
            title(entry, button);
            button.type = "button";
            button.addEventListener("click", () => {
                left.value = entry.id;
                compare();
                left.focus();
            });
        }
    }

    function translate() {
        if (!entries) {
            status.textContent = failed
                ? t("The Explorer could not load. Try reloading or browse the Dictionary.", "无法加载语言书浏览器。请重新加载页面，或浏览词典。")
                : t("Loading the Language Book…", "正在加载语言书…");
            return;
        }
        for (const select of [left, right]) {
            for (const option of select.options) {
                if (byId.has(option.value)) title(byId.get(option.value), option);
            }
        }
        search();
        compare();
    }

    function showMatches() {
        search();
        matchesPanel.open = true;
    }

    document.addEventListener("reader-language-change", translate);
    translate();
    Promise.resolve().then(() => data.loadDataset()).then(dataset => {
        entries = dataset.entries.filter(entry =>
            entry.mapping_status !== "Rejected" && entry.classification_status !== "rejected");
        byId = new Map(entries.map(entry => [entry.id, entry]));
        for (const select of [left, right]) {
            for (const entry of entries) element("option", "", select).value = entry.id;
        }
        left.value = entries.find(entry => entry.slug === "sky")?.id || "";
        right.value = entries.find(entry => entry.slug === "sound")?.id || "";
        query.addEventListener("input", showMatches);
        language.addEventListener("change", showMatches);
        left.addEventListener("change", compare);
        right.addEventListener("change", compare);
        controls.hidden = false;
        translate();
    }).catch(() => {
        entries = undefined;
        failed = true;
        controls.hidden = true;
        recovery.hidden = false;
        translate();
    });
})();
