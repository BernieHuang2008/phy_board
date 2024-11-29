function ndArray(...args) {
    var arg0 = args[0];

    if (args.length == 1) {
        if (arg0 instanceof Number) {
            return Array(arg0);
        }
        else if (arg0 instanceof Function) {
            return arg0();
        }
    }
    else {
        args.shift();
        return Array.from(Array(arg0), () => ndArray(...args));
    }
}

class MapManager {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.w_cell = Math.ceil(w / BOARDMAP_SECTOR_SIZE);
        this.h_cell = Math.ceil(h / BOARDMAP_SECTOR_SIZE);

        this.map_revidx = new Map();    // reverse index
        this.map = ndArray(this.w_cell, this.h_cell, () => { return new Set() });
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

    remove(obj) {
        if (!this.map_revidx.has(obj))
            return false;

        // remove from main map
        for (c of this.map_revidx.get(obj)) {
            var [x_cell, y_cell] = c;

            this.map[x_cell][y_cell].remove(obj);
        }

        // remove from id record
        this.map_revidx.remove(obj);

        return true;
    }

    remove(obj, x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        // remove from map
        var res = this.map[x_cell][y_cell].remove(obj);
        if (!res)
            return false;

        // remove record
        this.map_revidx.remove([x_cell, y_cell]);
        if (this.map_revidx.size == 0) {
            this.remove(obj);
        }

        return true;
    }

    get(x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        var res = [];
        for (obj of this.map[x_cell, y_cell]) {
            res.push(obj);
        }
        return res;
    }

    gets(lst) {
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
}