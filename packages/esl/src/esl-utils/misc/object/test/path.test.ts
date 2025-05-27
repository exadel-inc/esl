import {getByPath, setByPath, parseKeys, set, get} from '../path';
import type {PathKey, PathKeyDef} from '../path';

describe('misc/object: path', () => {
  const x = Symbol();
  const y = Symbol();

  describe('parseKeys', () => {
    const normalize = (keys: PathKeyDef[]) => keys.map((key) => {
      key.isIndex = !!key.isIndex;
      return key;
    });

    describe('simple', () => {
      test.each([
        ['a', [{key: 'a'}]],
        ['abc', [{key: 'abc'}]],
        ['ab.cd', [{key: 'ab'}, {key: 'cd'}]],
        ['a.b.c', [{key: 'a'}, {key: 'b'}, {key: 'c'}]],
        ['a-b-c', [{key: 'a-b-c'}]],
        ['$a$.#b#.@c@', [{key: '$a$'}, {key: '#b#'}, {key: '@c@'}]]
      ])('Parse "%s" to %p', (path: string, keys: PathKeyDef[]) => {
        expect(normalize(parseKeys(path))).toEqual(normalize(keys));
      });
    });

    describe('index', () => {
      test.each([
        ['[1]', [{key: '1', isIndex: true}]],
        ['[100]', [{key: '100', isIndex: true}]],
        ['a[0]', [{key: 'a'}, {key: '0', isIndex: true}]],
        ['a[0][1]', [{key: 'a'}, {key: '0', isIndex: true}, {key: '1', isIndex: true}]],
        ['a[0].b', [{key: 'a'}, {key: '0', isIndex: true}, {key: 'b'}]],
        ['a[0].b[1]', [{key: 'a'}, {key: '0', isIndex: true}, {key: 'b'}, {key: '1', isIndex: true}]]
      ])('Parse "%s" to %p', (path: string, keys: PathKeyDef[]) => {
        expect(normalize(parseKeys(path))).toEqual(normalize(keys));
      });
    });

    describe('index push', () => {
      test.each([
        ['[]', [{key: '', isIndex: true}]],
        ['a[]', [{key: 'a'}, {key: '', isIndex: true}]],
        ['a[][]', [{key: 'a'}, {key: '', isIndex: true}, {key: '', isIndex: true}]],
      ])('Parse "%s" to %p', (path: string, keys: PathKeyDef[]) => {
        expect(normalize(parseKeys(path))).toEqual(normalize(keys));
      });
    });

    describe('index escape', () => {
      test.each([
        ['[abc]', [{key: 'abc'}]],
        ['[12th]', [{key: '12th'}]],
        ['[12.12]', [{key: '12.12'}]],
        ['[a.b.c]', [{key: 'a.b.c'}]]
      ])('Parse "%s" to %p', (path: string, keys: PathKeyDef[]) => {
        expect(normalize(parseKeys(path))).toEqual(normalize(keys));
      });
    });

    describe('edge cases', () => {
      test.each([
        ['', [{key: ''}]],
        ['.', [{key: ''}]],
        ['..', [{key: ''}, {key: ''}]],
        ['a..b', [{key: 'a'}, {key: ''}, {key: 'b'}]]
        // --- Unhandled cases ---
        // ['[[]]', [{key: '[]'}]],
        // ['[]]', [{key: ']'}]]
        // ['[[]', [{key: '['}]]
        // [']', [{key: ''}]]
        // ['[', [{key: ''}]]
      ])('Parse "%s" to %p', (path: string, keys: PathKeyDef[]) => {
        expect(normalize(parseKeys(path))).toEqual(normalize(keys));
      });
    });
  });

  describe('get', () => {
    describe('simple', () => {
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
        ['a.b.d', {a: {b: {c: {}}}}, undefined],
        // index
        ['[1]', {1: 1}, 1],
        ['a[0]', {a: [1, 2]}, 1],
        ['a[1]', {a: [1, 2]}, 2]
      ])('get key "%s" from %p', (key: string, source: any, expVal: any) => {
        expect(getByPath(source, key)).toEqual(expVal);
      });
    });
  });

  describe('set', () => {
    describe('simple', () => {
      test.each([
        [{}, 'a', x, {a: x}],
        [{}, 'a.b', x, {a: {b: x}}],
        [{}, 'abc', x, {abc: x}],
        [{}, 'a.b.c', x, {a: {b: {c: x}}}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        expect(setByPath(targ, key, val)).toEqual(expVal);
        expect(targ).toEqual(expVal);
      });
    });

    describe('simple override', () => {
      test.each([
        [{b: y}, 'a', x, {a: x, b: y}],
        [{a: {}}, 'a.b', x, {a: {b: x}}],
        [{a: {}}, 'a.1', x, {a: {'1': x}}],
        [{abc: y}, 'abc', x, {abc: x}],
        [{a: {b: {d: y}}}, 'a.b.c', x, {a: {b: {c: x, d: y}}}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        expect(setByPath(targ, key, val)).toEqual(expVal);
      });
    });

    describe('array of simple keys', () => {
      test.each([
        [{}, ['a'], x, {a: x}],
        [{}, [1], x, {'1': x}],
        [[], [0], y, [y]],
        [{}, ['a', 'b'], x, {a: {b: x}}],
        [{c: y}, ['a', 'b'], x, {a: {b: x}, c: y}],
      ])('set to %p key "%s with %p', (targ: any, keys: (number | string)[], val: any, expVal: any) => {
        expect(setByPath(targ, keys, val)).toEqual(expVal);
        expect(targ).toEqual(expVal);
      });
    });

    describe('path keys', () => {
      test.each([
        [{}, [{key: 'a'}], x, {a: x}],
        [{}, [{key: 1}], x, {'1': x}],
        [{}, [{key: 0, isIndex: true}], y, {0: y}],
        [[], [{key: 0}], y, [y]],
        [[], [{key: '', isIndex: true}], y, [y]],
        [{}, [{key: 'a'}, {key: 'b'}], x, {a: {b: x}}],
        [{}, [{key: 'a'}, {key: '', isIndex: true}], x, {a: [x]}],
      ])('set to %p key "%s with %p', (targ: any, keys: PathKey[], val: any, expVal: any) => {
        expect(setByPath(targ, keys, val)).toEqual(expVal);
        expect(targ).toEqual(expVal);
      });
    });

    describe('path keys: override', () => {
      test.each([
        [{a: {c: y}}, [{key: 'a'}, {key: 'b'}], x, {a: {b: x, c: y}}],
        [{a: {b: y}}, [{key: 'a'}, {key: 'b'}], x, {a: {b: x}}],
        [{a: {b: y}}, [{key: 'a'}, {key: 'b', isIndexed: true}, 0], x, {a: {b: [x]}}],
        [[x], [{key: '', isIndex: true}], y, [x, y]],
        [[x], [{key: '0', isIndex: true}], y, [y]]
      ])('set to %p key "%s with %p', (targ: any, keys: PathKey[], val: any, expVal: any) => {
        expect(setByPath(targ, keys, val)).toEqual(expVal);
        expect(targ).toEqual(expVal);
      });
    });

    describe('index support', () => {
      test.each([
        [{}, 'a[0]', x, {a: [x]}],
        [{}, 'a[1]', x, {a: [undefined, x]}],
        [{}, 'a[0][0]', x, {a: [[x]]}],
        [{}, 'a[0][1]', x, {a: [[undefined, x]]}],
        [{}, 'abc[0].b', x, {abc: [{b: x}]}],
        [{}, 'abc[0].b[0]', x, {abc: [{b: [x]}]}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        expect(setByPath(targ, key, val)).toEqual(expVal);
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
        expect(setByPath(targ, key, val)).toEqual(expVal);
      });
    });

    describe('array push', () => {
      test.each([
        [[], '[]', x, [x]],
        [[x], '[]', y, [x, y]],
        [[x, x], '[]', y, [x, x, y]],
        [{a: [x]}, 'a[]', y, {a: [x, y]}]
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        expect(setByPath(targ, key, val)).toEqual(expVal);
      });
    });

    describe('edge cases', () => {
      test.each([
        [{}, '', x, {'': x}],
        [{}, '[abc]', y, {abc: y}], // ???
        [{}, '[a.b.c]', y, {'a.b.c': y}], // ???
        [{}, 'a[a.b.c]', y, {a: {'a.b.c': y}}], // ???
        [{}, '.', x, {'': x}], // ? +
        [{}, 'a..b', x, {a: {'': {b: x}}}], // ? +
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        expect(setByPath(targ, key, val)).toEqual(expVal);
      });
    });
  });

  describe('simple', () => {
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
        ['a.b.d', {a: {b: {c: {}}}}, undefined],
        ['[1]', {'[1]': 1}, 1]
      ])('get key "%s" from %p', (key: string, source: any, expVal: any) => {
        expect(get(source, key)).toEqual(expVal);
      });
    });

    describe('set', () => {
      test.each([
        [{}, 'a', x, {a: x}],
        [{}, 'ab.bc', x, {ab: {bc: x}}],
        [{}, 'a.b.c', x, {a: {b: {c: x}}}],
        [{}, 'abc.[1]', x, {abc: {'[1]': x}}],
        [{}, '[]', x, {'[]': x}],
      ])('Set to %p key \'%s\'', (targ: any, key: string, val: any, expVal: any) => {
        expect(set(targ, key, val)).toEqual(expVal);
        expect(targ).toEqual(expVal);
      });
    });
  });
});
