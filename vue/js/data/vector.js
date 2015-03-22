'use strict';

/**
 * Represent a 2D vector.
 *
 * Based on the PVector implementation in Processing:
 * https://github.com/processing/processing/blob/44248a80d111b1710a4781739327afa18d3593fa/core/src/processing/core/PVector.java
 */
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype = {

  add : function (v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  },

  sub : function (v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  },

  mult : function (n) {
    this.x *= n;
    this.y *= n;

    return this;
  },

  div : function (n) {
    this.x /= n;
    this.y /= n;

    return this;
  },

  mag : function (mag) {
    if (arguments.length < 1) {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    return this.normalize().mult(mag);
  },

  normalize : function () {
    var m = this.mag();

    if (m !== 0 && m !== 1) {
      this.div(m);
    }

    return this;
  },

  distance : function (v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
};

module.exports = Vector;
