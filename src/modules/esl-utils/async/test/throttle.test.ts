import {throttle} from '../throttle';

describe('async/throttle', () => {
  beforeAll(() =>  jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('basic scenario', () => {
    jest.useFakeTimers()
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    expect(throttled()).toBeInstanceOf(Promise);
    expect(fn).toBeCalledTimes(1);
    jest.advanceTimersByTime(50)
    expect(throttled()).toBeInstanceOf(Promise);
    expect(fn).toBeCalledTimes(1);
    jest.advanceTimersByTime(100)
    expect(fn).toBeCalledTimes(2);
    expect(throttled()).toBeInstanceOf(Promise);
    expect(fn).toBeCalledTimes(3);
  });

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
    expect(throttled(1)).toBeInstanceOf(Promise);
    expect(throttled(2)).toBe(throttled.promise);
    expect(throttled.promise).toBeInstanceOf(Promise);
    expect(throttled(4)).toBeInstanceOf(Promise);

    expect(fn).toBeCalledTimes(1);
    expect(fn).lastCalledWith(1);

    const {promise} = throttled;

    jest.advanceTimersByTime(100);
    expect(fn).toBeCalledTimes(2);
    return expect(promise).resolves.toBe(5);
  });
});
