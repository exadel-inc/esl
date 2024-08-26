/**
 * Group: DOM API shims ~ ES6 shim group
 * Target Browsers: `IE11`, `Edge < 14`
 * Element.closest polyfill
 */
(function (e: ElementEx): void {
  e.matches = e.matches || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector;
  e.closest = e.closest || function (css: string): Element | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node = this;
    while (node) {
      if (node.matches(css)) return node;
      node = node.parentElement;
    }
    return null;
  };
})(Element.prototype as ElementEx);

interface ElementEx extends Element {
  msMatchesSelector?(selectors: string): boolean;
  mozMatchesSelector?(selectors: string): boolean;
}
