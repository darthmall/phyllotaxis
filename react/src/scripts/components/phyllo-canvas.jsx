/** @jsx React.DOM */
var _ = require('lodash'),
    d3 = require('d3'),
    React = require('react'),

    generatePhyllo = require('../phyllo-generator.js'); // function that does the phyllo math lives here

// React component that draws the phyllotaxis
// This implementation will attempt to use pure html5 canvas with no libraries for the sake of speed,
// bypassing React's Virtual DOM

var Phyllotaxis = React.createClass({
    getInitialState: function() {
        return {
            points: [],
            maxRadius: 0
        }
    },
    shouldComponentUpdate: function() {
        return false; // don't re-render canvas, repaint instead
    },
    componentDidMount: function() {
        // get canvas context (it will stay the same since we are short-circuiting re-render with shouldComponentUpdate)
        this.canvasContext = this.refs.canvas.getDOMNode().getContext('2d');
        // generate phyllo on initial component mount and paint canvas
        this.generatePhyllo(this.props, this.paintCanvas);
    },
    componentWillReceiveProps: function(nextProps) {
        // getting new props from parent, generate new phyllo state and paint canvas
        this.generatePhyllo(nextProps, this.paintCanvas);
    },

    generatePhyllo: function(props, callback) {
        // generate the points for the phyllo
        var phyllo = generatePhyllo({
            numPoints: props.numPoints,
            angle: props.angle,
            radiusFunc: props.radiusFunc,
            thetaFunc: props.thetaFunc,
            colorFunc: props.colorFunc
        });
        // update this.state with the new phyllo points
        this.setState({
            points: phyllo.points, // set of points in phyllo
            maxRadius: phyllo.maxRadius // distance of furthest point from center, for scaling
        }, callback || _.identity);
    },

    paintCanvas: function() {
        var ctx = this.canvasContext;
        var radiusDomain = [-1 * this.state.maxRadius, this.state.maxRadius], // can be sped up if maxR doesnt change
            xScale = d3.scale.linear().domain(radiusDomain).range([0, 500]),
            yScale = d3.scale.linear().domain(radiusDomain).range([0, 500]),
            pointSize = this.props.pointSize,
            twoPi = 2 * Math.PI;

        ctx.clearRect( 0 , 0 , 500, 500);
        ctx.fillStyle = 'green';

        for(var i=0; i<this.state.points.length; i++) {
            var coords = this.state.points[i];
            ctx.beginPath();
            ctx.arc(xScale(coords[0]), yScale(coords[1]), pointSize || 2, 0, twoPi, false);
            ctx.fillStyle = coords[2];
            ctx.fill();
        }
    },

    render: function() {
        var radiusDomain = [-1 * this.state.maxRadius, this.state.maxRadius], // can be sped up if maxR doesnt change
            xScale = d3.scale.linear().domain(radiusDomain).range([0, 500]),
            yScale = d3.scale.linear().domain(radiusDomain).range([0, 500]);

        return (
            <canvas ref="canvas" height={500} width={500}>
            </canvas>
        );
    }
});

module.exports = Phyllotaxis;