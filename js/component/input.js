'use strict';

var Input = {
  template: require('template/input.html'),

  paramAttributes: [
    'data-step'
  ],

  data: function () {
    return {
      step: 1
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
