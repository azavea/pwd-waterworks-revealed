'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    Snap = require('Snap'),
    path = require('path'),
    pageManager = require('./pages'),
    progressTemplate = require('../templates/progress.ejs'),
    zoneUtils = require('./zoneUtils'),
    zoneConfirmationTemplate = require('../templates/zoneConfirmation.ejs');

var snap,
    questManager;

function init(options) {
    questManager = options.questManager;
    // Need these to not allow overscrolling
    $(window).bind('touchmove', function (e) {
        e.preventDefault();
    });
    $('body').on('touchmove','.scrollable', function (e) {
        e.stopPropagation();
    });

    initSnap();
    initQuestProgress(questManager);
    initCompass();
    initZoneConfirmation(questManager);

    $('.menu-link').on('click', toggleMenu);
    $('.menu').on('click', 'a', togglePages);
}

function initCompass() {
    // onSuccess: Get the current heading
    function onSuccess(heading) {
        // The icon starts at 45 degrees so reset it to zero first.
        var rotation = heading.magneticHeading - 45;
        $('#compass').find('svg path').attr('transform', 'rotate(' + rotation + ' 896 896)');
    }

    // Failed to get the heading
    function onError(compassError) {
        console.warn('Compass error: ' + compassError.code);
    }

    var options = { frequency: 1000 }, // ms between compass updates.
        watchId = null;

    try {
        watchId = navigator.compass.watchHeading(onSuccess, onError, options);
    } catch (exc) {
        // Remove from DOM if compass is not available so it doesn't look
        // broken.
        $('#compass').remove();

        // Expecting: TypeError: Cannot read property 'watchHeading' of undefined
        // Rethrow if that's not what we got.
        if (exc.name !== 'TypeError') {
            throw exc;
        }
    }
}

function initSnap() {
    snap = new Snap({
        element: document.getElementById('content'),
        dragger: null,
        disable: 'right',
        addBodyClasses: true,
        hyperextensible: false,
        resistance: 0.5,
        flickThreshold: 50,
        transitionSpeed: 0.3,
        easing: 'ease',
        maxPosition: 266,
        minPosition: -266,
        tapToClose: true,
        touchToDrag: false,
        slideIntent: 40,
        minDragDistance: 5
    });
}

function initQuestProgress(questManager) {
    var selector = '#progress';

    $(selector).on('click', togglePages);

    questManager.zoneStatusChangeStream
        .toProperty(0)
        .map(updateProgress, questManager)
        .onValue(renderProgress, selector);
}

function updateProgress(questManager) {
    var count = _.reduce(questManager.zones, function(result, zone) {
        if (zone.status === zoneUtils.STATUS_FINISHED) {
            return result + 1;
        }

        return result;
    }, 0);

    return {
        total: questManager.zones.length,
        count: count
    };
}

function renderProgress(selector, context) {
    $(selector).html(progressTemplate(context));
}

function toggleMenu() {
    if (snap.state().state === 'left' ) {
        snap.close();
    } else {
        snap.open('left');
    }
}

function togglePages(e) {
    e.preventDefault();
    var page = $(e.currentTarget).data('page');
    var target = $(e.currentTarget).attr('data-page');
    var activePage = $('#content').find('.page.active').attr('id');

    if (activePage !== target) {
        pageManager.crossFade($('#' + activePage), $('#' + target));
        snap.close();
        pageManager.loadPage(target, $('#' + target), questManager);
    } else {
        toggleMenu();
    }
}

function initZoneConfirmation(questManager) {
    questManager.zoneChangeStream
        .doAction(hideZoneConfirmation)
        .filter(_.isObject)
        .doAction(updateDialog, questManager)
        .onValue(activateZoneConfirmation);
}

function updateDialog(questManager, zone) {
    var $dialog = $('#enterarea'),
        context = {
            zone: zone,
            mediaPath: getConfirmationMediaPath(questManager, zone)
        };

    $dialog.html(zoneConfirmationTemplate(context));

    bindConfirmationButtonEvents($dialog, questManager, zone);
}

function getConfirmationMediaPath(questManager, zone) {
    var basePath = path.join('quests', questManager.activeQuest, zone.id),
        mediaPath;

    if (zone.primaryItems[1].type && zone.primaryItems[1].type === 'video') {
        mediaPath = path.join(basePath, 'media', zone.primaryItems[1].poster);
    } else {
        mediaPath = path.join(basePath, 'primary', zone.primaryItems[1].name + '.jpg');
    }

    return mediaPath;
}

function bindConfirmationButtonEvents($dialog, questManager, zone) {
    $dialog
        .find('.enterarea-button.enter')
        .click(function() {
            startZone(questManager, zone);
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

function startZone(questManager, zone) {
    hideZoneConfirmation();
    questManager.showDeck(zone);
}

module.exports = {
    init: init
};
