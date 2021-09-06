import {flat, range, tuple, uniq, wrap, intersection, union, complement, fullIntersection} from '../array';

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

  test('range', () => {
    expect(range(3)).toEqual([0, 1, 2]);
    expect(range(9, (x) => x / 8)).toEqual([...Array(9).keys()].map((x) => x / 8))
  });
});

test('intersection', () => {
  const a = {a:3};
  expect(intersection([],[])).toEqual([]);
  expect(intersection([1],[1])).toEqual([1]);
  expect(intersection([1, 2], [1, 2])).toEqual([1, 2]);
  expect(intersection([1, [2, 3], a], [a, 1, [2, 3]])).toEqual([1, [2, 3], a, [2, 3]]);
  expect(intersection([null, 1, 2, 3, null, [6]], [4, 5])).toEqual([null, 1, 2, 3, [6], 4, 5, ]);
});

test('union', () => {
  const a = {a:3};
  expect(union([],[])).toEqual([]);
  expect(union([1],[1])).toEqual([1, 1]);
  expect(union([1, 2], [1, 2])).toEqual([1, 2, 1, 2]);
  expect(union([1, [2, 3], a], [a, 1, [2, 3]])).toEqual([1, [2, 3], a, a, 1, [2, 3]]);
  expect(union([null, 1, 2, 3, null, [6]], [4, 5])).toEqual([null, 1, 2, 3, null, [6], 4, 5, ]);
});

test('complement', () => {
  const a = {a: 3};
  expect(complement([],[])).toEqual([]);
  expect(complement([1],[1])).toEqual([]);
  expect(complement([1, 2, 3], [1, 2])).toEqual([3]);
  expect(complement([1, [2, 3], a], [a, 1, [2, 3]])).toEqual([[2, 3]]);
  expect(complement([null, 1, 2, 3, null, [6]], [4, 5])).toEqual([null, 1, 2, 3, null, [6]]);
});

test('fullIntersection', () => {
  const a = {a: 3};
  expect(fullIntersection([],[])).toEqual(true);
  expect(fullIntersection([1],[1])).toEqual(true);
  expect(fullIntersection([1, 2, 3], [1, 2])).toEqual(true);
  expect(fullIntersection([1, [2, 3], a], [a, 1, [2, 3]])).toEqual(false);
  expect(fullIntersection([null, 1, 2, 3, null, [6]], [4, 5])).toEqual(false);
});
