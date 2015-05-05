"use strict";

var Bacon = require('baconjs'),
    $ = require('jquery');

$.extend($.fn, Bacon.$);

exports.$ = $;
