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
    onChangeColorFunc: function(newValue) { this.props.onStateChange({colorFunc: newValue}); },

    onStateChange: function(stateKey) {
        // create callback function for the provided key
        return _.bind(function(newValue) {
            var newState = {};
            newState[stateKey] = newValue;
            this.props.onStateChange(newState);
        }, this);
    },

    render: function() {
        return (
            <div>
                <button onClick={this.props.onToggleAnimate}>
                    {this.props.isPlaying ? "Pause" : "Play"}
                </button>

                <NumberInput
                    label="Number of Points"
                    value={this.props.numPoints}
                    onValidChange={this.onStateChange('numPoints')}
                />

                <NumberInput
                    label="Point Size"
                    value={this.props.pointSize}
                    onValidChange={this.onStateChange('pointSize')}
                />

                <NumberInput
                    label="Angle"
                    value={this.props.angle}
                    onValidChange={this.onStateChange('angle')}
                />

                <NumberInput
                    label="Angle step"
                    value={this.props.angleStep}
                    onValidChange={this.onStateChange('angleStep')}
                />

                <FunctionInput
                    label="Radius"
                    value={this.props.radiusFunc}
                    funcParams={this.props.radiusFuncParams}
                    onValidChange={this.onStateChange('radiusFunc')}
                />

                <FunctionInput
                    label="Theta"
                    value={this.props.thetaFunc}
                    funcParams={this.props.thetaFuncParams}
                    onValidChange={this.onStateChange('thetaFunc')}
                />

                <FunctionInput
                    label="Color"
                    value={this.props.colorFunc}
                    funcParams={this.props.colorFuncParams}
                    onValidChange={this.onStateChange('colorFunc')}
                />
            </div>
        );
    }
});

module.exports = ControlPanel;