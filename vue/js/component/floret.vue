<template>
  <circle
    class="floret"
    v-attr="
      cx: cx,
      cy: cy,
      r : size"
    v-style="fill: fill">
  </circle>
</template>

<script>
  'use strict';

  var Floret = {
    replace : true,

    computed: {
      r: function () {
        return this.scale * Math.sqrt(this.n);
      },

      cx: function () {
        return this.r * Math.cos(this.n * this.theta);
      },

      cy: function () {
        return this.r * Math.sin(this.n * this.theta);
      }
    }
  };

  module.exports = Floret;
</script>

