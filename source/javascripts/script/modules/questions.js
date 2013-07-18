(function ($) {

    'use strict';

    var Questions = app.classes.Questions = function (selector) {

        var _element  = $(selector);
        var _nav      = _element.children('.questions-nav');
        var _caret    = _nav.children('.questions-caret');

        var _window   = $(window);
        var _navClone = _nav.clone().addClass('invisible').insertBefore(_nav);

        //
        // Находим первого прокручивающегося родителя
        //

        var _scrollable;

        _element.parents().each(function () {
            var element = $(this);
            if (element.scrollTop() === 0) {
                element.scrollTop(1);
            }
            if (element.scrollTop() > 0) {
                _scrollable = element;
                return false;
            }
        });

        //
        // Метод _updateDimensions
        //

        var _elementHeight, _navHeight;
        var _offset, _offsetScrollMax;
        var _map;

        function _updateDimensions() {
            _elementHeight = _element.height();
            _navHeight = _navClone.height();
            _offset = _element.offset().top;
            _offsetScrollMax = _elementHeight - _navHeight;
            _map = [];
            _navClone.find('a').each(function () {
                _map.push({
                    main: $(this.hash).offset().top - _offset,
                    nav:  $(this).offset().top - _offset
                });
            });
            _map.push({
                main: _elementHeight,
                nav: _navHeight
            });
        }

        //
        // Метод _mapOffset
        //

        function _mapOffset(offset) {
            var i = 0;
            var length = _map.length;
            while (i < length) {
                if (_map[i].main > offset) {
                    var scale = (_map[i].nav - _map[i - 1].nav) / (_map[i].main - _map[i - 1].main);
                    return _map[i - 1].nav + (offset - _map[i - 1].main) * scale;
                }
                i++;
            }
        }

        //
        // Метод _updateOffsets
        //

        var _position = '';

        function _updateOffsets() {
            var offsetScroll = _scrollable.scrollTop() - _offset;
            var position = (offsetScroll > 0) ? (offsetScroll > _elementHeight - _navHeight) ? 'bottom' : 'fixed' : '';

            if (offsetScroll > 0) {
                if (offsetScroll > _offsetScrollMax) {
                    offsetScroll = _offsetScrollMax;
                    position = 'bottom';
                } else {
                    position = 'fixed';
                }
            } else {
                offsetScroll = 0;
                position = '';
            }

            if (position !== _position) {
                _position = position;
                _nav.removeClass('questions-nav-bottom questions-nav-fixed');
                if (position === 'fixed') {
                    _nav.addClass('questions-nav-fixed');
                } else {
                    _nav.removeAttr('style');
                    if (position === 'bottom') {
                        _nav.addClass('questions-nav-bottom');
                    }
                }
            }

            if (position === 'fixed') {
                _nav.css({
                    left: _navClone.offset().left,
                    width: _navClone.width()
                });
            }

            var caretTop = _mapOffset(offsetScroll);
            var caretHeight = _mapOffset(offsetScroll + _window.height()) - caretTop;
            _caret.css({
                height: caretHeight,
                top: caretTop
            });
        }

        //
        // Метод this.update
        //

        this.update = function (updateDimensions) {
            if (updateDimensions) {
                _updateDimensions();
            }
            _updateOffsets();
        };

        //
        // Вешаем обработчики событий -- и мы молодцы
        //

        _window
            .on('scroll', $.proxy(this.update))
            .on('resize', $.proxy(this.update, this, true));

        _nav.on('click', 'a', function (event) {
            _scrollable.animate({
                scrollTop: $(event.target.hash).offset().top
            }, 150);
            event.preventDefault();
        });

        this.update(true);
    };

    app.module({
        init: function () {
            $('.questions').each(function () {
                new Questions(this);
            });
        }
    });

}(jQuery));