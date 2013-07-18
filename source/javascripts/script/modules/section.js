(function ($) {

    'use strict';

    var Section = app.classes.Section = function (selector) {

        var _self = this;

        _self.element = $(selector);
        var _toggles = _self.element.find('.section-toggle > li');
        var _views   = _self.element.find('.section-view');
        var _wrap    = _self.element.find('.section-inner');

        _self.stateIndex = _toggles.index(_toggles.filter('.is-active'));

        _self.toggle = function (nextStateIndex) {
            if (_self.stateIndex !== nextStateIndex) {

                _toggles.removeClass('is-active').eq(nextStateIndex).addClass('is-active');

                var viewPrev = _views.eq(_self.stateIndex);
                var viewNext = _views.eq(nextStateIndex);

                var heightPrev = viewPrev.height();
                _wrap.height(heightPrev);

                viewPrev.removeClass('is-active');
                viewNext.addClass('is-active');

                var heightNext = viewNext.height();
                _wrap.animate({
                    height: heightNext
                }, 300);

                _self.stateIndex = nextStateIndex;
            }
        };

        _self.element.on('click.section', '.section-toggle > li', function () {
            _self.toggle($(this).index());
        });

        return _self;

    };

    app.module({
        init: function () {
            app.sections = [];
            $('.section').each(function () {
                $(this).data('app:section', new Section(this));
            });
        }
    });

}(jQuery));