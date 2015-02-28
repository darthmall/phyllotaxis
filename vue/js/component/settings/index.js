'use strict';

var Settings = {
  template : require('./template.html'),
  inherit  : true,

  methods: {
    preventFocus: function (el) {
      el.blur();
    }
  }
};

module.exports = Settings;
