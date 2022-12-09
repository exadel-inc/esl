/**
 * Group: ES6 shim
 * Target Browsers: `IE11`
 * Array.from polyfill
 * Note: does not support Iterables, consider polyfill from https://github.com/rousan/symbol-es6
 */
if (!Array.from) {
  Array.from = function <T>(object: ArrayLike<T>): T[] {
    return [].slice.call(object);
  };
}
