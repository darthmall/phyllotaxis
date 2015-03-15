'use strict';

var util = require('utilities');

module.exports = {
  template: require('./template.html'),

  mixins: [
    require('mixin/resize')
  ],

  data: function () {
    return {
      height   : 1,
      width    : 1,

      strength : 0
    };
  },

  ready: function () {
    var canvas = this.$el.getElementsByTagName('canvas')[0];

    this._ctx  = canvas.getContext('2d');
    this.draw();
  },

  methods: {
    onClick: function () {
      var p = {
        x : this.$event.clientX - (this.width / 2),
        y : this.$event.clientY - (this.height / 2)
      };

      var selected   = [];
      var deselected = [];

      var self = this;

      this.florets.forEach(function (f) {
        if (util.dist(p, f) < self.size) {
          f.selected = !f.selected;

          if (f.selected) {
            selected.push(f);
          } else {
            deselected.push(f);
          }
        }
      });

      if (selected.length > 0) {
        this.$dispatch('hormone-selected', selected);
      }

      if (deselected.length > 0) {
        this.$dispatch('hormone-deselected', deselected);
      }

      this.draw();
    },

    draw: function () {
      var ctx = this._ctx;

      if (!ctx) {
        return;
      }

      ctx.save();

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.translate(this.width / 2, this.height / 2);

      for (var i = 0, l = this.florets.length; i < l; i++) {
        var p = this.florets[i];

        // Draw the hormone
        ctx.fillStyle = p.selected ? '#F5BB28' : '#76C1DC';
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();

        // Draw the field of influence for the hormone
        if (this.strength > this.size) {
          ctx.save();
          ctx.globalAlpha *= 0.1;
          ctx.arc(p.x, p.y, this.strength, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore();
    }
  },

  watch: {
    'strength' : 'draw'
  }
};
