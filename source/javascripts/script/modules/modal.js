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