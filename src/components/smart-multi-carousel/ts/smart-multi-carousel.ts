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
        const firstIndex = event.detail.firstIndex;
        // @ts-ignore
        const direction = event.detail.direction;

        const slideWidth = 260;
        const visibleAreaWidth = slideWidth * this.slides.length;

        let left = 0;
        const currentLeft = +this.slides[firstIndex].style.left.replace(/[^0-9\-]/ig, '');

        this.activeIndexes.forEach((el) => {
            // move to the next circle of slides
            // rearrange next active slides
            if ((this.firstIndex === 0 && direction === 'right') || (firstIndex === 0 && direction === 'left')) {
                left = (direction === 'right') ? currentLeft + visibleAreaWidth : currentLeft - visibleAreaWidth;
                this.slides[el].style.left = left + 'px';
            } else {
                this.slides[el].style.left = currentLeft + 'px';
                left = currentLeft;
            }
        });

        const trans = -this.firstIndex * slideWidth - left;

        // rearrange slides that have to be between current active indexes and next active indexes
        const startIndex = (direction === 'right') ? firstIndex + this.config.count - 1 : this.firstIndex + this.config.count - 1;
        const endIndex = (direction === 'right') ? this.firstIndex : firstIndex;

        for (let i = startIndex; i <= endIndex; i++) {
            this.slides[i].style.left = currentLeft + 'px';
        }

        // show animation
        this.slides.forEach((el) => {
            el.style.transform = `translateX(${trans}px)`;
        });
    }

    public setActiveIndexes(target: number | string) {
        const firstIndex = this.firstIndex;
        let direction = '';

        if ('prev' === target) {
            this.prev();
            direction = (this.size / this.config.count < 2) ? 'right' : 'left';
        } else if ('next' === target) {
            this.next();
            direction = (this.size / this.config.count < 2) ? 'left' : 'right';
        } else {
            this.goTo(this.config.count * +target);
            direction = (firstIndex < this.config.count * +target) ? 'right' : 'left';
        }

        this.triggerSlidesAnimate({
            firstIndex,
            direction
        });

        this.triggerSlidesChange();
    }
}

customElements.define(SmartMultiCarousel.is, SmartMultiCarousel);
export default SmartMultiCarousel;
