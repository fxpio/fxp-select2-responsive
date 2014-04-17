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
        this.options  = $.extend({}, $.fn.hammerScroll.Constructor.DEFAULTS, Select2Responsive.DEFAULTS, options);
        this.$element = $(element);

        this.$element.on('select2-open.st.select2responsive', $.proxy(onOpen, this));
        this.$element.on('select2-close.st.select2responsive', $.proxy(onClose, this));
    };

    /**
     * Defaults options.
     *
     * @type Array
     */
    Select2Responsive.DEFAULTS = {
        cancel: 'Cancel'
    };

    /**
     * Destroy instance.
     *
     * @this
     */
    Select2Responsive.prototype.destroy = function () {
        this.$element.removeData('st.select2responsive');
    };

    /**
     * Action on opened select2 dropdown.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onOpen (event) {
        var select2 = $(event.target).data('select2');
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
        var select2 = $(event.target).data('select2');

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
