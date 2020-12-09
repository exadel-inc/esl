import {defined, identity, noop} from '../functions';

describe('misc/functions', () => {
  test('noop', () => {
    expect(noop()).toBeUndefined();
    expect(noop(1, 2, 3)).toBeUndefined();
  });

  test('identity', () => {
    expect(identity(1)).toBe(1);
    const test = Symbol('test');
    expect(identity(test)).toBe(test);
  });

  test('defined', () => {
    expect(defined('a')).toBe('a');
    expect(defined('', 'a')).toBe('');
    expect(defined('a', '')).toBe('a');
    expect(defined(undefined, 'a')).toBe('a');
    expect(defined(null, 'a')).toBe(null);
    const obj = {};
    expect(defined(obj, null)).toBe(obj);
  });
});
