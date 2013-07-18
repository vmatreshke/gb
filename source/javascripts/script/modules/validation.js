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