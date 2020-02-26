import {CustomElement} from '@helpers/custom-element';
import {attr} from '@helpers/decorators/attr';
import {deepCompare} from '@helpers/common-utils';
import SmartRuleList from '@components/smart-query/ts/smart-rule-list';
import SmartCarouselSlide from './smart-carousel-slide';
import {SmartCarouselStrategy, SmartCarouselStrategyRegistry} from './strategy/smart-carousel-strategy';
import SmartCarouselPlugin from './plugin/smart-carousel-plugin';

interface CarouselConfig { // Registry
	strategy?: string,
	count?: number,
	className?: string
}

// TODO: add ability to choose the number of an active slide
class SmartCarousel extends CustomElement {
	public static is = 'smart-carousel';
	public static eventNs = 'sc';

	static get observedAttributes() {
		return ['config'];
	}

	@attr() public config: string;

	private _configRules: SmartRuleList<CarouselConfig>;
	private _currentConfig: CarouselConfig = {};
	private _strategy: SmartCarouselStrategy;
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
		return this._currentConfig.count || 0;
	}

	/**
	 * @returns {number} first active index
	 */
	get firstIndex(): number {
		const index = this.$slides.findIndex((slide) => {
			return slide.active;
		});
		return Math.max(index, 0);
	}

	get activeConfig(): CarouselConfig {
		return this._currentConfig;
	}

	public goTo(nextIndex: number, direction?: string, force: boolean = false) {
		if (this.dataset.isAnimated) {
			return;
		}
		// show last slides if count of slides isn't enough
		if (nextIndex + this.activeCount > this.count || nextIndex < 0) {
			nextIndex = this.count - this.activeCount;
		}

		if (this.firstIndex === nextIndex && !force) {
			return;
		}

		if (!direction) {
			direction = (nextIndex > this.firstIndex) ? 'right' : 'left';
		}

		const eventDetails = { // Todo change info
			bubbles: true,
			detail: {
				direction
			}
		};

		const approved = this.dispatchCustomEvent('slide:change', eventDetails);

		if (this._strategy && approved && this.firstIndex !== nextIndex) {
			this._strategy.onAnimate(nextIndex, direction);
		}

		if (this._strategy && approved) {
			this.$slides.forEach((el, index) => {
				el._setActive((nextIndex <= index) && (index < nextIndex + this.activeCount));
			});
		}

		this.dispatchCustomEvent('slide:changed', eventDetails);
	}

	public prev() {
		const nextGroup = this.getNextGroup(-1);
		this.goTo(nextGroup * this.activeCount, 'left');
	}

	public next() {
		const nextGroup = this.getNextGroup(1);
		this.goTo(nextGroup * this.activeCount, 'right');
	}

	protected connectedCallback() {
		this.classList.add(SmartCarousel.is);

		this.update(true);
		this._bindEvents();

		SmartCarouselStrategyRegistry.instance.addListener(this._onRegistryChange);
	}

	protected disconnectedCallback() {
		this._unbindEvents();

		SmartCarouselStrategyRegistry.instance.removeListener(this._onRegistryChange);
	}

	private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		// TODO: change observed attributes
		switch (attrName) {
			case 'config':
				this.configRules = SmartRuleList.parse<object>(this.config, SmartRuleList.OBJECT_PARSER) as SmartRuleList<CarouselConfig>;
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
			this.configRules = SmartRuleList.parse<CarouselConfig>(this.config, SmartRuleList.OBJECT_PARSER);
		}
		return this._configRules;
	}

	set configRules(rules: SmartRuleList<CarouselConfig>) {
		if (this._configRules) {
			this._configRules.removeListener(this._onMatchChange);
		}
		this._configRules = rules;
		this._configRules.addListener(this._onMatchChange);
	}

	private update(force: boolean = false) {
		const config: CarouselConfig = Object.assign(
			{strategy: 'multiple', count: 1},
			this.configRules.activeValue
		);

		if (!force && deepCompare(this._currentConfig, config)) {
			return;
		}
		this._currentConfig = Object.assign({}, config);

		this._strategy = SmartCarouselStrategyRegistry.instance.createStrategyInstance(this.activeConfig.strategy, this);
		if (force || this.activeIndexes.length !== this._currentConfig.count) {
			this.updateSlidesCount();
		}
	}

	private updateSlidesCount() {
		// move to renderer
		const count = this._currentConfig.strategy === 'single' ? 1 : this._currentConfig.count; // somehow we need to get rid of specific strategy check
		const slideStyles = getComputedStyle(this.$slides[this.firstIndex]);
		const currentTrans = parseFloat(slideStyles.transform.split(',')[4]);
		const slidesAreaStyles = getComputedStyle(this.$slidesArea);
		const slideWidth = parseFloat(slidesAreaStyles.width) / count - parseFloat(slideStyles.marginLeft) - parseFloat(slideStyles.marginRight);
		const computedLeft = -(parseFloat(slidesAreaStyles.width) / count * this.firstIndex) - (currentTrans);

		this.$slides.forEach((slide) => {
			slide.style.minWidth = slideWidth + 'px';
			slide.style.left = computedLeft + 'px';
		});
		this.goTo(this.firstIndex, '', true);
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
		const eventTarget = event.target as HTMLElement;
		const markedTarget = eventTarget.closest('[data-slide-target]') as HTMLElement;
		if (markedTarget && markedTarget.dataset.slideTarget) {
			const target = markedTarget.dataset.slideTarget;
			if ('prev' === target) {
				this.prev();
			} else if ('next' === target) {
				this.next();
			} else if ('g' === target[0]) {
				const group = +(target.substr(1)) - 1;
				this.goTo(this.activeCount * group);
			} else {
				this.goTo(+target - 1);
			}
		}
	}

	protected _onRegistryChange() {
		if (!this._strategy) this.update(true);
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
