import {isEqual, isSimilar} from '../compare';

describe('misc/object: compare', () => {
  describe('deepCompare', () => {
    test.each([
      [null, null],
      [NaN, NaN],
      ['', ''],
      [{}, {}],
      [{a: 1}, {a: 1}],
      [{a: null}, {a: null}],
      [{a: []}, {a: []}],
      [{c: NaN}, {c: NaN}],
      [{a: 1, c: Infinity}, {a: 1, c: Infinity}],
      [{a: {b: 1}}, {a: {b: 1}}],
      [{a: {b: {c: 1}}}, {a: {b: {c: 1}}}],
      [[], []],
      [[1], [1]],
      [[1, 2, 3], [1, 2, 3]],
      [[{}, {}], [{}, {}]],
      [[{a: 1}, {b: ''}], [{a: 1}, {b: ''}]]
    ])('%p should be equal to %p', (a: any, b: any) => expect(isEqual(a, b)).toBe(true));

    test.each([
      [undefined, null],
      [1, 2],
      ['a', 'b'],
      [{a: 1}, {b: 2}],
      [{a: null}, {a: {}}],
      [{a: {}}, {a: null}],
      [{b: 1}, {b: 2}],
      [{b: undefined}, {b: null}],
      [{a: {c: {b: 1}}}, {a: {b: {c: 1}}}],
      [{a: {a: 1, b: 1}}, {a: {b: 1}}],
      [{a: {b: 1}}, {a: {a: 1, b: 1}}],
      [[], [1]],
      [[1], [1, 2]],
      [[2, 1], [1, 2]]
    ])('%p should not be equal to %p', (a: any, b: any) => expect(isEqual(a, b)).toBe(false));
  });

  describe('isSimilar', () => {
    test.each([
      [null, null],
      [NaN, NaN],
      ['', ''],
      [{}, {}],

      [{a: 1}, {a: 1}],
      [{a: [1, 2, 3]}, {a: [1]}],
      [{a: [1, 2, 3]}, {a: [2]}],

      [{a: 1, c: Infinity}, {a: 1}],
      [{a: 1, c: Infinity}, {c: Infinity}],
      [{a: {b: {c: 1}}}, {a: {b: {c: 1}}}],
      [[{a: 1}, {b: ''}], [{a: 1}]],

      [[1, 2, 3, 4, 5, 6], [3, 2]]
    ])('%p should be similar to %p', (a: any, b: any) => expect(isSimilar(a, b)).toBe(true));

    test.each([
      [undefined, null],
      [1, 2],
      ['a', 'b'],

      [{a: 1}, {b: 2}],
      [{a: [1, 2, 3]}, {a: [4]}],
      [{a: null, b: 1}, {a: {}}],
      [{a: {c: {b: 1}, d: 1}}, {a: {b: {c: 1}}}],

      [[], [1]],
      [[1], [1, 2]]
    ])('%p should not be similar to %p', (a: any, b: any) => expect(isSimilar(a, b)).toBe(false));
  });
});
