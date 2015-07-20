'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    zoneUtils = require('./zoneUtils'),
    zoneRowTemplate = require('../templates/zone-row.ejs');

function loadPage(pageName, $el, questManager) {
    switch (pageName) {
        case 'quests':
            loadMyQuests($el, questManager);
            return;

        default:
            return;
    }
}

function loadMyQuests($el, questManager) {
    var list = $el.find('ul.page-static-list'),
        zones = questManager.zones;

    list.empty();

    _.each(zones, function(z) {
        list.append(zoneRowTemplate({
            'title': z.title,
            'id': z.id,
            'finished': z.status === zoneUtils.STATUS_FINISHED
        }));
    });

    list.find('li a.finished').on('click', function() {
        var zoneString = $(this).data('zone'),
            zone = _.find(questManager.zones, function(z) {
                return z.id === zoneString;
            });

        questManager.showDeck(zone);
        crossFade($el, $('#map'));
    });
}

function crossFade($fromEl, $toEl, fadeLength, delay, toggleClass) {
    if (!fadeLength) { fadeLength = 200; }
    if (!delay) { delay = 200; }
    if (!toggleClass) { toggleClass = 'active'; }

    $fromEl.fadeOut(fadeLength, function() {
        setTimeout(function() {
            $fromEl.toggleClass(toggleClass);
        }, delay);
    });

    $toEl.fadeIn(fadeLength, function() {
        setTimeout(function() {
            $toEl.toggleClass(toggleClass);
        }, delay);
    });
}

module.exports = {
    loadPage: loadPage,
    crossFade: crossFade
};
