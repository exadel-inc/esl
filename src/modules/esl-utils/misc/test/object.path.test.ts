import {get, set, setExt} from '../object';

describe('misc/object: path', () => {
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
    const x = Symbol();
    const y = Symbol();

    describe('simple', () => {
      test.each([
        [{}, 'a', x, {a: x}],
        [{}, 'a.b', x, {a: {b: x}}],
        [{}, 'abc', x, {abc: x}],
        [{}, 'a.b.c', x, {a: {b: {c: x}}}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        setExt(targ, key, val);
        expect(targ).toEqual(expVal);
      });
    });

    describe('simple override', () => {
      test.each([
        [{b: y}, 'a', x, {a: x, b: y}],
        [{a: {}}, 'a.b', x, {a: {b: x}}],
        [{abc: y}, 'abc', x, {abc: x}],
        [{a: {b: {d: y}}}, 'a.b.c', x, {a: {b: {c: x, d: y}}}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        setExt(targ, key, val);
        expect(targ).toEqual(expVal);
      });
    });

    describe('array', () => {
      test.each([
        [{}, 'a[0]', x, {a: [x]}],
        [{}, 'a[1]', x, {a: [undefined, x]}],
        [{}, 'a[0][0]', x, {a: [[x]]}],
        [{}, 'a[0][1]', x, {a: [[undefined, x]]}],
        [{}, 'abc[0].b', x, {abc: [{b: x}]}],
        [{}, 'abc[0].b[0]', x, {abc: [{b: [x]}]}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        setExt(targ, key, val);
        expect(targ).toEqual(expVal);
      });
    });

    describe('array override', () => {
      test.each([
        [[], '[0]', x, [x]],
        [[x], '[0]', y, [y]],
        [[x], '[1]', y, [x, y]],
        [[x, y], '[1]', x, [x, x]],
        [{abc: [x, x]}, 'abc[0]', y, {abc: [y, x]}],
        [{abc: [x, x]}, 'abc[1]', y, {abc: [x, y]}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        setExt(targ, key, val);
        expect(targ).toEqual(expVal);
      });
    });

    describe('array push', () => {
      test.each([
        [[], '[]', x, [x]],
        [[x], '[]', y, [x, y]],
        [[x, x], '[]', y, [x, x, y]],
        [{a: [x]}, 'a[]', y, {a: [x, y]}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        setExt(targ, key, val);
        expect(targ).toEqual(expVal);
      });
    });
  });
});
