"use strict";

var L = require('leaflet'),
    Bacon = require('baconjs'),
    _ = require('lodash'),
    locationStream = require('./geolocator');

function setupMap(options) {
    var mapOptions = {
            attributionControl: false,
            zoomControl: false,
            center: [39.9665675,-75.1834254],
            zoom: 18 },
        map = L.map('tour-map', mapOptions),
        questLayers = L.layerGroup().addTo(map),
        getQuestZoneForLatLng = makeQuestZoneTester(questLayers),
        opts = _.extend({ map: map }, options),
        updateMarker = setupMarker(map),
        loc = locationStream(opts).map(toLatLng);

    L.tileLayer('tiles/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);
    loc.onValue(updateMarker);

    // Test for quest zone enter
    loc.map(getQuestZoneForLatLng).filter(_.isObject)
        .map('.options.attributes')
        .skipDuplicates()
        .onValue(initiateQuest);

    return {
        setQuestZones: setQuestZones(map, questLayers)
    };
}

function initiateQuest(questDef) {
    alert('activated quest: ' + questDef.name);
}

function makeQuestZoneTester(groupLayer) {
    return function(latLng) {
        var layers = groupLayer.getLayers(),
            match = _.find(layers, function(quest) {
                return quest.getLatLng().distanceTo(latLng) <= quest.getRadius();
            });
        return match;
    };
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

function setQuestZones(map, questLayer) {
    return function(quests) {
        _.each(quests, function(quest) {
            var geom = quest.location,
                options = {
                    attributes: quest,
                    weight: quest.weight || 1,
                    color: quest.color || '#1B1BB3'
                },
                circle = L.circle([geom[0], geom[1]], quest.radius, options);

            questLayer.addLayer(circle);
        });
    };
}

module.exports = {
    init: setupMap
};
