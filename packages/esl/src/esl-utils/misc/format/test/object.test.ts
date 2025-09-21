import {parseObject} from '../object';

describe('misc/format - extended object parser', () => {
  // ---------------------------------------------------------------------------
  // Primitives
  // ---------------------------------------------------------------------------
  describe('primitives', () => {
    test.each([
      ['null', null],
      ['true', true],
      ['false', false],
      [' true ', true],
      [' false ', false],
      ['0', 0],
      ['-0', -0],
      ['+0', 0],
      ['1', 1],
      ['001', 1],
      ['-1', -1],
      ['3.1415', 3.1415],
      ['-0.0', -0],
      ['1e3', 1000],
      ['1E3', 1000],
      ['1e-3', 0.001],
      ['-2E+2', -200],
      ['""', ''], // empty JSON string
      ['"simple"', 'simple'],
      ['" spaced value "', ' spaced value '],
      ['"with \\n newline"', 'with \n newline'],
      ['"with unicode: \\u0041"', 'with unicode: A'],
      ['"escapes \\t \\r"', 'escapes \t \r'],
      ['\'single\'', 'single'],
      ['\'with "double quotes" inside\'', 'with "double quotes" inside'],
      ['\'with \\n newline\'', 'with \n newline'],
      ['\'\'', ''] // empty single quoted string
    ])('parseObject(%p) -> %p', (value, expected) => {
      const result = parseObject(value);
      if (Object.is(expected, -0)) {
        expect(Object.is(result, -0)).toBe(true);
      } else {
        expect(result).toBe(expected);
      }
    });

    test('whitespace only -> null', () => {
      expect(parseObject('   ')).toBeNull();
    });

    test('null argument (runtime) -> null', () => {
      expect(parseObject(null as any)).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Strict JSON passthrough
  // ---------------------------------------------------------------------------
  describe('strict JSON', () => {
    test.each([
      ['{}', {}],
      ['{"a":1}', {a: 1}],
      ['{"b":"test"}', {b: 'test'}],
      ['{"a":true, "b":"test"}', {a: true, b: 'test'}],
      ['[{"a":1}, {"b":2}]', [{a: 1}, {b: 2}]],
      ['[true, false, null]', [true, false, null]]
    ])('parseObject(%p) deep equal expected', (value, expected) => {
      expect(parseObject(value)).toEqual(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // Arrays (extended separators and trailing comma support)
  // ---------------------------------------------------------------------------
  describe('arrays', () => {
    test.each([
      ['[]', []],
      ['[1, 2]', [1, 2]],
      ['[{}, {"a": 1}]', [{}, {a: 1}]],
      ['[1,2,]', [1, 2]],
      ['[1;2;3]', [1, 2, 3]],
      ['[ true ; false , null ]', [true, false, null]],
      ['[{a:1};{b:2,}]', [{a: 1}, {b: 2}]],
      ['[ [1;2]; [3,4,] ]', [[1, 2], [3, 4]]]
    ])('parseObject(%p) -> %p', (value, expected) => {
      expect(parseObject(value)).toEqual(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // Extended object syntax (single quotes, unquoted keys, numeric keys, trailing separators)
  // ---------------------------------------------------------------------------
  describe('extended object syntax', () => {
    test.each([
      ['{\'a\': 1}', {a: 1}],
      ['{\'a\': 1,}', {a: 1}],
      ['{\'b\': \'test\'}', {b: 'test'}],
      ['{a: true, b: \'test\'}', {a: true, b: 'test'}],
      ['{0: 1}', {'0': 1}],
      ['{_a:1, $b:2}', {_a: 1, $b: 2}],
      ['{a :1 , b:2,}', {a: 1, b: 2}],
      ['{a:1; b:2}', {a: 1, b: 2}],
      ['{a:{b:1; c:2}}', {a: {b: 1, c: 2}}],
      ['{a:{1:2}}', {a: {'1': 2}}],
      ['{a:[{b:1;},{c:2}]}', {a: [{b: 1}, {c: 2}]}],
      ['{a:[1,2,3,],}', {a: [1, 2, 3]}],
      ['{0:{1:{2:3}}}', {'0': {'1': {'2': 3}}}]
    ])('parseObject(%p) -> %p', (value, expected) => {
      expect(parseObject(value)).toEqual(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // Top level braces omission (object shorthand)
  // ---------------------------------------------------------------------------
  describe('top-level object shorthand (no outer braces)', () => {
    test.each([
      ['a: 1', {a: 1}],
      ['a: \'test\', b: 2', {a: 'test', b: 2}],
      ['a:1,', {a: 1}],
      ['a:1; b:{c:2; d:\'test\'; e:[1;2;3,]}', {a: 1, b: {c: 2, d: 'test', e: [1, 2, 3]}}],
      ['a:1; b:2; c:3', {a: 1, b: 2, c: 3}],
      ['a:1; b:2;', {a: 1, b: 2}],
      ['_a:1; $b:2', {_a: 1, $b: 2}],
      ['0:1', {'0': 1}],
      ['0:{a:1}', {'0': {a: 1}}],
      ['a:[1;2;3]; b:{c:1}', {a: [1, 2, 3], b: {c: 1}}],
      ['a : 1 ; b : 2', {a: 1, b: 2}]
    ])('parseObject(%p) -> %p', (value, expected) => {
      expect(parseObject(value)).toEqual(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // String literal content (should remain opaque)
  // ---------------------------------------------------------------------------
  describe('string literal edge cases', () => {
    test.each([
      ['{a: \'say "hello"\'}', {a: 'say "hello"'}],
      ['{a: \'{b:2, c:3}\'}', {a: '{b:2, c:3}'}],
      ['{a: \'text with [1,2]; and {x:y}\'}', {a: 'text with [1,2]; and {x:y}'}],
      ['a: \'commas,semicolons;colons:inside\'', {a: 'commas,semicolons;colons:inside'}],
      ['{a: \'@__STR0__ literal\'}', {a: '@__STR0__ literal'}],
      ['{a: \'tricky ,,, ;; ; :: { } [ ]\'}', {a: 'tricky ,,, ;; ; :: { } [ ]'}],
      ['{a: \'ends with semicolon;\'}', {a: 'ends with semicolon;'}]
    ])('parseObject(%p) -> %p', (value, expected) => {
      expect(parseObject(value)).toEqual(expected);
    });

    test('escaped newline sequence becomes actual newline', () => {
      const result = parseObject('{a: \'multi\\nline\'}');
      expect(result).toEqual({a: 'multi\nline'}); // runtime string contains actual newline
    });

    test('superfluous escaped double quote inside single quotes currently unsupported', () => {
      expect(() => parseObject('{a: \'quote \\" inside\'}')).toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // Robust nested structures (limited but supported)
  // ---------------------------------------------------------------------------
  describe('nested structures', () => {
    test.each([
      ['{a:[{b:{c:1}}]}', {a: [{b: {c: 1}}]}],
      ['a:{b:[{c:1};{d:2}]; e:[1;2;3]}', {a: {b: [{c: 1}, {d: 2}], e: [1, 2, 3]}}],
      ['a:[{b:[1;2]; c:{d:[3;4]}}]', {a: [{b: [1, 2], c: {d: [3, 4]}}]}]
    ])('parseObject(%p) -> %p', (value, expected) => {
      expect(parseObject(value)).toEqual(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // Unsupported / invalid syntax (should throw)
  // NOTE: We assert errors to capture current observable behaviour.
  // ---------------------------------------------------------------------------
  describe('invalid / unsupported inputs', () => {
    test.each([
      ['', 'empty string -> null already covered, but explicit invalid when trimmed empty is handled separately'],
      ['\n\t', 'whitespace -> null already covered']
    ])('sanity (already covered no throw): %p', (value) => {
      if (!value.trim()) {
        expect(parseObject(value as any)).toBeNull();
      }
    });

    test.each([
      ['undefined'],
      ['a 1'],
      ['{a 1}'],
      ['{a::1}'],
      ['{a,1}'],
      ['{a:}'],
      ['{a: unquotedString}'],
      ['"unclosed'],
      ['\'unclosed'],
      ['[1,2,,]invalid'],
      // Newly invalid (duplicate separators / recovery no longer allowed)
      ['{a:1; b:2,; c:3;;;}'],
      ['a:1,; b:2;; c:3,'],
      ['{arr:[1;2,,;3;;;]}'],
      ['{a:1; b:[1;2,;3]}'],
      ['[1;2,;3;;;]']
    ])('parseObject(%p) should throw', (value) => {
      expect(() => parseObject(value as any)).toThrow();
    });
  });
});
