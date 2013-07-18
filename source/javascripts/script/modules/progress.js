(function ($) {

    'use strict';

    var Progress = app.classes.Progress = function (selector) {

        var element = $(selector);
        var counter = element.find('.counter');
        var progress = element.find('.progress-progress').not('.progress-progress-achievement');
        var achievement = element.find('.progress-progress-achievement');

        function achieve(value) {
            if (achievement.size() <= 0) return;

            var achievementWidth = parseInt(achievement.get(0).style.width, 10);
            var progressWidth = parseInt(progress.get(0).style.width, 10);
            var counterApi = counter.data('app:counter');

            var shield = $(document.createElement('div'));
            shield.addClass('progress-shield');
            shield.text('+' + value);
            shield.appendTo(element);
            shield.css({
                marginLeft: shield.outerWidth() / -2,
                left: progress.width()
            });

            progress.css({
                width: progressWidth + achievementWidth + '%'
            });

            achievement.css({
                marginLeft: -achievementWidth + '%'
            });

            shield.animate({
                left: progress.width()
            }, 300);
            shield.delay(1500);
            shield.fadeOut(300, function () {
                shield.remove();
            });

            achievement.animate({
                marginLeft: 0,
                width: 0
            }, 300, function () {
                achievement.remove();
            });

            counterApi.setValue(parseInt(counterApi.getValue() + value));
        }

        return {
            achieve: achieve,
            element: element
        }
    };

    app.module({
        init: function () {
            $('.progress').each(function () {
                $(this).data('app:progress', new Progress(this));
            });
        }
    });

}(jQuery));