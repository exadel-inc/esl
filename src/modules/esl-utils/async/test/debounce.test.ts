import {debounce} from '../debounce';

describe('async/debounce', () => {
  beforeAll(() =>  jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('basic scenario', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);

    expect(debounced()).toBeInstanceOf(Promise);
    expect(debounced()).toBeInstanceOf(Promise);
    jest.advanceTimersByTime(25);
    expect(debounced()).toBeInstanceOf(Promise);
    expect(fn).toBeCalledTimes(0);
    jest.advanceTimersByTime(50);
    expect(fn).toBeCalledTimes(1);
  });

  test('call context', () => {
    const fn = function () { return this; };
    const debounced = debounce(fn, 0);
    const context = {};
    const promise$ = debounced.call(context);
    jest.runAllTimers();
    return expect(promise$).resolves.toBe(context);
  });

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
    const debounced = debounce(fn as (n: number) => number, 20);

    expect(debounced.promise).toBeInstanceOf(Promise);
    expect(debounced(1)).toBe(debounced(2));
    expect(debounced.promise).toBe(debounced(3));
    expect(debounced.promise).toBeInstanceOf(Promise);
    expect(fn).toBeCalledTimes(0);
    jest.advanceTimersByTime(10);
    expect(fn).toBeCalledTimes(0);
    const promise$ = debounced(4);
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(1);

    return expect(promise$).resolves.toBe(5);
  });
});
