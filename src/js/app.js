'use strict';

var $ = require('jquery');

module.exports = {
    init: function () {
        require('./templates').init();
        require('./fileReader').init();

        var allQuestsLoadedStream = require('./questLoader').loadHtml();

        allQuestsLoadedStream.onValue(function () {
            require('./ui').init();
            require('./cards').init();
            require('./map').init({ mockLocation: true });

            demoCamera();
        })
    }
};

function demoCamera() {
    // Demonstrate use of photocapture with optional callback
    var PhotoCapture = require('./photoCapture'),
        display = document.getElementById('pic'),
        camera = new PhotoCapture(display);

    $('a[data-activity="photo"]').on('click', function() {
        camera.snap(function(path) {
            console.log('photo loaded from: ' + path);
        });
    });
}
