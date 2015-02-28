'use strict';

var SVGCanvas = {

  mixins: [
    require('mixin/resize')
  ],

  data: function () {
    return {
      height : 1,
      width  : 1,
    };
  },

  computed: {
    florets: function () {
      var f = new Array(this.floretCount);

      for (var i = 0, l = this.floretCount; i < l; i++) {
        f[i] = { n: i + 1 };
      }

      return f;
    }
  },

  components: {
    'phyllotaxis-floret': require('./floret')
  }
};

module.exports = SVGCanvas;
