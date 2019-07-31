import SmartCarousel from './smart-carousel';

class SmartCarouselSlide extends HTMLElement {
    static get is() {
        return 'smart-carousel-slide';
    }

    constructor() {
        super();
    }

    protected connectedCallback() {
        this.setAttribute('data-slide-item', '');
    }

    public get $parent(): SmartCarousel {
        return this.closest('.' + SmartCarousel.is) as SmartCarousel;
    }

    public get index(): number {
        return this.$parent.$slides.indexOf(this);
    }

    public get isActive(): boolean {
        return this.classList.contains(this.activeClass);
    }

    public set isActive(makeActive: boolean) {
        makeActive ? this.classList.add(this.activeClass) : this.classList.remove(this.activeClass);
    }

    public get activeClass(): string {
        return 'active-slide';
    }
}

customElements.define(SmartCarouselSlide.is, SmartCarouselSlide);
export default SmartCarouselSlide;
