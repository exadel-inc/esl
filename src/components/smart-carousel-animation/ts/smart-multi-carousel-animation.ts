import SmartCarouselAnimation from './smart-carousel-animation';
import SmartCarousel from '../../smart-carousel/ts/smart-carousel';


class SmartMultiCarouselAnimation extends SmartCarouselAnimation {

	constructor(carousel: SmartCarousel) {
		super(carousel);
	}

	public animate(nextIndex: number, direction: string) {
		const slideStyles = getComputedStyle(this.carousel.$slides[this.carousel.firstIndex]);
		const slideWidth = parseFloat(slideStyles.width) +
			parseFloat(slideStyles.marginLeft) +
			parseFloat(slideStyles.marginRight);
		const areaWidth = slideWidth * this.carousel.$slides.length;

		const transitionDuration = parseFloat(slideStyles.transitionDuration) * 1000; // ms
		const currentLeft = parseFloat(slideStyles.left);

		let trans = 0;

		if ((nextIndex === 0 && direction === 'right' && this.carousel.firstIndex !== 0) || (this.carousel.firstIndex === 0 && direction === 'left')) {
			const left = (direction === 'right') ? currentLeft + areaWidth : currentLeft - areaWidth;

			for (let index = 0; index < this.carousel.activeCount; ++index) {
				this.carousel.$slides[nextIndex + index].style.left = left + 'px';
			}

			trans = -nextIndex * slideWidth - left;
			this.carousel.$slides.forEach((el) => {
				el.style.transform = `translateX(${trans}px)`;
			});

			for (let i = 0; i < this.carousel.activeCount; i++) {
				this.carousel.$slides[this.carousel.firstIndex + i].style.left = currentLeft + 'px';
				const time = (direction === 'right') ?
					(transitionDuration / this.carousel.activeCount) * i :
					(transitionDuration / this.carousel.activeCount) * (this.carousel.activeCount - i - 1);
				if (this.carousel.activeIndexes.indexOf(nextIndex + i) !== -1) {
					setTimeout(() => {
						this.carousel.$slides[this.carousel.firstIndex + i].style.left = left + 'px';
						const nextTrans = -nextIndex * slideWidth - left;
						this.carousel.$slides[this.carousel.firstIndex + i].style.transform = `translateX(${nextTrans}px)`;
					}, time);
				}
			}
		} else {
			trans = -nextIndex * slideWidth - currentLeft;
			this.carousel.$slides.forEach((el) => {
				el.style.transform = `translateX(${trans}px)`;
				el.style.left = currentLeft + 'px';
			});
		}

		this.carousel.setAttribute('data-is-animated', 'true');

		setTimeout(() => {
			this.carousel.removeAttribute('data-is-animated');
		}, transitionDuration);

	}
}

export default SmartMultiCarouselAnimation;
