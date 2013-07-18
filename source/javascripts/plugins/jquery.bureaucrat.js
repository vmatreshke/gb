/*!
 * jQuery Bureaucrat Plugin
 *
 * (c) Vadim Borodean, 2012-2013
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details.
 */

(function ($) {

    'use strict';

    var methods;

    methods = {

        init: function (options) {
            var settings = $.extend({
                validationsDataAttr: 'validate'
            }, options);
            return this.each(function () {
                var $form = $(this);
                $form
                    .data('bureaucrat', {
                        names: (function () {
                            var
                                fields = $form.find('[name]'),
                                result = {};
                            fields.each(function () {
                                var
                                    $field = $(this),
                                    name = $field.attr('name'),
                                    validationsData = $field.data(settings.validationsDataAttr);
                                if (result[name] === undefined) {
                                    result[name] = {
                                        elements: $field
                                    };
                                } else {
                                    result[name].elements = result[name].elements.add(this);
                                }
                                if (validationsData) {
                                    result[name].validations = validationsData.split(/\s+/);
                                }
                            });
                            return result;
                        }()),
                        settings: settings
                    })
                    .on('change.bureaucrat input.bureaucrat keydown.bureaucrat cut.bureaucrat paste.bureaucrat', 'textarea, :textbox', function (event) {
                        var
                            $target = $(this),
                            value;
                        if (event.type === 'keydown') {
                            value = $target.val();
                            window.setTimeout(function () {
                                if ($target.val() !== value) {
                                    $target.trigger('b:change');
                                }
                            }, 0);
                        } else {
                            if ($target.val() !== value) {
                                $target.trigger('b:change');
                            }
                        }
                    })
                    .on('change.bureaucrat', ':tickbox', function () {
                        $(this).trigger('b:change');
                    })
                    .on('change.bureaucrat keyup.bureaucrat', 'select', function () {
                        $(this).trigger('b:change');
                    })
                    .on('b:change.bureaucrat', '[name]', function () {
                        $form.data('bureaucrat').names[$(this).attr('name')].validated = false;
                    });
            });
        },

        destroy: function () {
            return this.each(function () {
                var $form = $(this);
                $form
                    .off('.bureaucrat')
                    .removeData('bureaucrat');
            });
        },

        validate: function () {
            var
                $form = $(this),
                complete = true,
                form = this;
            $.each($form.data('bureaucrat').names, function (name) {
                var
                    valid = true,
                    passed = [],
                    failed = [];
                if (this.validations !== undefined && this.elements.not(':disabled').size() > 0) {
                    if (!this.validated) {
                        this.validated = true;
                        $.each(this.validations, function () {
                            if ($.bureaucrat.validations[this].call(form, name)) {
                                passed.push(this);
                            } else {
                                failed.push(this);
                                valid = false;
                            }
                        });
                        this.valid = valid;
                        this.elements.trigger({
                            type: valid ? 'b:valid' : 'b:invalid',
                            validations: valid ? passed : failed
                        });
                    }
                    complete = this.valid ? complete : false;
                }
            });
            if (complete) {
                $form.trigger('b:complete');
            }
            // LURK: Maybe return not Boolean but jQuery collection?
            return complete;
        },

        value: function (name) {
            var
                $form = $(this),
                data = $form.data('bureaucrat'),
                series;
            if (data.names[name] !== undefined) {
                series = data.names[name].elements.serializeArray()[0];
                if (series !== undefined) {
                    return series.value;
                }
            }
        }

    };

    $.bureaucrat = {};

    $.bureaucrat.validations = {

        email: function (name) {
            return (/^\S+@\S+\.\S+$/).test($(this).bureaucrat('value', name));
        },

        required: function (name) {
            return !!$(this).bureaucrat('value', name);
        }

    };

    $.extend($.expr.pseudos, {

        'textbox': function (element) {
            var nodeName = element.nodeName.toLowerCase();
            return (
                nodeName === 'input' &&
                $.inArray(element.type, [
                        'text', 'password', 'color', 'date', 'datetime', 'datetime-local',
                        'email', 'month', 'number', 'search', 'tel', 'time', 'url', 'week'
                    ]) !== -1
            );
        },

        'tickbox': function (element) {
            return (
                element.nodeName.toLowerCase() === 'input' &&
                $.inArray(element.type, ['checkbox', 'radio']) !== -1
            );
        }

    });

    $.fn.bureaucrat = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        $.error('Method ' +  method + ' does not exist on jQuery.bureaucrat');
    };

}(jQuery));