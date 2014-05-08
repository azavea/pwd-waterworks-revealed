var WR = WR || {};

WR.App = (function() {
    'use strict';

    // General UI stuff, including panel and pages
    var UI = (function() {
        var snap;

        var initSnap = function() {
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
        };
        var toggleMenu = function() {
            if( snap.state().state == "left" ){ 
                snap.close();
            } else {
                snap.open('left');
            }
        };
        var togglePages = function(e) {
            e.preventDefault();
            var target = $(this).attr('data-page');
            var activePage = $('#content').find('.page.active').attr('id');

            if ( activePage === target ){}
            else {
                $('#' + activePage).fadeOut(200).delay(200).toggleClass('active');
                $('#' + target).fadeIn(200).delay(200).toggleClass('active');
            }
        };

        return {
            init: function() {
                // Need these to not allow overscrolling
                $(window).bind('touchmove', function(e) { e.preventDefault(); });
                $('body').on('touchmove','.scrollable', function(e) { e.stopPropagation(); });

                initSnap();
                $('.menu-link').on('click', toggleMenu);
                $('.menu').on('click', 'a', togglePages);
            }
        };
    })();

    // Cards
    var Cards = (function() {
        var navigateCards = function(e) {
            e.preventDefault();

            var action = $(this).attr('data-navigate');
            var $thisCard = $(this).closest('.card');

            if (action === 'next') {
                $thisCard.toggleClass('prev active')
                         .next()
                         .toggleClass('next active')
                         .nextAll();
            } else if (action === 'prev') {
                $thisCard.toggleClass('next active')
                         .prev()
                         .toggleClass('prev active')
                         .nextAll();
            } else if (action === 'close') {
                $thisCard.closest('.overlay')
                         .fadeOut(400);
            }
        };

        return {
            init: function() {
                $('.card a[data-navigate]').on('click', navigateCards);
            }
        };
    })();

    // Initialize
    var init = function () {
        UI.init();
        Cards.init();
    };

    return {
        init: init
    };
})();

jQuery(function ($) {
    WR.App.init();
});