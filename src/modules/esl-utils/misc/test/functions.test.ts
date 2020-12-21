import {identity, noop} from '../functions';

describe('misc/functions', () => {
  test('noop', () => {
    expect(noop()).toBeUndefined();
    expect(noop(1, 2, 3)).toBeUndefined();
  });

  test('identity', () => {
    expect(identity(1)).toBe(1);
    const test = Symbol('test');
    expect(identity(test)).toBe(test);
  });
});
