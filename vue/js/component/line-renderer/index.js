'use strict';

var LineRenderer = {
  mixins: [
    require('component/canvas-renderer')
  ],

  methods: {
    draw: function () {
      if (this.florets.length < 1) {
        return;
      }

      var canvas = this.$el.getElementsByTagName('canvas')[0];
      var ctx    = canvas.getContext('2d');

      ctx.save();

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.strokeStyle = this.color;
      ctx.translate(this.width / 2, this.height / 2);


      var p = this.florets[0];

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);

      for (var i = 1, l = this.florets.length; i < l; i++) {
        p = this.florets[i];
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();

      ctx.restore();
    }
  }
};

module.exports = LineRenderer;
