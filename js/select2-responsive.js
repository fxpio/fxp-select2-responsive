/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

+function ($) {
    'use strict';

    // SELECT2 RESPONSIVE CLASS DEFINITION
    // ===================================

    /**
     * @constructor
     *
     * @param htmlString|Element|Array|jQuery element
     * @param Array                           options
     *
     * @this
     */
    var Select2Responsive = function (element, options) {
        this.options  = $.extend({}, Select2Responsive.DEFAULTS, options);
        this.$element = $(element);

        this.$element.on('select2-open.st.select2responsive', $.proxy(onOpen, this));
        this.$element.on('select2-close.st.select2responsive', $.proxy(onClose, this));

        var select2 = this.$element.data('select2');

        if (!select2.opts.multiple) {
            select2.selection.off('mousedown touchstart');
            select2.selection.on("click touchend", 'abbr', $.proxy(onSelect2Clear, select2));
            select2.selection.on("click touchend", $.proxy(onSelect2Open, select2));
        }

        if ('resolve' == select2.opts.width) {
            select2.container.css('width', '');
        }
    };

    /**
     * Defaults options.
     *
     * @type Array
     */
    Select2Responsive.DEFAULTS = {
        disableSearchFocus: true,
        cancel:             'Cancel'
    };

    /**
     * Destroy instance.
     *
     * @this
     */
    Select2Responsive.prototype.destroy = function () {
        var select2 = this.$element.data('select2');

        if (!select2.opts.multiple) {
            select2.selection.off("mousedown touchend", 'abbr', $.proxy(onSelect2Clear, select2));
            select2.selection.off("mousedown touchend", $.proxy(onSelect2Open, select2));
        }

        this.$element.removeData('st.select2responsive');
    };

    /**
     * Action on clear select2 value.
     *
     * @param jQuery.Event event
     *
     * @this (is select2 instance)
     * @private
     */
    function onSelect2Clear (event) {
        if (!this.isInterfaceEnabled()) return;
        this.clear();
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close();
        this.selection.focus();
    }

    /**
     * Action on open select2 dropdown.
     *
     * @param jQuery.Event event
     *
     * @this (is select2 instance)
     * @private
     */
    function onSelect2Open (event) {
        // Prevent IE from generating a click event on the body
        var placeholder = $(document.createTextNode(''));

        this.selection.before(placeholder);
        placeholder.before(this.selection);
        placeholder.remove();

        if (!this.container.hasClass("select2-container-active")) {
            this.opts.element.trigger($.Event("select2-focus"));
        }

        if (this.opened()) {
            this.close();
        } else if (this.isInterfaceEnabled()) {
            this.open();
        }

        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Action on opened select2 dropdown.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onOpen (event) {
        var select2 = this.$element.data('select2');
        var $dropdown = select2.dropdown;

        $dropdown.off('mouseup mousedown focusin click touchstart touchmove touchend mousemove-filtered', '.select2-results');
        $dropdown.on('touchmove', '.select2-results', $.proxy(select2.touchMoved, select2));
        $dropdown.on('touchstart touchend', '.select2-results', $.proxy(select2.clearTouchMoved, select2));
        $dropdown.on('click', blockEvent);
        $dropdown.on('mouseup', '.select2-results', $.proxy(onSelectAction, select2));

        if (0 == $('.select2-drop-footer', $dropdown).size()) {
            $dropdown.append([
                '<div class="select2-drop-footer">',
                    '<span class="select2-drop-footer-btn select2-btn-cancel">',
                        '<a href="#" role="button" tabindex="-1">' + this.options.cancel + '</a>',
                    '</span>',
                '</div>'
            ].join(''));
        }

        $dropdown.on('click', '.select2-drop-footer .select2-btn-cancel', select2, onCancelAction);

        if (this.options.disableSearchFocus) {
            select2.search.attr('readonly', 'readonly');
            select2.search.blur();
            $dropdown.focus();
            select2.search.removeAttr('readonly');
        }
    }

    /**
     * Action on closed select2 dropdown.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onClose (event) {
        var select2 = this.$element.data('select2');

        select2.dropdown.off('touchmove', '.select2-results');
        select2.dropdown.off('touchstart touchend', '.select2-results');
        select2.dropdown.off('click');
        select2.dropdown.off('mouseup', '.select2-results');
        select2.dropdown.off('click', '.select2-drop-footer .select2-btn-cancel');
    }

    /**
     * Action on click to cancel button.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onCancelAction (event) {
        event.preventDefault();
        event.stopPropagation();
        event.data.close();
    }

    /**
     * Action on click to item.
     *
     * @param jQuery.Event event
     *
     * @this (is select2 instance)
     * @private
     */
    function onSelectAction (event) {
        this.highlightUnderEvent(event);
        this.selectHighlighted(event);
    }

    /**
     * Prevents the default event.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function blockEvent (event) {
        event.preventDefault();
        event.stopPropagation();
    }


    // SELECT2 RESPONSIVE PLUGIN DEFINITION
    // ====================================

    var old = $.fn.select2Responsive;

    $.fn.select2Responsive = function (option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('st.select2responsive');
            var options = typeof option == 'object' && option;

            if (!data && option == 'destroy') {
                return;
            }

            if (!data) {
                $this.data('st.select2responsive', (data = new Select2Responsive(this, options)));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

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
            $this.select2Responsive($this.data());
        });
    });

}(jQuery);
