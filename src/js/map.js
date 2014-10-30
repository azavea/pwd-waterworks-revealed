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
            locationMarker = addLocationMarkerToMap(map),
            ghostMarkers = [];

        L.tileLayer('tiles/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);

        latLngStream
            .doAction(updateGhostTrail, ghostMarkers, map)
            .onValue(locationMarker, 'setLatLng');

        initQuestZoneLayers(map, questManager.zones);

        questManager.zoneDiffProperty.onValue(highlightZoneChange);

        // Style the initial zones, and any updates based on their status
        Bacon.mergeAll(questManager.zoneStatusChangeStream,
                Bacon.fromArray(questManager.zones))
            .onValue(changeZoneStyle);

        // Show and animate zone markers periodically
        // for zones that have not been started
        Bacon.interval(30000, questManager.zones)
            .map(getUnstartedZones)
            .onValue(showAndAnimateInactiveZones);

        initZoneClickEvents(questManager);
    }
};

function updateGhostTrail(markers, map, latlng) {
    var icon = L.icon({iconUrl: 'img/location.png'}),
        marker = L.marker(latlng, {icon: icon, clickable: false}),
        lastMarker = null,
        minTrailMarkerSpacing = 10, // In meters.
        maxNumberOfMarkersInTrail = 10,
        distance = minTrailMarkerSpacing;

    if (markers.length > 0) {
        distance = latlng.distanceTo(markers[0].getLatLng());
    }

    // Only add new points if the distance is greater than the minimum spacing
    // distance so ghost trail points don't stack up.
    if (distance >= minTrailMarkerSpacing) {
        map.addLayer(marker);
        markers.unshift(marker);

        // Show only a fixed number of points in the trail at any given time.
        if (markers.length > maxNumberOfMarkersInTrail) {
            lastMarker = markers.pop();
            map.removeLayer(lastMarker);
        }

        // Reduce the opacity by a fixed percentage (100/points) for each
        // previous location from the current location. Start at 95% end at 5%.
        for (var i = 0; i < markers.length; i++) {
            markers[i].setOpacity((105 - (100 / maxNumberOfMarkersInTrail) * i) / 100);
        }
    }
    // Return the latlng to the stream.
    return latlng;
}

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
            options = zone.zoneStyleInitial || zoneStyle.initial,
            circle = L.circle(latLng, zone.radius, options);

        questLayerGroup.addLayer(circle);

        zone.latLng = latLng;
        zone.layer = circle;
        zone.clickStream = Bacon.fromEventTarget(circle, 'click').map(zone);
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
        zone.layer.setStyle(zoneStyle.active);
    } else if (questUtils.noQuestsStarted(zone)) {
        zone.layer.setStyle(zoneStyle.unstarted);
    } else if (questUtils.questInProgress(zone)) {
        zone.layer.setStyle(zoneStyle.inProgress);
        zone.layer.setStyle(zoneStyle.active);
    }
}

function getUnstartedZones(zones) {
    return _.filter(zones, questUtils.noQuestsStarted);
}

function showAndAnimateInactiveZones(zones) {
    _.each(zones, function(zone) {
        var fullRadius = zone.layer.getRadius();

        // The setTimeout interval is tuned to have
        // circles appear randomly with a second or
        // or two window
        window.setTimeout(function() {
            zone.layer.setStyle({ fillOpacity: 0.35 });
            zoneAnimation(zone.layer, fullRadius, 0);
        }, 500 * (Math.random() * 2));
    });
}

function zoneAnimation(layer, fullRadius, stepRadius) {
    layer.setRadius(stepRadius);

    // We want the marker to get more and more yellow as it
    // gets larger.
    var saturation = Math.round((stepRadius / fullRadius) * 100);
    layer.setStyle({ fillColor: 'hsl(54, ' + saturation + '%, 50%)' });

    // The increase in radius and setTimeout interval are tuned
    // to smoothly animate a growing circle.
    if(stepRadius < fullRadius) {
        window.setTimeout(function() {
            zoneAnimation(layer, fullRadius, stepRadius + 0.33);
        }, 5);
    } else {
        // When the circle has reached is full radius
        // we want to hide it from the map again.
        layer.setStyle({ fillOpacity: 0 });
    }
}

function initZoneClickEvents(questManager) {
    _.each(questManager.zones, function(zone) {
        zone.clickStream.filter(questUtils.allQuestsDone).onValue(questManager.showDeck);
    });
}
