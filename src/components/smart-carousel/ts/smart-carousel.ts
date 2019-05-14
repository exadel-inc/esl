import {triggerComponentEvent} from '../../../helpers/component-utils';
import SmartCarouselAnimation from '../../smart-carousel-animation/ts/smart-carousel-animation';
import SmartSingleCarouselAnimation from '../../smart-carousel-animation/ts/smart-single-carousel-animation';
import SmartMultiCarouselAnimation from '../../smart-carousel-animation/ts/smart-multi-carousel-animation';
import SmartRuleList from '../../smart-query/ts/smart-rule-list';

interface Strategy {
    [type: string]: (carousel: SmartCarousel) => SmartCarouselAnimation
}

interface CarouselCurrentConfig {
    count: number,
    className: string
}

class SmartCarousel extends HTMLElement {

    // public config: string;

    private _animation: SmartCarouselAnimation; // ?
    private _configRules: SmartRuleList<CarouselCurrentConfig>;
    private _currentConfig: CarouselCurrentConfig;

    private readonly _onMatchChange: () => void;


    private static STRATEGIES: Strategy = { //TODO registry
        single: (carousel: SmartCarousel) => new SmartSingleCarouselAnimation(carousel),
        multi: (carousel: SmartCarousel) => new SmartMultiCarouselAnimation(carousel),
    };

    static get is() {
        return 'smart-carousel';
    }

    constructor() {
        super();
        this._onMatchChange = this.update.bind(this, false);
    }

    protected connectedCallback() {
        this.classList.add(SmartCarousel.is);

        this.update(true);
        this._bindEvents();
    }


    get currentConfig() {
        return this._currentConfig;
    }

    get slidesArea(): HTMLElement {
        return this.querySelector('[data-slides-area]');
    }

    private update(force: boolean = false) {
        const rule = this.configRules.active;
        const config = rule.payload;
        if (this._currentConfig !== config || force) {
            this._currentConfig = config;
        }
        const count = (this._currentConfig) ? this._currentConfig.count : config.count;
        if (this.activeIndexes.length !== count || count !== config.count || force) {
            const slideStyles = getComputedStyle(this.slides[this.firstIndex]);
            const slidesAreaStyles = getComputedStyle(this.slidesArea);
            this.slides.forEach((slide) => {
                // slide.style.left = '0';
                // slide.style.transform = `translateX(${0}px)`;
                slide.style.minWidth = parseFloat(slidesAreaStyles.width) / config.count -
                    parseFloat(slideStyles.marginLeft) -
                    parseFloat(slideStyles.marginRight) + 'px';
            });
        }

        this._animation = SmartCarousel.STRATEGIES[this.count === 1 ? 'single' : 'multi'](this);
        //     this.goTo(this.firstIndex, 'right', true);
        //     console.log("this.count: ", this.count);
        //     console.log("this.firstIndex: ", this.firstIndex);
        // }
        // triggerComponentEvent(this, 'sc-slideschanged', {bubbles: true});
    }

    protected disconnectedCallback() {
        this._unbindEvents();
    }

    protected _bindEvents() {
        this.addEventListener('click', this._onClick, false);
    }

    protected _unbindEvents() {
        this.removeEventListener('click', this._onClick, false);
    }

    get activeClass() {
        return this.dataset.activeSlideClass || 'active-slide';
    }

    get slides(): HTMLElement[] {
        const els = this.querySelectorAll('[data-slide-item]') as NodeListOf<HTMLElement>;
        return els ? Array.from(els) : [];
    }

    get size(): number {
        return this.slides.length || 0;
    }

    get activeIndexes(): number[] {
        return this.slides.reduce((activeIndexes: number[], el, index) => {
            if (this.isActive(index)) {
                activeIndexes.push(index);
            }
            return activeIndexes;
        }, []);
    }

    /**
     * @returns {number} first active index
     */
    get firstIndex(): number {
        return this.slides.findIndex((el) => {
            return el.classList.contains(this.activeClass);
        });
    }

    public isActive(index: number): boolean {
        return this.slides[index].classList.contains(this.activeClass);
    }

    get configRules() {
        if (!this._configRules) {
            this.configRules = SmartRuleList.parse<object>(this.configAttribute, SmartRuleList.OBJECT_PARSER) as SmartRuleList<CarouselCurrentConfig>;
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

    get configAttribute() {
        return this.getAttribute('data-config');
    }

    set configAttribute(config) {
        this.setAttribute('data-config', config);
    }

    get count(): number {
        return this._currentConfig.count || 0;
    }

    public goTo(nextIndex: number, direction?: string, force: boolean = false) {
        if (this.dataset.isAnimated) {
            return;
        }
        // show last slides if count of slides isn't enough
        if (nextIndex + this.count > this.size || nextIndex < 0) {
            nextIndex = this.size - this.count;
        }

        if (!force && this.firstIndex === nextIndex) {
            return;
        }

        if (!direction) {
            direction = (nextIndex > this.firstIndex) ? 'right' : 'left';
        }
        if (this._animation) {
            this._animation.animate(nextIndex, direction);
        }

        this.slides.forEach((el) => {
            el.classList.remove(this.activeClass);
        });

        console.log("goto this.count: ", this.count);
        for (let index = 0; index < this.count; ++index) {
            this.slides[nextIndex + index].classList.add(this.activeClass);
        }

        triggerComponentEvent(this, 'sc-slideschanged', {bubbles: true});
    }

    private getNextGroup(shiftGroupsCount: number) {
        // get number of current active slides group by last index of this group
        const lastIndex = this.activeIndexes.length - 1;
        const currentGroup = Math.floor(this.activeIndexes[lastIndex] / this.count);
        // get count of slides groups
        const countGroups = Math.ceil(this.size / this.count);
        // get number of next active slides group
        return (currentGroup + shiftGroupsCount + countGroups) % countGroups;
    }

    public prev() {
        const nextGroup = this.getNextGroup(-1);
        this.goTo(nextGroup * this.count, 'left');
    }

    public next() {
        const nextGroup = this.getNextGroup(1);
        this.goTo(nextGroup * this.count, 'right');
    }

    private static getPath(src: string, basePath = '') {
        if (!src || src === '0' || src === 'none') {
            // return SmartImage.EMPTY_IMAGE;
        }
        return basePath + src;
    }


    protected _onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const markedTarget = target.closest('[data-slide-target]') as HTMLElement;
        if (markedTarget && markedTarget.dataset.slideTarget) {
            const target = markedTarget.dataset.slideTarget;
            if ('prev' === target) {
                this.prev();
            } else if ('next' === target) {
                this.next();
            } else {
                this.goTo(this.count * +target);
            }
        }
    }
}

customElements.define(SmartCarousel.is, SmartCarousel);
export default SmartCarousel;
