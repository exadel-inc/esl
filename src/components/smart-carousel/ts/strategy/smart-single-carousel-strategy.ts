import SmartCarouselStrategy from './smart-carousel-strategy';
import SmartCarousel from '../smart-carousel';

class SmartSingleCarouselStrategy extends SmartCarouselStrategy {

	constructor(carousel: SmartCarousel) {
		super(carousel);
	}

	public onAnimate(nextIndex: number, direction: string) {
		if (this.carousel.firstIndex === nextIndex) {
			return;
		}

		this.carousel.setAttribute('data-is-animated', 'true');
		this.carousel.setAttribute('direction', direction);

		const activeSlide = this.carousel.$slides[this.carousel.firstIndex];
		const nextSlide = this.carousel.$slides[nextIndex];

		activeSlide.classList.add(direction);
		nextSlide.classList.add(direction);

		activeSlide.classList.add('prev');

		activeSlide.addEventListener('animationend', (e) => this._cleanAnimation(e));
		nextSlide.addEventListener('animationend', (e) => this._cleanAnimation(e));
	}

	private _cleanAnimation(event: Event) {
		const target = event.target as HTMLElement;
		const direction = this.carousel.getAttribute('direction');

		target.classList.remove(direction);
		target.classList.remove('prev');

		this.carousel.removeAttribute('data-is-animated');
	}

	// tslint:disable-next-line:no-empty
	public cleanStyles() {
	}
}

export default SmartSingleCarouselStrategy;
