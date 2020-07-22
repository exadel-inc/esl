// Shim for modern browsers with ES6 class syntax support
// Shim based on https://github.com/webcomponents/polyfills/blob/master/packages/custom-elements/ts_src/custom-elements.ts
(function (BuiltInHTMLElement) {
	if (
		// No Reflect, no classes, no need for shim because native custom elements require ES2015 classes or Reflect.
		window.Reflect === undefined || window.customElements === undefined ||
		// The webcomponentsjs custom elements polyfill doesn't require ES2015-compatible construction (`super()` or `Reflect.construct`).
		(window.customElements as any).polyfillWrapFlushCallback) {
		return;
	}

	Object.defineProperty(window, 'HTMLElement', {
		value: function HTMLElement() {
			return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
		}
	});
	HTMLElement.prototype = BuiltInHTMLElement.prototype;
	HTMLElement.prototype.constructor = HTMLElement;
	Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
})(HTMLElement);