"use strict";

var $ = require('jquery'),
    _ = require('lodash'),
    Bacon = require('baconjs'),
    fileReader = require('./fileReader');

module.exports = {
    loadHtmlStream: function(path, templateFn, context) {
        context = context || {};
        templateFn = templateFn || _.identity;

        var templateLoadedStream = Bacon.fromCallback(function (pushToStream) {
            var onFail = function(evt) {
                pushToStream(new Bacon.Error(evt));
            };

            fileReader.readAsText(path, onFail, function (innerHtml) {
                context.html = innerHtml;
                var html = templateFn(context);
                pushToStream(html);
            });
        });

        return templateLoadedStream;
    }
};
