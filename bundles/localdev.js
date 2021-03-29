/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/back-button.ts":
/*!***********************************!*\
  !*** ./src/common/back-button.ts ***!
  \***********************************/
/***/ (function() {


document.body.addEventListener('click', function (e) {
    var target = e.target;
    if (target && target.closest('.gn-back-trigger')) {
        window.history.back();
        e.preventDefault();
        e.stopPropagation();
    }
});
if (window.history.length < 2) {
    Array.from(document.querySelectorAll('.gn-back'))
        .forEach(function (el) {
        el.classList.add('d-none');
    });
}


/***/ }),

/***/ "./src/common/test-media-source.ts":
/*!*****************************************!*\
  !*** ./src/common/test-media-source.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_modules_esl_utils_async_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/modules/esl-utils/async/debounce */ "../src/modules/esl-utils/async/debounce.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var TestMediaSource = /** @class */ (function (_super) {
    __extends(TestMediaSource, _super);
    function TestMediaSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TestMediaSource.prototype, "target", {
        get: function () {
            var targetSel = this.getAttribute('target');
            return document.querySelector(targetSel || '');
        },
        enumerable: false,
        configurable: true
    });
    TestMediaSource.prototype.render = function () {
        var form = document.createElement('form');
        form.innerHTML = "\n\t\t\t<fieldset>\n\t\t\t\t<legend>Video Settings:</legend>\n\t\t    <div class=\"input-group mb-2 mr-sm-2\">\n\t\t\t    <select class=\"form-control\" name=\"media-type\">\n\t\t\t      <option value=\"auto\">- Auto -</option>\n\t\t\t      <option value=\"audio\">HTML Audio</option>\n\t\t\t      <option value=\"video\">HTML Video</option>\n\t\t\t      <option value=\"youtube\">Youtube</option>\n\t\t\t      <option value=\"brightcove\">Brightcove</option>\n\t\t\t      <option value=\"iframe\">Iframe</option>\n\t\t\t\t\t</select>\n        </div>\n\t\t\t  <div class=\"input-group mb-2 mr-sm-2\">\n\t\t\t    <input type=\"text\" class=\"form-control\" placeholder=\"Media src\" name=\"media-src\" autocomplete=\"on\"/>\n\t\t\t  </div>\n\t\t\t  <div class=\"input-group mb-2 mr-sm-2\">\n\t\t\t    <input type=\"text\" class=\"form-control\" placeholder=\"Media id\" name=\"media-id\" autocomplete=\"on\"/>\n\t\t\t  </div>\n        <div class=\"input-group mb-2 mr-sm-2\">\n\t\t\t    <input type=\"text\" class=\"form-control\" placeholder=\"Player id\" name=\"player-id\" autocomplete=\"on\"/>\n        </div>\n        <div class=\"input-group mb-2 mr-sm-2\">\n\t\t\t    <input type=\"text\" class=\"form-control\" placeholder=\"Player account\" name=\"player-account\" autocomplete=\"on\"/>\n        </div>\n\n\n        <div class=\"form-group\">\n          <div class=\"form-check form-check-inline\">\n            <label class=\"form-check-label\"><input type=\"checkbox\" name=\"muted\" class=\"form-check-input\"/> Muted</label>\n          </div>\n          <div class=\"form-check form-check-inline\">\n            <label class=\"form-check-label\"><input type=\"checkbox\" name=\"autoplay\" class=\"form-check-input\"/> Autoplay</label>\n          </div>\n          <div class=\"form-check form-check-inline\">\n            <label class=\"form-check-label\"><input type=\"checkbox\" name=\"disabled\" class=\"form-check-input\"/> Disabled</label>\n          </div>\n        </div>\n\t\t\t</fieldset>\n\t\t";
        form.action = 'javascript: void 0;';
        this.innerHTML = '';
        this.appendChild(form);
    };
    TestMediaSource.prototype.onChange = function () {
        var target = this.target;
        var inputs = this.querySelectorAll('input[name], select[name]');
        Array.from(inputs).forEach(function (input) {
            if (!target)
                return;
            if (input instanceof HTMLInputElement && input.type === 'checkbox') {
                target.toggleAttribute(input.name, input.checked);
            }
            else {
                target.setAttribute(input.name, input.value);
            }
        });
    };
    TestMediaSource.prototype.connectedCallback = function () {
        var _this = this;
        this.render();
        this.addEventListener('change', (0,_src_modules_esl_utils_async_debounce__WEBPACK_IMPORTED_MODULE_0__.debounce)(function () { return _this.onChange(); }, 750));
        this.onChange();
    };
    return TestMediaSource;
}(HTMLElement));
customElements.define('test-media-source', TestMediaSource);


/***/ }),

/***/ "./src/common/test-media.ts":
/*!**********************************!*\
  !*** ./src/common/test-media.ts ***!
  \**********************************/
/***/ (function() {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var TestMediaControls = /** @class */ (function (_super) {
    __extends(TestMediaControls, _super);
    function TestMediaControls() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TestMediaControls.prototype, "target", {
        get: function () {
            var targetSel = this.getAttribute('target');
            return targetSel ? Array.from(document.querySelectorAll(targetSel)) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TestMediaControls.prototype, "actions", {
        get: function () {
            return this.getAttribute('actions') || TestMediaControls.ACTIONS_ALL;
        },
        enumerable: false,
        configurable: true
    });
    TestMediaControls.prototype.render = function () {
        var e_1, _a;
        var actionList = this.actions.split(',');
        this.innerHTML = '';
        try {
            for (var actionList_1 = __values(actionList), actionList_1_1 = actionList_1.next(); !actionList_1_1.done; actionList_1_1 = actionList_1.next()) {
                var actionName = actionList_1_1.value;
                var action = TestMediaControls.ACTIONS[actionName];
                if (!action)
                    return;
                this.appendChild(action.render(actionName, action));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (actionList_1_1 && !actionList_1_1.done && (_a = actionList_1.return)) _a.call(actionList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    TestMediaControls.prototype.onClick = function (e) {
        var target = e.target;
        var actionName = target.dataset.action;
        if (actionName && TestMediaControls.ACTIONS[actionName]) {
            var actionDesc_1 = TestMediaControls.ACTIONS[actionName];
            var actionFn_1 = actionDesc_1.action;
            this.target.forEach(function ($el) { return actionFn_1.call($el, $el, actionName, actionDesc_1); });
        }
    };
    TestMediaControls.prototype.connectedCallback = function () {
        this.render();
        this.addEventListener('click', this.onClick.bind(this));
    };
    TestMediaControls.ACTIONS = {
        play: {
            title: 'Play',
            action: function (target) { return target.play(); },
            render: renderButton
        },
        pause: {
            title: 'Pause',
            action: function (target) { return target.pause(); },
            render: renderButton
        },
        stop: {
            title: 'Stop',
            action: function (target) { return target.stop(); },
            render: renderButton
        }
    };
    TestMediaControls.ACTIONS_ALL = Object.keys(TestMediaControls.ACTIONS).join(',');
    return TestMediaControls;
}(HTMLElement));
function renderButton(actionName, action) {
    var btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.dataset.action = actionName;
    btn.textContent = action.title;
    return btn;
}
customElements.define('test-media-controls', TestMediaControls);


/***/ }),

/***/ "../src/modules/draft/esl-carousel/all.ts":
/*!************************************************!*\
  !*** ../src/modules/draft/esl-carousel/all.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarousel": function() { return /* reexport safe */ _core_esl_carousel__WEBPACK_IMPORTED_MODULE_2__.ESLCarousel; },
/* harmony export */   "ESLCarouselPlugins": function() { return /* binding */ ESLCarouselPlugins; }
/* harmony export */ });
/* harmony import */ var _core_view_esl_single_carousel_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/view/esl-single-carousel-view */ "../src/modules/draft/esl-carousel/core/view/esl-single-carousel-view.ts");
/* harmony import */ var _core_view_esl_multi_carousel_view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/view/esl-multi-carousel-view */ "../src/modules/draft/esl-carousel/core/view/esl-multi-carousel-view.ts");
/* harmony import */ var _core_esl_carousel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/esl-carousel */ "../src/modules/draft/esl-carousel/core/esl-carousel.ts");
/* harmony import */ var _plugin_esl_carousel_dots_plugin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugin/esl-carousel-dots.plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-dots.plugin.ts");
/* harmony import */ var _plugin_esl_carousel_link_plugin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugin/esl-carousel-link.plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-link.plugin.ts");
/* harmony import */ var _plugin_esl_carousel_touch_plugin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugin/esl-carousel-touch.plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-touch.plugin.ts");
/* harmony import */ var _plugin_esl_carousel_autoplay_plugin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./plugin/esl-carousel-autoplay.plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-autoplay.plugin.ts");
// Views



// Plugins




// TODO: ??
var ESLCarouselPlugins = {
    Dots: _plugin_esl_carousel_dots_plugin__WEBPACK_IMPORTED_MODULE_3__.ESLCarouselDotsPlugin,
    Link: _plugin_esl_carousel_link_plugin__WEBPACK_IMPORTED_MODULE_4__.ESLCarouselLinkPlugin,
    Touch: _plugin_esl_carousel_touch_plugin__WEBPACK_IMPORTED_MODULE_5__.ESLCarouselTouchPlugin,
    Autoplay: _plugin_esl_carousel_autoplay_plugin__WEBPACK_IMPORTED_MODULE_6__.ESLCarouselAutoplayPlugin
};


/***/ }),

/***/ "../src/modules/draft/esl-carousel/core/esl-carousel-slide.ts":
/*!********************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/core/esl-carousel-slide.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarouselSlide": function() { return /* binding */ ESLCarouselSlide; }
/* harmony export */ });
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Slide controller
 * @author Julia Murashko
 */

var ESLCarouselSlide = /** @class */ (function (_super) {
    __extends(ESLCarouselSlide, _super);
    function ESLCarouselSlide() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ESLCarouselSlide.prototype, "index", {
        // TODO: refactor (check type of Element)
        get: function () {
            if (!this.parentNode)
                return -1;
            return Array.prototype.indexOf.call(this.parentNode.children, this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarouselSlide.prototype, "active", {
        get: function () {
            return this.hasAttribute('active');
        },
        enumerable: false,
        configurable: true
    });
    ESLCarouselSlide.prototype._setActive = function (active) {
        this.toggleAttribute('active', active);
    };
    Object.defineProperty(ESLCarouselSlide.prototype, "first", {
        get: function () {
            return this.hasAttribute('first');
        },
        enumerable: false,
        configurable: true
    });
    ESLCarouselSlide.prototype._setFirst = function (first) {
        this.toggleAttribute('first', first);
    };
    return ESLCarouselSlide;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_0__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/draft/esl-carousel/core/esl-carousel.ts":
/*!**************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/core/esl-carousel.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarousel": function() { return /* binding */ ESLCarousel; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_misc_object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../esl-utils/misc/object */ "../src/modules/esl-utils/misc/object.ts");
/* harmony import */ var _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-media-query/core */ "../src/modules/esl-media-query/core/esl-media-rule-list.ts");
/* harmony import */ var _esl_carousel_slide__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-carousel-slide */ "../src/modules/draft/esl-carousel/core/esl-carousel-slide.ts");
/* harmony import */ var _view_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/esl-carousel-view */ "../src/modules/draft/esl-carousel/core/view/esl-carousel-view.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






// TODO: add ability to choose the number of an active slide
var ESLCarousel = /** @class */ (function (_super) {
    __extends(ESLCarousel, _super);
    function ESLCarousel() {
        var _this = _super.call(this) || this;
        _this._currentConfig = {};
        _this._plugins = new Map();
        _this._onMatchChange = _this.update.bind(_this, false);
        _this._onRegistryChange = _this._onRegistryChange.bind(_this);
        return _this;
    }
    ESLCarousel_1 = ESLCarousel;
    Object.defineProperty(ESLCarousel, "observedAttributes", {
        get: function () {
            return ['config'];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarousel.prototype, "$slidesArea", {
        get: function () {
            return this.querySelector('[data-slides-area]');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarousel.prototype, "$slides", {
        get: function () {
            // TODO cache
            var els = this.$slidesArea && this.$slidesArea.querySelectorAll(_esl_carousel_slide__WEBPACK_IMPORTED_MODULE_1__.ESLCarouselSlide.is);
            return els ? Array.from(els) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarousel.prototype, "count", {
        get: function () {
            return this.$slides.length || 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarousel.prototype, "activeIndexes", {
        get: function () {
            return this.$slides.reduce(function (activeIndexes, el, index) {
                if (el.active) {
                    activeIndexes.push(index);
                }
                return activeIndexes;
            }, []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarousel.prototype, "activeCount", {
        get: function () {
            return this.activeConfig.count || 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarousel.prototype, "firstIndex", {
        /**
         * @returns {number} first active index
         */
        get: function () {
            var index = this.$slides.findIndex(function (slide) {
                return slide.first;
            });
            return Math.max(index, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarousel.prototype, "activeConfig", {
        get: function () {
            return this._currentConfig;
        },
        set: function (config) {
            this._currentConfig = Object.assign({}, config);
        },
        enumerable: false,
        configurable: true
    });
    ESLCarousel.prototype.goTo = function (nextIndex, direction, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (this.dataset.isAnimated) {
            return;
        }
        if (nextIndex < 0) {
            nextIndex = 0;
        }
        if (this.firstIndex === nextIndex && !force) {
            return;
        }
        if (!direction) {
            // calculate and compare how much slides we have to go due to direction (left or right)
            // choose less
            // TODO: optimize
            if (nextIndex > this.firstIndex) {
                direction = nextIndex - this.firstIndex > (this.firstIndex - nextIndex + this.count) % this.count ? 'left' : 'right';
            }
            else {
                direction = this.firstIndex - nextIndex >= (nextIndex - this.firstIndex - nextIndex + this.count) % this.count ? 'right' : 'left';
            }
        }
        var eventDetails = {
            bubbles: true,
            detail: {
                direction: direction
            }
        };
        var approved = this.$$fire('slide:change', eventDetails);
        if (this._view && approved && this.firstIndex !== nextIndex) {
            this._view.goTo(nextIndex, direction);
        }
        if (this._view && approved) {
            var i = 0;
            this.$slides.forEach(function (el, index) {
                el._setActive(((nextIndex + _this.count) % _this.count <= index) && (index < (nextIndex + _this.activeCount + _this.count) % _this.count));
            });
            while (i < this.activeCount) {
                var computedIndex = (nextIndex + i + this.count) % this.count;
                this.$slides[computedIndex]._setActive(true);
                ++i;
            }
            if (this.activeConfig.view === 'multiple') {
                this.$slides[this.firstIndex]._setFirst(false);
                this.$slides[nextIndex]._setFirst(true);
            }
        }
        this.$$fire('slide:changed', eventDetails);
    };
    ESLCarousel.prototype.prev = function () {
        // const nextGroup = this.getNextGroup(-1);
        this.goTo((this.firstIndex - this.activeCount + this.count) % this.count, 'left');
    };
    ESLCarousel.prototype.next = function () {
        // const nextGroup = this.getNextGroup(1);
        this.goTo((this.firstIndex + this.activeCount + this.count) % this.count, 'right');
    };
    ESLCarousel.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.update(true);
        this.goTo(this.firstIndex, '', true);
        this._bindEvents();
        _view_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__.ESLCarouselViewRegistry.instance.addListener(this._onRegistryChange);
    };
    ESLCarousel.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this._unbindEvents();
        _view_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__.ESLCarouselViewRegistry.instance.removeListener(this._onRegistryChange);
    };
    ESLCarousel.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        // TODO: change observed attributes
        if (attrName === 'config') {
            this.configRules = _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.parse(this.config, _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.OBJECT_PARSER);
            this.update(true);
        }
    };
    ESLCarousel.prototype._bindEvents = function () {
        this.addEventListener('click', this._onClick, false);
    };
    ESLCarousel.prototype._unbindEvents = function () {
        this.removeEventListener('click', this._onClick, false);
    };
    Object.defineProperty(ESLCarousel.prototype, "configRules", {
        get: function () {
            if (!this._configRules) {
                this.configRules = _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.parse(this.config, _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.OBJECT_PARSER);
            }
            return this._configRules;
        },
        set: function (rules) {
            if (this._configRules) {
                this._configRules.removeListener(this._onMatchChange);
            }
            this._configRules = rules;
            this._configRules.addListener(this._onMatchChange);
        },
        enumerable: false,
        configurable: true
    });
    ESLCarousel.prototype.update = function (force) {
        if (force === void 0) { force = false; }
        var config = Object.assign({ view: 'multiple', count: 1 }, this.configRules.activeValue);
        if (!force && (0,_esl_utils_misc_object__WEBPACK_IMPORTED_MODULE_3__.deepCompare)(this.activeConfig, config)) {
            return;
        }
        this.activeConfig = config;
        var viewType = this.activeConfig.view;
        if (!viewType)
            return;
        // TODO: somehow compare active view & selected view
        // this._view && this._view.unbind();
        this._view = _view_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__.ESLCarouselViewRegistry.instance.createViewInstance(viewType, this);
        // this._view && this._view.bind();
        if (force || this.activeIndexes.length !== this.activeConfig.count) {
            this._view && this._view.draw();
            // this.goTo(this.firstIndex, '', true);
        }
    };
    ESLCarousel.prototype.getNextGroup = function (shiftGroupsCount) {
        // get number of group of current active slides by last index of this group
        var lastIndex = this.activeIndexes.length - 1;
        var currentGroup = Math.floor(this.activeIndexes[lastIndex] / this.activeCount);
        // get count of groups of slides
        var countGroups = Math.ceil(this.count / this.activeCount);
        // get number of group of next active slides
        return (currentGroup + shiftGroupsCount + countGroups) % countGroups;
    };
    // move to core plugin
    ESLCarousel.prototype._onClick = function (event) {
        var eventTarget = event.target;
        var markedTarget = eventTarget.closest('[data-slide-target]');
        if (markedTarget && markedTarget.dataset.slideTarget) {
            var target = markedTarget.dataset.slideTarget;
            if ('prev' === target) {
                this.prev();
            }
            else if ('next' === target) {
                this.next();
            }
            else if ('g' === target[0]) {
                var group = +(target.substr(1)) - 1;
                var lastGroup = Math.floor(this.count / this.activeCount);
                this.goTo(group === lastGroup ? this.count - this.activeCount : this.activeCount * group);
            }
            else {
                this.goTo(+target - 1);
            }
        }
    };
    ESLCarousel.prototype._onRegistryChange = function () {
        if (!this._view)
            this.update(true);
    };
    // Plugin management
    ESLCarousel.prototype.addPlugin = function (plugin) {
        if (plugin.carousel)
            return;
        this.appendChild(plugin);
    };
    ESLCarousel.prototype.removePlugin = function (plugin) {
        if (typeof plugin === 'string')
            plugin = this._plugins.get(plugin);
        if (!plugin || plugin.carousel !== this)
            return;
        plugin.parentNode && plugin.parentNode.removeChild(plugin);
    };
    ESLCarousel.prototype._addPlugin = function (plugin) {
        if (this._plugins.has(plugin.key))
            return;
        this._plugins.set(plugin.key, plugin);
        if (this.isConnected)
            plugin.bind();
    };
    ESLCarousel.prototype._removePlugin = function (plugin) {
        if (!this._plugins.has(plugin.key))
            return;
        plugin.unbind();
        this._plugins.delete(plugin.key);
    };
    ESLCarousel.register = function (tagName) {
        var _this = this;
        _esl_carousel_slide__WEBPACK_IMPORTED_MODULE_1__.ESLCarouselSlide.register((tagName || ESLCarousel_1.is) + '-slide');
        customElements.whenDefined(_esl_carousel_slide__WEBPACK_IMPORTED_MODULE_1__.ESLCarouselSlide.is).then(function () { return _super.register.call(_this, tagName); });
    };
    var ESLCarousel_1;
    ESLCarousel.Slide = _esl_carousel_slide__WEBPACK_IMPORTED_MODULE_1__.ESLCarouselSlide;
    ESLCarousel.is = 'esl-carousel';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.attr)()
    ], ESLCarousel.prototype, "config", void 0);
    ESLCarousel = ESLCarousel_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_5__.ExportNs)('Carousel')
    ], ESLCarousel);
    return ESLCarousel;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/draft/esl-carousel/core/view/esl-carousel-view.ts":
/*!************************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/core/view/esl-carousel-view.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarouselView": function() { return /* binding */ ESLCarouselView; },
/* harmony export */   "ESLCarouselViewRegistry": function() { return /* binding */ ESLCarouselViewRegistry; }
/* harmony export */ });
/* harmony import */ var _esl_utils_abstract_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../esl-utils/abstract/observable */ "../src/modules/esl-utils/abstract/observable.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var ESLCarouselView = /** @class */ (function () {
    function ESLCarouselView(carousel) {
        this.carousel = carousel; // TODO: unsafe while lifecycle is not clear
    }
    return ESLCarouselView;
}());

var eslRegistryInstance = null;
var ESLCarouselViewRegistry = /** @class */ (function (_super) {
    __extends(ESLCarouselViewRegistry, _super);
    function ESLCarouselViewRegistry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.registry = new Map();
        return _this;
    }
    Object.defineProperty(ESLCarouselViewRegistry, "instance", {
        get: function () {
            if (eslRegistryInstance === null) {
                eslRegistryInstance = new ESLCarouselViewRegistry();
            }
            return eslRegistryInstance;
        },
        enumerable: false,
        configurable: true
    });
    ESLCarouselViewRegistry.prototype.createViewInstance = function (name, carousel) {
        var View = this.registry.get(name);
        return View ? new View(carousel) : null;
    };
    ESLCarouselViewRegistry.prototype.registerView = function (name, view) {
        if (this.registry.has(name)) {
            throw new Error("View with name " + name + " already defined");
        }
        this.registry.set(name, view);
        this.fire(name, view);
    };
    return ESLCarouselViewRegistry;
}(_esl_utils_abstract_observable__WEBPACK_IMPORTED_MODULE_0__.Observable));



/***/ }),

/***/ "../src/modules/draft/esl-carousel/core/view/esl-multi-carousel-view.ts":
/*!******************************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/core/view/esl-multi-carousel-view.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-carousel-view */ "../src/modules/draft/esl-carousel/core/view/esl-carousel-view.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};

var ESLMultiCarouselView = /** @class */ (function (_super) {
    __extends(ESLMultiCarouselView, _super);
    function ESLMultiCarouselView(carousel) {
        return _super.call(this, carousel) || this;
    }
    // tslint:disable-next-line:no-empty
    ESLMultiCarouselView.prototype.bind = function () {
    };
    ESLMultiCarouselView.prototype.draw = function () {
        var _a = this.carousel, $slides = _a.$slides, $slidesArea = _a.$slidesArea;
        if (!$slidesArea || !$slides.length)
            return;
        var slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
        var currentTrans = slideStyles.transform !== 'none' ? parseFloat(slideStyles.transform.split(',')[4]) : 0;
        var slidesAreaStyles = getComputedStyle($slidesArea);
        var slideWidth = parseFloat(slidesAreaStyles.width) / this.carousel.activeCount
            - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
        var computedLeft = this.carousel.firstIndex === 0 ?
            -currentTrans :
            -(parseFloat(slidesAreaStyles.width) / this.carousel.activeCount * this.carousel.firstIndex) - currentTrans;
        $slides.forEach(function (slide) {
            slide.style.minWidth = slideWidth + 'px';
            slide.style.left = computedLeft + 'px';
        });
    };
    ESLMultiCarouselView.prototype.goTo = function (nextIndex, direction) {
        var _this = this;
        var slideIndex = direction === 'right' ? this.carousel.activeIndexes[0] : this.carousel.firstIndex;
        var slideStyles = getComputedStyle(this.carousel.$slides[slideIndex]);
        var slideWidth = parseFloat(slideStyles.width) +
            parseFloat(slideStyles.marginLeft) +
            parseFloat(slideStyles.marginRight);
        var areaWidth = slideWidth * this.carousel.$slides.length;
        var transitionDuration = parseFloat(slideStyles.transitionDuration) * 1000; // ms
        var currentLeft = parseFloat(slideStyles.left);
        var currentTrans = parseFloat(slideStyles.transform.split(',')[4]) || 0;
        if (this.carousel.firstIndex === nextIndex) {
            return 0;
        }
        var shiftCount = 0;
        if (direction === 'left') {
            shiftCount = (this.carousel.firstIndex - nextIndex + this.carousel.count) % this.carousel.count;
        }
        else if (direction === 'right') {
            shiftCount = (this.carousel.count - this.carousel.firstIndex + nextIndex) % this.carousel.count;
        }
        var direct = direction === 'left' ? -1 : 1;
        var trans = currentTrans - (shiftCount * slideWidth) * direct;
        var nextActiveIndexes = [];
        for (var i = 0; i < this.carousel.activeCount; ++i) {
            nextActiveIndexes.push((nextIndex + i + this.carousel.count) % this.carousel.count);
        }
        var intersectionArr = nextActiveIndexes.filter(function (index) { return _this.carousel.activeIndexes.includes(index); });
        var left = 0;
        var animatedCount = shiftCount < this.carousel.activeCount ? this.carousel.activeCount : shiftCount;
        var _loop_1 = function (i) {
            var computedIndex = (nextIndex + i + this_1.carousel.count) % this_1.carousel.count;
            var minActive = Math.min.apply(Math, __spreadArray([], __read(this_1.carousel.activeIndexes)));
            // make next active slides be in one line
            if (computedIndex >= this_1.carousel.firstIndex && direction === 'left') {
                left = currentLeft - areaWidth;
            }
            else if (computedIndex <= minActive && direction === 'right') {
                left = currentLeft + areaWidth;
            }
            else {
                left = currentLeft;
            }
            // exclude slides that are active now and have to be active then
            if (!intersectionArr.includes(computedIndex)) {
                this_1.carousel.$slides[computedIndex].style.left = left + 'px';
            }
            // handle slides that are active now and have to be active then
            if (intersectionArr.includes(computedIndex)) {
                var orderIndex = nextActiveIndexes.indexOf(computedIndex);
                var time = (direction === 'right') ?
                    (transitionDuration / this_1.carousel.activeCount) * orderIndex :
                    (transitionDuration / this_1.carousel.activeCount) * (this_1.carousel.activeCount - orderIndex - 1);
                var copyLeft_1 = left;
                setTimeout(function () {
                    _this.carousel.$slides[computedIndex].style.left = copyLeft_1 + 'px';
                }, time);
            }
        };
        var this_1 = this;
        for (var i = 0; i < animatedCount; ++i) {
            _loop_1(i);
        }
        this.carousel.$slides.forEach(function (slide) {
            // exclude slides that are active now and have to be active then
            slide.style.transform = "translateX(" + trans + "px)";
            // handle slides that are active now and have to be active then
            var sIndex = slide.index;
            if (intersectionArr.includes(sIndex)) {
                var orderIndex = nextActiveIndexes.indexOf(sIndex);
                var time = (direction === 'right') ?
                    (transitionDuration / _this.carousel.activeCount) * orderIndex :
                    (transitionDuration / _this.carousel.activeCount) * (_this.carousel.activeCount - orderIndex - 1);
                setTimeout(function () {
                    _this.carousel.$slides[sIndex].style.transform = "translateX(" + trans + "px)";
                }, time);
            }
        });
        this.carousel.setAttribute('data-is-animated', 'true');
        setTimeout(function () {
            _this.carousel.removeAttribute('data-is-animated');
        }, transitionDuration);
    };
    ESLMultiCarouselView.prototype.unbind = function () {
        this.carousel.$slides.forEach(function (el) {
            el.style.transform = 'none';
            el.style.left = 'none';
        });
    };
    return ESLMultiCarouselView;
}(_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__.ESLCarouselView));
_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__.ESLCarouselViewRegistry.instance.registerView('multiple', ESLMultiCarouselView);


/***/ }),

/***/ "../src/modules/draft/esl-carousel/core/view/esl-single-carousel-view.ts":
/*!*******************************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/core/view/esl-single-carousel-view.ts ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-carousel-view */ "../src/modules/draft/esl-carousel/core/view/esl-carousel-view.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var ESLSingleCarouselView = /** @class */ (function (_super) {
    __extends(ESLSingleCarouselView, _super);
    function ESLSingleCarouselView(carousel) {
        return _super.call(this, carousel) || this;
    }
    ESLSingleCarouselView.prototype.bind = function () { };
    // TODO: check
    ESLSingleCarouselView.prototype.draw = function () {
        var _a = this.carousel, $slides = _a.$slides, $slidesArea = _a.$slidesArea;
        if (!$slidesArea || !$slides.length)
            return;
        var slideStyles = getComputedStyle($slides[this.carousel.firstIndex]);
        var slidesAreaStyles = getComputedStyle($slidesArea);
        var slideWidth = parseFloat(slidesAreaStyles.width) - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
        var computedLeft = -(parseFloat(slidesAreaStyles.width) / this.carousel.firstIndex);
        $slides.forEach(function (slide) {
            slide.style.minWidth = slideWidth + 'px';
            slide.style.left = computedLeft + 'px';
        });
    };
    ESLSingleCarouselView.prototype.goTo = function (nextIndex, direction) {
        var _this = this;
        if (this.carousel.firstIndex === nextIndex) {
            return;
        }
        this.carousel.setAttribute('data-is-animated', 'true');
        this.carousel.setAttribute('direction', direction);
        var activeSlide = this.carousel.$slides[this.carousel.firstIndex];
        var nextSlide = this.carousel.$slides[nextIndex];
        activeSlide.classList.add(direction);
        nextSlide.classList.add(direction);
        activeSlide.classList.add('prev');
        activeSlide.addEventListener('animationend', function (e) { return _this._cleanAnimation(e); });
        nextSlide.addEventListener('animationend', function (e) { return _this._cleanAnimation(e); });
    };
    ESLSingleCarouselView.prototype._cleanAnimation = function (event) {
        var target = event.target;
        var direction = this.carousel.getAttribute('direction');
        direction && target.classList.remove(direction);
        target.classList.remove('prev');
        this.carousel.removeAttribute('data-is-animated');
    };
    // tslint:disable-next-line:no-empty
    ESLSingleCarouselView.prototype.unbind = function () {
    };
    return ESLSingleCarouselView;
}(_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__.ESLCarouselView));
_esl_carousel_view__WEBPACK_IMPORTED_MODULE_0__.ESLCarouselViewRegistry.instance.registerView('single', ESLSingleCarouselView);


/***/ }),

/***/ "../src/modules/draft/esl-carousel/plugin/esl-carousel-autoplay.plugin.ts":
/*!********************************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/plugin/esl-carousel-autoplay.plugin.ts ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarouselAutoplayPlugin": function() { return /* binding */ ESLCarouselAutoplayPlugin; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./esl-carousel-plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-plugin.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



/**
 * Slide Carousel Autoplay (Auto-Advance) plugin
 * Automatically switch slides by timeout
 *
 * @author Alexey Stsefanovich (ala'n)
 */
var ESLCarouselAutoplayPlugin = /** @class */ (function (_super) {
    __extends(ESLCarouselAutoplayPlugin, _super);
    function ESLCarouselAutoplayPlugin() {
        var _this = _super.call(this) || this;
        _this._timeout = null;
        _this._onInterval = _this._onInterval.bind(_this);
        _this._onInteract = _this._onInteract.bind(_this);
        return _this;
    }
    Object.defineProperty(ESLCarouselAutoplayPlugin.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: false,
        configurable: true
    });
    ESLCarouselAutoplayPlugin.prototype.bind = function () {
        this.carousel.addEventListener('mouseover', this._onInteract);
        this.carousel.addEventListener('mouseout', this._onInteract);
        this.carousel.addEventListener('focusin', this._onInteract);
        this.carousel.addEventListener('focusout', this._onInteract);
        this.carousel.addEventListener('esl:slide:changed', this._onInteract);
        this.start();
        // console.log('Auto-advance plugin attached successfully to ', this.carousel);
    };
    ESLCarouselAutoplayPlugin.prototype.unbind = function () {
        this.carousel.removeEventListener('mouseover', this._onInteract);
        this.carousel.removeEventListener('mouseout', this._onInteract);
        this.carousel.removeEventListener('focusin', this._onInteract);
        this.carousel.removeEventListener('focusout', this._onInteract);
        this.carousel.removeEventListener('esl:slide:changed', this._onInteract);
        this.stop();
        // console.log('Auto-advance plugin detached successfully from ', this.carousel);
    };
    ESLCarouselAutoplayPlugin.prototype.start = function () {
        this._active = true;
        this.reset();
    };
    ESLCarouselAutoplayPlugin.prototype.stop = function () {
        this._active = false;
        this.reset();
    };
    ESLCarouselAutoplayPlugin.prototype.reset = function () {
        if (typeof this._timeout === 'number')
            clearTimeout(this._timeout);
        this._timeout = this._active ? window.setTimeout(this._onInterval, this.timeout) : null;
    };
    ESLCarouselAutoplayPlugin.prototype._onInterval = function () {
        if (!this._active)
            return;
        switch (this.direction) {
            case 'next':
                this.carousel.next();
                return;
            case 'prev':
                this.carousel.prev();
                return;
        }
        this.reset();
    };
    ESLCarouselAutoplayPlugin.prototype._onInteract = function (e) {
        switch (e.type) {
            case 'mouseover':
            case 'focusin':
                this.stop();
                return;
            case 'mouseout':
            case 'focusout':
                this.start();
                return;
            case 'esl:slide:changed':
                this.reset();
                return;
        }
    };
    ESLCarouselAutoplayPlugin.is = 'esl-carousel-autoplay-plugin';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_0__.attr)({ defaultValue: 'next' })
    ], ESLCarouselAutoplayPlugin.prototype, "direction", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_0__.attr)({ defaultValue: '5000' })
    ], ESLCarouselAutoplayPlugin.prototype, "timeout", void 0);
    ESLCarouselAutoplayPlugin = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_1__.ExportNs)('CarouselPlugins.Autoplay')
    ], ESLCarouselAutoplayPlugin);
    return ESLCarouselAutoplayPlugin;
}(_esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_2__.ESLCarouselPlugin));



/***/ }),

/***/ "../src/modules/draft/esl-carousel/plugin/esl-carousel-dots.plugin.ts":
/*!****************************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/plugin/esl-carousel-dots.plugin.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarouselDotsPlugin": function() { return /* binding */ ESLCarouselDotsPlugin; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-carousel-plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-plugin.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


/**
 * Slide Carousel Dots plugin
 * Dots plugin renders carousel dots navigation
 *
 * @author Julia Murashko
 */
var ESLCarouselDotsPlugin = /** @class */ (function (_super) {
    __extends(ESLCarouselDotsPlugin, _super);
    function ESLCarouselDotsPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onUpdate = function () { return _this.rerender(); };
        return _this;
    }
    ESLCarouselDotsPlugin.prototype.bind = function () {
        this.rerender();
        this.carousel.addEventListener('esl:slide:changed', this._onUpdate);
    };
    ESLCarouselDotsPlugin.prototype.unbind = function () {
        this.innerHTML = '';
        this.carousel.removeEventListener('esl:slide:changed', this._onUpdate);
    };
    ESLCarouselDotsPlugin.prototype.rerender = function () {
        var html = '';
        var activeDot = Math.floor(this.carousel.activeIndexes[this.carousel.activeCount - 1] / this.carousel.activeCount);
        for (var i = 0; i < Math.ceil(this.carousel.count / this.carousel.activeCount); ++i) {
            html += this.buildDot(i, i === activeDot);
        }
        this.innerHTML = html;
    };
    ESLCarouselDotsPlugin.prototype.buildDot = function (index, isActive) {
        return "<button role=\"button\" class=\"carousel-dot " + (isActive ? 'active-dot' : '') + "\" data-slide-target=\"g" + (index + 1) + "\"></button>";
    };
    ESLCarouselDotsPlugin.is = 'esl-carousel-dots';
    ESLCarouselDotsPlugin.freePlacement = true;
    ESLCarouselDotsPlugin = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_0__.ExportNs)('CarouselPlugins.Dots')
    ], ESLCarouselDotsPlugin);
    return ESLCarouselDotsPlugin;
}(_esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_1__.ESLCarouselPlugin));



