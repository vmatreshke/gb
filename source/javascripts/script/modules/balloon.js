(function ($) {

    'use strict';

    var easing = $.easie(0.6, -0.15, 0.73, 0.05);

    var Balloon = app.classes.Balloon = function (selector) {

        var element = $(selector);

        function vanish() {
            var body = element.children('.balloon-body');
            var shadow = element.children('.balloon-shadow');
            var achievementValue = parseInt(body.children('.balloon-label').text());

            body.animate({
                top:  '-=' + (body.offset().top + body.height() + 200)
            }, 6000, easing);

            shadow.animate({
                top:  '-=' + (shadow.offset().top + shadow.height())
            }, 6000, easing);

            body.add(shadow).promise().done(function () {
                element.remove();
            });

            var progress = $('.progress');
            if (progress.size() > 0) {
                setTimeout(function () {
                    progress.data('app:progress').achieve(achievementValue);
                }, 5500);
            }
        }

        return {
            element: element,
            vanish: vanish
        };
    };

    app.module({
        init: function () {
            $('.balloon').each(function () {
                var balloon = new Balloon(this);
                $(this).data('app:balloon', balloon);
            });
        }
    });

}(jQuery));