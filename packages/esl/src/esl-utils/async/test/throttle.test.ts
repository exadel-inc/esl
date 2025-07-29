import {throttle} from '../throttle';

describe('async/throttle', () => {
  beforeAll(() =>  jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('basic scenario', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    expect(throttled()).toBeUndefined();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(50);
    expect(throttled()).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(throttled()).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('test context', () => {
    const fn = function () { return this; };
    const throttled = throttle(fn, 0);

    const context = {};
    throttled.call(context);
    const promise$ = throttled.promise;
    jest.runAllTimers();
    return expect(promise$).resolves.toBe(context);
  });

  test('call context bind', () => {
    const fn = function () { return this; };
    const context = {};
    const throttled = throttle(fn, 0, context);

    throttled.call({});
    const promise$ = throttled.promise;
    jest.runAllTimers();
    return expect(promise$).resolves.toBe(context);
  });

  test('test deferred result', () => {
    const fn = jest.fn((n) => n + 1);
    const throttled = throttle(fn as (n: number) => number, 50);

    expect(throttled.promise).toBeInstanceOf(Promise);
    expect(throttled(1)).toBeUndefined();
    jest.advanceTimersByTime(1);
    expect(throttled(2)).toBeUndefined();
    expect(throttled.promise).toBeInstanceOf(Promise);
    expect(throttled(4)).toBeUndefined();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(1);

    const {promise} = throttled;

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    return expect(promise).resolves.toBe(5);
  });
});
