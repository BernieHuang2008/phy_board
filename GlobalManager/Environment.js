class Environment {
    constructor() {
        this.objectMgr = new ObjectManager(this);
        this.mapMgr = new MapManager(this);
        this.canvasMgr = new CanvasManager(this);
        this.ioMgr = new IOManager(this);
    }
}