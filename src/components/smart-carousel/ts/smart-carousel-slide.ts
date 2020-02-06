/***
 * Slide controller
 * @author Julia Murashko
 */
class SmartCarouselSlide extends HTMLElement {
	static get is() { return 'smart-carousel-slide'; }

	constructor() {
		super();
	}

	protected connectedCallback() {
		//
	}

	public get index(): number {
		return Array.prototype.indexOf.call(this.parentNode.childNodes, this);
	}

	public get active(): boolean {
		return this.hasAttribute('active');
	}

	public _setActive(active: boolean) {
		// TODO: think about public ?
		this.toggleAttribute('active', active);
	}
}

customElements.define(SmartCarouselSlide.is, SmartCarouselSlide);
export default SmartCarouselSlide;
