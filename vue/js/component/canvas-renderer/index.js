'use strict';
var Vue = require('vue');

module.exports = {
  template: require('./template.html'),

  mixins: [
    require('mixin/resize')
  ],

  data: function () {
    return {
      height  : 1,
      width   : 1,

      florets : [],
      color   : 'black',
      size    : 5,
      system  : null,
    };
  },

  methods: {
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