/***/ }),

/***/ "../src/modules/draft/esl-carousel/plugin/esl-carousel-link.plugin.ts":
/*!****************************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/plugin/esl-carousel-link.plugin.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarouselLinkPlugin": function() { return /* binding */ ESLCarouselLinkPlugin; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _core_esl_carousel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/esl-carousel */ "../src/modules/draft/esl-carousel/core/esl-carousel.ts");
/* harmony import */ var _esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./esl-carousel-plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-plugin.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




/**
 * Slide Carousel Link plugin. Allows to bind carousel positions.
 */
var ESLCarouselLinkPlugin = /** @class */ (function (_super) {
    __extends(ESLCarouselLinkPlugin, _super);
    function ESLCarouselLinkPlugin() {
        var _this = _super.call(this) || this;
        _this._onSlideChange = _this._onSlideChange.bind(_this);
        return _this;
    }
    Object.defineProperty(ESLCarouselLinkPlugin, "observedAttributes", {
        get: function () {
            return ['to', 'direction'];
        },
        enumerable: false,
        configurable: true
    });
    ESLCarouselLinkPlugin.prototype.bind = function () {
        if (!this.target) {
            this.target = document.querySelector(this.to);
        }
        if (!(this.target instanceof _core_esl_carousel__WEBPACK_IMPORTED_MODULE_0__.ESLCarousel))
            return;
        if (this.direction === 'both' || this.direction === 'reverse') {
            this.target.addEventListener('esl:slide:changed', this._onSlideChange);
        }
        if (this.direction === 'both' || this.direction === 'target') {
            this.carousel.addEventListener('esl:slide:changed', this._onSlideChange);
        }
    };
    ESLCarouselLinkPlugin.prototype.unbind = function () {
        this.target && this.target.removeEventListener('esl:slide:changed', this._onSlideChange);
        this.carousel && this.carousel.removeEventListener('esl:slide:changed', this._onSlideChange);
    };
    ESLCarouselLinkPlugin.prototype._onSlideChange = function (e) {
        if (!this.target || !this.carousel)
            return;
        var $target = e.target === this.carousel ? this.target : this.carousel;
        var $source = e.target === this.carousel ? this.carousel : this.target;
        $target.goTo($source.firstIndex, e.detail.direction);
    };
    ESLCarouselLinkPlugin.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (this.carousel && oldVal !== newVal) {
            this.unbind();
            if (attrName === 'to') {
                this._target = null;
            }
            this.bind();
        }
    };
    Object.defineProperty(ESLCarouselLinkPlugin.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (target) {
            this._target = target;
        },
        enumerable: false,
        configurable: true
    });
    ESLCarouselLinkPlugin.is = 'esl-carousel-link-plugin';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__.attr)()
    ], ESLCarouselLinkPlugin.prototype, "to", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__.attr)({ defaultValue: 'both' })
    ], ESLCarouselLinkPlugin.prototype, "direction", void 0);
    ESLCarouselLinkPlugin = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__.ExportNs)('CarouselPlugins.Link')
    ], ESLCarouselLinkPlugin);
    return ESLCarouselLinkPlugin;
}(_esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_3__.ESLCarouselPlugin));



/***/ }),

/***/ "../src/modules/draft/esl-carousel/plugin/esl-carousel-plugin.ts":
/*!***********************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/plugin/esl-carousel-plugin.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarouselPlugin": function() { return /* binding */ ESLCarouselPlugin; }
/* harmony export */ });
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _core_esl_carousel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/esl-carousel */ "../src/modules/draft/esl-carousel/core/esl-carousel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * {@link ESLCarousel} Plugin base class.
 * The ESL Carousel Plugin should have the dom representation so it's {@extends HTMLElement}.
 * Use the attributes to path the plugin options, the same as with any custom elements.
 * @abstract
 */
var ESLCarouselPlugin = /** @class */ (function (_super) {
    __extends(ESLCarouselPlugin, _super);
    function ESLCarouselPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @returns carousel owner of the plugin
     */
    ESLCarouselPlugin.prototype.findCarouselOwner = function () {
        if (this.constructor.freePlacement) {
            return this.closest(_core_esl_carousel__WEBPACK_IMPORTED_MODULE_0__.ESLCarousel.is);
        }
        else {
            return this.parentNode;
        }
    };
    Object.defineProperty(ESLCarouselPlugin.prototype, "key", {
        /**
         * @returns {string} plugin unique key, ESLCarousel can not own more then one plugin with the same key
         */
        get: function () {
            return this.nodeName.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLCarouselPlugin.prototype, "carousel", {
        /**
         * @returns {ESLCarousel} owner of plugin
         */
        get: function () {
            return this._carousel;
        },
        enumerable: false,
        configurable: true
    });
    ESLCarouselPlugin.prototype.connectedCallback = function () {
        var carousel = this.findCarouselOwner();
        if (carousel instanceof _core_esl_carousel__WEBPACK_IMPORTED_MODULE_0__.ESLCarousel) {
            this._carousel = carousel;
            this._carousel._addPlugin(this);
        }
        else {
            throw new Error('Invalid esl-carousel-plugin placement: plugin element should be placed under the esl-carousel node');
        }
    };
    ESLCarouselPlugin.prototype.disconnectedCallback = function () {
        if (this.carousel) {
            this.carousel._removePlugin(this);
            delete this._carousel;
        }
    };
    ESLCarouselPlugin.register = function (tagName) {
        var _this = this;
        customElements.whenDefined(_core_esl_carousel__WEBPACK_IMPORTED_MODULE_0__.ESLCarousel.is).then(function () { return _super.register.call(_this, tagName); });
    };
    /**
     * {boolean} freePlacement marker define the restriction for the plugin placement.
     * If freePlacement is false - plugin element should be child of ESLCarousel element.
     * If freePlacement is true - plugin can be placed anywhere inside of carousel.
     */
    ESLCarouselPlugin.freePlacement = false;
    return ESLCarouselPlugin;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/draft/esl-carousel/plugin/esl-carousel-touch.plugin.ts":
/*!*****************************************************************************!*\
  !*** ../src/modules/draft/esl-carousel/plugin/esl-carousel-touch.plugin.ts ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLCarouselTouchPlugin": function() { return /* binding */ ESLCarouselTouchPlugin; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./esl-carousel-plugin */ "../src/modules/draft/esl-carousel/plugin/esl-carousel-plugin.ts");
/* harmony import */ var _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../esl-utils/environment/device-detector */ "../src/modules/esl-utils/environment/device-detector.ts");
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




/**
 * Slide Carousel Touch plugin
 */
var ESLCarouselTouchPlugin = /** @class */ (function (_super) {
    __extends(ESLCarouselTouchPlugin, _super);
    function ESLCarouselTouchPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isTouchStarted = false;
        _this.startPoint = { x: 0, y: 0 };
        _this.onTouchStart = function (event) {
            // TODO: precondition for focused element ?
            if ((event instanceof TouchEvent && event.touches.length !== 1) ||
                (event instanceof PointerEvent && event.pointerType !== 'touch')) {
                _this.isTouchStarted = false;
                return;
            }
            _this.isTouchStarted = true;
            _this.startPoint = _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__.EventUtils.normalizeTouchPoint(event);
        };
        _this.onTouchMove = function (event) {
            if (!_this.isTouchStarted)
                return;
            // const point = EventUtils.normalizeTouchPoint(event);
            // const offset = {
            // 	x: point.x - this.startPoint.x,
            // 	y: point.y - this.startPoint.y
            // };
        };
        _this.onTouchEnd = function (event) {
            if (!_this.isTouchStarted)
                return;
            var point = _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__.EventUtils.normalizeTouchPoint(event);
            var offset = {
                x: point.x - _this.startPoint.x,
                y: point.y - _this.startPoint.y
            };
            _this.isTouchStarted = false;
            // TODO: temporary, update according final implementation
            if (Math.abs(offset.x) < Math.abs(offset.y))
                return; // Direction
            if (Math.abs(offset.x) < 100)
                return; // Tolerance
            // Swipe gesture example
            if (offset.x < 0) {
                _this.carousel.next();
            }
            else {
                _this.carousel.prev();
            }
            event.preventDefault();
            event.stopPropagation();
        };
        return _this;
    }
    ESLCarouselTouchPlugin.prototype.bind = function () {
        var events = _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__.DeviceDetector.TOUCH_EVENTS;
        this.carousel.addEventListener(events.START, this.onTouchStart);
        this.carousel.addEventListener(events.MOVE, this.onTouchMove);
        this.carousel.addEventListener(events.END, this.onTouchEnd);
    };
    ESLCarouselTouchPlugin.prototype.unbind = function () {
        var events = _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__.DeviceDetector.TOUCH_EVENTS;
        this.carousel.removeEventListener(events.START, this.onTouchStart);
        this.carousel.removeEventListener(events.MOVE, this.onTouchMove);
        this.carousel.removeEventListener(events.END, this.onTouchEnd);
    };
    ESLCarouselTouchPlugin.is = 'esl-carousel-touch-plugin';
    ESLCarouselTouchPlugin = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__.ExportNs)('CarouselPlugins.Touch')
    ], ESLCarouselTouchPlugin);
    return ESLCarouselTouchPlugin;
}(_esl_carousel_plugin__WEBPACK_IMPORTED_MODULE_3__.ESLCarouselPlugin));



/***/ }),

/***/ "../src/modules/esl-a11y-group/core/esl-a11y-group.ts":
/*!************************************************************!*\
  !*** ../src/modules/esl-a11y-group/core/esl-a11y-group.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLA11yGroup": function() { return /* binding */ ESLA11yGroup; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-traversing-query/core */ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/dom/keys */ "../src/modules/esl-utils/dom/keys.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





/**
 * ESLA11yGroup component
 * @author Julia Murashko
 *
 * ESLA11yGroup - helper custom element that adds a11y group behavior to targets.
 */
var ESLA11yGroup = /** @class */ (function (_super) {
    __extends(ESLA11yGroup, _super);
    function ESLA11yGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ESLA11yGroup.prototype, "$root", {
        /** @returns {HTMLElement} root element of the group */
        get: function () {
            return this.parentElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLA11yGroup.prototype, "$targets", {
        /** @returns {HTMLElement[]} targets of the group */
        get: function () {
            return _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_0__.TraversingQuery.all(this.targets, this.$root);
        },
        enumerable: false,
        configurable: true
    });
    ESLA11yGroup.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.bindEvents();
    };
    ESLA11yGroup.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.unbindEvents();
    };
    ESLA11yGroup.prototype.bindEvents = function () {
        this.$root.addEventListener('keydown', this._onKeydown);
    };
    ESLA11yGroup.prototype.unbindEvents = function () {
        this.$root.removeEventListener('keydown', this._onKeydown);
    };
    ESLA11yGroup.prototype._onKeydown = function (e) {
        var target = e.target;
        if (!this.$targets.includes(target))
            return;
        if ([_esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_1__.ARROW_UP, _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_1__.ARROW_LEFT].includes(e.key)) {
            this.goTo('prev', target);
            e.preventDefault();
        }
        if ([_esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_1__.ARROW_DOWN, _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_1__.ARROW_RIGHT].includes(e.key)) {
            this.goTo('next', target);
            e.preventDefault();
        }
    };
    /** Go to the target from the passed element or currently focused target by default */
    ESLA11yGroup.prototype.goTo = function (target, from) {
        if (from === void 0) { from = this.current(); }
        if (!from)
            return;
        var targetEl = this[target](from);
        if (!targetEl)
            return;
        targetEl.focus();
        this.activateSelected && targetEl.click();
    };
    /** @returns {HTMLElement} next target fot trigger */
    ESLA11yGroup.prototype.next = function (trigger) {
        var triggers = this.$targets;
        var index = triggers.indexOf(trigger);
        return triggers[(index + 1) % triggers.length];
    };
    /** @returns {HTMLElement} previous target fot trigger */
    ESLA11yGroup.prototype.prev = function (trigger) {
        var triggers = this.$targets;
        var index = triggers.indexOf(trigger);
        return triggers[(index - 1 + triggers.length) % triggers.length];
    };
    /** @returns {HTMLElement} currently focused element from targets */
    ESLA11yGroup.prototype.current = function () {
        var $active = document.activeElement;
        return this.$targets.includes($active) ? $active : null;
    };
    ESLA11yGroup.is = 'esl-a11y-group';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_2__.attr)({ defaultValue: '::child' })
    ], ESLA11yGroup.prototype, "targets", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.boolAttr)({})
    ], ESLA11yGroup.prototype, "activateSelected", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_4__.bind
    ], ESLA11yGroup.prototype, "_onKeydown", null);
    ESLA11yGroup = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_5__.ExportNs)('A11yGroup')
    ], ESLA11yGroup);
    return ESLA11yGroup;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-alert/core/esl-alert.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-alert/core/esl-alert.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLAlert": function() { return /* binding */ ESLAlert; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/json-attr.ts");
/* harmony import */ var _esl_toggleable_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../esl-toggleable/core */ "../src/modules/esl-toggleable/core/esl-toggleable.ts");
/* harmony import */ var _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/environment/device-detector */ "../src/modules/esl-utils/environment/device-detector.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_utils_fixes_ie_fixes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/fixes/ie-fixes */ "../src/modules/esl-utils/fixes/ie-fixes.ts");
/* harmony import */ var _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-traversing-query/core */ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








/**
 * ESLAlert component
 *
 * @author Julia Murashko
 *
 * ESLAlert is a component to show small notifications on your pages. ESLAlert can have multiple instances on the page.
 */
var ESLAlert = /** @class */ (function (_super) {
    __extends(ESLAlert, _super);
    function ESLAlert() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ESLAlert_1 = ESLAlert;
    Object.defineProperty(ESLAlert, "observedAttributes", {
        get: function () {
            return ['target'];
        },
        enumerable: false,
        configurable: true
    });
    /** Create global alert instance (using body element as a base) */
    ESLAlert.init = function () {
        if (document.querySelector("body > " + ESLAlert_1.is))
            return;
        var alert = document.createElement(ESLAlert_1.is);
        document.body.appendChild(alert);
    };
    ESLAlert.prototype.mergeDefaultParams = function (params) {
        var type = this.constructor;
        return Object.assign({}, type.defaultConfig, this.defaultParams || {}, params || {});
    };
    ESLAlert.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (!this.connected)
            return;
        if (attrName === 'target') {
            this.$target = _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_0__.TraversingQuery.first(this.target);
        }
    };
    ESLAlert.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.setAttribute('role', this.getAttribute('role') || 'alert');
        this.$content = document.createElement('div');
        this.$content.className = 'esl-alert-content';
        this.innerHTML = '';
        this.appendChild(this.$content);
        if (_esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__.DeviceDetector.isIE)
            this.appendChild((0,_esl_utils_fixes_ie_fixes__WEBPACK_IMPORTED_MODULE_2__.createZIndexIframe)());
        if (this.target) {
            this.$target = _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_0__.TraversingQuery.first(this.target, this);
        }
    };
    ESLAlert.prototype.unbindEvents = function () {
        _super.prototype.unbindEvents.call(this);
        this.unbindTargetEvents();
    };
    Object.defineProperty(ESLAlert.prototype, "$target", {
        /** Target element to listen to activation events */
        get: function () {
            return this._$target;
        },
        set: function ($el) {
            this.unbindTargetEvents();
            this._$target = $el;
            this.bindTargetEvents();
        },
        enumerable: false,
        configurable: true
    });
    ESLAlert.prototype.bindTargetEvents = function () {
        if (!this.$target || !this.connected)
            return;
        this.$target.addEventListener(ESLAlert_1.eventNs + ":show", this._onTargetEvent);
        this.$target.addEventListener(ESLAlert_1.eventNs + ":hide", this._onTargetEvent);
    };
    ESLAlert.prototype.unbindTargetEvents = function () {
        if (!this.$target)
            return;
        this.$target.removeEventListener(ESLAlert_1.eventNs + ":show", this._onTargetEvent);
        this.$target.removeEventListener(ESLAlert_1.eventNs + ":hide", this._onTargetEvent);
    };
    ESLAlert.prototype.onShow = function (params) {
        if (this._clearTimeout)
            window.clearTimeout(this._clearTimeout);
        if (params.html || params.text) {
            this.render(params);
            _super.prototype.onShow.call(this, params);
        }
        this.hide(params);
    };
    ESLAlert.prototype.onHide = function (params) {
        var _this = this;
        _super.prototype.onHide.call(this, params);
        this._clearTimeout = window.setTimeout(function () { return _this.clear(); }, params.hideTime);
    };
    ESLAlert.prototype.render = function (_a) {
        var text = _a.text, html = _a.html, cls = _a.cls;
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.removeCls(this, this.activeCls);
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.addCls(this, this.activeCls = cls);
        if (html)
            this.$content.innerHTML = html;
        if (text)
            this.$content.textContent = text;
    };
    ESLAlert.prototype.clear = function () {
        this.$content.innerHTML = '';
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.removeCls(this, this.activeCls);
    };
    ESLAlert.prototype._onTargetEvent = function (e) {
        if (e.type === ESLAlert_1.eventNs + ":show") {
            var params = Object.assign({}, e.detail, { force: true });
            this.show(params);
        }
        if (e.type === ESLAlert_1.eventNs + ":hide") {
            var params = Object.assign({}, { hideDelay: 0 }, e.detail, { force: true });
            this.hide(params);
        }
        e.stopPropagation();
    };
    var ESLAlert_1;
    ESLAlert.is = 'esl-alert';
    ESLAlert.eventNs = 'esl:alert';
    /** Default show/hide params for all ESLAlert instances */
    ESLAlert.defaultConfig = {
        hideTime: 300,
        hideDelay: 2500
    };
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.attr)({ defaultValue: '::parent' })
    ], ESLAlert.prototype, "target", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.jsonAttr)()
    ], ESLAlert.prototype, "defaultParams", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__.bind
    ], ESLAlert.prototype, "_onTargetEvent", null);
    ESLAlert = ESLAlert_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_7__.ExportNs)('Alert')
    ], ESLAlert);
    return ESLAlert;
}(_esl_toggleable_core__WEBPACK_IMPORTED_MODULE_8__.ESLToggleable));



/***/ }),

/***/ "../src/modules/esl-base-element/core/esl-base-element.ts":
/*!****************************************************************!*\
  !*** ../src/modules/esl-base-element/core/esl-base-element.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLBaseElement": function() { return /* binding */ ESLBaseElement; }
/* harmony export */ });
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Base class for ESL custom elements.
 * Allows to define custom element with the optional custom tag name.
 */
var ESLBaseElement = /** @class */ (function (_super) {
    __extends(ESLBaseElement, _super);
    function ESLBaseElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._connected = false;
        return _this;
    }
    ESLBaseElement.prototype.connectedCallback = function () {
        this._connected = true;
        this.classList.add(this.constructor.is);
    };
    ESLBaseElement.prototype.disconnectedCallback = function () {
        this._connected = false;
    };
    Object.defineProperty(ESLBaseElement.prototype, "connected", {
        /** Check that the element is connected and `connectedCallback` has been executed */
        get: function () {
            return this._connected;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Dispatch component custom event.
     * Uses 'esl:' prefix for event name, overridable to customize event namespaces.
     * @param eventName - event name
     * @param [eventInit] - custom event init. See {@link CustomEventInit}
     */
    ESLBaseElement.prototype.$$fire = function (eventName, eventInit) {
        return _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__.EventUtils.dispatch(this, 'esl:' + eventName, eventInit);
    };
    /**
     * Register component in the {@link customElements} registry
     * @param [tagName] - custom tag name to register custom element
     */
    ESLBaseElement.register = function (tagName) {
        tagName = tagName || this.is;
        if (!tagName)
            throw new Error('Can not define custom element');
        var constructor = customElements.get(tagName);
        if (constructor) {
            if (constructor.is !== tagName)
                throw new Error('Element declaration tag inconsistency');
            return;
        }
        if (this.is !== tagName) {
            this.is = tagName;
        }
        customElements.define(tagName, this);
    };
    /** Custom element tag name */
    ESLBaseElement.is = '';
    return ESLBaseElement;
}(HTMLElement));



/***/ }),

/***/ "../src/modules/esl-base-element/decorators/attr.ts":
/*!**********************************************************!*\
  !*** ../src/modules/esl-base-element/decorators/attr.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attr": function() { return /* binding */ attr; }
/* harmony export */ });
/* harmony import */ var _esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/misc/format */ "../src/modules/esl-utils/misc/format.ts");

function buildSimpleDescriptor(attrName, readOnly, defaultValue) {
    function get() {
        var value = this.getAttribute(attrName);
        return typeof value === 'string' ? value : defaultValue;
    }
    function set(value) {
        if (value === undefined || value === null || value === false) {
            this.removeAttribute(attrName);
        }
        else {
            this.setAttribute(attrName, value === true ? '' : value);
        }
    }
    return readOnly ? { get: get } : { get: get, set: set };
}
var buildAttrName = function (propName, dataAttr) { return dataAttr ? "data-" + (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.toKebabCase)(propName) : (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.toKebabCase)(propName); };
/**
 * Decorator to map current property to element attribute value.
 * Maps string type property.
 * @param [config] - mapping configuration. See {@link AttrDescriptor}
 */
var attr = function (config) {
    if (config === void 0) { config = {}; }
    config = Object.assign({ defaultValue: '' }, config);
    return function (target, propName) {
        var attrName = buildAttrName(config.name || propName, !!config.dataAttr);
        Object.defineProperty(target, propName, buildSimpleDescriptor(attrName, !!config.readonly, config.defaultValue));
    };
};


/***/ }),

/***/ "../src/modules/esl-base-element/decorators/bool-attr.ts":
/*!***************************************************************!*\
  !*** ../src/modules/esl-base-element/decorators/bool-attr.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "boolAttr": function() { return /* binding */ boolAttr; }
/* harmony export */ });
/* harmony import */ var _esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/misc/format */ "../src/modules/esl-utils/misc/format.ts");

function buildConditionalDescriptor(attrName, readOnly) {
    function get() {
        return this.hasAttribute(attrName);
    }
    function set(value) {
        this.toggleAttribute(attrName, value);
    }
    return readOnly ? { get: get } : { get: get, set: set };
}
var buildAttrName = function (propName, dataAttr) { return dataAttr ? "data-" + (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.toKebabCase)(propName) : (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.toKebabCase)(propName); };
/**
 * Decorator to map current property to element boolean (marker) attribute state.
 * Maps boolean type property.
 * @param [config] - mapping configuration. See {@link BoolAttrDescriptor}
 */
var boolAttr = function (config) {
    if (config === void 0) { config = {}; }
    return function (target, propName) {
        var attrName = buildAttrName(config.name || propName, !!config.dataAttr);
        Object.defineProperty(target, propName, buildConditionalDescriptor(attrName, !!config.readonly));
    };
};


/***/ }),

/***/ "../src/modules/esl-base-element/decorators/json-attr.ts":
/*!***************************************************************!*\
  !*** ../src/modules/esl-base-element/decorators/json-attr.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "jsonAttr": function() { return /* binding */ jsonAttr; }
/* harmony export */ });
/* harmony import */ var _esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/misc/format */ "../src/modules/esl-utils/misc/format.ts");

function buildJsonAttrDescriptor(attrName, readOnly, defaultValue) {
    function get() {
        var attrContent = (this.getAttribute(attrName) || '').trim();
        return (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.evaluate)(attrContent, defaultValue);
    }
    function set(value) {
        if (typeof value !== 'object') {
            console.error('Can not set json value: value should be object');
        }
        try {
            if (value) {
                var serializedValue = JSON.stringify(value);
                this.setAttribute(attrName, serializedValue);
            }
            else {
                this.removeAttribute(attrName);
            }
        }
        catch (e) {
            console.error('[ESL] jsonAttr: Can not set json value ', e);
        }
    }
    return readOnly ? { get: get } : { get: get, set: set };
}
var buildAttrName = function (propName, dataAttr) { return dataAttr ? "data-" + (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.toKebabCase)(propName) : (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.toKebabCase)(propName); };
/**
 * Decorator to map current property to element attribute value using JSON (de-)serialization rules.
 * Maps object type property.
 * @param [config] - mapping configuration. See {@link JsonAttrDescriptor}
 */
var jsonAttr = function (config) {
    if (config === void 0) { config = {}; }
    config = Object.assign({ defaultValue: {} }, config);
    return function (target, propName) {
        var attrName = buildAttrName(config.name || propName, !!config.dataAttr);
        Object.defineProperty(target, propName, buildJsonAttrDescriptor(attrName, !!config.readonly, config.defaultValue));
    };
};


/***/ }),

/***/ "../src/modules/esl-forms/esl-select-list/core/esl-select-item.ts":
/*!************************************************************************!*\
  !*** ../src/modules/esl-forms/esl-select-list/core/esl-select-item.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLSelectItem": function() { return /* binding */ ESLSelectItem; }
/* harmony export */ });
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


/**
 * ESLSelectItem component
 * @author Alexey Stsefanovich (ala'n)
 *
 * ESLSelectItem - inner component to render an option
 */
var ESLSelectItem = /** @class */ (function (_super) {
    __extends(ESLSelectItem, _super);
    function ESLSelectItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ESLSelectItem_1 = ESLSelectItem;
    Object.defineProperty(ESLSelectItem, "observedAttributes", {
        get: function () {
            return ['selected'];
        },
        enumerable: false,
        configurable: true
    });
    ESLSelectItem.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.tabIndex = 0;
        this.setAttribute('role', 'checkbox');
        this.setAttribute('aria-selected', String(this.selected));
    };
    ESLSelectItem.prototype.attributeChangedCallback = function (attrName) {
        if (attrName === 'selected') {
            this.setAttribute('aria-selected', String(this.selected));
        }
    };
    /** Helper to create an option item */
    ESLSelectItem.build = function (option) {
        var item = document.createElement(ESLSelectItem_1.is);
        item.original = option;
        item.value = option.value;
        item.selected = option.selected;
        item.textContent = option.text;
        return item;
    };
    var ESLSelectItem_1;
    ESLSelectItem.is = 'esl-select-item';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_0__.attr)()
    ], ESLSelectItem.prototype, "value", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__.boolAttr)()
    ], ESLSelectItem.prototype, "selected", void 0);
    ESLSelectItem = ESLSelectItem_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__.ExportNs)('SelectItem')
    ], ESLSelectItem);
    return ESLSelectItem;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-forms/esl-select-list/core/esl-select-list.ts":
/*!************************************************************************!*\
  !*** ../src/modules/esl-forms/esl-select-list/core/esl-select-list.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLSelectList": function() { return /* binding */ ESLSelectList; }
/* harmony export */ });
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-utils/dom/keys */ "../src/modules/esl-utils/dom/keys.ts");
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_scrollbar_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-scrollbar/core */ "../src/modules/esl-scrollbar/core/esl-scrollbar.ts");
/* harmony import */ var _esl_select_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-select-item */ "../src/modules/esl-forms/esl-select-list/core/esl-select-item.ts");
/* harmony import */ var _esl_select_wrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./esl-select-wrapper */ "../src/modules/esl-forms/esl-select-list/core/esl-select-wrapper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};







/**
 * ESLSelectList component
 * @author Alexey Stsefanovich (ala'n)
 *
 * ESLSelectList is a component to show selectable list of items. Decorates native HTMLSelectElement
 */
var ESLSelectList = /** @class */ (function (_super) {
    __extends(ESLSelectList, _super);
    function ESLSelectList() {
        var _this = _super.call(this) || this;
        _this.$list = document.createElement('div');
        _this.$list.setAttribute('role', 'list');
        _this.$list.classList.add('esl-scrollable-content');
        _this.$list.classList.add('esl-select-list-container');
        _this.$scroll = document.createElement(_esl_scrollbar_core__WEBPACK_IMPORTED_MODULE_0__.ESLScrollbar.is);
        _this.$scroll.target = '::prev';
        _this.$selectAll = document.createElement(_esl_select_item__WEBPACK_IMPORTED_MODULE_1__.ESLSelectItem.is);
        _this.$selectAll.classList.add('esl-select-all-item');
        return _this;
    }
    Object.defineProperty(ESLSelectList, "observedAttributes", {
        get: function () {
            return ['select-all-label', 'disabled'];
        },
        enumerable: false,
        configurable: true
    });
    ESLSelectList.register = function () {
        _esl_select_item__WEBPACK_IMPORTED_MODULE_1__.ESLSelectItem.register();
        _super.register.call(this);
    };
    ESLSelectList.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (!this.connected || newVal === oldVal)
            return;
        if (attrName === 'select-all-label') {
            this.$selectAll.textContent = newVal;
        }
        if (attrName === 'disabled') {
            this._updateDisabled();
        }
    };
    ESLSelectList.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.appendChild(this.$selectAll);
        this.appendChild(this.$list);
        this.appendChild(this.$scroll);
        this.bindSelect();
        this.bindEvents();
        this._updateDisabled();
    };
    ESLSelectList.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.appendChild(this.$selectAll);
        this.appendChild(this.$list);
        this.appendChild(this.$scroll);
        this.unbindEvents();
    };
    ESLSelectList.prototype.bindSelect = function () {
        var target = this.querySelector('[esl-select-target]');
        if (!target || !(target instanceof HTMLSelectElement))
            return;
        this.$select = target;
    };
    ESLSelectList.prototype.bindEvents = function () {
        if (!this.$select)
            return;
        this.addEventListener('click', this._onClick);
        this.addEventListener('keydown', this._onKeydown);
    };
    ESLSelectList.prototype.unbindEvents = function () {
        if (!this.$select)
            return;
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', this._onKeydown);
    };
    ESLSelectList.prototype._renderItems = function () {
        if (!this.$select)
            return;
        this.$list.innerHTML = '';
        this.$items = this.options.map(_esl_select_item__WEBPACK_IMPORTED_MODULE_1__.ESLSelectItem.build);
        if (this.pinSelected) {
            this._renderGroup(this.$items.filter(function (option) { return option.selected; }));
            this._renderGroup(this.$items.filter(function (option) { return !option.selected; }));
        }
        else {
            this._renderGroup(this.$items);
        }
        this.toggleAttribute('multiple', this.multiple);
    };
    ESLSelectList.prototype._renderGroup = function (items) {
        var _this = this;
        items.forEach(function (item) { return _this.$list.appendChild(item); });
        var _a = __read(items.slice(-1), 1), last = _a[0];
        last && last.classList.add('last-in-group');
    };
    ESLSelectList.prototype._updateSelectAll = function () {
        if (!this.multiple) {
            this.$selectAll.removeAttribute('tabindex');
            return;
        }
        this.$selectAll.tabIndex = 0;
        this.$selectAll.selected = this.isAllSelected();
        this.$selectAll.textContent = this.selectAllLabel;
    };
    ESLSelectList.prototype._updateDisabled = function () {
        this.setAttribute('aria-disabled', String(this.disabled));
        if (!this.$select)
            return;
        this.$select.disabled = this.disabled;
    };
    ESLSelectList.prototype._onTargetChange = function (newTarget, oldTarget) {
        _super.prototype._onTargetChange.call(this, newTarget, oldTarget);
        this._updateSelectAll();
        this._renderItems();
        this.bindEvents();
    };
    ESLSelectList.prototype._onChange = function () {
        this._updateSelectAll();
        this.$items.forEach(function (item) {
            item.selected = item.original.selected;
        });
    };
    ESLSelectList.prototype._onClick = function (e) {
        if (this.disabled)
            return;
        var target = e.target;
        if (!target || !(target instanceof _esl_select_item__WEBPACK_IMPORTED_MODULE_1__.ESLSelectItem))
            return;
        if (target.classList.contains('esl-select-all-item')) {
            this.setAllSelected(!target.selected);
        }
        else {
            this.setSelected(target.value, !target.selected);
        }
    };
    ESLSelectList.prototype._onKeydown = function (e) {
        if ([_esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__.ENTER, _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__.SPACE].includes(e.key)) {
            this._onClick(e);
            e.preventDefault();
        }
        if ([_esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__.ARROW_UP, _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__.ARROW_DOWN].includes(e.key)) {
            var index = this.$items.indexOf(document.activeElement);
            var count = this.$items.length;
            var increment = e.key === _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__.ARROW_UP ? -1 : 1;
            if (index === -1)
                return;
            this.$items[(index + increment + count) % count].focus();
            e.preventDefault();
        }
    };
    ESLSelectList.is = 'esl-select-list';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.attr)({ defaultValue: 'Select All' })
    ], ESLSelectList.prototype, "selectAllLabel", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.boolAttr)()
    ], ESLSelectList.prototype, "disabled", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.boolAttr)()
    ], ESLSelectList.prototype, "pinSelected", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLSelectList.prototype, "_onTargetChange", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLSelectList.prototype, "_onChange", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLSelectList.prototype, "_onClick", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLSelectList.prototype, "_onKeydown", null);
    ESLSelectList = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_6__.ExportNs)('SelectList')
    ], ESLSelectList);
    return ESLSelectList;
}(_esl_select_wrapper__WEBPACK_IMPORTED_MODULE_7__.ESLSelectWrapper));



/***/ }),

/***/ "../src/modules/esl-forms/esl-select-list/core/esl-select-wrapper.ts":
/*!***************************************************************************!*\
  !*** ../src/modules/esl-forms/esl-select-list/core/esl-select-wrapper.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLSelectWrapper": function() { return /* binding */ ESLSelectWrapper; }
/* harmony export */ });
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



/**
 * Base class for {@link HTMLSelectElement} wrapper element, implements {@link ESLSelectModel) options source
 */
