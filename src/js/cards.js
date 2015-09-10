'use strict';

var $ = require('./jqueryBacon').$,
    _ = require('lodash'),
    path = require('path'),
    Bacon = require('baconjs'),
    utils = require('./utils'),
    zoneUtils = require('./zoneUtils'),
    zoneTemplate = require('../templates/zone.ejs'),
    audioPlayerTemplate = require('../templates/audioPlayer.ejs');

var deckFinishedBus = new Bacon.Bus(),
    showIntroCard = true;

function init() {
    var cardHolder = $('#card-holder');

    cardHolder.asEventStream('change', 'input[name="quest"]')
            .onValue(enableStartQuest);

    // Allow tapping the image or caption to toggle said caption open or closed.
    cardHolder.on('click', '.card .card-visual', toggleCardContent);
    cardHolder.on('click', '.card .card-content.slider', toggleCardContent);

    // Allow swipe events to move through the card stack.
    cardHolder.on('swipeRight', swipeNavigateCards);
    cardHolder.on('swipeLeft', swipeNavigateCards);
    cardHolder.on('click', '.nextslide', function() {
        cardHolder.trigger('swipeLeft');
    });
    prepareVideoHandling(cardHolder);
}

function openZoneDeck(zone, activeQuest) {
    var directory = path.join('quests', activeQuest, zone.id),
        context = {
            quest: activeQuest,
            primaryPath: directory + '/primary/',
            secondaryPath: directory + '/secondary/',
            mediaPath: directory + '/media/',
            zone: zone,
            showIntroCard: showIntroCard
        };

    context.audioPlayer = audioPlayerTemplate(context);

    var html = zoneTemplate(context);
    addDeckToPage(html);

    var $contextEl = $('#card-holder').find('.historic-context'),
        $container = $contextEl.parent(),
        options = {
            allowUpscale: true,
            subElement: 'p',
            offset: 50
        };
    // Make the font size of the historic context screen large enough to fill the
    // appropriate space. This helps make the text look good on various devices.
    utils.adjustFontSizeToEl($contextEl, $container, options);
    $(window).on('orientationchange', function() {
        setTimeout(function() {
            utils.adjustFontSizeToEl($contextEl, $container, options);
        }, 1000);
    });

    $('#finish-zone').on('click', finishZone);

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

    handleIntroCard();
}

function handleIntroCard() {
    if (showIntroCard) {
        var $introCard = $('#card-holder').find('.card.introcard');
        $introCard.find('button.introbutton').on('click', function() {
            $introCard.fadeOut(200, function() {
                $introCard.remove();
            });

            // We only want to show the intro instruction card on the first
            // zone opened. After that set to false and never show it again.
            // But the user must first click the button to surpress the
            // popup again.
            showIntroCard = false;
        });
    }
}

