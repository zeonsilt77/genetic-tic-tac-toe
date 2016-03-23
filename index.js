var canvas  = document.getElementById("canvas");
var context = canvas.getContext("2d");

var rec_x = [[0, 32], [36, 64]];
var rec_y = [[0, 32], [0,  32]];

function loadButtons() {
    for (var i = 0; i < 8; i++) {
        var button = document.getElementById(i.toString());

        button.onclick = function() {
                   
        };
    }    
}

function getMouse(e, canvas) {
    var element = canvas,
        offsetX = 0,
        offsetY = 0,
        mx, my;

    var rect = canvas.getBoundingClientRect();
    
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    mx = e.pageX - rect.left;
    my = e.pageY - rect.top;

    return {
        x: mx,
        y: my
    };
}

function draw_background(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 100, 100);        
}

function draw_lines(ctx) {
    //Vertical
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(32, 100);
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(64, 100);
    ctx.lineWidth = 4;
    ctx.stroke();
    
    //Horizontal
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(100, 32);
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 64);
    ctx.lineTo(100, 64);
    ctx.lineWidth = 4;
    ctx.stroke();
}

canvas.onclick = function (e) {
    var pt = getMouse(e, canvas);

    console.log(pt.x + " " + pt.y);
};

draw_background(context);
draw_lines(context);
