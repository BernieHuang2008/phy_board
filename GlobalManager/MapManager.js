class MapManager {
    constructor(env) {
        this.env = env;
    }

    init_map(w, h) {
        this.w = w;
        this.h = h;
        this.w_cell = Math.ceil(w / BOARDMAP_SECTOR_SIZE);
        this.h_cell = Math.ceil(h / BOARDMAP_SECTOR_SIZE);

        this.map_revidx = new Map();    // reverse index

        // (old) static map
        // this.map = ndArray(this.w_cell, this.h_cell, () => { return new Set() });

        // build extendable map
        this._map = {};
        var t = this;
        this.map = new Proxy(this._map, {
            // only can set the inner part
            get: function (target, index) {
                if (!(index in t._map)) {
                    t._map[index] = {}
                }
                return new Proxy(t._map[index], {
                    set: function (target, index2, value) {
                        t._map[index][index2] = value;
                    },
                    get: function (target, index2) {
                        if (!(index2 in t._map[index])) {
                            t._map[index][index2] = new Set();
                        }
                        return t._map[index][index2];
                    }
                })
            }
        })
    }

    _calc_cell(x, y) {
        var x_cell = Math.floor(x / BOARDMAP_SECTOR_SIZE);
        var y_cell = Math.floor(y / BOARDMAP_SECTOR_SIZE);

        return [x_cell, y_cell];
    }

    add(obj, x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        if (this.map_revidx.has(obj)) {
            this.map_revidx[obj].push([x_cell, y_cell]);
            this.map[x_cell][y_cell].add(obj);
        }
        else {
            this.map_revidx.set(obj, [[x_cell, y_cell]]);
            this.map[x_cell][y_cell].add(obj);
        }

        return true;
    }

    remove_all(obj) {
        if (!this.map_revidx.has(obj))
            return false;

        // remove from main map
        for (var c of this.map_revidx.get(obj)) {
            var [x_cell, y_cell] = c;

            this.map[x_cell][y_cell].delete(obj);
        }

        // remove from id record
        this.map_revidx.delete(obj);

        return true;
    }

    remove(obj, x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        // remove from map
        var res = this.map[x_cell][y_cell].delete(obj);
        if (!res)
            return false;

        // remove record
        this.map_revidx[obj].delete([x_cell, y_cell]);
        if (this.map_revidx.size == 0) {
            this.mao_revidx.delete(obj);
        }

        return true;
    }

    getByPoint(x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        var res = [];
        for (obj of this.map[x_cell, y_cell]) {
            res.push(obj);
        }
        return res;
    }

    getByList(lst) {
        var res = new Set();

        for (c of lst) {
            var [x_cell, y_cell] = this._calc_cell(c[0], c[1]);

            res = res.union(this.map[x_cell][y_cell]);
        };

        var res_list = [];
        for (obj of res) {
            res_list.push(obj);
        }

        return res_list;
    }

    getAround(x, y, radius) {  // radius is optional
        radius = radius || BOARDMAP_SECTOR_SIZE;
        var radius_block = Math.ceil(radius / BOARDMAP_SECTOR_SIZE);
        var [x_cell, y_cell] = this._calc_cell(x, y);

        var res = new Set();
        for (var i = -radius_block; i <= radius_block; i++) {
            for (var j = -radius_block; j <= radius_block; j++) {
                res = res.union(this.map[x_cell + i][y_cell + j]);
            }
        }

        var res_list = [];
        for (var obj of res) {
            res_list.push(obj);
        }

        return res_list;
    }
}