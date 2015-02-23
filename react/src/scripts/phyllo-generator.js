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

function polarToCartesian(r, theta) { return [r * Math.cos(theta), r * Math.sin(theta)]; }

function generatePhyllotaxis(options) {
    options = defaultOptions(options || {}, { // default phyllo options
        angle: 2.32058,
        numPoints: 200,
        thetaFunc: function(n, angle, numPoints) { return angle * n; },
        radiusFunc: function(n, angle, theta, numPoints) { return Math.sqrt(n); },
        colorFunc: function(n, angle, theta, radius, numPoints) { return '#000'; }
    });
    var maxRadius = 0, points = [];

    for (var n = 1; n <= options.numPoints; n++) {
        var theta = options.thetaFunc(n, options.angle, options.numPoints),
            r = options.radiusFunc(n, options.angle, theta, options.numPoints),
            color = options.colorFunc(n, options.angle, theta, r, options.numPoints),
            coords = polarToCartesian(r, theta);
        points.push([coords[0], coords[1], color]);
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
