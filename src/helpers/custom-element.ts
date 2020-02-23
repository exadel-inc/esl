/**
 * Base class for SmartLibrary custom elements.
 * Allows to define custom element with the optional custom tag name.
 */
export abstract class CustomElement extends HTMLElement {
	public static is = '';

	// tslint:disable-next-line:ban-types
	public static register(this: Function & typeof CustomElement, tagName?: string) {
		tagName = tagName || this.is;
		if (!tagName) throw new Error('Can not define custom element');
		if (this.is !== tagName) {
			this.is = tagName;
		}
		customElements.define(tagName, this);
	}
}
