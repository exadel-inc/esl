// Shim for modern browsers with ES6 class syntax support
// Shim based on https://github.com/webcomponents/polyfills/blob/master/packages/custom-elements/ts_src/custom-elements.ts
export function shimES5ElementConstructor(BuiltInHTMLElement: typeof HTMLElement): void {
  if (
    // No Reflect, no classes, no need for shim because native custom elements require ES2015 classes or Reflect.
    window.Reflect === undefined || window.customElements === undefined ||
    // The webcomponentsjs custom elements polyfill doesn't require ES2015-compatible construction (`super()` or `Reflect.construct`).
    (window.customElements as any).polyfillWrapFlushCallback) {
    return;
  }

  Object.defineProperty(window, BuiltInHTMLElement.name, {
    value: function HTMLElement() {
      return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
    }
  });
  const Element = (window as any)[BuiltInHTMLElement.name] as typeof HTMLElement;
  Element.prototype = BuiltInHTMLElement.prototype;
  Element.prototype.constructor = Element;
  Object.setPrototypeOf(Element, BuiltInHTMLElement);
}

shimES5ElementConstructor(HTMLElement);
