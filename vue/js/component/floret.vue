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

  function isValidNumber(n) {
    return typeof n === 'number' &&
      typeof n !== 'undefined' &&
      !isNaN(n) &&
      Math.abs(n) !== Infinity;
  }

  var Floret = {
    replace : true,

    computed: {
      defined: function () {
        return isValidNumber(this.n) &&
          isValidNumber(this.scale) &&
          isValidNumber(this.theta);
      },

      r: function () {
        return this.defined ?
          this.scale * Math.sqrt(this.n) :
          0;
      },

      cx: function () {
        return this.defined ?
          this.r * Math.cos(this.n * this.theta) :
          0;
      },

      cy: function () {
        return this.defined ?
          this.r * Math.sin(this.n * this.theta) :
          0;
      }
    }
  };

  module.exports = Floret;
</script>

