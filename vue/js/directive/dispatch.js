'use strict';

/**
 * Vue directive that dispatches events to the root VM.
 *
 * @example
 * <!-- Dispatches a 'button-clicked' event when the button is clicked -->
 * <button v-dispatch="click: 'button-clicked'">Button</button>
 */
module.exports = {
  update: function (eventName) {
    this.reset();

    var vm = this.vm;

    this.handler = function () {
      vm.$dispatch(eventName);
    };

    this.el.addEventListener(this.arg, this.handler);
  },

  reset: function () {
    if (this.handler) {
      this.el.removeEventListener(this.arg, this.handler);
    }
  },

  unbind: function () {
    this.reset();
    this.handler = null;
  }
};
