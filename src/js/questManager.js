"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    Bacon = require('baconjs'),
    BootstrapDialog = require('bootstrap-dialog'),
    cards = require('./cards'),
    zoneUtils = require('./zoneUtils'),
    quests = require('../quests.json');

var ACTIVE_QUEST = 'fairmount-water-works',
    DEFAULT_PRIMARY_CAPTION = 'Align your screen so that it matches up with the view you see here, tap to show/hide captions.',
    quest = quests[ACTIVE_QUEST],
    zones = quest.zones;

module.exports = {
    init: function (latLngStream) {
        var zoneChangeStream = latLngStream
                .map(getZoneForLatLng)
                .skipDuplicates(),
            zoneDiffProperty = zoneChangeStream.diff(undefined, zoneDiff),
            finishedStream = cards.deckFinishedStream
                .map(getZoneById)
                .doAction(onZoneFinished);

        zoneChangeStream
            .filter(_.isObject)
            .onValue(switchToZone);

        initStatus();

        zones.forEach(function(z) {
            var firstPhoto = _.first(z.primaryItems);
            if (!firstPhoto.caption) {
                firstPhoto.caption = DEFAULT_PRIMARY_CAPTION;
            }
        });
        return {
            zones: zones,
            activeQuest: ACTIVE_QUEST,
            zoneDiffProperty: zoneDiffProperty,
            zoneStatusChangeStream: finishedStream,
            showDeck: showDeck,
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
    _.each(zones, function(zone) {
        zone.status = zoneUtils.STATUS_NOT_STARTED;
    });
}

function getZoneFromDeck($deck) {
    var zoneId = $deck.attr('data-zone');

    return getZoneById(zoneId);
}

function onZoneFinished(zone) {
    if (zone) {
        zone.status = zoneUtils.STATUS_FINISHED;
    }
}

function closeBootstrapDialog(dialog) {
    dialog.close();
}

function switchToZone(zone) {
    cards.openZoneDeck(zone, ACTIVE_QUEST);
}

function showDeck(zone) {
    cards.openZoneDeck(zone, ACTIVE_QUEST);
}
