(function ($) {

    'use strict';

    var Media = app.classes.Media = function (selector) {

        var _element   = $(selector);
        var _thumbnail = _element.children('img');

        var _id = /v=([a-z0-9_-]+)/i.exec(_element.prop('search'))[1];

        var _autoplay = (_element.data('autoplay') === '');
        var _static   = (_element.data('static') === '');

        function _play() {
            var element = $(document.createElement('span'));
            element.addClass(_element.attr('class'));

            var iframe = $(document.createElement('iframe'));
            iframe.attr({
                allowfullscreen: 'allowfullscreen',
                frameborder: 0,
                height: _element.height(),
                src: 'http://www.youtube.com/embed/' + _id + '?autoplay=1',
                width: _element.width()
            });
            iframe.appendTo(element);

            _element.replaceWith(element);
            _element = element;
        }

        if (_autoplay) {
            _play();
        }

        _element.on('click', function (event) {
            if (_static) return;
            _play();
            event.preventDefault();
        });


        return {
            element: _element,
            play: _play
        };
    };

    app.module({
        init: function () {
            app.Media = Media;
            $('.media').each(function () {
                new Media(this);
            });
        }
    });

}(jQuery));