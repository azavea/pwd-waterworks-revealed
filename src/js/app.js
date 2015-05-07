'use strict';

var $ = require('jquery');

module.exports = {
    init: function (options) {
        var questManager = require('./map').init({
            $enableMockButton: $(options.mockLocationSelector)
        });
        require('./cards').init();
        require('./ui').init({ questManager: questManager });
    }
};
