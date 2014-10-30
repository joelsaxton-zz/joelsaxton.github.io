function x(t){ return  3 * t * Math.cos(t); }
function y(t){ return  3 * t * Math.sin(t); }
var points = [];

for (var t = 0; t < 100; t += 1) {
    var point = [x(t), y(t)];
    points.push(point);
}

window.onload = function() {
    var xMid = window.innerWidth * 0.5;
    var yMid = window.innerHeight * 0.5;
    var galaxy = document.getElementById('galaxy');
    galaxy.style.backgroundSize = xMid*2 + 'px ' + yMid*2 + 'px';
    var style = '';
    for (var point in points){
        var x = points[point][0] + xMid;
        var y = points[point][1] + yMid;
        style += 'radial-gradient(' + 3 + 'px ' + 3 + 'px at ' + x + 'px ' + y + 'px, #FFFFFF, rgba(255,255,255,0)),';

        //for (var i = 0; i < 5; i++){
        //    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        //    var randOffset = plusOrMinus * (Math.floor(Math.random() * 5) + 5);
        //    x += randOffset;
        //    plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        //    randOffset = plusOrMinus * (Math.floor(Math.random() * 5) + 5);
        //    y += randOffset;
        //    style += 'radial-gradient(' + 1 + 'px ' + 1 + 'px at ' + x + 'px ' + y + 'px, #FFFFFF, rgba(255,255,255,0)),';
        //}
    }
    style = style.slice(0, -1);
    galaxy.style.backgroundImage = style;
    galaxy.style.animation = "spin-right 20s linear infinite";
}
