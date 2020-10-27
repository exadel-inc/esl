const NS_NAME = 'ESL';

/**
 * Nested declaration helper
 */
function define(root: any, name: string, value: any) {
  return name.split('.').reduce((obj: any, key, index, parts) => {
    if (parts.length === index + 1) {
      return (obj[key] = obj[key] || value);
    }
    const type = typeof obj[key];
    if (type !== 'undefined' && type !== 'object' && type !== 'function') {
      throw new Error(`Can not define ${value} on ${name}`);
    }
    return (obj[key] = obj[key] || {});
  }, root);
}

/**
 * Method to manually declare key in library namespace
 * See {@link ExportNs} decorator for details
 */
export const exportNs = (name: string, module: any) => {
  if (!(NS_NAME in window)) return;
  define((window as any)[NS_NAME], name, module);
};

/**
 * Decorator to delare function or class in a global ns
 * @param {string} name - key path to declare in ESL global ns
 * NOTE: path parts should be separated by dots
 * @example @Export('Package.Component')
 * NOTE: in case declaration contains components-packages, their origins will be mixed with declaration in a Runtime
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function ExportNs<T extends Function>(name?: string) {
  return (module: T) => exportNs(name || module.name, module);
}
