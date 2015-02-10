/* global window */
'use strict';

var Vue = require('vue');

var Phyllotaxis = {
  el      : '#phyllotaxis',
  template: require('template/phyllotaxis.html'),

  data: {
    floretSize: 5,
    theta: 2.39982772,
    scale: 15,
    floretCount: 200,
    floretColor: '#333333',
    width: 0,
    height: 0,
    step: 0.0001,
    fps: 60,
    playing: false
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
        this.theta += this.step;

        window.requestAnimationFrame(this.animate);
      }
    }
  },

  components: {
    'phyllotaxis-floret': require('component/floret'),
    'phyllotaxis-input' : require('component/input')
  }
};

new Vue(Phyllotaxis);
