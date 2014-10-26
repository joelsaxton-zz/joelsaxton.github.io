
var secondsPerYear = 1; // Sol only (for other systems it is seconds per day)
var sizeFactor = 750;

// Solar system objects
var systems = {
    'Sol' : {'names' : ['Sol', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        'orbitSizes' : [0, 5, 9, 14, 24, 78, 143, 288, 450],
        'bodySizes' : [12, 1, 2, 2, 1, 7, 5, 4, 4],
        'periods' : [0, 0.24, 0.62, 1, 1.88, 11.86, 29.46, 84.01, 164.8],
        'colors' : ['yellow', 'lightgray', 'lightgreen', 'blue', 'red', 'orange', 'yellow', 'blue', 'blue']
    },
    'HD-10180' : {'names' : ['HD-10180', 'b', 'c', 'i', 'd', 'e', 'j', 'f', 'g', 'h'],
        'orbitSizes' : [0, 5, 10, 16, 22, 27, 33, 49, 141, 349],
        'bodySizes' : [13, 1, 3, 1, 3, 5, 2, 5, 5, 6],
        'periods' : [0, 0.1, 0.6, 1, 1.6, 4.9, 6.7, 12.2, 59.6, 230],
        'colors' : ['yellow', 'lightgray', 'lightgreen', 'blue', 'red', 'brown', 'purple', 'yellow', 'orange', 'yellow']
    },
    'Gliese-581' : {'names' : ['Gliese-581', 'e', 'b', 'c'],
        'orbitSizes' : [0, 3, 4, 7],
        'bodySizes' : [20, 6, 10, 4],
        'periods' : [0, 3, 5, 13],
        'colors' : ['red', 'pink', 'orange', 'blue']
    }
}

// Build solar system, set up vars, set up key event handlers, etc.
window.onload = function(){
    var selectedSystem = document.getElementById('choose-system');
    var slider = document.getElementById('slider');
    buildSolarSystem();
    setSliderCommands();

    // Resize or Recreate solar system to fit new screen size or in response to dropdown
    window.onresize = selectedSystem.onchange = buildSolarSystem;
}

function buildSolarSystem()
{
    var container = document.getElementById('solar-system');
    container.innerHTML = '';
    var selected = document.getElementById('choose-system');
    var index = selected.options[selected.selectedIndex].value;
    var system = systems[index];
    var names = system.names;
    var orbitSizes = system.orbitSizes;
    var bodySizes = system.bodySizes;
    var periods = system.periods;
    var colors = system.colors;

    // Create Star
    var star = document.createElement('div');
    var windowSize = window.innerHeight;
    var sunSize = (bodySizes[0] * windowSize) / sizeFactor;
    var max = windowSize - (sunSize * 2);
    var orbitModifier = max / orbitSizes[orbitSizes.length - 1]; // Orbit of outer planet will be max
    star.className = "bodies";
    star.id = "sun";
    star.style.height = star.style.width = sunSize + "px";
    star.style.marginTop = star.style.marginLeft = -sunSize/2 + "px";
    star.style.backgroundColor = colors[0];
    container.appendChild(star);

    // Create Planets
    for(var i = 1; i < names.length; i++) {
        var orbit = orbitSizes[i] * orbitModifier;
        var size = (bodySizes[i] * max) / sizeFactor;
        var outer = document.createElement('div');
        outer.className = "orbit";
        outer.style.width = outer.style.height = orbit + sunSize + "px";
        outer.style.marginTop = outer.style.marginLeft = -(orbit + sunSize)/2 + "px";
        outer.style['-webkit-animation'] = "spin-right " + periods[i] * secondsPerYear + "s linear infinite";
        outer.style['-moz-animation'] = "spin-right " + periods[i] * secondsPerYear + "s linear infinite";
        outer.style['-ms-animation'] = "spin-right " + periods[i] * secondsPerYear + "s linear infinite";
        outer.style['-o-animation'] = "spin-right " + periods[i] * secondsPerYear + "s linear infinite";
        outer.style.animation = "spin-right " + periods[i] * secondsPerYear + "s linear infinite";
        var inner = document.createElement('div');
        inner.className = "bodies planet";
        inner.id = names[i];
        inner.style.width = inner.style.height = size + "px";
        inner.style.marginLeft = inner.style.marginTop = -size/2 + "px";
        inner.style.backgroundColor = colors[i];
        outer.appendChild(inner);
        container.appendChild(outer);
    }

}

function setSliderCommands()
{
    slider.onchange = function() {
        secondsPerYear = 1/this.value;
        buildSolarSystem();
    };
}




