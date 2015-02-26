/* global window */
'use strict';

var Vue = require('vue');
var d3  = require('d3');

function degrees(rad) {
  return rad * 180 / Math.PI;
}

var Phyllotaxis = {
  el       : '#phyllotaxis',

  data: {
    // Computation inputs
    scale        : 15,
    theta        : 2.39982772,
    floretCount  : 200,

    // Rendering
    renderer     : 'phyllotaxis-canvas-renderer',
    colored      : false,
    floretColor  : '#333333',
    floretSize   : 5,

    // Animation
    fps          : 60,
    lastFrame    : 0,
    playing      : false,
    step         : 0.0001
  },

  attached: function () {
    window.addEventListener('keyup', this);
  },

  methods: {
    handleEvent: function (evt) {
      switch (evt.type) {
        case 'keyup':
          if (evt.keyCode === 32) {
            this.playing = !this.playing;
            this.animate();
          }
          break;

        default:
          break;
      }
    },

    animate: function () {
      if (this.playing) {
        var now     = (new Date()).getTime();
        var elapsed = now - this.lastFrame;
        var mspf    = 1000 / this.fps;

        if (elapsed >= mspf) {
          this.lastFrame   = now;
          this.theta      += this.step;
          this.floretColor = this.colored ?
            d3.hsl(degrees(this.theta), 0.5, 0.5).toString() :
            '#333333';
        }

        window.requestAnimationFrame(this.animate);
      }
    }
  },

  watch: {
    'colored': function () {
      this.floretColor = this.colored ?
        d3.hsl(degrees(this.theta), 0.5, 0.5).toString() :
        '#333333';
    }
  },

  components: {
    'phyllotaxis-input'           : require('component/input.vue'),
    'phyllotaxis-settings'        : require('component/settings.vue'),
    'phyllotaxis-svg-renderer'    : require('component/svg-renderer.vue'),
    'phyllotaxis-canvas-renderer' : require('component/canvas-renderer.vue')
  }
};

new Vue(Phyllotaxis);
