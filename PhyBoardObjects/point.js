class PhyBoardPoint extends PhyBoardBasicObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        window.globalMapMgr.add(this, x, y);
        return this;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(canvas) {
        canvas = canvas || this.canvas;

        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x, this.y, DRAW_POINT_RADIUS , 360, 1);
        ctx.fill();
    }
};