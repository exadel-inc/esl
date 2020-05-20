import {CustomElement} from '../../../core/custom-element';
import {attr} from '../../../core/decorators/attr';
import {deepCompare} from '../../../core/common-utils';
import SmartMediaRuleList from '../../../core/conditions/smart-media-rule-list';
import SmartCarouselSlide from './smart-carousel-slide';
import {SmartCarouselView, SmartCarouselViewRegistry} from './view/smart-carousel-view';
import SmartCarouselPlugin from './plugin/smart-carousel-plugin';

interface CarouselConfig { // Registry
	view?: string;
	count?: number;
	className?: string;
}

// TODO: add ability to choose the number of an active slide
export class SmartCarousel extends CustomElement {
	public static is = 'smart-carousel';
	public static eventNs = 'sc';

	static get observedAttributes() {
		return ['config'];
	}

	@attr() public config: string;

	private _configRules: SmartMediaRuleList<CarouselConfig>;
	private _currentConfig: CarouselConfig = {};
	private _view: SmartCarouselView;
	private readonly _plugins = new Map<string, SmartCarouselPlugin>();

	private readonly _onMatchChange: () => void;

	constructor() {
		super();
		this._onMatchChange = this.update.bind(this, false);
		this._onRegistryChange = this._onRegistryChange.bind(this);
	}

	get $slidesArea(): HTMLElement {
		return this.querySelector('[data-slides-area]');
	}

	get $slides(): SmartCarouselSlide[] {
		// TODO cache
		const els = this.$slidesArea.querySelectorAll(SmartCarouselSlide.is);
		return els ? Array.from(els) as SmartCarouselSlide[] : [];
	}

	get count(): number {
		return this.$slides.length || 0;
	}

	get activeIndexes(): number[] {
		return this.$slides.reduce((activeIndexes: number[], el, index) => {
			if (el.active) {
				activeIndexes.push(index);
			}
			return activeIndexes;
		}, []);
	}

	get activeCount(): number {
		return this.activeConfig.count || 0;
	}

	/**
	 * @returns {number} first active index
	 */
	get firstIndex(): number {
		const index = this.$slides.findIndex((slide) => {
			return slide.first;
		});
		return Math.max(index, 0);
	}

	get activeConfig(): CarouselConfig {
		return this._currentConfig;
	}

	set activeConfig(config) {
		this._currentConfig = Object.assign({}, config);
	}

	public goTo(nextIndex: number, direction?: string, force: boolean = false) {
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
			if (nextIndex > this.firstIndex) {
				direction = nextIndex - this.firstIndex > (this.firstIndex - nextIndex + this.count) % this.count ? 'left' : 'right';
			} else {
				direction = this.firstIndex - nextIndex >= (nextIndex - this.firstIndex - nextIndex + this.count) % this.count ? 'right' : 'left';
			}
		}

		const eventDetails = { // Todo change info
			bubbles: true,
			detail: {
				direction
			}
		};

		const approved = this.dispatchCustomEvent('slide:change', eventDetails);

		if (this._view && approved && this.firstIndex !== nextIndex) {
			this._view.goTo(nextIndex, direction);
		}
		if (this._view && approved) {
			let i = 0;
			this.$slides.forEach((el, index) => {
				el._setActive(((nextIndex + this.count) % this.count <= index) && (index < (nextIndex + this.activeCount + this.count) % this.count));
			});

			while (i < this.activeCount) {
				const computedIndex = (nextIndex + i + this.count) % this.count;
				this.$slides[computedIndex]._setActive(true);
				++i;
			}

			if (this.activeConfig.view === 'multiple') {
				this.$slides[this.firstIndex]._setFirst(false);
				this.$slides[nextIndex]._setFirst(true);
			}
		}

