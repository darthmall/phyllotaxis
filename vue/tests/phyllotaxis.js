'use strict';

var Phyllotaxis = require('system/phyllotaxis');
var should      = require('should')

describe('phyllotaxis', function () {
  it('should accept negative sizes', function () {
    var phyllo = new Phyllotaxis(0, 1, -1);

    phyllo.size.should.be.exactly(-1);
    (phyllo.get(0) === undefined).should.be.true;
  });

  it('should create distinct iterators', function () {
    var phyllo = new Phyllotaxis(0, 1, 10);
    var it1 = phyllo.iter;
    var it2 = phyllo.iter;

    it1.age.should.be.exactly(0);
    it2.age.should.be.exactly(0);

    it1.next();

    it1.age.should.be.exactly(1);
    it2.age.should.be.exactly(0);
  });

  it('should return `size` points', function () {
    var phyllo = new Phyllotaxis(0, 1, 10);
    var count = 0;
    var it = phyllo.iter;

    for (var p = it.next(); p; p = it.next()) {
      count++;
    }

    count.should.be.exactly(10);
  });

  it('should accept angles larger than 2*pi');
  it('should accept negative angles');
  it('should accept negative scales');

  describe('points', function () {
    it('should have an x and a y property', function () {
      var phyllo = new Phyllotaxis(0, 1, 1);
      var point = phyllo.get(0);

      point.should.have.property('x');
      point.should.have.property('y');
    });
  });
});
