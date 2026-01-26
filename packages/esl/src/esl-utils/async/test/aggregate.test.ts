import {aggregate} from '../aggregate';

describe('async/aggregate', () => {
  beforeAll(() =>  vi.useFakeTimers());
  afterAll(() => vi.useRealTimers());

  test('shouldn`t make call until timeout passed', () => {
    const fn = vi.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    vi.advanceTimersByTime(1);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(9);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenLastCalledWith([1]);
  });

  test('multiple calls should be aggregated into one', () => {
    const fn = vi.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    agFn(2);
    vi.advanceTimersByTime(2);
    agFn(3);
    agFn(4);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(8);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith([1, 2, 3, 4]);
  });

  test('multiple calls with different data types should be aggregated into one', () => {
    const fn = vi.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    agFn('string');
    agFn({a: false});
    agFn(undefined);

    vi.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith([1, 'string', {a: false}, undefined]);
  });

  test('should make second aggregated call after timeout passed', () => {
    const fn = vi.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    agFn(2);
    vi.advanceTimersByTime(10);
    agFn(3);
    agFn(4);

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith([1, 2]);

    vi.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith([3, 4]);
  });
});
