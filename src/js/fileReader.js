'use strict';

// Fetch files via ajax
var $ = require('jquery');

module.exports = {
    readAsText: readAsText
};

function readAsText(filePath, onFail, onSuccess) {
    $.ajax({
        url: filePath,
        success: onSuccess,
        fail: onFail
    });
}
