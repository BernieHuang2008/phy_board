const canvas_w = $("#board-container").offsetWidth;
const canvas_h = $("#board-container").offsetHeight;
const MainViewboxOrigin = [-canvas_w / 2, -canvas_h / 2, 1, 1]

// init main environment
window.MainEnv = new Environment();
window.MainEnv.mapMgr.init_map(canvas_w, canvas_h);
window.MainEnv.canvasMgr.init_canvas(canvas_w, canvas_h, MainViewboxOrigin);

// init main canvas
function init_main_canvas(canvasMgr) {
    var canvas = canvasMgr.canvas;
    canvas.id = "main-canvas";
    $("#board-container").appendChild(canvas);
}
init_main_canvas(window.MainEnv.canvasMgr);

// bind
var main_canvas = window.MainEnv.canvasMgr.canvas;
main_canvas.addEventListener("mousedown", function (e) {
    // convert to abs coords
    var x = window.MainEnv.canvasMgr.viewboxCalculator()(2, e.offsetX);
    var y = window.MainEnv.canvasMgr.viewboxCalculator()(3, e.offsetY);

    // console.log(x, y, window.MainEnv.mapMgr.getAround(x, y))
    // TODO
});

// test
a = new PhyBoardPoint(10, 20);
showDetail(a);
window.MainEnv.canvasMgr.redraw();