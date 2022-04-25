import {isEqual, isSimilar} from '../compare';

describe('misc/object: compare', () => {
  describe('isEqual', () => {
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
    const obj = {};

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
      [[1, 2, 3, 4, 5], [3, 2]]
    ])('%p should be deep similar to %p', (a: any, b: any) => expect(isSimilar(a, b)).toBe(true));

    test.each([
      [undefined, null],
      [1, 2],
      ['a', 'b'],

      [{a: 1}, {b: 2}],
      [{a: [1, 2, 3]}, {a: [4]}],
      [{a: null, b: 1}, {a: {}}],
      [{a: {c: {b: 1}, d: 1}}, {a: {b: {c: 1}}}],

      [[3], 3],
      [[], [1]],
      [[1], [1, 2]]
    ])('%p should not be deep similar to %p', (a: any, b: any) => expect(isSimilar(a, b)).toBe(false));

    test.each([
      [null, null],
      [NaN, NaN],
      ['', ''],
      [{}, {}],

      [{a: 1}, {a: 1}],
      [{a: obj}, {a: obj}],
      [{a: 1, c: Infinity}, {c: Infinity}],

      [[obj, {b: ''}], [obj]]
    ])('%p should be flat similar to %p', (a: any, b: any) => expect(isSimilar(a, b, false)).toBe(true));

    test.each([
      [null, undefined],
      [1, 2],
      ['a', 'b'],

      [{a: 1}, {a: 2}],
      [{a: {b: 2}}, {a: {b: 2}}],
      [{a: 1, c: {}}, {c: {}}],

      [[{a: 1}, {b: ''}], [{a: 1}]],
      [[{a: {}}, {b: ''}], [{a: {}}]]
    ])('%p should not be flat similar to %p', (a: any, b: any) => expect(isSimilar(a, b, false)).toBe(false));
  });
});
