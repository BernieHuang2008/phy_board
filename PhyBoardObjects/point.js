class PhyBoardPoint extends PhyBoardBasicObject {
    constructor(x, y) {
        super();

        // init attrs
        Object.assign(this.attrs, {
            "x": {
                "id": "x",
                "value": 0,
                "vtype": "number",
                "readonly": false,
                "name": "X 坐标",
                "category": "1位置"
            },
            "y": {
                "id": "y",
                "value": 0,
                "vtype": "number",
                "readonly": false,
                "name": "Y 坐标",
                "category": "1位置"
            },
            "fixed": {
                "id": "fixed",
                "value": false,
                "vtype": "bool",
                "readonly": true,
                "name": "固定",
                "category": "1位置"
            }
        })

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

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(env) {
        var vbc = env.canvasMgr.viewboxCalculator();
        var ctx = env.canvasMgr.newContext();
        ctx.beginPath();
        ctx.arc(vbc(0, this.x), vbc(1, this.y), DRAW_POINT_RADIUS, 360, 1);
        return ctx;
    }
};