(function () {
    "use strict";

    const controls = document.querySelector("#symbol-controls");
    const relation = document.querySelector("#symbol-relation");
    const mark = document.querySelector("#symbol-mark");
    const preview = document.querySelector("#symbol-preview");
    const point = document.querySelector("#symbol-point");
    const description = document.querySelector("#symbol-description");
    const relations = {
        above: ["above", "在方框上方"],
        inside: ["inside", "在方框内部"],
        beside: ["beside", "在方框旁侧"],
    };
    const marks = {
        "●": ["Dot", "圆点"],
        "▲": ["Triangle", "三角形"],
        "✚": ["Cross", "十字形"],
    };

    function render() {
        const [enRelation, zhRelation] = relations[relation.value];
        const [enMark, zhMark] = marks[mark.value];
        preview.dataset.relation = relation.value;
        point.textContent = mark.value;
        const chinese = document.createElement("span");
        chinese.lang = "zh-Hans";
        chinese.textContent = "原创候选，尚未测试。" + zhMark + zhRelation + "。";
        description.replaceChildren("Original candidate, untested. " + enMark + " " + enRelation + " a frame. · ", chinese);
    }

    relation.addEventListener("change", render);
    mark.addEventListener("change", render);
    render();
    controls.hidden = false;
})();
