"use strict";

var L = require('leaflet'),
    Bacon = require('baconjs'),
    _ = require('lodash'),
    locationStream = require('./geolocator');

function setupMap(options) {
        var map = L.map('tour-map').setView([39.9665675,-75.1834254], 18),
            opts = _.extend({ map: map }, options),
            updateMarker = setupMarker(map),
            loc = locationStream(opts).map(toLatLng);

        L.tileLayer('tiles/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);
        loc.onValue(updateMarker);

}


function toLatLng(position) {
    return L.latLng([position.coords.latitude, position.coords.longitude]);
}

function setupMarker(map) {
    var icon = L.icon({iconUrl: 'img/location.png'}),
        userMarker = L.marker([0,0],{icon: icon, clickable: false}).addTo(map);

    return function(latLng) {
        userMarker.setLatLng(latLng);
    };
}

module.exports = {
    init: setupMap
};
