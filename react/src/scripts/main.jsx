var _ = require('lodash'),
    d3 = require('d3'),
    $ = require('jquery'),
    React = require('react'),
    math = require('mathjs'),

    //Phyllotaxis = require('./components/phyllotaxis.jsx'), // React SVG version (ok til ~2000 points)
    //Phyllotaxis = require('./components/phyllo-react-kinetic.jsx'), // react-kinetic version (wicked slow)
    Phyllotaxis = require('./components/phyllo-canvas.jsx'), // pure canvas version (fastest, ok til 10k+ points)
    ControlPanel = require('./components/control-panel.jsx');


var funcBeginRegEx =  /^\s*function\s*\w*\(([\w,\s]*[\n\/\*]*)\)\s*\{[\s\n]*/, // 'function(a,b,c) { '
    funcEndRegEx = /\s*}\s*$/; // ' } '

function unwrapFuncStr(funcStr) {
    // peel the "function() {}" wrapper off of a function string (to make an 'internal function string')
    return funcStr.replace(funcBeginRegEx, '').replace(funcEndRegEx, '')
}

class PhylloStateStore {
    constructor() {
        this.initSavedKeys();
    }
    initSavedKeys() {
        var keyStr = localStorage['phyllo:keys'] || '{}';
        this.savedKeys = JSON.parse(keyStr);
    }

    saveKeys() {
        localStorage['phyllo:keys'] = JSON.stringify(this.savedKeys);
    }
    saveState(key, state) {
        // todo warn on duplicate
        var savedState = _.omit(state, ['height', 'width']);
        savedState.funcStrs = [];
        _.each(savedState, (val, key) => {
            if(!_.isFunction(val)) return;
            savedState[key] = val.toString();
            savedState.funcStrs.push(key); // save functions as strings, and note which so we can undo
        });

        this.savedKeys[key] = true;
        this.saveKeys();
        localStorage[`phyllo:state:${key}`] = JSON.stringify(savedState);
    }

    loadState(key) {
        if(!(key in this.savedKeys)) throw 'not a valid key';
        var savedStr = localStorage[`phyllo:state:${key}`];
        if(_.isUndefined(savedStr)) throw 'should be a valid key, but I cant find it. sorry.';

        var savedState = JSON.parse(savedStr);
        !_.each(savedState.funcStrs || [], funcStrKey => {
            // slightly nicer way to make a function from a string than eval(). only slightly. that regex is badbad
            try {
                var funcStr = savedState[funcStrKey];
                var paramMatch = funcStr.match(funcBeginRegEx);
                var params = paramMatch.length ? paramMatch[1].split(/,\s*/) : [];
                if(params.length == 1 && params[0] == '') params = [];

                //savedState[funcStrKey] = Function(unwrapFuncStr(savedState[funcStrKey]));
                savedState[funcStrKey] = Function.apply(this, _.flatten([params, unwrapFuncStr(funcStr)]));
            } catch(e) { throw "failed to load state key" + funcStrKey; }
        });
        return savedState;
    }
}



