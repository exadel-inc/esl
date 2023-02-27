/**
 * Group: DOM API shims
 * Target Browsers: `IE11`, `Edge < 18`, `Safari < 13`
 * Element.toggleAttribute polyfill
 */
if (!Element.prototype.toggleAttribute) {
  Element.prototype.toggleAttribute = function (
    name: string,
    force: boolean | undefined
  ): boolean {
    const has = this.hasAttribute(name);
    const state = force === void 0 ? !has : !!force;

    if (has !== state) {
      state ? this.setAttribute(name, '') : this.removeAttribute(name);
    }
    return state;
  };
}
