"use strict";

var $ = require('jquery'),
    _ = require('lodash'),
    Bacon = require('baconjs'),
    fileReader = require('./fileReader'),
    questContentTemplate = require('../templates/quest-content.ejs'),
    quests = require('../quests.json');

module.exports = {
    loadHtml: function () {
        var allQuestsLoadedStream = Bacon.combineAsArray(_.map(quests, loadQuest));
        return allQuestsLoadedStream;
    }
};

function loadQuest(quest) {
    var questLoadedStream = Bacon.fromCallback(function (pushToStream) {

        var htmlPath = 'quests/' + quest.id + '/index.html';

        fileReader.readAsText(htmlPath, onFail, function (questHtml) {
            var html = questContentTemplate({ id: quest.id, html: questHtml });
            $('#map').append(html);

            pushToStream();
        });
    })
    return questLoadedStream;
}

function onFail(evt) {
    console.log(evt.target.error.code);
}
