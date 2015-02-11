'use strict';

var Floret = {
  replace : true,
  template: require('template/floret.html'),

  computed: {
    r: function () {
      return this.scale * Math.sqrt(this.n);
    },

    cx: function () {
      return this.r * Math.cos(this.n * this.theta);
    },

    cy: function () {
      return this.r * Math.sin(this.n * this.theta);
    }
  }
};

module.exports = Floret;
