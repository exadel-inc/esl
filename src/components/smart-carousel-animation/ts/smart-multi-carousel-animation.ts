import SmartCarouselAnimation from "./smart-carousel-animation";

class SmartMultiCarouselAnimation extends SmartCarouselAnimation {

    animate(event: CustomEvent) {
            const firstIndex = event.detail.firstIndex;
            const direction = event.detail.direction;
            const slideStyles = getComputedStyle(this._carousel.slides[firstIndex]);
            const slideWidth = parseFloat(slideStyles.width) +
                parseFloat(slideStyles.marginLeft) +
                parseFloat(slideStyles.marginRight);
            const areaWidth = slideWidth * this._carousel.slides.length;

            const transitionDuration =  parseFloat(slideStyles.transitionDuration) * 1000; // ms
            const currentLeft = parseFloat(slideStyles.left);

            let trans = 0;

            if ((this._carousel.firstIndex === 0 && direction === 'right') || (firstIndex === 0 && direction === 'left')) {
                const left = (direction === 'right') ? currentLeft + areaWidth : currentLeft - areaWidth;

                this._carousel.activeIndexes.forEach((el) => {
                    this._carousel.slides[el].style.left = left + 'px';
                });

                trans = -this._carousel.firstIndex * slideWidth - left;
                this._carousel.slides.forEach((el) => {
                    el.style.transform = `translateX(${trans}px)`;
                });

                for (let i = 0; i < this._carousel.config.count; i++) {
                    this._carousel.slides[firstIndex + i].style.left = currentLeft + 'px';
                    const time = (direction === 'right') ?
                        (transitionDuration / this._carousel.config.count) * (i + 1) :
                        (transitionDuration / this._carousel.config.count) * (this._carousel.config.count - i);
                    if (this._carousel.activeIndexes.indexOf(firstIndex + i) !== -1) {
                        setTimeout(() => {
                            this._carousel.slides[firstIndex + i].style.left = left + 'px';
                            const nextTrans = -this._carousel.firstIndex * slideWidth - left;
                            this._carousel.slides[firstIndex + i].style.transform = `translateX(${nextTrans}px)`;
                        }, time);
                    }
                }
            } else {
                trans = -this._carousel.firstIndex * slideWidth - currentLeft;
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
