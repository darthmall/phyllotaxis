<template>
  <svg v-attr="viewBox: '0 0 ' + width + ' ' + height">

    <g v-attr="transform: 'translate(' + width/2 + ',' + height/2 + ')'">
      <circle
        v-repeat="florets"
        v-component="phyllotaxis-floret"
        v-with="
          size : floretSize,
          theta: theta,
          scale: scale,
          fill : floretColor">
      </circle>
    </g>
  </svg>
</template>

<script>
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
    'phyllotaxis-floret': require('component/floret.vue')
  }
};

module.exports = SVGCanvas;
</script>
