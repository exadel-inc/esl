class SmartMulticarousel extends HTMLElement {

    private config: {};
    private circleNum: number;

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
        this.addEventListener('smart-mc-anim', this._onAnimate, false);
    }

    private _onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target && target.dataset.slideTarget) {
            this.setActiveIndexes(target.dataset.slideTarget);
        }
    }

    private _onAnimate(event: MouseEvent) {
        // @ts-ignore
        const firstIndex = event.detail.firstIndex;
        // @ts-ignore
        const shiftSlidesCount = event.detail.countSlides;

        const visibleSlidesCount = 3;
        const visibleAreaWidth = 780 * this.slides.length / visibleSlidesCount;
        const slideWidth = 780;

        let trans = 0;
        let left = 0;

        const currentTrans = +this.slides[firstIndex].style.transform.replace(/[^0-9\-]/ig, '');
        const currentLeft = +this.slides[firstIndex].style.left.replace(/[^0-9\-]/ig, '');

        trans = currentTrans - (shiftSlidesCount / visibleSlidesCount) * slideWidth;
        left = currentLeft;

        if ((this.activeIndexes[0] === 0 && shiftSlidesCount > 0) || (firstIndex === 0 && shiftSlidesCount < 0)) {
            left = (shiftSlidesCount > 0) ? currentLeft + visibleAreaWidth : currentLeft - visibleAreaWidth;
            this.activeIndexes.forEach((el) => {
                this.slides[el].style.left = left + 'px';
            });
        } else {
            const startIndex = (firstIndex + visibleSlidesCount + this.slides.length) % this.slides.length;
            const endIndex = shiftSlidesCount > 0 ?
                this.activeIndexes[this.activeIndexes.length - 1] :
                (firstIndex - 1 + this.slides.length) % this.slides.length;

            for (let i = startIndex; i <= endIndex; i++) {
                this.slides[i].style.left = left + 'px';
            }
        }

        this.slides.forEach((el) => {
            el.style.transform = `translateX(${trans}px)`;
        });
    }

    get slides(): HTMLElement[] {
        const els = this.querySelectorAll('[data-slide-item]') as NodeListOf<HTMLElement>;
        return els ? Array.from(els) : [];
    }

    get activeClass() {
        return this.getAttribute('active-slide-class') || 'active-slide';
    }

    get activeIndexes(): number[] {
        return this.slides.reduce((indexes: number[], el, index) => {
            if (el.classList.contains(this.activeClass)) {
                indexes.push(index);
            }
            return indexes;
        }, []);
    }

    public goTo(countSlides: number) {
        const firstIndex = this.activeIndexes[0];
        let numNextSlide = (firstIndex + countSlides + this.slides.length) % this.slides.length;
        const obj = {
            firstIndex,
            countSlides
        };
        if (numNextSlide !== firstIndex) {
            this.activeIndexes.forEach((index) => {
                numNextSlide = (index + countSlides + this.slides.length) % this.slides.length;
                this.slides[index].classList.remove(this.activeClass);
                this.slides[numNextSlide].classList.add(this.activeClass);
            });
            this.triggerAnimation(obj);
            this.triggerSlidesChange();
        }
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

    private triggerAnimation(obj: object) {
        const event = new CustomEvent('smart-mc-anim', {
            bubbles: true,
            detail: obj
        });
        this.dispatchEvent(event);
    }

    private triggerSlidesChange() {
        const event = new CustomEvent('smart-mc-slideschanged', {
            bubbles: true,
        });
        this.dispatchEvent(event);
    }
}

customElements.define(SmartMulticarousel.is, SmartMulticarousel);
export default SmartMulticarousel;
