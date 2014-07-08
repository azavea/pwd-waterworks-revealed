'use strict';

var $ = require('jquery'),
    _ = require('lodash');

exports = module.exports = {
    STATUS_NOT_STARTED: 1,
    STATUS_STARTED: 2,
    STATUS_FINISHED: 3,

    noQuestsStarted: function(zone) {
        // Returns true iff no quests have ever been started in this zone
        return !_.contains(zone.status, exports.STATUS_STARTED) && !_.contains(zone.status, exports.STATUS_FINISHED);
    },

    questInProgress: function(zone) {
        // Returns true iff there is a quest in progress in this zone
        return _.contains(zone.status, exports.STATUS_STARTED);
    },

    allQuestsDone: function(zone) {
        // Returns true iff all quests are finished
        return !_.contains(zone.status, exports.STATUS_STARTED) && !_.contains(zone.status, exports.STATUS_NOT_STARTED);
    },

    getCurrentQuest: function(zone) {
        return _.find(zone.quests, function(quest) {
            return zone.status[quest] === exports.STATUS_STARTED;
        });
    }
};
