import SmartCarousel from '../smart-carousel';

abstract class SmartCarouselPlugin {

	private readonly _carousel: SmartCarousel;

	protected constructor(carousel: SmartCarousel) {
		this._carousel = carousel;
	}

	abstract bind(): void;

	abstract destroy(): void;
}

export default SmartCarouselPlugin;
