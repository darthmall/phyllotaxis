'use strict';

var CanvasRenderer = {
  template: require('./template.html'),

  mixins: [
    require('mixin/resize')
  ],

  data: function () {
    return {
      height : 1,
      width  : 1,

      color  : 'black',
      size   : 0,
      system : null,
    };
  },

  methods: {
    draw: function () {
      if (!(this.system && this.size)) {
        return;
      }

      var canvas = this.$el.getElementsByTagName('canvas')[0];
      var ctx    = canvas.getContext('2d');

      ctx.save();

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.fillStyle = this.color;
      ctx.translate(this.width / 2, this.height / 2);

      for (var iter = this.system.iter, p = iter.next(); p; p = iter.next()) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }

      ctx.restore();
    }
  },

  events: {
    'draw' : 'draw'
  },

  watch: {
    'height' : 'draw',
    'width'  : 'draw',
    'system' : 'draw',
    'size'   : 'draw',
    'color'  : 'draw'
  }
};

module.exports = CanvasRenderer;
