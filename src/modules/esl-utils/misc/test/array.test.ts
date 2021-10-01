import {flat, range, tuple, uniq, wrap, groupBy} from '../array';

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

type V = string | number;

describe('misc/groupBy', () => {
  test.each([
    [[1, 2, 10, 4, 3], (i: number) => i % 2 > 0 ? 'odd' : 'even', { odd: [1, 3], even: [2, 10, 4] }],
    [['cat', 'fat', 'kitten'], (i: string) => i.length, { 3: ['cat', 'fat'], 6: ['kitten']}],
    [['Fog', 'Tea', 'ocean', 'rain'], (i: string) => i[0] === i[0].toUpperCase() ? 'uppercase' : 'lowercase', { uppercase: ['Fog', 'Tea'], lowercase: ['ocean', 'rain']}],
    [[{ a: 2, b: 1 }, {b: 2}, {a: 1}, {}], (i: Record<string, number>) => i['a'] ? i['a'] : 'undefined', { 2: [{a: 2, b: 1}], undefined: [{b: 2}, {}], 1: [{a: 1}] }],
    [[100, 20, 10, 101, 300], (i: number) => String(i)[0], { '1': [100, 10, 101], '2': [20], '3': [300] }],
    [[], (i: any) => i, {}],
    [[[5, 2], [1, 0], [5, 4]], (i: number[]) => i[0], { 5: [[5, 2], [5, 4]], 1: [[1,0]]}]
  ])('array %p with criteria %p to transform into %o', (a: any[], b: (t: any) => V, expected: Record<V, any>) => {
    expect(groupBy(a, b)).toEqual(expected);
  });
});
