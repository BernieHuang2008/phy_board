var inspectator_focused = null;

function showDetail(obj) {
    if (obj == null) {
        // obj = 
        inspectator_focused = null;
        $("#inspectator-detail").innerHTML = "";
        return;
    }

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
        if (c[0] == "*")
            // hidden field
            continue;

        $("#inspectator-detail").innerHTML += render_detail_cate(c, sort_by_cate[c]);
    }
}

/*
  Render details
*/

function render_detail_cate(cate, attrs) {
    var res = `<div class='cate ${cate[0] == "1" ? "open" : ""}' >`;

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
    var res = `<div class="attr">${render_detail_type(attr)}</div>`;

    return res;
}

function render_detail_type(attr) {
    var types = attr.vtype.split(".");
    var vtype = types.shift();

    var template = inspectator_template[vtype];
    if (template.rdx) {
        // Render-X mode priorier
        return template.rdx(attr, types);
    }
    else {
        var res = `<div class="attr-name">${attr.name}</div>`;
        res += `<div class="attr-value">${template.rd(attr, types)}</div>`;
        return res;
    }
}

/**
 * Handles the onchange event for the inspector.
 *
 * @param {HTMLElement} t - The HTML element that triggered the edit event.
 */
function inspectator_onchange(t) {
    var obj_id = t.dataset.obj;
    var id = t.dataset.id;
    var attr = inspectator_focused.attrs[id];

    var old_val = attr.value;
    var new_val = inspectator_template[attr.vtype.split(".")[0]].onc(old_val, t);

    if (old_val != new_val) {
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
}

function inspectator_unfold(t) {
    t.parentElement.classList.toggle("open");
}