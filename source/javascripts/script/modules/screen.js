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