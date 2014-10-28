'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    path = require('path'),
    Bacon = require('baconjs'),
    templateLoader = require('./templateLoader'),
    questUtils = require('./questUtils'),
    questContentTemplate = require('../templates/quest-content.ejs'),
    zoneContentTemplate = require('../templates/zone-content.ejs'),
    singleImageContentTemplate = require('../templates/single-image.ejs');

var deckFinishedBus = new Bacon.Bus(),
    topicStartedBus= new Bacon.Bus(),
    topicFinishedBus = new Bacon.Bus();

function init() {

    var questSelectedStream = $('#card-holder')
            .asEventStream('change', 'input[name="quest"]')
            .onValue(enableStartQuest);

    $('#card-holder').on('click', '.card a[data-navigate]', navigateCards);
}

function openQuestDeck(zone, quest) {
    var directory = path.join('zones', zone.id, quest);
    var htmlPath = path.join(directory, 'index.html');

    templateLoader.loadHtmlStream(htmlPath, questContentTemplate, {zone: zone, quest: quest, path: directory})
        .onValue(addDeckToPage);
}

function openZoneDeck(zone, showHtml, trackProgress) {
    var directory = path.join('zones', zone.id);
    var htmlPath = path.join(directory, 'index.html');

    var questContentBus = new Bacon.Bus();

    questContentBus.flatMap(function(quest) {
        var htmlPath = path.join(directory, quest, 'index.html');
        return templateLoader.loadHtmlStream(htmlPath, questContentTemplate, {
            zone: zone, quest: quest, path: directory
        });
    })
    .scan([], function(list, html) {
        list.push(html);
        return list;
    })
    .onValue(function(htmlCards) {
        if (htmlCards.length === zone.quests.length) {
            var htmlStream = templateLoader.loadHtmlStream(htmlPath,
                     zoneContentTemplate, {
                        zone: zone, showHtml: showHtml, path: directory, fullZoneDeck: htmlCards
                    });

            htmlStream.onValue(addDeckToPage);
            if (trackProgress) {
                topicStartedBus.push(zone);
            }
        }
    });

    // Load all quest content and apply the cards to the deck
    _.each(zone.quests, function(quest) {
        zone.status[quest] = trackProgress ? questUtils.STATUS_STARTED : questUtils.STATUS_FINISHED;
        questContentBus.push(quest);
    });
}

function setQuestCards($card, zone, quest) {
    $card.nextAll().remove();

    var directory = path.join('zones', zone.id, quest);
    var htmlPath = path.join(directory, 'index.html');
    templateLoader.loadHtmlStream(htmlPath, questContentTemplate, {zone: zone, quest: quest, path: directory})
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
        topicFinishedBus.push($deck);
    } else if (action === 'finish') {
        closeDeck($thisCard);

        deckFinishedBus.push($deck);
    }
}

function setSingleCard(data) {
    var html = singleImageContentTemplate({ path: data });
    enableStartQuest();
    addDeckToPage(html);
}

module.exports = {
    init: init,
    deckFinishedStream: deckFinishedBus.map(_.identity),
    topicStartedStream: topicStartedBus.map(_.identity),
    topicFinishedStream: topicFinishedBus.map(_.identity),
    openQuestDeck: openQuestDeck,
    openZoneDeck: openZoneDeck,
    setQuestCards: setQuestCards,
    setSingleCard: setSingleCard
};
