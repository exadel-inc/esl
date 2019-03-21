import {triggerComponentEvent} from '../../helpers/component-utils';

class SmartAbstractCarousel extends HTMLElement {

    public config: { count: number };

    static get is() {
        return 'smart-abstract-carousel';
    }

    constructor() {
        super();
    }

    protected connectedCallback() {
        this.classList.add(SmartAbstractCarousel.is);
        this.config = {count: 3};
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

    public goTo(nextIndex: number) {
        this.activeIndexes.forEach((el, index) => {
            nextIndex = (nextIndex + this.size) % this.size;
            this.slides[el].classList.remove(this.activeClass);
            this.slides[nextIndex + index].classList.add(this.activeClass);
        });
    }

    public prev() {
        this.goTo(this.firstIndex - this.config.count);
    }

    public next() {
        this.goTo(this.firstIndex + this.config.count);
    }

    protected _onClick(event: MouseEvent) {

    }

    protected _onAnimate(event: MouseEvent) {

    }

    // ???
    protected triggerSlidesAnimate(detail: {}) {
        triggerComponentEvent(this, 'sc-slidesanimated', {bubbles: true, detail})
    }

    protected triggerSlidesChange(detail: {}) {
        triggerComponentEvent(this, 'sc-slideschanged', {bubbles: true, detail})
    }
}

export default SmartAbstractCarousel;
