'use strict';

module.exports = function phyllotaxis(scale, angle, age) {
  var florets = new Array(age);
  for (var i = 0; i < age; i++) {
    florets[i] = {
      r     : scale * Math.sqrt(i),
      theta : angle * i
    };
  }

  return florets;
};