var ESLSelectWrapper = /** @class */ (function (_super) {
    __extends(ESLSelectWrapper, _super);
    function ESLSelectWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._mutationObserver = new MutationObserver(_this._onTargetMutation.bind(_this));
        return _this;
    }
    Object.defineProperty(ESLSelectWrapper.prototype, "$select", {
        /** Native select that is wrapped */
        get: function () {
            return this._$select;
        },
        set: function (select) {
            var prev = this._$select;
            this._$select = select;
            this._onTargetChange(select, prev);
        },
        enumerable: false,
        configurable: true
    });
    ESLSelectWrapper.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.ownerDocument.addEventListener('reset', this._onReset);
    };
    ESLSelectWrapper.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.ownerDocument.removeEventListener('reset', this._onReset);
        this._mutationObserver.disconnect();
        this._$select && this._$select.removeEventListener('change', this._onChange);
    };
    ESLSelectWrapper.prototype._onChange = function (event) { };
    ESLSelectWrapper.prototype._onTargetChange = function (newTarget, oldTarget) {
        if (oldTarget)
            oldTarget.removeEventListener('change', this._onChange);
        if (newTarget)
            newTarget.addEventListener('change', this._onChange);
        this._mutationObserver.disconnect();
        var type = this.constructor;
        if (newTarget)
            this._mutationObserver.observe(newTarget, type.observationConfig);
    };
    ESLSelectWrapper.prototype._onTargetMutation = function (changes) {
        this._onChange();
    };
    ESLSelectWrapper.prototype._onReset = function (event) {
        var _this = this;
        if (!event.target || event.target !== this.form)
            return;
        setTimeout(function () { return _this._onChange(event); });
    };
    Object.defineProperty(ESLSelectWrapper.prototype, "multiple", {
        get: function () {
            return this.$select && this.$select.multiple;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "options", {
        get: function () {
            return this.$select ? Array.from(this.$select.options) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "selectedOptions", {
        get: function () {
            return this.options.filter(function (item) { return item.selected; });
        },
        enumerable: false,
        configurable: true
    });
    ESLSelectWrapper.prototype.getOption = function (value) {
        return this.options.find(function (item) { return item.value === value; });
    };
    ESLSelectWrapper.prototype.setSelected = function (value, state) {
        var option = this.getOption(value);
        option && (option.selected = state);
        _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__.EventUtils.dispatch(this.$select, 'change');
    };
    ESLSelectWrapper.prototype.isSelected = function (value) {
        var opt = this.getOption(value);
        return !!opt && opt.selected;
    };
    ESLSelectWrapper.prototype.hasSelected = function () {
        return this.options.some(function (item) { return item.selected; });
    };
    ESLSelectWrapper.prototype.isAllSelected = function () {
        return this.options.every(function (item) { return item.selected; });
    };
    ESLSelectWrapper.prototype.setAllSelected = function (state) {
        if (!this.multiple)
            return false;
        this.options.forEach(function (item) { return item.selected = state; });
        _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_0__.EventUtils.dispatch(this.$select, 'change');
    };
    Object.defineProperty(ESLSelectWrapper.prototype, "value", {
        // Proxy select methods and values
        get: function () {
            var _a;
            return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "values", {
        get: function () {
            return this.selectedOptions.map(function (item) { return item.value; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "form", {
        get: function () {
            var _a;
            return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.form;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "name", {
        get: function () {
            var _a;
            return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.name;
        },
        set: function (name) {
            this.$select && (this.$select.name = name);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "required", {
        get: function () {
            var _a;
            return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.required;
        },
        set: function (required) {
            this.$select && (this.$select.required = required);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "validity", {
        // Validation API values
        get: function () {
            var _a;
            return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.validity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "validationMessage", {
        get: function () {
            var _a;
            return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.validationMessage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectWrapper.prototype, "willValidate", {
        get: function () {
            var _a;
            return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.willValidate;
        },
        enumerable: false,
        configurable: true
    });
    // Validation API methods
    ESLSelectWrapper.prototype.checkValidity = function () {
        var _a;
        return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.checkValidity();
    };
    ESLSelectWrapper.prototype.reportValidity = function () {
        var _a;
        return (_a = this.$select) === null || _a === void 0 ? void 0 : _a.reportValidity();
    };
    ESLSelectWrapper.prototype.setCustomValidity = function (error) {
        var _a;
        (_a = this.$select) === null || _a === void 0 ? void 0 : _a.setCustomValidity(error);
    };
    ESLSelectWrapper.observationConfig = {
        subtree: true,
        attributes: true,
        attributeFilter: ['value', 'selected', 'disabled'],
        childList: true,
        characterData: true
    };
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_1__.bind
    ], ESLSelectWrapper.prototype, "_onReset", null);
    return ESLSelectWrapper;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_2__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-forms/esl-select/core/esl-select-dropdown.ts":
/*!***********************************************************************!*\
  !*** ../src/modules/esl-forms/esl-select/core/esl-select-dropdown.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLSelectDropdown": function() { return /* binding */ ESLSelectDropdown; }
/* harmony export */ });
/* harmony import */ var _esl_toggleable_core_esl_toggleable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../esl-toggleable/core/esl-toggleable */ "../src/modules/esl-toggleable/core/esl-toggleable.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-utils/dom/keys */ "../src/modules/esl-utils/dom/keys.ts");
/* harmony import */ var _esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-utils/async/raf */ "../src/modules/esl-utils/async/raf.ts");
/* harmony import */ var _esl_select_list_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-select-list/core */ "../src/modules/esl-forms/esl-select-list/core/esl-select-list.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





/**
 * ESLSelectDropdown component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom component to render {@link ESLSelect) dropdown section
 * Uses {@link ESLSelectList} to render the content
 */
var ESLSelectDropdown = /** @class */ (function (_super) {
    __extends(ESLSelectDropdown, _super);
    function ESLSelectDropdown() {
        var _this = _super.call(this) || this;
        _this._deferredUpdatePosition = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(function () { return _this.updatePosition(); });
        _this.$list = document.createElement(_esl_select_list_core__WEBPACK_IMPORTED_MODULE_1__.ESLSelectList.is);
        return _this;
    }
    ESLSelectDropdown.register = function () {
        _esl_select_list_core__WEBPACK_IMPORTED_MODULE_1__.ESLSelectList.register();
        _super.register.call(this);
    };
    Object.defineProperty(ESLSelectDropdown.prototype, "closeOnEsc", {
        // TODO: update defaults + override decorator
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLSelectDropdown.prototype, "closeOnOutsideAction", {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        get: function () { return true; },
        enumerable: false,
        configurable: true
    });
    ESLSelectDropdown.prototype.setInitialState = function () { };
    ESLSelectDropdown.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.appendChild(this.$list);
    };
    ESLSelectDropdown.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.removeChild(this.$list);
    };
    ESLSelectDropdown.prototype.bindEvents = function () {
        _super.prototype.bindEvents.call(this);
        window.addEventListener('resize', this._deferredUpdatePosition);
    };
    ESLSelectDropdown.prototype.unbindEvents = function () {
        _super.prototype.unbindEvents.call(this);
        window.removeEventListener('resize', this._deferredUpdatePosition);
    };
    ESLSelectDropdown.prototype.onShow = function (params) {
        document.body.appendChild(this);
        this._disposeTimeout && window.clearTimeout(this._disposeTimeout);
        this.$list.pinSelected = this.$owner.pinSelected;
        this.$list.selectAllLabel = this.$owner.selectAllLabel;
        this.$list.$select = this.$owner.$select;
        _super.prototype.onShow.call(this, params);
        var focusable = this.querySelector('[tabindex]');
        focusable && focusable.focus({ preventScroll: true });
        this.updatePosition();
    };
    ESLSelectDropdown.prototype.onHide = function (params) {
        var _this = this;
        var select = this.activator;
        _super.prototype.onHide.call(this, params);
        this._disposeTimeout = window.setTimeout(function () {
            if (_this.parentNode !== document.body)
                return;
            document.body.removeChild(_this);
        }, 1000);
        select && setTimeout(function () { return select.focus({ preventScroll: true }); }, 0);
    };
    ESLSelectDropdown.prototype._onKeyboardEvent = function (e) {
        _super.prototype._onKeyboardEvent.call(this, e);
        if (e.key === _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_2__.TAB)
            this._onTabKey(e);
    };
    ESLSelectDropdown.prototype._onTabKey = function (e) {
        var els = this.querySelectorAll('[tabindex]');
        var first = els[0];
        var last = els[els.length - 1];
        if (first && e.target === last && !e.shiftKey)
            first.focus();
        if (last && e.target === first && e.shiftKey)
            last.focus();
    };
    ESLSelectDropdown.prototype.updatePosition = function () {
        if (!this.activator)
            return;
        var windowY = window.scrollY || window.pageYOffset;
        var rect = this.activator.getBoundingClientRect();
        this.style.top = windowY + rect.top + rect.height + "px";
        this.style.left = rect.left + "px";
        this.style.width = rect.width + "px";
    };
    ESLSelectDropdown.is = 'esl-select-dropdown';
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_3__.bind
    ], ESLSelectDropdown.prototype, "_onKeyboardEvent", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_3__.bind
    ], ESLSelectDropdown.prototype, "updatePosition", null);
    return ESLSelectDropdown;
}(_esl_toggleable_core_esl_toggleable__WEBPACK_IMPORTED_MODULE_4__.ESLToggleable));



/***/ }),

/***/ "../src/modules/esl-forms/esl-select/core/esl-select-renderer.ts":
/*!***********************************************************************!*\
  !*** ../src/modules/esl-forms/esl-select/core/esl-select-renderer.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLSelectRenderer": function() { return /* binding */ ESLSelectRenderer; }
/* harmony export */ });
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../esl-utils/async/raf */ "../src/modules/esl-utils/async/raf.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-utils/misc/format */ "../src/modules/esl-utils/misc/format.ts");
/* harmony import */ var _esl_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-select */ "../src/modules/esl-forms/esl-select/core/esl-select.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





/**
 * ESLSelectRenderer component
 * @author Alexey Stsefanovich (ala'n)
 *
 * Auxiliary inner custom element to render {@link ESLSelect} inline field
 */
var ESLSelectRenderer = /** @class */ (function (_super) {
    __extends(ESLSelectRenderer, _super);
    function ESLSelectRenderer() {
        var _this = _super.call(this) || this;
        _this._deferredRerender = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(function () { return _this.render(); });
        _this.$remove = document.createElement('button');
        _this.$remove.type = 'button';
        _this.$remove.setAttribute('aria-label', 'Clear');
        _this.$remove.classList.add('esl-select-clear-btn');
        _this.$remove.classList.add('icon-nav-close-menu');
        _this.$container = document.createElement('div');
        _this.$container.classList.add('esl-select-text-container');
        _this.$text = document.createElement('span');
        _this.$text.classList.add('esl-select-text');
        _this.$container.appendChild(_this.$text);
        _this.$rest = document.createElement('span');
        _this.$rest.classList.add('esl-select-text');
        _this.$container.appendChild(_this.$rest);
        return _this;
    }
    Object.defineProperty(ESLSelectRenderer.prototype, "owner", {
        /** ESLSelect owner */
        get: function () {
            return this.parentElement instanceof _esl_select__WEBPACK_IMPORTED_MODULE_1__.ESLSelect ? this.parentElement : null;
        },
        enumerable: false,
        configurable: true
    });
    ESLSelectRenderer.prototype.connectedCallback = function () {
        var _this = this;
        _super.prototype.connectedCallback.call(this);
        this.appendChild(this.$container);
        this.appendChild(this.$remove);
        this.bindEvents();
        customElements.whenDefined(ESLSelectRenderer.is).then(function () { return _this.render(); });
    };
    ESLSelectRenderer.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.removeChild(this.$container);
        this.removeChild(this.$remove);
        this.unbindEvents();
    };
    ESLSelectRenderer.prototype.bindEvents = function () {
        if (!this.owner)
            return;
        this.owner.addEventListener('esl:change:value', this.render);
        this.$remove.addEventListener('click', this._onClear);
        window.addEventListener('resize', this._deferredRerender);
    };
    ESLSelectRenderer.prototype.unbindEvents = function () {
        if (!this.owner)
            return;
        this.owner.removeEventListener('esl:change:value', this.render);
        this.$remove.removeEventListener('click', this._onClear);
        window.removeEventListener('resize', this._deferredRerender);
    };
    /** Rerender component with markers */
    ESLSelectRenderer.prototype.render = function () {
        if (!this.owner)
            return;
        var selected = this.owner.selectedOptions;
        this.hasValue = !!selected.length;
        this.toggleAttribute('multiple', this.owner.multiple);
        this.applyItems(selected.map(function (item) { return item.text; }));
    };
    /** Render item with a visible items limit */
    ESLSelectRenderer.prototype.apply = function (items, limit) {
        var length = items.length;
        var rest = length - limit;
        var options = { rest: rest, length: length, limit: limit };
        this.$text.textContent = items.slice(0, limit).join(', ');
        if (rest > 0) {
            this.$rest.textContent = (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_2__.format)(this.moreLabelFormat || '', options);
        }
        else {
            this.$rest.textContent = '';
        }
    };
    /** Render items using adaptive algorithm */
    ESLSelectRenderer.prototype.applyItems = function (items) {
        var size = 0;
        do {
            this.apply(items, ++size); // Render with extended limit while it not fits to the container
        } while (size <= items.length && this.$container.scrollWidth <= this.$container.clientWidth);
        this.apply(items, size - 1); // Render last limit that fits
    };
    /** Handle clear button click */
    ESLSelectRenderer.prototype._onClear = function (e) {
        if (!this.owner)
            return;
        this.owner.setAllSelected(false);
        e.stopPropagation();
        e.preventDefault();
    };
    ESLSelectRenderer.is = 'esl-select-renderer';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.attr)()
    ], ESLSelectRenderer.prototype, "emptyText", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.attr)()
    ], ESLSelectRenderer.prototype, "moreLabelFormat", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.boolAttr)()
    ], ESLSelectRenderer.prototype, "hasValue", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLSelectRenderer.prototype, "render", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLSelectRenderer.prototype, "_onClear", null);
    return ESLSelectRenderer;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-forms/esl-select/core/esl-select.ts":
/*!**************************************************************!*\
  !*** ../src/modules/esl-forms/esl-select/core/esl-select.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLSelect": function() { return /* binding */ ESLSelect; }
/* harmony export */ });
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../esl-utils/dom/keys */ "../src/modules/esl-utils/dom/keys.ts");
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
/* harmony import */ var _esl_select_renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-select-renderer */ "../src/modules/esl-forms/esl-select/core/esl-select-renderer.ts");
/* harmony import */ var _esl_select_dropdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-select-dropdown */ "../src/modules/esl-forms/esl-select/core/esl-select-dropdown.ts");
/* harmony import */ var _esl_select_list_core_esl_select_wrapper__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../esl-select-list/core/esl-select-wrapper */ "../src/modules/esl-forms/esl-select-list/core/esl-select-wrapper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









/**
 * ESLSelect component
 * @author Alexey Stsefanovich (ala'n)
 *
 * ESLSelect is a component on top of native select that brings more customization features.
 * Uses "select with dropdown" view. Supports both single and multiple selection.
 */
var ESLSelect = /** @class */ (function (_super) {
    __extends(ESLSelect, _super);
    function ESLSelect() {
        var _this = _super.call(this) || this;
        _this.$renderer = document.createElement(_esl_select_renderer__WEBPACK_IMPORTED_MODULE_0__.ESLSelectRenderer.is);
        _this.$dropdown = document.createElement(_esl_select_dropdown__WEBPACK_IMPORTED_MODULE_1__.ESLSelectDropdown.is);
        return _this;
    }
    Object.defineProperty(ESLSelect, "observedAttributes", {
        get: function () {
            return ['disabled'];
        },
        enumerable: false,
        configurable: true
    });
    ESLSelect.register = function () {
        _esl_select_dropdown__WEBPACK_IMPORTED_MODULE_1__.ESLSelectDropdown.register();
        _esl_select_renderer__WEBPACK_IMPORTED_MODULE_0__.ESLSelectRenderer.register();
        _super.register.call(this);
    };
    ESLSelect.prototype.attributeChangedCallback = function (attrName) {
        if (attrName === 'disabled')
            this._updateDisabled();
    };
    ESLSelect.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.$select = this.querySelector('[esl-select-target]');
        if (!this.$select)
            return;
        this._prepare();
        this._updateDisabled();
        this.bindEvents();
        this._onUpdate();
    };
    ESLSelect.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.unbindEvents();
        this._dispose();
    };
    /** Catches the focus */
    ESLSelect.prototype.focus = function (options) {
        this.$select.focus(options);
    };
    /** Updates select component */
    ESLSelect.prototype.update = function (valueChanged) {
        if (valueChanged === void 0) { valueChanged = true; }
        this._onUpdate();
        if (!valueChanged)
            return;
        // TODO: silent updates
        _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_2__.EventUtils.dispatch(this, 'esl:change:value', { detail: { event: null } });
    };
    ESLSelect.prototype.bindEvents = function () {
        this.addEventListener('click', this._onClick);
        this.addEventListener('keydown', this._onKeydown);
        this.addEventListener('focusout', this._onUpdate);
        this.$dropdown.addEventListener('esl:show', this._onPopupStateChange);
        this.$dropdown.addEventListener('esl:hide', this._onPopupStateChange);
    };
    ESLSelect.prototype.unbindEvents = function () {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', this._onKeydown);
        this.removeEventListener('focusout', this._onUpdate);
        this.$dropdown.removeEventListener('esl:show', this._onPopupStateChange);
        this.$dropdown.removeEventListener('esl:hide', this._onPopupStateChange);
    };
    ESLSelect.prototype._prepare = function () {
        this.$renderer.className = this.$select.className;
        this.$renderer.emptyText = this.placeholder;
        this.$renderer.moreLabelFormat = this.moreLabelFormat;
        this.$dropdown.$owner = this;
        this.appendChild(this.$renderer);
    };
    ESLSelect.prototype._dispose = function () {
        this.$select.className = this.$renderer.className;
        this.removeChild(this.$renderer);
    };
    ESLSelect.prototype._updateDisabled = function () {
        this.setAttribute('aria-disabled', String(this.disabled));
        if (!this.$select)
            return;
        this.$select.disabled = this.disabled;
        if (this.disabled && this.open)
            this.$dropdown.hide();
    };
    ESLSelect.prototype._onChange = function (event) {
        this._onUpdate();
        _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_2__.EventUtils.dispatch(this, 'esl:change:value', { detail: { event: event } });
    };
    ESLSelect.prototype._onUpdate = function () {
        var hasValue = this.hasSelected();
        this.toggleAttribute('has-value', hasValue);
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.toggleClsTo(this, this.hasValueClass, hasValue);
        var focusEl = document.activeElement;
        var hasFocus = this.open || (focusEl && this.contains(focusEl));
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.toggleClsTo(this, this.hasFocusClass, !!hasFocus);
    };
    ESLSelect.prototype._onClick = function () {
        if (this.disabled)
            return;
        this.$dropdown.toggle(!this.$dropdown.open, {
            activator: this,
            initiator: 'select'
        });
    };
    ESLSelect.prototype._onKeydown = function (e) {
        if ([_esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_4__.ENTER, _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_4__.SPACE].includes(e.key)) {
            this.click();
            e.preventDefault();
        }
    };
    ESLSelect.prototype._onPopupStateChange = function (e) {
        if (e.target !== this.$dropdown)
            return;
        this.open = this.$dropdown.open;
        this._onUpdate();
    };
    ESLSelect.is = 'esl-select';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLSelect.prototype, "placeholder", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLSelect.prototype, "hasValueClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLSelect.prototype, "hasFocusClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'Select All' })
    ], ESLSelect.prototype, "selectAllLabel", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: '+ {rest} more...' })
    ], ESLSelect.prototype, "moreLabelFormat", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.boolAttr)()
    ], ESLSelect.prototype, "open", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.boolAttr)()
    ], ESLSelect.prototype, "disabled", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.boolAttr)()
    ], ESLSelect.prototype, "pinSelected", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLSelect.prototype, "_onChange", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLSelect.prototype, "_onUpdate", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLSelect.prototype, "_onClick", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLSelect.prototype, "_onKeydown", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLSelect.prototype, "_onPopupStateChange", null);
    ESLSelect = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_8__.ExportNs)('Select')
    ], ESLSelect);
    return ESLSelect;
}(_esl_select_list_core_esl_select_wrapper__WEBPACK_IMPORTED_MODULE_9__.ESLSelectWrapper));



/***/ }),

/***/ "../src/modules/esl-image/core/esl-image-iobserver.ts":
/*!************************************************************!*\
  !*** ../src/modules/esl-image/core/esl-image-iobserver.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getIObserver": function() { return /* binding */ getIObserver; }
/* harmony export */ });
/* harmony import */ var _esl_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-image */ "../src/modules/esl-image/core/esl-image.ts");
/* harmony import */ var _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/environment/device-detector */ "../src/modules/esl-utils/environment/device-detector.ts");


var iObserver;
/** ESL Image lazy loading IntersectionObserver instance */
function getIObserver() {
    if (!iObserver) {
        iObserver = new IntersectionObserver(function (entries) {
            entries.forEach(handleViewport);
        }, {
            threshold: [0.01],
            rootMargin: _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_0__.DeviceDetector.isMobile ? '250px' : '500px' // rootMargin value for IntersectionObserver
        });
    }
    return iObserver;
}
function handleViewport(entry) {
    var image = entry.target;
    if (!(image instanceof _esl_image__WEBPACK_IMPORTED_MODULE_1__.ESLImage))
        return;
    // Check that entry is going to appear in the viewport area
    if (entry.isIntersecting || entry.intersectionRatio > 0) {
        image.triggerLoad();
    }
}


/***/ }),

/***/ "../src/modules/esl-image/core/esl-image-strategies.ts":
/*!*************************************************************!*\
  !*** ../src/modules/esl-image/core/esl-image-strategies.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "STRATEGIES": function() { return /* binding */ STRATEGIES; }
/* harmony export */ });
/* harmony import */ var _esl_image__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-image */ "../src/modules/esl-image/core/esl-image.ts");

var STRATEGIES = {
    'cover': {
        apply: function (img, shadowImg) {
            var src = shadowImg.src;
            var isEmpty = !src || _esl_image__WEBPACK_IMPORTED_MODULE_0__.ESLImage.isEmptyImage(src);
            img.style.backgroundImage = isEmpty ? '' : "url(\"" + src + "\")";
        },
        clear: function (img) {
            img.style.backgroundImage = '';
        }
    },
    'save-ratio': {
        apply: function (img, shadowImg) {
            var src = shadowImg.src;
            var isEmpty = !src || _esl_image__WEBPACK_IMPORTED_MODULE_0__.ESLImage.isEmptyImage(src);
            img.style.backgroundImage = isEmpty ? '' : "url(\"" + src + "\")";
            if (shadowImg.width === 0)
                return;
            img.style.paddingTop = isEmpty ? '' : (shadowImg.height * 100 / shadowImg.width) + "%";
        },
        clear: function (img) {
            img.style.paddingTop = '';
            img.style.backgroundImage = '';
        }
    },
    'fit': {
        apply: function (img, shadowImg) {
            var innerImg = img.attachInnerImage();
            innerImg.src = shadowImg.src;
            innerImg.removeAttribute('width');
        },
        clear: function (img) {
            img.removeInnerImage();
        }
    },
    'origin': {
        apply: function (img, shadowImg) {
            var innerImg = img.attachInnerImage();
            innerImg.src = shadowImg.src;
            innerImg.width = shadowImg.width / (shadowImg.dpr || 1);
        },
        clear: function (img) {
            img.removeInnerImage();
        }
    },
    'inner-svg': {
        apply: function (img, shadowImg) {
            var request = new XMLHttpRequest();
            request.open('GET', shadowImg.src, true);
            request.onreadystatechange = function () {
                if (request.readyState !== 4 || request.status !== 200)
                    return;
                var tmp = document.createElement('div');
                tmp.innerHTML = request.responseText;
                Array.from(tmp.querySelectorAll('script') || [])
                    .forEach(function (node) { return node.remove(); });
                img.innerHTML = tmp.innerHTML;
            };
            request.send();
        },
        clear: function (img) {
            img.innerHTML = '';
        }
    }
};


/***/ }),

/***/ "../src/modules/esl-image/core/esl-image.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-image/core/esl-image.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLImage": function() { return /* binding */ ESLImage; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
/* harmony import */ var _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-media-query/core */ "../src/modules/esl-media-query/core/esl-media-rule-list.ts");
/* harmony import */ var _esl_traversing_query_core_esl_traversing_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-traversing-query/core/esl-traversing-query */ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts");
/* harmony import */ var _esl_image_iobserver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-image-iobserver */ "../src/modules/esl-image/core/esl-image-iobserver.ts");
/* harmony import */ var _esl_image_strategies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-image-strategies */ "../src/modules/esl-image/core/esl-image-strategies.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var isLoadState = function (state) { return ['error', 'loaded', 'ready'].includes(state); };
/**
 * ESL Image
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
var ESLImage = /** @class */ (function (_super) {
    __extends(ESLImage, _super);
    function ESLImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ESLImage_1 = ESLImage;
    Object.defineProperty(ESLImage, "STRATEGIES", {
        get: function () {
            return _esl_image_strategies__WEBPACK_IMPORTED_MODULE_0__.STRATEGIES;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage, "EMPTY_IMAGE", {
        get: function () {
            return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage, "observedAttributes", {
        get: function () {
            return ['alt', 'role', 'mode', 'aria-label', 'data-src', 'data-src-base', 'lazy-triggered'];
        },
        enumerable: false,
        configurable: true
    });
    ESLImage.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.alt =
            this.alt || this.getAttribute('aria-label') || this.getAttribute('data-alt') || '';
        this.updateA11y();
        this.srcRules.addListener(this._onMediaMatchChange);
        if (this.lazyObservable) {
            this.removeAttribute('lazy-triggered');
            (0,_esl_image_iobserver__WEBPACK_IMPORTED_MODULE_1__.getIObserver)().observe(this);
            this._detachLazyTrigger = function () {
                (0,_esl_image_iobserver__WEBPACK_IMPORTED_MODULE_1__.getIObserver)().unobserve(this);
                this._detachLazyTrigger = null;
            };
        }
        this.refresh();
    };
    ESLImage.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this._detachLazyTrigger && this._detachLazyTrigger();
        if (this._srcRules) {
            this._srcRules.removeListener(this._onMediaMatchChange);
        }
    };
    ESLImage.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (!this.connected || oldVal === newVal)
            return;
        switch (attrName) {
            case 'aria-label':
                this.alt = newVal || '';
                break;
            case 'alt':
            case 'role':
                this.updateA11y();
                break;
            case 'data-src':
                this.srcRules = _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.parse(newVal, _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.STRING_PARSER);
                this.refresh();
                break;
            case 'data-src-base':
                this.refresh();
                break;
            case 'mode':
                this.changeMode(oldVal, newVal);
                break;
            case 'lazy-triggered':
                this.lazyTriggered && this.update();
                break;
        }
    };
    Object.defineProperty(ESLImage.prototype, "srcRules", {
        get: function () {
            if (!this._srcRules) {
                this.srcRules = _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.parse(this.src, _esl_media_query_core__WEBPACK_IMPORTED_MODULE_2__.ESLMediaRuleList.STRING_PARSER);
            }
            return this._srcRules;
        },
        set: function (rules) {
            if (this._srcRules) {
                this._srcRules.removeListener(this._onMediaMatchChange);
            }
            this._srcRules = rules;
            this._srcRules.addListener(this._onMediaMatchChange);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage.prototype, "currentSrc", {
        get: function () {
            return this._currentSrc;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage.prototype, "empty", {
        get: function () {
            return !this._currentSrc || ESLImage_1.isEmptyImage(this._currentSrc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage.prototype, "canUpdate", {
        get: function () {
            return this.lazyTriggered || this.lazy === 'none';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage.prototype, "lazyObservable", {
        get: function () {
            return this.lazy !== 'none' && this.lazy !== 'manual';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage.prototype, "originalWidth", {
        get: function () {
            return this._shadowImageElement ? this._shadowImageElement.width : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLImage.prototype, "originalHeight", {
        get: function () {
            return this._shadowImageElement ? this._shadowImageElement.height : 0;
        },
        enumerable: false,
        configurable: true
    });
    ESLImage.prototype.triggerLoad = function () {
        this.setAttribute('lazy-triggered', '');
    };
    ESLImage.prototype.changeMode = function (oldVal, newVal) {
        oldVal = oldVal || 'save-ratio';
        newVal = newVal || 'save-ratio';
        if (oldVal === newVal)
            return;
        if (!_esl_image_strategies__WEBPACK_IMPORTED_MODULE_0__.STRATEGIES[newVal]) {
            this.mode = oldVal;
            throw new Error('ESL Image: Unsupported mode: ' + newVal);
        }
        this.clearImage();
        if (this.loaded)
            this.syncImage();
    };
    ESLImage.prototype.update = function (force) {
        if (force === void 0) { force = false; }
        if (!this.canUpdate)
            return;
        var rule = this.srcRules.active;
        var src = this.getPath(rule.payload);
        var dpr = rule.dpr;
        if (this._currentSrc !== src || !this.ready || force) {
            this._currentSrc = src;
            this._shadowImg.src = src;
            this._shadowImg.dpr = dpr;
            if (this.refreshOnUpdate || !this.ready) {
                this.syncImage();
            }
            if (this._shadowImg.complete && this._shadowImg.naturalHeight > 0) {
                this._onLoad();
            }
            if (this._shadowImg.complete && this._shadowImg.naturalHeight <= 0) {
                this._onError();
            }
        }
        this._detachLazyTrigger && this._detachLazyTrigger();
    };
    ESLImage.prototype.updateA11y = function () {
        var role = this.getAttribute('role') || 'img';
        this.setAttribute('role', role);
        this.innerImage && (this.innerImage.alt = this.alt);
        if (role === 'img')
            this.setAttribute('aria-label', this.alt);
    };
    ESLImage.prototype.getPath = function (src) {
        if (!src || src === '0' || src === 'none') {
            return ESLImage_1.EMPTY_IMAGE;
        }
        return this.srcBase + src;
    };
    ESLImage.prototype.refresh = function () {
        this.removeAttribute('loaded');
        this.removeAttribute('ready');
        this.updateContainerClasses();
        this.clearImage();
        this.update(true);
    };
    ESLImage.prototype.syncImage = function () {
        var strategy = _esl_image_strategies__WEBPACK_IMPORTED_MODULE_0__.STRATEGIES[this.mode];
        this._strategy = strategy;
        strategy && strategy.apply(this, this._shadowImg);
    };
    ESLImage.prototype.clearImage = function () {
        this._strategy && this._strategy.clear(this);
        this._strategy = null;
    };
    Object.defineProperty(ESLImage.prototype, "innerImage", {
        get: function () {
            return this._innerImg;
        },
        enumerable: false,
        configurable: true
    });
    ESLImage.prototype.attachInnerImage = function () {
        if (!this._innerImg) {
            this._innerImg = this.querySelector("img." + this.innerImageClass) ||
                this._shadowImg.cloneNode();
            this._innerImg.className = this.innerImageClass;
        }
        if (!this._innerImg.parentNode) {
            this.appendChild(this._innerImg);
        }
        this._innerImg.alt = this.alt;
        return this._innerImg;
    };
    ESLImage.prototype.removeInnerImage = function () {
        var _this = this;
        if (!this.innerImage)
            return;
        this.removeChild(this.innerImage);
        setTimeout(function () {
            if (_this._innerImg && !_this._innerImg.parentNode) {
                _this._innerImg = null;
            }
        });
    };
    Object.defineProperty(ESLImage.prototype, "_shadowImg", {
        get: function () {
            if (!this._shadowImageElement) {
                this._shadowImageElement = new Image();
                this._shadowImageElement.onload = this._onLoad;
                this._shadowImageElement.onerror = this._onError;
            }
            return this._shadowImageElement;
        },
        enumerable: false,
        configurable: true
    });
    ESLImage.prototype._onLoad = function () {
        this.syncImage();
        this._onReadyState(true);
        this.updateContainerClasses();
    };
    ESLImage.prototype._onError = function () {
        this._onReadyState(false);
        this.updateContainerClasses();
    };
    ESLImage.prototype._onMediaMatchChange = function () {
        this.update();
    };
    ESLImage.prototype._onReadyState = function (successful) {
        if (this.ready)
            return;
        this.toggleAttribute('loaded', successful);
        this.toggleAttribute('error', !successful);
        this.toggleAttribute('ready', true);
        this.$$fire(successful ? 'load' : 'error');
        this.$$fire('ready');
    };
    ESLImage.prototype.updateContainerClasses = function () {
        if (this.containerClass === null)
            return;
        var cls = this.containerClass || this.constructor.DEFAULT_CONTAINER_CLS;
        var state = isLoadState(this.containerClassState) && this[this.containerClassState];
        var targetEl = _esl_traversing_query_core_esl_traversing_query__WEBPACK_IMPORTED_MODULE_3__.TraversingQuery.first(this.containerClassTarget, this);
        targetEl && _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_4__.CSSUtil.toggleClsTo(targetEl, cls, state);
    };
    ESLImage.prototype.$$fire = function (eventName, eventInit) {
        if (eventInit === void 0) { eventInit = { bubbles: false }; }
        return _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_5__.EventUtils.dispatch(this, eventName, eventInit);
    };
    ESLImage.isEmptyImage = function (src) {
        return src === ESLImage_1.EMPTY_IMAGE;
    };
    var ESLImage_1;
    ESLImage.is = 'esl-image';
    // Default container class value
    ESLImage.DEFAULT_CONTAINER_CLS = 'img-container-loaded';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)()
    ], ESLImage.prototype, "alt", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ defaultValue: 'save-ratio' })
    ], ESLImage.prototype, "mode", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ dataAttr: true })
    ], ESLImage.prototype, "src", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ dataAttr: true })
    ], ESLImage.prototype, "srcBase", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ defaultValue: 'none' })
    ], ESLImage.prototype, "lazy", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.boolAttr)()
    ], ESLImage.prototype, "lazyTriggered", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.boolAttr)()
    ], ESLImage.prototype, "refreshOnUpdate", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ defaultValue: 'inner-image' })
    ], ESLImage.prototype, "innerImageClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ defaultValue: null })
    ], ESLImage.prototype, "containerClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ defaultValue: '::parent' })
    ], ESLImage.prototype, "containerClassTarget", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ defaultValue: 'ready' })
    ], ESLImage.prototype, "containerClassState", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.boolAttr)({ readonly: true })
    ], ESLImage.prototype, "ready", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.boolAttr)({ readonly: true })
    ], ESLImage.prototype, "loaded", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.boolAttr)({ readonly: true })
    ], ESLImage.prototype, "error", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLImage.prototype, "_onLoad", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLImage.prototype, "_onError", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLImage.prototype, "_onMediaMatchChange", null);
    ESLImage = ESLImage_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_9__.ExportNs)('Image')
    ], ESLImage);
    return ESLImage;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_10__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-media-query/core/esl-media-breakpoints.ts":
/*!********************************************************************!*\
  !*** ../src/modules/esl-media-query/core/esl-media-breakpoints.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLMediaBreakpoints": function() { return /* binding */ ESLMediaBreakpoints; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * ESL Query Breakpoint Registry
 * @author Yuliya Adamskaya
 *
 * Breakpoint Registry is used to provide custom breakpoints for ESL Query
 */
var ScreenBreakpoint = /** @class */ (function () {
    function ScreenBreakpoint(min, max) {
        this.min = min;
        this.max = max;
    }
    Object.defineProperty(ScreenBreakpoint.prototype, "mediaQuery", {
        get: function () {
            return "(min-width: " + this.min + "px) and (max-width: " + this.max + "px)";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScreenBreakpoint.prototype, "mediaQueryGE", {
        get: function () {
            return "(min-width: " + this.min + "px)";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScreenBreakpoint.prototype, "mediaQueryLE", {
        get: function () {
            return "(max-width: " + this.max + "px)";
        },
        enumerable: false,
        configurable: true
    });
    return ScreenBreakpoint;
}());
// Default breakpoints provided in registry
var registry = {
    xs: new ScreenBreakpoint(1, 767),
    sm: new ScreenBreakpoint(768, 991),
    md: new ScreenBreakpoint(992, 1199),
    lg: new ScreenBreakpoint(1200, 1599),
    xl: new ScreenBreakpoint(1600, 999999)
};
var BP_NAME_REGEXP = /^[a-z]+/i;
var ESLMediaBreakpoints = /** @class */ (function () {
    function ESLMediaBreakpoints() {
    }
    ESLMediaBreakpoints_1 = ESLMediaBreakpoints;
    /**
     * Add or replace breakpoint shortcut that could be used inside of ESLMediaQuery
     * @param name - name of shortcut
     * @param minWidth - min width for breakpoint
     * @param maxWidth - max width for breakpoint
     */
    ESLMediaBreakpoints.addCustomBreakpoint = function (name, minWidth, maxWidth) {
        name = name.toLowerCase();
        if (BP_NAME_REGEXP.test(name)) {
            var current = registry[name];
            registry[name] = new ScreenBreakpoint(minWidth, maxWidth);
            return current;
        }
        throw new Error('Shortcut should consist only from Latin characters. Length should be at least one character.');
    };
    /**
     * @return known breakpoint shortcut instance
     */
    ESLMediaBreakpoints.getBreakpoint = function (name) {
        return registry[(name || '').toLowerCase()];
    };
    /**
     * @returns all available breakpoints shortcuts
     */
    ESLMediaBreakpoints.getAllBreakpointsNames = function () {
        return Object.keys(registry);
    };
    /**
     * Replaces known breakpoints shortcuts to the real media queries
     * @param query - original query string
     */
    ESLMediaBreakpoints.apply = function (query) {
        var breakpoints = Object.keys(registry);
        var breakpointRegex = new RegExp("@([+-]?)(" + breakpoints.join('|') + ")\\b", 'ig');
        return query.replace(breakpointRegex, function (match, sign, bp) {
            var shortcut = ESLMediaBreakpoints_1.getBreakpoint(bp);
            switch (sign) {
                case '+':
                    return shortcut.mediaQueryGE;
                case '-':
                    return shortcut.mediaQueryLE;
                default:
                    return shortcut.mediaQuery;
            }
        });
    };
    var ESLMediaBreakpoints_1;
    ESLMediaBreakpoints = ESLMediaBreakpoints_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_0__.ExportNs)('MediaBreakpoints')
    ], ESLMediaBreakpoints);
    return ESLMediaBreakpoints;
}());



/***/ }),

