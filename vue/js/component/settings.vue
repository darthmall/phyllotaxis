<template>
  <fieldset>
    <legend>Phyllotaxis</legend>
    <div
       v-component="phyllotaxis-input"
       v-with="value: scale">
       Scale
     </div>

     <div
       v-component="phyllotaxis-input"
       v-with="value: angle"
       data-step="0.0001">
       Angle
     </div>
  </fieldset>

  <fieldset>
    <legend>Florets</legend>
    <div
      v-component="phyllotaxis-input"
      v-with="value: size">
      Count
    </div>

    <div
      v-component="phyllotaxis-input"
      v-with="value: floretSize">
      Size
    </div>

    <label>
      <input
        type="checkbox"
        v-model="colored">
      Colored
    </label>
  </fieldset>

  <fieldset>
    <legend>Animation</legend>
    <select v-model="renderer">
      <option value="phyllotaxis-canvas-renderer">Canvas</option>
      <option value="phyllotaxis-svg-renderer">SVG</option>
    </select>

    <div
      v-component="phyllotaxis-input"
      v-with="value: step"
      data-step="0.0001">
      Step
    </div>
  </fieldset>
</template>

<script>
  'use strict';

  var Settings = {
    inherit: true
  };

  module.exports = Settings;
</script>
