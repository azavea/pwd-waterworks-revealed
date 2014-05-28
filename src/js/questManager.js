"use strict";

var _ = require('lodash'),
    BootstrapDialog = require('bootstrap-dialog'),
    cards = require('./cards.js'),
    quests = require('../quests.json');

var STATUS_NOT_STARTED = 1,
    STATUS_STARTED = 2,
    STATUS_FINISHED = 3;

module.exports = {
    init: function (latLngStream) {
        var zoneChangeStream = latLngStream
                .map(getQuestForLatLng)
                .skipDuplicates(),
            zoneDiffProperty = zoneChangeStream.diff(undefined, questDiff);

        zoneChangeStream
            .filter(_.isObject)
            .onValue(inviteToQuest);

        zoneDiffProperty.onValue(cleanupZoneChange);

        cards.deckFinishedStream.onValue(onQuestFinished);

        initStatus();

        return {
            quests: quests,
            zoneDiffProperty: zoneDiffProperty
        };
    }
};

function getQuestForLatLng(latLng) {
    var questOrUndefined = _.find(quests, function(quest) {
            return quest.latLng.distanceTo(latLng) <= quest.radius;
        });
    return questOrUndefined;
};

function questDiff(oldQuest, newQuest) {
    return {
        oldQuest: oldQuest,
        newQuest: newQuest
    };
}

function initStatus() {
    _.each(quests, function (quest) {
        quest.status = STATUS_NOT_STARTED;
    })
}

function onQuestFinished(domId) {
    var id = domId.substring(6),  // strip off leading 'quest_'
        quest = _.find(quests, function (quest) {
        return (quest.id === id);
    });
    if (quest) {
       quest.status = STATUS_FINISHED;
    }
}

function inviteToQuest(quest) {
    var verb = (
            quest.status == STATUS_NOT_STARTED ? 'start' :
            quest.status == STATUS_STARTED ? 'continue' : 'revisit'),
        dialog = new BootstrapDialog({
            title: quest.title + ' &mdash; Quest zone entered!',
            message: 'Would you like to ' + verb + ' the quest?',
            buttons: [
                { label: 'Yes' , action: switchToQuest(quest) },
                { label: 'No', action: closeBootstrapDialog }
            ]
        });
    quest.invitationDialog = dialog;
    dialog.open();
}

function closeBootstrapDialog(dialog) {
    dialog.close();
}

function switchToQuest(quest) {
    return function (dialog) {
        if (quest.status == STATUS_NOT_STARTED) {
            quest.status = STATUS_STARTED;
        }
        dialog.close();
        cards.openDeck('quest_' + quest.id);
    }
}

function cleanupZoneChange(diff) {
    if (diff.oldQuest) {
        diff.oldQuest.invitationDialog.close();
    }
}
