'use strict';

var LineRenderer = {
  template: require('./canvas-renderer.html'),

  mixins: [
    require('mixin/resize')
  ],

  data: function () {
    return {
      height : 0,
      width  : 0,
      system : null,
      size   : 0
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

      ctx.strokeStyle = this.color;
      ctx.translate(this.width / 2, this.height / 2);

      var iter = this.system.iter;
      var p    = iter.next();

      if (!p) {
        return;
      }

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      p = iter.next();

      while (p) {
        ctx.lineTo(p.x, p.y);
        p = iter.next();
      }

      ctx.stroke();

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

module.exports = LineRenderer;
