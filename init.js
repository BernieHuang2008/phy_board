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

    // choose the nearest
    var around = window.MainEnv.mapMgr.getAround(x, y);
    var nearest = null;
    var min_dist = SELECT_RADIUS;
    for (var obj of around) {
        var dist = obj.distance(x, y);
        if (dist < min_dist) {
            min_dist = dist;
            nearest = obj;
        }
    }
    if (nearest) {
        if (window.MainEnv.ioMgr.vkb.keyMap["Control"]) {
            window.MainEnv.objectMgr.select_add(nearest);
        }
        else {
            window.MainEnv.objectMgr.select(nearest);
        }
    }
    else {
        if (!window.MainEnv.ioMgr.vkb.keyMap["Control"]) {
            window.MainEnv.objectMgr.select(null);
        }
    }
});

// test
a = new PhyBoardPoint(10, 20);
b = new PhyBoardPoint(10, 20);
window.MainEnv.canvasMgr.redraw();