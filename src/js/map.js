"use strict";

var L = require('leaflet'),
    Bacon = require('baconjs'),
    _ = require('lodash'),
    questUtils = require('./questUtils'),
    zoneStyle = require('./zoneStyles');

module.exports = {
    init: function (options) {
        var map = initMap(),
            opts = _.extend({ map: map }, options),
            locationStream = require('./geolocator').init(opts),
            latLngStream = locationStream.map(toLatLng),
            questManager = require('./questManager').init(latLngStream),
            locationMarker = addLocationMarkerToMap(map);

        L.tileLayer('tiles/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);

        latLngStream.onValue(locationMarker, 'setLatLng');

        initQuestZoneLayers(map, questManager.zones);

        questManager.zoneDiffProperty.onValue(highlightZoneChange);

        // Style the initial zones, and any updates based on their status
        Bacon.mergeAll(questManager.zoneStatusChangeStream,
                Bacon.fromArray(questManager.zones))
            .onValue(changeZoneStyle);
    }
};

function initMap() {
    var mapOptions = {
            attributionControl: false,
            zoomControl: false,
            center: [39.9665675,-75.1834254],
            zoom: 18
        },
        map = L.map('tour-map', mapOptions);
    return map;
}

function toLatLng(position) {
    return L.latLng([position.coords.latitude, position.coords.longitude]);
}

function addLocationMarkerToMap(map) {
    var icon = L.icon({iconUrl: 'img/location.png'}),
        marker = L.marker([0,0],{icon: icon, clickable: false})
            .addTo(map);

    return marker;
}

function initQuestZoneLayers(map, zones) {
    var questLayerGroup = L.layerGroup().addTo(map);
    _.each(zones, function(zone) {
        var geom = zone.location,
            latLng = L.latLng(geom[0], geom[1]),
            options = zone.zoneStyleInactive || zoneStyle.inactive,
            circle = L.circle(latLng, zone.radius, options);

        questLayerGroup.addLayer(circle);

        zone.latLng = latLng;
        zone.layer = circle;
    });
}

function highlightZoneChange(diff) {
    if (diff.newZone) {
        diff.newZone.layer.setStyle(diff.newZone.zoneStyleActive || zoneStyle.active);
    }
    if (diff.oldZone) {
        diff.oldZone.layer.setStyle(diff.oldZone.zoneStyleInactive || zoneStyle.inactive);
    }
}

function changeZoneStyle(zone) {
    if (questUtils.allQuestsDone(zone)) {
        zone.layer.setStyle(zoneStyle.done);
    } else if (questUtils.noQuestsStarted(zone)) {
        zone.layer.setStyle(zoneStyle.unstarted);
    } else if (questUtils.questInProgress(zone)) {
        zone.layer.setStyle(zoneStyle.inProgress);
    }
}
