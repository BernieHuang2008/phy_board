canvas_h = window.innerHeight;
canvas_w = window.innerWidth;

function init_canvas(){
    var canvas = document.createElement("canvas");
    $("#board").appendChild(canvas);
    window.main_canvas = canvas;
    canvas.height = canvas_h;
    canvas.width = canvas_w;

    ctx = canvas.getContext('2d');
}

init_canvas();
window.globalMapMgr = new MapManager(canvas_w, canvas_h);