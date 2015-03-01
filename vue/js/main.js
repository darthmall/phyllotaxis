/* global window */
'use strict';

var Vue         = require('vue');
var page        = require('page');

var phyllotaxis = require('data/phyllotaxis');

Vue.config.debug = true;

/**
 * Create a route to a view component.
 *
 * Returns a function that updates the `currentView` property on a ViewModel
 * with the name of a Vue component.
 * 
 * @param {object} vm The ViewModel
 * @param {string} component The name of a Vue component
 */
function route(vm, component) {
  return function () {
    vm.currentView = component;
  };
}

var DEFAULT = {
  scale : 15,
  angle : 2.39982772,
  age   : 200,
};

new Vue({
  el : '#phyllotaxis',

  data: {
    currentView : 'view-phyllotaxis',

    scale       : DEFAULT.scale,
    angle       : DEFAULT.angle,
    age         : DEFAULT.age,

    step        : 0.0001,
    playing     : false
  },

  created: function () {
    // Set up routing
    page('/', route(this, 'view-phyllotaxis'));
    page('/hyphae', route(this, 'view-hyphae'));
    page();
  },

  attached: function () {
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('click', this.preventFocus);
  },

  computed: {
    florets: function () {
      return phyllotaxis(this.scale, this.angle, this.age).map(function (f) {
        return {
          x: f.r * Math.cos(f.theta),
          y: f.r * Math.sin(f.theta)
        };
      });
    }
  },

  methods: {
    onKeyUp: function (evt) {
      if (evt.keyCode === 32) {
        this.playing = !this.playing;
      }
    },

    onKeyDown: function (evt) {
      switch (evt.keyCode) {
        // Left
        case 37:
          this.angle -= this.step;
          break;

        // Up
        case 38:
          this.age++;
          break;

        // Right
        case 39:
          this.angle += this.step;
          break;

        // Down
        case 40:
          this.age--;
          break;

        default:
          break;
      }
    },

    preventFocus: function (evt) {
      // Prevent buttons from keeping focus, otherwise the space bar
      // accelerator will activate the button, too
      if (evt.target.tagName.toLowerCase() === 'button') {
        evt.target.blur();
      }
    }
  },

  events: {
    'save-settings': function () {
      // FIXME
    },

    'reset': function () {
      this.angle = DEFAULT.angle;
      this.scale = DEFAULT.scale;
      this.age   = DEFAULT.age;
    }
  },

  components: {
    'view-phyllotaxis'    : require('view/phyllotaxis'),
    'view-hyphae'         : require('view/hyphae'),

    'phyllotaxis-stepper' : require('component/stepper'),
  },

  directives: {
    'dispatch' : require('directive/dispatch')
  }
});
