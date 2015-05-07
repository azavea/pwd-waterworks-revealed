'use strict';

var $ = require('jquery');

module.exports = {
    init: function (options) {
        require('./ui').init();
        require('./cards').init();
        require('./map').init({
            $enableMockButton: $(options.mockLocationSelector)
        });
    }
};
