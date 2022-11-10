import {ESLEventUtils} from '../core';

describe('dom/events: ESLEventUtils', () => {
  // TODO: extend tests + possibly move descriptor finding to separate module?
  describe('descriptors', () => {
    test('basic test 1', () => {
      const fn1 = () => undefined;
      const fn2 = () => undefined;
      fn1.event = fn2.event = 'test';

      const obj = {onClick: fn1};
      const proto = {onEvent: fn2};
      Object.setPrototypeOf(obj, proto);

      const desc = ESLEventUtils.descriptors(obj);
      expect(Array.isArray(desc)).toBe(true);
      expect(desc.includes(fn1));
      expect(desc.includes(fn2));
    });
    test('basic test 2', () => {
      const obj: any = document.createElement('div');

      expect(ESLEventUtils.descriptors(obj)).toEqual([]);

      obj.onEvent = Object.assign(() => undefined, {event: 'event', auto: true});

      expect(ESLEventUtils.descriptors(obj).length).toEqual(1);
      expect(ESLEventUtils.descriptors(obj)[0]).toEqual(obj.onEvent);
    });
  });
});
