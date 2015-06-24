'use strict';

var $ = require('./jqueryBacon').$,
    _ = require('lodash'),
    path = require('path'),
    Bacon = require('baconjs'),
    zoneUtils = require('./zoneUtils'),
    zoneTemplate = require('../templates/zone.ejs');

$.mobile = require('jquery-mobile');

var deckFinishedBus = new Bacon.Bus();

function init() {
    var questSelectedStream = $('#card-holder')
            .asEventStream('change', 'input[name="quest"]')
            .onValue(enableStartQuest);

    // Allow tapping the image or caption to toggle said caption open or closed.
    $('#card-holder').on('click', '.card .card-visual', toggleCardContent);
    $('#card-holder').on('click', '.card .card-content.slider', toggleCardContent);

    // Allow swipe events to move through the card stack.
    $('#card-holder').on('swiperight', swipeNavigateCards);
    $('#card-holder').on('swipeleft', swipeNavigateCards);
    $('#card-holder').on('click', '.poster', function(e) {
        var $poster = $(e.currentTarget),
            $video = $(this).closest('.flex').find('video');

        $poster.hide();
        $video.show();
        $video.get(0).play();
        
        $video.on('pause', function() {
            $poster.show();
            $video.hide();
        });
        
        $video.on('ended', function() {
            $poster.show();
            $video.hide();
        });
    });
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

function swipeNavigateCards(e) {
    var $target = $(e.currentTarget),
        type = e.type,
        $thisCard = $target.find('.card.active'),
        $deck = $thisCard.closest('.overlay'),
        $video = $target.find('video');

    // On android the video will play after leaving the card so we stop it
    // manually.
    if ($video.length > 0) {
        $video.get(0).pause();
    }

    // In at least one case (the initial screen) the card opens without an
    // active class so we need to find it another way.
    if ($thisCard.length === 0) {
        $thisCard = $target.find('.card').first();
    }

    // Proxy the swipe events to the next and back/close buttons since they have
    // all the logic wired up already.
    if (type === 'swipeleft') {
        // If there is another card in the stack, move to it.
        if ($thisCard.next().length > 0) {
            $thisCard
                .addClass('prev')
                .removeClass('active')
                .next()
                .addClass('active')
                .removeClass('next');
        } else {
            // No next card so close the deck.
            closeDeck($thisCard);
        }
    } else if (type === 'swiperight') {
        if ($thisCard.prev().length > 0){
            $thisCard
                .addClass('next')
                .removeClass('active')
                .prev()
                .addClass('active')
                .removeClass('prev');
        } else {
            closeDeck($thisCard);
        }
    }
}

function toggleCardContent(e) {
    // Not the most beautiful but a workable solution. If the tap came from a
    // video, ignore it and move on.
    if (e.target.tagName === 'VIDEO') { return; }

    // Find all current captions and open them.
    var captions = $('#card-holder .card').find('.slider');
    captions.slideToggle(200);
}

module.exports = {
    init: init,
    deckFinishedStream: deckFinishedBus.map(_.identity),
    openZoneDeck: openZoneDeck
};
