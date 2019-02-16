var FxpSelect2Responsive = (function (exports, $, select2) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  select2 = select2 && select2.hasOwnProperty('default') ? select2['default'] : select2;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  /**
   * Define the class as Jquery plugin.
   *
   * @param {String}      pluginName  The name of jquery plugin defined in $.fn
   * @param {String}      dataName    The key name of jquery data
   * @param {function}    ClassName   The class name
   * @param {boolean}     [shorthand] Check if the shorthand of jquery plugin must be added
   * @param {String|null} dataApiAttr The DOM data attribute selector name to init the jquery plugin with Data API, NULL to disable
   * @param {String}      removeName  The method name to remove the plugin data
   */

  function pluginify (pluginName, dataName, ClassName) {
    var shorthand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var dataApiAttr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var removeName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'destroy';
    var old = $.fn[pluginName];

    $.fn[pluginName] = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var resFunc, resList;
      resList = this.each(function (i, element) {
        var $this = $(element),
            data = $this.data(dataName);

        if (!data) {
          data = new ClassName(element, _typeof(options) === 'object' ? options : {});
          $this.data(dataName, data);
        }

        if (typeof options === 'string' && data) {
          if (data[options]) {
            resFunc = data[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          } else if (data.constructor[options]) {
            resFunc = data.constructor[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          }

          if (options === removeName) {
            $this.removeData(dataName);
          }
        }
      });
      return 1 === resList.length && undefined !== resFunc ? resFunc : resList;
    };

    $.fn[pluginName].Constructor = ClassName; // Shorthand

    if (shorthand) {
      $[pluginName] = function (options) {
        return $({})[pluginName](options);
      };
    } // No conflict


    $.fn[pluginName].noConflict = function () {
      return $.fn[pluginName] = old;
    }; // Data API


    if (null !== dataApiAttr) {
      $(window).on('load', function () {
        $(dataApiAttr).each(function () {
          var $this = $(this);
          $.fn[pluginName].call($this, $this.data());
        });
      });
    }
  }

  var DEFAULT_OPTIONS = {};
  /**
   * Base class for plugin.
   */

  var BasePlugin =
  /*#__PURE__*/
  function () {
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function BasePlugin(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePlugin);

      this.guid = $.guid;
      this.options = $.extend(true, {}, this.constructor.defaultOptions, options);
      this.$element = $(element);
    }
    /**
     * Destroy the instance.
     */


    _createClass(BasePlugin, [{
      key: "destroy",
      value: function destroy() {
        var self = this;
        Object.keys(self).forEach(function (key) {
          delete self[key];
        });
      }
      /**
       * Set the default options.
       * The new values are merged with the existing values.
       *
       * @param {object} options
       */

    }], [{
      key: "defaultOptions",
      set: function set(options) {
        DEFAULT_OPTIONS[this.name] = $.extend(true, {}, DEFAULT_OPTIONS[this.name], options);
      }
      /**
       * Get the default options.
       *
       * @return {object}
       */
      ,
      get: function get() {
        if (undefined === DEFAULT_OPTIONS[this.name]) {
          DEFAULT_OPTIONS[this.name] = {};
        }

        return DEFAULT_OPTIONS[this.name];
      }
    }]);

    return BasePlugin;
  }();

  var LOCALES = {};
  var globalLocale;
  /**
   * Base class for i18n plugin.
   */

  var BaseI18nPlugin =
  /*#__PURE__*/
  function (_BasePlugin) {
    _inherits(BaseI18nPlugin, _BasePlugin);

    function BaseI18nPlugin() {
      _classCallCheck(this, BaseI18nPlugin);

      return _possibleConstructorReturn(this, _getPrototypeOf(BaseI18nPlugin).apply(this, arguments));
    }

    _createClass(BaseI18nPlugin, [{
      key: "locale",

      /**
       * Get the language configuration.
       *
       * @param {string} [locale] The ISO code of language
       *
       * @returns {object} The language configuration
       */
      value: function locale(_locale) {
        return this.constructor.locales[this.getLocale(_locale)];
      }
      /**
       * Get the valid available locale.
       *
       * @param {string} [locale] The ISO code of language
       *
       * @returns {object} The language configuration
       */

    }, {
      key: "getLocale",
      value: function getLocale(locale) {
        locale = locale ? locale : this.options.locale;

        if (this.constructor.locales[locale]) {
          return locale;
        }

        if (!locale) {
          if (undefined === globalLocale) {
            var metaLang = document.querySelector('head > meta[http-equiv="Content-Language"]');
            globalLocale = metaLang && metaLang.content ? metaLang.content : null;
          }

          if (undefined === globalLocale) {
            var lang = document.querySelector('html').lang;
            globalLocale = lang ? lang : null;
          }

          locale = globalLocale;
        }

        if (typeof locale === 'string') {
          locale = locale.toLowerCase().replace('-', '_');

          if (locale.indexOf('_') >= 0 && undefined === this.constructor.locales[locale]) {
            locale = locale.substr(0, locale.indexOf('_'));
          }
        }

        if (undefined === this.constructor.locales[locale]) {
          var localeKeys = Object.keys(this.constructor.locales);
          locale = localeKeys.length > 0 ? localeKeys[0] : 'en';
        }

        this.options.locale = locale;
        return locale;
      }
      /**
       * Get the map of locales.
       * The map consists of the key containing the ISO code of the language
       * and an object containing the translations for each ISO code.
       *
       * Example:
       * {
       *     'en': {
       *         'foo.bar': 'My message'
       *     }
       * }
       *
       * @param {object} translations The translations map defined in a language ISO code key
       */

    }], [{
      key: "locales",
      set: function set$$1(translations) {
        var keys, i, val; // Force the initialisation of i18n options

        this.defaultOptions = {};

        if (_typeof(translations) === 'object') {
          keys = Object.keys(translations);

          for (i = 0; i < keys.length; ++i) {
            val = translations[keys[i]];

            if (_typeof(val) === 'object') {
              if (undefined === LOCALES[this.name]) {
                LOCALES[this.name] = {};
              }

              LOCALES[this.name][keys[i]] = val;
            }
          }
        }
      }
      /**
       * Get the map of locales.
       * The map consists of the key containing the ISO code of the language
       * and an object containing the translations for each ISO code.
       *
       * @returns {object}
       */
      ,
      get: function get$$1() {
        if (undefined === LOCALES[this.name]) {
          LOCALES[this.name] = {};
        }

        return LOCALES[this.name];
      }
      /**
       * @inheritDoc
       */

    }, {
      key: "defaultOptions",
      get: function get$$1() {
        return _get(_getPrototypeOf(BaseI18nPlugin), "defaultOptions", this);
      }
      /**
       * @inheritDoc
       */
      ,
      set: function set$$1(options) {
        if (undefined === options.locale) {
          options.locale = null;
        }

        _set(_getPrototypeOf(BaseI18nPlugin), "defaultOptions", options, this, true);
      }
    }]);

    return BaseI18nPlugin;
  }(BasePlugin);

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Create the mask of dropdown.
   *
   * @param {String} [name]
   *
   * @returns {*|jQuery|HTMLElement}
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

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Action on click to close button.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {Select2} Event.data The select2 instance
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
   */

  function resizeHeightMax(event) {
    var self = event.data,
        select2$$1 = self.$element.data('select2'),
        $drop = $('.select2-dropdown', select2$$1.$dropdown),
        top = parseInt(select2$$1.$dropdown.css('margin-top'), 10),
        bottom = parseInt(select2$$1.$dropdown.css('margin-bottom'), 10),
        windowHeight = $(window).height(),
        currentHeight = $drop.outerHeight(),
        resultsHeight = select2$$1.$results.outerHeight(),
        maxHeight;

    if (0 === currentHeight) {
      return;
    }

    top = isNaN(top) ? 0 : top;
    bottom = isNaN(bottom) ? 0 : bottom;
    maxHeight = windowHeight - top - bottom - (currentHeight - resultsHeight);
    select2$$1.$results.css('max-height', maxHeight + 'px');

    if (undefined !== self.$multiSearchField && undefined !== self.$cloneMultiSearch) {
      self.$multiSearchField.css({
        position: 'fixed',
        margin: '0',
        padding: self.$cloneMultiSearch.css('padding'),
        top: self.$cloneMultiSearch.offset().top - $(window).scrollTop() + 'px',
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
   * Prevent the click action on search field, only for multiple.
   *
   * @param {jQuery.Event|Event} event
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
   */

  function onOpen(event) {
    var self = event.data,
        select2$$1 = self.$element.data('select2'); // 2nd call

    if (null !== self.$mask) {
      return;
    }

    self.$mask = createMask(); // responsive mode

    if (!isInResponsiveMode(self.$mask)) {
      return;
    }

    self.$maskOpening = createMask('opening');
    setTimeout(function () {
      self.$maskOpening.remove();
      delete self.$maskOpening;
    }, 100);
    select2$$1.$container.addClass('select2-container-responsive');
    select2$$1.$dropdown.addClass('select2-dropdown-responsive');
    select2$$1.$dropdown.on('click.fxp.select2responsive', '.select2-drop-footer .select2-btn-close', select2$$1, onCloseButtonAction);

    if (0 === $('.select2-drop-footer', select2$$1.$dropdown).length) {
      select2$$1.$results.parent().after('<div class="select2-drop-footer">' + '<span class="select2-drop-footer-btn select2-btn-close">' + '<a href="#" tabindex="-1">' + self.locale().close + '</a>' + '</span>' + '</div>');
    } // multiple search header


    self.$multiSearchField = $('.select2-selection--multiple .select2-search__field', select2$$1.$container);

    if (1 === self.$multiSearchField.length) {
      self.$cloneMultiSearch = self.$multiSearchField.clone(true).off();
      self.$cloneMultiSearch.addClass('multi-responsive');
      self.$dropMultiSearch = $('<span class="select2-search select2-search--dropdown"></span>');
      self.$dropMultiSearch.append(self.$cloneMultiSearch);
      select2$$1.$results.parent().parent().prepend(self.$dropMultiSearch);
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
   */

  function onClose(event) {
    var self = event.data,
        select2$$1 = self.$element.data('select2'),
        $dropdown = select2$$1.$dropdown;
    $dropdown.off('click.fxp.select2responsive', '.select2-drop-footer .select2-btn-close', onCloseButtonAction);
    select2$$1.$container.removeClass('select2-container-responsive');
    select2$$1.$dropdown.removeClass('select2-dropdown-responsive');

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

  /**
   * Select2 Responsive class.
   */

  var Select2Responsive =
  /*#__PURE__*/
  function (_BaseI18nPlugin) {
    _inherits(Select2Responsive, _BaseI18nPlugin);

    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function Select2Responsive(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Select2Responsive);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Select2Responsive).call(this, element, options));
      _this.$mask = null;

      _this.$element.on('select2:open.fxp.select2responsive', null, _assertThisInitialized(_this), onOpen).on('select2:close.fxp.select2responsive', null, _assertThisInitialized(_this), onClose);

      $(window).on('resize.fxp.select2responsive', null, _assertThisInitialized(_this), resizeHeightMax);
      return _this;
    }
    /**
     * Destroy the instance.
     */


    _createClass(Select2Responsive, [{
      key: "destroy",
      value: function destroy() {
        var select2$$1 = this.$element.data('select2'),
            $dropFooter = $('.select2-drop-footer', select2$$1.$dropdown);
        select2$$1.close();

        if (null !== this.$mask) {
          this.$mask.remove();
        }

        if (0 === $dropFooter.length) {
          $dropFooter.remove();
        }

        $(window).off('resize.fxp.select2responsive', resizeHeightMax);
        this.$element.off('select2:open.fxp.select2responsive', onOpen).off('select2:close.fxp.select2responsive', onClose);

        _get(_getPrototypeOf(Select2Responsive.prototype), "destroy", this).call(this);
      }
    }]);

    return Select2Responsive;
  }(BaseI18nPlugin);
  Select2Responsive.locales = {
    en: {
      close: 'Close'
    }
  };
  pluginify('select2Responsive', 'fxp.select2responsive', Select2Responsive, true, '[data-select2-responsive="true"]');

  exports.default = Select2Responsive;

  return exports;

}({}, jQuery, select2));
