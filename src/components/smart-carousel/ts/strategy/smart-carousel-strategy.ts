import SmartCarousel from '../smart-carousel';

abstract class SmartCarouselStrategy {

	protected readonly carousel: SmartCarousel;

	protected constructor(carousel: SmartCarousel) {
		this.carousel = carousel;
	}

	public abstract onAnimate(nextIndex: number, direction: string): void;

	public abstract cleanStyles(): void;
}

export default SmartCarouselStrategy;
