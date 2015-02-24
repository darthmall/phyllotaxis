var _ = require('lodash'),
    d3 = require('d3'),
    React = require('react'),
    ReactKinetic = require('react-kinetic'),

    generatePhyllo = require('../phyllo-generator.js'); // function that does the phyllo math lives here

// React component that draws the phyllotaxis
// This implementation uses react-kinetic which uses canvas, which should be faster than SVG (in theory)
// react-kinetic is out of date, so lets hope it works
// edit: wow, it's way slower. react-kinetic is probably creating pseudo-dom elements that are slow. :(

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
            <ReactKinetic.Stage height={500} width={500}>
                <ReactKinetic.Layer>
                    {_.map(this.state.points, _.bind(function createPhylloPoint(coords, i) {
                        return <ReactKinetic.Circle
                            key={i} // React renders faster if each element in a list has a unique key prop
                            x={xScale(coords[0])}
                            y={yScale(coords[1])}
                            width={this.props.pointSize || 2}
                            height={this.props.pointSize || 2}
                            fill="black"
                        />
                    }, this))}
                </ReactKinetic.Layer>
            </ReactKinetic.Stage>
        );
    }
});

module.exports = Phyllotaxis;
