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