/***/ "../src/modules/esl-media-query/core/esl-media-query.ts":
/*!**************************************************************!*\
  !*** ../src/modules/esl-media-query/core/esl-media-query.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLMediaQuery": function() { return /* binding */ ESLMediaQuery; }
/* harmony export */ });
/* harmony import */ var _esl_utils_decorators_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/decorators/memoize */ "../src/modules/esl-utils/decorators/memoize.ts");
/* harmony import */ var _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/environment/device-detector */ "../src/modules/esl-utils/environment/device-detector.ts");
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_media_breakpoints__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-media-breakpoints */ "../src/modules/esl-media-query/core/esl-media-breakpoints.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




/**
 * ESL Media Query
 * Provides special media condition syntax - ESLQuery
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya, Natallia Harshunova
 *
 * Helper class that extends MediaQueryList class
 * Supports
 * - CSS query matching check
 * - DPR display queries (@x1 | @x2 | @x3)
 * - Screen default sizes shortcuts @[-|+](XS|SM|MD|LG|XL)
 * - Query matching change listeners
 * - Mobile / full browser detection (@MOBILE|@DESKTOP)
 * - Exclude upper DPRs for bots
 */
var ESLMediaQuery = /** @class */ (function () {
    function ESLMediaQuery(query) {
        var _this = this;
        // Applying known breakpoints shortcut
        query = _esl_media_breakpoints__WEBPACK_IMPORTED_MODULE_0__.ESLMediaBreakpoints.apply(query);
        // Applying dpr shortcut
        this._dpr = 1;
        query = query.replace(/@(\d(\.\d)?)x/g, function (match, ratio) {
            _this._dpr = +ratio;
            if (ESLMediaQuery_1.ignoreBotsDpr && _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__.DeviceDetector.isBot && _this._dpr !== 1) {
                return ESLMediaQuery_1.NOT_ALL;
            }
            return ESLMediaQuery_1.buildDprQuery(ratio);
        });
        // Applying dpr shortcut for device detection
        query = query.replace(/(and )?(@MOBILE|@DESKTOP)( and)?/ig, function (match, pre, type, post) {
            _this._mobileOnly = (type.toUpperCase() === '@MOBILE');
            if (_esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__.DeviceDetector.isMobile !== _this._mobileOnly) {
                return ESLMediaQuery_1.NOT_ALL; // whole query became invalid
            }
            return pre && post ? 'and' : '';
        });
        this._query = ESLMediaQuery_1.matchMediaCached(query.trim() || ESLMediaQuery_1.ALL);
    }
    ESLMediaQuery_1 = ESLMediaQuery;
    Object.defineProperty(ESLMediaQuery, "BreakpointRegistry", {
        get: function () {
            return _esl_media_breakpoints__WEBPACK_IMPORTED_MODULE_0__.ESLMediaBreakpoints;
        },
        enumerable: false,
        configurable: true
    });
    ESLMediaQuery.matchMediaCached = function (query) {
        return matchMedia(query);
    };
    ESLMediaQuery.buildDprQuery = function (dpr) {
        if (_esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__.DeviceDetector.isSafari)
            return "(-webkit-min-device-pixel-ratio: " + dpr + ")";
        return "(min-resolution: " + (96 * dpr).toFixed(1) + "dpi)";
    };
    Object.defineProperty(ESLMediaQuery.prototype, "isMobileOnly", {
        /** Accepts only mobile devices */
        get: function () {
            return this._mobileOnly === true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaQuery.prototype, "isDesktopOnly", {
        /** Accepts only desktop devices */
        get: function () {
            return this._mobileOnly === false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaQuery.prototype, "dpr", {
        /** Current query dpr */
        get: function () {
            return this._dpr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaQuery.prototype, "query", {
        /** inner MediaQueryList instance */
        get: function () {
            return this._query;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaQuery.prototype, "matches", {
        /** true if current environment satisfies query */
        get: function () {
            return this.query.matches;
        },
        enumerable: false,
        configurable: true
    });
    /** Attach listener to wrapped media query list */
    ESLMediaQuery.prototype.addListener = function (listener) {
        if (typeof this.query.addEventListener === 'function') {
            this.query.addEventListener('change', listener);
        }
        else {
            this.query.addListener(listener);
        }
    };
    /** Detach listener from wrapped media query list */
    ESLMediaQuery.prototype.removeListener = function (listener) {
        if (typeof this.query.removeEventListener === 'function') {
            this.query.removeEventListener('change', listener);
        }
        else {
            this.query.removeListener(listener);
        }
    };
    ESLMediaQuery.prototype.toString = function () {
        return '[ESL MQ] (' + this.query.media + ')';
    };
    var ESLMediaQuery_1;
    ESLMediaQuery.ALL = 'all';
    ESLMediaQuery.NOT_ALL = 'not all';
    /**
     * Option to disable DPR images handling for bots
     */
    ESLMediaQuery.ignoreBotsDpr = false;
    __decorate([
        (0,_esl_utils_decorators_memoize__WEBPACK_IMPORTED_MODULE_2__.memoize)()
    ], ESLMediaQuery, "matchMediaCached", null);
    ESLMediaQuery = ESLMediaQuery_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_3__.ExportNs)('MediaQuery')
    ], ESLMediaQuery);
    return ESLMediaQuery;
}());



/***/ }),

/***/ "../src/modules/esl-media-query/core/esl-media-rule-list.ts":
/*!******************************************************************!*\
  !*** ../src/modules/esl-media-query/core/esl-media-rule-list.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLMediaRuleList": function() { return /* binding */ ESLMediaRuleList; }
/* harmony export */ });
/* harmony import */ var _esl_utils_abstract_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/abstract/observable */ "../src/modules/esl-utils/abstract/observable.ts");
/* harmony import */ var _esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/misc/format */ "../src/modules/esl-utils/misc/format.ts");
/* harmony import */ var _esl_media_rule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-media-rule */ "../src/modules/esl-media-query/core/esl-media-rule.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



/**
 * ESL Rule List - ESLMediaRule observable collection
 * @author Yuliya Adamskaya
 */
var ESLMediaRuleList = /** @class */ (function (_super) {
    __extends(ESLMediaRuleList, _super);
    function ESLMediaRuleList(query, parser) {
        var _this = _super.call(this) || this;
        _this._onMatchChanged = function () {
            var rule = _this._activeRule;
            if (_this._active !== rule) {
                _this._active = rule;
                _this.fire(rule);
            }
        };
        if (typeof query !== 'string') {
            throw new Error('ESLRuleList require first parameter (query) typeof string');
        }
        _this._rules = ESLMediaRuleList.parseRules(query, parser);
        _this._rules.forEach(function (rule) { return rule.addListener(_this._onMatchChanged); });
        _this._default = _this._rules.filter(function (rule) { return rule.default; })[0];
        return _this;
    }
    ESLMediaRuleList.parseRules = function (str, parser) {
        var parts = str.split('|');
        var rules = [];
        parts.forEach(function (_lex) {
            var lex = _lex.trim();
            if (!lex) {
                return;
            }
            if (lex.indexOf('=>') === -1) {
                var value = parser(lex);
                // Default rule should have lower priority
                typeof value !== 'undefined' && rules.unshift(_esl_media_rule__WEBPACK_IMPORTED_MODULE_0__.ESLMediaRule.all(value));
            }
            else {
                var rule = _esl_media_rule__WEBPACK_IMPORTED_MODULE_0__.ESLMediaRule.parse(lex, parser);
                rule && rules.push(rule);
            }
        });
        return rules;
    };
    ESLMediaRuleList.parse = function (query, parser) {
        return new ESLMediaRuleList(query, parser);
    };
    Object.defineProperty(ESLMediaRuleList.prototype, "rules", {
        get: function () {
            return this._rules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaRuleList.prototype, "_activeRule", {
        get: function () {
            var satisfied = this.rules.filter(function (rule) { return rule.matches; });
            return satisfied.length > 0 ? satisfied[satisfied.length - 1] : _esl_media_rule__WEBPACK_IMPORTED_MODULE_0__.ESLMediaRule.empty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaRuleList.prototype, "active", {
        get: function () {
            if (!this._active) {
                this._active = this._activeRule;
            }
            return this._active;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaRuleList.prototype, "activeValue", {
        get: function () {
            var value = this.active.payload;
            if (typeof value === 'string' || !this._default) {
                return value;
            }
            return Object.assign({}, this._default.payload || {}, value);
        },
        enumerable: false,
        configurable: true
    });
    ESLMediaRuleList.STRING_PARSER = function (val) { return val; };
    ESLMediaRuleList.OBJECT_PARSER = function (val) { return (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_1__.evaluate)(val); };
    return ESLMediaRuleList;
}(_esl_utils_abstract_observable__WEBPACK_IMPORTED_MODULE_2__.Observable));



/***/ }),

/***/ "../src/modules/esl-media-query/core/esl-media-rule.ts":
/*!*************************************************************!*\
  !*** ../src/modules/esl-media-query/core/esl-media-rule.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLMediaRule": function() { return /* binding */ ESLMediaRule; }
/* harmony export */ });
/* harmony import */ var _esl_media_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-media-query */ "../src/modules/esl-media-query/core/esl-media-query.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};

/**
 * ESL Rule
 * @author Yuliya Adamskaya
 *
 * Helper class that extend provide Observable Rule Handler that resolve payload based on current device configuration.
 * Supports
 * - CSS query matching check
 * - DPR display queries (@x1 | @x2 | @x3)
 * - Screen default sizes shortcuts @[-|+](XS|SM|MD|LG|XL)
 * - Query matching change listeners
 * - Mobile / full browser detection (@MOBILE|@DESKTOP)
 */
var ESLMediaRule = /** @class */ (function (_super) {
    __extends(ESLMediaRule, _super);
    function ESLMediaRule(payload, query) {
        var _this = _super.call(this, query) || this;
        _this._default = !query;
        _this._payload = payload;
        return _this;
    }
    ESLMediaRule.prototype.toString = function () {
        return _super.prototype.toString.call(this) + " => " + this._payload;
    };
    Object.defineProperty(ESLMediaRule.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaRule.prototype, "default", {
        get: function () {
            return this._default;
        },
        enumerable: false,
        configurable: true
    });
    ESLMediaRule.parse = function (lex, parser) {
        var _a = __read(lex.split('=>'), 2), query = _a[0], payload = _a[1];
        var payloadValue = parser(payload.trim());
        if (typeof payloadValue === 'undefined')
            return null;
        return new ESLMediaRule(payloadValue, query.trim());
    };
    ESLMediaRule.all = function (payload) {
        return new ESLMediaRule(payload, 'all');
    };
    ESLMediaRule.empty = function () {
        return new ESLMediaRule(null, 'all');
    };
    return ESLMediaRule;
}(_esl_media_query__WEBPACK_IMPORTED_MODULE_0__.ESLMediaQuery));



/***/ }),

/***/ "../src/modules/esl-media/core/esl-media-iobserver.ts":
/*!************************************************************!*\
  !*** ../src/modules/esl-media/core/esl-media-iobserver.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getIObserver": function() { return /* binding */ getIObserver; }
/* harmony export */ });
/* harmony import */ var _esl_media__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-media */ "../src/modules/esl-media/core/esl-media.ts");

var RATIO_TO_ACTIVATE = 0.75; // TODO: customizable, at least global
var RATIO_TO_DEACTIVATE = 0.20; // TODO: customizable, at least global
var iObserver;
/** ESL Media Play-In-Viewport IntersectionObserver instance */
function getIObserver(lazy) {
    if (lazy === void 0) { lazy = false; }
    if (!iObserver && !lazy) {
        iObserver = new IntersectionObserver(function (entries) {
            entries.forEach(handleViewport);
        }, {
            threshold: [RATIO_TO_DEACTIVATE, RATIO_TO_ACTIVATE]
        });
    }
    return iObserver;
}
function handleViewport(entry) {
    var video = entry.target;
    if (!(video instanceof _esl_media__WEBPACK_IMPORTED_MODULE_0__.ESLMedia))
        return;
    // Videos that playing and out of min ratio RATIO_TO_DEACTIVATE should be stopped
    if (video.active && entry.intersectionRatio <= RATIO_TO_DEACTIVATE) {
        video.pause();
    }
    // Play should starts only for inactive and background(muted) videos that are visible more then on RATIO_TO_ACTIVATE
    if (!video.active && video.autoplay && entry.intersectionRatio >= RATIO_TO_ACTIVATE) {
        video.play();
    }
}


/***/ }),

/***/ "../src/modules/esl-media/core/esl-media-manager.ts":
/*!**********************************************************!*\
  !*** ../src/modules/esl-media/core/esl-media-manager.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MediaGroupRestrictionManager": function() { return /* binding */ MediaGroupRestrictionManager; }
/* harmony export */ });
var managerMap = new Map();
/**
 * Group restriction manager for {@link ESLMedia}
 * Only one media in group can be played
 * Empty group is ignored
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
var MediaGroupRestrictionManager = /** @class */ (function () {
    function MediaGroupRestrictionManager() {
    }
    Object.defineProperty(MediaGroupRestrictionManager, "managerMap", {
        /**
         * @debug info
         */
        get: function () {
            return managerMap;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Register instance play state in group
     */
    MediaGroupRestrictionManager.registerPlay = function (instance) {
        if (instance.group) {
            var current = managerMap.get(instance.group);
            managerMap.set(instance.group, instance);
            if (!current || current === instance || !current.active)
                return;
            if (current.$$fire('mangedpause')) {
                current.pause();
            }
        }
    };
    /**
     * Unregister instance
     */
    MediaGroupRestrictionManager.unregister = function (instance) {
        if (instance.group) {
            var reg = managerMap.get(instance.group);
            if (reg === instance)
                managerMap.delete(instance.group);
        }
    };
    return MediaGroupRestrictionManager;
}());



/***/ }),

/***/ "../src/modules/esl-media/core/esl-media-provider.ts":
/*!***********************************************************!*\
  !*** ../src/modules/esl-media/core/esl-media-provider.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlayerStates": function() { return /* binding */ PlayerStates; },
/* harmony export */   "BaseProvider": function() { return /* binding */ BaseProvider; }
/* harmony export */ });
/* harmony import */ var _esl_media_registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-media-registry */ "../src/modules/esl-media/core/esl-media-registry.ts");

var PlayerStates;
(function (PlayerStates) {
    PlayerStates[PlayerStates["BUFFERING"] = 3] = "BUFFERING";
    PlayerStates[PlayerStates["ENDED"] = 0] = "ENDED";
    PlayerStates[PlayerStates["PAUSED"] = 2] = "PAUSED";
    PlayerStates[PlayerStates["PLAYING"] = 1] = "PLAYING";
    PlayerStates[PlayerStates["UNSTARTED"] = -1] = "UNSTARTED";
    PlayerStates[PlayerStates["VIDEO_CUED"] = 5] = "VIDEO_CUED";
    PlayerStates[PlayerStates["UNINITIALIZED"] = -2] = "UNINITIALIZED";
})(PlayerStates || (PlayerStates = {}));
/**
 * BaseProvider class for media API providers
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya, Natallia Harshunova
 */
var BaseProvider = /** @class */ (function () {
    function BaseProvider(component, config) {
        this.config = config;
        this.component = component;
    }
    BaseProvider.parseUrl = function (url) {
        return null;
    };
    BaseProvider.parseConfig = function (component) {
        var loop = component.loop, muted = component.muted, controls = component.controls, autoplay = component.autoplay, title = component.title, preload = component.preload, playsinline = component.playsinline, mediaId = component.mediaId, mediaSrc = component.mediaSrc;
        var config = { loop: loop, muted: muted, controls: controls, autoplay: autoplay, title: title, preload: preload, playsinline: playsinline };
        if (mediaId)
            Object.assign(config, { mediaId: mediaId });
        if (mediaSrc)
            Object.assign(config, { mediaSrc: mediaSrc });
        return config;
    };
    Object.defineProperty(BaseProvider.prototype, "ready", {
        /**
         * Wraps _ready promise
         * @returns {Promise}
         */
        get: function () {
            if (!this._ready) {
                var res = Promise.reject('Not Initialized');
                res.catch(function (e) { return console.log('Rejected Media Operation: ', e); });
                return res;
            }
            return this._ready;
        },
        enumerable: false,
        configurable: true
    });
    /** Unbind the provider instance from the component */
    BaseProvider.prototype.unbind = function () {
        Array.from(this.component.querySelectorAll('.esl-media-inner'))
            .forEach(function (el) { return el.parentNode && el.parentNode.removeChild(el); });
    };
    Object.defineProperty(BaseProvider.prototype, "name", {
        /** Provider name */
        get: function () {
            return this.constructor.providerName;
        },
        enumerable: false,
        configurable: true
    });
    /** Set focus to the inner content */
    BaseProvider.prototype.focus = function () {
        var _a;
        (_a = this._el) === null || _a === void 0 ? void 0 : _a.focus();
    };
    BaseProvider.prototype.onConfigChange = function (param, value) {
        this.config[param] = value;
    };
    /** Set size for inner content */
    BaseProvider.prototype.setSize = function (width, height) {
        if (!this._el)
            return;
        this._el.style.setProperty('width', width === 'auto' ? null : width + "px");
        this._el.style.setProperty('height', height === 'auto' ? null : height + "px");
    };
    /**
     * Executes toggle action:
     * If the player is PAUSED then it starts playing otherwise it pause playing
     */
    BaseProvider.prototype.toggle = function () {
        if (this.state === PlayerStates.PAUSED) {
            return this.play();
        }
        else {
            return this.pause();
        }
    };
    /**
     * Executes onConfigChange action when api is ready
     * @returns Promise
     */
    BaseProvider.prototype.onSafeConfigChange = function (param, value) {
        var _this = this;
        this.ready.then(function () { return _this.onConfigChange(param, value); });
    };
    /**
     * Executes seekTo action when api is ready
     * @returns Promise
     */
    BaseProvider.prototype.safeSeekTo = function (pos) {
        var _this = this;
        return this.ready.then(function () { return _this.seekTo(pos); });
    };
    /**
     * Executes play when api is ready
     * @returns Promise
     */
    BaseProvider.prototype.safePlay = function () {
        var _this = this;
        return this.ready.then(function () { return _this.play(); });
    };
    /**
     * Executes pause when api is ready
     * @returns Promise
     */
    BaseProvider.prototype.safePause = function () {
        var _this = this;
        return this.ready.then(function () { return _this.pause(); });
    };
    /**
     * Executes stop when api is ready
     * @returns Promise
     */
    BaseProvider.prototype.safeStop = function () {
        var _this = this;
        return this.ready.then(function () { return _this.stop(); });
    };
    /**
     * Executes toggle when api is ready
     * @returns Promise
     */
    BaseProvider.prototype.safeToggle = function () {
        var _this = this;
        return this.ready.then(function () { return _this.toggle(); });
    };
    BaseProvider.register = function (provider) {
        provider = provider || this;
        if (provider === BaseProvider)
            throw new Error('`BaseProvider` can\'t be registered.');
        if (!((provider === null || provider === void 0 ? void 0 : provider.prototype) instanceof BaseProvider))
            throw new Error('Provider should be instanceof `BaseProvider`');
        _esl_media_registry__WEBPACK_IMPORTED_MODULE_0__.ESLMediaProviderRegistry.instance.register(provider);
    };
    return BaseProvider;
}());



/***/ }),

/***/ "../src/modules/esl-media/core/esl-media-registry.ts":
/*!***********************************************************!*\
  !*** ../src/modules/esl-media/core/esl-media-registry.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLMediaProviderRegistry": function() { return /* binding */ ESLMediaProviderRegistry; }
/* harmony export */ });
/* harmony import */ var _esl_utils_abstract_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/abstract/observable */ "../src/modules/esl-utils/abstract/observable.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

var evRegistryInstance = null;
/**
 * ESLMediaProviderRegistry class to store media API providers
 * @author Yuliya Adamskaya, Natallia Harshunova
 */
var ESLMediaProviderRegistry = /** @class */ (function (_super) {
    __extends(ESLMediaProviderRegistry, _super);
    function ESLMediaProviderRegistry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.providersMap = new Map();
        return _this;
    }
    Object.defineProperty(ESLMediaProviderRegistry, "instance", {
        get: function () {
            if (!evRegistryInstance) {
                evRegistryInstance = new ESLMediaProviderRegistry();
            }
            return evRegistryInstance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMediaProviderRegistry.prototype, "providers", {
        /** List of registered providers */
        get: function () {
            var list = [];
            this.providersMap.forEach(function (provider) { return list.push(provider); });
            return list;
        },
        enumerable: false,
        configurable: true
    });
    /** Register provider */
    ESLMediaProviderRegistry.prototype.register = function (provider) {
        if (!provider.providerName)
            throw new Error('Provider should have a name');
        this.providersMap.set(provider.providerName, provider);
        this.fire(provider.providerName, provider);
    };
    /** Check that provider is registered for passed name */
    ESLMediaProviderRegistry.prototype.has = function (name) {
        return this.providersMap.has(name);
    };
    /** Find provider by name */
    ESLMediaProviderRegistry.prototype.findByName = function (name) {
        if (!name || name === 'auto')
            return null;
        return this.providersMap.get(name.toLowerCase()) || null;
    };
    /** Create provider instance for passed ESLMedia instance */
    ESLMediaProviderRegistry.prototype.createFor = function (media) {
        return this.createByType(media) || this.createBySrc(media);
    };
    /** Create provider instance for passed ESLMedia instance via provider name */
    ESLMediaProviderRegistry.prototype.createByType = function (media) {
        var provider = this.findByName(media.mediaType);
        return provider ? ESLMediaProviderRegistry._create(provider, media) : null;
    };
    /** Create provider instance for passed ESLMedia instance via url */
    ESLMediaProviderRegistry.prototype.createBySrc = function (media) {
        var e_1, _a;
        try {
            for (var _b = __values(this.providers.reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var provider = _c.value;
                var cfg = provider.parseUrl(media.mediaSrc);
                if (cfg)
                    return ESLMediaProviderRegistry._create(provider, media, cfg);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
    /** Create provider instance for passed configuration */
    ESLMediaProviderRegistry._create = function (provider, media, cfg) {
        if (cfg === void 0) { cfg = provider.parseUrl(media.mediaSrc); }
        var config = Object.assign({}, cfg || {}, provider.parseConfig(media));
        return new provider(media, config);
    };
    return ESLMediaProviderRegistry;
}(_esl_utils_abstract_observable__WEBPACK_IMPORTED_MODULE_0__.Observable));



/***/ }),

/***/ "../src/modules/esl-media/core/esl-media.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-media/core/esl-media.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLMedia": function() { return /* binding */ ESLMedia; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/async/raf */ "../src/modules/esl-utils/async/raf.ts");
/* harmony import */ var _esl_utils_async_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/async/debounce */ "../src/modules/esl-utils/async/debounce.ts");
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
/* harmony import */ var _esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../esl-utils/misc/format */ "../src/modules/esl-utils/misc/format.ts");
/* harmony import */ var _esl_media_query_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-media-query/core */ "../src/modules/esl-media-query/core/esl-media-query.ts");
/* harmony import */ var _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-traversing-query/core */ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts");
/* harmony import */ var _esl_media_iobserver__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./esl-media-iobserver */ "../src/modules/esl-media/core/esl-media-iobserver.ts");
/* harmony import */ var _esl_media_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./esl-media-provider */ "../src/modules/esl-media/core/esl-media-provider.ts");
/* harmony import */ var _esl_media_registry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./esl-media-registry */ "../src/modules/esl-media/core/esl-media-registry.ts");
/* harmony import */ var _esl_media_manager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./esl-media-manager */ "../src/modules/esl-media/core/esl-media-manager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














/**
 * ESL Media
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
var ESLMedia = /** @class */ (function (_super) {
    __extends(ESLMedia, _super);
    function ESLMedia() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.deferredResize = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(function () { return _this._onResize(); });
        _this.deferredReinitialize = (0,_esl_utils_async_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(function () { return _this.reinitInstance(); });
        return _this;
    }
    ESLMedia_1 = ESLMedia;
    Object.defineProperty(ESLMedia, "PLAYER_STATES", {
        /**
         * @enum Map with possible Player States
         * values: BUFFERING, ENDED, PAUSED, PLAYING, UNSTARTED, VIDEO_CUED, UNINITIALIZED
         */
        get: function () {
            return _esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMedia, "observedAttributes", {
        get: function () {
            return [
                'disabled',
                'media-type',
                'media-id',
                'media-src',
                'fill-mode',
                'aspect-ratio',
                'play-in-viewport',
                'muted',
                'loop',
                'controls'
            ];
        },
        enumerable: false,
        configurable: true
    });
    ESLMedia.supports = function (name) {
        return _esl_media_registry__WEBPACK_IMPORTED_MODULE_3__.ESLMediaProviderRegistry.instance.has(name);
    };
    ESLMedia.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'application');
        }
        this.innerHTML += '<!-- Inner Content, do not modify it manually -->';
        _esl_media_registry__WEBPACK_IMPORTED_MODULE_3__.ESLMediaProviderRegistry.instance.addListener(this._onRegistryStateChange);
        if (this.conditionQuery) {
            this.conditionQuery.addListener(this.deferredReinitialize);
        }
        if (this.fillModeEnabled) {
            window.addEventListener('resize', this.deferredResize);
        }
        this.attachViewportConstraint();
        this.deferredReinitialize();
    };
    ESLMedia.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        _esl_media_registry__WEBPACK_IMPORTED_MODULE_3__.ESLMediaProviderRegistry.instance.removeListener(this._onRegistryStateChange);
        if (this.conditionQuery) {
            this.conditionQuery.removeListener(this.deferredReinitialize);
        }
        if (this.fillModeEnabled) {
            window.removeEventListener('resize', this.deferredResize);
        }
        this.detachViewportConstraint();
        this._provider && this._provider.unbind();
    };
    ESLMedia.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (!this.connected || oldVal === newVal)
            return;
        switch (attrName) {
            case 'disabled':
            case 'media-id':
            case 'media-src':
            case 'media-type':
                this.deferredReinitialize();
                break;
            case 'loop':
            case 'muted':
            case 'controls':
                this._provider && this._provider.onSafeConfigChange(attrName, newVal !== null);
                break;
            case 'fill-mode':
            case 'aspect-ratio':
                this.deferredResize();
                break;
            case 'play-in-viewport':
                this.playInViewport ?
                    this.attachViewportConstraint() :
                    this.detachViewportConstraint();
                break;
        }
    };
    ESLMedia.prototype.canActivate = function () {
        if (this.disabled)
            return false;
        if (this.conditionQuery)
            return this.conditionQuery.matches;
        return true;
    };
    ESLMedia.prototype.reinitInstance = function () {
        console.debug('[ESL] Media reinitialize ', this);
        this._provider && this._provider.unbind();
        this._provider = null;
        if (this.canActivate()) {
            this._provider = _esl_media_registry__WEBPACK_IMPORTED_MODULE_3__.ESLMediaProviderRegistry.instance.createFor(this);
            if (this._provider) {
                this._provider.bind();
                console.debug('[ESL] Media provider bound', this._provider);
            }
            else {
                this._onError();
            }
        }
        this.updateContainerMarkers();
    };
    ESLMedia.prototype.updateContainerMarkers = function () {
        var targetEl = _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_4__.TraversingQuery.first(this.loadClsTarget, this);
        if (!targetEl)
            return;
        var active = this.canActivate();
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_5__.CSSUtil.toggleClsTo(targetEl, this.loadClsAccepted, active);
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_5__.CSSUtil.toggleClsTo(targetEl, this.loadClsDeclined, !active);
    };
    /**
     * Seek to given position of media
     * @returns {Promise | void}
     */
    ESLMedia.prototype.seekTo = function (pos) {
        return this._provider && this._provider.safeSeekTo(pos);
    };
    /**
     * Start playing media
     * @param {boolean} allowActivate
     * @returns {Promise | void}
     */
    ESLMedia.prototype.play = function (allowActivate) {
        if (allowActivate === void 0) { allowActivate = false; }
        if (this.disabled && allowActivate) {
            this.disabled = false;
            this.deferredReinitialize.cancel();
            this.reinitInstance();
        }
        if (!this.canActivate())
            return;
        return this._provider && this._provider.safePlay();
    };
    /**
     * Pause playing media
     * @returns {Promise | void}
     */
    ESLMedia.prototype.pause = function () {
        return this._provider && this._provider.safePause();
    };
    /**
     * Stop playing media
     * @returns {Promise | void}
     */
    ESLMedia.prototype.stop = function () {
        return this._provider && this._provider.safeStop();
    };
    /**
     * Toggle play/pause state of the media
     * @returns {Promise | void}
     */
    ESLMedia.prototype.toggle = function () {
        return this._provider && this._provider.safeToggle();
    };
    /** @override */
    ESLMedia.prototype.focus = function () {
        this._provider && this._provider.focus();
    };
    // media live-cycle handlers
    ESLMedia.prototype._onReady = function () {
        this.toggleAttribute('ready', true);
        this.toggleAttribute('error', false);
        this.updateReadyClass();
        this.deferredResize();
        this.$$fire('ready');
    };
    ESLMedia.prototype._onError = function (detail, setReadyState) {
        if (setReadyState === void 0) { setReadyState = true; }
        this.toggleAttribute('ready', true);
        this.toggleAttribute('error', true);
        this.$$fire('error', { detail: detail });
        setReadyState && this.$$fire('ready');
    };
    ESLMedia.prototype._onDetach = function () {
        this.removeAttribute('active');
        this.removeAttribute('ready');
        this.removeAttribute('played');
        this.updateReadyClass();
        this.$$fire('detach');
    };
    ESLMedia.prototype._onPlay = function () {
        if (this.autofocus)
            this.focus();
        this.deferredResize();
        this.setAttribute('active', '');
        this.setAttribute('played', '');
        this.$$fire('play');
        _esl_media_manager__WEBPACK_IMPORTED_MODULE_6__.MediaGroupRestrictionManager.registerPlay(this);
    };
    ESLMedia.prototype._onPaused = function () {
        this.removeAttribute('active');
        this.$$fire('paused');
        _esl_media_manager__WEBPACK_IMPORTED_MODULE_6__.MediaGroupRestrictionManager.unregister(this);
    };
    ESLMedia.prototype._onEnded = function () {
        this.removeAttribute('active');
        this.$$fire('ended');
        _esl_media_manager__WEBPACK_IMPORTED_MODULE_6__.MediaGroupRestrictionManager.unregister(this);
    };
    ESLMedia.prototype._onResize = function () {
        if (!this._provider)
            return;
        if (!this.fillModeEnabled || this.actualAspectRatio <= 0) {
            this._provider.setSize('auto', 'auto');
        }
        else {
            var stretchVertically = this.offsetWidth / this.offsetHeight < this.actualAspectRatio;
            if (this.fillMode === 'inscribe')
                stretchVertically = !stretchVertically; // Inscribe behaves inversely
            stretchVertically ?
                this._provider.setSize(this.actualAspectRatio * this.offsetHeight, this.offsetHeight) : // h
                this._provider.setSize(this.offsetWidth, this.offsetWidth / this.actualAspectRatio); // w
        }
    };
    /** Update ready class state */
    ESLMedia.prototype.updateReadyClass = function () {
        var target = _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_4__.TraversingQuery.first(this.readyClassTarget, this);
        target && _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_5__.CSSUtil.toggleClsTo(target, this.readyClass, this.ready);
    };
    Object.defineProperty(ESLMedia.prototype, "providerType", {
        /** Applied provider */
        get: function () {
            return this._provider ? this._provider.name : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMedia.prototype, "state", {
        /** Current player state, see {@link ESLMedia.PLAYER_STATES} values */
        get: function () {
            return this._provider ? this._provider.state : _esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.UNINITIALIZED;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMedia.prototype, "duration", {
        /** Duration of the media resource */
        get: function () {
            return this._provider ? this._provider.duration : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMedia.prototype, "currentTime", {
        /** Current time of media resource */
        get: function () {
            return this._provider ? this._provider.currentTime : 0;
        },
        /** Set current time of media resource */
        set: function (time) {
            (this._provider) && this._provider.safeSeekTo(time);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMedia.prototype, "conditionQuery", {
        /** ESLMediaQuery to limit ESLMedia loading */
        get: function () {
            if (!this._conditionQuery && this._conditionQuery !== null) {
                var query = this.getAttribute('load-condition');
                this._conditionQuery = query ? new _esl_media_query_core__WEBPACK_IMPORTED_MODULE_7__.ESLMediaQuery(query) : null;
            }
            return this._conditionQuery;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMedia.prototype, "fillModeEnabled", {
        /** Fill mode should be handled for element */
        get: function () {
            return this.fillMode === 'cover' || this.fillMode === 'inscribe';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLMedia.prototype, "actualAspectRatio", {
        /** Used resource aspect ratio forced by attribute or returned by provider */
        get: function () {
            if (this.aspectRatio && this.aspectRatio !== 'auto')
                return (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_8__.parseAspectRatio)(this.aspectRatio);
            return this._provider ? this._provider.defaultAspectRatio : 0;
        },
        enumerable: false,
        configurable: true
    });
    ESLMedia.prototype._onRegistryStateChange = function (name) {
        if (name === this.mediaType) {
            this.reinitInstance();
        }
    };
    ESLMedia.prototype.attachViewportConstraint = function () {
        if (this.playInViewport) {
            (0,_esl_media_iobserver__WEBPACK_IMPORTED_MODULE_9__.getIObserver)().observe(this);
        }
    };
    ESLMedia.prototype.detachViewportConstraint = function () {
        var observer = (0,_esl_media_iobserver__WEBPACK_IMPORTED_MODULE_9__.getIObserver)(true);
        observer && observer.unobserve(this);
    };
    ESLMedia.prototype.$$fire = function (eventName, eventInit) {
        var ns = this.constructor.eventNs;
        return _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_10__.EventUtils.dispatch(this, ns + eventName, eventInit);
    };
    var ESLMedia_1;
    ESLMedia.is = 'esl-media';
    ESLMedia.eventNs = 'esl:media:';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "mediaId", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "mediaSrc", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "mediaType", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "group", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "fillMode", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "aspectRatio", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "disabled", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "autoplay", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "autofocus", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "muted", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "loop", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "controls", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "playsinline", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)()
    ], ESLMedia.prototype, "playInViewport", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)({ defaultValue: 'auto' })
    ], ESLMedia.prototype, "preload", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "readyClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "readyClassTarget", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "loadClsAccepted", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)()
    ], ESLMedia.prototype, "loadClsDeclined", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_11__.attr)({ defaultValue: '::parent' })
    ], ESLMedia.prototype, "loadClsTarget", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)({ readonly: true })
    ], ESLMedia.prototype, "ready", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)({ readonly: true })
    ], ESLMedia.prototype, "active", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)({ readonly: true })
    ], ESLMedia.prototype, "played", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_12__.boolAttr)({ readonly: true })
    ], ESLMedia.prototype, "error", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_13__.bind
    ], ESLMedia.prototype, "_onRegistryStateChange", null);
    ESLMedia = ESLMedia_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_14__.ExportNs)('Media')
    ], ESLMedia);
    return ESLMedia;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_15__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-media/providers/brightcove-provider.ts":
