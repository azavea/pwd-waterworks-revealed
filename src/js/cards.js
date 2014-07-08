'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    path = require('path'),
    Bacon = require('baconjs'),
    templateLoader = require('./templateLoader'),
    questUtils = require('./questUtils'),
    questContentTemplate = require('../templates/quest-content.ejs'),
    zoneContentTemplate = require('../templates/zone-content.ejs');

var deckFinishedBus = new Bacon.Bus();

function init() {
    $('#card-holder').on('click', '.card a[data-navigate]', navigateCards);
}

function openQuestDeck(zone, quest) {
    var htmlPath = path.join('zones', zone.id, quest, 'index.html');
    templateLoader.loadHtmlStream(htmlPath, questContentTemplate, {zone: zone, quest: quest})
        .onValue(addDeckToPage);
}

function openZoneDeck(zone, showHtml) {
    var htmlPath = path.join('zones', zone.id, 'index.html');
    var htmlStream = templateLoader.loadHtmlStream(
            htmlPath, zoneContentTemplate, {zone: zone, showHtml: showHtml});

    htmlStream.onValue(addDeckToPage);
    htmlStream.onValue(function() {
        _.defer(function() {
            $('#card-holder').find('.card a[data-start-quest]').on('click', function(e) {
                var $link = $(this);
                var $card = $link.closest('.card');
                var $deck = $card.closest('.overlay');
                var quest = $card.find('[name="quest"]:checked').val();
                if (quest) {
                    if (zone.status[quest] === questUtils.STATUS_NOT_STARTED) {
                        zone.status[quest] = questUtils.STATUS_STARTED;
                    }
                    $deck.attr('data-zone', zone.id);
                    $deck.attr('data-quest', quest);

                    setQuestCards($card, zone, quest);
                }
            });
        });
    });
}

function setQuestCards($card, zone, quest) {
    $card.nextAll().remove();

    var htmlPath = path.join('zones', zone.id, quest, 'index.html');
    templateLoader.loadHtmlStream(htmlPath, questContentTemplate, {zone: zone, quest: quest})
        .onValue(function(html) {
            var $questCards = $(html).find('.card');
            $card.after($questCards);
            _.defer(function() {
                $card.toggleClass('prev active');
            });
        });
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

function navigateCards(e) {
    e.preventDefault();

    var action = $(this).attr('data-navigate');
    var $thisCard = $(this).closest('.card');
    var $deck = $thisCard.closest('.overlay');

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
    } else if (action === 'finish') {
        closeDeck($thisCard);

        deckFinishedBus.push($deck);
    }
}

module.exports = {
    init: init,
    deckFinishedStream: deckFinishedBus.map(_.identity),
    openQuestDeck: openQuestDeck,
    openZoneDeck: openZoneDeck,
    setQuestCards: setQuestCards
};
