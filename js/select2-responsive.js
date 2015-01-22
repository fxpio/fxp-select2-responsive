/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global jQuery*/
/*global window*/
/*global document*/
/*global Select2Responsive*/

/**
 * @param {jQuery} $
 *
 * @typedef {object}            define.amd
 * @typedef {Select2Responsive} Select2Responsive
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'select2'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Action on click to cancel button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2} Event.data The select2 instance
     *
     * @private
     */
    function onCancelAction(event) {
        event.preventDefault();
        event.stopPropagation();
        event.data.close();
    }

    /**
     * Action on opened select2 dropdown.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2Responsive} Event.data The select2 responsive instance
     *
     * @private
     */
    function onOpen(event) {
        var self = event.data,
            select2 = self.$element.data('select2'),
            $dropdown = select2.dropdown;

        $dropdown.addClass('select2-drop-responsive');
        select2.container.addClass('select2-drop-responsive');
        $('.select2-drop-mask').addClass('select2-drop-responsive');
        $dropdown.on('click.st.select2responsive', '.select2-drop-footer .select2-btn-cancel', select2, onCancelAction);

        if (0 === $('.select2-drop-footer', $dropdown).size()) {
            $dropdown.append(
                '<div class="select2-drop-footer">' +
                    '<span class="select2-drop-footer-btn select2-btn-cancel">' +
                        '<a href="#" tabindex="-1">' + self.options.cancel + '</a>' +
                    '</span>' +
                '</div>'
            );
        }
    }

    /**
     * Action on closed select2 dropdown.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2Responsive} Event.data The select2 responsive instance
     *
     * @private
     */
    function onClose(event) {
        var self = event.data,
            select2 = self.$element.data('select2'),
            $dropdown = select2.dropdown;

        $dropdown.off('click.st.select2responsive', '.select2-drop-footer .select2-btn-cancel', onCancelAction);
        $dropdown.removeClass('select2-drop-responsive');
        select2.container.addClass('select2-drop-responsive');
        $('.select2-drop-mask').removeClass('select2-drop-responsive');
    }

    // SELECT2 RESPONSIVE CLASS DEFINITION
    // ===================================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this Select2Responsive
     */
    var Select2Responsive = function (element, options) {
        var select2;

        this.options  = $.extend(true, {}, Select2Responsive.DEFAULTS, options);
        this.$element = $(element);

        this.$element
            .on('select2-open.st.select2responsive', null, this, onOpen)
            .on('select2-close.st.select2responsive', null, this, onClose);

        select2 = this.$element.data('select2');

        if ('resolve' === select2.opts.width) {
            select2.container.css('width', '');
        }
    },
        old;

    /**
     * Defaults options.
     *
     * @type {object}
     */
    Select2Responsive.DEFAULTS = {
        cancel: 'Cancel'
    };

    /**
     * Destroy instance.
     *
     * @this Select2Responsive
     */
    Select2Responsive.prototype.destroy = function () {
        var select2 = this.$element.data('select2');
        select2.close();
        this.$element
            .off('select2-open.st.select2responsive', onOpen)
            .off('select2-close.st.select2responsive', onClose);

        this.$element.removeData('st.select2responsive');
    };


    // SELECT2 RESPONSIVE PLUGIN DEFINITION
    // ====================================

    function Plugin(option, value) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.select2responsive'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                $this.data('st.select2responsive', (data = new Select2Responsive(this, options)));
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    old = $.fn.select2Responsive;

    $.fn.select2Responsive             = Plugin;
    $.fn.select2Responsive.Constructor = Select2Responsive;


    // SELECT2 RESPONSIVE NO CONFLICT
    // ==============================

    $.fn.select2Responsive.noConflict = function () {
        $.fn.select2Responsive = old;

        return this;
    };


    // SELECT2 RESPONSIVE DATA-API
    // ===========================

    $(window).on('load', function () {
        $('[data-select2-responsive="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));
