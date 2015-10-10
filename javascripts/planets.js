
var secondsPerYear = 1; // Sol only (for other systems it is seconds per day)
var sizeFactor = 750;
var zoom = 1;
var minBodies = 2;
var maxBodies = 10;
var maxBodySize = 24;
var minBodySize = 1;
var minStarSize = 10;
var orbitIntervalMin = 1;
var orbitIntervalMax = 5;

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
};

var newSystem = null;

// Build solar system, set up vars, set up key event handlers, etc.
window.onload = function(){
    var selectedSystem = document.getElementById('choose-system');
    var slider = document.getElementById('slider');
    var zoomSlider = document.getElementById('zoom-slider');

    buildSolarSystem();
    setSliderCommands(slider, zoomSlider);
    makeBackgroundStars();

    // Resize or Recreate solar system to fit new screen size or in response to dropdown
    selectedSystem.onchange = window.onresize = buildSolarSystem;
};

function buildSolarSystem()
{
    var container = document.getElementById('solar-system');
    container.innerHTML = '';
    var selected = document.getElementById('choose-system');
    var index = selected.options[selected.selectedIndex].value;

    if (index !== 'Random') {
        buildExistingSolarSystem(systems[index], container);
    } else {
        if (!newSystem) {
            newSystem = buildNewSolarSystem(minBodies, maxBodies, maxBodySize, minBodySize, minStarSize, orbitIntervalMin, orbitIntervalMax);
        }
        buildExistingSolarSystem(newSystem, container);
    }

}

function buildNewSolarSystem(minBodies, maxBodies, maxBodySize, minBodySize, minStarSize, orbitIntervalMin, orbitIntervalMax)
{
    var numBodies = generateRandomInt(minBodies,maxBodies);
    var names = generateBodyNames(numBodies);
    var bodySizes = generateBodySizes(numBodies, maxBodySize, minBodySize, minStarSize);
    var orbits = generateOrbits(numBodies, orbitIntervalMin, orbitIntervalMax);
    var colors = generateColors(numBodies);

    return {
        'names': names,
        'bodySizes': bodySizes,
        'orbitSizes': orbits.orbitSizes,
        'periods': orbits.periods,
        'colors': colors
    };
}

function generateRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBodyNames(numBodies)
{
    var final = [];
    for (var i = 0; i < numBodies; i++) {
        final.push(generateName());
    }

    return final;
}

function generateName()
{
    var startVowels = ['a', 'e', 'i', 'o', 'u'];
    var vowels = ['a', 'a', 'e', 'e', 'ie', 'ee', 'i', 'i', 'o', 'o', 'ou', 'u', 'y'];
    var startConsonants = ['b', 'c', 'ch', 'd', 'dr', 'f', 'fl', 'g', 'gr', 'h', 'j' ,'k', 'kl', 'kr', 'l', 'm', 'n', 'p', 'ph', 'qu', 'r', 's', 'st', 'sc', 'qu', 't', 'v', 'w', 'x', 'y', 'z'];
    var endConsonants = ['b', 'bb', 'c', 'd', 'dd', 'f', 'ff', 'g', 'gh', 'h', 'j' ,'k', 'l', 'm', 'mm', 'n', 'nn', 'p', 'ph', 'pp', 'qu', 'r', 'rt', 'rr', 's', 'st', 't', 'tt', 'v', 'w', 'x', 'y', 'z', 'zz'];

    var name = '';
    var numSyllables = generateRandomInt(2, 3);

    for (var x = 0; x < numSyllables; x++) {
        name += generateSyllable(startVowels, vowels, startConsonants, endConsonants);
    }

    return name;
}

function generateSyllable(startVowels, vowels, startConsonants, endConsonants)
{
    var structures = {
        1: [startConsonants, vowels, endConsonants],
        2: [startVowels, endConsonants],
        3: [startConsonants, vowels],
        4: [startVowels, startConsonants, startVowels]
    };

    var index = generateRandomInt(1, 4);
    var syllableType = structures[index];
    var syllable = '';
    for (var fragments in syllableType) {
        syllable += syllableType[fragments][generateRandomInt(0, syllableType[fragments].length -1)];
    }

    return syllable;
}

function generateBodySizes(numBodies, maxBodySize, minBodySize, minStarSize)
{
    var sunSize = generateRandomInt(minStarSize, maxBodySize);
    var bodies = [sunSize];

    for (var x = 1; x < numBodies; x++) {
        bodies.push(generateRandomInt(minBodySize, sunSize - 4));
    }

    return bodies;
}

function generateOrbits(numBodies, orbitIntervalMin, orbitIntervalMax)
{
    var periods = [0];
    var orbitSizes = [0];
    var orbit = 0;
    var periodModifier = 1.05;

    for (var x = 1; x < numBodies; x++) {
        var offset = generateRandomInt(orbitIntervalMin, orbitIntervalMax);

        orbit += offset + orbit;
        orbitSizes.push(orbit);
        periods.push((orbit / 5) * periodModifier);
        periodModifier *= periodModifier;
    }

    return {
        periods : periods,
        orbitSizes : orbitSizes
    };
}

function generateColors(numBodies)
{
    var planetColors = ['olive', 'orangered', 'tan', 'brown', 'blue', 'orange', 'darkorange', 'green', 'yellow', 'lightgreen', 'gray', 'lightgray', 'purple', 'red'];
    var starColors = ['blue', 'lightskyblue', 'orange', 'purple', 'yellow', 'white', 'red'];
    var colors = [starColors[generateRandomInt(0, starColors.length - 1)]];

    for (var x = 1; x < numBodies; x++) {
        colors.push(planetColors[generateRandomInt(0, planetColors.length - 1)]);
    }

    return colors;
}

function buildExistingSolarSystem(system, container)
{console.log(system);
    var names = system.names;
    var orbitSizes = system.orbitSizes;
    var bodySizes = system.bodySizes;
    var periods = system.periods;
    var colors = system.colors;

    // Create Star
    var star = document.createElement('div');
    var windowSize = window.innerHeight * zoom;
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
        var planetSize = (bodySizes[i] * max) / sizeFactor;
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
        inner.style.width = inner.style.height = planetSize + "px";
        inner.style.marginLeft = inner.style.marginTop = -planetSize/2 + "px";
        inner.style.backgroundColor = colors[i];
        outer.appendChild(inner);
        container.appendChild(outer);
    }

}

function setSliderCommands(slider, zoomSlider)
{
    slider.onchange = function() {
        secondsPerYear = 1/this.value;
        buildSolarSystem();
    };

    zoomSlider.onchange = function() {
        zoom = this.value;
        buildSolarSystem();
    };
}

function makeBackgroundStars()
{
    var height = window.innerHeight;
    var width = window.innerWidth;
    var stars = document.getElementById('stars');
    var numStars = width / 8;
    stars.style.backgroundSize = width + 'px ' + height + 'px';
    var style = '';
    for (var i = 0; i < numStars; i++){
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);
        var size = 1;
        if (i > width/10) { // Just to make higher proportion of smaller stars
            size = 2;
        }
        style += 'radial-gradient(' + size + 'px ' + size + 'px at ' + x + 'px ' + y + 'px, #EEEEEE, rgba(255,255,255,0)),';
    }
    style = style.slice(0, -1);
    stars.style.backgroundImage = style;
}




