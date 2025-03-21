import {memoizeFn} from '../memoize';

describe('misc/memoize', () => {
  test('cache / clear', () => {
    const fn = jest.fn();
    const memoFn = memoizeFn(fn);
    fn.mockReturnValue(null);
    expect(memoFn()).toBe(null);
    expect(memoFn()).toBe(null);
    expect(fn).toBeCalledTimes(1);
    expect(memoFn.has()).toBe(true);

    memoFn.clear();
    fn.mockReturnValue(1);
    expect(memoFn.has()).toBe(false);
    expect(memoFn()).toBe(1);
    expect(memoFn()).toBe(1);
    expect(memoFn.has()).toBe(true);
    expect(fn).toBeCalledTimes(2);
  });

  test('multi-arg', () => {
    const fn = jest.fn((a) => a + 1);
    const memoFn = memoizeFn(fn);
    expect(memoFn(1)).toBe(2);
    expect(memoFn(1)).toBe(2);
    expect(fn).toBeCalledTimes(1);
    expect(memoFn.has(1)).toBe(true);
    expect(memoFn.has(2)).toBe(false);

    expect(memoFn(2)).toBe(3);
    expect(memoFn(2)).toBe(3);
    expect(memoFn.has(2)).toBe(true);
    expect(fn).toBeCalledTimes(2);
  });

  test('multi-arg hashFn', () => {
    const fn = jest.fn((a, b) => a + b);
    const memoFn = memoizeFn(fn, (a, b) => `${a}+${b}`);
    expect(memoFn(1, 2)).toBe(3);
    expect(memoFn(1, 1)).toBe(2);
    expect(memoFn(1, 2)).toBe(3);
    expect(memoFn.has(1, 1)).toBe(true);
    expect(memoFn.has(1, 2)).toBe(true);
    expect(memoFn.has(1, 3)).toBe(false);
    expect(fn).toBeCalledTimes(2);
    expect(memoFn(1, 1)).toBe(2);
    expect(fn).toBeCalledTimes(2);
  });

  test('declined hash', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fn = jest.fn((a, b) => a + b);
    const memoFn = memoizeFn(fn);
    expect(memoFn(1, 2)).toBe(3);
    expect(memoFn(1, 1)).toBe(2);
    expect(memoFn(1, 2)).toBe(3);
    expect(memoFn.has(1, 1)).toBe(false);
    expect(memoFn.has(1, 2)).toBe(false);
    expect(fn).toBeCalledTimes(3);
  });
});
