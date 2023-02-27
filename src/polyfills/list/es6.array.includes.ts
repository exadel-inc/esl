/**
 * Group: ES6 shim
 * Target Browsers: `IE11`, `Edge < 14`
 * Array.prototype.includes polyfill
 */
if (!Array.prototype.includes) {
  Array.prototype.includes = function <T>(item: T, fromIndex?: number): boolean {
    if (item !== item) {
      // NaN case
      return Array.prototype.slice.call(this, fromIndex).some((i: T) => i !== i);
    }
    return Array.prototype.indexOf.call(this, item, fromIndex) !== -1;
  };
}
