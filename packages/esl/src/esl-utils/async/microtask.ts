/**
 * A decorator utility to postpone callback execution once after the main task execution
 * (as a microtask produced with Promise)
 */
export function microtask<T>(fn: (args?: T[]) => void, thisArg?: object): (arg?: T) => void {
  let args: T[] = [];
  return function microtaskFn(this: object, arg?: T): void {
    if (arguments.length) args.push(arg as T);
    if ((microtaskFn as any).request) return;
    (microtaskFn as any).request = Promise.resolve().then(() => {
      delete (microtaskFn as any).request;
      fn.call(thisArg || this, args);
      args = [];
    });
  };
}
