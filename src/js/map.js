"use strict";

var L = require('leaflet'),
    Bacon = require('baconjs'),
    _ = require('lodash'),
    zoneUtils = require('./zoneUtils'),
    zoneStyle = require('./zoneStyles');

module.exports = {
    init: function (options) {
        var map = initMap(),
            opts = _.extend({ map: map }, options),
            locationStream = require('./geolocator').init(opts),
            latLngStream = locationStream.map(toLatLng),
            questManager = require('./questManager').init(latLngStream),
            locationMarker = addLocationMarkerToMap(map),
            ghostMarkers = [],
            southWest = L.latLng(39.96028, -75.189786),
            northEast = L.latLng(39.97286, -75.177855),
            bounds = L.latLngBounds(southWest, northEast);

        L.tileLayer(
            'tiles/{z}/{x}/{y}.png',
            {
                maxZoom: 20,
                minZoom: 17
            }
        ).addTo(map);

        map.setMaxBounds(bounds);

        latLngStream
            .doAction(updateGhostTrail, ghostMarkers, map)
            .doAction(centerMapOnPosiiton, map)
            .onValue(locationMarker, 'setLatLng');

        initQuestZoneLayers(map, questManager.zones);

        questManager.zoneDiffProperty.onValue(highlightZoneChange);

        // Update the style of a zone depending on it's status
        Bacon.mergeAll(questManager.zoneStatusChangeStream,
                Bacon.fromArray(questManager.zones))
            .onValue(changeZoneStyle, questManager.showDeck);

        return questManager;
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

function centerMapOnPosiiton(map, latlng) {
    map.panTo(latlng);
}

function initQuestZoneLayers(map, zones) {
    var questLayerGroup = L.layerGroup().addTo(map);
    _.each(zones, function(zone) {
        var geom = zone.location,
            latLng = L.latLng(geom[0], geom[1]),
            options = zoneStyle.unstarted,
            circle = L.circle(latLng, zone.radius, options);

        questLayerGroup.addLayer(circle);

        zone.latLng = latLng;
        zone.layer = circle;
    });
}

function highlightZoneChange(diff) {
    if (diff.newZone) {
        diff.newZone.layer.setStyle(zoneStyle.active);
    }
    if (diff.oldZone) {
        diff.oldZone.layer.setStyle(zoneStyle.inactive);
    }
}

function changeZoneStyle(showDeck, zone) {
    if (!zone) { return; }

    if (zoneUtils.zoneFinished(zone)) {
        zone.layer.setStyle(zoneStyle.done);

        // Once a zone has been entered, a user can click on the marker
        // to launch the card deck instead of having to revisit the zone.
        addZoneClickEvent(zone, showDeck);
    } else {
        zone.layer.setStyle(zoneStyle.unstarted);
        removeZoneClickEvent(zone);
    }
}

function addZoneClickEvent(zone, showDeck) {
    zone.clickStream = Bacon.fromEventTarget(zone.layer, 'click').map(zone);
    zone.clickStream.onValue(showDeck);
}

function removeZoneClickEvent(zone) {
    if (zone.clickStream) {
        zone.clickstream = null;
        zone.layer.off('click');
    }
}

function getUnfinishedZones(zones) {
    return _.filter(zones, zoneUtils.zoneNotFinished);
}
