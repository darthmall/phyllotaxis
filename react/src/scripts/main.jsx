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
            numPoints: 500, // number of points in phyllo
            pointSize: 9, // radius of each point in phyllo
            angle: 2.4, // starting angle for the phyllo
            angleStep: 0.00001, // radians the phyllo angle changes each animation step


            // function controlling angle theta of point n (polar coordinate)
            thetaFunc: function(n, angle, numPoints) { return angle * n; },
            // function controlling distance of point n from center
            radiusFunc: function(n, angle, theta, numPoints) { return Math.sqrt(n); },
            // function controlling color of point n
            //colorFunc: function(n, angle, theta, radius, numPoints) { return '#000000'; }
            colorFunc: function(n, angle, theta, radius, numPoints) { return d3.hsl((Math.sqrt(n) * angle * 3) + 30, .7, 0.4); }
        };
    },

    componentDidMount: function() {
        // start animating right away on initial load
        this.animate();
    },

    animate: function() {
        this.animationInterval = setInterval(this.onAnimationFrame, 20);
        this.setState({isPlaying: true});
    },
    pause: function() {
        if(this.animationInterval) clearInterval(this.animationInterval);
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
    },
    onControlPanelChange: function(panelState) {
        // got new state from the control panel. update app state to reflect this, triggering re-render
        this.setState(panelState);
    },

    render: function() {
        return (
            <div>
                <Phyllotaxis
                    numPoints={this.state.numPoints}
                    pointSize={this.state.pointSize}
                    angle={this.state.angle}

                    radiusFunc={this.state.radiusFunc}
                    thetaFunc={this.state.thetaFunc}
                    colorFunc={this.state.colorFunc}
                />
                <ControlPanel
                    isPlaying={this.state.isPlaying}

                    numPoints={this.state.numPoints}
                    pointSize={this.state.pointSize}
                    angle={this.state.angle}
                    angleStep={this.state.angleStep}


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

// butterfly radius function:
// var sinPow5 = function(theta) { return (10*Math.sin(theta) - 5*Math.sin(3*theta) + Math.sin(5*theta)) / 16; }; return Math.pow(Math.E, Math.sin(theta)) - (2*Math.cos(4*theta)) + sinPow5(((2*theta) - Math.PI) / 24);

// cannabis curve http://mathworld.wolfram.com/CannabisCurve.html
// return (1 + ((9/10)*Math.cos(8*theta))) * (1 + ((1/10)*Math.cos(24*theta))) * ((9/10) + ((1/10)*Math.cos(200*theta))) * (1 + Math.sin(theta));


// devils curve
//var a2 = 1, b2=2, sin2=function(theta) { return (1 - Math.cos(2*theta)) / 2; }, cos2=function(theta) { return (1 + Math.cos(2*theta)) / 2; };
// return Math.sqrt( ((1*sin2(theta)) - (2*cos2(theta))) / (sin2(theta) - cos2(theta)))


React.render(<PhylloApp />, document.getElementById('phyllo-app'));

_.extend(window, {
    _: _,
    $: $,
    React: React,
    d3: d3,
    PhylloApp: PhylloApp
});
