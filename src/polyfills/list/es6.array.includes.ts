/**
 * Group: ES6 shim
 * Target Browsers: IE11, Edge < 14
 * Array.prototype.includes polyfill
 * Require: Object.is
 */
if (!Array.prototype.includes) {
  Array.prototype.includes = function <T> (item: T, fromIndex?: number) {
    if (this == null) throw new TypeError('"this" is null or not defined');

    const list = Object(this);
    // eslint-disable-next-line no-bitwise
    const length = list.length >>> 0;

    if (length === 0) return false;
    // Normalize fromIndex
    let i: number = fromIndex ?
      Math.max(0, fromIndex >= 0 ? fromIndex : length - Math.abs(fromIndex)) :
      0;
    while (i < length) {
      // NaN should be correctly handled by Object.is
      if (Object.is(list[i], item)) return true;
      i++;
    }
    return false;
  };
}
