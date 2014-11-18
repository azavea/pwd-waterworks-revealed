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
            .onValue(switchToZone);

        cards.topicFinishedStream
            .map(getZoneFromDeck)
            .onValue(switchToZone);

        initStatus();

        return {
            zones: zones,
            zoneDiffProperty: zoneDiffProperty,
            zoneStatusChangeStream: Bacon.mergeAll(finishedStream, cards.topicStartedStream),
            showDeck: showDeck,
            zoneFinishedStream: finishedStream,
            setCardValue: setCardValue
        };
    }
};

function setCardValue(html) {
    cards.setSingleCard(html);
}

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

function closeBootstrapDialog(dialog) {
    dialog.close();
}

function switchToZone(zone) {
    cards.openZoneDeck(zone, true, true);
}

function showDeck(zone) {
    cards.openZoneDeck(zone, true, false);
}
