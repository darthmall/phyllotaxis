/* global window */
'use strict';

var _      = require('lodash');
var util   = require('utilities');
var hyphae = require('data/hyphae');

module.exports = {
  template: require('./template.html'),

  data: function () {
    return {
      growthRate      : 1,

      hormoneSize     : 5,
      hormoneStrength : 15,

      height          : 1,
      width           : 1
    };
  },

  ready: function () {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  methods: {
    draw: function () {
      if (!this.$$.canvas) {
        return;
      }

      var ctx = this.$$.canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.save();

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.translate(this.width / 2, this.height / 2);

      if (this.playing) {
        this.drawVeins(ctx);
      } else {
        this.drawHormones(ctx);
      }

      ctx.restore();
    },

    drawHormones : function (ctx) {
      for (var i = 0, l = this.florets.length; i < l; i++) {
        var p = this.florets[i];

        // Draw the hormone
        ctx.fillStyle = this._veins[i] ? '#F5BB28' : '#333';
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.hormoneSize, 0, Math.PI * 2, false);
        ctx.fill();

        // Draw the field of influence for the hormone
        if (this.hormoneStrength > this.hormoneSize) {
          ctx.save();
          ctx.globalAlpha *= 0.1;
          ctx.arc(p.x, p.y, this.hormoneStrength, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.restore();
        }
      }
    },

    drawVeins : function (ctx) {
      ctx.save();

      ctx.strokeStyle = '#333';
      ctx.beginPath();

      _.forEach(this._veins, function (vein) {
        vein.forBranches(function (line) {
          ctx.moveTo(line[0].x, line[0].y);
          ctx.lineTo(line[1].x, line[1].y);
        });
      });

      ctx.stroke();

      ctx.restore();
    },

    grow: function () {
      if (_.size(this._veins) < 1) {
        this.playing = false;
        return;
      }

      // Keep track of the dead hormones so we can remove them later
      var dead = [];

      var self = this;

      // Find which hormones are influencing the new growth
      _.forEach(this._hormones, function (h, i) {
        var neighbor = h.findNeighbor(_.values(self._veins));

        if (h.p.distance(neighbor.p) < self.hormoneSize) {
          dead.push(i);
        } else {
          neighbor.addSource(h);
        }
      });

      _.forEach(this._veins, function (v) {
        v.grow(self.growthRate);
      });

      // Remove dead hormones
      this._hormones = _.omit(this._hormones, dead);

      this.draw();

      if (_.size(this._hormones) > 0 && this.playing) {
        window.requestAnimationFrame(this.grow);
      } else {
        console.log('done!');
      }
    },

    onResize: function () {
      var el = this.$$.container;

      this.height = el.clientHeight;
      this.width  = el.clientWidth;

      this.draw();
    },

    onClick: function () {
      if (this.playing) {
        return;
      }

      var p = {
        x : this.$event.clientX - (this.width / 2),
        y : this.$event.clientY - (this.height / 2)
      };

      var self = this;

      this.florets.forEach(function (f, i) {
        if (util.dist(p, f) < self.hormoneSize) {
          if (i in self._veins) {
            // Toggle a vein to a hormone
            var v = self._veins[i];

            self._hormones[i] = new hyphae.Hormone(v.p.x, v.p.y);
            delete self._veins[i];
          } else {
            // Toggle a hormone to a vein
            var h = self._hormones[i];

            self._veins[i] = new hyphae.Vein(h.p.x, h.p.y);
            delete self._hormones[i];
          }
        }
      });

      this.draw();
    },

    'reset' : function () {
      this._veins    = {};
      this._hormones = _(this.florets)
        .map(function (f) {
          return new hyphae.Hormone(f.x, f.y);
        })
        .thru(function (hormones) {
          var index = {};

          for (var i = hormones.length - 1; i >= 0; i--) {
            index[i] = hormones[i];
          }

          return index;
        })
        .value();

      this.growing = false;

      this.draw();
    }
  },

  watch: {
    'florets' : 'reset',
    'playing' : 'grow'
  },

  components: {
    'hormone-renderer': require('component/hormone-renderer')
  }
};
