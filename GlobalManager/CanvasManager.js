class CanvasManager {
    constructor(env) {
        this.env = env;
    }

    init_canvas(w, h, viewbox) {
        this.w = w;
        this.h = h;
        this.viewbox = viewbox;     // [x0 (left-down), y0, x_scale (vb_width/origin_vb_w), y_scale]

        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;

        this._gray_out_except_set = new Set();
    }

    /**
     * Creates a function to calculate viewbox coordinates.
     *
     * @returns {Function} A function that takes a mode and a value to convert coordinates.
     * 
     * The returned function has the following `modes`:
     * - 0: absolute X -> relative X
     * - 1: absolute Y -> relative Y
     * - 2: relative X -> absolute X
     * - 3: relative Y -> absolute Y
     *
     * @param {number} mode - The mode of conversion (0, 1, 2, or 3).
     * @param {number} value - The coordinate value to be converted.
     * @returns {number} The converted coordinate value.
     */
    viewboxCalculator() {
        var t = this;

        return function (mode, value) {
            var vb = t.viewbox;

            /*
              vbc MODE
                0  : absolute X -> relative X
                1  : absolute Y -> relative Y
                2  : relative X -> absolute X
                3  : relative Y -> absolute Y
            */
            switch (mode) {
                case 0:
                    return (value - vb[0]) / vb[2];
                case 1:
                    return t.h - (value - vb[1]) / vb[3];    // relative Y is reverse of Rect-Coord system
                case 2:
                    return value * vb[2] + vb[0];
                case 3:
                    return (t.h - value) * vb[3] + vb[1];
            }
        };
    }

    /**
     * Creates a new 2D context for the canvas.
     */
    newContext() {
        return this.canvas.getContext('2d');
    }

    move(dx, dy) {
        this.viewbox[0] += dx;
        this.viewbox[1] += dy;
    }

    // scale(origin, xk, yk) {
    //     this.viewbox.
    // }

    clear() {
        var ctx = this.newContext();
        ctx.clearRect(0, 0, this.w, this.h);
    }

    /**
     * Redraws the canvas without clearing it.
     */
    redraw_without_clear() {
        this.env.objectMgr.all_do((id, obj) => {
            var ctx = obj.draw(this.env);
            ctx.lineWidth = DRAW_LINEWIDTH;
            ctx.strokeStyle = "#000";
            if (this._gray_out_except_set.has(obj))
                ctx.globalAlpha = 0.2;
            ctx.stroke();
        })
    }

    /**
     * Redraws the canvas.
     */
    redraw() {
        this.clear();
        this.redraw_without_clear();
    }

    gray_out_except(objs) {
        this._gray_out_except_set = objs || new Set();
    }
}