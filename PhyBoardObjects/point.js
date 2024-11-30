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

        // init
        this.name = "点";
        this.class = "位置点";
        this.x = x;
        this.y = y;
        this.fixed = false;

        // regist
        window.globalMapMgr.add(this, x, y);

        return this.createProxy(this);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(canvas) {
        canvas = canvas || this.canvas;

        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x, this.y, DRAW_POINT_RADIUS, 360, 1);
        ctx.fill();
    }
};