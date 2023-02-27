/**
 * Group: ES6 shims
 * Target Browsers: `IE11`
 * Object.is support
 * Blatantly stolen from ES6 specs. Kept here for reference.
 * http://wiki.ecmascript.org/doku.php?id=harmony:egal
 */
if (!Object.is) {
  Object.defineProperty(Object, 'is', {
    value(x: any, y: any) {
      return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y;
    },
    enumerable: false
  });
}
