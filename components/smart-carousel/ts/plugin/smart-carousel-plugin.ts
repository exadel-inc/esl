import {CustomElement} from '../../../smart-utils/abstract/custom-element';
import SmartCarousel from '../smart-carousel';

/**
 * {@link SmartCarousel} Plugin base class.
 * The Smart Carousel Plugin should have the dom representation so it's {@extends HTMLElement}.
 * Use the attributes to path the plugin options, the same as with any custom elements.
 * @abstract
 */
export abstract class SmartCarouselPlugin extends CustomElement {
	/**
	 * {boolean} freePlacement marker define the restriction for the plugin placement.
	 * If freePlacement is false - plugin element should be child of SmartCarousel element.
	 * If freePlacement is true - plugin can be placed anywhere inside of carousel.
	 */
	public static freePlacement = false;

	/**
	 * @returns carousel owner of the plugin
	 */
	protected findCarouselOwner(): SmartCarousel {
		if ((this.constructor as typeof SmartCarouselPlugin).freePlacement) {
			return this.closest(SmartCarousel.is);
		} else {
			return this.parentNode as SmartCarousel;
		}
	}

	private _carousel: SmartCarousel;

	/**
	 * @returns {string} plugin unique key, SmartCarousel can not own more then one plugin with the same key
	 */
	public get key() {
		return this.nodeName.toLowerCase();
	}
	/**
	 * @returns {SmartCarousel} owner of plugin
	 */
	public get carousel(): SmartCarousel {
		return this._carousel;
	}

	protected connectedCallback() {
		const carousel = this.findCarouselOwner();
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

	/**
	 * Define the plugin bind lifecycle hook.
	 * Unlike {@link connectedCallback}, bind is called by owner Smart Carousel when the plugin can be attached.
	 */
	public abstract bind(): void;

	/**
	 * Define the plugin unbind lifecycle hook.
	 * Unlike {@link disconnectedCallback}, unbind is called by owner Smart Carousel when the plugin should be detached.
	 */
	public abstract unbind(): void;

	public static register(tagName?: string) {
		customElements.whenDefined(SmartCarousel.is).then(() => super.register(tagName));
	}
}

export default SmartCarouselPlugin;
