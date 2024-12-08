function _stdtemplate(attr) {
    var _onchange = `onchange="inspectator_onchange(this)"`;
    var _disabled = attr.readonly ? "disabled" : "";
    var _dataset = `data-obj="${inspectator_focused.id}" data-id="${attr.id}"`;
    return `${_onchange} ${_disabled} ${_dataset}`;
}

inspectator_template = {
    "string": {
        "rd": function (attr, paras) {
            /**
             * This function is called to render an attribute of type "string".
             * @param {*} attr
             * @param {*} paras - paras that are attatched to `vtype` by "." e.g. "string.param1.param2"
             * @returns - A string-like HTML code.
             */
            return `<input ${_stdtemplate(attr)}  type="text" value="${attr.value}" />`;
        },
        "onc": function (old, t) {
            /**
             * On call when the input box has changed. 
             * Triggled by `inspectator_onchange`.
             */
            return t.value;
        }
    },
    "number": {
        "rd": function (attr, paras) {
            return `<input ${_stdtemplate(attr)} type="number" value="${attr.value}" />`;
        },
        "onc": (old, t) => Number(t.value)
    },
    "bool": {
        "rd": function (attr, paras) {
            return `<input ${_stdtemplate(attr)} type="checkbox" ${attr.value ? "checked" : ""} />`;
        },
        "onc": (old, t) => t.checked
    },
    "list": {
        "rdx": function (attr, paras) {
            /**
             * Render-X mode
             * More customized rendering that can fully override the whole 'attr' dom.
             */
            var subtype = paras.shift(0);
            function _rd_list_item(x) {
                var fake_attr = {
                    id: attr.id,
                    value: x,
                    vtype: subtype,
                    readonly: attr.readonly,
                }
                var template = inspectator_template[subtype];
                return (template.rd || template.rdx)(fake_attr, paras); // use rd mode as ideal way to render list items
            }

            // Start Render
            var html = `<table><thead><th colspan="2">${attr.name}</th></thead><tbody>`;
            for (var i = 0; i < attr.value.length; i++) {
                html += `<tr><td>${i + 1}</td><td data-i="${i}">${_rd_list_item(attr.value[i])}</td></tr>`;
            }
            html += `<tr><td colspan="2"><button class="full" onclick="inspectator_list_add(this)">+</button></td></tr>`;
            html += `</tbody></table>`;
            return html;
        },
        "onc": function (old, t) {
            var i = t.parentElement.dataset.i;
            var id = t.dataset.id;
            var obj_id = t.dataset.obj;
            var obj = window.MainEnv.objectMgr.id_object.get(Number(obj_id));
            var subtype = obj.attrs[id].vtype.split(".")[1];
            
            var new_val = inspectator_template[subtype].onc(old[i], t);
            new_val = old.slice(0, i).concat([new_val]).concat(old.slice(i + 1));
            obj[id] = new_val;

            // handle listeners itself
            if (obj.attrs[id].listener)
                _call_listeners(obj.attrs[id].listener);
    
            function _call_listeners(listener) {
                if (listener["change"]) {
                    listener["change"](obj, old, new_val);
                }
            }

            return old; // prevent triggling overwriting
        }
    },
    "boardobj": {
        "rd": function (attr, paras) {
            var subtype = paras[0];
            var subtypes = subtype.split("/");
            var objs = window.MainEnv.objectMgr.get_all_obj_of_types(subtypes);

            // Start Render
            var datalist_id = `datalist-${attr.id}-${Math.random()}`;
            var html = `<div>`;

            // setting up <input>
            html += `<input list='${datalist_id}' type='text' placeholder='◈ | ${subtype}' data-allow-types='${subtype}'/>`;

            // setting up <datalist> for auto-completion
            html += `<datalist id='${datalist_id}'>`
            for (var obj of objs) {
                html += `<option value='${obj.name} [#${obj.id}]'></option>`;
            }
            html += `</datalist>`;

            html += `</div>`;
            return html;
        },
        "onf": function (t, e) {    // onfocus
            var subtypes = t.dataset.allowTypes.split("/");
            var objs = window.MainEnv.objectMgr.get_all_obj_of_types(subtypes);
            
            window.MainEnv.canvasMgr.gray_out_except(objs);
            window.MainEnv.canvasMgr.redraw();

            return t;
        },
        "onb": function (t, e) {    // onblur
            window.MainEnv.canvasMgr.gray_out_except(null);
            window.MainEnv.canvasMgr.redraw();
        },
        "onc": function (old, t) {
            return old;
        }
    },
}