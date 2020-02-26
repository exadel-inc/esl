/**
 * Base class for SmartLibrary custom elements.
 * Allows to define custom element with the optional custom tag name.
 * @abstract
 */
export abstract class CustomElement extends HTMLElement {
	public static is = '';
	public static eventNs = '';

	/**
	 * Register component in a {customElements} registry
	 * @param {string} tagName - tag name to register custom element
	 */
	// tslint:disable-next-line:ban-types
	public static register(this: Function & typeof CustomElement, tagName?: string) {
		tagName = tagName || this.is;
		if (!tagName) throw new Error('Can not define custom element');
		if (this.is !== tagName) {
			this.is = tagName;
		}
		customElements.define(tagName, this);
	}

	/**
	 * Dispatch component custom event.
	 * Will append prefix from static property {eventNs} if it is defined.
	 * @param {string} eventName -  event name
	 * @param {CustomEventInit} eventInit - event init
	 * @param {boolean} callNative - should the method try to invoke native event
	 */
	public dispatchCustomEvent(eventName: string,
	                           eventInit: CustomEventInit = {bubbles: true},
	                           callNative = false): boolean {
		const component = this.constructor as typeof CustomElement;
		const eventFullName = (component.eventNs ? `${component.eventNs}:` : '') + eventName;
		const event = new CustomEvent(eventFullName, eventInit);
		if (callNative && this.invokeNativeEventHandler(eventName, event)) return false;
		return this.dispatchEvent(event);
	}

	/**
	 * Invoke execution of native event (event that holding in on{eventName} attribute or property)
	 * @param {string} eventName - event name
	 * @param {Event} event - event definition
	 */
	protected invokeNativeEventHandler(eventName: string, event: Event): boolean | undefined {
		const eventHandlerName = 'on' + eventName.replace(/:/g,'-');
		const eventHandlerAttr = this.getAttribute(eventHandlerName);
		if (eventHandlerAttr && typeof (this as any)[eventHandlerName] !== 'function') {
			try {
				// TODO: replace with simple subscription on connected callback
				return (new Function('event', eventHandlerAttr)).call(this, event) === false;
			} catch (e) {
				console.log(`Error executing ${this.tagName} ${eventName} hook function.\n ${e}`);
			}
		}
	}
}