/*!*****************************************************************!*\
  !*** ../src/modules/esl-media/providers/brightcove-provider.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BrightcoveProvider": function() { return /* binding */ BrightcoveProvider; }
/* harmony export */ });
/* harmony import */ var _esl_utils_dom_script__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/dom/script */ "../src/modules/esl-utils/dom/script.ts");
/* harmony import */ var _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/esl-media-provider */ "../src/modules/esl-media/core/esl-media-provider.ts");
/* harmony import */ var _esl_utils_misc_uid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/misc/uid */ "../src/modules/esl-utils/misc/uid.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var API_SCRIPT_ID = 'BC_API_SOURCE';
/**
 * Brightcove API provider for {@link ESLMedia}
 * @author Julia Murashko
 */
var BrightcoveProvider = /** @class */ (function (_super) {
    __extends(BrightcoveProvider, _super);
    function BrightcoveProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.videojsClasses = 'video-js vjs-default-skin video-js-brightcove';
        return _this;
    }
    BrightcoveProvider_1 = BrightcoveProvider;
    /**
     * @returns settings, get from element by default
     */
    BrightcoveProvider.getAccount = function (el) {
        return {
            playerId: el.getAttribute('player-id'),
            accountId: el.getAttribute('player-account')
        };
    };
    /**
     * Loads player API according defined settings
     * */
    BrightcoveProvider.loadAPI = function (account) {
        var apiSrc = "//players.brightcove.net/" + account.accountId + "/" + account.playerId + "_default/index.min.js";
        var apiScript = document.getElementById(API_SCRIPT_ID);
        if (apiScript && apiScript.parentNode && apiScript.getAttribute('src') !== apiSrc) {
            apiScript.parentNode.removeChild(apiScript);
        }
        return (0,_esl_utils_dom_script__WEBPACK_IMPORTED_MODULE_0__.loadScript)(API_SCRIPT_ID, apiSrc);
    };
    /**
     * Build video brightcove element
     */
    BrightcoveProvider.prototype.buildVideo = function () {
        var el = document.createElement('video-js');
        el.id = 'esl-media-brightcove-' + (0,_esl_utils_misc_uid__WEBPACK_IMPORTED_MODULE_1__.generateUId)();
        el.className = 'esl-media-inner esl-media-brightcove ' + this.videojsClasses;
        el.title = this.config.title;
        el.toggleAttribute('loop', this.config.loop);
        el.toggleAttribute('muted', this.config.muted);
        el.toggleAttribute('controls', this.config.controls);
        el.setAttribute('aria-label', el.title);
        el.setAttribute('data-embed', 'default');
        el.setAttribute('data-video-id', "ref:" + this.config.mediaId);
        el.toggleAttribute('playsinline', this.config.playsinline);
        this._account.playerId && el.setAttribute('data-player', this._account.playerId);
        this._account.accountId && el.setAttribute('data-account', this._account.accountId);
        return el;
    };
    /**
     * Utility method to convert api event to promise
     */
    BrightcoveProvider.prototype.$$fromEvent = function (eventName) {
        var _this = this;
        if (!this._api)
            return Promise.reject();
        return new Promise(function (resolve, reject) { return _this._api ? _this._api.one(eventName, resolve) : reject(); });
    };
    /**
     * Executes as soon as api script detected or loaded.
     * @returns {Promise<VideoJsPlayer>} - promise with provided API
     */
    BrightcoveProvider.prototype.onAPILoaded = function () {
        var _this = this;
        if (typeof window.bc !== 'function' || typeof window.videojs !== 'function') {
            throw new Error('Brightcove API is not in the global scope');
        }
        console.debug('ESL Media: Brightcove API init for ', this);
        this._api = window.bc(this._el);
        return new Promise(function (resolve, reject) { return _this._api ? _this._api.ready(resolve) : reject(); });
    };
    /**
     * Executes after API ready state resolved
     * Basic onAPIReady should be called to subscribe to API state
     * @returns {Promise | void}
     */
    BrightcoveProvider.prototype.onAPIReady = function () {
        var _this = this;
        console.debug('ESL Media: Brightcove API is ready ', this);
        // Set autoplay though js because BC is unresponsive while processing it natively
        this._api.autoplay(this._autoplay || this.config.autoplay);
        // Listeners to control player state
        this._api.on('play', function () { return _this.component._onPlay(); });
        this._api.on('pause', function () { return _this.component._onPaused(); });
        this._api.on('ended', function () { return _this.component._onEnded(); });
        this.component._onReady();
        // Can handle query only when loadedmetadata have happened
        return this.$$fromEvent('loadedmetadata');
    };
    BrightcoveProvider.prototype.bind = function () {
        var _this = this;
        var Provider = this.constructor;
        this._account = Provider.getAccount(this.component);
        this._el = this.buildVideo();
        this.component.appendChild(this._el);
        this._ready = Provider.loadAPI(this._account)
            .then(function () { return _this.onAPILoaded(); })
            .then(function () { return _this.onAPIReady(); })
            .catch(function (e) { return _this.component._onError(e); });
    };
    BrightcoveProvider.prototype.unbind = function () {
        this.component._onDetach();
        this._api && this._api.dispose();
        _super.prototype.unbind.call(this);
    };
    BrightcoveProvider.prototype.onConfigChange = function (param, value) {
        _super.prototype.onConfigChange.call(this, param, value);
        if (typeof this._api[param] === 'function') {
            this._api[param](value);
        }
    };
    BrightcoveProvider.prototype.focus = function () {
        this._api && this._api.focus();
    };
    Object.defineProperty(BrightcoveProvider.prototype, "state", {
        get: function () {
            if (this._api) {
                if (this._api.ended())
                    return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.ENDED;
                if (this._api.paused())
                    return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.PAUSED;
                if (!this._api.played())
                    return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.UNSTARTED;
                return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.PLAYING;
            }
            return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.UNINITIALIZED;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrightcoveProvider.prototype, "defaultAspectRatio", {
        get: function () {
            if (!this._api)
                return 0;
            return this._api.videoWidth() / this._api.videoHeight();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrightcoveProvider.prototype, "currentTime", {
        get: function () {
            return this._api ? this._api.currentTime() : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrightcoveProvider.prototype, "duration", {
        get: function () {
            return this._api ? this._api.duration() : 0;
        },
        enumerable: false,
        configurable: true
    });
    BrightcoveProvider.prototype.seekTo = function (pos) {
        this._api.currentTime(pos);
    };
    BrightcoveProvider.prototype.play = function () {
        this._api.play();
    };
    BrightcoveProvider.prototype.pause = function () {
        this._api.pause();
    };
    BrightcoveProvider.prototype.stop = function () {
        this._api.currentTime(0);
        this._api.pause();
    };
    // Overrides to set tech autoplay marker
    BrightcoveProvider.prototype.safePlay = function () {
        this._autoplay = true;
        return _super.prototype.safePlay.call(this);
    };
    BrightcoveProvider.prototype.safeStop = function () {
        this._autoplay = true;
        return _super.prototype.safeStop.call(this);
    };
    var BrightcoveProvider_1;
    BrightcoveProvider.providerName = 'brightcove';
    BrightcoveProvider = BrightcoveProvider_1 = __decorate([
        _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.BaseProvider.register
    ], BrightcoveProvider);
    return BrightcoveProvider;
}(_core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.BaseProvider));



/***/ }),

/***/ "../src/modules/esl-media/providers/html5/audio-provider.ts":
/*!******************************************************************!*\
  !*** ../src/modules/esl-media/providers/html5/audio-provider.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioProvider": function() { return /* binding */ AudioProvider; }
/* harmony export */ });
/* harmony import */ var _media_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./media-provider */ "../src/modules/esl-media/providers/html5/media-provider.ts");
/* harmony import */ var _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/esl-media-provider */ "../src/modules/esl-media/core/esl-media-provider.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


/**
 * Simple Audio API provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
var AudioProvider = /** @class */ (function (_super) {
    __extends(AudioProvider, _super);
    function AudioProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AudioProvider.prototype.createElement = function () {
        var el = document.createElement('audio');
        el.src = this.config.mediaSrc || '';
        return el;
    };
    Object.defineProperty(AudioProvider.prototype, "defaultAspectRatio", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    AudioProvider.providerName = 'audio';
    AudioProvider.urlPattern = /\.(mp3|wav|aac)(\?|$)/;
    AudioProvider = __decorate([
        _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_1__.BaseProvider.register
    ], AudioProvider);
    return AudioProvider;
}(_media_provider__WEBPACK_IMPORTED_MODULE_0__.HTMLMediaProvider));



/***/ }),

/***/ "../src/modules/esl-media/providers/html5/media-provider.ts":
/*!******************************************************************!*\
  !*** ../src/modules/esl-media/providers/html5/media-provider.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HTMLMediaProvider": function() { return /* binding */ HTMLMediaProvider; }
/* harmony export */ });
/* harmony import */ var _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/esl-media-provider */ "../src/modules/esl-media/core/esl-media-provider.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Simple Native Media API provider for {@link ESLMedia}
 * @author Yuliya Adamskaya, Alexey Stsefanovich (ala'n)
 */
var HTMLMediaProvider = /** @class */ (function (_super) {
    __extends(HTMLMediaProvider, _super);
    function HTMLMediaProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLMediaProvider.parseUrl = function (mediaSrc) {
        if (this.urlPattern.test(mediaSrc)) {
            return { mediaSrc: mediaSrc };
        }
        return null;
    };
    HTMLMediaProvider.applyElementSettings = function (el, cfg) {
        el.classList.add('esl-media-inner');
        el.autoplay = cfg.autoplay;
        el.preload = cfg.preload || 'auto';
        el.loop = cfg.loop;
        el.muted = cfg.muted;
        el.controls = cfg.controls;
        el.tabIndex = 0;
        el.toggleAttribute('playsinline', cfg.playsinline);
        return el;
    };
    HTMLMediaProvider.prototype.onConfigChange = function (param, value) {
        _super.prototype.onConfigChange.call(this, param, value);
        HTMLMediaProvider.applyElementSettings(this._el, this.config);
    };
    HTMLMediaProvider.prototype.bind = function () {
        this._el = this.createElement();
        HTMLMediaProvider.applyElementSettings(this._el, this.config);
        this.component.appendChild(this._el);
        this.bindListeners();
    };
    HTMLMediaProvider.prototype.bindListeners = function () {
        var _this = this;
        this._el.addEventListener('loadedmetadata', function () { return _this.component._onReady(); });
        this._el.addEventListener('play', function () { return _this.component._onPlay(); });
        this._el.addEventListener('pause', function () { return _this.component._onPaused(); });
        this._el.addEventListener('ended', function () { return _this.component._onEnded(); });
        this._el.addEventListener('error', function (e) { return _this.component._onError(e); });
    };
    HTMLMediaProvider.prototype.unbind = function () {
        this.component._onDetach();
        _super.prototype.unbind.call(this);
    };
    Object.defineProperty(HTMLMediaProvider.prototype, "ready", {
        get: function () {
            return Promise.resolve();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLMediaProvider.prototype, "state", {
        get: function () {
            if (!this._el)
                return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.UNINITIALIZED;
            if (this._el.ended)
                return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.ENDED;
            if (!this._el.played || !this._el.played.length)
                return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.UNSTARTED;
            if (this._el.paused)
                return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.PAUSED;
            return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.PLAYING;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLMediaProvider.prototype, "duration", {
        get: function () {
            return this._el ? this._el.duration : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLMediaProvider.prototype, "currentTime", {
        get: function () {
            return this._el ? this._el.currentTime : 0;
        },
        enumerable: false,
        configurable: true
    });
    HTMLMediaProvider.prototype.seekTo = function (pos) {
        this._el.currentTime = pos;
    };
    HTMLMediaProvider.prototype.play = function () {
        return this._el.play();
    };
    HTMLMediaProvider.prototype.pause = function () {
        return this._el.pause();
    };
    HTMLMediaProvider.prototype.stop = function () {
        this._el.pause();
        this._el.currentTime = 0;
    };
    return HTMLMediaProvider;
}(_core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.BaseProvider));



/***/ }),

/***/ "../src/modules/esl-media/providers/html5/video-provider.ts":
/*!******************************************************************!*\
  !*** ../src/modules/esl-media/providers/html5/video-provider.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoProvider": function() { return /* binding */ VideoProvider; }
/* harmony export */ });
/* harmony import */ var _media_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./media-provider */ "../src/modules/esl-media/providers/html5/media-provider.ts");
/* harmony import */ var _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/esl-media-provider */ "../src/modules/esl-media/core/esl-media-provider.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


/**
 * Simple Video API provider for {@link ESLMedia}
 * @author Yuliya Adamskaya
 */
var VideoProvider = /** @class */ (function (_super) {
    __extends(VideoProvider, _super);
    function VideoProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoProvider.prototype.createElement = function () {
        var el = document.createElement('video');
        el.src = this.config.mediaSrc || '';
        return el;
    };
    Object.defineProperty(VideoProvider.prototype, "defaultAspectRatio", {
        get: function () {
            return this._el.videoWidth / this._el.videoHeight;
        },
        enumerable: false,
        configurable: true
    });
    VideoProvider.providerName = 'video';
    VideoProvider.urlPattern = /\.(mp4|webm|ogv|mov)(\?|$)/;
    VideoProvider = __decorate([
        _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_1__.BaseProvider.register
    ], VideoProvider);
    return VideoProvider;
}(_media_provider__WEBPACK_IMPORTED_MODULE_0__.HTMLMediaProvider));



/***/ }),

/***/ "../src/modules/esl-media/providers/iframe-provider.ts":
/*!*************************************************************!*\
  !*** ../src/modules/esl-media/providers/iframe-provider.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IframeBasicProvider": function() { return /* binding */ IframeBasicProvider; }
/* harmony export */ });
/* harmony import */ var _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/esl-media-provider */ "../src/modules/esl-media/core/esl-media-provider.ts");
/* harmony import */ var _esl_utils_misc_uid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/misc/uid */ "../src/modules/esl-utils/misc/uid.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


/**
 * Simple Basic Iframe provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
var IframeBasicProvider = /** @class */ (function (_super) {
    __extends(IframeBasicProvider, _super);
    function IframeBasicProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._state = _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.UNINITIALIZED;
        return _this;
    }
    IframeBasicProvider.parseUrl = function (url) {
        try {
            if (!url)
                return null;
            var protocol = new URL(url).protocol;
            if (protocol !== 'http:' && protocol !== 'https:')
                return null;
            return { mediaSrc: url };
        }
        catch (_a) {
            return null;
        }
    };
    IframeBasicProvider.prototype.buildIframe = function () {
        var el = document.createElement('iframe');
        el.id = 'esl-media-iframe-' + (0,_esl_utils_misc_uid__WEBPACK_IMPORTED_MODULE_1__.generateUId)();
        el.className = 'esl-media-inner esl-media-iframe';
        el.title = this.config.title;
        el.setAttribute('aria-label', this.config.title);
        el.setAttribute('frameborder', '0');
        el.setAttribute('tabindex', '0');
        el.setAttribute('scrolling', 'no');
        el.setAttribute('allowfullscreen', 'yes');
        el.toggleAttribute('playsinline', this.config.playsinline);
        el.src = this.config.mediaSrc || '';
        return el;
    };
    IframeBasicProvider.prototype.bind = function () {
        var _this = this;
        if (this._state !== _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.UNINITIALIZED)
            return;
        this._ready = new Promise(function (resolve, reject) {
            _this._el = _this.buildIframe();
            _this._el.onload = function () { return resolve(_this); };
            _this._el.onerror = function (e) { return reject(e); };
            _this._state = _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.UNSTARTED;
            _this.component.appendChild(_this._el);
        });
        this._ready.then(function () {
            _this._state = _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.PLAYING;
            _this.component._onReady();
            _this.component._onPlay();
        });
        this._ready.catch(function (e) { return _this.component._onError(e); });
    };
    IframeBasicProvider.prototype.unbind = function () {
        this.component._onDetach();
        this._state = _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.UNINITIALIZED;
        _super.prototype.unbind.call(this);
    };
    Object.defineProperty(IframeBasicProvider.prototype, "ready", {
        get: function () {
            return Promise.resolve();
        },
        enumerable: false,
        configurable: true
    });
    IframeBasicProvider.prototype.focus = function () {
        if (this._el && this._el.contentWindow) {
            this._el.contentWindow.focus();
        }
    };
    Object.defineProperty(IframeBasicProvider.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IframeBasicProvider.prototype, "duration", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IframeBasicProvider.prototype, "currentTime", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IframeBasicProvider.prototype, "defaultAspectRatio", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    IframeBasicProvider.prototype.seekTo = function (pos) {
        console.error('[ESLMedia] Unsupported action: can not execute seekTo on abstract iframe provider');
    };
    IframeBasicProvider.prototype.play = function () {
        if (this.state === _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.PlayerStates.UNINITIALIZED) {
            this.bind();
        }
    };
    IframeBasicProvider.prototype.pause = function () {
        this.unbind();
    };
    IframeBasicProvider.prototype.stop = function () {
        this.unbind();
    };
    IframeBasicProvider.providerName = 'iframe';
    IframeBasicProvider = __decorate([
        _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.BaseProvider.register
    ], IframeBasicProvider);
    return IframeBasicProvider;
}(_core_esl_media_provider__WEBPACK_IMPORTED_MODULE_0__.BaseProvider));



/***/ }),

/***/ "../src/modules/esl-media/providers/youtube-provider.ts":
/*!**************************************************************!*\
  !*** ../src/modules/esl-media/providers/youtube-provider.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YouTubeProvider": function() { return /* binding */ YouTubeProvider; }
/* harmony export */ });
/* harmony import */ var _esl_utils_dom_script__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/dom/script */ "../src/modules/esl-utils/dom/script.ts");
/* harmony import */ var _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/esl-media-provider */ "../src/modules/esl-media/core/esl-media-provider.ts");
/* harmony import */ var _esl_utils_misc_uid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/misc/uid */ "../src/modules/esl-utils/misc/uid.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};



var DEFAULT_ASPECT_RATIO = 16 / 9;
/**
 * Youtube API provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 */
var YouTubeProvider = /** @class */ (function (_super) {
    __extends(YouTubeProvider, _super);
    function YouTubeProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YouTubeProvider_1 = YouTubeProvider;
    YouTubeProvider.parseUrl = function (url) {
        if (this.providerRegexp.test(url)) {
            var _a = __read(url.match(this.idRegexp) || [], 2), id = _a[1];
            return id ? { mediaId: id } : null;
        }
        return null;
    };
    YouTubeProvider.getCoreApi = function () {
        if (!YouTubeProvider_1._coreApiPromise) {
            YouTubeProvider_1._coreApiPromise = new Promise(function (resolve) {
                if (window.YT && window.YT.Player)
                    return resolve(window.YT);
                (0,_esl_utils_dom_script__WEBPACK_IMPORTED_MODULE_0__.loadScript)('YT_API_SOURCE', '//www.youtube.com/iframe_api');
                var cbOrigin = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = function () {
                    try {
                        (typeof cbOrigin === 'function') && cbOrigin.apply(window);
                    }
                    catch (err) { // eslint-disable-line
                        // Do Nothing
                    }
                    return resolve(window.YT);
                };
            });
        }
        return YouTubeProvider_1._coreApiPromise;
    };
    YouTubeProvider.mapOptions = function (cfg) {
        return {
            enablejsapi: 1,
            origin: location.origin,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 0,
            autoplay: Number(cfg.autoplay),
            controls: Number(cfg.controls),
            playsinline: Number(cfg.playsinline),
            disablekb: Number(!cfg.controls),
            autohide: Number(!cfg.controls) // TODO: criteria
        };
    };
    YouTubeProvider.buildIframe = function (sm) {
        var el = document.createElement('div');
        el.id = 'esl-media-yt-' + (0,_esl_utils_misc_uid__WEBPACK_IMPORTED_MODULE_1__.generateUId)();
        el.className = 'esl-media-inner esl-media-youtube';
        el.title = sm.title;
        el.setAttribute('aria-label', el.title);
        el.setAttribute('frameborder', '0');
        el.setAttribute('tabindex', '0');
        el.setAttribute('allowfullscreen', 'yes');
        return el;
    };
    YouTubeProvider.prototype.bind = function () {
        var _this = this;
        this._el = YouTubeProvider_1.buildIframe(this.config);
        this.component.appendChild(this._el);
        this._ready = YouTubeProvider_1.getCoreApi()
            .then(function () { return _this.onCoreApiReady(); })
            .then(function () { return _this.onPlayerReady(); })
            .catch(function (e) { return _this.component._onError(e); });
    };
    /** Init YT.Player on target element */
    YouTubeProvider.prototype.onCoreApiReady = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.debug('[ESL]: Media Youtube Player initialization for ', _this);
            _this._api = new YT.Player(_this._el.id, {
                videoId: _this.config.mediaId,
                events: {
                    onError: function (e) { return reject(e); },
                    onReady: function () { return resolve(_this); },
                    onStateChange: function (e) { return _this._onStateChange(e); }
                },
                playerVars: YouTubeProvider_1.mapOptions(_this.config)
            });
        });
    };
    /** Post YT.Player init actions */
    YouTubeProvider.prototype.onPlayerReady = function () {
        console.debug('[ESL]: Media Youtube Player ready ', this);
        this._el = this._api.getIframe();
        if (this.config.muted) {
            this._api.mute();
        }
        this.component._onReady();
    };
    YouTubeProvider.prototype.unbind = function () {
        this.component._onDetach();
        this._api && this._api.destroy();
        _super.prototype.unbind.call(this);
    };
    YouTubeProvider.prototype._onStateChange = function (event) {
        switch (+event.data) {
            case _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.PLAYING:
                this.component._onPlay();
                break;
            case _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.PAUSED:
                this.component._onPaused();
                break;
            case _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.ENDED:
                if (this.config.loop) {
                    this._api.playVideo();
                }
                else {
                    this.component._onEnded();
                }
                break;
        }
    };
    YouTubeProvider.prototype.onConfigChange = function (param, value) {
        _super.prototype.onConfigChange.call(this, param, value);
        if (param === 'muted') {
            value ? this._api.mute() : this._api.unMute();
        }
    };
    YouTubeProvider.prototype.focus = function () {
        if (this._el instanceof HTMLIFrameElement && this._el.contentWindow) {
            this._el.contentWindow.focus();
        }
    };
    Object.defineProperty(YouTubeProvider.prototype, "state", {
        get: function () {
            if (this._api && typeof this._api.getPlayerState === 'function') {
                return this._api.getPlayerState();
            }
            return _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.UNINITIALIZED;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(YouTubeProvider.prototype, "duration", {
        get: function () {
            return this._api ? this._api.getDuration() : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(YouTubeProvider.prototype, "currentTime", {
        get: function () {
            return this._api ? this._api.getCurrentTime() : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(YouTubeProvider.prototype, "defaultAspectRatio", {
        get: function () {
            return DEFAULT_ASPECT_RATIO;
        },
        enumerable: false,
        configurable: true
    });
    YouTubeProvider.prototype.seekTo = function (pos) {
        this._api.seekTo(pos, false);
    };
    YouTubeProvider.prototype.play = function () {
        if (this.state === _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.PlayerStates.ENDED) {
            this._api.seekTo(0, false);
        }
        this._api.playVideo();
    };
    YouTubeProvider.prototype.pause = function () {
        this._api.pauseVideo();
    };
    YouTubeProvider.prototype.stop = function () {
        this._api.stopVideo();
    };
    var YouTubeProvider_1;
    YouTubeProvider.providerName = 'youtube';
    YouTubeProvider.idRegexp = /(?:v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)([_0-9a-zA-Z-]+)/i;
    YouTubeProvider.providerRegexp = /^\s*(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be|youtube(-nocookie)?\.com)/i;
    YouTubeProvider = YouTubeProvider_1 = __decorate([
        _core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.BaseProvider.register
    ], YouTubeProvider);
    return YouTubeProvider;
}(_core_esl_media_provider__WEBPACK_IMPORTED_MODULE_2__.BaseProvider));



/***/ }),

/***/ "../src/modules/esl-panel/core/esl-panel-group.ts":
/*!********************************************************!*\
  !*** ../src/modules/esl-panel/core/esl-panel-group.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLPanelGroup": function() { return /* binding */ ESLPanelGroup; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/async/raf */ "../src/modules/esl-utils/async/raf.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_media_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-media-query/core */ "../src/modules/esl-media-query/core/esl-media-rule-list.ts");
/* harmony import */ var _esl_panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-panel */ "../src/modules/esl-panel/core/esl-panel.ts");
/* harmony import */ var _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-traversing-query/core */ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








/**
 * ESLPanelGroup component
 * @author Julia Murashko
 *
 * ESLPanelGroup is a custom element that is used as a container for a group of {@link ESLPanel}s
 */
var ESLPanelGroup = /** @class */ (function (_super) {
    __extends(ESLPanelGroup, _super);
    function ESLPanelGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Height of previous active panel */
        _this._previousHeight = 0;
        /** Fallback setTimeout timer */
        _this._fallbackTimer = 0;
        return _this;
    }
    ESLPanelGroup_1 = ESLPanelGroup;
    ESLPanelGroup.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (!this.connected || oldVal === newVal)
            return;
        if (attrName === 'mode') {
            this.modeRules = _esl_media_query_core__WEBPACK_IMPORTED_MODULE_0__.ESLMediaRuleList.parse(newVal, _esl_media_query_core__WEBPACK_IMPORTED_MODULE_0__.ESLMediaRuleList.STRING_PARSER);
            this.updateMode();
        }
    };
    ESLPanelGroup.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.bindEvents();
        this.modeRules.addListener(this._onModeChange);
        this.updateMode();
    };
    ESLPanelGroup.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.modeRules.removeListener(this._onModeChange);
        this.unbindEvents();
    };
    ESLPanelGroup.prototype.bindEvents = function () {
        this.addEventListener('esl:before:show', this._onBeforeShow);
        this.addEventListener('esl:show', this._onShow);
        this.addEventListener('esl:before:hide', this._onBeforeHide);
        this.addEventListener('transitionend', this._onTransitionEnd);
    };
    ESLPanelGroup.prototype.unbindEvents = function () {
        this.removeEventListener('esl:before:show', this._onBeforeShow);
        this.removeEventListener('esl:show', this._onShow);
        this.removeEventListener('esl:before:hide', this._onBeforeHide);
        this.removeEventListener('transitionend', this._onTransitionEnd);
    };
    Object.defineProperty(ESLPanelGroup.prototype, "$panels", {
        /** @returns Panels that are processed by the current panel group */
        get: function () {
            var _this = this;
            var els = Array.from(this.querySelectorAll(_esl_panel__WEBPACK_IMPORTED_MODULE_1__.ESLPanel.is));
            return els.filter(function (el) { return _this.includesPanel(el); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLPanelGroup.prototype, "$activePanels", {
        /** @returns Panels that are active */
        get: function () {
            return this.$panels.filter(function (el) { return el.open; });
        },
        enumerable: false,
        configurable: true
    });
    /** Condition-guard to check if the passed target is a Panel that should be controlled by the Group */
    ESLPanelGroup.prototype.includesPanel = function (target) {
        if (!(target instanceof _esl_panel__WEBPACK_IMPORTED_MODULE_1__.ESLPanel))
            return false;
        return target.$group === this;
    };
    /** Process {@link ESLPanel} pre-show event */
    ESLPanelGroup.prototype._onBeforeShow = function (e) {
        var panel = e.target;
        if (!this.includesPanel(panel))
            return;
        this.$activePanels.forEach(function (el) { return (el !== panel) && el.hide(); });
    };
    /** Process {@link ESLPanel} show event */
    ESLPanelGroup.prototype._onShow = function (e) {
        var _this = this;
        var panel = e.target;
        if (!this.includesPanel(panel))
            return;
        if (this.currentMode !== 'tabs')
            return;
        this.beforeAnimate();
        if (this.shouldCollapse) {
            this.onAnimate(this._previousHeight, panel.initialHeight);
            this.fallbackAnimate();
        }
        else {
            (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_2__.afterNextRender)(function () { return _this.afterAnimate(); });
        }
    };
    /** Process {@link ESLPanel} pre-hide event */
    ESLPanelGroup.prototype._onBeforeHide = function (e) {
        var panel = e.target;
        if (!this.includesPanel(panel))
            return;
        this._previousHeight = this.offsetHeight;
    };
    /** Animate the height of the component */
    ESLPanelGroup.prototype.onAnimate = function (from, to) {
        var _this = this;
        var hasCurrent = this.style.height && this.style.height !== 'auto';
        if (hasCurrent) {
            this.style.height = to + "px";
        }
        else {
            // set initial height
            this.style.height = from + "px";
            // make sure that browser apply initial height to animate
            (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_2__.afterNextRender)(function () { return _this.style.height = to + "px"; });
        }
    };
    /** Pre-processing animation action */
    ESLPanelGroup.prototype.beforeAnimate = function () {
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.addCls(this, this.animationClass);
    };
    /** Post-processing animation action */
    ESLPanelGroup.prototype.afterAnimate = function () {
        this.style.removeProperty('height');
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.removeCls(this, this.animationClass);
    };
    /** Init a fallback timer to call post-animate action */
    ESLPanelGroup.prototype.fallbackAnimate = function () {
        var _this = this;
        var time = +this.fallbackDuration;
        if (isNaN(time) || time < 0)
            return;
        if (this._fallbackTimer)
            clearTimeout(this._fallbackTimer);
        this._fallbackTimer = window.setTimeout(function () { return _this.afterAnimate(); }, time);
    };
    /** Catching CSS transition end event to start post-animate processing */
    ESLPanelGroup.prototype._onTransitionEnd = function (e) {
        if (!e || e.propertyName === 'height') {
            this.afterAnimate();
        }
    };
    Object.defineProperty(ESLPanelGroup.prototype, "shouldCollapse", {
        /** @returns Whether the collapse/expand animation should be handheld by the group */
        get: function () {
            var noCollapseModes = this.noCollapse.split(',').map(function (mode) { return mode.trim(); });
            return !noCollapseModes.includes('all') && !noCollapseModes.includes(this.currentMode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLPanelGroup.prototype, "panelConfig", {
        /** @returns Action params config that is used by controlled {@link ESLPanel}s */
        get: function () {
            return {
                noCollapse: !this.shouldCollapse || (this.currentMode === 'tabs')
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLPanelGroup.prototype, "modeRules", {
        /** ESLMediaRuleList instance of the mode mapping */
        get: function () {
            if (!this._modeRules) {
                this.modeRules = _esl_media_query_core__WEBPACK_IMPORTED_MODULE_0__.ESLMediaRuleList.parse(this.mode, _esl_media_query_core__WEBPACK_IMPORTED_MODULE_0__.ESLMediaRuleList.STRING_PARSER);
            }
            return this._modeRules;
        },
        set: function (rules) {
            if (this._modeRules) {
                this._modeRules.removeListener(this._onModeChange);
            }
            this._modeRules = rules;
            this._modeRules.addListener(this._onModeChange);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLPanelGroup.prototype, "currentMode", {
        /** @returns current mode */
        get: function () {
            return this.modeRules.activeValue || '';
        },
        enumerable: false,
        configurable: true
    });
    /** Handles mode change */
    ESLPanelGroup.prototype._onModeChange = function () {
        this.updateMode();
    };
    /** Update element state according to current mode */
    ESLPanelGroup.prototype.updateMode = function () {
        var _this = this;
        this.setAttribute('view', this.currentMode);
        var $target = this.modeClsTarget && _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_4__.TraversingQuery.first(this.modeClsTarget, this);
        if (!$target)
            return;
        ESLPanelGroup_1.supportedModes.forEach(function (mode) {
            $target.classList.toggle("esl-" + mode + "-view", _this.currentMode === mode);
        });
    };
    var ESLPanelGroup_1;
    ESLPanelGroup.is = 'esl-panel-group';
    /** List of supported modes */
    ESLPanelGroup.supportedModes = ['tabs', 'accordion'];
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'accordion' })
    ], ESLPanelGroup.prototype, "mode", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: '' })
    ], ESLPanelGroup.prototype, "modeClsTarget", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'animate' })
    ], ESLPanelGroup.prototype, "animationClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'auto' })
    ], ESLPanelGroup.prototype, "fallbackDuration", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLPanelGroup.prototype, "noCollapse", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__.bind
    ], ESLPanelGroup.prototype, "_onBeforeShow", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__.bind
    ], ESLPanelGroup.prototype, "_onShow", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__.bind
    ], ESLPanelGroup.prototype, "_onBeforeHide", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__.bind
    ], ESLPanelGroup.prototype, "_onTransitionEnd", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_6__.bind
    ], ESLPanelGroup.prototype, "_onModeChange", null);
    ESLPanelGroup = ESLPanelGroup_1 = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_7__.ExportNs)('PanelGroup')
    ], ESLPanelGroup);
    return ESLPanelGroup;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_8__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-panel/core/esl-panel.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-panel/core/esl-panel.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLPanel": function() { return /* binding */ ESLPanel; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/async/raf */ "../src/modules/esl-utils/async/raf.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/json-attr.ts");
/* harmony import */ var _esl_toggleable_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-toggleable/core */ "../src/modules/esl-toggleable/core/esl-toggleable.ts");
/* harmony import */ var _esl_panel_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-panel-group */ "../src/modules/esl-panel/core/esl-panel-group.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







/**
 * ESLPanel component
 * @author Julia Murashko
 *
 * ESLPanel is a custom element that is used as a wrapper for content that can be shown or hidden.
 * Can use collapsing/expanding animation (smooth height change).
 * Can be used in conjunction with {@link ESLPanelGroup} to control a group of ESLPopups
 */
