var _ = require('lodash'),
    d3 = require('d3'),
    $ = require('jquery'),
    React = require('react');

function polarToCartesian(r, theta) { return [r * Math.cos(theta), r * Math.sin(theta)]; }

function generatePhyllotaxis (numPoints, angle, options) {
    var c = 1,
        maxRadius = 0,
        points = [];

    for (n = 1; n <= numPoints; n++) {
        r = c * Math.sqrt(n);
        theta = angle * n;
        points.push(polarToCartesian(r, theta));
        maxRadius = r;
    }

    return {
        points: points,
        maxRadius: maxRadius
    };
}

var PhylloApp = React.createClass({
    getInitialState: function() {
        return {angle: 0, points: [], maxRadius: 0};
    },

    componentDidMount: function() {
        this.animate();
    },
    generatePhyllo: function() {
        var phylloData = generatePhyllotaxis(600, this.state.angle);
        this.setState({
            'points': phylloData.points,
            'maxRadius': phylloData.maxRadius
        });
    },
    animate: function() {
        this.animationInterval = setInterval(this.onAnimationFrame, 10);
    },
    pause: function() {
        if(this.animationInterval) clearInterval(this.animationInterval);
    },
    onAnimationFrame: function() {
        this.setState({'angle': this.state.angle + 0.0005});
        this.generatePhyllo();
    },
    render: function() {
        return (
            <div>
                <Phyllotaxis
                    points={this.state.points}
                    maxRadius={this.state.maxRadius}
                />
            </div>
        );
    }
});

var Phyllotaxis = React.createClass({
    render: function() {
        var radiusDomain = [-1 * this.props.maxRadius, this.props.maxRadius];
        var xScale = d3.scale.linear().domain(radiusDomain).range([0, 500]);
        var yScale = d3.scale.linear().domain(radiusDomain).range([0, 500]);
        return (
            <svg width="500" height="500">
                {_.map(this.props.points, function(point, i) {
                    return <PhylloPoint
                        coords={point}
                        xScale={xScale}
                        yScale={yScale}
                        key={i}
                    />;
                })}
            </svg>
        );
    }
});

var PhylloPoint = React.createClass({
    render: function() {
        return (
            <circle
                r={this.props.radius || 3}
                cx={this.props.xScale(this.props.coords[0])}
                cy={this.props.yScale(this.props.coords[1])}
            />
        )
    }
});

React.render(<PhylloApp />, document.getElementById('phyllo-app'));

_.extend(window, {
    _: _,
    $: $,
    React: React,
    d3: d3,
    generatePhyllotaxis: generatePhyllotaxis
});
