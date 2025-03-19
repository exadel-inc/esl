import {copy, copyDefinedKeys, omit, pick} from '../copy';

describe('misc/object: copy', () => {
  describe('copy', () => {
    test.each([
      [undefined, {}],
      [null, {}],
      [{}, {}],
      [[1, 2], {0: 1, 1: 2}],
      [{a: 1, b: {c: 2}}, {a: 1, b: {c: 2}}],
    ])('full copy of %p', (inp, out) => {
      expect(copy(inp as any)).toEqual(out);
    });

    const predicate = (key: string) => !key.startsWith('_');
    test.each([
      [undefined, {}],
      [null, {}],
      [{}, {}],
      [[1, 2], {0: 1, 1: 2}],
      [{_: 1, _b: 1}, {}],
      [{_a: 1, b: 1}, {b: 1}],
      [{a: 1, b: {c: 2}}, {a: 1, b: {c: 2}}],
    ])('copy %p with predicate', (inp, out) => {
      expect(copy(inp as any, predicate)).toEqual(out);
    });

    test('special cases', () => {
      const obj = {_a: 1, b: 2};
      Object.setPrototypeOf(obj, {c: 3, _d: 4});
      expect(copy(obj as any, predicate)).toEqual({b: 2});
    });
  });

  describe('copyDefinedKeys', () => {
    test.each([
      [undefined, {}],
      [null, {}],
      [{}, {}],
      [{a: 1, b: undefined}, {a: 1}],
      [{a: undefined, b: undefined}, {}],
      [{a: 1, b: 2}, {a: 1, b: 2}],
      [{a: 1, b: {}}, {a: 1, b: {}}]
    ])('%p to %p', (inp, out) => {
      expect(copyDefinedKeys(inp as any)).toEqual(out);
    });
  });

  describe('omit', () => {
    test.each([
      [undefined, ['prop'], {}],
      [null, ['prop'], {}],
      [{}, ['prop'], {}],
      [[1, 2], ['0'], {1: 2}],
      [[1, 2], ['0', '1'], {}],
      [{a: 1, b: 1}, ['a', 'b'], {}],
      [{a: 1, b: 1}, ['a'], {b: 1}],
      [{a: 1, b: 1}, ['c'], {a: 1, b: 1}],
      [{a: 1, b: {}}, [], {a: 1, b: {}}],
    ])('omit from %p properties %p', (inp, keys, out) => {
      expect(omit(inp as any, keys)).toEqual(out);
    });
  });

  test('prototype pollution via __proto__', () => {
    const maliciousPayload = '{"a": 1, "__proto__": {"polluted": true}}';
    const a: any = {};
    const copied: any = copy(JSON.parse(maliciousPayload));

    expect(({} as any).polluted).not.toBe(true); // safe Plain Old Javascript Object
    expect(a.polluted).not.toBe(true); // safe a input
    expect(copied.polluted).toBe(true);
  });

  test('prototype pollution via constructor.prototype', () => {
    const maliciousPayload = '{"a": 1, "constructor": {"prototype": {"polluted": true}}}';
    const a: any = {};
    const copied: any = copy(JSON.parse(maliciousPayload));

    expect(({} as any).polluted).not.toBe(true); // safe Plain Old Javascript Object
    expect(a.polluted).not.toBe(true); // safe a input
    expect(copied.constructor.prototype.polluted).toBe(true);
  });

  describe('pick', () => {
    test.each([
      [undefined, ['prop'], {}],
      [null, ['prop'], {}],
      [{}, ['prop'], {}],
      [[1, 2], ['1'], {1: 2}],
      [[1, 2], ['0', '1'], {0: 1, 1: 2}],
      [{a: 1, b: 1}, ['a', 'b'], {a: 1, b: 1}],
      [{a: 1, b: 1}, ['b'], {b: 1}],
      [{a: 1, b: 1}, ['c'], {}],
      [{a: 1, b: {}}, ['a', 'b'], {a: 1, b: {}}],
      [Object.setPrototypeOf({a: 1}, {b: 2}), ['a', 'b'], {a: 1, b: 2}],
    ])('omit from %p properties %p', (inp, keys, out) => {
      expect(pick(inp as any, keys)).toEqual(out);
    });
  });
});
