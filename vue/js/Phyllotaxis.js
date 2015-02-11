/* global window */
'use strict';

var Vue = require('vue');
var d3  = require('d3');

function degrees(rad) {
  return rad * 180 / Math.PI;
}

var Phyllotaxis = {
  el      : '#phyllotaxis',
  template: require('template/phyllotaxis.html'),

  data: {
    // Computation inputs
    scale      : 15,
    theta      : 2.39982772,
    floretCount: 200,

    // Canvas
    width      : 0,
    height     : 0,

    // Rendering
    colored    : false,
    floretColor: '#333333',
    floretSize : 5,

    // Animation
    fps        : 60,
    playing    : false,
    step       : 0.0001
  },

  attached: function () {
    window.addEventListener('resize', this);
    window.addEventListener('keyup', this);
    this.onResize();
  },

  computed: {
    florets: function () {
      var f = new Array(this.floretCount);

      for (var i = 0, l = this.floretCount; i < l; i++) {
        f[i] = { n: i + 1 };
      }

      return f;
    }
  },

  methods: {
    handleEvent: function (evt) {
      switch (evt.type) {
      case 'resize':
        this.onResize();
        break;

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

    onResize: function () {
      this.width  = window.innerWidth;
      this.height = window.innerHeight;
    },

    animate: function () {
      if (this.playing) {
        this.theta      += this.step;
        this.floretColor = this.colored ?
          d3.hsl(degrees(this.theta), 0.5, 0.5).toString() :
          '#333333';

        window.requestAnimationFrame(this.animate);
      }
    }
  },

  watch: {
    'colored': function () {
      console.log(degrees(this.theta));
      this.floretColor = this.colored ?
        d3.hsl(degrees(this.theta), 0.5, 0.5).toString() :
        '#333333';
    }
  },

  components: {
    'phyllotaxis-floret': require('component/floret'),
    'phyllotaxis-input' : require('component/input')
  }
};

new Vue(Phyllotaxis);
