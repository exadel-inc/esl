import {aggregate} from '../aggregate';

describe('async/aggregate', () => {
  beforeAll(() =>  jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('shouldn`t make call until timeout passed', () => {
    const fn = jest.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    jest.advanceTimersByTime(1);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(9);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenLastCalledWith([1]);
  });

  test('multiple calls should be aggregated into one', () => {
    const fn = jest.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    agFn(2);
    jest.advanceTimersByTime(2);
    agFn(3);
    agFn(4);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(8);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith([1, 2, 3, 4]);
  });

  test('multiple calls with different data types should be aggregated into one', () => {
    const fn = jest.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    agFn('string');
    agFn({a: false});
    agFn(undefined);

    jest.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith([1, 'string', {a: false}, undefined]);
  });

  test('should make second aggregated call after timeout passed', () => {
    const fn = jest.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    agFn(2);
    jest.advanceTimersByTime(10);
    agFn(3);
    agFn(4);

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith([1, 2]);

    jest.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith([3, 4]);
  });
});
