/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global jQuery*/

/**
 * @param {jQuery} $
 */
(function ($) {
    'use strict';

    // SELECT2 RESPONSIVE CLASS DEFINITION
    // ===================================

    $.extend(true, $.fn.select2Responsive.Constructor.DEFAULTS, {
        cancel: 'Annuler'
    });

}(jQuery));
