"use strict";

var $ = require('jquery'),
    _ = require('lodash');

var _templates = {};

module.exports = {
    init: function () {
        $("script[type='text/template']").each(function () {
            var id = $(this).attr('id'),
                html = $(this).html();
            if (_templates[id]) {
                throw ("Duplicate template name: " + id);
            } else {
                _templates[id] = _.template($.trim(html));
            }
        });
    },

    get: function (templateId) {
        return _templates[templateId];
    }
};
