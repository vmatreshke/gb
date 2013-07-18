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