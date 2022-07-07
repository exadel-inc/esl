/**
 * Group: ES6 shim
 * Target Browsers: `IE11`
 * Object.assign polyfill
 */
function toObject(value: any): any {
  if (value === undefined || value === null) throw new TypeError('Cannot convert undefined or null to object');
  if (typeof value === 'boolean') return new Boolean(value);
  if (typeof value === 'number') return new Number(value);
  if (typeof value === 'string') return new String(value);
  if (typeof value === 'symbol') return Object(value);
  return value;
}

function copyProperty(from: any, to: any, name: string): void {
  const desc = Object.getOwnPropertyDescriptor(from, name);
  if (desc !== undefined && desc.enumerable) to[name] = from[name];
}

if (!Object.assign) {
  Object.assign = function assign(target: any, ...sources: any[]): any {
    if (this instanceof Object.assign) throw new TypeError('Invoked as a constructor');
    const to = toObject(target);
    for (let i = 0; i < sources.length; i++) {
      const nextSource = sources[i];
      if (nextSource !== undefined && nextSource !== null) {
        const from = toObject(nextSource);
        const keys = Object.getOwnPropertyNames(from);
        keys.forEach(copyProperty.bind(null, from, to));
        if (Object.getOwnPropertySymbols) {
          const symbols = Object.getOwnPropertySymbols(from);
          symbols.forEach(copyProperty.bind(null, from, to));
        }
      }
    }
    return to;
  };
}
