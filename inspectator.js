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
    var res = `<div class="attr">`;
    res += `<div class="attr-name">${attr.name}</div>`;
    res += `<div class="attr-value">${render_detail_type(attr)}</div>`;
    res += `</div>`;

    return res;
}

function render_detail_type(attr) {
    var res = "";

    var _onchange = `onchange="inspectator_onedit(this)"`;
    var _disabled = attr.readonly ? "disabled" : "";
    var _dataset = `data-obj="${inspectator_focused.id}" data-id="${attr.id}"`;

    if (attr.vtype == "number") {
        res = `<input ${_onchange} ${_disabled} ${_dataset} type="number" value="${attr.value}" />`;
    }
    else if (attr.vtype == "bool") {
        res = `<input ${_onchange} ${_disabled} ${_dataset} type="checkbox" ${attr.value ? "checked" : ""} />`;
    }
    else if (attr.vtype == "string") {
        res = `<input ${_onchange} ${_disabled} ${_dataset} type="text" value="${attr.value}" />`;
    }

    return res;
}

function inspectator_onedit(t) {
    var obj_id = t.dataset.obj;
    var id = t.dataset.id;
    var attr = inspectator_focused.attrs[id];

    var old_val = attr.value;
    var new_val = null;
    switch (attr.vtype) {
        case "number":
            new_val = parseFloat(t.value);
            break;
        case "bool":
            new_val = t.checked;
            break;
        case "string":
            new_val = t.value;
            break;
    }

    // update
    var obj = window.MainEnv.objectMgr.id_object.get(Number(obj_id));
    obj[id] = new_val;

    // call listeners
    if (obj.attrs[id].listener)
        _call_listeners(obj.attrs[id].listener);

    function _call_listeners(listener) {
        if (listener["change"]) {
            listener["change"](obj, old_val, new_val);
        }
    }
}

function inspectator_unfold(t) {
    t.parentElement.classList.toggle("open");
}