import {defined, deepCompare, getPropertyDescriptor, get, set} from '../object';

describe('misc/object', () => {
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
    test('simple', ()=> {
      const object = {
        a: 1,
        get b() {return 2}
      };
      expect(getPropertyDescriptor(object, 'a')).toBeTruthy();
      expect(getPropertyDescriptor(object, 'b')).toBeTruthy();
      expect(getPropertyDescriptor(object, 'c')).toBeFalsy();

      const descC = {get: () => 3};
      const descD = { value: 4 };
      Object.defineProperty(object, 'c', descC);
      Object.defineProperty(object, 'd', descD);

      expect(getPropertyDescriptor(object, 'c')).toHaveProperty('get');
      expect(getPropertyDescriptor(object, 'd')).toHaveProperty('value', 4);
      expect(getPropertyDescriptor(object, 'f')).toBeFalsy();
    });

    test('1 lvl', ()=> {
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
      expect(getPropertyDescriptor(obj, 'c')).toHaveProperty('get')
    });

    test('2 lvl', ()=> {
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
      expect(get(source, key)).toEqual(expVal)
    });
  });

  describe('set', () => {
    test.each([
      [{}, 'a', 1, {a: 1}],
      [{}, 'a.b', 1, {a: {b: 1}}],
      [{c: 1}, 'a.b', 1, {a: {b: 1}, c: 1}],
      [{a: {c: 1}}, 'a.b', 1, {a: {b: 1, c: 1}}],
      [{a: 1}, 'a.b', 1, {a: {b: 1}}]
    ])('get key "%s" from %p', (targ: any, key: string, val: any, expVal: any) => {
      set(targ, key, val);
      expect(targ).toEqual(expVal)
    });
  });
});
