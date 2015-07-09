'use strict';

var $ = require('./jqueryBacon').$,
    _ = require('lodash'),
    path = require('path'),
    Bacon = require('baconjs'),
    zoneUtils = require('./zoneUtils'),
    zoneTemplate = require('../templates/zone.ejs'),
    audioPlayerTemplate = require('../templates/audioPlayer.ejs');

$.mobile = require('jquery-mobile');

var deckFinishedBus = new Bacon.Bus();

function init() {
    var cardHolder = $('#card-holder');
    cardHolder.asEventStream('change', 'input[name="quest"]')
            .onValue(enableStartQuest);

    // Allow tapping the image or caption to toggle said caption open or closed.
    cardHolder.on('click', '.card .card-visual', toggleCardContent);
    cardHolder.on('click', '.card .card-content.slider', toggleCardContent);

    // Allow swipe events to move through the card stack.
    cardHolder.on('swiperight', swipeNavigateCards);
    cardHolder.on('swipeleft', swipeNavigateCards);
    cardHolder.on('click', '.poster', function(e) {
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
            mediaPath: directory + '/media/',
            zone: zone,
        };

    context.audioPlayer = audioPlayerTemplate(context);

    var html = zoneTemplate(context);
    addDeckToPage(html);

    deckFinishedBus.push(zone.id);
}

function addDeckToPage(html) {
    $('#card-holder')
        .html(html)
        .find('.overlay')
        .first()
        .fadeIn(400);

        // Now that our card holder has a deck in it prepare audio.
        setUpAudio();
}

function setUpAudio() {
    var $audioPlayer = $('#card-holder').find('.card-header'),
        $audioButton = $audioPlayer.find('.audio-control'),
        $audioEl = $('#card-holder').find('audio'),
        sound = $audioEl.get(0),
        playingClass = 'playing';

    // Reset on sound completion.
    $audioEl.on('ended', function() {
        $audioButton.removeClass(playingClass).text('Play Again');
    });

    // Single button audio player.
    $audioButton.on('click', function() {
        if ($(this).hasClass(playingClass)) {
            sound.pause();
            $(this).removeClass(playingClass).text('Play Audio');
        } else {
            sound.play();
            $(this).addClass(playingClass).text('Pause Audio');
        }
    });

    // Audio player can close the deck.
    $audioPlayer.on('click', '.close-deck', function() {
        // Though not a card, passing the player div to the closeDeck function
        // is fine since the card is only used to find the overlay container
        // and hide it. This works just as well for the player div.
        closeDeck($audioPlayer);
    });
}

function closeDeck($card) {
    try {
        // Attempt to stop any sound that is playing before we close.
        $('#card-holder').find('audio').get(0).pause();
    } catch (exc) {
        // Expecting: TypeError "Cannot read property 'pause' of undefined"
        if (exc.name !== 'TypeError') {
            throw exc;
        }
    } finally {
        $card.closest('.overlay')
            .fadeOut(400);
    }
}

function enableStartQuest(isDisabled) {
    $('#card-holder .card a[data-start-quest]')
        .removeClass('link-disabled');
}

function swipeNavigateCards(e) {
    var $target = $(e.currentTarget),
        type = e.type,
        $thisCard = $target.find('.card.active'),
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
        if ($thisCard.next().hasClass('card')) {
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
        if ($thisCard.prev().hasClass('card')){
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
