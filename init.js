const canvas_w = $("#board-container").offsetWidth;
const canvas_h = $("#board-container").offsetHeight;
const MainViewboxOrigin = [-canvas_w / 2, canvas_h / 2, 1, -1]  // -1 for Rect-Coord system

// init main environment
window.MainEnv = new Environment();
window.MainEnv.mapMgr.init_map(canvas_w, canvas_h);
window.MainEnv.canvasMgr.init_canvas(canvas_w, canvas_h, MainViewboxOrigin);

// init main canvas
function init_main_canvas(canvasMgr) {
    var canvas = canvasMgr.canvas;
    canvas.id = "main-canvas";
    $("#board-container").appendChild(canvas);
    window.main_canvas = canvas;
}
init_main_canvas(window.MainEnv.canvasMgr);

// test
a = new PhyBoardPoint(10, 20);
showDetail(a);
window.MainEnv.canvasMgr.redraw();