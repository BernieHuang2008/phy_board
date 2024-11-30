class PhyBoardBasicObject {
    constructor() {
        this.canvas = null;

        return this.createProxy(this);
    }

    attrs = {
        "id": {
            "id": "id",
            "value": -1,
            "vtype": "number",
            "readonly": true,
            "name": "ID",
            "category": "0基本"
        },
        "name": {
            "id": "name",
            "value": "",
            "vtype": "string",
            "readonly": false,
            "name": "名称",
            "category": "0基本"
        },
        "class": {
            "id": "class",
            "value": "",
            "vtype": "string",
            "readonly": true,
            "name": "类别",
            "category": "0基本"
        },
    };

    createProxy(t) {
        return new Proxy(t, {
            set: function (target, property, value) {
                if (property in target.attrs) {
                    target.attrs[property].value = value;
                    return true;
                }
                else {
                    target[property] = value;
                    return true;
                }
            },
            get: function (target, property) {
                if (property in target.attrs) {
                    return target.attrs[property].value;
                }
                else {
                    return target[property];
                }
            }
        })
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }
};
