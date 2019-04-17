import {triggerComponentEvent} from '../../../helpers/component-utils';
import SmartCarouselAnimation from "../../smart-carousel-animation/ts/smart-carousel-animation";
import SmartSingleCarouselAnimation from "../../smart-carousel-animation/ts/smart-single-carousel-animation";
import SmartMultiCarouselAnimation from "../../smart-carousel-animation/ts/smart-multi-carousel-animation";

interface Strategy {
    [type: string]: (carousel: SmartCarousel) => SmartCarouselAnimation
}

class SmartCarousel extends HTMLElement {

    public config: { count: number };
    private animation: SmartCarouselAnimation;

    private STRATEGIES: Strategy = {
        single: (carousel: SmartCarousel) => new SmartSingleCarouselAnimation(carousel),
        multi: (carousel: SmartCarousel) => new SmartMultiCarouselAnimation(carousel),
    };

    static get is() {
        return 'smart-carousel';
    }

    constructor() {
        super();
    }

    protected connectedCallback() {
        this.classList.add(SmartCarousel.is);
        this.config = {count: 3};

        const type = (this.config.count === 1) ? 'single' : 'multi';
        this.animation = this.STRATEGIES[type](this);

        this._bindEvents();
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
        const slides = els ? Array.from(els) : [];
        Object.defineProperty(this, 'slides', {value: slides});
        return slides;
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

    public goTo(nextIndex: number, direction?: string) {
        if (this.dataset.isAnimated) {
            return;
        }

        // show last slides if count of slides isn't enough
        if (nextIndex + this.config.count > this.size || nextIndex < 0) {
            nextIndex = this.size - this.config.count;
        }

        if (this.firstIndex === nextIndex) {
            return;
        }

        if (!direction) {
            direction = (nextIndex > this.firstIndex) ? 'right' : 'left';
        }

        this.animation.animate(nextIndex, direction);

        this.slides.forEach((el) => {
            el.classList.remove(this.activeClass);
        });

        for (let index = 0; index < this.config.count; ++index) {
            this.slides[nextIndex + index].classList.add(this.activeClass);
        }

        triggerComponentEvent(this, 'sc-slideschanged', {bubbles: true})
    }

    private getNextGroup(shiftGroupsCount: number) {
        // get number of current active slides group by last index of this group
        const lastIndex = this.activeIndexes.length - 1;
        const currentGroup = Math.floor(this.activeIndexes[lastIndex] / this.config.count);
        // get count of slides groups
        const countGroups = Math.ceil(this.size / this.config.count);
        // get number of next active slides group
        return (currentGroup + shiftGroupsCount + countGroups) % countGroups;
    }

    public prev() {
        const nextGroup = this.getNextGroup(-1);
        this.goTo(nextGroup * this.config.count, 'left');
    }

    public next() {
        const nextGroup = this.getNextGroup(1);
        this.goTo(nextGroup * this.config.count, 'right');
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
                this.goTo(this.config.count * +target);
            }
        }
    }
}

customElements.define(SmartCarousel.is, SmartCarousel);
export default SmartCarousel;
