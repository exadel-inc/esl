import {complement, fullIntersection, intersection, union} from '../set';

describe('set', () => {
  test('intersection', () => {
    const a = {a: 3};
    expect(intersection()).toEqual([]);
    expect(intersection([1])).toEqual([1]);
    expect(intersection([], [])).toEqual([]);
    expect(intersection([1], [1])).toEqual([1]);
    expect(intersection([1, 2, 3], [1, 2], [1, 2, 4])).toEqual([1, 2]);
    expect(intersection([1, [2, 3], a], [a, 1, [2, 3]])).toEqual([1, a]);
    expect(intersection([null, 1, 2, 3, [6]], [4, 5])).toEqual([]);
    expect(intersection([1, 2, 3, [6]], [4, 5, 1, 2], [1])).toEqual([1]);
    expect(intersection([NaN], [NaN])).toEqual([NaN]);
  });

  test('union', () => {
    const a = {a:3};
    expect(union()).toEqual([]);
    expect(union([1])).toEqual([1]);
    expect(union([], [])).toEqual([]);
    expect(union([1], [1])).toEqual([1]);
    expect(union([1, 2], [1, 2], [1, 2])).toEqual([1, 2]);
    expect(union([1, [2, 3], a], [a, 1, [2, 3]])).toEqual([1, [2, 3], a, [2, 3]]);
    expect(union([1, 2, 3, null, [6]], [4, 5], [1, 2, 3, null, [6]], [4, 5])).toEqual([1, 2, 3, null, [6], 4, 5, [6]]);
    expect(union([NaN], [NaN])).toEqual([NaN]);
  });

  test('complement', () => {
    const a = {a: 3};
    expect(complement()).toEqual([]);
    expect(complement([1])).toEqual([1]);
    expect(complement([], [])).toEqual([]);
    expect(complement([1], [1])).toEqual([]);
    expect(complement([1, 2, 3], [1, 2], [1, 2, 5])).toEqual([3]);
    expect(complement([1, [2, 3], a], [a, 1, [2, 3]])).toEqual([[2, 3]]);
    expect(complement([null, 1, 2, 3,  [6]], [4, 5])).toEqual([null, 1, 2, 3, [6]]);
    expect(complement([NaN], [NaN])).toEqual([]);
  });

  test('fullIntersection', () => {
    const a = {a: 3};
    expect(fullIntersection([], [])).toEqual(true);
    expect(fullIntersection([1], [1])).toEqual(true);
    expect(fullIntersection([1, 2, 3], [1, 2])).toEqual(true);
    expect(fullIntersection([1, [2, 3], a], [a, 1, [2, 3]])).toEqual(false);
    expect(fullIntersection([null, 1, 2, 3,  [6]], [4, 5])).toEqual(false);
    expect(fullIntersection([null, 1, 2, 3,  [6]], [4, 5, null, 1, 2, 3,  [6]])).toEqual(false);
  });
});
