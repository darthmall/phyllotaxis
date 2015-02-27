'use strict';

function PhylloIter(phyllotaxis) {
  this.age = 0;

  this.next = function () {
    if (this.age >= phyllotaxis.size) {
      return;
    }

    return phyllotaxis.get(this.age++);
  };
}

function Phyllotaxis(scale, angle, size) {
  this.scale = scale;
  this.angle = angle;
  this.size  = size;

  Object.defineProperty(this, 'iter', {
    get: function () {
      return new PhylloIter(this);
    }
  });
}

Phyllotaxis.prototype.get = function (age) {
  if (age >= this.size) {
    return;
  }

  var r     = this.scale * Math.sqrt(age);
  var theta = this.angle * age;

  return {
    x : r * Math.cos(theta),
    y : r * Math.sin(theta)
  };
};

module.exports = Phyllotaxis;
