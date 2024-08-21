type FindPredicate<T> = (T: any, index: number, array: T[]) => boolean;

/**
 * Group: ES6 shim
 * Target Browsers: `IE11`, `Edge < 14`
 * Array.prototype.findIndex && Array.prototype.findIndex
 */
if (typeof Array.prototype.findIndex !== 'function') {
  const findHelper = function <T> (array: T[], predicate: FindPredicate<T>, context: any): {item: T | null, index: number} {
    if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

    const list = Object(array);
    // TODO change after migration  eslint-disable-next-line no-bitwise
    const length = list.length >>> 0;

    for (let i = 0; i < length; i++) {
      if (predicate.call(context, list[i], i, list)) {
        return {item: list[i], index: i};
      }
    }
    return {item: null, index: -1};
  };

  Array.prototype.find = function <T> (predicate: FindPredicate<T>, context: any = window): T | null {
    if (!this) throw new TypeError('Array.prototype.find called on null or undefined');
    return findHelper(this, predicate, context).item;
  };
  Array.prototype.findIndex = function <T> (predicate: FindPredicate<T>, context: any = window): number {
    if (!this) throw new TypeError('Array.prototype.findIndex called on null or undefined');
    return findHelper(this, predicate, context).index;
  };
}
