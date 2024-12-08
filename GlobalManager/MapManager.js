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

        // (OLD) static map
        // this.map = ndArray(this.w_cell, this.h_cell, () => { return new Set() });

        // Build extendable map
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

    /**
     * Add to the map
     */
    add(obj, x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        if (this.map_revidx.has(obj)) {
            this.map_revidx.get(obj).push([x_cell, y_cell]);
            this.map[x_cell][y_cell].add(obj);
        }
        else {
            this.map_revidx.set(obj, [[x_cell, y_cell]]);
            this.map[x_cell][y_cell].add(obj);
        }

        return true;
    }

    /**
     * Remove an object totally from the map.
     */
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

    /**
     * Removes an object from the map at the specified coordinates.
     */
    remove(obj, x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        // remove from map
        var res = this.map[x_cell][y_cell].delete(obj);
        if (!res)
            return false;

        // remove record
        this.map_revidx.get(obj).delete([x_cell, y_cell]);
        if (this.map_revidx.size == 0) {
            this.mao_revidx.delete(obj);
        }

        return true;
    }

    /**
     * Retrieves objects from the map based on the given x and y coordinates.
     *
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @returns {Array} An array of objects located at the specified point.
     */
    getByPoint(x, y) {
        var [x_cell, y_cell] = this._calc_cell(x, y);

        var res = [];
        for (obj of this.map[x_cell, y_cell]) {
            res.push(obj);
        }
        return res;
    }

    /**
     * Retrieves a list of objects from the map based on the provided list of coordinates.
     *
     * @param {Array} lst - An array of coordinate pairs, where each pair is an array of two numbers [x, y].
     * @returns {Array} A list of objects found at the specified coordinates in the map.
     */
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

    /**
     * Get the most-near object around (x, y) within radius
     * 
     * @param {number} x - the center point x
     * @param {number} y - the center point y
     * @param {number=} [radius] - (optional) the radius of the circle
     * @returns {Array} a PhyBoardBasicObject
    */
    getAround(x, y, radius) {
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