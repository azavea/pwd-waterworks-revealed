'use strict';

var $        = require('jquery'),
    jqToggle = require('toggles'),
    Snap     = require('Snap');

var snap;

function init() {
    // Need these to not allow overscrolling
    $(window).bind('touchmove', function (e) {
        e.preventDefault();
    });
    $('body').on('touchmove','.scrollable', function (e) {
        e.stopPropagation();
    });

    initSnap();
    initToggleButtons();

    $('.menu-link').on('click', toggleMenu);
    $('.menu').on('click', 'a', togglePages);
}

function initToggleButtons() {
    $('.toggles').toggles({
        height: 35,
        width: 100,
        on: false
    });
}

function initSnap() {
    snap = new Snap({
        element: document.getElementById('content'),
        dragger: null,
        disable: 'right',
        addBodyClasses: true,
        hyperextensible: false,
        resistance: 0.5,
        flickThreshold: 50,
        transitionSpeed: 0.3,
        easing: 'ease',
        maxPosition: 266,
        minPosition: -266,
        tapToClose: true,
        touchToDrag: false,
        slideIntent: 40,
        minDragDistance: 5
    });
}

function toggleMenu() {
    if (snap.state().state == "left" ) {
        snap.close();
    } else {
        snap.open('left');
    }
}

function togglePages(e) {
    e.preventDefault();
    var target = $(this).attr('data-page');
    var activePage = $('#content').find('.page.active').attr('id');

    if (activePage !== target) {
        $('#' + activePage).fadeOut(200).delay(200).toggleClass('active');
        $('#' + target    ).fadeIn (200).delay(200).toggleClass('active');
    }
}

module.exports = {
    init: init
};
