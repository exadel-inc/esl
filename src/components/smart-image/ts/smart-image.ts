/**
 * Smart Image
 * @version 1.0.0
 * @author Alexey Stsefanovich (ala'n)
 *
 * @description:
 * SmartImage - custom element, that provide flexible abilities to include images on web pages.
 * Originally developed as alternative for picture component, but with more features inside.
 * Supported features:
 * - different render modes: with or without inner img tag; object-fit options emulation like cover, inscribe, etc.
 * - manual loading (start loading image by manually provided marker)
 * - lazy loading (image start loading only if it is visible and in or closer to browser viewport area
 * - SmartQuery (special syntax that allows define different sources for different media queries, also supports shortcuts for media-queries)
 * - flexible class markers. smart-image can add specific class on any parent element when image is ready,
 * the smart-image itself also has markers that indicate it state
 * - provides events on state change (also support inline syntax like <smart-image onload="">)
 * - hot changes
 *
 * @attr:
 *  {String} data-src - src paths per queries (watched value)
 *    NOTE: query support shortcuts for
 *     - Breakpoints like @MD, @SM (defined), @+SM (SM and larger), @-LG(LG and smaller)
 *     - Device point resolutions: @1x, @2x, @3x
 *    all conditions must be separated by conjunction ('and')
 *    @example: '@+MD and @2x'
 *  {String} [data-src-base] - base src path for pathes described in data-src
 *
 *  {String} alt | data-alt - alt text (watched value)
 *
 *  {'origin' | 'cover' | 'save-ratio' | 'fit'} mode - rendering mode (default 'save-ratio') (watched value)
 *    WHEN mode is 'origin' - save origin image size
 *                            (use inner img tag for rendering)
 *    WHEN mode is 'fit' - use inner img but not force it width
 *    WHEN mode is 'cover' - didn't have self size use 100% w/h of container
 *                           (use background-image for rendering)
 *    WHEN mode is 'save-ratio' - fill 100% of container width and set self height according to image ratio
 *                                (use background-image for rendering)
 *
 *  {Boolean} [lazy] - enable lazy loading triggered by IntersectionObserver by default
 *                    (image start loading as soon as it becomes visible in visual area)
 *  {Boolean} [lazy-manual] - just says not to load image until lazy-triggered attribute appears
 *
 *  {Boolean} [refresh-on-update] - Always update original image as soon as image source changed
 *
 *  {String}  [container-class] - class that will be added to container when image will be ready
 *  {String}  [container-class-onload] - marks that container-class shouldn't be added if image load ends with exception
 *  {String}  [container-class-target] - target parent selector to add container-class (parentNode by default).
 *
 *  Events html connection points (see @events section)
 *  {Function | Evaluated Expression} onready
 *  {Function | Evaluated Expression} onload
 *  {Function | Evaluated Expression} onerror
 *
 *  @readonly {Boolean} ready - appears once when image first time loaded
 *  @readonly {Boolean} loaded - appears once when image first time loaded
 *  @readonly {Boolean} error - appears when current src isn't load
 *
 *  NOTE: smart-image supports title attribute as any html element, no additional reflection for that attribute needed
 *  it will work correctly according to HTML5.* REC
 *
 * @param:
 *  {String} src - srcset (see data-src attribute for details)
 *  {String} srcBase - base path (see data-src-base attribute for details)
 *  {String} alt - alt text
 *  {'origin' | 'cover' | 'save-ratio' | 'fit'} mode - mode of image renderer
 *  {Array} rules - array of rules parsed from src
 *  {Boolean} refreshOnUpdate - see proactive-update attribute
 *
 *  @readonly {Function} triggerLoad - shortcut function for manually adding lazy-triggered marker
 *
 *  @readonly {SmartImageSrcRule} targetRule - satisfied rule that need to be applied in current state
 *  @readonly {Boolean} ready
 *  @readonly {Boolean} loaded
 *  @readonly {Boolean} error
 *
 * @event:
 *  ready - emits when image ready (loaded or load fail)
 *  load - emits every time when image loaded (including on path change)
 *  error - emits every time when current source loading fails.
 *
 * @example:
 *  <smart-image mode="save-ratio"
 *      data-src='..defaultPath [| mediaQuery => src [| ...]]'
 *  ></smart-image>
 *  // also instead of mediaQuery you could use breakpoint shortcut like:
 *  <smart-image mode="save-ratio"
 *      data-src='..defaultPath [| @+MD => src [| ...]]'
 *  ></smart-image>
 *  or
 *  <smart-image mode="save-ratio"
 *      data-src='..defaultPath [| @1x => src [| ...]]'
 *  ></smart-image>
 */