		this.dispatchCustomEvent('slide:changed', eventDetails);
	}

	public prev() {
		// const nextGroup = this.getNextGroup(-1);
		this.goTo((this.firstIndex - this.activeCount + this.count) % this.count, 'left');
	}

	public next() {
		// const nextGroup = this.getNextGroup(1);
		this.goTo((this.firstIndex + this.activeCount + this.count) % this.count, 'right');
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.update(true);
		this.goTo(this.firstIndex, '', true);
		this._bindEvents();

		SmartCarouselViewRegistry.instance.addListener(this._onRegistryChange);
	}

	protected disconnectedCallback() {
		super.disconnectedCallback();
		this._unbindEvents();

		SmartCarouselViewRegistry.instance.removeListener(this._onRegistryChange);
	}

	private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		// TODO: change observed attributes
		switch (attrName) {
			case 'config':
				this.configRules = SmartMediaRuleList.parse<object>(this.config, SmartMediaRuleList.OBJECT_PARSER) as SmartMediaRuleList<CarouselConfig>;
				this.update(true);
				break;
		}
	}

	protected _bindEvents() {
		this.addEventListener('click', this._onClick, false);
	}

	protected _unbindEvents() {
		this.removeEventListener('click', this._onClick, false);
	}

	get configRules() {
		if (!this._configRules) {
			this.configRules = SmartMediaRuleList.parse<CarouselConfig>(this.config, SmartMediaRuleList.OBJECT_PARSER);
		}
		return this._configRules;
	}

	set configRules(rules: SmartMediaRuleList<CarouselConfig>) {
		if (this._configRules) {
			this._configRules.removeListener(this._onMatchChange);
		}
		this._configRules = rules;
		this._configRules.addListener(this._onMatchChange);
	}

	private update(force: boolean = false) {
		const config: CarouselConfig = Object.assign(
			{view: 'multiple', count: 1},
			this.configRules.activeValue
		);

		if (!force && deepCompare(this.activeConfig, config)) {
			return;
		}
		this.activeConfig = config;

		// TODO: somehow compare active view & selected view
		// this._view && this._view.unbind();
		this._view = SmartCarouselViewRegistry.instance.createViewInstance(this.activeConfig.view, this);
		// this._view && this._view.bind();

		if (force || this.activeIndexes.length !== this.activeConfig.count) {
			this._view.draw();
			// this.goTo(this.firstIndex, '', true);
		}
	}

	private getNextGroup(shiftGroupsCount: number) {
		// get number of group of current active slides by last index of this group
		const lastIndex = this.activeIndexes.length - 1;
		const currentGroup = Math.floor(this.activeIndexes[lastIndex] / this.activeCount);
		// get count of groups of slides
		const countGroups = Math.ceil(this.count / this.activeCount);
		// get number of group of next active slides
		return (currentGroup + shiftGroupsCount + countGroups) % countGroups;
	}

	// move to core plugin
	protected _onClick(event: MouseEvent) {
		const eventTarget: HTMLElement = event.target as HTMLElement;
		const markedTarget: HTMLElement = eventTarget.closest('[data-slide-target]');
		if (markedTarget && markedTarget.dataset.slideTarget) {
			const target = markedTarget.dataset.slideTarget;
			if ('prev' === target) {
				this.prev();
			} else if ('next' === target) {
				this.next();
			} else if ('g' === target[0]) {
				const group = +(target.substr(1)) - 1;
				const lastGroup = Math.floor(this.count / this.activeCount);
				this.goTo(group === lastGroup ? this.count - this.activeCount : this.activeCount * group);
			} else {
				this.goTo(+target - 1);
			}
		}
	}

	protected _onRegistryChange() {
		if (!this._view) this.update(true);
	}

	// Plugin management
	public addPlugin(plugin: SmartCarouselPlugin) {
		if (plugin.carousel) return;
		this.appendChild(plugin);
	}

	public removePlugin(plugin: SmartCarouselPlugin | string) {
		if (typeof plugin === 'string') plugin = this._plugins.get(plugin);
		if (!plugin || plugin.carousel !== this) return;
		plugin.parentNode.removeChild(plugin);
	}

	public _addPlugin(plugin: SmartCarouselPlugin) {
		if (this._plugins.has(plugin.key)) return;
		this._plugins.set(plugin.key, plugin);
		if (this.isConnected) plugin.bind();
	}

	public _removePlugin(plugin: SmartCarouselPlugin) {
		if (!this._plugins.has(plugin.key)) return;
		plugin.unbind();
		this._plugins.delete(plugin.key);
	}

	public static register(tagName?: string) {
		SmartCarouselSlide.register((tagName || SmartCarousel.is) + '-slide');
		customElements.whenDefined(SmartCarouselSlide.is).then(() => super.register(tagName));
	}
}

export default SmartCarousel;
