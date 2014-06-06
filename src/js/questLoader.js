"use strict";

var $ = require('jquery'),
    _ = require('lodash'),
    fileReader = require('./fileReader'),
    templates = require('./templates'),
    quests = require('../quests.json');

module.exports = {
    loadHtml: function () {
        _.map(quests, loadQuest);
    }
};

function loadQuest(quest) {
    var htmlPath = 'quests/' + quest.id + '/index.html';
    fileReader.readAsText(htmlPath, onFail, function (cardsHtml) {
        var template = templates.get('template-quest-content'),
            html = template({ id: quest.id, html: cardsHtml });
        $('#map').append(html);
    });
}

function onFail(evt) {
    console.log(evt.target.error.code);
}
