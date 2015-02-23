'use strict';

var floret = require('component/floret.vue');
var should = require('should');

describe('floret', function () {
  it('should replace the contents of it\'s element', function () {
    floret.replace.should.be.true;
  });

  describe('#defined', function () {
    it('should be false if any data is missing', function () {
      floret.computed.defined().should.be.false;
    });

    it('should be false if any data is non-numeric', function () {
      var context = {
        n     : 1,
        scale : 1,
        theta : '1'
      };

      floret.computed.defined.call(context).should.be.false;
    });

    it('should be false if any data is Infinity', function () {
      var context = {
        n: Infinity,
        scale: 1,
        theta: 1
      };

      floret.computed.defined.call(context).should.be.false;

      context.n = -Infinity;

      floret.computed.defined.call(context).should.be.false;
    });

    it('should be false if any data is undefined', function () {
      var context = {
        n     : 1,
        theta : 1
      };

      floret.computed.defined.call(context).should.be.false;
    });

    it('should be true when all data is numeric', function () {
      var context = {
        n     : 1,
        scale : 1,
        theta : 1
      };

      floret.computed.defined.call(context).should.be.true;
    });
  });

  describe('#r', function () {
    it('should be 0 when defined is false', function () {
      var context = { defined: false };
      floret.computed.r.call(context).should.be.exactly(0);
    });
  });

  describe('#cx', function () {
    it('should be 0 when defined is false', function () {
      var context = { defined: false };
      floret.computed.cx.call(context).should.be.exactly(0);
    });
  });

  describe('#cy', function () {
    it('should be 0 when defined is false', function () {
      var context = { defined: false };
      floret.computed.cy.call(context).should.be.exactly(0);
    });
  });
});
