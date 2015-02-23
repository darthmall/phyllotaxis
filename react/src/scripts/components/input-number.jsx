/** @jsx React.DOM */
var _ = require('lodash'),
    React = require('react');

var NumberInput = React.createClass({
    getInitialState: function() {
        return { inputValue: '' };
    },
    // since we're tracking what's displayed in the input (inputValue) separately from the true state value,
    // we have to update inputValue state manually when receiving new props
    componentWillMount: function() {
        this.setState({inputValue: this.props.value, isValid: true});
    },
    componentWillReceiveProps: function(nextProps) {
        var isSameNumberAsInputValue = (Number(nextProps.value) === Number(this.state.inputValue));
        if(!isSameNumberAsInputValue) this.setState({inputValue: nextProps.value, isValid: true});

        // REACT DRAGONS HERE: Note that we only update state.inputValue (the text in the input field)
        // if the new value we got is a different *Number* than the existing (prop) value.
        // If we don't do this the following will happen:
        //
        // 1. this.state.inputValue is "0"
        // 2. user types "." so the inputValue becomes "0."
        // 3. onChange calls parent's onValidChange callback, passing Number("0.") [which is 0] to parent
        // 4. parent updates its state to 0, triggering a re-render
        // 5. this receives new props, and this.props.value is 0, so the input text gets updated to "0"
        // 6. therefore the user cannot type "0." because it will always get 'corrected' to the new true state, "0"
        //
        // This check stops the update in #5 because Number("0.") == Number("0")
        // React can be tricky like this but it forces you to think carefully about app state vs. UI state.
    },

    onChange: function(event) {
        var inputValue = event.target.value,
            numberValue = Number(inputValue),
            isValid = !_.isNaN(numberValue);

        // this allows input text to contain whatever value you type in, good or bad...
        this.setState({inputValue: inputValue, isValid: isValid}, function() {
            // ... but only calls callback to change app state if it's really a Number
            if(isValid) this.props.onValidChange(numberValue);
            // note setState is asynchronous so we do this in callback to ensure state has updated
        });
    },
    render: function() {
        return (
            <label className='number-input'>
                {this.props.label}
                <input type="text" value={this.state.inputValue} onChange={this.onChange} />
            </label>
        );
    }
});

module.exports = NumberInput;
