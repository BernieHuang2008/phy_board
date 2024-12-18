class PhyBoardWorldFakeobj extends PhyBoardBasicObject {
    constructor(env) {
        super();

        this.env = env;

        /**
         * Attributes of the PhyBoardWorldFakeobj.
         */
        Object.assign(this.attrs, {
            ffields: {
                id: "ffields",
                value: [],
                vtype: "list.ffield",
                readonly: true,
                name: "全局力场",
                category: "1力场设置"
            }
        });

        // init
        this.name = "全局设置";
        this.class = "世界";

        // regist
        this.env.objectMgr.add(this);

        return this;
    }

    draw() {
        // pass
        return this.env.canvasMgr.newContext();
    }
}