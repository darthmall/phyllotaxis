/** @jsx React.DOM */
var _ = require('lodash'),
    d3 = require('d3'),
    React = require('react'),

    generatePhyllo = require('../phyllo-generator.js'); // function that does the phyllo math lives here

// React component that draws the phyllotaxis in a SVG

var Phyllotaxis = React.createClass({
    getInitialState: function() {
        return {
            points: [],
            maxRadius: 0
        }
    },
    componentWillMount: function() {
        // generate phyllo on initial component mount
        this.generatePhyllo(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        // getting new props from parent, generate new phyllo state
        this.generatePhyllo(nextProps);
    },

    generatePhyllo: function(props) {
        // generate the points for the phyllo
        var phyllo = generatePhyllo({
            numPoints: props.numPoints,
            angle: props.angle,
            radiusFunc: props.radiusFunc,
            thetaFunc: props.thetaFunc
        });
        // update this.state with the new phyllo points to trigger re-render
        this.setState({
            points: phyllo.points, // set of points in phyllo
            maxRadius: phyllo.maxRadius // distance of furthest point from center, for scaling
        });
    },

    render: function() {
        var radiusDomain = [-1 * this.state.maxRadius, this.state.maxRadius], // can be sped up if maxR doesnt change
            xScale = d3.scale.linear().domain(radiusDomain).range([0, 500]),
            yScale = d3.scale.linear().domain(radiusDomain).range([0, 500]);

        return (
            <svg width="500" height="500">
                {_.map(this.state.points, _.bind(function createPhylloPoint(coords, i) {
                    return <circle
                        key={i} // React renders faster if each element in a list has a unique key prop
                        r={this.props.pointSize || 2}
                        cx={xScale(coords[0])}
                        cy={yScale(coords[1])} />;
                }, this))}
            </svg>
        );
    }
});

module.exports = Phyllotaxis;