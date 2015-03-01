'use strict';

module.exports = {
  template: require('./template.html'),

  data: function () {
    return {
      growthRate      : 1,

      hormoneSize     : 5,
      hormoneStrength : 15
    };
  },

  components: {
    'hyphae-renderer': require('component/hyphae-renderer')
  }
};
