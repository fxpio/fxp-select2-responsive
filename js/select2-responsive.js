/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluginify from '@fxp/jquery-pluginify';
import BaseI18nPlugin from '@fxp/jquery-pluginify/js/i18n-plugin';
import $ from "jquery";
import {onClose, onOpen, resizeHeightMax} from "./utils/events";
import 'select2';

/**
 * Select2 Responsive class.
 */
export default class Select2Responsive extends BaseI18nPlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.$mask = null;

        this.$element
            .on('select2:open.fxp.select2responsive', null, this, onOpen)
            .on('select2:close.fxp.select2responsive', null, this, onClose);

        $(window).on('resize.fxp.select2responsive', null, this, resizeHeightMax);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        let select2 = this.$element.data('select2'),
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

        super.destroy();
    }
}

/**
 * Default locale.
 */
Select2Responsive.locales = {
    en: {
        close: 'Close'
    }
};

pluginify('select2Responsive', 'fxp.select2responsive', Select2Responsive, true, '[data-select2-responsive="true"]');
