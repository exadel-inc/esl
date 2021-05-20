/**
 * Aggregate is the function decorator similar to {@link debounce} which is collect calls until the `time` from
 * the last call is exceeded and them coll the `callback` with the list of happened original calls arguments.
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