var PhylloApp = React.createClass({
    getInitialState: function() {
        return {
            name: "Untitled",
            height: window.innerHeight - 36,
            width: window.innerHeight - 36,
            backgroundColor: '#212121',
            shouldClearOnFrame: true,
            numPoints: 3000, // number of points in phyllo
            pointSize: 3, // radius of each point in phyllo
            x: 1, // variable that gets animated
            xStep: 0.000005, // amount x changes each animation step

            // function controlling angle theta of point n (polar coordinate)
            theta: function(n, x, numPoints) {
                var fibonacciAngle = 2 * Math.PI * Math.pow((Math.sqrt(5) + 1) / 2, -2);
                return fibonacciAngle * n;
            },
            // function controlling distance of point n from center
            radius: function(n, x, theta, numPoints) { return Math.sqrt(n); },
            // function controlling color of point n
            //colorFunc: function(n, angle, theta, radius, numPoints) { return '#000000'; }
            color: function(n, x, theta, radius, numPoints) { return d3.hsl(Math.cos(theta) * 60, .7, 0.4); },
            // function controlling size of point n
            size: function(n, x, theta, radius, numPoints) { return 3; }
        };
    },

    componentWillMount: function() {
        this.store = this.props.store;
    },
    componentDidMount: function() {
        // start animating right away on initial load
        //this.animate();
    },

    animate: function() {
        //this.animationInterval = setInterval(this.onAnimationFrame, 20);
        this.animRequest = window.requestAnimationFrame(this.onAnimationFrame);
        this.setState({isPlaying: true});
    },
    pause: function() {
        //if(this.animationInterval) clearInterval(this.animationInterval);
        if(this.animRequest) window.cancelAnimationFrame(this.animRequest);
        this.setState({isPlaying: false});
    },
    toggleAnimate: function() {
        this.state.isPlaying ? this.pause() : this.animate();
    },

    onAnimationFrame() {
        // just update the state on each animation frame and React does the rest, rendering children
        var newX = this.state.x + this.state.xStep;
        newX = Number(newX.toFixed(12)); // round to 12 decimal places, avoid floating point rounding errors
        this.setState({x: newX});
        this.animRequest = window.requestAnimationFrame(this.onAnimationFrame);
    },
    onControlPanelChange(panelState) {
        // got new state from the control panel. update app state to reflect this, triggering re-render
        this.setState(panelState);
    },
    onClickSave(event) {
        this.store.saveState(this.state.name, this.state);
    },
    onLoadKey(key) {
        var loaded = this.store.loadState(key);
        if(_.isObject(loaded)) this.setState(loaded);
    },

    render: function() {
        return (
            <div id="phyllo-app" style={{backgroundColor: this.state.backgroundColor}}>
                <Phyllotaxis
                    width={this.state.width}
                    height={this.state.height}

                    shouldClearOnFrame={this.state.shouldClearOnFrame}
                    numPoints={this.state.numPoints}
                    pointSize={this.state.pointSize}
                    x={this.state.x}

                    theta={this.state.theta}
                    radius={this.state.radius}
                    color={this.state.color}
                />


                <ControlPanel
                    name={this.state.name}
                    savedKeys={this.store.savedKeys}
                    isPlaying={this.state.isPlaying}
                    backgroundColor={this.state.backgroundColor}

                    shouldClearOnFrame={this.state.shouldClearOnFrame}
                    numPoints={this.state.numPoints}
                    pointSize={this.state.pointSize}
                    x={this.state.x}
                    xStep={this.state.xStep}

                    theta={this.state.theta}
                    thetaParams={['n', 'x', 'numPoints']} // parameters available in function
                    radius={this.state.radius}
                    radiusParams={['n', 'x', 'theta', 'numPoints']}
                    color={this.state.color}
                    colorParams={['n', 'x', 'theta', 'radius', 'numPoints']}

                    onToggleAnimate={this.toggleAnimate}
                    onStateChange={this.onControlPanelChange}
                    onClickSave={this.onClickSave}
                    onLoadKey={this.onLoadKey}
                />

            </div>
        );
    }
});



// empirically derived 2nd-best phyllotaxis angle -dd
// 2.320585

// butterfly radius function:
// var sinPow5 = function(theta) { return (10*Math.sin(theta) - 5*Math.sin(3*theta) + Math.sin(5*theta)) / 16; }; return Math.pow(Math.E, Math.sin(theta)) - (2*Math.cos(4*theta)) + sinPow5(((2*theta) - Math.PI) / 24);

// cannabis curve http://mathworld.wolfram.com/CannabisCurve.html
// return (1 + ((9/10)*Math.cos(8*theta))) * (1 + ((1/10)*Math.cos(24*theta))) * ((9/10) + ((1/10)*Math.cos(200*theta))) * (1 + Math.sin(theta));

// tangent rainbow
//return d3.hsl(Math.cos(theta) * Math.tan(angle * 1233.93) * 60, 0.7, 0.4);

// color wheel
// return d3.hsl((theta % (2*Math.PI)) * 57.29, 1, (radius / (angle-2) * .002));

// least prime factor
// for visualizing ulam spiral
// return d3.hsl(Math.min(leastFactor(n), 180), 0.7, 0.4);
//function leastFactor(n) {
//    if (isNaN(n) || !isFinite(n)) return NaN;
//    if (n==0) return 0;
//    if (n%1 || n*n<2) return 1;
//    if (n%2==0) return 2;
//    if (n%3==0) return 3;
//    if (n%5==0) return 5;
//    var m = Math.sqrt(n);
//    for (var i=7;i<=m;i+=30) {
//        if (n%i==0)      return i;
//        if (n%(i+4)==0)  return i+4;
//        if (n%(i+6)==0)  return i+6;
//        if (n%(i+10)==0) return i+10;
//        if (n%(i+12)==0) return i+12;
//        if (n%(i+16)==0) return i+16;
//        if (n%(i+22)==0) return i+22;
//        if (n%(i+24)==0) return i+24;
//    }
//    return n;
//}

//return n * Math.sin(theta) * Math.cos(n);

// eye of sauron
// return n * Math.sin(theta) * Math.cos(n) + n;

var store = new PhylloStateStore();
$(function() {

    React.render(React.createElement(PhylloApp, {store}), document.getElementById('phyllo-app-container'));
});


_.extend(window, {
    _,
    $,
    d3,
    React,
    math,
    PhylloApp,
    store
});
