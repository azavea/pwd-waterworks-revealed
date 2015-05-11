'use strict';

var $ = require('./jqueryBacon').$,
    _ = require('lodash'),
    path = require('path'),
    Bacon = require('baconjs'),
    zoneUtils = require('./zoneUtils'),
    zoneTemplate = require('../templates/zone.ejs');

var deckFinishedBus = new Bacon.Bus();

function init() {
    var questSelectedStream = $('#card-holder')
            .asEventStream('change', 'input[name="quest"]')
            .onValue(enableStartQuest);

    $('#card-holder').on('click', '.card a[data-navigate]', navigateCards);

    // Allow tapping the image or caption to toggle said caption open or closed.
    $('#card-holder').on('click', '.card .card-visual', toggleCardContent);
    $('#card-holder').on('click', '.card .card-content.slider', toggleCardContent);
}

function openZoneDeck(zone, activeQuest) {
    var directory = path.join('quests', activeQuest, zone.id),
        context = {
            quest: activeQuest,
            primaryPath: directory + '/primary/',
            secondaryPath: directory + '/secondary/',
            zone: zone
        },
        html = zoneTemplate(context);

    addDeckToPage(html);

    deckFinishedBus.push(zone.id);
}

function addDeckToPage(html) {
    $('#card-holder')
        .html(html)
        .find('.overlay')
        .first()
        .fadeIn(400);
}

function closeDeck($card) {
    $card.closest('.overlay')
         .fadeOut(400);
}

function enableStartQuest(isDisabled) {
    $('#card-holder .card a[data-start-quest]')
        .removeClass('link-disabled');
}

function navigateCards(e) {
    e.preventDefault();

    var $target = $(e.currentTarget),
        action = $target.attr('data-navigate'),
        $thisCard = $target.closest('.card'),
        $deck = $thisCard.closest('.overlay');

    if (action === 'next') {
        $thisCard.toggleClass('prev active')
                 .next()
                 .toggleClass('next active')
                 .nextAll();
    } else if (action === 'prev') {
        $thisCard.toggleClass('next active')
                 .prev()
                 .toggleClass('prev active')
                 .nextAll();
    } else if (action === 'close') {
        closeDeck($thisCard);
    } else if (action === 'repick') {
        closeDeck($thisCard);
    } else if (action === 'finish') {
        closeDeck($thisCard);
    }
}

function toggleCardContent(e) {
    var caption = $('#card-holder .card.active').find('.slider');
    caption.slideToggle();
}

module.exports = {
    init: init,
    deckFinishedStream: deckFinishedBus.map(_.identity),
    openZoneDeck: openZoneDeck
};
