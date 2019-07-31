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
        return this._index;
    }
    public set index(i: number) {
        this._index = i;
    }

    public get isActive(): boolean {
        return this.classList.contains(SmartCarouselSlide.ACTIVE_CLASS);
    }
    public set isActive(makeActive: boolean) {
        this.classList.toggle(SmartCarouselSlide.ACTIVE_CLASS, makeActive);
    }
}

customElements.define(SmartCarouselSlide.is, SmartCarouselSlide);
export default SmartCarouselSlide;
