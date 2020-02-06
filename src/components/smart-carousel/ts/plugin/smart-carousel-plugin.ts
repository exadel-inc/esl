import SmartCarousel from '../smart-carousel';

abstract class SmartCarouselPlugin extends HTMLElement {
	private _carousel: SmartCarousel;

	public get key() {
		return this.nodeName.toLowerCase();
	}
	public get carousel(): SmartCarousel {
		return this._carousel;
	}

	protected connectedCallback() {
		const carousel = (this.constructor as any).freePlacement ? this.closest(SmartCarousel.is) : this.parentNode;
		if (carousel instanceof SmartCarousel) {
			this._carousel = carousel;
		} else {
			throw new Error('Invalid smart-carousel-plugin placement: plugin element should be placed under the smart-carousel node');
		}
		this.carousel._addPlugin(this);
	}
	protected disconnectedCallback() {
		if (this.carousel) {
			this.carousel._removePlugin(this);
			this._carousel = null;
		}
	}

	public abstract bind(): void;

	public abstract unbind(): void;
}

export default SmartCarouselPlugin;
