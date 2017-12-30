/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
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
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'select2/dist/js/select2'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Action on click to close button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2} Event.data The select2 instance
     *
     * @private
     */
    function onCloseButtonAction(event) {
        event.preventDefault();
        event.stopPropagation();
        event.data.close();
    }

    /**
     * Check if the dropdown is in the responsive mode.
     *
     * @param {*|jQuery|null} $mask
     *
     * @returns {boolean}
     */
    function isInResponsiveMode($mask) {
        return $mask instanceof jQuery && 1 === parseInt($mask.css('opacity'));
    }

    /**
     * Resize the height max of dropdown.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2Responsive} Event.data The select2 responsive instance
     *
     * @private
     */
    function resizeHeightMax(event) {
        var self = event.data,
            select2 = self.$element.data('select2'),
            $drop = $('.select2-dropdown', select2.$dropdown),
            top = parseInt(select2.$dropdown.css('margin-top'), 10),
            bottom = parseInt(select2.$dropdown.css('margin-bottom'), 10),
            windowHeight = $(window).height(),
            currentHeight = $drop.outerHeight(),
            resultsHeight = select2.$results.outerHeight(),
            maxHeight;

        if (0 === currentHeight) {
            return;
        }

        top = isNaN(top) ? 0 : top;
        bottom = isNaN(bottom) ? 0 : bottom;
        maxHeight = windowHeight - top - bottom - (currentHeight - resultsHeight);

        select2.$results.css('max-height', maxHeight+'px');

        if (undefined !== self.$multiSearchField && undefined !== self.$cloneMultiSearch) {
            self.$multiSearchField.css({
                position: 'fixed',
                margin: '0',
                padding: self.$cloneMultiSearch.css('padding'),
                top: (self.$cloneMultiSearch.offset().top - $(window).scrollTop()) + 'px',
                left: self.$cloneMultiSearch.offset().left + 'px',
                height: self.$cloneMultiSearch.outerHeight() + 'px',
                border: self.$cloneMultiSearch.css('border'),
                background: self.$cloneMultiSearch.css('background'),
                'min-width': self.$cloneMultiSearch.outerWidth() + 'px',
                'max-width': self.$cloneMultiSearch.outerWidth() + 'px'
            });
        }
    }

    /**
     * Create the mask of dropdown.
     *
     * @param {String} [name]
     *
     * @returns {*|jQuery|HTMLElement}
     *
     * @private
     */
    function createMask(name) {
        var $mask = $('<div class="select2-dropdown-responsive-mask' + (undefined !== name ? '-' + name : '') + '"></div>');
        $mask.css({
            'position': 'fixed',
            'left': 0,
            'right': 0,
            'top': 0,
            'bottom': 0
        });

        $('body').append($mask);

        return $mask;
    }

    /**
     * Prevent the click action on search field, only for multiple.
     *
     * @param {jQuery.Event|Event} event
     *
     * @private
     */
    function preventMultiSearchAction(event) {
        event.preventDefault();
        event.stopPropagation();
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
            select2 = self.$element.data('select2');

        // 2nd call
        if (null !== self.$mask) {
            return;
        }

        self.$mask = createMask();

        // responsive mode
        if (!isInResponsiveMode(self.$mask)) {
            return;
        }

        self.$maskOpening = createMask('opening');
        setTimeout(function() {
            self.$maskOpening.remove();
            delete self.$maskOpening;
        }, 100);

        select2.$container.addClass('select2-container-responsive');
        select2.$dropdown.addClass('select2-dropdown-responsive');
        select2.$dropdown.on('click.fxp.select2responsive', '.select2-drop-footer .select2-btn-close', select2, onCloseButtonAction);

        if (0 === $('.select2-drop-footer', select2.$dropdown).length) {
            select2.$results.parent().after(
                '<div class="select2-drop-footer">' +
                    '<span class="select2-drop-footer-btn select2-btn-close">' +
                        '<a href="#" tabindex="-1">' + self.options.close + '</a>' +
                    '</span>' +
                '</div>'
            );
        }

        // multiple search header
        self.$multiSearchField = $('.select2-selection--multiple .select2-search__field', select2.$container);

        if (1 === self.$multiSearchField.length) {
            self.$cloneMultiSearch = self.$multiSearchField.clone(true).off();
            self.$cloneMultiSearch.addClass('multi-responsive');
            self.$dropMultiSearch = $('<span class="select2-search select2-search--dropdown"></span>');
            self.$dropMultiSearch.append(self.$cloneMultiSearch);
            select2.$results.parent().parent().prepend(self.$dropMultiSearch);
            self.$multiSearchField.on('click.fxp.select2responsive', null, self, preventMultiSearchAction);
        }

        resizeHeightMax(event);
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
            $dropdown = select2.$dropdown;

        $dropdown.off('click.fxp.select2responsive', '.select2-drop-footer .select2-btn-close', onCloseButtonAction);
        select2.$container.removeClass('select2-container-responsive');
        select2.$dropdown.removeClass('select2-dropdown-responsive');

        if (null !== self.$mask) {
            self.$mask.remove();
            self.$mask = null;
        }
        if (undefined !== self.$maskOpening) {
            self.$maskOpening.remove();
            delete self.$maskOpening;
        }

        if (undefined !== self.$dropMultiSearch) {
            self.$dropMultiSearch.remove();
            self.$multiSearchField.off('click.fxp.select2responsive', preventMultiSearchAction);
            self.$multiSearchField.css({
                position: '',
                border: '',
                top: '',
                left: '',
                height: '',
                width: '',
                padding: '',
                'min-width': '',
                'max-width': '',
                margin: '',
                'background': ''
            });
            self.$multiSearchField.css('width', '0.75em');
            delete self.$cloneMultiSearch;
            delete self.$dropMultiSearch;
            delete self.$multiSearchField;
        }
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
        this.options  = $.extend(true, {}, Select2Responsive.DEFAULTS, options);
        this.$element = $(element);
        this.$mask = null;

        this.$element
            .on('select2:open.fxp.select2responsive', null, this, onOpen)
            .on('select2:close.fxp.select2responsive', null, this, onClose);

        $(window).on('resize.fxp.select2responsive', null, this, resizeHeightMax);
    },
        old;

    /**
     * Defaults options.
     *
     * @type {object}
     */
    Select2Responsive.DEFAULTS = {
        close: 'Close'
    };

    /**
     * Destroy instance.
     *
     * @this Select2Responsive
     */
    Select2Responsive.prototype.destroy = function () {
        var select2 = this.$element.data('select2'),
            $dropFooter = $('.select2-drop-footer', select2.$dropdown);

        select2.close();

        if (null !== this.$mask) {
            this.$mask.remove();
        }

        if (0 === $dropFooter.length) {
            $dropFooter.remove();
        }

        $(window).off('resize.fxp.select2responsive', resizeHeightMax);

        this.$element
            .off('select2:open.fxp.select2responsive', onOpen)
            .off('select2:close.fxp.select2responsive', onClose);

        this.$element.removeData('st.select2responsive');
    };


    // SELECT2 RESPONSIVE PLUGIN DEFINITION
    // ====================================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

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
                data[option].apply(data, args);
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
