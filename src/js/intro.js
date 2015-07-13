'use strict';

var $ = require('jquery');

var $introduction = $('#introduction'),
    $circle = $('#overlay-circle');

module.exports = {
    init: function (options) {

        setAnimationHeight();

        $(window).resize(function(){
            setAnimationHeight();
        });

        $introduction.on('click', animateOpenCircle);

        $('#button-close-introduction').on('click', animateSwitchMap);

        // TODO: Switch to bootstrap's $.support.transition.end; see http://stackoverflow.com/a/13862291
        $introduction.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
            if ($(e.target).hasClass('introduction')) {
                $introduction.addClass('hidden');
            }
        });

    }
};

function setAnimationHeight() {
    var animationHeight = window.innerHeight - $('#align-footer').outerHeight() - $('#align-heading').outerHeight();
    $('#align-animation').height(animationHeight);
}

function isOdd(num) {
    return num % 2;
}

function makeEvenInt(num) {
    var numInt = parseInt(num);
    if (isOdd(numInt)) {
        numInt += 1;
    }
    return (numInt);
}

function animateModalOverlay() {
    var $modaloverlay = $('#introduction-modaloverlay');
    $modaloverlay.addClass('active');
    $('.title').hide();
}

function animateOpenCircle() {
    var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        // maxDimension is multiplied by 2 to ensure that circle expands off screen
        maxDimension = (windowWidth > windowHeight ? windowWidth : windowHeight) * 2;
    $circle.animate({width: maxDimension, height: maxDimension}, {
        duration: 1000,
        step: function(now, fx){
            fx.now = makeEvenInt(now);
        },
        complete: animateModalOverlay,
    });

    // Fallback in case complete callback doesn't fire.
    setTimeout(animateModalOverlay, 1500);
}

function animateSwitchMap() {
    $introduction.removeClass('active');
}
