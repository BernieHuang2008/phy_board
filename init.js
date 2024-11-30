const canvas_h = $("#board-container").offsetHeight;
const canvas_w = $("#board-container").offsetWidth;

function init_canvas() {
    var canvas = document.createElement("canvas");
    canvas.id = "main-canvas";
    $("#board-container").appendChild(canvas);
    window.main_canvas = canvas;
    canvas.height = canvas_h;
    canvas.width = canvas_w;

    ctx = canvas.getContext('2d');
}

init_canvas();

window.globalMapMgr = new MapManager(canvas_w, canvas_h);

// test
a=new PhyBoardPoint(10, 20);showDetail(a)