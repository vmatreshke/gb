(function ($) {

    'use strict';

    app.module({
        init: function () {

            var Carousel = app.classes.Carousel = {

                element: null,
                settings: null,

                init: function (selector, options) {

                    var that = this;
                    this.element = $(selector);
                    this.settings = $.extend({
                        duration: 500,
                        durationNail: 150,
                        easingHide: 'easieEaseInOutCubic',
                        easingShow: 'easieEaseInOutCubic'
                    }, options);

                    this.element.on('click', '.certificate.is-clickable', function () {
                        that.showFrame(this);
                    });

                    this.element.on('mouseenter', '.certificate.is-clickable', function () {
                        that.hintFrame(this);
                    });

                    this.element.on('mouseleave', '.certificate.is-clickable', function () {
                        that.unhintFrame(this);
                    });

                    this.showFrame(this.element.find('.certificate').first());

                    return this;
                },

                hintFrame: function (selector) {
                    var frame = $(selector);
                    var frameIndex = frame.index();
                    frame.stop().animate({
                        left: frameIndex === 0 ? '2%' : '98%'
                    });
                },

                unhintFrame: function (selector) {
                    var frame = $(selector);
                    var frameIndex = frame.index();
                    frame.stop().animate({
                        left: frameIndex === 0 ? 0 : '100%'
                    });
                },

                showFrame: function (selector) {

                    var that = this;

                    var frame = $(selector);
                    var frameNail = frame.find('.certificate-nail');
                    var frameOther = frame.siblings('.certificate');
                    var frameOtherNail = frameOther.find('.certificate-nail');
                    var frameOtherIndex = frameOther.index();

                    frame.removeClass('is-clickable');
                    frame.stop().animate({
                        fontSize: 100,
                        left: '50%',
                        opacity: 1
                    }, this.settings.duration, this.settings.easingShow);

                    frameOther.stop().animate({
                        fontSize: 32,
                        left: frameOtherIndex === 0 ? 0 : '100%',
                        opacity: 0.4
                    }, this.settings.duration, this.settings.easingHide);
                    frameOtherNail.fadeOut(0);

                    frame.promise().done(function () {
                        frameNail.fadeIn(that.settings.durationNail);
                    });

                    frameOther.add(frameNail).add(frameOtherNail).promise().done(function () {
                        frameOther.addClass('is-clickable');
                    });
                }
            };

            if (!Object.create) {
                Object.create = function (prototype) {
                    function Type() {}
                    Type.prototype = prototype;
                    return new Type();
                };
            }

            Object.create(Carousel).init('.promo-certificates');

        }
    });

}(jQuery));