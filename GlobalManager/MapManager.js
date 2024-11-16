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

        this.id_to_func = new Map();
        this.id_to_coord = new Map();
        this.map = ndArray(this.w_cell, this.h_cell, () => { return new Set() });

    }

    genid(func) {
        // gen id
        var id = Math.random();
        while (this.id_to_func.has(id)) {
            id = Math.random();
        }

        // add to record
        this.id_to_func.set(id, func);
        this.id_to_coord.set(id, []);

        return id;
    }

    _calc_cell(x, y) {
        var x_cell = Math.floor(x / BOARDMAP_SECTOR_SIZE);
        var y_cell = Math.floor(y / BOARDMAP_SECTOR_SIZE);

        return [x_cell, y_cell];
    }

    add(id, x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        // record
        this.id_to_coord.get(id).push([x_cell, y_cell]);
        this.map[x_cell][y_cell].add(obj);

        return true;
    }

    remove(id) {
        if (!this.id_to_func.has(id))
            return false;

        // remove from main map
        for (c of this.id_to_coord.get(id)) {
            var [x_cell, y_cell] = c;
            
            this.map[x_cell][y_cell].remove(id);
        }

        // remove from id record
        this.id_to_func.remove(id);
        this.id_to_coord.remove(id);

        return true;
    }

    remove(id, x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        // remove from map
        var res = this.map[x_cell][y_cell].remove(id);
        if (!res)
            return false;

        // remove record
        this.id_to_coord.remove([x_cell, y_cell]);
        if (this.id_to_coord.size == 0) {
            this.remove(id);
        }

        return true;
    }

    get(x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        var res = [];
        for(id of this.map[x_cell, y_cell]) {
            res.push(this.id_to_func.get(id));
        }
        return res;
    }

    gets(lst) {
        var res = new Set();

        for(c of lst) {
            var [x_cell, y_cell] = this._calc_cell(c[0], c[1]);

            res = res.union(this.map[x_cell][y_cell]);
        };

        var res_list = [];
        for (id of res) {
            res_list.push(this.id_to_func(id));
        }

        return res_list;
    }
}