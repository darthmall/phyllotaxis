var _ = require('lodash'),
    React = require('react');

var funcBeginRegEx =  /^\s*function\s*\w*\(([\w,\s]*[\n\/\*]*)\)\s*\{[\s\n]*/, // 'function(a,b,c) { '
    funcEndRegEx = /\s*}\s*$/; // ' } '

function unwrapFuncStr(funcStr) {
    // peel the "function() {}" wrapper off of a function string (to make an 'internal function string')
    return funcStr.replace(funcBeginRegEx, '').replace(funcEndRegEx, '')
}

var FunctionInput = React.createClass({
    getInitialState: function() {
        return { inputValue: function() {} };
    },

    // we're tracking what's displayed in the input (this.state.inputValue)
    // separately from the true state value (this.props.value),
    // so we have to update inputValue state manually when the component mounts
    componentWillMount: function() {
        this.setState({inputValue: unwrapFuncStr(this.props.value.toString()), isValid: true});
    },
    // since these are the only components in the app that can change the functions,
    // we're going to sidestep the problem of comparing functions and not include a componentWillReceiveProps method
    // (see related discussion in input-number.jsx)
    // this means that if anything else changes the function, this input won't get updated with the new state

    isValid: function(newFunc) {
        var isValid = false;
        if(!_.isFunction(newFunc)) return false;
        try {
            var returnVal = newFunc(1,1,1,1); // todo figure out better test
            isValid =  !_.isUndefined(returnVal) && !_.isNaN(returnVal);
        } catch(e) {}
        return isValid;
    },

    onChange: function() { // when user changes input
        var inputValue = event.target.value,
            isValid = false,
            funcValue;

        try {
            // try to make a new function with the input value
            // this is the unsafe bit - executing arbitrary js from a string
            funcValue = Function.apply(this, _.flatten([this.props.funcParams, inputValue]));
            isValid = this.isValid(funcValue);
        } catch(e) { }

        // allow input text to contain whatever value user types in, good or bad...
        this.setState({inputValue: inputValue, isValid: isValid}, function() {
            // ... but only call callback to change app state if it's a valid function
            if(isValid) this.props.onValidChange(funcValue);
            // note setState is asynchronous so we do this in callback to ensure state has updated
        });
    },
    render: function() {
        return (
            <div className={'function-input' + (this.state.isValid ? '' : ' invalid-value')}>
                <div>{this.props.label}</div>
                <div className="function-signature">f({this.props.funcParams.join(', ')})</div>
                <textarea value={this.state.inputValue} onChange={this.onChange} />
            </div>
        );
    }
});

module.exports = FunctionInput;
