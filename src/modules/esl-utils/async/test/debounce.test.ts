import {debounce} from '../debounce';

describe('async/debounce', () => {
  test('basic scenario', (done) => {
    const fn = jest.fn();
    const debounced = debounce(fn, 20);

    expect(typeof debounced).toBe('function');

    expect(debounced()).toBeInstanceOf(Promise);
    expect(debounced()).toBeInstanceOf(Promise);
    setTimeout(() => debounced());
    expect(fn).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      done();
    }, 100);
  }, 150);

  test('call context', () => {
    const fn = function () { return this; };
    const debounced = debounce(fn, 0);

    const context = {};
    return debounced.call(context).then((val: any) => expect(val).toBe(context));
  }, 50);

  test('cancel debounce', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 10);
    const promise = debounced();
    debounced();
    debounced.cancel();

    return promise.catch(() => expect(fn).toBeCalledTimes(0))
  }, 100);

  test('deferred result', () => {
    const fn = jest.fn((n) => n + 1);
    const debounced = debounce(fn as (n: number) => number);

    expect(debounced.promise).toBeInstanceOf(Promise);
    expect(debounced(1)).toBe(debounced(2));
    expect(debounced.promise).toBe(debounced(3));
    expect(debounced.promise).toBeInstanceOf(Promise);
    setTimeout(() => debounced(4), 20);
    expect(fn).toBeCalledTimes(0);

    return debounced.promise.then((n) => {
      expect(n).toBe(4);
      expect(fn).toBeCalledTimes(1);
    });
  }, 100);
});
