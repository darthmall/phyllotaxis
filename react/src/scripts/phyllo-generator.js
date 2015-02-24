// The functions that actually do the math to generate the phyllo points.
// No dependencies so it can be shared/reused easily.
// This would make a good sample project for new frontend devs:
// we could give them just this file and tell them to make a UI that generates a phyllo

function isUndefined(value) {
    return typeof value == 'undefined';
}

function defaultOptions(options, defaults) {
    var newOptions = {};
    for(var key in defaults) {
        newOptions[key] = isUndefined(options[key]) ? defaults[key] : options[key];
    }
    return newOptions;
}

function toFunction(value, parse) {
    if(typeof value == 'function') return value;
    parse = parse || function(x) { return x; };
    return function() { return parse(value); }
}

function polarToCartesian(r, theta) { return [r * Math.cos(theta), r * Math.sin(theta)]; }

function generatePhyllotaxis(options) {
    options = defaultOptions(options || {}, { // default phyllo options
        x: 1, // free variable passed into all functions... use for whatever... like animation!
        numPoints: 200,
        theta: function(n, x, numPoints) {
            var fibonacciAngle = 2 * Math.PI * Math.pow((Math.sqrt(5) + 1) / 2, -2);
            return fibonacciAngle * n;
        },
        radius: function(n, x, theta, numPoints) { return Math.sqrt(n); },
        color: '#000',
        size: 4
    });
    options.theta = toFunction(options.theta, Number);
    options.radius = toFunction(options.radius, Number);
    options.color = toFunction(options.color, String);
    options.size = toFunction(options.size, Number);
    var maxRadius = 0, points = [];

    for(var n = 1; n <= options.numPoints; n++) {
        var theta = options.theta(n, options.x, options.numPoints),
            r = options.radius(n, options.x, theta, options.numPoints),
            color = options.color(n, options.x, theta, r, options.numPoints),
            size = options.size(n, options.x, theta, r, options.numPoints),
            coords = polarToCartesian(r, theta);
        points.push([coords[0], coords[1], color, size]);
        maxRadius = Math.max(maxRadius, r);
    }

    return {
        points: points,  // set of points generated
        maxRadius: maxRadius // radius of furthest point from origin, to scale it so all the points fit
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = generatePhyllotaxis;
}
