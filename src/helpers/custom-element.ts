export abstract class CustomElement extends HTMLElement {
	public static is = '';
	public static register(tagName?: string) {
		tagName = tagName || this.is;
		if (!tagName) throw new Error('Can not define custom element');
		if (this.is !== tagName) {
			this.is = tagName;
		}
		customElements.define(tagName, this);
	}
}
