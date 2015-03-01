'use strict';
var Vue = require('vue');

/**
 * Phyllotaxis renderer that draws circles for each floret.
 *
 * @param {string} color The fill color used when drawing florets
 * @param {array} florets An array of objects representing the points to draw.
 * Each should have an `x` and `y` property
 * @param {number} size The radius of the circles to draw
 */
module.exports = {
  template: require('./template.html'),

  mixins: [
    require('mixin/resize')
  ],

  data: function () {
    return {
      // Canvas dimensions, controlled by the resize mixin
      height  : 1,
      width   : 1,

      // Properties inherited from the parent component. Do not modify.
      color   : 'black',
      florets : [],
      size    : 5,
    };
  },

  methods: {
    /**
     * Draw to the canvas
     */
    draw: function () {
      var canvas = this.$el.getElementsByTagName('canvas')[0];
      var ctx    = canvas.getContext('2d');

      ctx.save();

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.fillStyle = this.color;
      ctx.translate(this.width / 2, this.height / 2);

      for (var i = 0, l = this.florets.length; i < l; i++) {
        var p = this.florets[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();
      }

      ctx.restore();
    },

    /**
     * Schedule a redraw for the next tick.
     *
     * This is necessary when the width or height of the canvas changes
     * because changing the canvas size causes the canvas to be cleared. If we
     * draw immediately in response to new dimensions, the Vue bindings on the
     * width and height attributes are resolved after our draw, and the
     * drawing gets cleared.
     */
    redraw: function () {
      Vue.nextTick(this.draw);
    }
  },

  watch: {
    'color'   : 'draw',
    'florets' : 'draw',
    'size'    : 'draw',

    'width'   : 'redraw',
    'height'  : 'redraw'
  }
};
