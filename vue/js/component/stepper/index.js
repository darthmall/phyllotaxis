'use strict';

var Stepper = {
  replace  : true,
  template : require('./template.html'),

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
      this.$event.stopPropagation();
    },

    increment: function (evt) {
      this.value = Number(this.value) + Number(this.step);
      this.$event.stopPropagation();
    }
  }
};

module.exports = Stepper;
