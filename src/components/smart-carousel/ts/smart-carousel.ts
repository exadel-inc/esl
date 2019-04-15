import {triggerComponentEvent} from '../../../helpers/component-utils';
import SmartCarouselStrategy from './smart-carousel-strategy';

class SmartCarousel extends HTMLElement {

    public config: { count: number };
    private strategy: SmartCarouselStrategy;

    static get is() {
        return 'smart-carousel';
    }

    constructor() {
        super();
    }

    protected connectedCallback() {
        this.classList.add(SmartCarousel.is);
        this.config = {count: 3};
        this.strategy = new SmartCarouselStrategy(this);
        this._bindEvents();
    }

    protected disconnectedCallback() {
        this._unbindEvents();
    }

    protected _bindEvents() {
        this.addEventListener('click', this._onClick, false);
        // ??
        this.addEventListener('sc-slidesanimated', this._onAnimate, false);
    }

    protected _unbindEvents() {
        this.removeEventListener('click', this._onClick, false);
        // ??
        this.removeEventListener('sc-slidesanimated', this._onAnimate, false);
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
            if (el.classList.contains(this.activeClass)) {
                activeIndexes.push(index);
            }
            return activeIndexes;
        }, []);
    }

    /**
     * @returns {number} first index of current active slides
     */
    get firstIndex(): number {
        return this.slides.findIndex((el) => {
            return el.classList.contains(this.activeClass);
        });
    }

    public goTo(firstNextIndex: number) {
        let nextIndex = 0;
        if (this.firstIndex !== firstNextIndex) {
            this.activeIndexes.forEach((el) => {
                this.slides[el].classList.remove(this.activeClass);
            });

            for (let index = 0; index < this.config.count; ++index) {
                if (firstNextIndex + index >= this.size) {
                    nextIndex = this.size - 1 - index;
                } else {
                    nextIndex = firstNextIndex + index;
                }
                this.slides[nextIndex].classList.add(this.activeClass);
            }
        }
    }

    public prev() {
        const currentGroup = Math.floor((this.activeIndexes[this.activeIndexes.length - 1] / this.config.count));
        const countGroups = Math.ceil(this.size / this.config.count);
        this.goTo((((currentGroup - 1 + countGroups) % countGroups) * this.config.count));
    }

    public next() {
        const currentGroup = Math.floor((this.activeIndexes[this.activeIndexes.length - 1] / this.config.count));
        const countGroups = Math.ceil(this.size / this.config.count);
        this.goTo((((currentGroup + 1 + countGroups) % countGroups) * this.config.count));
    }

    protected _onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const markedTarget = target.closest('[data-slide-target]') as HTMLElement;
        if (markedTarget && markedTarget.dataset.slideTarget) {
            this.setActiveIndexes(markedTarget.dataset.slideTarget);
        }
    }

    public setActiveIndexes(target: string) {
        const firstIndex = this.firstIndex;
        let direction = '';

        if (this.dataset.isAnimated) {
            return;
        }

        if ('prev' === target) {
            this.prev();
            direction = 'left';
        } else if ('next' === target) {
            this.next();
            direction = 'right';
        } else {
            this.goTo(this.config.count * +target);
            direction = (firstIndex < this.config.count * +target) ? 'right' : 'left';
        }

        this.triggerSlidesAnimate({
            firstIndex,
            direction
        });

        this.triggerSlidesChange();
    }

    protected _onAnimate(event: CustomEvent) {
        this.strategy.setStrategy((this.config.count === 1) ? 'single' : 'multi');
        this.strategy.animate(event);
    }

    // ??? to utility class
    protected triggerSlidesAnimate(detail?: {}) {
        triggerComponentEvent(this, 'sc-slidesanimated', {bubbles: true, detail})
    }

    protected triggerSlidesChange(detail?: {}) {
        triggerComponentEvent(this, 'sc-slideschanged', {bubbles: true, detail})
    }
}

customElements.define(SmartCarousel.is, SmartCarousel);
export default SmartCarousel;
