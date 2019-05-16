import {attr} from '../../../helpers/custom-element-utils';
import SmartRuleList from '../../smart-query/ts/smart-rule-list';
import {triggerComponentEvent} from '../../../helpers/component-utils';
import SmartCarouselAnimation from '../../smart-carousel-animation/ts/smart-carousel-animation';
import SmartSingleCarouselAnimation from '../../smart-carousel-animation/ts/smart-single-carousel-animation';
import SmartMultiCarouselAnimation from '../../smart-carousel-animation/ts/smart-multi-carousel-animation';

interface StrategyMap {
    [type: string]: (carousel: SmartCarousel) => SmartCarouselAnimation
}

interface CarouselCurrentConfig {
    count: number,
    className: string
}

const STRATEGIES: StrategyMap = { // TODO registry
    single: (carousel: SmartCarousel) => new SmartSingleCarouselAnimation(carousel),
    multi: (carousel: SmartCarousel) => new SmartMultiCarouselAnimation(carousel),
};

class SmartCarousel extends HTMLElement {

    static get is() {
        return 'smart-carousel';
    }
    static get observedAttributes() {
        return ['config', 'strategy'];
    }

    @attr() public config: string;
    @attr({defaultValue: 'single'}) public strategy: string;
    @attr({defaultValue: 'active-slide'}) public activeClass: string;

    private _configRules: SmartRuleList<CarouselCurrentConfig>;
    private _currentConfig: CarouselCurrentConfig;
    private _strategy: SmartCarouselAnimation;

    private readonly _onMatchChange: () => void;

    constructor() {
        super();
        this._onMatchChange = this.update.bind(this, false);
    }

    get $slidesArea(): HTMLElement {
        return this.querySelector('[data-slides-area]');
    }
    get $slides(): HTMLElement[] {
        // TODO cache
        const els = this.$slidesArea.querySelectorAll('[data-slide-item]') as NodeListOf<HTMLElement>;
        return els ? Array.from(els) : [];
    }
    get count(): number {
        return this.$slides.length || 0;
    }

    get activeIndexes(): number[] {
        return this.$slides.reduce((activeIndexes: number[], el, index) => {
            if (this.isActive(index)) {
                activeIndexes.push(index);
            }
            return activeIndexes;
        }, []);
    }
    get activeCount(): number {
        return this._currentConfig.count || 0;
    }
    get customClass(): string {
        return this._currentConfig.className;
    }

    public goTo(nextIndex: number, direction?: string, force: boolean = false) {
        if (this.dataset.isAnimated) {
            return;
        }
        // show last slides if count of slides isn't enough
        if (nextIndex + this.activeCount > this.count || nextIndex < 0) {
            nextIndex = this.count - this.activeCount;
        }

        if (!force && this.firstIndex === nextIndex) {
            return;
        }

        if (!direction) {
            direction = (nextIndex > this.firstIndex) ? 'right' : 'left';
        }

        const approved = triggerComponentEvent(this, 'sc:slide:change', {bubbles: true}); // Todo change info

        if (this._strategy && approved) {
            this._strategy.animate(nextIndex, direction);
            this.$slides.forEach((el, index) => {
                el.classList.toggle(
                    this.activeClass,
                    (nextIndex <= index) && (index < nextIndex + this.activeCount)
                );
            });
        }

        triggerComponentEvent(this, 'sc:slide:changed', {bubbles: true}); // Todo change info
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
    }
    protected disconnectedCallback() {
        this._unbindEvents();
    }

	private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		switch (attrName) {
			case 'config':
			case 'strategy':
				this.updateStrategy();
				this.configRules = SmartRuleList.parse<object>(this.config, SmartRuleList.OBJECT_PARSER) as SmartRuleList<CarouselCurrentConfig>;
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

    protected updateStrategy() {
        this._strategy = STRATEGIES[this.strategy](this);
    }

    get configRules() {
        if (!this._configRules) {
            this.configRules = SmartRuleList.parse<object>(this.config, SmartRuleList.OBJECT_PARSER) as SmartRuleList<CarouselCurrentConfig>;
        }
        return this._configRules;
    }
    set configRules(rules: SmartRuleList<CarouselCurrentConfig>) {
        if (this._configRules) {
            this._configRules.removeListener(this._onMatchChange);
        }
        this._configRules = rules;
        this._configRules.addListener(this._onMatchChange);
    }

	private update(force: boolean = false) {
		const rule = this.configRules.active;
		const config = rule.payload;
		if (this._currentConfig !== config || force) {
			this._currentConfig = config;
		}
		const count = (this._currentConfig) ? this._currentConfig.count : config.count;
		if (this.activeIndexes.length !== count || count !== config.count || force) {
			const slideStyles = getComputedStyle(this.$slides[this.firstIndex]);
			const slidesAreaStyles = getComputedStyle(this.$slidesArea);
			this.$slides.forEach((slide) => {
				slide.style.minWidth = parseFloat(slidesAreaStyles.width) / config.count -
					parseFloat(slideStyles.marginLeft) -
					parseFloat(slideStyles.marginRight) + 'px';
			});
			this.goTo(this.firstIndex, '', true);
		}
	}

    private getNextGroup(shiftGroupsCount: number) {
        // get number of current active slides group by last index of this group
        const lastIndex = this.activeIndexes.length - 1;
        const currentGroup = Math.floor(this.activeIndexes[lastIndex] / this.activeCount);
        // get count of slides groups
        const countGroups = Math.ceil(this.count / this.activeCount);
        // get number of next active slides group
        return (currentGroup + shiftGroupsCount + countGroups) % countGroups;
    }

    /**
     * @returns {number} first active index
     */
    get firstIndex(): number {
        return this.$slides.findIndex((el) => {
            return el.classList.contains(this.activeClass);
        });
    }
    public isActive(index: number): boolean {
        return this.$slides[index].classList.contains(this.activeClass);
    }

    protected _onClick(event: MouseEvent) {
        const eventTarget = event.target as HTMLElement;
        const markedTarget = eventTarget.closest('[data-slide-target]') as HTMLElement;
        if (markedTarget && markedTarget.dataset.slideTarget) {
            const target = markedTarget.dataset.slideTarget;
            if ('prev' === target) {
                this.prev();
            } else if ('next' === target) {
                this.next();
            } else {
                this.goTo(this.activeCount * +target);
            }
        }
    }
}

customElements.define(SmartCarousel.is, SmartCarousel);
export default SmartCarousel;
