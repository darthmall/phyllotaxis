/** @jsx React.DOM */
var _ = require('lodash'),
    d3 = require('d3'),
    $ = require('jquery'),
    React = require('react'),

    //Phyllotaxis = require('./components/phyllotaxis.jsx'), // React SVG version (ok til ~2000 points)
    //Phyllotaxis = require('./components/phyllo-react-kinetic.jsx'), // react-kinetic version (wicked slow)
    Phyllotaxis = require('./components/phyllo-canvas.jsx'), // pure canvas version (fastest, ok til 10k+ points)
    ControlPanel = require('./components/control-panel.jsx');

var PhylloApp = React.createClass({
    getInitialState: function() {
        return {
            height: window.innerHeight - 36,
            width: window.innerHeight - 36,
            backgroundColor: '#212121',
            shouldClearOnFrame: true,

            numPoints: 3000, // number of points in phyllo
            pointSize: 3, // radius of each point in phyllo
            // starting angle for the phyllo
            //angle: 2.320585, // empirically discovered local maxima(?)
            angle: 2 * Math.PI * Math.pow((Math.sqrt(5) + 1) / 2, -2), // Fibonacci Angle!
            angleStep: 0.000005, // radians the phyllo angle changes each animation step


            // function controlling angle theta of point n (polar coordinate)
            thetaFunc: function(n, angle, numPoints) { return angle * n; },
            // function controlling distance of point n from center
            radiusFunc: function(n, angle, theta, numPoints) { return Math.sqrt(n); },
            // function controlling color of point n
            //colorFunc: function(n, angle, theta, radius, numPoints) { return '#000000'; }
            colorFunc: function(n, angle, theta, radius, numPoints) { return d3.hsl(Math.cos(theta) * 60, .7, 0.4); }
        };
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

    onAnimationFrame: function() {
        // just update the state on each animation frame and React does the rest, rendering children
        var newAngle = this.state.angle + this.state.angleStep;
        newAngle = Number(newAngle.toFixed(12)); // round to 12 decimal places, avoid floating point rounding errors
        this.setState({angle: newAngle});
        this.animRequest = window.requestAnimationFrame(this.onAnimationFrame);
    },
    onControlPanelChange: function(panelState) {
        // got new state from the control panel. update app state to reflect this, triggering re-render
        this.setState(panelState);
    },

    render: function() {
        return (
            <div id="phyllo-app" style={{'background-color':'#333'}}>
                <Phyllotaxis
                    width={this.state.width}
                    height={this.state.height}
                    shouldClearOnFrame={this.state.shouldClearOnFrame}
                    numPoints={this.state.numPoints}
                    pointSize={this.state.pointSize}
                    angle={this.state.angle}

                    radiusFunc={this.state.radiusFunc}
                    thetaFunc={this.state.thetaFunc}
                    colorFunc={this.state.colorFunc}
                />

                <ControlPanel
                    isPlaying={this.state.isPlaying}

                    shouldClearOnFrame={this.state.shouldClearOnFrame}
                    numPoints={this.state.numPoints}
                    pointSize={this.state.pointSize}
                    angle={this.state.angle}
                    angleStep={this.state.angleStep}
                    backgroundColor={this.state.backgroundColor}

                    thetaFunc={this.state.thetaFunc}
                    thetaFuncParams={['n', 'angle', 'numPoints']} // parameters available in function
                    radiusFunc={this.state.radiusFunc}
                    radiusFuncParams={['n', 'angle', 'theta', 'numPoints']}
                    colorFunc={this.state.colorFunc}
                    colorFuncParams={['n', 'angle', 'theta', 'radius', 'numPoints']}

                    onToggleAnimate={this.toggleAnimate}
                    onStateChange={this.onControlPanelChange}
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


React.render(<PhylloApp />, document.getElementById('phyllo-app-container'));

_.extend(window, {
    _: _,
    $: $,
    React: React,
    d3: d3,
    PhylloApp: PhylloApp
});
