"use strict";

var L = require('leaflet'),
    Bacon = require('baconjs'),
    _ = require('lodash');

var zoneStyleInactive = { weight: 1, color: '#1b1bb3', fillColor: '#0033ff' },
    zoneStyleActive   = { weight: 1, color: '#1bb31b', fillColor: '#33ff00' };


module.exports = {
    init: function (options) {
        var map = initMap(),
            opts = _.extend({ map: map }, options),
            locationStream = require('./geolocator').init(opts),
            latLngStream = locationStream.map(toLatLng),
            questManager = require('./questManager').init(latLngStream);

        L.tileLayer('tiles/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);

        var updateMarker = makeMarkerUpdater(map);
        latLngStream.onValue(updateMarker);

        initQuestZoneLayers(map, questManager.zones);

        questManager.zoneDiffProperty.onValue(highlightZoneChange);
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

function makeMarkerUpdater(map) {
    var icon = L.icon({iconUrl: 'img/location.png'}),
        userMarker = L.marker([0,0],{icon: icon, clickable: false}).addTo(map);

    return function(latLng) {
        userMarker.setLatLng(latLng);
    };
}

function initQuestZoneLayers(map, zones) {
    var questLayerGroup = L.layerGroup().addTo(map);
    _.each(zones, function(zone) {
        var geom = zone.location,
            latLng = L.latLng(geom[0], geom[1]),
            options = zone.zoneStyleInactive || zoneStyleInactive,
            circle = L.circle(latLng, zone.radius, options);

        questLayerGroup.addLayer(circle);

        zone.latLng = latLng;
        zone.layer = circle;
    });
}

function highlightZoneChange(diff) {
    if (diff.newZone) {
        diff.newZone.layer.setStyle(diff.newZone.zoneStyleActive || zoneStyleActive);
    }
    if (diff.oldZone) {
        diff.oldZone.layer.setStyle(diff.oldZone.zoneStyleInactive || zoneStyleInactive);
    }
}
