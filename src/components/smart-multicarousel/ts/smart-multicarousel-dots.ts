import SmartMulticarousel from './smart-multicarousel';

class SmartMulticarouselDots extends HTMLElement {

    static get is() {
        return 'smart-multicarousel-dots';
    }

    constructor() {
        super();
    }

    private _onUpdate = () => this.rerender();

    private connectedCallback() {
        this.classList.add(SmartMulticarouselDots.is);
        this.rerender();

        this._parent.addEventListener('smart-mc-slideschanged', this._onUpdate);
    }

    get _parent(): SmartMulticarousel {
        return this.closest(SmartMulticarousel.is) as SmartMulticarousel;
    }

    public rerender() {
        let html = '';
        const countSlides = 3;
        const activeDot =  Math.floor(this._parent.activeIndexes[countSlides - 1] / countSlides);
        for (let i = 0; i < Math.ceil(this._parent.slides.length / countSlides); ++i) {
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

customElements.define(SmartMulticarouselDots.is, SmartMulticarouselDots);
export default SmartMulticarouselDots;
