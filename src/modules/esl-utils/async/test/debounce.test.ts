import {debounce} from '../debounce';

describe('async/debounce tests', () => {
  test('basic test', (done) => {
    const fn = jest.fn();
    const debounced = debounce(fn, 20);

    expect(typeof debounced).toBe('function');

    expect(fn).toBeCalledTimes(0);
    expect(debounced()).toBeInstanceOf(Promise);
    expect(debounced()).toBeInstanceOf(Promise);
    setTimeout(() => debounced());
    expect(fn).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      done();
    }, 100);
  }, 200);

  test('debounce deferred result test', () => {
    const fn = jest.fn((n) => n + 1);
    const debounced = debounce(fn as (n: number) => number);

    expect(fn).toBeCalledTimes(0);
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
