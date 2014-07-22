"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    BootstrapDialog = require('bootstrap-dialog'),
    cards = require('./cards'),
    questUtils = require('./questUtils'),
    zones = require('../zones.json');

module.exports = {
    init: function (latLngStream) {
        var zoneChangeStream = latLngStream
                .map(getZoneForLatLng)
                .skipDuplicates(),
            zoneDiffProperty = zoneChangeStream.diff(undefined, zoneDiff);

        zoneChangeStream
            .filter(_.isObject)
            .onValue(inviteToZone);

        zoneDiffProperty.onValue(cleanupZoneChange);

        cards.deckFinishedStream.onValue(onQuestFinished);

        initStatus();

        return {
            zones: zones,
            zoneDiffProperty: zoneDiffProperty
        };
    }
};

function getZoneById(id) {
    return _.find(zones, function (zone) {
        return (zone.id === id);
    });
}

function getZoneForLatLng(latLng) {
    var zoneOrUndefined = _.find(zones, function(zone) {
            return zone.latLng.distanceTo(latLng) <= zone.radius;
        });
    return zoneOrUndefined;
}

function zoneDiff(oldZone, newZone) {
    return {
        oldZone: oldZone,
        newZone: newZone
    };
}

function initStatus() {
    _.each(zones, function (zone) {
        zone.status = _.object(_.map(zone.quests, function(questCategory) {
            return [questCategory, questUtils.STATUS_NOT_STARTED];
        }));
    });
}

function onQuestFinished($deck) {
    var zoneId = $deck.attr('data-zone'),
        questCategory = $deck.attr('data-quest'),
        zone = getZoneById(zoneId);
    if (zone) {
        zone.status[questCategory] = questUtils.STATUS_FINISHED;
    }
}

function inviteToZone(zone) {
    var verb = (
            questUtils.noQuestsStarted(zone) ? 'You found a new area! Do you want to explore the ' + zone.title + '?' :
            questUtils.questInProgress(zone) ? 'You have incomplete quests at the ' + zone.title + '. Continue exploring this location?' : 
                                               'Welcome back to the ' + zone.title + '. Revisit this area and start a new quest?'),

        dialog = new BootstrapDialog({
            title: zone.title,
            message: verb,
            buttons: [
                { label: 'Yes' , action: switchToZone(zone), cssClass: 'btn-lg btn-block btn-primary' },
                { label: 'No', action: closeBootstrapDialog, cssClass: 'btn-lg btn-block btn-default' }
            ]
        });
    zone.invitationDialog = dialog;
    dialog.open();
}

function closeBootstrapDialog(dialog) {
    dialog.close();
}

function switchToZone(zone) {
    return function(dialog) {
        dialog.close();
        if (questUtils.questInProgress(zone)) {
            var currentQuest = questUtils.getCurrentQuest(zone);
            cards.openQuestDeck(zone, currentQuest);
        } else {
            cards.openZoneDeck(zone, questUtils.noQuestsStarted(zone));
        }
    };
}

function cleanupZoneChange(diff) {
    if (diff.oldQuest) {
        diff.oldQuest.invitationDialog.close();
    }
}
