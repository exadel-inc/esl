import {parseObject} from '../object';

/**
 * Security oriented tests: ensure parsing untrusted input with special keys
 * like __proto__, constructor, prototype does NOT pollute global Object prototype.
 */
describe('misc/format - parseObject prototype pollution safety', () => {
  const PP_PROP = 'pp_polluted_marker';
  const vectors: string[] = [
    `{__proto__:{${PP_PROP}:true}}`,
    `__proto__:{${PP_PROP}:true}`,
    `{constructor:{prototype:{${PP_PROP}:true}}}`,
    `constructor:{prototype:{${PP_PROP}:true}}`,
    `{prototype:{${PP_PROP}:true}}`,
    `prototype:{${PP_PROP}:true}`
  ];

  test.each(vectors)('parseObject(%p) does not pollute Object.prototype', (src) => {
    // Pre-condition: marker absent
    expect((Object.prototype as any)[PP_PROP]).toBeUndefined();

    const result = parseObject(src);

    // Parser should return an object (or null only for empty input which vectors are not)
    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');

    // Global Object prototype must remain untouched
    expect((Object.prototype as any)[PP_PROP]).toBeUndefined();

    // Any nested object value that attempted pollution should not end up on plain objects
    expect(({} as any)[PP_PROP]).toBeUndefined();
  });

  test('parsed object retains own data without affecting prototype chain', () => {
    const src = `{a:1; __proto__:{${PP_PROP}:true}; b:2}`;
    const obj = parseObject(src);

    expect(obj).toMatchObject({a: 1, b: 2});
    // Own property access should not yield marker via prototype chain
    expect(obj[PP_PROP]).toBeUndefined();
    expect(Object.hasOwn(Object.prototype, PP_PROP)).toBe(false);
  });
});

