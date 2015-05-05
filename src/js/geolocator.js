"use strict";

var Bacon = require('baconjs');

module.exports = {
    init: function(options) {
        var active = isActive(options.$enableMockButton),
            mockEnabledProp = Bacon.fromEventTarget(options.$enableMockButton, 'toggle')
                .map(isActive, options.$enableMockButton)
                .toProperty(active),
            geoProp = getLocationStream(navigator.geolocation).toProperty(),
            geoStream = geoProp
                .filter(mockEnabledProp.not())
                .changes(),
            mockStream = getLocationStream(mockLocationStream(options.map))
                .filter(mockEnabledProp),
            manualBus = new Bacon.Bus();

        // The real geolocation could have been updating while in mock mode
        // so update the position manually when toggling back to geo mode
        // with the most recent geo value.
        geoProp.sampledBy(
                mockEnabledProp.filter(mockEnabledProp.not()))
            .onValue(manualBus, 'push');

        return Bacon.mergeAll(geoStream, mockStream, manualBus);
    }
};

function isActive($button) {
    return $button.data('toggles') && $button.data('toggles').active;
}

function getLocationStream(geoProvider) {
    var options = {
        enableHighAccuracy: true
    };

    return Bacon.fromBinder(function(sink) {

        function updatedGeolocation(position) {
            sink(new Bacon.Next(position));
        }

        function geolocationError(err) {
            sink(new Bacon.Error(err));
        }

        var watchId = geoProvider.watchPosition(updatedGeolocation, geolocationError, options);

        // Unsub
        return function() {
           geoProvider.clearWatch(watchId);
           console.log('clear geo watch');
        };
    });
}

/* Provides a geolocation-like result that returns location updated based
 * on map taps.  Used for mocking GPS location on the map */
function mockLocationStream(map) {
   var toPosition = function(latLng) {
        return {
            coords: {
                latitude: latLng.lat,
                longitude: latLng.lng
            }
        };
    };
    return {
        watchPosition: function(updateFn) {
            var mapClickStream = new Bacon.Bus();
            map.on('click', mapClickStream.push);
            mapClickStream.map('.latlng')
                .map(toPosition)
                .onValue(updateFn);
        }
    };
}
