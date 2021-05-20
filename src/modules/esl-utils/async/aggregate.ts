/**
 * Aggregate is a function decorator that limits decorated function calls to one call in passed `time`.
 * The decorated function `callback` will be called once at the end of the timeout with the list of first arguments in the calls.
 */
export function aggregate<T>(callback: (this: void, args: T[]) => void, time: number) {
  let calls: T[] = [];
  let timeout = 0;

  const emit = () => {
    callback(calls);
    calls = [];
    timeout = 0;
  };

  return function (arg: T) {
    calls.push(arg);
    timeout = timeout || window.setTimeout(emit, time);
  };
}
