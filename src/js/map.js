"use strict";

var L = require('leaflet');

function setupMap() {
    try {
        var map = L.map('tour-map').setView([39.9665675,-75.1834254], 18);

        L.tileLayer('tiles/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);

    } catch (e) {
        console.log(e);
        alert(e);
    }
}


module.exports = setupMap;
