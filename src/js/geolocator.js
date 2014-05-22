"use strict";

var Bacon = require('baconjs');

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

module.exports = function(options) {
    var geoService = navigator.geolocation;
    if (options && options.mockLocation) {
        geoService = mockLocationStream(options.map);
    }
    return getLocationStream(geoService);
};