function setUpAudio() {
    var $audioPlayer = $('#card-holder').find('.card-header'),
        $audioButton = $audioPlayer.find('.audio-control'),
        $audioEl = $('#card-holder').find('audio'),
        sound = $audioEl.get(0),
        playingClass = 'playing',
        playMessage = 'Play Audio',
        pauseMessage = 'Pause Audio',
        replayMessage = 'Play Again';

    // Update UI on audio events.
    $audioEl.on('ended', function() {
        $audioButton.removeClass(playingClass).text(replayMessage);
    });
    $audioEl.on('playing', function() {
        $audioButton.addClass(playingClass).text(pauseMessage);
    });
    $audioEl.on('pause', function() {
        $audioButton.removeClass(playingClass).text(playMessage);
    });

    // Single button audio player.
    $audioButton.on('click', function() {
        if ($(this).hasClass(playingClass)) {
            sound.pause();
        } else {
            sound.play();
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

        // Null out the audio source to prevent further download.
        $('#card-holder').find('audio source').attr('src', null);

        // Chrome has a weird issue with audio loading resources dynamically.
        // It will just hang forever and queue up new ones that will be listed
        // as "pending" in the network forever. Calling window.stop() kills all
        // the open connections.
        // https://github.com/videojs/video.js/issues/455#issuecomment-122403204
        // https://stackoverflow.com/questions/16137381
        if (window.stop) {
            window.stop();
        }
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

function finishZone(e) {
    var $activeCard = $(e.currentTarget).closest('.card.active');

    closeDeck($activeCard);
}

function swipeNavigateCards(e) {
    if (showIntroCard) {
        // If the intro card is still visible, cancel out of swipe events.
        return;
    }

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
    if (type === 'swipeLeft') {
        // If there is another card in the stack, move to it.
        if ($thisCard.next().hasClass('card')) {
            $thisCard
                .addClass('prev')
                .removeClass('active')
                .next()
                .addClass('active')
                .removeClass('next');

            if ($thisCard.hasClass('first')) {
                // As we move away, remove the alignment message in the header,
                // fade the first card out and bring up the global swipe
                // instructions.
                $target.find('.card-header .alignment-message').fadeOut(200);
                $target.find('.instructions-default').fadeIn(600);
                $thisCard.fadeOut(600);

                // Attempt to start the audio if it exists and the
                // circumstances are correct.
                try {
                    // Only play unplayed audio. Determine this by looking at
                    // the current time and the duration of the audio clip. If
                    // they are both zero or undefined, then it is safe to
                    // assume that the audio has never been played.
                    var sound = $target.find('audio').get(0);

                    if (!sound.currentTime && !sound.duration) {
                        sound.play();
                    }
                } catch (exc) {
                    // Expecting: TypeError "Cannot read property ... of undefined"
                    if (exc.name !== 'TypeError') {
                        throw exc;
                    }
                }
            }
        } // No more cards? We are on the exit card, which has a close button.
    } else if (type === 'swipeRight') {
        if ($thisCard.prev().hasClass('card')){
            $thisCard
                .addClass('next')
                .removeClass('active')
                .prev()
                .addClass('active')
                .removeClass('prev');

            if ($thisCard.prev().hasClass('first')) {
                // As we transition to the first card, bring back the alignment
                // message in the header, fade the first card in and hide the
                // global swipe instructions.
                $target.find('.card-header .alignment-message').fadeIn(200);
                $target.find('.instructions-default').fadeOut(600);
                $thisCard.prev().fadeIn(600);
            }
        } // If no more cards before this one, do nothing.
    }
}

function prepareVideoHandling(cardHolder) {
    var handleVideoTap = function(e) {
        var $poster = $(e.currentTarget),
            $video = $poster.closest('.flex').find('video');

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
            cardHolder.trigger('swipeLeft');
        });

        $video.on('click', function() {
            $video.get(0).pause();
        });
    };

    cardHolder.on('click', '.poster', handleVideoTap);
}

function toggleCardContent(e) {
    // Not the most beautiful but a workable solution. If the tap came from a
    // video, ignore it and move on.
    if (e.target.tagName === 'VIDEO') { return; }

    // Find all current captions and open them.
    var $captions = $('#card-holder .card').find('.slider');
    $captions.each(function() {
        var $caption = $(this);
        var animationSpeed = 200; // ms
        // Toggle the element to slide off the bottom of the frame.
        // Find the height of the item and set the bottom position to the
        // negative value. This effectivly positions it just below the frame.
        // Not truly hidden.
        if ($caption.hasClass('caption-hidden')) {
            $caption.removeClass('caption-hidden');
            $caption.animate({
                bottom: '0'
            }, animationSpeed);
        } else {
            var offset = $caption.height() * -1;
            $caption.addClass('caption-hidden');
            $caption.animate({
                bottom: offset + 'px'
            }, animationSpeed);
        }
    });
}

module.exports = {
    init: init,
    deckFinishedStream: deckFinishedBus.map(_.identity),
    openZoneDeck: openZoneDeck
};
