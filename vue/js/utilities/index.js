'use strict';

/**
 * Return the Euclidean distance between a and b
 *
 * a and b are expected to have an x and a y property.
 *
 * @param {Object} a
 * @param {Object} b
 */
function dist(a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;

  return Math.sqrt(dx*dx + dy*dy);
}

module.exports = {
  dist : dist
};
