/* global window */

'use strict';

var d3 = require('d3');

function degrees(rad) {
  return rad * 180 / Math.PI;
}

module.exports = {
  template : require('./template.html'),

  data: function () {
    return {
      // Rendering
      renderer    : 'phyllotaxis-canvas-renderer',
      colored     : false,
      floretColor : '#333333',
      floretSize  : 5
    };
  },

  methods: {
    animate: function () {
      if (this.playing) {
        this.angle      += this.step;
        this.floretColor = this.colored ?
          d3.hsl(degrees(this.angle), 0.5, 0.5).toString() :
          '#333333';

        window.requestAnimationFrame(this.animate);
      }
    },
  },

  watch: {
    'colored': function () {
      this.floretColor = this.colored ?
        d3.hsl(degrees(this.angle), 0.5, 0.5).toString() :
        '#333333';
    },

    'playing': 'animate'
  },

  components: {
    'phyllotaxis-svg-renderer'    : require('component/svg-renderer'),
    'phyllotaxis-canvas-renderer' : require('component/canvas-renderer'),
    'phyllotaxis-line-renderer'   : require('component/line-renderer')
  }
};
