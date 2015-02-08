/** @jsx React.DOM */
var _ = require('lodash'),
    d3 = require('d3'),
    $ = require('jquery'),
    React = require('react'),

    Phyllotaxis = require('./components/phyllotaxis.jsx'),
    ControlPanel = require('./components/control-panel.jsx');

var PhylloApp = React.createClass({
    getInitialState: function() {
        return {
            numPoints: 500, // number of points in phyllo
            pointSize: 4, // radius of each point in phyllo
            angle: 2.4, // starting angle for the phyllo
            angleStep: 0.00001, // radians the phyllo angle changes each animation step

            // function controlling distance of point n from center of phyllo
            radiusFunc: function(n, angle) { return Math.sqrt(n); },
            // function controlling theta of point n in phyllo (polar coordinate)
            thetaFunc: function(n, angle) { return angle * n; }
        };
    },

    componentDidMount: function() {
        // start animating right away on initial load
        this.animate();
    },

    animate: function() {
        this.animationInterval = setInterval(this.onAnimationFrame, 10);
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
                />
                <ControlPanel
                    isPlaying={this.state.isPlaying}

                    numPoints={this.state.numPoints}
                    pointSize={this.state.pointSize}
                    angle={this.state.angle}
                    angleStep={this.state.angleStep}

                    radiusFunc={this.state.radiusFunc}
                    radiusFuncParams={['n', 'angle', 'theta', 'numPoints']} // parameters available in function
                    thetaFunc={this.state.thetaFunc}
                    thetaFuncParams={['n', 'angle', 'numPoints']}

                    onToggleAnimate={this.toggleAnimate}
                    onStateChange={this.onControlPanelChange}
                />
            </div>
        );
    }
});

// butterfly radius function:
// var sinPow5 = function(theta) { return (10*Math.sin(theta) - 5*Math.sin(3*theta) + Math.sin(5*theta)) / 16; };
// return Math.pow(Math.E, Math.sin(theta)) - (2*Math.cos(4*theta)) + sinPow5(((2*theta) - Math.PI) / 24);


React.render(<PhylloApp />, document.getElementById('phyllo-app'));

_.extend(window, {
    _: _,
    $: $,
    React: React,
    d3: d3,
    PhylloApp: PhylloApp
});
