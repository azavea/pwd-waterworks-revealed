'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    jqToggle = require('toggles'),
    Snap = require('Snap'),
    pageManager = require('./pages'),
    progressTemplate = require('../templates/progress.ejs'),
    zoneUtils = require('./zoneUtils');

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
    initToggleButtons();
    initQuestProgress(questManager);
    initCompass();

    $('.menu-link').on('click', toggleMenu);
    $('.menu').on('click', 'a', togglePages);
}

function initToggleButtons() {
    $('.toggles').toggles({
        height: 35,
        width: 100,
        on: false
    });
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

module.exports = {
    init: init
};
