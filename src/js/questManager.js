'use strict';

var _ = require('lodash'),
    $ = require('jquery'),
    Bacon = require('baconjs'),
    BootstrapDialog = require('bootstrap-dialog'),
    path = require('path'),
    cards = require('./cards'),
    zoneUtils = require('./zoneUtils'),
    quests = require('../quests.json'),
    zoneConfirmationTemplate = require('../templates/zoneConfirmation.ejs');

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
        initZoneConfirmation(zoneChangeStream);

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

function showDeck(zone) {
    hideZoneConfirmation();
    cards.openZoneDeck(zone, ACTIVE_QUEST);
}

function initZoneConfirmation(zoneChangeStream) {
    zoneChangeStream
        .doAction(hideZoneConfirmation)
        .filter(_.isObject)
        .doAction(updateDialog)
        .onValue(activateZoneConfirmation);
}

function updateDialog(zone) {
    var $dialog = $('#enterarea'),
        context = {
            zone: zone,
            mediaPath: getConfirmationMediaPath(zone)
        };

    $dialog.html(zoneConfirmationTemplate(context));

    bindConfirmationButtonEvents($dialog, zone);
}

function getConfirmationMediaPath(zone) {
    var basePath = path.join('quests', ACTIVE_QUEST, zone.id),
        mediaPath;

    if (zone.primaryItems[1].type && zone.primaryItems[1].type === 'video') {
        mediaPath = path.join(basePath, 'media', zone.primaryItems[1].poster);
    } else {
        mediaPath = path.join(basePath, 'primary', zone.primaryItems[1].name + '.jpg');
    }

    return mediaPath;
}

function bindConfirmationButtonEvents($dialog, zone) {
    $dialog
        .find('.enterarea-button.enter')
        .click(function() {
            showDeck(zone);
        });

    $dialog
        .find('.enterarea-button.dismiss')
        .click(function() {
            dismissZoneConfirmation();
        });
}

function activateZoneConfirmation(zone) {
    if (zone.status === zoneUtils.STATUS_FINISHED) {
        // If the zone has already been completed, only show the small
        // zone confirmation window.
        $('#enterarea').addClass('enterarea-dismissed active');
    } else {
        $('#enterarea').removeClass('enterarea-dismissed').addClass('active');
    }
}

function dismissZoneConfirmation() {
    $('#enterarea').addClass('enterarea-dismissed');
}

function hideZoneConfirmation() {
    var $dialog = $('#enterarea');

    if ($dialog.hasClass('enterarea-dismissed')) {
        $dialog.removeClass('active');
    } else {
        $dialog.removeClass('active enterarea-dismissed');
    }
}
