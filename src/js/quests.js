"use strict";

var Bacon = require('baconjs'),
    $ = require('jquery');

function setupQuests(tourMap) {
    questDetailsStream().onValue(tourMap.setQuestZones);
}

function questDetailsStream() {
    return Bacon.fromPromise($.getJSON('quests.json'))
        .mapError(function(e) { alert(e);});
}

module.exports = {
    init: setupQuests
};
