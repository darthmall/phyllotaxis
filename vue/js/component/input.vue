<template>
  <label>
    <span v-class="focused: hasFocus">
      <content></content>
    </span>

    <input
      type="text"
      v-model="value"
      v-on="
        keyup: decrement | key down,
        keyup: increment | key up,
        focus: hasFocus = true,
        blur: hasFocus = false"
      number>
  </label>
</template>

<script>
  'use strict';

  var Input = {
    paramAttributes: [
      'data-step'
    ],

    data: function () {
      return {
        hasFocus: false,
        step    : 1
      };
    },

    methods: {
      decrement: function () {
        this.value = Number(this.value) - Number(this.step);
      },

      increment: function () {
        this.value = Number(this.value) + Number(this.step);
      }
    }
  };

  module.exports = Input;
</script>
