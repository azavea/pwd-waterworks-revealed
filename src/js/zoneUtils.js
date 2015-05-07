'use strict';

var $ = require('jquery'),
    _ = require('lodash');

exports = module.exports = {
    STATUS_NOT_STARTED: 1,
    STATUS_FINISHED: 2,

    zoneFinished: function(zone) {
        return zone && zone.status === exports.STATUS_FINISHED;
    },

    zoneNotFinished: function(zone) {
        return zone && zone.status !== exports.STATUS_FINISHED;
    }
};
