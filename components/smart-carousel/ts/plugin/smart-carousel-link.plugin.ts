import {attr} from '../../../../core/decorators/attr';
import SmartCarousel from '../smart-carousel';
import SmartCarouselPlugin from './smart-carousel-plugin';

/**
 * Slide Carousel Link plugin. Allows to bind carousel positions.
 */
export class SmartCarouselLinkPlugin extends SmartCarouselPlugin {
	public static is = 'smart-carousel-link-plugin';

	public static get observedAttributes() {
		return ['to', 'direction'];
	}

	@attr() public to: string;
	@attr({defaultValue: 'both'}) public direction: string;

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

		if (this.direction === 'both' || this.direction === 'reverse') {
			this.target.addEventListener('sc:slide:changed', this._onSlideChange);
		}
		if (this.direction === 'both' || this.direction === 'target') {
			this.carousel.addEventListener('sc:slide:changed', this._onSlideChange);
		}
	}

	public unbind() {
		this.target && this.target.removeEventListener('sc:slide:changed', this._onSlideChange);
		this.carousel && this.carousel.removeEventListener('sc:slide:changed', this._onSlideChange);
	}

	protected _onSlideChange(e: CustomEvent) {
		const $target = e.target === this.carousel ? this.target : this.carousel;
		const $source = e.target === this.carousel ? this.carousel : this.target;
		$target.goTo($source.firstIndex, e.detail.direction);
	}

	private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		if (this.carousel && oldVal !== newVal) {
			this.unbind();
			if (attrName === 'to') {
				this._target = null;
			}
			this.bind();
		}
	}

	get target() {
		return this._target;
	}
	set target(target) {
		this._target = target;
	}
}

export default SmartCarouselLinkPlugin;
