/**
 * Group: ES6 shim
 * Target Browsers: `IE11`
 * Object.assign polyfill
 */
if (!Object.assign) {
  Object.assign = function assign(target: any, ...sources: any[]): any {
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (!source || typeof source !== 'object' && typeof source !== 'function') continue;
      const keys =  Object.keys(source);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        target[key] = source[key];
      }
    }
    return target;
  };
}
