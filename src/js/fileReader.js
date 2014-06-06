'use strict';

// Read files.
// When running on device, fetch from local filesystem.
// When running in browser (during development), fetch via Ajax.

var $ = require('jquery');

var _fileSystemRoot;

module.exports = {
    init: init,
    readAsText: readAsText
};

function init() {
    if (window.device) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            _fileSystemRoot = fileSystem.root;
        }, fail);
    }
}

function readAsText(filePath, onFail, onSuccess) {
    var read = (window.device ? readLocalFile : readRelativeUrl);
    read(filePath, onFail, onSuccess);
}

function readLocalFile(filePath, onFail, onSuccess) {
    _fileSystemRoot.getFile(filePath, null, function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                onSuccess(evt.target.result);
            };
            reader.readAsText(file);
        }, onFail);
    }, onFail);
}

function readRelativeUrl(filePath, onFail, onSuccess) {
    $.ajax({
        url: filePath,
        success: onSuccess,
        fail: onFail
    });
}