import {isMobile} from '../../../helpers/device-utils';
import {triggerComponentEvent} from '../../../helpers/component-utils';
import SmartRuleList from '../../smart-query/ts/smart-rule-list';

// Mods configurations

interface Strategy {
	[mode: string]: { useInnerImg: boolean, afterLoad?: (shadowImg: ShadowImageElement, empty: boolean) => void }
}

interface ShadowImageElement extends HTMLImageElement {
	dpr?: number
}

const STRATEGIES: Strategy = {
	'cover': {
		useInnerImg: false,
		afterLoad() {
			this.style.paddingTop = null;
		}
	},
	'save-ratio': {
		useInnerImg: false,
		afterLoad(shadowImg, empty) {
			this.style.paddingTop = empty ? null : `${(shadowImg.height * 100 / shadowImg.width)}%`;
		}
	},
	'fit': {
		useInnerImg: true,
		afterLoad() {
			this.style.paddingTop = null;
		}
	},
	'origin': {
		useInnerImg: true,
		afterLoad(shadowImg) {
			this.style.paddingTop = null;
			this._innerImage.width = shadowImg.width / shadowImg.dpr;
		}
	}
};

// Intersection Observer for lazy init functionality
let intersectionObserver: IntersectionObserver;

function getIObserver() {
	if (!intersectionObserver) {
		intersectionObserver = new IntersectionObserver(function intersectionCallback(entries) {
			(entries || []).forEach(function (entry) {
				if ((entry.isIntersecting || entry.intersectionRatio > 0) && entry.target instanceof SmartImage) {
					entry.target.triggerLoad();
				}
			});
		}, {
			threshold: [0.01],
			rootMargin: isMobile ? '250px' : '500px'// rootMargin value for IntersectionObserver
		});
	}
	return intersectionObserver;
}

export class SmartImage extends HTMLElement {
	private _innerImg: HTMLImageElement;
	private _rules: SmartRuleList;
	private _currentSrc: string;
	private _detachLazyTrigger: () => void;
	private _shadowImageElement: ShadowImageElement;
	private readonly _onMatchChange: () => void;

	static get is() {
		return 'smart-image';
	}

	static get EMPTY_IMAGE() {
		return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	}

	static get observedAttributes() {
		return ['data-alt', 'data-src', 'data-src-base', 'mode', 'lazy-triggered'];
	}

	constructor() {
		super();
		this._onLoad = this._onLoad.bind(this);
		this._onError = this._onError.bind(this);
		this._onMatchChange = this.update.bind(this, false);
	}

	get lazy(): boolean {
		return this.hasAttribute('lazy') || this.hasAttribute('lazy-manual');
	}

	get lazyAuto(): boolean {
		return this.hasAttribute('lazy') && !this.hasAttribute('lazy-manual');
	}

	get lazyManual(): boolean {
		return this.hasAttribute('lazy-manual');
	}

	get lazyTriggered(): boolean {
		return this.hasAttribute('lazy-triggered');
	}

	get ready(): boolean {
		return this.hasAttribute('ready');
	}

	get loaded(): boolean {
		return this.hasAttribute('loaded');
	}

	get error(): boolean {
		return this.hasAttribute('error');
	}

	get mode(): string {
		return this.getAttribute('mode') || 'save-ratio';
	}

	set mode(mode: string) {
		if (!STRATEGIES[mode]) {
			throw new Error('Smart Image: Unsupported mode: ' + mode);
		}
		if (this.mode !== mode) {
			this.setAttribute('mode', mode);
		}
		if (this.mode !== 'origin' && this._innerImg) {
			this.removeChild(this._innerImg);
			this._innerImg = null;
		}
		this.update(true);
	}

	get refreshOnUpdate() {
		return this.hasAttribute('refresh-on-update');
	}

	set refreshOnUpdate(val) {
		val ? this.setAttribute('refresh-on-update', 'true') : this.removeAttribute('refresh-on-update');
	}

	get alt() {
		return this.getAttribute('data-alt') || this.getAttribute('alt') || '';
	}
	set alt(text) {
		this.setAttribute('data-alt', text);
	}

	// Rename to ~query sttr
	get src() {
		return this.getAttribute('data-src');
	}
	set src(src) {
		this.setAttribute('data-src', src);
	}

	get srcBase() {
		return this.getAttribute('data-src-base') || '';
	}
	set srcBase(baseSrc) {
		this.setAttribute('data-src-base', baseSrc);
	}

	// private or rename ????
	get rules() {
		if (!this._rules) {
			this.rules = SmartRuleList.parse(this.src);
		}
		return this._rules;
	}
	set rules(rules: SmartRuleList) {
		if (this._rules) {
			this._rules.removeListener(this._onMatchChange);
		}
		this._rules = rules;
		this._rules.addListener(this._onMatchChange);
	}

