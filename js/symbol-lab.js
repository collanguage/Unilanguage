(function () {
    "use strict";

    const controls = document.querySelector("#symbol-controls");
    const relation = document.querySelector("#symbol-relation");
    const mark = document.querySelector("#symbol-mark");
    const preview = document.querySelector("#symbol-preview");
    const point = document.querySelector("#symbol-point");
    const english = document.querySelector('#symbol-description [lang="en"]');
    const chinese = document.querySelector('#symbol-description [lang="zh-Hans"]');
    const unavailable = document.querySelector("#symbol-unavailable");
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
        const selectedRelation = relations[relation.value];
        const selectedMark = marks[mark.value];
        if (!selectedRelation || !selectedMark) {
            preview.hidden = true;
            english.textContent = "Preview unavailable. Choose one relation and one marker.";
            chinese.textContent = "无法显示预览。请选择一种空间关系和一种标记。";
            return;
        }
        const [enRelation, zhRelation] = selectedRelation;
        const [enMark, zhMark] = selectedMark;
        preview.hidden = false;
        preview.dataset.relation = relation.value;
        point.textContent = mark.value;
        english.textContent = "Original candidate, untested. " + enMark + " " + enRelation + " a frame.";
        chinese.textContent = "原创候选符号，尚未经检验。" + zhMark + zhRelation + "。";
    }

    relation.addEventListener("change", render);
    mark.addEventListener("change", render);
    render();
    unavailable.hidden = true;
    controls.hidden = false;
})();
