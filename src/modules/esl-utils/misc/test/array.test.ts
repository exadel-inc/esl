import {flat, tuple, uniq, wrap} from '../array';

describe('misc/array helper tests', () => {
  test('tuple', () => {
    expect(tuple([])).toEqual([]);
    expect(tuple([1])).toEqual([[1]]);
    expect(tuple([1, 2])).toEqual([[1, 2]]);
    expect(tuple([1, 2, 3])).toEqual([[1, 2], [3]]);
    expect(tuple([1, 2, 3, 4])).toEqual([[1, 2], [3, 4]]);
    expect(tuple([1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
    expect(tuple([1, 2, 3, 4, 5, 6])).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  test('flat', () => {
    expect(flat([])).toEqual([]);
    expect(flat([1])).toEqual([1]);
    expect(flat([1, 2])).toEqual([1, 2]);
    expect(flat([1, [2, 3]])).toEqual([1, 2, 3]);
    expect(flat([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
    expect(flat([[1], [2, 3, 4], [], [5]])).toEqual([1, 2, 3, 4, 5]);
    expect(flat([null, 1, 2, 3, [4, 5], null, [6]])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('wrap', () => {
    expect(wrap(null)).toEqual([]);
    expect(wrap(undefined)).toEqual([]);
    expect(wrap([])).toEqual([]);
    expect(wrap(1)).toEqual([1]);
    expect(wrap([1])).toEqual([1]);
    expect(wrap([1, 2])).toEqual([1, 2]);
  });

  test('uniq', () => {
    expect(uniq([])).toEqual([]);
    expect(uniq([1])).toEqual([1]);
    expect(uniq([1, 1, 1, 1])).toEqual([1]);
    expect(uniq([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(uniq([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
    expect(uniq([NaN, NaN])).toEqual([NaN]);
    expect(uniq([[1], [2], [1]])).toEqual([[1], [2], [1]]);
  });
});
