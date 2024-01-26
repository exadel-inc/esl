/**
 * A decorator utility to postpone callback execution once after the main task execution
 * (as a microtask produced with Promise)
 */
export function microtask<T>(fn: (...arg: [T?]) => void, thisArg?: object): (arg?: T) => void {
  let args: T[] = [];
  return function microtaskFn(arg: T): void {
    args.push(arg);
    if ((microtaskFn as any).request) return;
    (microtaskFn as any).request = Promise.resolve().then(() => {
      delete (microtaskFn as any).request;
      fn.call(thisArg || this, args);
      args = [];
    });
  };
}
