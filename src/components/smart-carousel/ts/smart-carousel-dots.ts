import SmartCarousel from './smart-carousel';

class SmartCarouselDots extends HTMLElement {
    static get is() {
        return 'smart-carousel-dots';
    }

    private _onUpdate = () => this.rerender();

    constructor() {
        super();
    }

    protected connectedCallback() {
        this.classList.add(SmartCarouselDots.is);
        this.rerender();
        this._bindEvents();
    }

    protected disconnectedCallback() {
        this._unbindEvents();
    }

    protected _bindEvents() {
        this.$parent.addEventListener('sc:slide:changed', this._onUpdate);
    }

    protected _unbindEvents() {
        this.$parent.removeEventListener('sc:slide:changed', this._onUpdate);
    }


    get $parent(): SmartCarousel {
        return this.closest('.' + SmartCarousel.is) as SmartCarousel;
    }

    public rerender() {
        let html = '';
        const activeDot = Math.floor(this.$parent.activeIndexes[this.$parent.activeCount - 1] / this.$parent.activeCount);
        for (let i = 0; i < Math.ceil(this.$parent.count / this.$parent.activeCount); ++i) {
            html += this.buildDot(i, i === activeDot);
        }
        this.innerHTML = html;
    }

    public buildDot(index: number, isActive: boolean) {
        return `<button role="button" class="carousel-dot ${isActive ? 'active-dot' : ''}" data-slide-target="${index}"></button>`;
    }
}

customElements.define(SmartCarouselDots.is, SmartCarouselDots);
export default SmartCarouselDots;
