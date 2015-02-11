'use strict';

var Input = {
  template: require('template/input.html'),

  paramAttributes: [
    'data-step'
  ],

  data: function () {
    return {
      hasFocus: false,
      step    : 1
    };
  },

  methods: {
    decrement: function () {
      this.value = Number(this.value) - Number(this.step);
    },

    increment: function () {
      this.value = Number(this.value) + Number(this.step);
    }
  }
};

module.exports = Input;
