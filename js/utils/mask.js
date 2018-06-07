/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';

/**
 * Create the mask of dropdown.
 *
 * @param {String} [name]
 *
 * @returns {*|jQuery|HTMLElement}
 */
export function createMask(name) {
    let $mask = $('<div class="select2-dropdown-responsive-mask' + (undefined !== name ? '-' + name : '') + '"></div>');
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
