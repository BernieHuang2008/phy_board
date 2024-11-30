var inspectator_focused = null;

function showDetail(obj) {
    inspectator_focused = obj;

    var attrs = obj.attrs;
    var sort_by_cate = {};

    for (var a in attrs) {
        var x = attrs[a];
        var c = x.category;
        sort_by_cate[c] = sort_by_cate[c] || [];
        sort_by_cate[c].push(x);
    }

    $("#inspectator-detail").innerHTML = "";
    $("#inspectator-detail").innerHTML += `<h1>${obj.name}（${obj.class}）</h1>`;
    for (var c in sort_by_cate) {
        $("#inspectator-detail").innerHTML += render_detail_cate(c, sort_by_cate[c]);
    }
}

function render_detail_cate(cate, attrs) {
    var res = `<div class='cate'>`;

    res += `<h3 class="cate-name" onclick="inspectator_unfold(this)">${cate.slice(1)}</h3>`;
    res += `<div class="cate-body">`;
    for (var a of attrs) {
        res += render_detail_attr(a);
    }
    res += "</div>";
    res += "</div>";

    return res;
}

function render_detail_attr(attr) {
    var res = `<div class="attr" data-id="${attr.id}">`;
    res += `<div class="attr-name">${attr.name}</div>`;
    res += `<div class="attr-value">${render_detail_type(attr)}</div>`;
    res += `</div>`;

    return res;
}

function render_detail_type(attr) {
    var res = "";

    var _onchange = `onchange="inspectator_onedit(this)"`;
    var _disabled = attr.readonly ? "disabled" : "";

    if (attr.vtype == "number") {
        res = `<input ${_onchange} ${_disabled} type="number" value="${attr.value}" />`;
    }
    else if (attr.vtype == "bool") {
        res = `<input ${_onchange} ${_disabled} type="checkbox" ${attr.value ? "checked" : ""} />`;
    }
    else if (attr.vtype == "string") {
        res = `<input ${_onchange} ${_disabled} type="text" value="${attr.value}" />`;
    }

    return res;
}

function inspectator_onedit(t) {
    var id = t.parentElement.parentElement.dataset.id;
    var attr = inspectator_focused.attrs[id];

    if (attr.vtype == "number") {
        attr.value = parseFloat(t.value);
    }
    else if (attr.vtype == "bool") {
        attr.value = t.checked;
    }
    else if (attr.vtype == "string") {
        attr.value = t.value;
    }

    // update
    inspectator_focused[id] = attr.value;
}

function inspectator_unfold(t) {
    t.parentElement.classList.toggle("open");
}