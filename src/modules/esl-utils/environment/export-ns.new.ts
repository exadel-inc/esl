const NS_NAME = 'ESL';

/**
 * Nested declaration helper
 */
function define(root: any, name: string, value: any): void {
  name.split('.').reduce((obj: any, key, index, parts) => {
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
export const exportNs = (name: string, context: ClassDecoratorContext): void => {
  if (!(NS_NAME in window)) return;
  context.addInitializer(function () {
    define((window as any)[NS_NAME], name, this);
  });
};

/**
 * Decorator to declare function or class in a global ns
 * @param name - key path to declare in ESL global ns
 * NOTE: path parts should be separated by dots
 * @example
 * ```ts
 * @Export('Package.Component')
 * ```
 * NOTE: in case declaration contains components-packages, their origins will be mixed with declaration in a Runtime
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function ExportNs<T extends Function>(name?: string): Function {
  return (module: T, context: ClassDecoratorContext): void => {
    exportNs(name || context.name, context);
  };
}

/** Declare ESL global */
ExportNs.declare = (): void => {
  if ('ESL' in window) return;
  Object.defineProperty(window, 'ESL', {value: {}});
};
