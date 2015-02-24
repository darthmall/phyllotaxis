var _ = require('lodash'),
    React = require('react'),

    NumberInput = require('./input-number.jsx'),
    FunctionInput = require('./input-function.jsx');

var ControlPanel = React.createClass({
    propTypes: {

    },
    getInitialState() {
        return { selectedSavedKey: null };
    },

    onStateChange: function(stateKey) {
        // create callback function for the provided key
        return _.bind(function(newValue) {
            this.props.onStateChange({[stateKey]: newValue});
        }, this);
    },
    onBooleanStateChange(stateKey) {
        return event => {
            this.props.onStateChange({[stateKey]: event.target.checked});
        };
    },
    onTextStateChange(stateKey) {
        return event => {
            this.props.onStateChange({[stateKey]: event.target.value});
        };
    },

    onSelectSaved(event) {
        this.setState({selectedSavedKey: event.target.value})
    },
    onClickLoad(event) {
        if(_.isNull(this.state.selectedSavedKey)) return;
        this.props.onLoadKey(this.state.selectedSavedKey);
    },

    render: function() {
        return (
            <div className='control-panel'>
                <button className='play-button' onClick={this.props.onToggleAnimate}>
                    {this.props.isPlaying ? "Pause" : "Play"}
                </button>

                <div>
                    <label className='boolean-input'>
                        <input
                            type="checkbox"
                            checked={this.props.shouldClearOnFrame}
                            onChange={this.onBooleanStateChange('shouldClearOnFrame')}
                        />
                        <span>Clear canvas</span>
                    </label>
                </div>

                <div>
                    <label className='text-input'>
                        <input
                            type="text"
                            value={this.props.backgroundColor}
                            onChange={this.onTextStateChange('backgroundColor')}
                        />
                        <span>Background Color</span>
                    </label>
                </div>

                <NumberInput
                    label="# Points"
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
                    value={this.props.x}
                    onValidChange={this.onStateChange('x')}
                />

                <NumberInput
                    label="Angle step"
                    value={this.props.xStep}
                    onValidChange={this.onStateChange('xStep')}
                />

                <FunctionInput
                    label="Radius"
                    value={this.props.radius}
                    funcParams={this.props.radiusParams}
                    onValidChange={this.onStateChange('radius')}
                />

                <FunctionInput
                    label="Theta"
                    value={this.props.theta}
                    funcParams={this.props.thetaParams}
                    onValidChange={this.onStateChange('theta')}
                />

                <FunctionInput
                    label="Color"
                    value={this.props.color}
                    funcParams={this.props.colorParams}
                    onValidChange={this.onStateChange('color')}
                />

                <div>
                    <label className='text-input'>
                        <input
                            type="text"
                            value={this.props.name}
                            onChange={this.onTextStateChange('name')}
                        />
                        <span>Save as</span>
                    </label>
                </div>

                <button onClick={this.props.onClickSave}>Save</button>

                <div>
                    <select value={this.state.selectedSavedKey} onChange={this.onSelectSaved}>
                    {_.map(this.props.savedKeys, (val, key) => {
                        return <option key={key} value={key}>{key}</option>
                    })}
                    </select>
                </div>

                <button onClick={this.onClickLoad}>Load</button>

            </div>
        );
    }
});

module.exports = ControlPanel;
