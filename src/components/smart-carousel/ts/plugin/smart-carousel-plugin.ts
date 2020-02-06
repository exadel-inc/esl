import SmartCarousel from '../smart-carousel';

abstract class SmartCarouselPlugin extends HTMLElement {
	private _carousel: SmartCarousel;

	public get key() {
		return this.nodeName.toLowerCase();
	}
	protected get carousel(): SmartCarousel {
		return this._carousel;
	}

	protected connectedCallback() {
		if (this.parentNode instanceof SmartCarousel) {
			this._carousel = this.parentNode;
		} else {
			throw new Error('Invalid smart-carousel-plugin placement: plugin element should be placed under the smart-carousel node');
		}
		this.carousel.addPlugin(this);
	}
	protected disconnectedCallback() {
		this.carousel.removePlugin(this);
	}

	public abstract bind(): void;

	public abstract unbind(): void;
}

export default SmartCarouselPlugin;
