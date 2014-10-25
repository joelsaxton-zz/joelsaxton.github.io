
var secondsPerYear = 1;
var orbitSizes = [6, 9, 13, 18, 26, 36, 52, 74, 100];
var bodySizes = [32, 1, 4, 4, 2, 16, 14, 9, 8, 1];
var periods = [0.24, 0.62, 1, 1.88, 11.86, 29.46, 84.01, 164.8, 248];
var year = 561; // 561 BCE, the year when the planets were 'kinda' lined up
var suffix = "BCE";

// Build solar system, set up vars, set up key event handlers, and other stuff
window.onload = function(){

    buildSolarSystem();

    var yearSpan = document.getElementById('year');
    yearSpan.textContent = year + " " + suffix;
    var yearTimer = setInterval(function() { displayYear(yearSpan); }, secondsPerYear * 1000);

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        console.log(evt);
        if (evt.keyCode == 70) {
            secondsPerYear = (secondsPerYear / 1.2).toFixed(2);
            console.log("you pressed f. Seconds per year now: " + secondsPerYear);
        }

        if (evt.keyCode == 83) {
            secondsPerYear = (secondsPerYear * 1.2).toFixed(2);
            console.log("you pressed s. Seconds per year now: " + secondsPerYear);
        }

        clearInterval(yearTimer);

        var orbits = document.getElementsByClassName('orbit');
        for(var i = 0; i < orbits.length; i++) {
            orbits[i].style.animation = "spin-right " + periods[i] * secondsPerYear + "s linear infinite";
        }
        yearTimer = setInterval(function() { displayYear(yearSpan); }, secondsPerYear * 1000);
    };
}

// Resize solar system
window.onresize = buildSolarSystem;


function buildSolarSystem()
{
    var offset = window.innerHeight / 90;
    var max = window.innerHeight - offset;
    var orbits = document.getElementsByClassName('orbit');
    var bodies = document.getElementsByClassName('bodies');

    for(var i = 0; i < orbits.length; i++) {
        var orbit = (orbitSizes[i] * max) / 100;
        orbits[i].style.width = orbits[i].style.height = orbit + "px";
        orbits[i].style.marginTop = orbits[i].style.marginLeft = -orbit/2 + "px";
        orbits[i].style.animation = "spin-right " + periods[i] * secondsPerYear + "s linear infinite";
    }

    for(var i = 0; i < bodies.length; i++) {
        var size = (bodySizes[i] * max) / 1000;
        bodies[i].style.width = bodies[i].style.height = size + "px";
        bodies[i].style.marginLeft = bodies[i].style.marginTop = -size/2 + "px";
    }
}

function displayYear(yearSpan)
{
    if (suffix == "BCE") {
        year--;
        if (year == 0){
            suffix = "CE";
        }
    }

    if (suffix == "CE") {
        year++;
    }

    yearSpan.textContent = year + " " + suffix;
}



