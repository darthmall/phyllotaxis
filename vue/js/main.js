/* global window */
'use strict';

var Vue         = require('vue');
var d3          = require('d3');

var Phyllotaxis = require('system/phyllotaxis');

Vue.config.debug = true;

function degrees(rad) {
  return rad * 180 / Math.PI;
}

var DEFAULT = {
  scale : 15,
  angle : 2.39982772,
  size  : 200,
};

var Phyllotaxis = {
  el       : '#phyllotaxis',

  data: {
    system       : new Phyllotaxis(DEFAULT.scale, DEFAULT.angle, DEFAULT.size),

    // Computation inputs
    scale        : DEFAULT.scale,
    angle        : DEFAULT.angle,
    size         : DEFAULT.size,

    // Rendering
    renderer     : 'phyllotaxis-canvas-renderer',
    colored      : false,
    floretColor  : '#333333',
    floretSize   : 5,

    // Animation
    lastFrame    : 0,
    playing      : false,
    step         : 0.0001
  },

  attached: function () {
    window.addEventListener('keyup', this);
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

    handleEvent: function (evt) {
      switch (evt.type) {
        case 'keyup':
          if (evt.keyCode === 32) {
            this.$emit('toggle-play');
          }
          break;

        default:
          console.debug('key:', evt.keyCode);
          break;
      }
    },

    reset: function () {
      this.angle = DEFAULT.angle;
      this.scale = DEFAULT.scale;
      this.size  = DEFAULT.size;
    }
  },

  events: {
    'toggle-play': function () {
      this.playing = !this.playing;
      this.animate();
    },

    'save-settings': function () {
    }
  },

  watch: {
    'colored': function () {
      this.floretColor = this.colored ?
        d3.hsl(degrees(this.angle), 0.5, 0.5).toString() :
        '#333333';
    },

    'angle': function () {
      this.system.angle = this.angle;
      this.$broadcast('draw');
    },

    'scale': function () {
      this.system.scale = this.scale;
      this.$broadcast('draw');
    },

    'size': function () {
      this.system.size = this.size;
      this.$broadcast('draw');
    }
  },

  components: {
    'phyllotaxis-stepper'         : require('component/stepper'),
    'phyllotaxis-settings'        : require('component/settings'),
    'phyllotaxis-svg-renderer'    : require('component/svg-renderer'),
    'phyllotaxis-canvas-renderer' : require('component/canvas-renderer'),
    'phyllotaxis-line-renderer'   : require('component/line-renderer')
  },

  directives: {
    'dispatch' : require('directive/dispatch')
  },
};

new Vue(Phyllotaxis);
