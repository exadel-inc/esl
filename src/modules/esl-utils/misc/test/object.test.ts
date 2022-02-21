import {
  defined,
  deepCompare,
  getPropertyDescriptor,
  get,
  set,
  setExt,
  copyDefinedKeys,
  copy,
  omit,
  deepMerge,
  isObject,
  isObjectLike,
  isPrimitive,
  isPrototype,
  isArrayLike
} from '../object';

describe('misc/object', () => {
  describe('Type Guards', () => {
    test('isObject', () => {
      expect(isObject(undefined)).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject('1')).toBe(false);
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(true);
      expect(isObject(() => true)).toBe(false);
    });
    test('isObjectLike', () => {
      expect(isObjectLike(null)).toBe(false);
      expect(isObjectLike({})).toBe(true);
      expect(isObjectLike([])).toBe(true);
      expect(isObjectLike(() => true)).toBe(true);
    });
    test('isPrimitive', () => {
      expect(isPrimitive(undefined)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(0)).toBe(true);
      expect(isPrimitive('')).toBe(true);
      expect(isPrimitive(Symbol())).toBe(true);
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive(() => true)).toBe(false);
    });
    test('isPrototype', () => {
      expect(isPrototype({})).toBe(false);
      class Test {}
      expect(isPrototype(Test)).toBe(false);
      expect(isPrototype(Test.prototype)).toBe(true);
      expect(isPrototype(Array)).toBe(false);
      expect(isPrototype(Array.prototype)).toBe(true);
    });
    test('isArrayLike', () => {
      expect(isArrayLike({})).toBe(false);
      expect(isArrayLike([])).toBe(true);
      expect(isArrayLike([1])).toBe(true);
      expect(isArrayLike({length: 0})).toBe(true);
      expect(isArrayLike({length: 1, 0: null})).toBe(true);
      expect(isArrayLike(document.querySelectorAll('*'))).toBe(true);
    });
  });

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
    ])('%p should be equal to %p', (a: any, b: any) => expect(deepCompare(a, b)).toBe(true));

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
    ])('%p should not be equal to %p', (a: any, b: any) => expect(deepCompare(a, b)).toBe(false));
  });

  describe('getPropertyDescriptor', () => {
    test('simple', () => {
      const object = {
        a: 1,
        get b() { return 2; }
      };
      expect(getPropertyDescriptor(object, 'a')).toBeTruthy();
      expect(getPropertyDescriptor(object, 'b')).toBeTruthy();
      expect(getPropertyDescriptor(object, 'c')).toBeFalsy();

      const descC = {get: () => 3};
      const descD = {value: 4};
      Object.defineProperty(object, 'c', descC);
      Object.defineProperty(object, 'd', descD);

      expect(getPropertyDescriptor(object, 'c')).toHaveProperty('get');
      expect(getPropertyDescriptor(object, 'd')).toHaveProperty('value', 4);
      expect(getPropertyDescriptor(object, 'f')).toBeFalsy();
    });

    test('1 lvl', () => {
      class A {
        a = 1;
        b() { return 2; }
        get c() { return 3; }
      }
      const obj = new A();
      expect(getPropertyDescriptor(obj, 'a')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'b')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'c')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'b')).toHaveProperty('value');
      expect(getPropertyDescriptor(obj, 'c')).toHaveProperty('get');
    });

    test('2 lvl', () => {
      class A {
        a() { return 3; }
        get b() { return 3; }
      }
      class B extends A {}
      const obj = new B();
      expect(getPropertyDescriptor(obj, 'a')).toBeTruthy();
      expect(getPropertyDescriptor(obj, 'b')).toBeTruthy();
    });
  });

  describe('access utils', () => {
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

  describe('copy', () => {

    test.each([
      [undefined, {}],
      [null, {}],
      [{}, {}],
      [[1, 2], {0: 1, 1: 2}],
      [{a: 1, b: {c: 2}}, {a: 1, b: {c: 2}}],
    ])('full copy of %p', (inp, out) => {
      expect(copy(inp)).toEqual(out);
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
      expect(copy(inp, predicate)).toEqual(out);
    });

    test('special cases', () => {
      const obj = {_a: 1, b: 2};
      Object.setPrototypeOf(obj, {c: 3, _d: 4});
      expect(copy(obj, predicate)).toEqual({b: 2});
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
      expect(copyDefinedKeys(inp)).toEqual(out);
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
      expect(omit(inp, keys)).toEqual(out);
    });
  });

  describe('get', () => {
    test.each([
      ['', {a: 1}, undefined],
      ['a', undefined, undefined],
      ['a', null, undefined],
      ['a', 'a', undefined],
      ['a', {}, undefined],
      ['a', {a: 1}, 1],
      ['a.b', {a: 1}, undefined],
      ['a.b', {a: {b: 2}}, 2],
      ['a.b.c', {a: {b: {c: {}}}}, {}],
      ['a.b.d', {a: {b: {c: {}}}}, undefined]
    ])('get key "%s" from %p', (key: string, source: any, expVal: any) => {
      expect(get(source, key)).toEqual(expVal);
    });
  });

  describe('set', () => {
    test.each([
      [{}, 'a', 1, {a: 1}],
      [{}, 'a.b', 1, {a: {b: 1}}],
      [{c: 1}, 'a.b', 1, {a: {b: 1}, c: 1}],
      [{a: {c: 1}}, 'a.b', 1, {a: {b: 1, c: 1}}],
      [{a: 1}, 'a.b', 1, {a: {b: 1}}]
    ])('set to %p key "%s with %p', (targ: any, key: string, val: any, expVal: any) => {
      set(targ, key, val);
      expect(targ).toEqual(expVal);
    });
  });

  describe('setExt', () => {
    test.each([
      [{}, 'a', 1, {a: 1}],
      [{}, 'a.b', 1, {a: {b: 1}}],
      [{c: 1}, 'a.b', 1, {a: {b: 1}, c: 1}],
      [{a: {c: 1}}, 'a.b', 1, {a: {b: 1, c: 1}}],
      [{a: 1}, 'a.b', 1, {a: {b: 1}}],
      [{}, 'a[0]', 1, {a: [1]}],
      [{}, 'a[1]', 1, {a: [undefined, 1]}],
      [{}, 'a[0].b', 1, {a: [{b: 1}]}],
      [{}, 'a[]', 1, {a: [1]}],
      [{a: [2, 3]}, 'a[0]', 1, {a: [1, 3]}],
      [{a: [3, 4]}, 'a[1]', 1, {a: [3, 1]}],
      [{a: [7, 8]}, 'a[]', 1, {a: [7, 8, 1]}],
      [[], '[]', 1, [1]],
      [[1], '[]', 2, [1, 2]],
      [[1, 2], '[1]', 3, [1, 3]]
    ])('set to %p key \'%s\' with %p', (targ: any, key: string, val: any, expVal: any) => {
      setExt(targ, key, val);
      expect(targ).toEqual(expVal);
    });
  });

  describe('deepMerge', () => {
    test.each([
      [{}, {}, {}],
      [{a: [1]}, {a: 1}, {a: 1}],
      [{a: 1}, {b: 2}, {c: 3}, {d: 4}, {a: 1, b: 2, c: 3, d: 4}],
      [{a: 1}, {a: ['2']}, {a: ['2']}],
      [[1, 2], [3], [3, 2]],
      [{a: 1, b: 1}, {a: 2, c: 2}, {a: 2, b: 1, c: 2}],
      [{a: {a: 1, b: 1}, b: 1}, {a: {a: 3, c: 3}}, {a: {a: 3, b: 1, c: 3}, b: 1}],
      [{a: 1}, {b: 2}, {c: 3}, {a: 1, b: 2, c: 3}],
      [{a: 'value', b: 'value'}, {a: null, b: ''}, {a: null, b: ''}],
      [{a: [1, 2, {a: 1, b: 1}]}, {a: [3, 4, {a: 2, b: 2}]}, {a: [3, 4, {a: 2, b: 2}]}]
    ])('basic cases %p %p %p', (...args: any[]) => {
      const result = args.pop();
      expect(deepMerge(...args)).toEqual(result);
    });

    test('merge array + object', () => {
      const res = deepMerge([1, 2], {a: 1});
      const exp: any = [1, 2];
      exp.a = 1;
      expect(res).toEqual(exp);
    });

    test('deep copy object', () => {
      const obj = {a: 1, b: {c: 2}};
      const copyObj = deepMerge(obj);

      expect(copyObj).not.toBe(obj);
      expect(copyObj).toEqual(obj);
      expect(copyObj.b).not.toBe(obj.b);
      expect(copyObj.b).toEqual(obj.b);
    });

    test('deep copy array', () => {
      const obj = [1, 2, {a: 1, b: 3}];
      const copyObj = deepMerge(obj);

      expect(copyObj).not.toBe(obj);
      expect(copyObj).toEqual(obj);
      expect(copyObj[2]).not.toBe(obj[2]);
      expect(copyObj[2]).toEqual(obj[2]);
    });

    test.each([
      [null, {}], // ?? minor
      [{}, undefined, {}],
      [{}, null, {}],
      [{}, 1, {}],
      [{}, 'Hi', {}],
    ])('edge case: %p %p %p', (...args: any[]) => {
      const result = args.pop();
      expect(deepMerge(...args)).toEqual(result);
    });
  });
});
