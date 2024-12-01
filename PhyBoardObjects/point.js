class PhyBoardPoint extends PhyBoardBasicObject {
    constructor(x, y) {
        super();

        // init attrs
        /**
         * Attributes of the PhyBoardPoint.
         */
        this.attrs = {
            x: {
                id: "x",
                value: x,
                vtype: "number",
                readonly: false,
                name: "X 坐标",
                category: "1位置",
                listener: {
                    change: function (obj, old_val, new_val) {
                        window.MainEnv.mapMgr.remove_all(obj);
                        window.MainEnv.mapMgr.add(obj, new_val, obj.y);
                        window.MainEnv.canvasMgr.redraw();
                    }
                }
            },
            y: {
                id: "y",
                value: y,
                vtype: "number",
                readonly: false,
                name: "Y 坐标",
                category: "1位置",
                listener: {
                    change: function (obj, old_val, new_val) {
                        window.MainEnv.mapMgr.remove_all(obj);
                        window.MainEnv.mapMgr.add(obj, obj.x, new_val);
                        window.MainEnv.canvasMgr.redraw();
                    }
                }
            },
            fixed: {
                id: "fixed",
                value: false,
                vtype: "bool",
                readonly: true,
                name: "固定",
                category: "1位置"
            }
        };

        // regist
        window.MainEnv.objectMgr.add(this);
        window.MainEnv.mapMgr.add(this, x, y);

        // init
        this.name = `点 ${this.id}`;
        this.class = "位置点";
        this.x = x;
        this.y = y;
        this.fixed = false;

        return this;
    }

    /**
     * Draws a point on the canvas.
     *
     * @param {Environment} env - The environment object containing canvas manager.
     * @param {CanvasManager} env.canvasMgr - The canvas manager object.
     * @returns {CanvasRenderingContext2D} The canvas context with the drawn point.
     */
    draw(env) {
        var vbc = env.canvasMgr.viewboxCalculator();
        var ctx = env.canvasMgr.newContext();
        ctx.beginPath();
        ctx.arc(vbc(0, this.x), vbc(1, this.y), DRAW_POINT_RADIUS, 0, 2 * Math.PI);
        return ctx;
    }

    distance(x, y) {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
    }
};