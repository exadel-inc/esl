class SmartMulticarousel extends HTMLElement {

    private config: {};

    static get is() {
        return 'smart-multicarousel';
    }

    constructor() {
        super();
    }

    private connectedCallback() {
        this.classList.add(SmartMulticarousel.is);
        this.config = this.dataset.config;
        this._bindEvents();
    }

    private disconnectedCallback() {
        this.removeEventListener('click', this._onClick, false);
    }

    private _bindEvents() {
        this.addEventListener('click', (event) => this._onClick(event), false);
        // this.addEventListener('smart-mc-animstart', this._onAnimateStart, false);
        this.addEventListener('smart-mc-anim', this._onAnimate, false);
        // this.addEventListener('smart-mc-animend', this._onAnimateEnd, false);
    }

    private _onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target && target.dataset.slideTarget) {
            this.setActiveIndexes(target.dataset.slideTarget);
        }
    }

    // private _onAnimateStart(event: MouseEvent) {
    //     // @ts-ignore
    //     const className: string = event.detail.numNextSlide > event.detail.index ? 'left-sibling' : 'right-sibling';
    //     // @ts-ignore
    //     this.slides[event.detail.numNextSlide].classList.add(className);
    // }

    private _onAnimate(event: MouseEvent) {
        // @ts-ignore
        this.slides[event.detail.index].classList.add('right-sibling');
        // @ts-ignore
        this.slides[event.detail.numNextSlide].classList.add('left-sibling');
    }

    // private _onAnimateEnd(event: MouseEvent) {
    //     // @ts-ignore
    //     this.slides[event.detail.index].classList.add('prev');
    //     // @ts-ignore
    //     // this.slides[event.detail.numNextSlide].classList.add('left-sibling');
    // }

    get slides(): HTMLElement[] {
        const els = this.querySelectorAll('[data-slide-item]') as NodeListOf<HTMLElement>;
        return els ? Array.from(els) : [];
    }

    get activeClass() {
        return this.getAttribute('active-slide-class') || 'active-slide';
    }

    get activeIndexes(): number[] {
        const indexes: number[] = [];
        this.slides.forEach((el, index) => {
            if (el.classList.contains(this.activeClass)) {
                indexes.push(index);
            }
        });
        return indexes;
    }

    public goTo(countSlides: number) {
        this.activeIndexes.forEach((index) => {
            const numNextSlide = (index + countSlides + this.slides.length) % this.slides.length;
            this.triggerAnimationStart(index, numNextSlide);
            this.slides[index].classList.remove(this.activeClass);
            this.slides[numNextSlide].classList.add(this.activeClass);
            this.triggerAnimation(index, numNextSlide);
            this.triggerAnimationEnd(index, numNextSlide);
        });
        // this.triggerSlidesChange(countSlides);
    }

    public setActiveIndexes(target: number | string) {
        const countConfig: number = 3;
        let countSlides: number = 0;
        if ('prev' === target) {
            countSlides = -countConfig;
        } else if ('next' === target) {
            countSlides = countConfig;
        } else {
            countSlides = countConfig * +target - this.activeIndexes[0];
        }

        this.goTo(countSlides);
    }

    private triggerAnimation(index: number, numNextSlide: number) {
        const event = new CustomEvent('smart-mc-anim', {
            bubbles: true,
            detail: {
                index,
                numNextSlide
            }
        });
        this.dispatchEvent(event);
    }

    private triggerAnimationStart(index: number, numNextSlide: number) {
        const event = new CustomEvent('smart-mc-animstart', {
            bubbles: true,
            detail: {
                index,
                numNextSlide
            }
        });
        this.dispatchEvent(event);
    }

    private triggerAnimationEnd(index: number, numNextSlide: number) {
        const event = new CustomEvent('smart-mc-animend', {
            bubbles: true,
            detail: {
                index,
                numNextSlide
            }
        });
        this.dispatchEvent(event);
    }
}

customElements.define(SmartMulticarousel.is, SmartMulticarousel);
export default SmartMulticarousel;
