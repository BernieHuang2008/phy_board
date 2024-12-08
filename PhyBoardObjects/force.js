class PhyBoardForce extends PhyBoardBasicObject {
    constructor(target, size) {
        super();
    
        // init attrs
        /**
         * Attributes of the PhyBoardForce.
         */
        Object.assign(this.attrs, {
            size: {
                id: "force",
                value: [0, 0],
                vtype: "boardobj.PhyBoardForce",
                readonly: false,
                name: "力",
                category: "1力"
            },
            target: {
                id: "target",
                value: null,
                vtype: "boardobj.PhyBoardPoint",
                readonly: false,
                name: "受力物体",
                category: "1力"
            },
            target_point: {
                id: "target_point",
                value: {x: 0, y: 0},
                vtype: "point",
                readonly: true,
                name: "作用点",
                category: "*力"
            }
        });

        // init
        this.name = `力 ${this.id}`;
        this.class = "力";
        this.target = target;
        this.size = size;
        this.target_point = {
            x: target.x,
            y: target.y
        };

        // regist
        window.MainEnv.objectMgr.add(this);
        this.regmap();
    }

    regmap() {
        const sectorSize = BOARDMAP_SECTOR_SIZE;
        const startX = Math.floor(this.target_point.x / sectorSize);
        const startY = Math.floor(this.target_point.y / sectorSize);
        const endX = Math.ceil((this.target_point.x + this.size[0]) / sectorSize);
        const endY = Math.ceil((this.target_point.y + this.size[1]) / sectorSize);

        const dx = endX - startX;
        const dy = endY - startY;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));

        for (let i = 0; i <= steps; i++) {
            const x = Math.floor(startX + (dx * i) / steps);
            const y = Math.floor(startY + (dy * i) / steps);
            window.MainEnv.mapMgr.add(this, x * sectorSize, y * sectorSize);
        }
    }

    draw(env) {
        var vbc = env.canvasMgr.viewboxCalculator();
        var ctx = env.canvasMgr.newContext();
        const startX = this.target_point.x;
        const startY = this.target_point.y;
        const endX = this.target_point.x + this.size[0];
        const endY = this.target_point.y + this.size[1];
        const arrowSize = 10;

        ctx.beginPath();
        
        // point
        ctx.arc(vbc(0, startX), vbc(1, startY), DRAW_POINT_RADIUS, 0, 2 * Math.PI);
        // arror
        ctx.moveTo(vbc(0, startX), vbc(1, startY));
        ctx.lineTo(vbc(0, endX), vbc(1, endY));
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowAngle1 = angle + Math.PI / 6;
        const arrowAngle2 = angle - Math.PI / 6;
        ctx.lineTo(vbc(0, endX) - arrowSize * Math.cos(arrowAngle1), vbc(1, endY) + arrowSize * Math.sin(arrowAngle1));
        ctx.moveTo(vbc(0, endX), vbc(1, endY));
        ctx.lineTo(vbc(0, endX) - arrowSize * Math.cos(arrowAngle2), vbc(1, endY) + arrowSize * Math.sin(arrowAngle2));
        ctx.moveTo(vbc(0, endX), vbc(1, endY));

        ctx.closePath();

        return ctx;
    }

    distance(x, y) {
        // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        const x1 = this.target_point.x;
        const y1 = this.target_point.y;
        const x2 = this.target_point.x + this.size[0];
        const y2 = this.target_point.y + this.size[1];

        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        const param = len_sq !== 0 ? dot / len_sq : -1;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;

        return Math.sqrt(dx * dx + dy * dy);
    }
}