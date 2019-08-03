class SmartCarouselSlide extends HTMLElement {

    private _index: number;

    public static get ACTIVE_CLASS() { return 'active-slide';}

    static get is() {
        return 'smart-carousel-slide';
    }

    constructor() {
        super();
    }

    protected connectedCallback() {
       this.classList.add(SmartCarouselSlide.is);
    }

    public get index() : number {
        return Array.prototype.indexOf.call(this.parentNode.childNodes, this);
    }

    public get active(): boolean {
        return this.hasAttribute(SmartCarouselSlide.ACTIVE_CLASS);
    }

    _setActive(active: boolean) {
        this.toggleAttribute(SmartCarouselSlide.ACTIVE_CLASS, active);
    }
}

customElements.define(SmartCarouselSlide.is, SmartCarouselSlide);
export default SmartCarouselSlide;
