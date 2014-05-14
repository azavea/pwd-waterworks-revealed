"use strict";

/*
 * This module returns an object which activates the native camera app and
 * receives back a path to the image, but also can flag it to be saved and
 * added to the native Photo Gallery.
 * */
var _ = require('lodash');

/*
 * Constructor arguments:
 *  - displayEl: <optional> Browser DOM <img> element to set photo source on
 *  - options: <optional> Any valid combo of PhoneGap CameraOptions
*/
function PhotoCapture(displayEl, options) {
    this.displayEl = displayEl;
    this.options = _.extend({
            quality: 60,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            encodingType: navigator.camera.EncodingType.PNG,
            correctOrientation: true,
            saveToPhotoAlbum: true
        }, options);

}

PhotoCapture.prototype.snap = function(onSuccess, onFailure) {
    var processFn = processPhoto(onSuccess, this.displayEl);
    navigator.camera.getPicture(processFn, onFailure, this.options);
};

function processPhoto(onSuccess, display) {
    return function(filePath) {
        if (display) {
            display.src = filePath;
        }

        if (_.isFunction(onSuccess)) {
            onSuccess(filePath);
        }
    };
}

module.exports = PhotoCapture;
