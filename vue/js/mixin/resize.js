/* global window */
'use strict';

var Resize = {
  ready: function () {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  methods: {
    onResize: function () {
      this.height = this.$el.clientHeight;
      this.width  = this.$el.clientWidth;
    }
  }
};

module.exports = Resize;
