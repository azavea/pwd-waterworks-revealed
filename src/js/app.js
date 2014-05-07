function initialize() {
    // Allow launching in desktop browser
    var event = (window.device ? 'deviceready' : 'DOMContentLoaded');
    document.addEventListener(event, start, false);
}

function start(e) {
    document.getElementById('helloButton').addEventListener('click', toggleHello);
    document.getElementById('geolocateButton').addEventListener('click', geolocate);
}

function toggleHello (e) {
    var button = e.currentTarget;
    button.textContent = (button.textContent === 'Hello' ? 'Goodbye' : 'Hello');
}

function geolocate() {
    navigator.geolocation.getCurrentPosition(onGeolocateSuccess, onGeolocateError);
}

function onGeolocateSuccess(position) {
    alert('Latitude:  ' + position.coords.latitude + '\n' +
          'Longitude: ' + position.coords.longitude);
};

function onGeolocateError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

