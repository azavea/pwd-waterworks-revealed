'use strict';

var attachFastClick = require('fastclick');
attachFastClick(document.body);

var $ = require('jquery');

module.exports = {
    init: function (options) {
        var questManager = require('./map').init({
            $enableMockButton: $(options.mockLocationSelector)
        });
        require('./intro').init();
        require('./cards').init();
        require('./ui').init({ questManager: questManager });
    }
};
