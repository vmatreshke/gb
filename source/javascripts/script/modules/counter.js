(function ($) {

    'use strict';

    var Counter = app.classes.Counter = function (selector) {

        var element = $(selector);
        var html = element.html();

        var value = parseInt(html, 10);

        element.kCounter({
            duration: 300,
            height: element.height(),
            width:  Math.round (element.width() / html.length)
        });

        function getValue() {
            return value;
        }

        function setValue(newValue) {
            element.kCounter('update', newValue);
            value = newValue;
        };

        return {
            element: element,
            getValue: getValue,
            setValue: setValue
        };

    };

    app.module({
        init: function () {
            $('.counter').each(function () {
                $(this).data('app:counter', new Counter(this));
            });
        }
    });

}(jQuery));