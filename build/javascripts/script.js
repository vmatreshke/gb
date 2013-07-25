(function() {

    'use strict';

    var method;
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed',
        'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp',
        'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];
        if (!console[method]) {
            console[method] = $.noop;
        }
    }
}());
(function ($) {

    'use strict';

    $(document).ready(function () {
        $('html').removeClass('no-js').addClass('js');
    });

    window.app = {

        classes: {},

        debug: true,

        log: function () {
          if (app.debug) {
            console.log.apply(console, Array.prototype.slice.call(arguments, 0));
          }
        },

        module: function (module) {
            if (typeof module.init === 'function') {
                $(document).on('ready', module.init);
            }
            return module;
        }
    };

}(jQuery));
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
(function ($) {

    app.module({
        init: function () {

          var initChoice = function (selector) {

            function updateInputs(selector) {
              $(selector).each(function () {
                var $this = $(this);
                $this.parent('.choice-option').toggleClass('is-checked', $this.prop('checked'));
              });
            }

            $(selector).each(function () {
              var $container, $inputs;
              $container = $(this);
              $inputs = $container.find('input');

              if ($inputs.attr('type') === 'radio') {
                $container.on('change', 'input', function () {
                  updateInputs($inputs);
                });
              } else {
                $container.on('change', 'input', function () {
                  updateInputs(this);
                });
              }
              $container.on('click', function () {
                updateInputs($inputs);
              });

              updateInputs($inputs);
            });
          };

          initChoice('.choice');

        }
    });

}(jQuery));
(function ($) {

    app.module({
        init: function () {

          $('.promo-council').each(function () {
            var showcase = $(this);
            var images = showcase.find('.promo-council-image');

            var popover = showcase.find('.promo-popover');
            var popoverArrow = popover.find('.promo-popover-arrow');
            var popoverContent = popover.find('.promo-popover-inner');

            var currentRowIndex = 0;

            showcase.on('click', '.promo-council-image:not(.is-active)', function () {
              var image = $(this);
              var item = image.parents('.promo-council-item');
              var row  = item.parents('.promo-council-row');
              var rows = row.siblings('.promo-council-row').andSelf();

              images.removeClass('is-active');
              image.addClass('is-active');

              var rowIndex = rows.index(row);
              var height = popoverContent.height();
              if (rowIndex !== currentRowIndex) {
                if (currentRowIndex < rows.size() - 1) {
                  var placeholder = $('<div></div>');
                  placeholder.insertBefore(popover).height(height + 64).animate({
                    height: 1
                  }, 300, function () {
                    $(this).remove();
                  });
                }
                popover.insertAfter(row);
                height = (rowIndex === currentRowIndex) ? height : 0;
                currentRowIndex = rowIndex;
              }

              popoverArrow.animate({
                left: 33.3 * item.index() + '%'
              }, 300);

              popoverContent.html(item.find('.promo-council-popover').html());
              var newHeight = popoverContent.height();
              popoverContent.height(height).animate({
                height: newHeight
              }, 300, function () {
                $(this).height('auto');
              });

            });
          });

        }
    });

}(jQuery));
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
(function ($) {

    'use strict';

    var ModalContainer = app.classes.ModalContainer = function (selector) {

        var _self = this;

        _self.element = $(selector);

        _self.show = function (selector) {
            var modal = _self.element.find(selector);
            modal.addClass('is-active').siblings().removeClass('is-active');
            _self.element.addClass('is-active');
        };

        this.hide = function () {
            _self.element.find('.modal.is-active').removeClass('is-active');
            _self.element.removeClass('is-active');
        };

        _self.element.on('click.modal', function () {
            _self.hide();
        });
        _self.element.on('click.modal', '.l-modals-inner', function (event) {
            event.stopPropagation();
        });

        return this;

    };

    app.module({
        init: function () {
            if ($('.l-modals').size() > 0) {
                app.modals = new ModalContainer('.l-modals');
                $(document).on('click.modal', '[data-toggle="modal"]', function () {
                    app.modals.show($(this).data('href'));
                });
            }
        }
    });

}(jQuery));
(function ($) {

   // alert('a');

var scrollorama = $.scrollorama({ blocks:'.parallax-layer' });
scrollorama
	.animate('#layer1',{ duration:1000, property:'top', start:80, end: -100 })
	.animate('#layer2',{ duration: 1000, property:'top', start:0, end: -100 })
	// .animate('#layer1',{ duration:1000, property:'top', start:-100, end: 80 })
	// .animate('#layer2',{ duration: 1000, property:'top', start:-100, end: 0 })

}(jQuery));
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
(function ($) {

    app.module({
        init: function () {

      $('.promo-screen').each(function () {
        var screen = $(this);
        var nav = screen.children('.promo-screen-nav');
        var main = screen.find('.promo-screen-main');
        var mediaLarge = screen.find('.media.media-large');
        var height = mediaLarge.height();
        var width = mediaLarge.width();

        function update(target) {

            var media = $(document.createElement('a'));
            media.addClass('media media-large');
            media.attr({
              href: $(target).attr('href')
            });
            media.css({
              width: width,
              height: height
            });
            main.empty().append(media);
            mediaObject = new app.Media(media);
            mediaObject.play();

        }

        nav.on('click', '.media', function (event) {
          $(this).parents('.promo-screen-item').addClass('is-active').siblings().removeClass('is-active');
          update(this);
          event.preventDefault();
        });
      });

        }
    });

}(jQuery));
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
(function ($) {

    app.module({
        init: function () {

        $('.promo-slides').each(function () {
          var slides = $(this);
          var nav = slides.children('.promo-slides-nav');
          var panes = slides.children('.promo-slides-main').children('.promo-slides-pane');
          nav.on('click', 'li', function () {
            var target = $(this);
            target.addClass('is-active').siblings().removeClass('is-active');
            var index = target.index();
            panes.removeClass('is-active').eq(index).addClass('is-active');
          });
        });

        }
    });

}(jQuery));
(function ($) {

    'use strict';

    app.module({
        init: function () {
            $('[data-bureaucrat]').each(function () {
                var form = $(this);
                var submit = form.find('[type=submit]');
                form
                    .on('b:complete b:invalid', function (event) {
                        var disabled = (event.type === 'b:invalid')
                        submit.toggleClass('is-disabled', disabled);
                        submit.prop('disabled', disabled);
                    })
                    .on('b:valid b:invalid', '[data-validate*=email]', function (event) {
                        $(this).toggleClass('has-error', event.type === 'b:invalid');
                    })
                    .on('b:change', function () {
                        form.bureaucrat('validate');
                    })
                    .bureaucrat()
                    .bureaucrat('validate');
            });
        }
    });

}(jQuery));



