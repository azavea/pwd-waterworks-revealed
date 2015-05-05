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
        $el.fadeOut(200).delay(200).toggleClass('active');
        $('#map').fadeIn(200).delay(200).toggleClass('active');
    });
}

module.exports = {
    loadPage: loadPage
};
