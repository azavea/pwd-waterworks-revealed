"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    Bacon = require('baconjs'),
    BootstrapDialog = require('bootstrap-dialog'),
    cards = require('./cards'),
    questUtils = require('./questUtils'),
    zones = require('../zones.json');

module.exports = {
    init: function (latLngStream) {
        var zoneChangeStream = latLngStream
                .map(getZoneForLatLng)
                .skipDuplicates(),
            zoneDiffProperty = zoneChangeStream.diff(undefined, zoneDiff),
            finishedStream = Bacon.mergeAll(cards.deckFinishedStream, cards.topicFinishedStream)
                .map(getZoneFromDeck)
                .doAction(onZoneFinished);

        zoneChangeStream
            .filter(_.isObject)
            .onValue(inviteToZone);

        zoneDiffProperty.onValue(cleanupZoneChange);

        cards.topicFinishedStream
            .map(getZoneFromDeck)
            .onValue(switchToZone);

        initStatus();

        return {
            zones: zones,
            zoneDiffProperty: zoneDiffProperty,
            zoneStatusChangeStream: Bacon.mergeAll(finishedStream, cards.topicStartedStream),
            showDeck: showDeck
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

function getZoneFromDeck($deck) {
    var zoneId = $deck.attr('data-zone');

    return getZoneById(zoneId);
}

function onZoneFinished(zone) {
    // All quests are completed at end of zone
    if (zone) {
        _.each(zone.quests, function(quest) {
            zone.status[quest] = questUtils.STATUS_FINISHED;
        });
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
                { label: 'Yes' , action: closeDialogAndSwitchToZone(zone), cssClass: 'btn-lg btn-block btn-primary' },
                { label: 'No', action: closeBootstrapDialog, cssClass: 'btn-lg btn-block btn-default' }
            ]
        });
    zone.invitationDialog = dialog;
    dialog.open();
}

function closeBootstrapDialog(dialog) {
    dialog.close();
}

function closeDialogAndSwitchToZone(zone) {
    return function(dialog) {
        closeBootstrapDialog(dialog);
        switchToZone(zone);
    };
}

function switchToZone(zone) {
    cards.openZoneDeck(zone, true, true);
}

function cleanupZoneChange(diff) {
    if (diff.oldZone) {
        diff.oldZone.invitationDialog.close();
    }
}

function showDeck(zone) {
    cards.openZoneDeck(zone, true, false);
}
