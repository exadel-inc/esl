import {throttle} from '../throttle';

describe('async/throttle', () => {
  test('basic scenario', (done) => {
    const fn = jest.fn();
    const throttled = throttle(fn, 50);

    expect(typeof throttled).toBe('function');

    expect(throttled()).toBeInstanceOf(Promise);
    expect(fn).toBeCalledTimes(1);
    expect(throttled()).toBeInstanceOf(Promise);
    expect(fn).toBeCalledTimes(1);
    setTimeout(() => {
      throttled();
      expect(fn).toBeCalledTimes(1);
    });
    setTimeout(() => {
      expect(fn).toBeCalledTimes(2);
      throttled();
      expect(fn).toBeCalledTimes(3);
      done();
    }, 75);
  }, 150);

  test('test context', () => {
    const fn = function () { return this; };
    const throttled = throttle(fn, 0);

    const context = {};
    return throttled.call(context).then((val: any) => expect(val).toBe(context));
  }, 50);

  test('test deferred result', () => {
    const fn = jest.fn((n) => n + 1);
    const throttled = throttle(fn as (n: number) => number, 50);

    expect(throttled.promise).toBeInstanceOf(Promise);

    throttled(1);
    expect(throttled(2)).toBe(throttled.promise);
    expect(throttled.promise).toBeInstanceOf(Promise);
    throttled(4);
    expect(fn).toBeCalledTimes(1);

    return throttled.promise.then((n) => {
      expect(n).toBe(5);
      expect(fn).toBeCalledTimes(2);
    });
  }, 100);
});
