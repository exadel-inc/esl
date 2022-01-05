export function debug() {
  return (target: any, name?: string, descriptor?: any) => {
    let target2 = '' as any;
    if (descriptor) {
      throw new TypeError('Only classes can be decorated via @debug');
    }

    Object.getOwnPropertyNames(target.prototype).forEach((methodName: string) => {

      const descriptor3 = Object.getOwnPropertyDescriptor(target.prototype, methodName) as any;
      const original = descriptor3.value;
      if (descriptor3.get && !original) {
        const now = Date.now();
        const original2 = descriptor3.get;
        descriptor3.configurable = true;
        descriptor3.get = function (...args: any[]) {

          // printArgs(target.constructor.name, name, args);
          const ret = original2.apply(this, args);
          // debug("<= %s.%s: %s", target.constructor.name, name, ret);
          console.log(`[${target.name}][Acessor][get][${methodName}] Execution time: ${Date.now() - now}ms`, ret);
          return ret;
        };
        Object.defineProperty(target2.prototype, methodName, descriptor3);
        // target2.prototype[methodName] = descriptor3;
        return descriptor3;
      }

      if (descriptor3.set && !original) {
        const now = Date.now();
        const original2 = descriptor3.set;
        descriptor3.configurable = true;
        descriptor3.set = function(...args: any[]) {
          const ret = original2.apply(this, args);
          console.log(`[${target.name}][Acessor][set][${methodName}] Execution time: ${Date.now() - now}ms`, ret);
          return ret;
        };
        Object.defineProperty(target2.prototype, methodName, descriptor3);
        return descriptor3;
      }

      if (typeof original !== 'function') {
        return;
      }

      if (methodName === 'constructor') {
        const now = Date.now();
        target2 = class extends target {
          constructor(...args: any[]) {
            super(args);
            console.log(`[${target.name}][Constructor][${methodName}] Execution time: ${Date.now() - now}ms`, args);
          }
        };
      } else {
        target2.prototype[methodName] = function (...args: any[]) {
          const now = Date.now();
          const ret = original.apply(this, args);
          console.log(`[${target.name}][Method][${methodName}] Execution time: ${Date.now() - now}ms`, args);

          return ret;
        };
      }
    });

    return target2;
  };
}
