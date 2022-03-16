import {ESLEventListener} from '../listener';

describe('dom/events: ESLEventListener', () => {
  describe('get', () => {
    test('simple', () => {
      expect(ESLEventListener.get()).toEqual([]);
      expect(ESLEventListener.get({})).toEqual([]);
    });
    // test('filled', () => {
    //   const obj = {};
    //   const listener = new ESLEventListener(() => undefined, {event: 'test'});
    //   ESLEventListener.set(obj, [listener]);
    //   expect(ESLEventListener.get(obj)).toEqual([listener]);
    // });
    test('singleton', () => {
      const obj = {};
      const listeners = ESLEventListener.get(obj);
      expect(ESLEventListener.get(obj)).toBe(listeners);
    });
  });

  // TODO: full coverage
});
