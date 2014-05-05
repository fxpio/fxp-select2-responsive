/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global jQuery*/
/*global window*/
/*global document*/
/*global Select2Responsive*/

/**
 * @param {jQuery} $
 *
 * @typedef {Select2Responsive} Select2Responsive
 */
(function ($) {
    'use strict';

    /**
     * Prevents the default event.
     *
     * @param {jQuery.Event|Event} event
     *
     * @private
     */
    function blockEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Action on click to item.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2} Event.data The select2 instance
     *
     * @private
     */
    function onSelectAction(event) {
        var select2 = event.data;

        select2.highlightUnderEvent(event);
        select2.selectHighlighted(event);
    }

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

        $dropdown.off('mouseup mousedown focusin click touchstart touchmove touchend mousemove-filtered', '.select2-results');
        $dropdown.on('touchmove', '.select2-results', $.proxy(select2.touchMoved, select2));
        $dropdown.on('touchstart touchend', '.select2-results', $.proxy(select2.clearTouchMoved, select2));
        $dropdown.on('click', blockEvent);
        $dropdown.on('mouseup', '.select2-results', select2, onSelectAction);

        if (0 === $('.select2-drop-footer', $dropdown).size()) {
            $dropdown.append([
                '<div class="select2-drop-footer">',
                '<span class="select2-drop-footer-btn select2-btn-cancel">',
                '<a href="#" tabindex="-1">' + self.options.cancel + '</a>',
                '</span>',
                '</div>'
            ].join(''));
        }

        $dropdown.on('click', '.select2-drop-footer .select2-btn-cancel', select2, onCancelAction);

        if (self.options.disableSearchFocus) {
            select2.search.attr('readonly', 'readonly');
            select2.search.blur();
            $dropdown.focus();
            select2.search.removeAttr('readonly');
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
            select2 = self.$element.data('select2');

        select2.dropdown.off('touchmove', '.select2-results');
        select2.dropdown.off('touchstart touchend', '.select2-results');
        select2.dropdown.off('click');
        select2.dropdown.off('mouseup', '.select2-results');
        select2.dropdown.off('click', '.select2-drop-footer .select2-btn-cancel');
    }

    /**
     * Action on clear select2 value.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2} Event.data The select2 instance
     *
     * @private
     */
    function onSelect2Clear(event) {
        var select2 = event.data;

        if (!select2.isInterfaceEnabled()) {
            return;
        }

        select2.clear();
        event.preventDefault();
        event.stopImmediatePropagation();
        select2.close();
        select2.selection.focus();
    }

    /**
     * Action on open select2 dropdown.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2} Event.data The select2 instance
     *
     * @private
     */
    function onSelect2Open(event) {
        var select2 = event.data,
            // Prevent IE from generating a click event on the body
            placeholder = $(document.createTextNode(''));

        select2.selection.before(placeholder);
        placeholder.before(select2.selection);
        placeholder.remove();

        if (!select2.container.hasClass("select2-container-active")) {
            select2.opts.element.trigger($.Event("select2-focus"));
        }

        if (select2.opened()) {
            select2.close();
        } else if (select2.isInterfaceEnabled()) {
            select2.open();
        }

        event.preventDefault();
        event.stopPropagation();
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
        this.options  = $.extend({}, Select2Responsive.DEFAULTS, options);
        this.$element = $(element);

        this.$element.on('select2-open.st.select2responsive', null, this, onOpen);
        this.$element.on('select2-close.st.select2responsive', null, this, onClose);

        var select2 = this.$element.data('select2');

        if (!select2.opts.multiple) {
            select2.selection.off('mousedown touchstart');
            select2.selection.on("click touchend", 'abbr', select2, onSelect2Clear);
            select2.selection.on("click touchend", null, select2, onSelect2Open);
        }

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
        disableSearchFocus: true,
        cancel:             'Cancel'
    };

    /**
     * Destroy instance.
     *
     * @this Select2Responsive
     */
    Select2Responsive.prototype.destroy = function () {
        var select2 = this.$element.data('select2');

        if (!select2.opts.multiple) {
            select2.selection.off("mousedown touchend", 'abbr', onSelect2Clear);
            select2.selection.off("mousedown touchend", onSelect2Open);
        }

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

}(jQuery));
