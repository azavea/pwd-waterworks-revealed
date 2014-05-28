'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    Bacon = require('baconjs');

var deckFinishedBus = new Bacon.Bus();

function init() {
    $('.card a[data-navigate]').on('click', navigateCards);
}

function openDeck(id) {
    $('#' + id).fadeIn(400);
}

function closeDeck($card) {
    $card.closest('.overlay')
         .fadeOut(400);
}

function navigateCards(e) {
    e.preventDefault();

    var action = $(this).attr('data-navigate');
    var $thisCard = $(this).closest('.card');

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
        var deckId = $thisCard.closest('.overlay').attr('id');
        closeDeck($thisCard);
        deckFinishedBus.push(deckId);
    }
}

module.exports = {
    init: init,
    deckFinishedStream: deckFinishedBus.map(_.identity),
    openDeck: openDeck
};
