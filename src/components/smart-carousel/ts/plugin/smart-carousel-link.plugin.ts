import {attr} from '@helpers/decorators/attr';
import SmartCarouselPlugin from './smart-carousel-plugin';
import SmartCarousel from '@components/smart-carousel/ts/smart-carousel';


/**
 * Slide Carousel Link plugin [beta]
 */
class SmartCarouselLinkPlugin extends SmartCarouselPlugin {
	public static is = 'smart-carousel-link-plugin';

	@attr() public to: string;

	private _target: SmartCarousel;

	constructor() {
		super();
		this._onSlideChange = this._onSlideChange.bind(this);
	}

	public bind() {
		if (!this.target) {
			this.target = document.querySelector(this.to);
		}
		if (!(this.target instanceof SmartCarousel)) return;

		console.log('[Smart Carousel Link Plugin]: Carousels linked: ', this.carousel, this.target);
		// TODO: Should be on before slide change
		this.target.addEventListener('sc:slide:changed', this._onSlideChange);
		this.carousel.addEventListener('sc:slide:changed', this._onSlideChange);
	}

	public unbind() {
		this.target && this.target.removeEventListener('sc:slide:changed', this._onSlideChange);
		this.carousel.removeEventListener('sc:slide:changed', this._onSlideChange);
	}

	protected _onSlideChange(e: Event) {
		const $target = e.target === this.carousel ? this.target : this.carousel;
		const $source = e.target === this.carousel ? this.carousel : this.target;
		// TODO: link action more accurate
		$target.goTo($source.firstIndex);
	}

	get target() {
		return this._target;
	}
	set target(target) {
		this._target = target;
	}
}

export default SmartCarouselLinkPlugin;
