'use strict';

module.exports = {
  template: require('./template.html'),

  data: function () {
    return {
      growing: false,
      growthRate: 1,
    };
  },

  components: {
    'hyphae-renderer': require('component/hyphae-renderer')
  }
};
