<template>
  <canvas
    v-attr="width  : width,
            height : height">
  </canvas>
</template>

<script>
'use strict';

var CanvasRenderer = {
  mixins: [
    require('mixin/resize')
  ],

  data: function () {
    return {
      height : 1,
      width  : 1
    };
  },

  methods: {
    draw: function () {
      if (!(this.theta && this.floretCount && this.floretSize && this.scale)) {
        return;
      }
      console.debug('draw');
      
      var canvas = this.$el.getElementsByTagName('canvas')[0];
      var ctx    = canvas.getContext('2d');

      ctx.save();

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.fillStyle = 'black';
      ctx.translate(this.width / 2, this.height / 2);

      for (var i = 0; i < this.floretCount; i++) {
        var r = this.scale * Math.sqrt(i);
        var x = r * Math.cos(i * this.theta);
        var y = r * Math.sin(i * this.theta);

        ctx.beginPath();
        ctx.arc(x, y, this.floretSize, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }

      ctx.restore();
    }
  },

  watch: {
    'floretCount' : 'draw',
    'floretSize'  : 'draw',
    'scale'       : 'draw',
    'theta'       : 'draw'
  }
};

module.exports = CanvasRenderer;
</script>
