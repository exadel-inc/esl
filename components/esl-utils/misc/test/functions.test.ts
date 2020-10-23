import {defined} from '../functions';

describe('misc/functions helper tests', () => {
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