var ESLPanel = /** @class */ (function (_super) {
    __extends(ESLPanel, _super);
    function ESLPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._initialHeight = 0;
        _this._fallbackTimer = 0;
        return _this;
    }
    Object.defineProperty(ESLPanel.prototype, "initialHeight", {
        /** @returns Previous active panel height at the start of the animation */
        get: function () {
            return this._initialHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLPanel.prototype, "$group", {
        /** @returns Closest panel group or null if not presented */
        get: function () {
            if (this.groupName === 'none' || this.groupName)
                return null;
            return this.closest(_esl_panel_group__WEBPACK_IMPORTED_MODULE_0__.ESLPanelGroup.is);
        },
        enumerable: false,
        configurable: true
    });
    ESLPanel.prototype.bindEvents = function () {
        _super.prototype.bindEvents.call(this);
        this.addEventListener('transitionend', this._onTransitionEnd);
    };
    ESLPanel.prototype.unbindEvents = function () {
        _super.prototype.unbindEvents.call(this);
        this.removeEventListener('transitionend', this._onTransitionEnd);
    };
    /** Process show action */
    ESLPanel.prototype.onShow = function (params) {
        var _this = this;
        _super.prototype.onShow.call(this, params);
        this.clearAnimation();
        this._initialHeight = this.offsetHeight;
        this.beforeAnimate();
        if (params.noCollapse) {
            (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_1__.afterNextRender)(function () { return _this.afterAnimate(); });
        }
        else {
            this.onAnimate('show');
            this.fallbackAnimate();
        }
    };
    /** Process hide action */
    ESLPanel.prototype.onHide = function (params) {
        var _this = this;
        this.clearAnimation();
        this._initialHeight = this.offsetHeight;
        _super.prototype.onHide.call(this, params);
        this.beforeAnimate();
        if (params.noCollapse) {
            (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_1__.afterNextRender)(function () { return _this.afterAnimate(); });
        }
        else {
            this.onAnimate('hide');
            this.fallbackAnimate();
        }
    };
    /** Pre-processing animation action */
    ESLPanel.prototype.beforeAnimate = function () {
        var _this = this;
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_2__.CSSUtil.addCls(this, this.animateClass);
        this.postAnimateClass && (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_1__.afterNextRender)(function () { return _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_2__.CSSUtil.addCls(_this, _this.postAnimateClass); });
    };
    /** Process animation */
    ESLPanel.prototype.onAnimate = function (action) {
        var _this = this;
        // set initial height
        this.style.setProperty('max-height', (action === 'hide' ? this._initialHeight : 0) + "px");
        // make sure that browser apply initial height for animation
        (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_1__.afterNextRender)(function () {
            _this.style.setProperty('max-height', (action === 'hide' ? 0 : _this._initialHeight) + "px");
        });
    };
    /** Post-processing animation action */
    ESLPanel.prototype.afterAnimate = function () {
        this.clearAnimation();
        this.$$fire(this.open ? 'after:show' : 'after:hide');
    };
    /** Clear animation properties */
    ESLPanel.prototype.clearAnimation = function () {
        this.style.removeProperty('max-height');
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_2__.CSSUtil.removeCls(this, this.animateClass);
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_2__.CSSUtil.removeCls(this, this.postAnimateClass);
    };
    /** Init a fallback timer to call post-animate action */
    ESLPanel.prototype.fallbackAnimate = function () {
        var _this = this;
        var time = +this.fallbackDuration;
        if (isNaN(time) || time < 0)
            return;
        if (this._fallbackTimer)
            clearTimeout(this._fallbackTimer);
        this._fallbackTimer = window.setTimeout(function () { return _this.afterAnimate(); }, time);
    };
    /** Catching CSS transition end event to start post-animate processing */
    ESLPanel.prototype._onTransitionEnd = function (e) {
        if (!e || e.propertyName === 'max-height') {
            this.afterAnimate();
        }
    };
    /** Merge params that are used by panel group for actions */
    ESLPanel.prototype.mergeDefaultParams = function (params) {
        var _a;
        var stackConfig = ((_a = this.$group) === null || _a === void 0 ? void 0 : _a.panelConfig) || {};
        return Object.assign({}, stackConfig, this.defaultParams, params || {});
    };
    ESLPanel.is = 'esl-panel';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.attr)({ defaultValue: 'open' })
    ], ESLPanel.prototype, "activeClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.attr)({ defaultValue: 'animate' })
    ], ESLPanel.prototype, "animateClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.attr)({ defaultValue: 'post-animate' })
    ], ESLPanel.prototype, "postAnimateClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.attr)({ defaultValue: 'auto' })
    ], ESLPanel.prototype, "fallbackDuration", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.jsonAttr)({ defaultValue: { force: true, initiator: 'init' } })
    ], ESLPanel.prototype, "initialParams", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLPanel.prototype, "_onTransitionEnd", null);
    ESLPanel = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_6__.ExportNs)('Panel')
    ], ESLPanel);
    return ESLPanel;
}(_esl_toggleable_core__WEBPACK_IMPORTED_MODULE_7__.ESLToggleable));



/***/ }),

/***/ "../src/modules/esl-popup/core/esl-popup.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-popup/core/esl-popup.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLPopup": function() { return /* binding */ ESLPopup; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_toggleable_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-toggleable/core */ "../src/modules/esl-toggleable/core/esl-toggleable.ts");
/* harmony import */ var _esl_utils_dom_scroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/dom/scroll */ "../src/modules/esl-utils/dom/scroll.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var ESLPopup = /** @class */ (function (_super) {
    __extends(ESLPopup, _super);
    function ESLPopup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ESLPopup.prototype.onShow = function (params) {
        _super.prototype.onShow.call(this, params);
        this.disableScroll !== null && _esl_utils_dom_scroll__WEBPACK_IMPORTED_MODULE_0__.ScrollUtility.requestLock(this, this.disableScroll);
    };
    ESLPopup.prototype.onHide = function (params) {
        _super.prototype.onHide.call(this, params);
        this.disableScroll !== null && _esl_utils_dom_scroll__WEBPACK_IMPORTED_MODULE_0__.ScrollUtility.requestUnlock(this, this.disableScroll);
    };
    ESLPopup.is = 'esl-popup';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_1__.attr)({ defaultValue: null })
    ], ESLPopup.prototype, "disableScroll", void 0);
    ESLPopup = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_2__.ExportNs)('Popup')
    ], ESLPopup);
    return ESLPopup;
}(_esl_toggleable_core__WEBPACK_IMPORTED_MODULE_3__.ESLToggleable));



/***/ }),

/***/ "../src/modules/esl-scrollbar/core/esl-scrollbar.ts":
/*!**********************************************************!*\
  !*** ../src/modules/esl-scrollbar/core/esl-scrollbar.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLScrollbar": function() { return /* binding */ ESLScrollbar; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_decorators_ready__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-utils/decorators/ready */ "../src/modules/esl-utils/decorators/ready.ts");
/* harmony import */ var _esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/async/raf */ "../src/modules/esl-utils/async/raf.ts");
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
/* harmony import */ var _esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-utils/dom/traversing */ "../src/modules/esl-utils/dom/traversing.ts");
/* harmony import */ var _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-traversing-query/core */ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








/**
 * ESL Scrollbar component
 * @author Yuliya Adamskaya
 */
var ESLScrollbar = /** @class */ (function (_super) {
    __extends(ESLScrollbar, _super);
    function ESLScrollbar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.deferredRefresh = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(function () { return _this.refresh(); });
        _this._resizeObserver = new ResizeObserver(_this.deferredRefresh);
        _this._mutationObserver = new MutationObserver(function (rec) { return _this.updateContentObserve(rec); });
        _this._deferredDragToCoordinate = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(_this._dragToCoordinate);
        return _this;
    }
    Object.defineProperty(ESLScrollbar, "observedAttributes", {
        get: function () {
            return ['target', 'horizontal'];
        },
        enumerable: false,
        configurable: true
    });
    ESLScrollbar.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.findTarget();
        this.render();
        this.bindEvents();
    };
    ESLScrollbar.prototype.disconnectedCallback = function () {
        this.unbindEvents();
    };
    ESLScrollbar.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (!this.connected && oldVal === newVal)
            return;
        if (attrName === 'target')
            this.findTarget();
        if (attrName === 'horizontal')
            this.refresh();
    };
    ESLScrollbar.prototype.findTarget = function () {
        this.$target = this.target ?
            _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_1__.TraversingQuery.first(this.target, this) :
            null;
    };
    Object.defineProperty(ESLScrollbar.prototype, "$target", {
        /** Target element to observe and scroll */
        get: function () {
            return this._$target || null;
        },
        set: function (content) {
            this.unbindTargetEvents();
            this._$target = content;
            this.bindTargetEvents();
            this.deferredRefresh();
        },
        enumerable: false,
        configurable: true
    });
    ESLScrollbar.prototype.render = function () {
        this.innerHTML = '';
        this.$scrollbarTrack = document.createElement('div');
        this.$scrollbarTrack.className = this.trackClass;
        this.$scrollbarThumb = document.createElement('div');
        this.$scrollbarThumb.className = this.thumbClass;
        this.$scrollbarTrack.appendChild(this.$scrollbarThumb);
        this.appendChild(this.$scrollbarTrack);
    };
    ESLScrollbar.prototype.bindEvents = function () {
        this.addEventListener('click', this._onClick);
        this.$scrollbarThumb.addEventListener('mousedown', this._onMouseDown);
        window.addEventListener('esl:refresh', this._onRefresh);
    };
    ESLScrollbar.prototype.bindTargetEvents = function () {
        var _this = this;
        if (!this.$target)
            return;
        if (document.documentElement === this.$target) {
            window.addEventListener('resize', this._onRefresh, { passive: true });
            window.addEventListener('scroll', this._onRefresh, { passive: true });
        }
        else {
            this._resizeObserver.observe(this.$target);
            this._mutationObserver.observe(this.$target, { childList: true });
            Array.from(this.$target.children).forEach(function (el) { return _this._resizeObserver.observe(el); });
            this.$target.addEventListener('scroll', this._onRefresh, { passive: true });
        }
    };
    ESLScrollbar.prototype.updateContentObserve = function (recs) {
        var _this = this;
        if (recs === void 0) { recs = []; }
        if (!this.$target)
            return;
        var contentChanges = recs.filter(function (rec) { return rec.type === 'childList'; });
        contentChanges.forEach(function (rec) {
            Array.from(rec.addedNodes)
                .filter(function (el) { return el instanceof Element; })
                .forEach(function (el) { return _this._resizeObserver.observe(el); });
            Array.from(rec.removedNodes)
                .filter(function (el) { return el instanceof Element; })
                .forEach(function (el) { return _this._resizeObserver.unobserve(el); });
        });
        if (contentChanges.length)
            this.deferredRefresh();
    };
    ESLScrollbar.prototype.unbindEvents = function () {
        this.removeEventListener('click', this._onClick);
        this.$scrollbarThumb.removeEventListener('mousedown', this._onMouseDown);
        this.unbindTargetEvents();
        window.removeEventListener('esl:refresh', this._onRefresh);
    };
    ESLScrollbar.prototype.unbindTargetEvents = function () {
        if (!this.$target)
            return;
        if (document.documentElement === this.$target) {
            window.removeEventListener('resize', this._onRefresh);
            window.removeEventListener('scroll', this._onRefresh);
        }
        else {
            this._resizeObserver.disconnect();
            this._mutationObserver.disconnect();
            this.$target.removeEventListener('scroll', this._onRefresh);
        }
    };
    Object.defineProperty(ESLScrollbar.prototype, "scrollableSize", {
        /** @readonly Scrollable distance size value (px) */
        get: function () {
            if (!this.$target)
                return 0;
            return this.horizontal ?
                this.$target.scrollWidth - this.$target.clientWidth :
                this.$target.scrollHeight - this.$target.clientHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLScrollbar.prototype, "trackOffset", {
        /** @readonly Track size value (px) */
        get: function () {
            return this.horizontal ? this.$scrollbarTrack.offsetWidth : this.$scrollbarTrack.offsetHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLScrollbar.prototype, "thumbOffset", {
        /** @readonly Thumb size value (px) */
        get: function () {
            return this.horizontal ? this.$scrollbarThumb.offsetWidth : this.$scrollbarThumb.offsetHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLScrollbar.prototype, "thumbSize", {
        /** @readonly Relative thumb size value (between 0.0 and 1.0) */
        get: function () {
            // behave as native scroll
            if (!this.$target || !this.$target.scrollWidth || !this.$target.scrollHeight)
                return 1;
            var areaSize = this.horizontal ? this.$target.clientWidth : this.$target.clientHeight;
            var scrollSize = this.horizontal ? this.$target.scrollWidth : this.$target.scrollHeight;
            return Math.min((areaSize + 1) / scrollSize, 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLScrollbar.prototype, "position", {
        /** Relative position value (between 0.0 and 1.0) */
        get: function () {
            if (!this.$target)
                return 0;
            var scrollOffset = this.horizontal ? this.$target.scrollLeft : this.$target.scrollTop;
            return this.scrollableSize ? (scrollOffset / this.scrollableSize) : 0;
        },
        set: function (position) {
            var normalizedPosition = Math.min(1, Math.max(0, position));
            this.scrollTargetTo(this.scrollableSize * normalizedPosition);
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    /** Scroll target element to passed position */
    ESLScrollbar.prototype.scrollTargetTo = function (pos) {
        var _a;
        if (!this.$target)
            return;
        this.$target.scrollTo((_a = {},
            _a[this.horizontal ? 'left' : 'top'] = pos,
            _a.behavior = this.dragging ? 'auto' : 'smooth',
            _a));
    };
    /** Update thumb size and position */
    ESLScrollbar.prototype.update = function () {
        var _a;
        if (!this.$scrollbarThumb || !this.$scrollbarTrack)
            return;
        var thumbSize = this.trackOffset * this.thumbSize;
        var thumbPosition = (this.trackOffset - thumbSize) * this.position;
        var style = (_a = {},
            _a[this.horizontal ? 'left' : 'top'] = thumbPosition + "px",
            _a[this.horizontal ? 'width' : 'height'] = thumbSize + "px",
            _a);
        Object.assign(this.$scrollbarThumb.style, style);
    };
    /** Update auxiliary markers */
    ESLScrollbar.prototype.updateMarkers = function () {
        this.toggleAttribute('inactive', this.thumbSize >= 1);
    };
    /** Refresh scroll state and position */
    ESLScrollbar.prototype.refresh = function () {
        this.update();
        this.updateMarkers();
    };
    // Event listeners
    /** `mousedown` event to track thumb drag start */
    ESLScrollbar.prototype._onMouseDown = function (event) {
        this.dragging = true;
        this._initialPosition = this.position;
        this._initialMousePosition = this.horizontal ? event.clientX : event.clientY;
        // Attach drag listeners
        window.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('mouseup', this._onMouseUp);
        window.addEventListener('click', this._onBodyClick, { capture: true });
        // Prevents default text selection, etc.
        event.preventDefault();
    };
    /** Set position on drug */
    ESLScrollbar.prototype._dragToCoordinate = function (mousePosition) {
        var positionChange = mousePosition - this._initialMousePosition;
        var scrollableAreaHeight = this.trackOffset - this.thumbOffset;
        var absChange = scrollableAreaHeight ? (positionChange / scrollableAreaHeight) : 0;
        this.position = this._initialPosition + absChange;
    };
    /** `mousemove` document handler for thumb drag event. Active only if drag action is active */
    ESLScrollbar.prototype._onMouseMove = function (event) {
        if (!this.dragging)
            return;
        // Request position update
        this._deferredDragToCoordinate(this.horizontal ? event.clientX : event.clientY);
        // Prevents default text selection, etc.
        event.preventDefault();
        event.stopPropagation();
    };
    /** `mouseup` short-time document handler for drag end action */
    ESLScrollbar.prototype._onMouseUp = function () {
        this.dragging = false;
        // Unbind drag listeners
        window.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('mouseup', this._onMouseUp);
    };
    /** Body `click` short-time handler to prevent clicks event on thumb drag. Handles capture phase */
    ESLScrollbar.prototype._onBodyClick = function (event) {
        event.stopImmediatePropagation();
        window.removeEventListener('click', this._onBodyClick, { capture: true });
    };
    /** Handler for track clicks. Move scroll to selected position */
    ESLScrollbar.prototype._onClick = function (event) {
        if (event.target !== this.$scrollbarTrack && event.target !== this)
            return;
        var clickCoordinates = _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_2__.EventUtils.normalizeCoordinates(event, this.$scrollbarTrack);
        var clickPosition = this.horizontal ? clickCoordinates.x : clickCoordinates.y;
        var freeTrackArea = this.trackOffset - this.thumbOffset; // px
        var clickPositionNoOffset = clickPosition - this.thumbOffset / 2;
        var newPosition = clickPositionNoOffset / freeTrackArea; // abs % to track
        this.position = Math.min(this.position + this.thumbSize, Math.max(this.position - this.thumbSize, newPosition));
    };
    /**
     * Handler for refresh events to update the scroll.
     * @param event - instance of 'resize' or 'scroll' or 'esl:refresh' event.
     */
    ESLScrollbar.prototype._onRefresh = function (event) {
        var target = event.target;
        if (event.type === 'scroll' && this.dragging)
            return;
        if (event.type === 'esl:refresh' && !_esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_3__.TraversingUtils.isRelative(target.parentNode, this.$target))
            return;
        this.deferredRefresh();
    };
    ESLScrollbar.is = 'esl-scrollbar';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.boolAttr)()
    ], ESLScrollbar.prototype, "horizontal", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: '::parent' })
    ], ESLScrollbar.prototype, "target", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'scrollbar-thumb' })
    ], ESLScrollbar.prototype, "thumbClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'scrollbar-track' })
    ], ESLScrollbar.prototype, "trackClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.boolAttr)()
    ], ESLScrollbar.prototype, "dragging", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.boolAttr)({ readonly: true })
    ], ESLScrollbar.prototype, "inactive", void 0);
    __decorate([
        _esl_utils_decorators_ready__WEBPACK_IMPORTED_MODULE_6__.ready
    ], ESLScrollbar.prototype, "connectedCallback", null);
    __decorate([
        _esl_utils_decorators_ready__WEBPACK_IMPORTED_MODULE_6__.ready
    ], ESLScrollbar.prototype, "disconnectedCallback", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLScrollbar.prototype, "_onMouseDown", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLScrollbar.prototype, "_onMouseMove", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLScrollbar.prototype, "_onMouseUp", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLScrollbar.prototype, "_onBodyClick", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLScrollbar.prototype, "_onClick", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLScrollbar.prototype, "_onRefresh", null);
    ESLScrollbar = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_8__.ExportNs)('Scrollbar')
    ], ESLScrollbar);
    return ESLScrollbar;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_9__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-tab/core/esl-tab.ts":
/*!**********************************************!*\
  !*** ../src/modules/esl-tab/core/esl-tab.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLTab": function() { return /* binding */ ESLTab; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_trigger_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-trigger/core */ "../src/modules/esl-trigger/core/esl-trigger.ts");
/* harmony import */ var _esl_base_element_decorators_attr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-base-element/decorators/attr */ "../src/modules/esl-base-element/decorators/attr.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



/**
 * ESlTab component
 * @author Julia Murashko
 *
 * Tab trigger item, usually used in conjunction with a {@link ESLTabs}.
 * Can control any {@link ESLToggleable} instance but is usually used in conjunction with {@link ESLPanel}
 */
var ESLTab = /** @class */ (function (_super) {
    __extends(ESLTab, _super);
    function ESLTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ESLTab.prototype.updateA11y = function () {
        var target = this.$a11yTarget;
        if (!target)
            return;
        target.setAttribute('aria-selected', String(this.active));
        target.setAttribute('tabindex', this.active ? '0' : '-1');
        // TODO: auto generate
        if (this.$target.id) {
            this.setAttribute('aria-controls', this.$target.id);
        }
    };
    ESLTab.is = 'esl-tab';
    __decorate([
        (0,_esl_base_element_decorators_attr__WEBPACK_IMPORTED_MODULE_0__.attr)({ defaultValue: 'show' })
    ], ESLTab.prototype, "mode", void 0);
    __decorate([
        (0,_esl_base_element_decorators_attr__WEBPACK_IMPORTED_MODULE_0__.attr)({ defaultValue: 'active' })
    ], ESLTab.prototype, "activeClass", void 0);
    ESLTab = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_1__.ExportNs)('Tab')
    ], ESLTab);
    return ESLTab;
}(_esl_trigger_core__WEBPACK_IMPORTED_MODULE_2__.ESLTrigger));



/***/ }),

/***/ "../src/modules/esl-tab/core/esl-tabs.ts":
/*!***********************************************!*\
  !*** ../src/modules/esl-tab/core/esl-tabs.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLTabs": function() { return /* binding */ ESLTabs; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/async/raf */ "../src/modules/esl-utils/async/raf.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_tab__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esl-tab */ "../src/modules/esl-tab/core/esl-tab.ts");
/* harmony import */ var _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/dom/rtl */ "../src/modules/esl-utils/dom/rtl.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






/**
 * ESlTabs component
 * @author Julia Murashko
 *
 * Tabs container component for Tabs trigger group.
 * Uses {@link ESLTab} as an item.
 * Each individual {@link ESLTab} can control {@link ESLToggleable} or, usually, {@link ESLPanel}
 */
var ESLTabs = /** @class */ (function (_super) {
    __extends(ESLTabs, _super);
    function ESLTabs() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._deferredUpdateArrows = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(_this.updateArrows.bind(_this));
        _this._deferredFitToViewport = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(_this.fitToViewport.bind(_this));
        // TODO: is the raf decorator needed?
        _this._onResize = (0,_esl_utils_async_raf__WEBPACK_IMPORTED_MODULE_0__.rafDecorator)(function () {
            _this._deferredFitToViewport(_this.$current, 'auto');
        });
        return _this;
    }
    ESLTabs.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.bindScrollableEvents();
        this.updateScroll();
    };
    ESLTabs.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.unbindScrollableEvents();
    };
    ESLTabs.prototype.bindScrollableEvents = function () {
        var _a;
        this.addEventListener('esl:change:active', this._onTriggerStateChange);
        this.addEventListener('click', this._onClick, false);
        this.addEventListener('focusin', this._onFocus);
        (_a = this.$scrollableTarget) === null || _a === void 0 ? void 0 : _a.addEventListener('scroll', this._onScroll, { passive: true });
        window.addEventListener('resize', this._onResize);
    };
    ESLTabs.prototype.unbindScrollableEvents = function () {
        var _a;
        this.removeEventListener('esl:change:active', this._onTriggerStateChange);
        this.removeEventListener('click', this._onClick, false);
        this.removeEventListener('focusin', this._onFocus);
        (_a = this.$scrollableTarget) === null || _a === void 0 ? void 0 : _a.removeEventListener('scroll', this._onScroll);
        window.removeEventListener('resize', this._onResize);
    };
    ESLTabs.prototype.updateScroll = function () {
        this.updateArrows();
        this._deferredFitToViewport(this.$current, 'auto');
    };
    Object.defineProperty(ESLTabs.prototype, "$tabs", {
        /** Collection of inner {@link ESLTab} items */
        get: function () {
            var els = this.querySelectorAll(_esl_tab__WEBPACK_IMPORTED_MODULE_1__.ESLTab.is);
            return els ? Array.from(els) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLTabs.prototype, "$current", {
        /** Active {@link ESLTab} item */
        get: function () {
            return this.$tabs.find(function (el) { return el.active; }) || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLTabs.prototype, "$scrollableTarget", {
        /** Container element to scroll */
        get: function () {
            return this.querySelector(this.scrollableTarget);
        },
        enumerable: false,
        configurable: true
    });
    /** Move scroll to the next/previous item */
    ESLTabs.prototype.moveTo = function (direction, behavior) {
        if (behavior === void 0) { behavior = 'smooth'; }
        var $scrollableTarget = this.$scrollableTarget;
        if (!$scrollableTarget)
            return;
        var left = $scrollableTarget.offsetWidth;
        left = _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.isRtl(this) && _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.scrollType !== 'reverse' ? -left : left;
        left = direction === 'left' ? -left : left;
        $scrollableTarget.scrollBy({ left: left, behavior: behavior });
    };
    /** Scroll tab to the view */
    ESLTabs.prototype.fitToViewport = function ($trigger, behavior) {
        if (behavior === void 0) { behavior = 'smooth'; }
        var $scrollableTarget = this.$scrollableTarget;
        if (!$scrollableTarget || !$trigger)
            return;
        var areaRect = $scrollableTarget.getBoundingClientRect();
        var itemRect = $trigger.getBoundingClientRect();
        var shift = 0;
        // item is out of area from the right side
        // else item out is of area from the left side
        if (itemRect.right > areaRect.right) {
            shift = _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.isRtl(this) && _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.scrollType === 'reverse' ?
                Math.floor(areaRect.right - itemRect.right) :
                Math.ceil(itemRect.right - areaRect.right);
        }
        else if (itemRect.left < areaRect.left) {
            shift = _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.isRtl(this) && _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.scrollType === 'reverse' ?
                Math.ceil(areaRect.left - itemRect.left) :
                Math.floor(itemRect.left - areaRect.left);
        }
        $scrollableTarget.scrollBy({
            left: shift,
            behavior: behavior
        });
        this.updateArrows();
    };
    ESLTabs.prototype.updateArrows = function () {
        var $scrollableTarget = this.$scrollableTarget;
        if (!$scrollableTarget)
            return;
        var hasScroll = $scrollableTarget.scrollWidth > this.clientWidth;
        var swapSides = _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.isRtl(this) && _esl_utils_dom_rtl__WEBPACK_IMPORTED_MODULE_2__.RTLUtils.scrollType === 'default';
        var scrollStart = Math.abs($scrollableTarget.scrollLeft) > 1;
        var scrollEnd = Math.abs($scrollableTarget.scrollLeft) + $scrollableTarget.clientWidth + 1 < $scrollableTarget.scrollWidth;
        var $rightArrow = this.querySelector('[data-tab-direction="right"]');
        var $leftArrow = this.querySelector('[data-tab-direction="left"]');
        this.toggleAttribute('has-scroll', hasScroll);
        $leftArrow && $leftArrow.toggleAttribute('disabled', !(swapSides ? scrollEnd : scrollStart));
        $rightArrow && $rightArrow.toggleAttribute('disabled', !(swapSides ? scrollStart : scrollEnd));
    };
    ESLTabs.prototype._onTriggerStateChange = function () {
        this._deferredFitToViewport(this.$current);
    };
    ESLTabs.prototype._onClick = function (event) {
        var eventTarget = event.target;
        var target = eventTarget.closest('[data-tab-direction]');
        var direction = target && target.dataset.tabDirection;
        if (!direction)
            return;
        this.moveTo(direction);
    };
    ESLTabs.prototype._onFocus = function (e) {
        var target = e.target;
        if (target instanceof _esl_tab__WEBPACK_IMPORTED_MODULE_1__.ESLTab)
            this._deferredFitToViewport(target);
    };
    ESLTabs.prototype._onScroll = function () {
        this._deferredUpdateArrows();
    };
    ESLTabs.is = 'esl-tabs';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_3__.boolAttr)()
    ], ESLTabs.prototype, "scrollable", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.attr)({ defaultValue: '.esl-tab-container' })
    ], ESLTabs.prototype, "scrollableTarget", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLTabs.prototype, "_onTriggerStateChange", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLTabs.prototype, "_onClick", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLTabs.prototype, "_onFocus", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_5__.bind
    ], ESLTabs.prototype, "_onScroll", null);
    ESLTabs = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_6__.ExportNs)('Tabs')
    ], ESLTabs);
    return ESLTabs;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-toggleable/core/esl-toggleable-dispatcher.ts":
/*!***********************************************************************!*\
  !*** ../src/modules/esl-toggleable/core/esl-toggleable-dispatcher.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLToggleableDispatcher": function() { return /* binding */ ESLToggleableDispatcher; }
/* harmony export */ });
/* harmony import */ var _esl_toggleable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esl-toggleable */ "../src/modules/esl-toggleable/core/esl-toggleable.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/dom/events */ "../src/modules/esl-utils/dom/events.ts");
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





/**
 * ESLToggleableDispatcher
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLToggleableDispatcher - plugin component, that prevents activation of multiple ESLToggleable instances in bounds of managed container.
 */
var ESLToggleableDispatcher = /** @class */ (function (_super) {
    __extends(ESLToggleableDispatcher, _super);
    function ESLToggleableDispatcher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._popups = new Map();
        return _this;
    }
    /**
     * Initialize ToggleableGroupDispatcher
     * Uses esl-toggleable-dispatcher tag and document body root by default
     */
    ESLToggleableDispatcher.init = function (root, tagName) {
        if (root === void 0) { root = document.body; }
        if (tagName === void 0) { tagName = this.is; }
        if (!root)
            throw new Error('Root element should be specified');
        var instances = root.getElementsByTagName(tagName);
        if (instances.length)
            return;
        this.register(tagName);
        root.insertAdjacentElement('afterbegin', document.createElement(tagName));
    };
    ESLToggleableDispatcher.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.root = this.parentElement;
    };
    ESLToggleableDispatcher.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.root = null;
    };
    ESLToggleableDispatcher.prototype.bindEvents = function () {
        if (!this.root)
            return;
        this.root.addEventListener('esl:before:show', this._onBeforeShow);
        this.root.addEventListener('esl:show', this._onShow);
        this.root.addEventListener('esl:hide', this._onHide);
        this.root.addEventListener('esl:change:group', this._onChangeGroup);
    };
    ESLToggleableDispatcher.prototype.unbindEvents = function () {
        if (!this.root)
            return;
        this.root.removeEventListener('esl:before:show', this._onBeforeShow);
        this.root.removeEventListener('esl:show', this._onShow);
        this.root.removeEventListener('esl:hide', this._onHide);
        this.root.removeEventListener('esl:change:group', this._onChangeGroup);
    };
    Object.defineProperty(ESLToggleableDispatcher.prototype, "root", {
        /** Observed element */
        get: function () {
            return this._root;
        },
        set: function (root) {
            this.unbindEvents();
            this._root = root;
            this.bindEvents();
        },
        enumerable: false,
        configurable: true
    });
    /** Guard-condition for targets */
    ESLToggleableDispatcher.prototype.isAcceptable = function (target) {
        if (!(target instanceof _esl_toggleable__WEBPACK_IMPORTED_MODULE_0__.ESLToggleable))
            return false;
        return !!target.groupName && target.groupName !== 'none';
    };
    /** Hide active element in group */
    ESLToggleableDispatcher.prototype.hideActive = function (groupName) {
        var _a;
        (_a = this.getActive(groupName)) === null || _a === void 0 ? void 0 : _a.hide();
    };
    /** Set active element in group */
    ESLToggleableDispatcher.prototype.setActive = function (groupName, popup) {
        if (!groupName)
            return;
        this.hideActive(groupName);
        this._popups.set(groupName, popup);
    };
    /** Get active element in group or undefined if group doesn't exist */
    ESLToggleableDispatcher.prototype.getActive = function (groupName) {
        return this._popups.get(groupName);
    };
    /** Delete element from the group if passed element is currently active */
    ESLToggleableDispatcher.prototype.deleteActive = function (groupName, popup) {
        if (this.getActive(groupName) !== popup)
            return;
        this._popups.delete(groupName);
    };
    /** Hide active element before e.target will be shown */
    ESLToggleableDispatcher.prototype._onBeforeShow = function (e) {
        var target = _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_1__.EventUtils.source(e);
        if (!this.isAcceptable(target))
            return;
        this.hideActive(target.groupName);
    };
    /** Update active element after a new element is shown */
    ESLToggleableDispatcher.prototype._onShow = function (e) {
        var target = _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_1__.EventUtils.source(e);
        if (!this.isAcceptable(target))
            return;
        this.setActive(target.groupName, target);
    };
    /** Update group state after active element is hidden */
    ESLToggleableDispatcher.prototype._onHide = function (e) {
        var target = _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_1__.EventUtils.source(e);
        if (!this.isAcceptable(target))
            return;
        this.deleteActive(target.groupName, target);
    };
    /** Update active elements */
    ESLToggleableDispatcher.prototype._onChangeGroup = function (e) {
        var target = _esl_utils_dom_events__WEBPACK_IMPORTED_MODULE_1__.EventUtils.source(e);
        if (!this.isAcceptable(target))
            return;
        var _a = e.detail, oldGroupName = _a.oldGroupName, newGroupName = _a.newGroupName;
        this.deleteActive(oldGroupName, target);
        this.setActive(newGroupName, target);
    };
    ESLToggleableDispatcher.is = 'esl-toggleable-dispatcher';
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_2__.bind
    ], ESLToggleableDispatcher.prototype, "_onBeforeShow", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_2__.bind
    ], ESLToggleableDispatcher.prototype, "_onShow", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_2__.bind
    ], ESLToggleableDispatcher.prototype, "_onHide", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_2__.bind
    ], ESLToggleableDispatcher.prototype, "_onChangeGroup", null);
    ESLToggleableDispatcher = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_3__.ExportNs)('ToggleableGroupDispatcher')
    ], ESLToggleableDispatcher);
    return ESLToggleableDispatcher;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-toggleable/core/esl-toggleable.ts":
/*!************************************************************!*\
  !*** ../src/modules/esl-toggleable/core/esl-toggleable.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLToggleable": function() { return /* binding */ ESLToggleable; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-utils/dom/keys */ "../src/modules/esl-utils/dom/keys.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_misc_object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/misc/object */ "../src/modules/esl-utils/misc/object.ts");
/* harmony import */ var _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/environment/device-detector */ "../src/modules/esl-utils/environment/device-detector.ts");
/* harmony import */ var _esl_utils_async_delayed_task__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/async/delayed-task */ "../src/modules/esl-utils/async/delayed-task.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/json-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var activators = new WeakMap();
/**
 * ESLToggleable component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLToggleable - a custom element, that is used as a base for "Popup-like" components creation
 */
