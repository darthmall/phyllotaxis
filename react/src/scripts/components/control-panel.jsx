/** @jsx React.DOM */
var _ = require('lodash'),
    React = require('react'),

    NumberInput = require('./input-number.jsx'),
    FunctionInput = require('./input-function.jsx');

var ControlPanel = React.createClass({
    onChangeNumPoints: function(newValue) { this.props.onStateChange({numPoints: newValue}); },
    onChangePointSize: function(newValue) { this.props.onStateChange({pointSize: newValue}); },
    onChangeAngle: function(newValue) { this.props.onStateChange({angle: newValue}); },
    onChangeAngleStep: function(newValue) { this.props.onStateChange({angleStep: newValue}); },
    onChangeRadiusFunc: function(newValue) { this.props.onStateChange({radiusFunc: newValue}); },
    onChangeThetaFunc: function(newValue) { this.props.onStateChange({thetaFunc: newValue}); },

    render: function() {
        return (
            <div>
                <button onClick={this.props.onToggleAnimate}>
                    {this.props.isPlaying ? "Pause" : "Play"}
                </button>

                <NumberInput
                    label="Number of Points"
                    value={this.props.numPoints}
                    onValidChange={this.onChangeNumPoints}
                />

                <NumberInput
                    label="Point Size"
                    value={this.props.pointSize}
                    onValidChange={this.onChangePointSize}
                />

                <NumberInput
                    label="Angle"
                    value={this.props.angle}
                    onValidChange={this.onChangeAngle}
                />

                <NumberInput
                    label="Angle step"
                    value={this.props.angleStep}
                    onValidChange={this.onChangeAngleStep}
                />

                <FunctionInput
                    label="Radius Function"
                    value={this.props.radiusFunc}
                    funcParams={this.props.radiusFuncParams}
                    onValidChange={this.onChangeRadiusFunc}
                />

                <FunctionInput
                    label="Theta Function"
                    value={this.props.thetaFunc}
                    funcParams={this.props.thetaFuncParams}
                    onValidChange={this.onChangeThetaFunc}
                />
            </div>
        );
    }
});

module.exports = ControlPanel;