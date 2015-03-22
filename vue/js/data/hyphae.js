'use strict';

var Vector = require('./vector');

/**
 * Represent a hormone in a Hyphae growth simulation.
 */
function Hormone(x, y) {
  this.p = new Vector(x, y);
}

Hormone.prototype = {

  /**
   * Return the nearest vein to this hormone.
   *
   * @param {Vein[]} veins
   * @return {Vein}
   */
  findNeighbor : function (veins) {
    var distance = Infinity;
    var neighbor = null;
    var q        = veins.slice();

    while (q.length > 0) {
      var v = q.shift()
      var d = this.p.distance(v.p);

      if (d < distance) {
        distance = d;
        neighbor = v;
      }

      q.push.apply(q, v.branches);
    }

    return neighbor;
  }

};

/**
 * Represent a vein in a Hyphae growth simulation.
 */
function Vein(x, y) {
  this.p         = new Vector(x, y);
  this.direction = new Vector();
  this.sources   = 0;
  this.branches  = [];
}

Vein.prototype = {

  addSource : function (hormone) {
    var delta = new Vector();
    this.direction.add(delta.add(hormone.p).sub(this.p));
    this.sources++;

    return this;
  },

  grow : function (growthRate) {
    var growth = [];

    this.direction.mag(growthRate);

    for (var i = this.branches.length - 1; i >= 0; i--) {
      growth = growth.concat(this.branches[i].grow(growthRate));
    }

    if (this.sources > 0) {
      var v = new Vein(
        this.p.x + this.direction.x,
        this.p.y + this.direction.y
      );

      // Reset everything once we're done growing
      this.direction = new Vector();
      this.sources   = 0;

      // Check each of our branches; if our new growth is the same as an
      // existing branch, bail out.
      for (var i = this.branches.length - 1; i >= 0; i--) {
        if (v.equals(this.branches[i])) {
          return growth;
        }
      }

      growth.push(v);
      this.branches.push(v);
    }

    return growth;
  },

  forBranches : function (fn) {
    for (var i = this.branches.length - 1; i >= 0; i--) {
      var branch = this.branches[i];

      fn([this.p, branch.p]);

      branch.forBranches(fn);
    }

    return this;
  },

  equals : function (v) {
    return this.p.x === v.p.x && this.p.y === v.p.y;
  }
};

module.exports = {
  Hormone : Hormone,
  Vein    : Vein
};
