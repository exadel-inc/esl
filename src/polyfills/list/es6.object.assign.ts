/**
 * Group: ES6 shim
 * Target Browsers: `IE11`
 * Object.assign polyfill
 */
if (!Object.assign) {
  Object.assign = function assign(target: any, ...sources: any[]): any {
    sources.forEach((source) => {
      Object.keys(source).forEach((key) => {
        target[key] = source[key];
      });
    });
    return target;
  };
}
