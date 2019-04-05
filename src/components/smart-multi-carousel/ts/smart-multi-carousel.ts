import SmartAbstractCarousel from '../../smart-abstract-carousel/ts/smart-abstract-carousel';

class SmartMultiCarousel extends SmartAbstractCarousel {

    static get is() {
        return 'smart-multi-carousel';
    }

    constructor() {
        super();
    }

    protected _onAnimate(event: CustomEvent) {
        const firstIndex = event.detail.firstIndex;
        const direction = event.detail.direction;
        const slideStyles = getComputedStyle(this.slides[firstIndex]);
        const slideWidth = parseFloat(slideStyles.width) +
            parseFloat(slideStyles.marginLeft) +
            parseFloat(slideStyles.marginRight);
        const areaWidth = slideWidth * this.slides.length;

        const transitionDuration =  parseFloat(slideStyles.transitionDuration) * 1000; // ms
        const currentLeft = parseFloat(slideStyles.left);

        let trans = 0;

        if ((this.firstIndex === 0 && direction === 'right') || (firstIndex === 0 && direction === 'left')) {
            const left = (direction === 'right') ? currentLeft + areaWidth : currentLeft - areaWidth;

            this.activeIndexes.forEach((el) => {
                this.slides[el].style.left = left + 'px';
            });

            trans = -this.firstIndex * slideWidth - left;
            this.slides.forEach((el) => {
                el.style.transform = `translateX(${trans}px)`;
            });

            for (let i = 0; i < this.config.count; i++) {
                this.slides[firstIndex + i].style.left = currentLeft + 'px';
                const time = (direction === 'right') ? (transitionDuration / this.config.count) * (i + 1) : (transitionDuration / this.config.count) * (this.config.count - i);
                if (this.activeIndexes.indexOf(firstIndex + i) !== -1) {
                    setTimeout(() => {
                        this.slides[firstIndex + i].style.left = left + 'px';
                        const nextTrans = -this.firstIndex * slideWidth - left;
                        this.slides[firstIndex + i].style.transform = `translateX(${nextTrans}px)`;
                    }, time);
                }
            }
        } else {
            trans = -this.firstIndex * slideWidth - currentLeft;
            this.slides.forEach((el) => {
                el.style.transform = `translateX(${trans}px)`;
                el.style.left = currentLeft + 'px';
            });
        }

        this.setAttribute('data-is-animated', 'true');

        setTimeout(() => {
            this.removeAttribute('data-is-animated');
        }, transitionDuration);
    }
}

customElements.define(SmartMultiCarousel.is, SmartMultiCarousel);
export default SmartMultiCarousel;
