(function ($) {

    'use strict';

    var Elevator = app.classes.Elevator = function (selector, options) {

        var o = $.extend({
            activeClass: 'is-active',
            doneClass:   'is-done',
            errorClass:  'is-error',
            levelSelector: '> ul > li'
        }, options);

        var element = $(selector);

        var stateClasses = [o.activeClass, o.doneClass, o.errorClass].join(' ');

        var levels = element.find(o.levelSelector);
        var levelIndex = levels.index(levels.filter('.' + o.activeClass));
        var levelCount = levels.size();

        function animateClass(element, newStateClass) {
            var elementHeight = element.outerHeight();
            var elementWidth  = element.outerWidth();

            var stage = $(document.createElement('li'));
            stage.css({
                width: elementWidth,
                height: elementHeight,
                position: 'relative'
            });

            var orderClasses = [];
            if (element.is(':first-child')) orderClasses.push('first-child');
            if (element.is(':last-child'))  orderClasses.push('last-child');
            orderClasses = orderClasses.join(' ');

            var prevState = element.clone().addClass(orderClasses);
            prevState.appendTo(stage);

            element.removeClass(stateClasses).addClass(newStateClass);

            var nextState = $(document.createElement('div'));
            nextState.append(element.clone()).addClass(orderClasses).css({
                position: 'absolute',
                height: 0,
                right: 0,
                left: 0,
                top: 0
            }).appendTo(stage);

            stage.insertAfter(element.hide());
            nextState.animate({
                height: elementHeight
            }, 500, function () {
                stage.remove();
                element.show();
            });
        }

        function animateBounce(element, bounces, speed) {
            var distance = Math.pow(2, bounces - 2);
            element.css('position', 'relative');

            for (var i = 0; i < bounces; i++) {
                element.animate({
                    left: distance
                }, speed * (1 - Math.pow(i / bounces, 2)), 'easieEaseOutSine');
                distance = Math.floor(distance / -2);
            }

            element.promise().done(function () {
                element.css({
                    position: '',
                    left: ''
                });
            });
        }

        function fail() {
            var element = $(levels.eq(levelIndex));
            element.removeClass(stateClasses).addClass(o.errorClass);
            animateBounce(element, 6, 60);
        }

        function proceed() {
            if (levelIndex < levelCount) {
                animateClass(levels.eq(levelIndex), o.doneClass);
                if (levelIndex + 1 < levelCount) {
                    animateClass(levels.eq(levelIndex + 1), o.activeClass);
                    levelIndex++;
                }
            }
        }

        return {
            element: element,
            fail: fail,
            proceed: proceed
        };
    };

    app.module({
        init: function () {
            $('.elevator').each(function () {
                $(this).data('app:elevator', new Elevator(this));
            });
        }
    });

}(jQuery));