var ESLToggleable = /** @class */ (function (_super) {
    __extends(ESLToggleable, _super);
    function ESLToggleable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._open = false;
        _this._trackHover = false;
        _this._task = new _esl_utils_async_delayed_task__WEBPACK_IMPORTED_MODULE_0__.DelayedTask();
        return _this;
    }
    Object.defineProperty(ESLToggleable, "observedAttributes", {
        get: function () {
            return ['open', 'group'];
        },
        enumerable: false,
        configurable: true
    });
    ESLToggleable.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (!this.connected || newVal === oldVal)
            return;
        switch (attrName) {
            case 'open':
                this.toggle(this.open, Object.assign({ initiator: 'attribute' }, this.defaultParams));
                break;
            case 'group':
                this.$$fire('change:group', {
                    detail: { oldGroupName: oldVal, newGroupName: newVal }
                });
                break;
        }
    };
    ESLToggleable.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.bindEvents();
        this.setInitialState();
    };
    ESLToggleable.prototype.disconnectedCallback = function () {
        _super.prototype.disconnectedCallback.call(this);
        this.unbindEvents();
        activators.delete(this);
    };
    /** Set initial state of the Toggleable */
    ESLToggleable.prototype.setInitialState = function () {
        if (!this.initialParams)
            return;
        this.toggle(this.open, this.initialParams);
    };
    ESLToggleable.prototype.bindEvents = function () {
        this.addEventListener('click', this._onClick);
        this.addEventListener('keydown', this._onKeyboardEvent);
    };
    ESLToggleable.prototype.unbindEvents = function () {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', this._onKeyboardEvent);
        this.bindOutsideEventTracking(false);
        this.bindHoverStateTracking(false);
    };
    /** Bind outside action event listeners */
    ESLToggleable.prototype.bindOutsideEventTracking = function (track) {
        document.body.removeEventListener('mouseup', this._onOutsideAction);
        document.body.removeEventListener('touchend', this._onOutsideAction);
        if (track) {
            document.body.addEventListener('mouseup', this._onOutsideAction, true);
            document.body.addEventListener('touchend', this._onOutsideAction, true);
        }
    };
    /** Bind hover events listeners for the Toggleable itself */
    ESLToggleable.prototype.bindHoverStateTracking = function (track) {
        if (_esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_1__.DeviceDetector.isTouchDevice)
            return;
        if (this._trackHover === track)
            return;
        this._trackHover = track;
        this.removeEventListener('mouseenter', this._onMouseEnter);
        this.removeEventListener('mouseleave', this._onMouseLeave);
        if (this._trackHover) {
            this.addEventListener('mouseenter', this._onMouseEnter);
            this.addEventListener('mouseleave', this._onMouseLeave);
        }
    };
    /** Function to merge the result action params */
    ESLToggleable.prototype.mergeDefaultParams = function (params) {
        return Object.assign({}, this.defaultParams, params || {});
    };
    /** Toggle the element state */
    ESLToggleable.prototype.toggle = function (state, params) {
        if (state === void 0) { state = !this.open; }
        return state ? this.show(params) : this.hide(params);
    };
    /** Change the element state to active */
    ESLToggleable.prototype.show = function (params) {
        params = this.mergeDefaultParams(params);
        this.planShowTask(params);
        this.bindOutsideEventTracking(this.closeOnOutsideAction);
        this.bindHoverStateTracking(!!params.trackHover);
        return this;
    };
    ESLToggleable.prototype.planShowTask = function (params) {
        var _this = this;
        this._task.put(function () {
            if (!params.force && _this._open)
                return;
            if (!params.silent && !_this.$$fire('before:show', { detail: { params: params } }))
                return;
            _this.onShow(params);
            if (!params.silent && !_this.$$fire('show', { detail: { params: params } }))
                return;
        }, (0,_esl_utils_misc_object__WEBPACK_IMPORTED_MODULE_2__.defined)(params.showDelay, params.delay));
    };
    /** Change the element state to inactive */
    ESLToggleable.prototype.hide = function (params) {
        params = this.mergeDefaultParams(params);
        this.planHideTask(params);
        this.bindOutsideEventTracking(false);
        this.bindHoverStateTracking(!!params.trackHover);
        return this;
    };
    ESLToggleable.prototype.planHideTask = function (params) {
        var _this = this;
        this._task.put(function () {
            if (!params.force && !_this._open)
                return;
            if (!params.silent && !_this.$$fire('before:hide', { detail: { params: params } }))
                return;
            _this.onHide(params);
            if (!params.silent && !_this.$$fire('hide', { detail: { params: params } }))
                return;
        }, (0,_esl_utils_misc_object__WEBPACK_IMPORTED_MODULE_2__.defined)(params.hideDelay, params.delay));
    };
    Object.defineProperty(ESLToggleable.prototype, "activator", {
        /** Last component that has activated the element. Uses {@link ToggleableActionParams.activator}*/
        get: function () {
            return activators.get(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLToggleable.prototype, "$a11yTarget", {
        /** Returns the element to apply a11y attributes */
        get: function () {
            var target = this.getAttribute('a11y-target');
            if (target === 'none')
                return;
            return target ? this.querySelector(target) : this;
        },
        enumerable: false,
        configurable: true
    });
    /** Called on show and on hide actions to update a11y state accordingly */
    ESLToggleable.prototype.updateA11y = function () {
        var targetEl = this.$a11yTarget;
        if (!targetEl)
            return;
        targetEl.setAttribute('aria-hidden', String(!this._open));
    };
    /** Action to show the element */
    ESLToggleable.prototype.onShow = function (params) {
        activators.set(this, params.activator);
        this.open = this._open = true;
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.addCls(this, this.activeClass);
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.addCls(document.body, this.bodyClass);
        this.updateA11y();
        this.$$fire('esl:refresh');
    };
    /** Action to hide the element */
    ESLToggleable.prototype.onHide = function (params) {
        activators.delete(this);
        this.open = this._open = false;
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.removeCls(this, this.activeClass);
        _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_3__.CSSUtil.removeCls(document.body, this.bodyClass);
        this.updateA11y();
    };
    // "Private" Handlers
    ESLToggleable.prototype._onClick = function (e) {
        var target = e.target;
        if (this.closeTrigger && target.closest(this.closeTrigger)) {
            this.hide({ initiator: 'close', activator: target });
        }
    };
    ESLToggleable.prototype._onOutsideAction = function (e) {
        var target = e.target;
        if (this.contains(target))
            return;
        if (this.activator && this.activator.contains(target))
            return;
        this.hide({ initiator: 'outsideaction', activator: target });
    };
    ESLToggleable.prototype._onKeyboardEvent = function (e) {
        if (this.closeOnEsc && e.key === _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_4__.ESC) {
            this.hide({ initiator: 'keyboard' });
        }
    };
    ESLToggleable.prototype._onMouseEnter = function () {
        this.show({ initiator: 'mouseenter', trackHover: true });
    };
    ESLToggleable.prototype._onMouseLeave = function () {
        this.hide({ initiator: 'mouseleave', trackHover: true });
    };
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.boolAttr)()
    ], ESLToggleable.prototype, "open", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)()
    ], ESLToggleable.prototype, "bodyClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)()
    ], ESLToggleable.prototype, "activeClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ name: 'group' })
    ], ESLToggleable.prototype, "groupName", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_6__.attr)({ name: 'close-on' })
    ], ESLToggleable.prototype, "closeTrigger", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.boolAttr)()
    ], ESLToggleable.prototype, "closeOnEsc", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.boolAttr)()
    ], ESLToggleable.prototype, "closeOnOutsideAction", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.jsonAttr)({ defaultValue: { force: true, initiator: 'init' } })
    ], ESLToggleable.prototype, "initialParams", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_7__.jsonAttr)({ defaultValue: {} })
    ], ESLToggleable.prototype, "defaultParams", void 0);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLToggleable.prototype, "_onClick", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLToggleable.prototype, "_onOutsideAction", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLToggleable.prototype, "_onKeyboardEvent", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLToggleable.prototype, "_onMouseEnter", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_8__.bind
    ], ESLToggleable.prototype, "_onMouseLeave", null);
    ESLToggleable = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_9__.ExportNs)('Toggleable')
    ], ESLToggleable);
    return ESLToggleable;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_10__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts":
/*!************************************************************************!*\
  !*** ../src/modules/esl-traversing-query/core/esl-traversing-query.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TraversingQuery": function() { return /* binding */ TraversingQuery; }
/* harmony export */ });
/* harmony import */ var _esl_utils_misc_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-utils/misc/array */ "../src/modules/esl-utils/misc/array.ts");
/* harmony import */ var _esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/misc/format */ "../src/modules/esl-utils/misc/format.ts");
/* harmony import */ var _esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/dom/traversing */ "../src/modules/esl-utils/dom/traversing.ts");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};



/**
 * Traversing Query utility to find element via extended selector query
 * Extended query supports
 * - plain CSS selectors
 * - relative selectors (selectors that don't start from a plain selector will use passed base Element as a root)
 * - ::next and ::prev sibling pseudo-selectors
 * - ::parent and ::child pseudo-selectors
 * - ::find pseudo-selector
 * - ::first, ::last and :nth(#) limitation pseudo-selectors
 * - ::filter, ::not filtration pseudo-selectors
 *
 * @example "#id .class [attr]" - find by CSS selector in a current document
 * @example "" - get current base element
 * @example "::next" - get next sibling element
 * @example "::prev" - get previous sibling element
 * @example "::parent" - get base element parent
 * @example "::parent(#id .class [attr])" - find the closest parent matching passed selector
 * @example "::child(#id .class [attr])" - find direct child element(s) that match passed selector
 * @example "::find(#id .class [attr])" - find child element(s) that match passed selector
 * @example "::find(buttons, a)::not([hidden])" - find all buttons and anchors that are not have hidden attribute
 * @example "::find(buttons, a)::filter(:first-child)" - find all buttons and anchors that are first child in container
 * @example "::parent::child(some-tag)" - find direct child element(s) that match tag 'some-tag' in the parent
 * @example "#id .class [attr]::parent" - find parent of element matching selector '#id .class [attr]' in document
 * @example "::find(.row)::last::parent" - find parent of the last element matching selector '.row' from the base element subtree
 */
var TraversingQuery = /** @class */ (function () {
    function TraversingQuery() {
    }
    Object.defineProperty(TraversingQuery, "PROCESSORS_REGEX", {
        /**
         * @return RegExp that selects all known processors in query string
         * e.g. /(::parent|::child|::next|::prev)/
         */
        get: function () {
            var keys = Object.keys(this.ELEMENT_PROCESSORS).concat(Object.keys(this.COLLECTION_PROCESSORS));
            return new RegExp("(" + keys.join('|') + ")", 'g');
        },
        enumerable: false,
        configurable: true
    });
    TraversingQuery.isCollectionProcessor = function (_a) {
        var _b = __read(_a, 1), name = _b[0];
        return name && (name in this.COLLECTION_PROCESSORS);
    };
    TraversingQuery.processElement = function (el, _a) {
        var _b = __read(_a, 2), name = _b[0], selString = _b[1];
        var sel = (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.unwrapParenthesis)(selString || '');
        if (!name || !(name in this.ELEMENT_PROCESSORS))
            return [];
        return (0,_esl_utils_misc_array__WEBPACK_IMPORTED_MODULE_1__.wrap)(this.ELEMENT_PROCESSORS[name](el, sel));
    };
    TraversingQuery.processCollection = function (els, _a) {
        var _b = __read(_a, 2), name = _b[0], selString = _b[1];
        var sel = (0,_esl_utils_misc_format__WEBPACK_IMPORTED_MODULE_0__.unwrapParenthesis)(selString || '');
        if (!name || !(name in this.COLLECTION_PROCESSORS))
            return [];
        return (0,_esl_utils_misc_array__WEBPACK_IMPORTED_MODULE_1__.wrap)(this.COLLECTION_PROCESSORS[name](els, sel));
    };
    TraversingQuery.traverseChain = function (collection, processors, findFirst) {
        var e_1, _a;
        if (!processors.length || !collection.length)
            return collection;
        var _b = __read(processors), processor = _b[0], rest = _b.slice(1);
        if (this.isCollectionProcessor(processor)) {
            var processedItem = this.processCollection(collection, processor);
            return this.traverseChain(processedItem, rest, findFirst);
        }
        var result = [];
        try {
            for (var collection_1 = __values(collection), collection_1_1 = collection_1.next(); !collection_1_1.done; collection_1_1 = collection_1.next()) {
                var target = collection_1_1.value;
                var processedItem = this.processElement(target, processor);
                var resultCollection = this.traverseChain(processedItem, rest, findFirst);
                if (!resultCollection.length)
                    continue;
                if (findFirst)
                    return resultCollection.slice(0, 1);
                result.push.apply(result, __spreadArray([], __read(resultCollection)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (collection_1_1 && !collection_1_1.done && (_a = collection_1.return)) _a.call(collection_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return (0,_esl_utils_misc_array__WEBPACK_IMPORTED_MODULE_1__.uniq)(result);
    };
    TraversingQuery.traverse = function (query, findFirst, base) {
        var parts = query.split(this.PROCESSORS_REGEX).map(function (term) { return term.trim(); });
        var rootSel = parts.shift();
        var baseCollection = base ? [base] : [];
        var initial = rootSel ? Array.from(document.querySelectorAll(rootSel)) : baseCollection;
        return this.traverseChain(initial, (0,_esl_utils_misc_array__WEBPACK_IMPORTED_MODULE_1__.tuple)(parts), findFirst);
    };
    /** @return first matching element reached via {@class TraversingQuery} rules */
    TraversingQuery.first = function (query, base) {
        return TraversingQuery.traverse(query, true, base)[0] || null;
    };
    /** @return Array of all matching elements reached via {@class TraversingQuery} rules */
    TraversingQuery.all = function (query, base) {
        return TraversingQuery.traverse(query, false, base);
    };
    TraversingQuery.ELEMENT_PROCESSORS = {
        '::find': _esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_2__.TraversingUtils.findAll,
        '::next': _esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_2__.TraversingUtils.findNext,
        '::prev': _esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_2__.TraversingUtils.findPrev,
        '::child': _esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_2__.TraversingUtils.findChildren,
        '::parent': _esl_utils_dom_traversing__WEBPACK_IMPORTED_MODULE_2__.TraversingUtils.findParent
    };
    TraversingQuery.COLLECTION_PROCESSORS = {
        '::first': function (list) { return list.slice(0, 1); },
        '::last': function (list) { return list.slice(-1); },
        '::nth': function (list, sel) {
            var index = sel ? +sel : NaN;
            return (0,_esl_utils_misc_array__WEBPACK_IMPORTED_MODULE_1__.wrap)(list[index - 1]);
        },
        '::not': function (list, sel) { return list.filter(function (el) { return !el.matches(sel || ''); }); },
        '::filter': function (list, sel) { return list.filter(function (el) { return el.matches(sel || ''); }); }
    };
    return TraversingQuery;
}());



/***/ }),

/***/ "../src/modules/esl-trigger/core/esl-trigger.ts":
/*!******************************************************!*\
  !*** ../src/modules/esl-trigger/core/esl-trigger.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESLTrigger": function() { return /* binding */ ESLTrigger; }
/* harmony export */ });
/* harmony import */ var _esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../esl-utils/environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/bool-attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/decorators/attr.ts");
/* harmony import */ var _esl_base_element_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../esl-base-element/core */ "../src/modules/esl-base-element/core/esl-base-element.ts");
/* harmony import */ var _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../esl-utils/decorators/bind */ "../src/modules/esl-utils/decorators/bind.ts");
/* harmony import */ var _esl_utils_decorators_ready__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../esl-utils/decorators/ready */ "../src/modules/esl-utils/decorators/ready.ts");
/* harmony import */ var _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../esl-traversing-query/core */ "../src/modules/esl-traversing-query/core/esl-traversing-query.ts");
/* harmony import */ var _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../esl-utils/environment/device-detector */ "../src/modules/esl-utils/environment/device-detector.ts");
/* harmony import */ var _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../esl-utils/dom/styles */ "../src/modules/esl-utils/dom/styles.ts");
/* harmony import */ var _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../esl-utils/dom/keys */ "../src/modules/esl-utils/dom/keys.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var ESLTrigger = /** @class */ (function (_super) {
    __extends(ESLTrigger, _super);
    function ESLTrigger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ESLTrigger, "observedAttributes", {
        get: function () {
            return ['target', 'event', 'mode'];
        },
        enumerable: false,
        configurable: true
    });
    ESLTrigger.prototype.attributeChangedCallback = function (attrName) {
        if (!this.connected)
            return;
        switch (attrName) {
            case 'target':
                this.updateTargetFromSelector();
                break;
            case 'mode':
            case 'event':
                this.unbindEvents();
                this.bindEvents();
                break;
        }
    };
    Object.defineProperty(ESLTrigger.prototype, "_showEvent", {
        /** ESLTrigger 'primary' show event */
        get: function () {
            if (this.mode === 'hide')
                return null;
            if (this.event === 'hover') {
                if (_esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_0__.DeviceDetector.isTouchDevice)
                    return 'click';
                return 'mouseenter';
            }
            return this.event;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLTrigger.prototype, "_hideEvent", {
        /** ESLTrigger 'primary' hide event */
        get: function () {
            if (this.mode === 'show')
                return null;
            if (this.event === 'hover') {
                if (_esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_0__.DeviceDetector.isTouchDevice)
                    return 'click';
                return this.mode === 'hide' ? 'mouseenter' : 'mouseleave';
            }
            return this.event;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLTrigger.prototype, "$target", {
        /** Target observable Toggleable */
        get: function () {
            return this._$target;
        },
        set: function (newPopupInstance) {
            this.unbindEvents();
            this._$target = newPopupInstance;
            if (this._$target) {
                this.bindEvents();
                this._onTargetStateChange();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLTrigger.prototype, "$a11yTarget", {
        /** Element target to setup aria attributes */
        get: function () {
            return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
        },
        enumerable: false,
        configurable: true
    });
    ESLTrigger.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.updateTargetFromSelector();
    };
    ESLTrigger.prototype.disconnectedCallback = function () {
        this.unbindEvents();
    };
    ESLTrigger.prototype.bindEvents = function () {
        if (!this.$target)
            return;
        if (this._showEvent === this._hideEvent) {
            this.attachEventListener(this._showEvent, this._onToggleEvent);
        }
        else {
            this.attachEventListener(this._showEvent, this._onShowEvent);
            this.attachEventListener(this._hideEvent, this._onHideEvent);
        }
        this.$target.addEventListener('esl:show', this._onTargetStateChange);
        this.$target.addEventListener('esl:hide', this._onTargetStateChange);
        this.addEventListener('keydown', this._onKeydown);
    };
    ESLTrigger.prototype.unbindEvents = function () {
        (this.__unsubscribers || []).forEach(function (off) { return off(); });
        if (!this.$target)
            return;
        this.$target.removeEventListener('esl:show', this._onTargetStateChange);
        this.$target.removeEventListener('esl:hide', this._onTargetStateChange);
        this.removeEventListener('keydown', this._onKeydown);
    };
    ESLTrigger.prototype.attachEventListener = function (eventName, callback) {
        var _this = this;
        if (!eventName)
            return;
        this.addEventListener(eventName, callback);
        this.__unsubscribers = this.__unsubscribers || [];
        this.__unsubscribers.push(function () { return _this.removeEventListener(eventName, callback); });
    };
    /** Update `$target` Toggleable  from `target` selector */
    ESLTrigger.prototype.updateTargetFromSelector = function () {
        if (!this.target)
            return;
        this.$target = _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_1__.TraversingQuery.first(this.target, this);
    };
    /** True if event should be ignored */
    ESLTrigger.prototype._isIgnored = function (target) {
        if (!target || !(target instanceof HTMLElement) || !this.ignore)
            return false;
        var $ignore = target.closest(this.ignore);
        // Ignore only inner elements (but do not ignore the trigger itself)
        return !!$ignore && $ignore !== this && this.contains($ignore);
    };
    /** Handles trigger open type of event */
    ESLTrigger.prototype._onShowEvent = function (event) {
        if (this._isIgnored(event.target))
            return;
        this.$target.show({
            activator: this,
            delay: this.showDelayValue,
            event: event
        });
        event.preventDefault();
    };
    /** Handles trigger hide type of event */
    ESLTrigger.prototype._onHideEvent = function (event) {
        if (this._isIgnored(event.target))
            return;
        this.$target.hide({
            activator: this,
            delay: this.hideDelayValue,
            trackHover: this.event === 'hover' && this.mode === 'toggle',
            event: event
        });
        event.preventDefault();
    };
    /** Handles trigger toggle type of event */
    ESLTrigger.prototype._onToggleEvent = function (e) {
        return (this.active ? this._onHideEvent : this._onShowEvent)(e);
    };
    /** Handles ESLTogglable state change */
    ESLTrigger.prototype._onTargetStateChange = function () {
        this.toggleAttribute('active', this.$target.open);
        var clsTarget = _esl_traversing_query_core__WEBPACK_IMPORTED_MODULE_1__.TraversingQuery.first(this.activeClassTarget, this);
        clsTarget && _esl_utils_dom_styles__WEBPACK_IMPORTED_MODULE_2__.CSSUtil.toggleClsTo(clsTarget, this.activeClass, this.active);
        this.updateA11y();
        this.$$fire('change:active');
    };
    /** Handles `keydown` event */
    ESLTrigger.prototype._onKeydown = function (event) {
        if ([_esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_3__.ENTER, _esl_utils_dom_keys__WEBPACK_IMPORTED_MODULE_3__.SPACE].includes(event.key)) {
            switch (this.mode) {
                case 'show': return this._onShowEvent(event);
                case 'hide': return this._onHideEvent(event);
                default: return this._onToggleEvent(event);
            }
        }
    };
    /** Update aria attributes */
    ESLTrigger.prototype.updateA11y = function () {
        var target = this.$a11yTarget;
        if (!target)
            return;
        target.setAttribute('aria-expanded', String(this.active));
        if (this.$target.id) {
            target.setAttribute('aria-controls', this.$target.id);
        }
    };
    Object.defineProperty(ESLTrigger.prototype, "showDelayValue", {
        /** Show delay attribute processing */
        get: function () {
            var showDelay = _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_0__.DeviceDetector.isTouchDevice ? this.touchShowDelay : this.showDelay;
            return !showDelay || isNaN(+showDelay) ? undefined : +showDelay;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ESLTrigger.prototype, "hideDelayValue", {
        /** Hide delay attribute processing */
        get: function () {
            var hideDelay = _esl_utils_environment_device_detector__WEBPACK_IMPORTED_MODULE_0__.DeviceDetector.isTouchDevice ? this.touchHideDelay : this.hideDelay;
            return !hideDelay || isNaN(+hideDelay) ? undefined : +hideDelay;
        },
        enumerable: false,
        configurable: true
    });
    ESLTrigger.is = 'esl-trigger';
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_4__.boolAttr)({ readonly: true })
    ], ESLTrigger.prototype, "active", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: '' })
    ], ESLTrigger.prototype, "activeClass", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: '' })
    ], ESLTrigger.prototype, "activeClassTarget", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'a[href]' })
    ], ESLTrigger.prototype, "ignore", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'next' })
    ], ESLTrigger.prototype, "target", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'click' })
    ], ESLTrigger.prototype, "event", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: 'toggle' })
    ], ESLTrigger.prototype, "mode", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)({ defaultValue: '' })
    ], ESLTrigger.prototype, "a11yTarget", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLTrigger.prototype, "showDelay", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLTrigger.prototype, "hideDelay", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLTrigger.prototype, "touchShowDelay", void 0);
    __decorate([
        (0,_esl_base_element_core__WEBPACK_IMPORTED_MODULE_5__.attr)()
    ], ESLTrigger.prototype, "touchHideDelay", void 0);
    __decorate([
        _esl_utils_decorators_ready__WEBPACK_IMPORTED_MODULE_6__.ready
    ], ESLTrigger.prototype, "connectedCallback", null);
    __decorate([
        _esl_utils_decorators_ready__WEBPACK_IMPORTED_MODULE_6__.ready
    ], ESLTrigger.prototype, "disconnectedCallback", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLTrigger.prototype, "_onShowEvent", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLTrigger.prototype, "_onHideEvent", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLTrigger.prototype, "_onToggleEvent", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLTrigger.prototype, "_onTargetStateChange", null);
    __decorate([
        _esl_utils_decorators_bind__WEBPACK_IMPORTED_MODULE_7__.bind
    ], ESLTrigger.prototype, "_onKeydown", null);
    ESLTrigger = __decorate([
        (0,_esl_utils_environment_export_ns__WEBPACK_IMPORTED_MODULE_8__.ExportNs)('Trigger')
    ], ESLTrigger);
    return ESLTrigger;
}(_esl_base_element_core__WEBPACK_IMPORTED_MODULE_9__.ESLBaseElement));



/***/ }),

/***/ "../src/modules/esl-utils/abstract/observable.ts":
/*!*******************************************************!*\
  !*** ../src/modules/esl-utils/abstract/observable.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Observable": function() { return /* binding */ Observable; }
/* harmony export */ });
var Observable = /** @class */ (function () {
    function Observable() {
        this._listeners = new Set();
    }
    Observable.prototype.addListener = function (listener) {
        this._listeners.add(listener);
    };
    Observable.prototype.removeListener = function (listener) {
        this._listeners.delete(listener);
    };
    Observable.prototype.fire = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._listeners.forEach(function (listener) {
            try {
                listener.apply(_this, args);
            }
            catch (e) {
                console.error(e);
            }
        });
    };
    return Observable;
}());



/***/ }),

/***/ "../src/modules/esl-utils/async/debounce.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-utils/async/debounce.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": function() { return /* binding */ debounce; }
/* harmony export */ });
/* harmony import */ var _promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./promise */ "../src/modules/esl-utils/async/promise.ts");

/**
 * Creates a debounced function that implements {@link Debounced}.
 * Debounced function delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * The func is invoked with the last arguments provided to the debounced function.
 * @param fn
 * @param [wait]
 * @returns {Function}
 */
function debounce(fn, wait) {
    if (wait === void 0) { wait = 10; }
    var timeout = null;
    var deferred = null;
    function debouncedSubject() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        deferred = deferred || _promise__WEBPACK_IMPORTED_MODULE_0__.PromiseUtils.deferred();
        (typeof timeout === 'number') && clearTimeout(timeout);
        timeout = window.setTimeout(function () {
            timeout = null;
            // fn.apply to save call context
            deferred.resolve(fn.apply(_this, args));
            deferred = null;
        }, wait);
        return deferred.promise;
    }
    function cancel() {
        (typeof timeout === 'number') && clearTimeout(timeout);
        timeout = null;
        deferred === null || deferred === void 0 ? void 0 : deferred.reject();
        deferred = null;
    }
    Object.defineProperty(debouncedSubject, 'promise', {
        get: function () { return deferred ? deferred.promise : Promise.resolve(); }
    });
    Object.defineProperty(debouncedSubject, 'cancel', {
        writable: false,
        enumerable: false,
        value: cancel
    });
    return debouncedSubject;
}


/***/ }),

/***/ "../src/modules/esl-utils/async/delayed-task.ts":
/*!******************************************************!*\
  !*** ../src/modules/esl-utils/async/delayed-task.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DelayedTask": function() { return /* binding */ DelayedTask; }
/* harmony export */ });
/**
 * Task placeholder with a single place for executing deferred task.
 * Only one task can be planed per DelayedTask instance.
 * @see put DelayedTask.put behaviour description.
 */
var DelayedTask = /** @class */ (function () {
    function DelayedTask() {
        var _this = this;
        this._fn = null;
        this._timeout = null;
        /** Execute deferred task immediately */
        this.run = function () {
            _this._timeout = null;
            _this._fn && _this._fn();
        };
    }
    Object.defineProperty(DelayedTask.prototype, "fn", {
        /** @return {Function} of currently deferred (planned) task */
        get: function () {
            return this._fn;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Cancel deferred task and planning passed {@param task}
     * @param delay - time to delay task execution
     *  - pass negative or false to execute task immediately
     *  - pass 0 to plan task to the macrotask
     *  - pass positive number x to delay task on x ms.
     * */
    DelayedTask.prototype.put = function (task, delay) {
        if (delay === void 0) { delay = false; }
        var prev = this.cancel();
        if (typeof task === 'function') {
            if (typeof delay === 'number' && delay >= 0) {
                this._fn = task;
                this._timeout = window.setTimeout(this.run, delay);
            }
            else {
                task();
            }
        }
        return prev;
    };
    /** Cancel deferred (planned) task */
    DelayedTask.prototype.cancel = function () {
        var prev = this._fn;
        (typeof this._timeout === 'number') && clearTimeout(this._timeout);
        this._fn = this._timeout = null;
        return prev;
    };
    return DelayedTask;
}());



/***/ }),

/***/ "../src/modules/esl-utils/async/promise.ts":
/*!*************************************************!*\
  !*** ../src/modules/esl-utils/async/promise.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PromiseUtils": function() { return /* binding */ PromiseUtils; }
/* harmony export */ });
/**
 * Promise utils helper class
 */
var PromiseUtils = /** @class */ (function () {
    function PromiseUtils() {
    }
    /**
     * @return {Promise} that will be resolved in {@param timeout} with optional {@param payload}
     */
    PromiseUtils.fromTimeout = function (timeout, payload) {
        return new Promise(function (resolve) {
            return setTimeout(resolve.bind(null, payload), timeout);
        });
    };
    /**
     * @return {Promise} that will be resolved by dispatching {@param event} on {@param target}
     * Or it will be rejected in {@param timeout} if it's specified
     * Optional {@param options} for addEventListener can be also specified
     */
    PromiseUtils.fromEvent = function (target, event, timeout, options) {
        return new Promise(function (resolve, reject) {
            function eventCallback(e) {
                target.removeEventListener(event, eventCallback, options);
                resolve(e);
            }
            target.addEventListener(event, eventCallback, options);
            if (typeof timeout === 'number' && timeout >= 0) {
                setTimeout(function () { return reject(new Error('Rejected by timeout')); }, timeout);
            }
        });
    };
    /**
     * Short helper to make Promise from element state marker
     * Marker should be accessible and listenable
     * @example
     * const imgReady = PromiseUtils.fromMarker(eslImage, 'ready');
     */
    PromiseUtils.fromMarker = function (target, marker, event) {
        if (target[marker])
            return Promise.resolve(target);
        return PromiseUtils.fromEvent(target, event || marker).then(function () { return target; });
    };
    /**
     * Safe wrap for Promise.resolve to use in Promise chain
     * @example
     * const resolvedPromise = rejectedPromise.catch(PromiseUtils.resolve);
     */
    PromiseUtils.resolve = function (arg) {
        return Promise.resolve(arg);
    };
    /**
     * Safe wrap for Promise.reject to use in Promise chain
     * @example
     * const rejectedPromise = resolvedPromise.then(PromiseUtils.resolve);
     */
    PromiseUtils.reject = function (arg) {
        return Promise.reject(arg);
    };
    /**
     * Call {@param callback} limited by {@param tryCount} amount of times with interval in {@param timeout} ms
     * @return {Promise} that will be resolved as soon as callback returns truthy value, or reject it by limit.
     */
    PromiseUtils.tryUntil = function (callback, tryCount, timeout) {
        if (tryCount === void 0) { tryCount = 2; }
        if (timeout === void 0) { timeout = 100; }
        return new Promise(function (resolve, reject) {
            var interval = setInterval(function () {
                var result;
                try {
                    result = callback();
                }
                catch (_a) {
                    result = undefined;
                }
                if (result || --tryCount < 0) {
                    clearInterval(interval);
                    result ? resolve(result) : reject(new Error('Rejected by limit of tries'));
                }
            }, timeout);
        });
    };
    /**
     * Create Deferred Object that wraps promise and its resolve and reject callbacks
     */
    PromiseUtils.deferred = function () {
        var reject;
        var resolve;
        // Both reject and resolve will be assigned anyway while the Promise constructing.
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        return { promise: promise, resolve: resolve, reject: reject };
    };
    return PromiseUtils;
}());



/***/ }),

/***/ "../src/modules/esl-utils/async/raf.ts":
/*!*********************************************!*\
  !*** ../src/modules/esl-utils/async/raf.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "afterNextRender": function() { return /* binding */ afterNextRender; },
/* harmony export */   "rafDecorator": function() { return /* binding */ rafDecorator; }
/* harmony export */ });
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
/**
 * Postpone action after next render
 * @param {function} callback
 */
var afterNextRender = function (callback) { return requestAnimationFrame(function () { return requestAnimationFrame(callback); }); };
/**
 * Decorate function to schedule execution after next render
 * @param {function} fn
 * @returns {function} - decorated function
 */
var rafDecorator = function (fn) {
    var lastArgs = null; // null if no calls requested
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (lastArgs === null) {
            requestAnimationFrame(function () {
                lastArgs && fn.call.apply(fn, __spreadArray([_this], __read(lastArgs)));
                lastArgs = null;
            });
        }
        lastArgs = args;
    };
};


/***/ }),

/***/ "../src/modules/esl-utils/decorators/bind.ts":
/*!***************************************************!*\
  !*** ../src/modules/esl-utils/decorators/bind.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bind": function() { return /* binding */ bind; }
/* harmony export */ });
var BINDINGS_STORE_KEY = '__fnBindings__';
/** Decorator "bind" allows to bind prototype method context to class instance */
// eslint-disable-next-line @typescript-eslint/ban-types
function bind(target, propertyKey, descriptor) {
    // Validation check
    if (!descriptor || (typeof descriptor.value !== 'function')) {
        throw new TypeError('Only class methods can be decorated via @bind');
    }
    // Original function
    var fn = descriptor.value;
    return {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        get: function () {
            // Accessing via prototype returns original function
            // If the constructor property is in the context then it's not an instance
            if (!this || this === target || Object.hasOwnProperty.call(this, 'constructor')) {
                return fn;
            }
            // Bounded functions store
            var bindings = this[BINDINGS_STORE_KEY];
            if (!bindings) {
                bindings = this[BINDINGS_STORE_KEY] = new WeakMap();
            }
            // Store binding if it does not exist
            if (!bindings.has(fn)) {
                bindings.set(fn, fn.bind(this));
            }
            // Return binding
            return bindings.get(fn);
        },
        set: function (value) {
            Object.defineProperty(this, propertyKey, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            });
        }
    };
}


/***/ }),

/***/ "../src/modules/esl-utils/decorators/memoize.ts":
/*!******************************************************!*\
  !*** ../src/modules/esl-utils/decorators/memoize.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "memoize": function() { return /* binding */ memoize; }
/* harmony export */ });
/* harmony import */ var _misc_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../misc/object */ "../src/modules/esl-utils/misc/object.ts");
/* harmony import */ var _misc_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../misc/memoize */ "../src/modules/esl-utils/misc/memoize.ts");


/**
 * Memoization decorator helper.
 * @see memoizeFn Original memoizeFn function decorator.
 */
function memoize(hashFn) {
    if (hashFn === void 0) { hashFn = _misc_memoize__WEBPACK_IMPORTED_MODULE_0__.defaultArgsHashFn; }
    return function (target, prop, descriptor) {
        var isPrototype = Object.hasOwnProperty.call(target, 'constructor');
        if (descriptor && typeof descriptor.value === 'function') {
            descriptor.value = isPrototype ?
                memoizeMember(descriptor.value, prop, false, hashFn) :
                (0,_misc_memoize__WEBPACK_IMPORTED_MODULE_0__.memoizeFn)(descriptor.value, hashFn);
        }
        else if (descriptor && typeof descriptor.get === 'function') {
            descriptor.get = isPrototype ?
                memoizeMember(descriptor.get, prop, true, hashFn) :
                (0,_misc_memoize__WEBPACK_IMPORTED_MODULE_0__.memoizeFn)(descriptor.get, hashFn);
        }
        else {
            throw new TypeError('Only get accessors or class methods can be decorated via @memoize');
        }
    };
}
/** Cache memo function in the current context on call */
function memoizeMember(originalMethod, prop, isGetter, hashFn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var memo = (0,_misc_memoize__WEBPACK_IMPORTED_MODULE_0__.memoizeFn)(originalMethod, hashFn);
        Object.defineProperty(this, prop, isGetter ? { get: memo } : { value: memo });
        return memo.apply(this, args);
    };
}
/**
 * Clear memoization cache for passed target and property.
 * Accepts not own properties.
 */
memoize.clear = function (target, property) {
    var clearFn = null;
    var desc = (0,_misc_object__WEBPACK_IMPORTED_MODULE_1__.getPropertyDescriptor)(target, property);
    if (desc && typeof desc.value === 'function')
        clearFn = desc.value.clear;
    if (desc && typeof desc.get === 'function')
        clearFn = desc.get.clear;
    (typeof clearFn === 'function') && clearFn();
};


/***/ }),

/***/ "../src/modules/esl-utils/decorators/ready.ts":
/*!****************************************************!*\
  !*** ../src/modules/esl-utils/decorators/ready.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ready": function() { return /* binding */ ready; }
/* harmony export */ });
/* harmony import */ var _dom_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/ready */ "../src/modules/esl-utils/dom/ready.ts");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};

/** Defer method execution to the next task with dom ready state precondition */
function ready(target, propertyKey, descriptor) {
    if (!descriptor || typeof descriptor.value !== 'function') {
        throw new TypeError('Only class methods can be decorated via document ready decorator');
    }
    var fn = descriptor.value;
    descriptor.value = function () {
        var _this = this;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        (0,_dom_ready__WEBPACK_IMPORTED_MODULE_0__.onDocumentReady)(function () { return fn.call.apply(fn, __spreadArray([_this], __read(arg))); });
    };
}


/***/ }),

/***/ "../src/modules/esl-utils/dom/events.ts":
/*!**********************************************!*\
  !*** ../src/modules/esl-utils/dom/events.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventUtils": function() { return /* binding */ EventUtils; }
