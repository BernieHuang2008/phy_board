class CanvasManager {
    constructor(env) {
        this.env = env;
    }

    init_canvas(w, h, viewbox) {
        this.w = w;
        this.h = h;
        this.viewbox = viewbox;     // [x0, y0, x_scale, y_scale]
        
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
    }

    viewboxCalculator() {
        var t = this;

        return function (name, value) {
            var vb = t.viewbox;

            switch (name) {
                case 0: // x coord
                    return (value - vb[0]) * vb[2];
                case 1: // y coord
                    return (value - vb[1]) * vb[3];
            }
        };
    }

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

    redraw() {
        this.clear();

        this.env.objectMgr.all_do((id, obj) => {
            var ctx = obj.draw(this.env);
            // ctx.fillStyle = "#000";
            ctx.fill();
        })
    }
}