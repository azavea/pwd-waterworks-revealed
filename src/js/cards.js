'use strict';

var $ = require('jquery');

function init() {
    $('.card a[data-navigate]').on('click', navigateCards);
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
        $thisCard.closest('.overlay')
                 .fadeOut(400);
    }
}

module.exports = {
    init: init
};
