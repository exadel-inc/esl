import {identity, noop, tuple} from '../functions';

describe('misc/functions helper tests', () => {
  test('basic', () => {
    expect(noop.call(null, 1, 2, 3)).toBe(undefined);
    expect(identity.call(null, 1, 2, 3)).toBe(1);
  });
  test('tuple', () => {
    expect(tuple([])).toEqual([]);
    expect(tuple([1])).toEqual([[1]]);
    expect(tuple([1, 2])).toEqual([[1, 2]]);
    expect(tuple([1, 2, 3])).toEqual([[1, 2], [3]]);
    expect(tuple([1, 2, 3, 4])).toEqual([[1, 2], [3, 4]]);
    expect(tuple([1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
    expect(tuple([1, 2, 3, 4, 5, 6])).toEqual([[1, 2], [3, 4], [5, 6]]);
  });
});
