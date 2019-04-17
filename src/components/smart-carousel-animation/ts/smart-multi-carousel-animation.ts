import SmartCarouselAnimation from './smart-carousel-animation';

class SmartMultiCarouselAnimation extends SmartCarouselAnimation {

    public animate(nextIndex: number, direction: string) {
        const slideStyles = getComputedStyle(this._carousel.slides[this._carousel.firstIndex]);
        const slideWidth = parseFloat(slideStyles.width) +
            parseFloat(slideStyles.marginLeft) +
            parseFloat(slideStyles.marginRight);
        const areaWidth = slideWidth * this._carousel.slides.length;

        const transitionDuration = parseFloat(slideStyles.transitionDuration) * 1000; // ms
        const currentLeft = parseFloat(slideStyles.left);

        let trans = 0;

        if ((nextIndex === 0 && direction === 'right') || (this._carousel.firstIndex === 0 && direction === 'left')) {
            const left = (direction === 'right') ? currentLeft + areaWidth : currentLeft - areaWidth;

            for (let index = 0; index < this._carousel.config.count; ++index) {
                this._carousel.slides[nextIndex + index].style.left = left + 'px';
            }

            trans = -nextIndex * slideWidth - left;
            this._carousel.slides.forEach((el) => {
                el.style.transform = `translateX(${trans}px)`;
            });

            for (let i = 0; i < this._carousel.config.count; i++) {
                this._carousel.slides[this._carousel.firstIndex + i].style.left = currentLeft + 'px';
                const time = (direction === 'right') ?
                    (transitionDuration / this._carousel.config.count) * i :
                    (transitionDuration / this._carousel.config.count) * (this._carousel.config.count - i - 1);
                if (this._carousel.activeIndexes.indexOf(nextIndex + i) !== -1) {
                    setTimeout(() => {
                        this._carousel.slides[this._carousel.firstIndex + i].style.left = left + 'px';
                        const nextTrans = -nextIndex * slideWidth - left;
                        this._carousel.slides[this._carousel.firstIndex + i].style.transform = `translateX(${nextTrans}px)`;
                    }, time);
                }
            }
        } else {
            trans = -nextIndex * slideWidth - currentLeft;
            this._carousel.slides.forEach((el) => {
                el.style.transform = `translateX(${trans}px)`;
                el.style.left = currentLeft + 'px';
            });
        }

        this._carousel.setAttribute('data-is-animated', 'true');

        setTimeout(() => {
            this._carousel.removeAttribute('data-is-animated');
        }, transitionDuration);

    }
}

export default SmartMultiCarouselAnimation;
