class SmartMultiCarousel extends HTMLElement {

    private config: {};

    static get is() {
        return 'smart-multicarousel';
    }

    constructor() {
        super();
    }

    private connectedCallback() {
        this.classList.add('smart-carousel');
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
        const countShiftSlides = event.detail.countShiftSlides;
        let numNextSlide = 0;

        const visibleSlidesCount = 3;
        const visibleAreaWidth = 780 * this.slides.length / visibleSlidesCount;
        const slideWidth = 780;

        let trans = 0;
        let left = 0;

        const currentTrans = +this.slides[firstIndex].style.transform.replace(/[^0-9\-]/ig, '');
        const currentLeft = +this.slides[firstIndex].style.left.replace(/[^0-9\-]/ig, '');
        trans = currentTrans - (countShiftSlides / visibleSlidesCount) * slideWidth;

        this.activeIndexes.forEach((el) => {
            numNextSlide = (el + countShiftSlides + this.slides.length) % this.slides.length;
            // move to the next circle of slides
            // rearrange next active slides
            if ((numNextSlide < el && countShiftSlides > 0) || (firstIndex === 0 && countShiftSlides < 0)) {
                left = (countShiftSlides > 0) ? currentLeft + visibleAreaWidth : currentLeft - visibleAreaWidth;
                this.slides[numNextSlide].style.left = left + 'px';
            } else {
                this.slides[numNextSlide].style.left = currentLeft + 'px';
            }
        });

        // rearrange slides that have to be between current active indexes and next active indexes
        const startIndex = countShiftSlides > 0 ?
            this.activeIndexes[this.activeIndexes.length - 1] :
            (this.activeIndexes[0] + 1 + countShiftSlides + this.slides.length) % this.slides.length;
        const endIndex = countShiftSlides > 0 ?
            (this.activeIndexes[0] + countShiftSlides + this.slides.length) % this.slides.length :
            this.activeIndexes[0];

        for (let i = startIndex; i <= endIndex; i++) {
            this.slides[i].style.left = currentLeft + 'px';
        }

        // show animation
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

    public goTo(countShiftSlides: number) {
        const firstIndex = this.activeIndexes[0];
        const nextActiveIndexes: number[] = [];
        let numNextSlide = (firstIndex + countShiftSlides + this.slides.length) % this.slides.length;
        const obj = {
            firstIndex,
            countShiftSlides
        };
        if (numNextSlide !== firstIndex) {
            this.triggerAnimation(obj);
            this.activeIndexes.forEach((el) => {
                this.slides[el].classList.remove(this.activeClass);
                numNextSlide = (el + countShiftSlides + this.slides.length) % this.slides.length;
                nextActiveIndexes.push(numNextSlide);
            });

            nextActiveIndexes.forEach((el) => {
                this.slides[el].classList.add(this.activeClass);
            });

            this.triggerSlidesChange({
                countShiftSlides: countShiftSlides + firstIndex
            });
        }
    }

    public setActiveIndexes(target: number | string) {
        const countConfig: number = 3;
        let countShiftSlides: number = 0;

        if ('prev' === target) {
            countShiftSlides = -countConfig;
            // move to previous slides if the count of slides isn't enough and the last slide is active
            if (this.slides.length % countConfig !== 0 && (this.activeIndexes.indexOf(this.slides.length - 1) !== -1)) {
                countShiftSlides = -this.slides.length % countConfig;
            }
        } else if ('next' === target) {
            countShiftSlides = countConfig;
        } else {
            countShiftSlides = countConfig * +target - this.activeIndexes[0];
        }

        // moving to the last slide if the count of slides isn't enough
        const firstNextIndex = (this.activeIndexes[0] + countShiftSlides + this.slides.length) % this.slides.length;
        const countNextSlides = this.slides.length - firstNextIndex;
        if (countNextSlides < countConfig) {
            countShiftSlides = countShiftSlides - countConfig + countNextSlides;
        }

        this.goTo(countShiftSlides);
    }

    private triggerAnimation(obj: {}) {
        const event = new CustomEvent('smart-mc-anim', {
            bubbles: true,
            detail: obj
        });
        this.dispatchEvent(event);
    }

    private triggerSlidesChange(obj: {}) {
        const event = new CustomEvent('smart-mc-slideschanged', {
            bubbles: true,
            detail: obj
        });
        this.dispatchEvent(event);
    }
}

customElements.define(SmartMultiCarousel.is, SmartMultiCarousel);
export default SmartMultiCarousel;
