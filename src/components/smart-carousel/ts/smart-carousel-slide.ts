/***
 * Slide controller
 * @author Julia Murashko
 */
import {CustomElement} from '@helpers/custom-element';

class SmartCarouselSlide extends CustomElement {
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
		if (active) {
			this.setAttribute('active', '');
		} else {
			this.removeAttribute('active');
		}
	}
}

export default SmartCarouselSlide;