/* harmony export */ });
var EventUtils = /** @class */ (function () {
    function EventUtils() {
    }
    /**
     * Dispatch custom event.
     * Event bubbles and is cancelable by default, use {@param eventInit} to override that.
     * @param el - element target
     * @param eventName - event name
     * @param [eventInit] - custom event init. See {@link CustomEventInit}
     */
    EventUtils.dispatch = function (el, eventName, eventInit) {
        var init = Object.assign({
            bubbles: true,
            composed: true,
            cancelable: true
        }, eventInit || {});
        return el.dispatchEvent(new CustomEvent(eventName, init));
    };
    /** Get original CustomEvent source */
    EventUtils.source = function (e) {
        var path = (e.composedPath && e.composedPath());
        return path ? path[0] : e.target;
    };
    /** Normalize TouchEvent or PointerEvent */
    EventUtils.normalizeTouchPoint = function (event) {
        var source = (event instanceof TouchEvent) ? event.changedTouches[0] : event;
        return {
            x: source.pageX,
            y: source.pageY
        };
    };
    /** Normalize MouseEvent */
    EventUtils.normalizeCoordinates = function (event, elem) {
        var props = elem.getBoundingClientRect();
        var top = props.top + window.pageYOffset;
        var left = props.left + window.pageXOffset;
        return {
            x: event.pageX - left,
            y: event.pageY - top
        };
    };
    return EventUtils;
}());



/***/ }),

/***/ "../src/modules/esl-utils/dom/keys.ts":
/*!********************************************!*\
  !*** ../src/modules/esl-utils/dom/keys.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TAB": function() { return /* binding */ TAB; },
/* harmony export */   "ENTER": function() { return /* binding */ ENTER; },
/* harmony export */   "ESC": function() { return /* binding */ ESC; },
/* harmony export */   "SPACE": function() { return /* binding */ SPACE; },
/* harmony export */   "PAUSE": function() { return /* binding */ PAUSE; },
/* harmony export */   "END": function() { return /* binding */ END; },
/* harmony export */   "HOME": function() { return /* binding */ HOME; },
/* harmony export */   "PAGE_UP": function() { return /* binding */ PAGE_UP; },
/* harmony export */   "PAGE_DOWN": function() { return /* binding */ PAGE_DOWN; },
/* harmony export */   "ARROW_LEFT": function() { return /* binding */ ARROW_LEFT; },
/* harmony export */   "ARROW_UP": function() { return /* binding */ ARROW_UP; },
/* harmony export */   "ARROW_RIGHT": function() { return /* binding */ ARROW_RIGHT; },
/* harmony export */   "ARROW_DOWN": function() { return /* binding */ ARROW_DOWN; }
/* harmony export */ });
var TAB = 'Tab';
var ENTER = 'Enter';
var ESC = 'Escape';
var SPACE = ' ';
var PAUSE = 'Pause';
var END = 'End';
var HOME = 'Home';
var PAGE_UP = 'PageUp';
var PAGE_DOWN = 'PageDown';
var ARROW_LEFT = 'ArrowLeft';
var ARROW_UP = 'ArrowUp';
var ARROW_RIGHT = 'ArrowRight';
var ARROW_DOWN = 'ArrowDown';


/***/ }),

/***/ "../src/modules/esl-utils/dom/ready.ts":
/*!*********************************************!*\
  !*** ../src/modules/esl-utils/dom/ready.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onDocumentReady": function() { return /* binding */ onDocumentReady; }
/* harmony export */ });
/**
 * Execute callback in bounds of the next task with dom ready state precondition
 */
function onDocumentReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function fn() {
            document.removeEventListener('DOMContentLoaded', fn);
            setTimeout(function () { return callback(); });
        });
    }
    else {
        setTimeout(function () { return callback(); });
    }
}


/***/ }),

/***/ "../src/modules/esl-utils/dom/rtl.ts":
/*!*******************************************!*\
  !*** ../src/modules/esl-utils/dom/rtl.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RTLUtils": function() { return /* binding */ RTLUtils; }
/* harmony export */ });
/* harmony import */ var _environment_export_ns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../environment/export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
/* harmony import */ var _decorators_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../decorators/memoize */ "../src/modules/esl-utils/decorators/memoize.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var RTLUtils = /** @class */ (function () {
    function RTLUtils() {
    }
    /** Check if the element in a RTL direction context */
    RTLUtils.isRtl = function (el) {
        if (el === void 0) { el = document.body; }
        var parent = el.closest('[dir]');
        return (parent === null || parent === void 0 ? void 0 : parent.dir) === 'rtl';
    };
    Object.defineProperty(RTLUtils, "scrollType", {
        /**
         * @returns {ScrollType} RTL scroll type
         * Lazy, memoized.
         */
        get: function () {
            var scrollType = 'default';
            var el = createDummyEl();
            document.body.appendChild(el);
            if (el.scrollLeft <= 0) {
                el.scrollLeft = 2;
                scrollType = el.scrollLeft < 2 ? 'negative' : 'reverse';
            }
            document.body.removeChild(el);
            return scrollType;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        (0,_decorators_memoize__WEBPACK_IMPORTED_MODULE_0__.memoize)()
    ], RTLUtils, "scrollType", null);
    RTLUtils = __decorate([
        (0,_environment_export_ns__WEBPACK_IMPORTED_MODULE_1__.ExportNs)('RTLUtils')
    ], RTLUtils);
    return RTLUtils;
}());

/** Creates the dummy test element with a horizontal scroll presented */
function createDummyEl() {
    var el = document.createElement('div');
    el.appendChild(document.createTextNode('ESL!'));
    el.dir = 'rtl';
    Object.assign(el.style, {
        position: 'absolute',
        top: '-1000px',
        width: '4px',
        height: '1px',
        fontSize: '14px',
        overflow: 'scroll'
    });
    return el;
}


/***/ }),

/***/ "../src/modules/esl-utils/dom/script.ts":
/*!**********************************************!*\
  !*** ../src/modules/esl-utils/dom/script.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadScript": function() { return /* binding */ loadScript; }
/* harmony export */ });
/**
 * Creates new async script tag by id and src
 */
var createAsyncScript = function (id, src) {
    var script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    return script;
};
/**
 * Common function that loads script async
 * @param {string} id - unique script id that is used as a marker to prevent future load
 * @param {string} src - script src (url) to load
 */
function loadScript(id, src) {
    return new Promise(function (resolve, reject) {
        var script = (document.getElementById(id) || createAsyncScript(id, src));
        var state = script.getAttribute('state');
        switch (state) {
            case 'success':
                resolve(new Event('load'));
                break;
            case 'error':
                reject(new Event('error'));
                break;
            default:
                script.addEventListener('load', function (e) {
                    script.setAttribute('state', 'success');
                    resolve(e);
                });
                script.addEventListener('error', function (e) {
                    script.setAttribute('state', 'error');
                    reject(e);
                });
        }
        if (!script.parentNode) {
            var firstScriptTag = document.querySelector('script') || document.querySelector('head title');
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
            }
            else {
                reject('Page document structure is incorrect');
            }
        }
    });
}


/***/ }),

/***/ "../src/modules/esl-utils/dom/scroll.ts":
/*!**********************************************!*\
  !*** ../src/modules/esl-utils/dom/scroll.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScrollUtility": function() { return /* binding */ ScrollUtility; }
/* harmony export */ });
var $html = document.documentElement;
var initiatorSet = new Set();
var ScrollUtility = /** @class */ (function () {
    function ScrollUtility() {
    }
    /**
     * Check vertical scroll based on content height
     * */
    ScrollUtility.hasVerticalScroll = function (target) {
        if (target === void 0) { target = $html; }
        return target.scrollHeight > target.clientHeight;
    };
    /**
     * Disable scroll on the page.
     * @param [strategy] - to make scroll visually disabled
     * */
    ScrollUtility.lock = function (strategy) {
        var hasScroll = ScrollUtility.hasVerticalScroll();
        if (strategy && strategy !== 'none' && hasScroll) {
            $html.classList.add("esl-" + strategy + "-scroll");
        }
        $html.classList.add('esl-disable-scroll');
    };
    /**
     * Enable scroll on the page.
     * */
    ScrollUtility.unlock = function () {
        $html.classList.remove('esl-disable-scroll', 'esl-pseudo-scroll', 'esl-native-scroll');
    };
    /**
     * Disable scroll on the page.
     * @param initiator - object to associate request with
     * @param [strategy] - to make scroll visually disabled
     *
     * TODO: currently requests with different strategy is not taken into account
     * */
    ScrollUtility.requestLock = function (initiator, strategy) {
        initiator && initiatorSet.add(initiator);
        (initiatorSet.size > 0) && ScrollUtility.lock(strategy);
    };
    /**
     * Enable scroll on the page in case it was requested with given initiator.
     * @param initiator - object to associate request with
     * @param [strategy] - to make scroll visually disabled
     * */
    ScrollUtility.requestUnlock = function (initiator, strategy) {
        initiator && initiatorSet.delete(initiator);
        (initiatorSet.size === 0) && ScrollUtility.unlock();
    };
    return ScrollUtility;
}());



/***/ }),

/***/ "../src/modules/esl-utils/dom/styles.ts":
/*!**********************************************!*\
  !*** ../src/modules/esl-utils/dom/styles.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSUtil": function() { return /* binding */ CSSUtil; }
/* harmony export */ });
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
/** CSS manipulation utilities. */
var CSSUtil = /** @class */ (function () {
    function CSSUtil() {
    }
    /** Splitting passed token string into CSS class names array. */
    CSSUtil.splitTokens = function (tokenString) {
        return (tokenString || '').split(' ').filter(function (str) { return !!str; });
    };
    /**
     * Add all classes from the class string to the element.
     * Class string can be nullable or contain multiple classes separated by space.
     * */
    CSSUtil.addCls = function (el, cls) {
        var _a;
        var tokens = CSSUtil.splitTokens(cls);
        tokens.length && (_a = el.classList).add.apply(_a, __spreadArray([], __read(tokens)));
    };
    /**
     * Remove all classes from the class string to the element.
     * Class string can be nullable or contain multiple classes separated by space.
     * */
    CSSUtil.removeCls = function (el, cls) {
        var _a;
        var tokens = CSSUtil.splitTokens(cls);
        tokens.length && (_a = el.classList).remove.apply(_a, __spreadArray([], __read(tokens)));
    };
    /**
     * Toggle all classes from the class string on the element to the passed state.
     * Class string can be nullable or contain multiple classes separated by space.
     * */
    CSSUtil.toggleClsTo = function (el, cls, state) {
        (state ? CSSUtil.addCls : CSSUtil.removeCls)(el, cls);
    };
    return CSSUtil;
}());



/***/ }),

/***/ "../src/modules/esl-utils/dom/traversing.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-utils/dom/traversing.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TraversingUtils": function() { return /* binding */ TraversingUtils; }
/* harmony export */ });
var TraversingUtils = /** @class */ (function () {
    function TraversingUtils() {
    }
    /**
     * Check that {@param nodeA} and {@param nodeB} is from the same tree path.
     */
    TraversingUtils.isRelative = function (nodeA, nodeB) {
        return nodeA && nodeB && (nodeA.contains(nodeB) || nodeB.contains(nodeA));
    };
    /**
     * Find closest parent node of {@param node} by {@param predicate}.
     * Optional {@param skipSelf} to skip initial node
     */
    TraversingUtils.closestBy = function (node, predicate, skipSelf) {
        if (skipSelf === void 0) { skipSelf = false; }
        var current = skipSelf && node ? node.parentNode : node;
        while (current) {
            if (predicate(current))
                return current;
            current = current.parentNode;
        }
        return null;
    };
    /**
     * Create function that find next dom element, that matches selector, in the sequence declared by {@param next} function
     */
    TraversingUtils.createSequenceFinder = function (next) {
        return function (base, sel) {
            for (var target = next(base); target; target = next(target)) {
                if (!sel || target.matches(sel))
                    return target;
            }
            return null;
        };
    };
    /** @return Array of all matching elements in subtree or empty array*/
    TraversingUtils.findAll = function (base, sel) {
        return sel ? Array.from(base.querySelectorAll(sel)) : [base];
    };
    /** @return Array of all matching children or empty array*/
    TraversingUtils.findChildren = function (base, sel) {
        return Array.from(base.children).filter(function (el) { return !sel || el.matches(sel); });
    };
    /** @return first matching next sibling or null*/
    TraversingUtils.findNext = TraversingUtils.createSequenceFinder(function (el) { return el.nextElementSibling; });
    /** @return first matching previous sibling or null*/
    TraversingUtils.findPrev = TraversingUtils.createSequenceFinder(function (el) { return el.previousElementSibling; });
    /** @return first matching parent or null*/
    TraversingUtils.findParent = TraversingUtils.createSequenceFinder(function (el) { return el.parentElement; });
    return TraversingUtils;
}());



/***/ }),

/***/ "../src/modules/esl-utils/environment/device-detector.ts":
/*!***************************************************************!*\
  !*** ../src/modules/esl-utils/environment/device-detector.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeviceDetector": function() { return /* binding */ DeviceDetector; }
/* harmony export */ });
/* harmony import */ var _export_ns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./export-ns */ "../src/modules/esl-utils/environment/export-ns.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ua = window.navigator.userAgent;
var vendor = window.navigator.vendor;
/**
 * Device detection utility
 * @readonly
 */
var DeviceDetector = /** @class */ (function () {
    function DeviceDetector() {
    }
    DeviceDetector_1 = DeviceDetector;
    Object.defineProperty(DeviceDetector, "isTouchDevice", {
        get: function () {
            if (('ontouchstart' in window) || 'TouchEvent ' in window || 'DocumentTouch' in window && document instanceof Touch) {
                return true;
            }
            return DeviceDetector_1.touchMQ.matches;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DeviceDetector, "TOUCH_EVENTS", {
        get: function () {
            var isTouch = DeviceDetector_1.isTouchDevice;
            return {
                START: isTouch ? 'touchstart' : 'pointerdown',
                MOVE: isTouch ? 'touchmove' : 'pointermove',
                END: isTouch ? 'touchend' : 'pointerup'
            };
        },
        enumerable: false,
        configurable: true
    });
    var DeviceDetector_1;
    // IE Detection
    DeviceDetector.isTrident = /trident/i.test(ua);
    DeviceDetector.isIE = DeviceDetector_1.isTrident;
    // Edge Detection
    DeviceDetector.isEdgeHTML = /edg([ea]|ios)/i.test(ua);
    DeviceDetector.isBlinkEdge = /\sedg\//i.test(ua);
    DeviceDetector.isEdge = DeviceDetector_1.isEdgeHTML || DeviceDetector_1.isBlinkEdge;
    // Gecko
    DeviceDetector.isGecko = /gecko/i.test(ua) && !/like gecko/i.test(ua);
    DeviceDetector.isFirefox = /firefox|iceweasel|fxios/i.test(ua);
    // Opera / Chrome
    DeviceDetector.isOpera = /(?:^opera.+?version|opr)/.test(ua);
    DeviceDetector.isChrome = !DeviceDetector_1.isOpera && /google inc/.test(vendor);
    // Webkit
    DeviceDetector.isWebkit = /(apple)?webkit/i.test(ua);
    // Safari
    DeviceDetector.isSafari = DeviceDetector_1.isWebkit && /^((?!chrome|android).)*safari/i.test(ua);
    // Blink
    DeviceDetector.isBlink = DeviceDetector_1.isWebkit && !DeviceDetector_1.isSafari;
    // Bot detection
    DeviceDetector.isBot = /Chrome-Lighthouse|Google Page Speed Insights/i.test(ua);
    // Mobile
    DeviceDetector.isAndroid = /Android/i.test(ua);
    DeviceDetector.isMobileIOS = /iPad|iPhone|iPod/i.test(ua);
    DeviceDetector.isLegacyMobile = /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    DeviceDetector.isMobile = DeviceDetector_1.isMobileIOS || DeviceDetector_1.isAndroid || DeviceDetector_1.isLegacyMobile;
    DeviceDetector.isMobileSafari = DeviceDetector_1.isMobileIOS && DeviceDetector_1.isWebkit && /CriOS/i.test(ua);
    // Touch Detection
    DeviceDetector.touchMQ = (function () {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mediaQuery = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return matchMedia(mediaQuery);
    })();
    DeviceDetector = DeviceDetector_1 = __decorate([
        (0,_export_ns__WEBPACK_IMPORTED_MODULE_0__.ExportNs)('DeviceDetector')
    ], DeviceDetector);
    return DeviceDetector;
}());



/***/ }),

/***/ "../src/modules/esl-utils/environment/export-ns.ts":
/*!*********************************************************!*\
  !*** ../src/modules/esl-utils/environment/export-ns.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "exportNs": function() { return /* binding */ exportNs; },
/* harmony export */   "ExportNs": function() { return /* binding */ ExportNs; }
/* harmony export */ });
var NS_NAME = 'ESL';
/**
 * Nested declaration helper
 */
function define(root, name, value) {
    return name.split('.').reduce(function (obj, key, index, parts) {
        if (parts.length === index + 1) {
            return (obj[key] = obj[key] || value);
        }
        var type = typeof obj[key];
        if (type !== 'undefined' && type !== 'object' && type !== 'function') {
            throw new Error("Can not define " + value + " on " + name);
        }
        return (obj[key] = obj[key] || {});
    }, root);
}
/**
 * Method to manually declare key in library namespace
 * See {@link ExportNs} decorator for details
 */
var exportNs = function (name, module) {
    if (!(NS_NAME in window))
        return;
    define(window[NS_NAME], name, module);
};
/**
 * Decorator to delare function or class in a global ns
 * @param {string} name - key path to declare in ESL global ns
 * NOTE: path parts should be separated by dots
 * @example @Export('Package.Component')
 * NOTE: in case declaration contains components-packages, their origins will be mixed with declaration in a Runtime
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function ExportNs(name) {
    return function (module) { return exportNs(name || module.name, module); };
}


/***/ }),

/***/ "../src/modules/esl-utils/fixes/ie-fixes.ts":
/*!**************************************************!*\
  !*** ../src/modules/esl-utils/fixes/ie-fixes.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createZIndexIframe": function() { return /* binding */ createZIndexIframe; }
/* harmony export */ });
/** Fix IE browser to allow to display alert under iframe */
function createZIndexIframe() {
    var iframe = document.createElement('iframe');
    iframe.className = 'ie-zindex-fix';
    iframe.src = 'about:blank';
    return iframe;
}


/***/ }),

/***/ "../src/modules/esl-utils/misc/array.ts":
/*!**********************************************!*\
  !*** ../src/modules/esl-utils/misc/array.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tuple": function() { return /* binding */ tuple; },
/* harmony export */   "flat": function() { return /* binding */ flat; },
/* harmony export */   "wrap": function() { return /* binding */ wrap; },
/* harmony export */   "uniq": function() { return /* binding */ uniq; }
/* harmony export */ });
/** Split array into tuples */
var tuple = function (arr) { return arr.reduce(function (acc, el) {
    if (acc.length === 0 || acc[acc.length - 1].length >= 2)
        acc.push([]);
    acc[acc.length - 1].push(el);
    return acc;
}, []); };
/** Flat array */
var flat = function (arr) {
    return arr.reduce(function (acc, el) { return el ? acc.concat(el) : acc; }, []);
};
/** Wrap to array */
var wrap = function (arr) {
    if (arr === undefined || arr === null)
        return [];
    if (Array.isArray(arr))
        return arr;
    return [arr];
};
/** Make array values unique */
var uniq = function (arr) {
    var result = [];
    var set = new Set();
    arr.forEach(function (item) { return set.add(item); });
    set.forEach(function (item) { return result.push(item); });
    return result;
};


/***/ }),

/***/ "../src/modules/esl-utils/misc/format.ts":
/*!***********************************************!*\
  !*** ../src/modules/esl-utils/misc/format.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toKebabCase": function() { return /* binding */ toKebabCase; },
/* harmony export */   "toCamelCase": function() { return /* binding */ toCamelCase; },
/* harmony export */   "unwrapParenthesis": function() { return /* binding */ unwrapParenthesis; },
/* harmony export */   "parseAspectRatio": function() { return /* binding */ parseAspectRatio; },
/* harmony export */   "evaluate": function() { return /* binding */ evaluate; },
/* harmony export */   "format": function() { return /* binding */ format; }
/* harmony export */ });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object */ "../src/modules/esl-utils/misc/object.ts");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};

/** Convert string to kebab-case notation */
var toKebabCase = function (str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
};
/** Convert string to camelCase notation */
var toCamelCase = function (str) {
    return str.trim().replace(/[\s-,_]+([a-zA-Z0-9]?)/g, function (match, word) { return word.toUpperCase(); });
};
/** Unwrap string from parenthesis */
var unwrapParenthesis = function (str) {
    return str.trim().replace(/^\((.*)\)$/, '$1').trim();
};
/**
 * Common function that returns coefficient aspect ratio
 * Supported formats: w:h, w/h, coefficient
 * @example '16:9', '16/9', '1.77'
 * @param str - string to parse
 * @return aspect ratio coefficient
 */
function parseAspectRatio(str) {
    var _a = __read(str.split(/[:/]/), 2), w = _a[0], h = _a[1];
    if (typeof h !== 'undefined')
        return +w / +h;
    return +w || 0;
}
/** Evaluate passed string or returns `defaultValue` */
function evaluate(str, defaultValue) {
    try {
        return str ? (new Function("return " + str))() : defaultValue;
    }
    catch (e) {
        console.warn('Cannot parse value ', str, e);
        return defaultValue;
    }
}
/** Replace '{key}' patterns in the string from the source object */
function format(str, source) {
    return str.replace(/{([\w.]+)}/g, function (match, key) {
        var val = (0,_object__WEBPACK_IMPORTED_MODULE_0__.get)(source, key);
        return val === undefined ? match : val;
    });
}


/***/ }),

/***/ "../src/modules/esl-utils/misc/memoize.ts":
/*!************************************************!*\
  !*** ../src/modules/esl-utils/misc/memoize.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "memoizeFn": function() { return /* binding */ memoizeFn; },
/* harmony export */   "defaultArgsHashFn": function() { return /* binding */ defaultArgsHashFn; }
/* harmony export */ });
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
/**
 * Memoization decorator function. Caches the original function result according to hash generated from arguments.
 * In case the hash function returns `undefined` value will not be memoized.
 * @see MemoHashFn Hash function signature.
 */
function memoizeFn(fn, hashFn) {
    if (hashFn === void 0) { hashFn = defaultArgsHashFn; }
    function memo() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key = hashFn.apply(void 0, __spreadArray([], __read(args)));
        if (key !== null && typeof key !== 'string') {
            console.warn("Can't cache value for " + fn.name + " call.");
            return fn.apply(this, args);
        }
        if (!memo.cache.has(key)) {
            memo.cache.set(key, fn.apply(this, args));
        }
        return memo.cache.get(key);
    }
    memo.cache = new Map();
    memo.clear = function () { return memo.cache.clear(); };
    return memo;
}
/**
 * Default arguments hash function.
 * Supports only 0-1 arguments with a primitive type.
 */
function defaultArgsHashFn() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 0)
        return null;
    if (args.length > 1)
        return;
    if (typeof args[0] !== 'string' && typeof args[0] !== 'number' && typeof args[0] !== 'boolean')
        return;
    return String(args[0]);
}


/***/ }),

/***/ "../src/modules/esl-utils/misc/object.ts":
/*!***********************************************!*\
  !*** ../src/modules/esl-utils/misc/object.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isObject": function() { return /* binding */ isObject; },
/* harmony export */   "isObjectLike": function() { return /* binding */ isObjectLike; },
/* harmony export */   "deepCompare": function() { return /* binding */ deepCompare; },
/* harmony export */   "getPropertyDescriptor": function() { return /* binding */ getPropertyDescriptor; },
/* harmony export */   "defined": function() { return /* binding */ defined; },
/* harmony export */   "set": function() { return /* binding */ set; },
/* harmony export */   "get": function() { return /* binding */ get; }
/* harmony export */ });
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var isObject = function (obj) { return obj && typeof obj === 'object'; };
var isObjectLike = function (obj) { return isObject(obj) || typeof obj === 'function'; };
/** Deep object compare */
function deepCompare(obj1, obj2) {
    if (Object.is(obj1, obj2))
        return true;
    if (typeof obj1 !== typeof obj2)
        return false;
    if (isObject(obj1) && isObject(obj2)) {
        var keys1 = Object.keys(obj1);
        var keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length)
            return false;
        return !keys1.some(function (key) { return !deepCompare(obj1[key], obj2[key]); });
    }
    return false;
}
/** Find the closest property descriptor */
function getPropertyDescriptor(o, prop) {
    var proto = o;
    while (proto) {
        var desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc)
            return desc;
        proto = Object.getPrototypeOf(proto);
    }
}
/**
 * Find the first defined param
 */
function defined() {
    var e_1, _a;
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    try {
        for (var params_1 = __values(params), params_1_1 = params_1.next(); !params_1_1.done; params_1_1 = params_1.next()) {
            var param = params_1_1.value;
            if (param !== undefined)
                return param;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (params_1_1 && !params_1_1.done && (_a = params_1.return)) _a.call(params_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
/**
 * Set object property using "path" key
 *
 * @param target - object
 * @param path - key path, use '.' as delimiter
 * @param value - value of property
 */
var set = function (target, path, value) {
    var parts = (path || '').split('.');
    var depth = parts.length - 1;
    parts.reduce(function (cur, key, index) {
        if (index === depth)
            return cur[key] = value;
        return cur[key] = isObjectLike(cur[key]) ? cur[key] : {};
    }, target);
};
/**
 * Gets object property using "path" key
 * Creates empty object if sub-key value is not presented.
 *
 * @param data - object
 * @param path - key path, use '.' as delimiter
 * @param defaultValue - default
 */
var get = function (data, path, defaultValue) {
    var parts = (path || '').split('.');
    var result = parts.reduce(function (curr, key) {
        if (isObjectLike(curr))
            return curr[key];
        return undefined;
    }, data);
    return typeof result === 'undefined' ? defaultValue : result;
};


/***/ }),

/***/ "../src/modules/esl-utils/misc/uid.ts":
/*!********************************************!*\
  !*** ../src/modules/esl-utils/misc/uid.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateUId": function() { return /* binding */ generateUId; }
/* harmony export */ });
/** Generate unique id */
function generateUId() {
    var fp = Date.now().toString(32);
    var sp = Math.round(Math.random() * 1024 * 1024).toString(32);
    return fp + '-' + sp;
}


/***/ }),

/***/ "../src/modules/lib.ts":
/*!*****************************!*\
  !*** ../src/modules/lib.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Define global namespace
if (!('ESL' in window)) {
    Object.defineProperty(window, 'ESL', { value: {} });
}



/***/ }),

/***/ "../src/polyfills/es5-target-shim.ts":
/*!*******************************************!*\
  !*** ../src/polyfills/es5-target-shim.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimES5ElementConstructor": function() { return /* binding */ shimES5ElementConstructor; }
/* harmony export */ });
// Shim for modern browsers with ES6 class syntax support
// Shim based on https://github.com/webcomponents/polyfills/blob/master/packages/custom-elements/ts_src/custom-elements.ts
function shimES5ElementConstructor(BuiltInHTMLElement) {
    if (
    // No Reflect, no classes, no need for shim because native custom elements require ES2015 classes or Reflect.
    window.Reflect === undefined || window.customElements === undefined ||
        // The webcomponentsjs custom elements polyfill doesn't require ES2015-compatible construction (`super()` or `Reflect.construct`).
        window.customElements.polyfillWrapFlushCallback) {
        return;
    }
    Object.defineProperty(window, BuiltInHTMLElement.name, {
        value: function HTMLElement() {
            return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
        }
    });
    var Element = window[BuiltInHTMLElement.name];
    Element.prototype = BuiltInHTMLElement.prototype;
    Element.prototype.constructor = Element;
    Object.setPrototypeOf(Element, BuiltInHTMLElement);
}
shimES5ElementConstructor(HTMLElement);


/***/ }),

/***/ "../src/polyfills/list/dom.element.toggleAttribute.ts":
/*!************************************************************!*\
  !*** ../src/polyfills/list/dom.element.toggleAttribute.ts ***!
  \************************************************************/
/***/ (function() {


/**
 * Group: DOM API shims
 * Target Browsers: IE11, Edge < 18, Safari < 13
 * Element.toggleAttribute polyfill
 */
if (!Element.prototype.toggleAttribute) {
    Element.prototype.toggleAttribute = function (name, force) {
        var has = this.hasAttribute(name);
        var state = force === void 0 ? !has : !!force;
        if (has !== state) {
            (state) ? this.setAttribute(name, '') : this.removeAttribute(name);
        }
        return state;
    };
}


/***/ }),

/***/ "../src/polyfills/list/dom.keyboard.key.ts":
/*!*************************************************!*\
  !*** ../src/polyfills/list/dom.keyboard.key.ts ***!
  \*************************************************/
/***/ (function() {


/**
 * Group: DOM API shims
 * Target Browsers: IE11, Edge < 18
 * KeyboardEvent.prototype.key shim to normalize key values to W3C spec
 * Based on published shim https://www.npmjs.com/package/shim-keyboard-event-key
 */
(function (KeyboardEventProto) {
    var desc = Object.getOwnPropertyDescriptor(KeyboardEventProto, 'key');
    if (!desc)
        return;
    var keyMap = {
        Win: 'Meta',
        Scroll: 'ScrollLock',
        Spacebar: ' ',
        Down: 'ArrowDown',
        Left: 'ArrowLeft',
        Right: 'ArrowRight',
        Up: 'ArrowUp',
        Del: 'Delete',
        Apps: 'ContextMenu',
        Esc: 'Escape',
        Multiply: '*',
        Add: '+',
        Subtract: '-',
        Decimal: '.',
        Divide: '/',
    };
    Object.defineProperty(KeyboardEventProto, 'key', {
        get: function () {
            var key = desc.get.call(this);
            return Object.prototype.hasOwnProperty.call(keyMap, key) ? keyMap[key] : key;
        },
    });
})(KeyboardEvent.prototype);


/***/ }),

/***/ "../src/polyfills/list/dom.node.isConnected.ts":
/*!*****************************************************!*\
  !*** ../src/polyfills/list/dom.node.isConnected.ts ***!
  \*****************************************************/
/***/ (function() {


/**
 * Group: DOM polyfills
 * Target browsers: IE11, Edge <= 18
 * Node.isConnected polyfill
 */
if (!('isConnected' in Node.prototype)) {
    Object.defineProperty(Node.prototype, 'isConnected', {
        get: function () {
            return !this.ownerDocument ||
                // eslint-disable-next-line no-bitwise
                !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
        }
    });
}


/***/ }),

/***/ "../src/polyfills/polyfills.es6.ts":
/*!*****************************************!*\
  !*** ../src/polyfills/polyfills.es6.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _list_dom_node_isConnected__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list/dom.node.isConnected */ "../src/polyfills/list/dom.node.isConnected.ts");
/* harmony import */ var _list_dom_node_isConnected__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_list_dom_node_isConnected__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _list_dom_keyboard_key__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list/dom.keyboard.key */ "../src/polyfills/list/dom.keyboard.key.ts");
/* harmony import */ var _list_dom_keyboard_key__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_list_dom_keyboard_key__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _list_dom_element_toggleAttribute__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./list/dom.element.toggleAttribute */ "../src/polyfills/list/dom.element.toggleAttribute.ts");
/* harmony import */ var _list_dom_element_toggleAttribute__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_list_dom_element_toggleAttribute__WEBPACK_IMPORTED_MODULE_2__);





/***/ }),

/***/ "../src/polyfills/polyfills.validate.ts":
/*!**********************************************!*\
  !*** ../src/polyfills/polyfills.validate.ts ***!
  \**********************************************/
/***/ (function() {


if (!('customElements' in window)) {
    throw new Error('Browser is not support customElements, load polyfills before');
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*************************!*\
  !*** ./src/localdev.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_polyfills_es5_target_shim__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/polyfills/es5-target-shim */ "../src/polyfills/es5-target-shim.ts");
/* harmony import */ var _src_polyfills_polyfills_es6__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/polyfills/polyfills.es6 */ "../src/polyfills/polyfills.es6.ts");
/* harmony import */ var _src_polyfills_polyfills_validate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/polyfills/polyfills.validate */ "../src/polyfills/polyfills.validate.ts");
/* harmony import */ var _src_polyfills_polyfills_validate__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_src_polyfills_polyfills_validate__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_back_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/back-button */ "./src/common/back-button.ts");
/* harmony import */ var _common_back_button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_common_back_button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common_test_media__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/test-media */ "./src/common/test-media.ts");
/* harmony import */ var _common_test_media__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_common_test_media__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_test_media_source__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/test-media-source */ "./src/common/test-media-source.ts");
/* harmony import */ var _src_modules_lib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../src/modules/lib */ "../src/modules/lib.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-image/core/esl-image.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-media/core/esl-media.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-toggleable/core/esl-toggleable-dispatcher.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-popup/core/esl-popup.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-panel/core/esl-panel-group.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-panel/core/esl-panel.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-trigger/core/esl-trigger.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-tab/core/esl-tab.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-a11y-group/core/esl-a11y-group.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-tab/core/esl-tabs.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-scrollbar/core/esl-scrollbar.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-alert/core/esl-alert.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-forms/esl-select-list/core/esl-select-list.ts");
/* harmony import */ var _src_modules_all__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../src/modules/all */ "../src/modules/esl-forms/esl-select/core/esl-select.ts");
/* harmony import */ var _src_modules_esl_media_providers_iframe_provider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../src/modules/esl-media/providers/iframe-provider */ "../src/modules/esl-media/providers/iframe-provider.ts");
/* harmony import */ var _src_modules_esl_media_providers_html5_audio_provider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../src/modules/esl-media/providers/html5/audio-provider */ "../src/modules/esl-media/providers/html5/audio-provider.ts");
/* harmony import */ var _src_modules_esl_media_providers_html5_video_provider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../src/modules/esl-media/providers/html5/video-provider */ "../src/modules/esl-media/providers/html5/video-provider.ts");
/* harmony import */ var _src_modules_esl_media_providers_youtube_provider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../src/modules/esl-media/providers/youtube-provider */ "../src/modules/esl-media/providers/youtube-provider.ts");
/* harmony import */ var _src_modules_esl_media_providers_brightcove_provider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../src/modules/esl-media/providers/brightcove-provider */ "../src/modules/esl-media/providers/brightcove-provider.ts");
/* harmony import */ var _src_modules_draft_all__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../src/modules/draft/all */ "../src/modules/draft/esl-carousel/core/esl-carousel.ts");
/* harmony import */ var _src_modules_draft_all__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../src/modules/draft/all */ "../src/modules/draft/esl-carousel/all.ts");
// Support for ES5 bundle target

// Builtin polyfills

// Validate environment




// With Namespace








_src_modules_all__WEBPACK_IMPORTED_MODULE_12__.ESLImage.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_13__.ESLMedia.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_14__.ESLToggleableDispatcher.init();
_src_modules_all__WEBPACK_IMPORTED_MODULE_15__.ESLPopup.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_16__.ESLPanelGroup.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_17__.ESLPanel.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_18__.ESLTrigger.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_19__.ESLTab.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_20__.ESLA11yGroup.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_21__.ESLTabs.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_22__.ESLScrollbar.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_23__.ESLAlert.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_23__.ESLAlert.init();
_src_modules_all__WEBPACK_IMPORTED_MODULE_24__.ESLSelectList.register();
_src_modules_all__WEBPACK_IMPORTED_MODULE_25__.ESLSelect.register();
_src_modules_draft_all__WEBPACK_IMPORTED_MODULE_26__.ESLCarousel.register();
_src_modules_draft_all__WEBPACK_IMPORTED_MODULE_27__.ESLCarouselPlugins.Dots.register();
_src_modules_draft_all__WEBPACK_IMPORTED_MODULE_27__.ESLCarouselPlugins.Link.register();
_src_modules_draft_all__WEBPACK_IMPORTED_MODULE_27__.ESLCarouselPlugins.Touch.register();
_src_modules_draft_all__WEBPACK_IMPORTED_MODULE_27__.ESLCarouselPlugins.Autoplay.register();

}();
/******/ })()
;
//# sourceMappingURL=localdev.js.map