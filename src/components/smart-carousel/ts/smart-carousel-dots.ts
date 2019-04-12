import SmartCarousel from './smart-carousel';

class SmartCarouselDots extends HTMLElement {

    static get is() {
        return 'smart-carousel-dots';
    }

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
        this._parent.addEventListener('sc-slideschanged', this._onUpdate);
    }

    protected _unbindEvents() {
        this._parent.removeEventListener('sc-slideschanged', this._onUpdate);
    }

    private _onUpdate = () => this.rerender();

    get _parent(): SmartCarousel {
        return this.closest('.' + SmartCarousel.is) as SmartCarousel;
    }

    public rerender() {
        let html = '';
        const activeDot = Math.floor(this._parent.activeIndexes[this._parent.config.count - 1] / this._parent.config.count);
        for (let i = 0; i < Math.ceil(this._parent.size / this._parent.config.count); ++i) {
            html += this.buildDot(i, i === activeDot);
        }
        this.innerHTML = html;
    }

    public buildDot(index: number, isActive: boolean) {
        return `<button role="button" class="carousel-dot ${isActive ? 'active-dot' : ''}" data-slide-target="${index}">
                <span > </span>
            </button>`;
    }
}

customElements.define(SmartCarouselDots.is, SmartCarouselDots);
export default SmartCarouselDots;
