/**
 * Aggregate is a function decorator that limits decorated function calls to one call in passed `time`.
 * The decorated function `callback` will be called once at the end of the timeout with the list of the first arguments in the calls.
 */
export function aggregate<T>(callback: (this: void, args: T[]) => void, time: number) {
  let params: T[] = [];
  let timeout = 0;

  const emit = () => {
    callback(params);
    params = [];
    timeout = 0;
  };

  return function (arg: T) {
    params.push(arg);
    timeout = timeout || window.setTimeout(emit, time);
  };
}
