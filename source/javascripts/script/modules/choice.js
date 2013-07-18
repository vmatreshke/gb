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