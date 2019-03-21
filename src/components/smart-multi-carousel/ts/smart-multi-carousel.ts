import SmartAbstractCarousel from '../../smart-abstract-carousel/ts/smart-abstract-carousel';

class SmartMultiCarousel extends SmartAbstractCarousel {

    static get is() {
        return 'smart-multi-carousel';
    }

    constructor() {
        super();
    }

    protected _onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target && target.dataset.slideTarget) {
            this.setActiveIndexes(target.dataset.slideTarget);
        }
    }

    protected _onAnimate(event: MouseEvent) {
        // @ts-ignore
        const countShiftSlides = event.detail.countShiftSlides;
        const firstIndex = this.firstIndex;
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

    public goTo(countShiftSlides: number) {
        const firstIndex = this.activeIndexes[0];
        const nextActiveIndexes: number[] = [];
        let numNextSlide = (firstIndex + countShiftSlides + this.slides.length) % this.slides.length;
        const obj = {
            firstIndex,
            countShiftSlides
        };
        if (numNextSlide !== firstIndex) {
            this.triggerSlidesAnimate(obj);
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
}

customElements.define(SmartMultiCarousel.is, SmartMultiCarousel);
export default SmartMultiCarousel;
