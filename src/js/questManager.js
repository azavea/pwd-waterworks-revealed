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
    EXIT_BUFFER = 1, // distance in meters to buffer when exiting a zone.
    quest = quests[ACTIVE_QUEST],
    zones = quest.zones;

module.exports = {
    init: function (latLngStream) {
        var zoneChangeStream = latLngStream
                .map(getZoneForLatLng)
                .skipDuplicates(exitBuffer)
                .skipDuplicates(),
            zoneDiffProperty = zoneChangeStream.diff(undefined, zoneDiff),
            finishedStream = cards.deckFinishedStream
                .map(getZoneById)
                .doAction(onZoneFinished);

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
            zoneChangeStream: zoneChangeStream,
            showDeck: showDeck,
            setCardValue: setCardValue
        };
    }
};

function exitBuffer(oldValue, newValue) {
    if (oldValue === newValue) {
       // same object
       return true;
    } else if (_.isObject(oldValue) && _.isObject(newValue) && oldValue.id === newValue.id) {
        // Same id
        return true;
    } else if (!_.isObject(oldValue) && _.isObject(newValue)) {
        // Moving into a zone.
        return false;
    } else if (_.isObject(oldValue) && !_.isObject(newValue)) {
        // Maybe leaving a zone, first check the exit buffer to ensure
        // we don't leave because of a GPS glitch.
        if (oldValue.latLng.distanceTo(oldValue.currentPosition) <= oldValue.radius + EXIT_BUFFER) {
            return true;
        } else {
            // Okay really leaving.
            return false;
        }
    }
    return false;
}

function setCardValue(html) {
    cards.setSingleCard(html);
}

function getZoneById(id) {
    return _.find(zones, function (zone) {
        return (zone.id === id);
    });
}

function getZoneForLatLng(latLng) {
    // Affix current position to each zone. This is needed for the zone buffer.
    _.each(zones, function(zone) {
        zone.currentPosition = latLng;
    });

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