	get currentSrc() {
		return this._currentSrc;
	}

	get empty() {
		return !this._currentSrc || SmartImage.isEmptyImage(this._currentSrc);
	}

	public triggerLoad() {
		this.setAttribute('lazy-triggered', '');
	}

	private update(force: boolean = false) {
		if (this.lazy && !this.lazyTriggered) {
			return;
		}

		const rule = this.rules.targetRule;
		const src = SmartImage.getPath(rule.payload as string, this.srcBase);
		const dpr = rule.DPR;

		if (this._currentSrc !== src || force) {
			this._currentSrc = src;
			this._shadowImg.src = src;
			this._shadowImg.dpr = dpr;

			if (this.refreshOnUpdate || !this.ready) {
				this.syncImage();
			}
		}
	}

	private refresh() {
		this.removeAttribute('loaded');
		this.removeAttribute('ready');
		this.style.paddingTop = null;
		this.style.background = null;
		this.update(true);
	}

	private syncImage() {
		const shadowImg = this._shadowImg;
		const src = shadowImg.src;
		const isEmpty = !src || SmartImage.isEmptyImage(src);

		if (STRATEGIES[this.mode].useInnerImg) {
			this._innerImage.src = src;
			this.style.backgroundImage = null;
		} else {
			this.style.backgroundImage = isEmpty ? null : `url("${src}")`;
		}
		if (STRATEGIES[this.mode].afterLoad) {
			STRATEGIES[this.mode].afterLoad.call(this, shadowImg, isEmpty);
		}
	}

	private connectedCallback() {
		this.classList.add(SmartImage.is);
		this.setAttribute('alt', this.alt);
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', 'img');
		}
		this.update(true);
		if (this.lazyAuto && !this.lazyTriggered) {
			getIObserver().observe(this);
			this._detachLazyTrigger = function () {
				getIObserver().unobserve(this);
				this._detachLazyTrigger = null;
			};
		}
	}

	private disconnectedCallback() {
		this.removeAttribute('lazy-triggered');
		this._detachLazyTrigger && this._detachLazyTrigger();
	}

	private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		switch (attrName) {
			case 'data-alt':
				this.setAttribute('alt', newVal);
				break;
			case 'data-src':
				this.rules = SmartRuleList.parse(newVal);
				this.refresh();
				break;
			case 'data-src-base':
				this.refresh();
				break;
			case 'mode':
				oldVal = oldVal || 'save-ratio';
				newVal = newVal || 'save-ratio';
				if (oldVal !== newVal) {
					this.mode = newVal;
				}
				break;
			case 'lazy-triggered':
				this.update(true);
				break;
		}
	}

	get _innerImage() {
		if (!this._innerImg) {
			this._innerImg = this.querySelector('img');
			if (!this._innerImg) {
				this._innerImg = document.createElement('img');
				this.appendChild(this._innerImg);
			}
			this._innerImg.className = 'inner-image';
			this._innerImg.alt = '';
		}
		return this._innerImg;
	}

	get _shadowImg() {
		if (!this._shadowImageElement) {
			this._shadowImageElement = new Image();
			this._shadowImageElement.onload = this._onLoad;
			this._shadowImageElement.onerror = this._onError;
		}
		return this._shadowImageElement;
	}

	private _onLoad() {
		this.syncImage();
		this.removeAttribute('error');
		this.setAttribute('loaded', '');
		triggerComponentEvent(this, 'load');
		this._onReady();
	}

	private _onError() {
		this.setAttribute('error', '');
		triggerComponentEvent(this, 'error');
		this._onReady();
	}

	private _onReady() {
		if (!this.ready) {
			this.setAttribute('ready', '');
			triggerComponentEvent(this, 'ready');
			if (this.hasAttribute('container-class') || this.hasAttribute('container-class-target')) {
				if (this.hasAttribute('container-class-onload') && this.error) return;
				const containerCls = this.getAttribute('container-class') || 'img-container-loaded';
				const target = this.getAttribute('container-class-target');
				const targetEl = target ? this.closest(target) : this.parentNode;
				(targetEl) && (targetEl as HTMLElement).classList.add(containerCls);
			}
		}
	}

	private static getPath(src: string, basePath = '') {
		if ( !src || src === '0' || src === 'none') {
			return SmartImage.EMPTY_IMAGE;
		}
		return basePath + src;
	}

	private static isEmptyImage(src: string) {
		return src === SmartImage.EMPTY_IMAGE;
	}
}

customElements.define(SmartImage.is, SmartImage);
export default SmartImage;
