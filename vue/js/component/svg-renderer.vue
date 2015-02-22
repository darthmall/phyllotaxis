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
  data: {
    height : 1,
    width  : 1,
  },

  ready: function () {
    window.addEventListener('resize', this);
    this.onResize();
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

  methods: {
    handleEvent: function (evt) {
      switch (evt.type) {
        case 'resize':
          this.onResize();
          break;

        default:
          break;
      }
    },

    onResize: function () {
      var parent = this.$el.parentElement;

      this.width  = parent.clientWidth;
      this.height = parent.clientHeight;
    }
  },

  components: {
    'phyllotaxis-floret': require('component/floret.vue')
  }
};

module.exports = SVGCanvas;
</script>
