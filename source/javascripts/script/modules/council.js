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