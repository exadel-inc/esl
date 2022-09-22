import {EventUtils} from '../core';

describe('dom/events: EventUtils', () => {
  // TODO: extend tests + possibly move descriptor finding to separate module?
  describe('descriptors', () => {
    test('basic test 1', () => {
      const fn1 = () => undefined;
      const fn2 = () => undefined;
      fn1.event = fn2.event = 'test';

      const obj = {onClick: fn1};
      const proto = {onEvent: fn2};
      Object.setPrototypeOf(obj, proto);

      const desc = EventUtils.descriptors(obj);
      expect(Array.isArray(desc)).toBe(true);
      expect(desc.includes(fn1));
      expect(desc.includes(fn2));
    });
    test('basic test 2', () => {
      const obj: any = document.createElement('div');

      expect(EventUtils.descriptors(obj)).toEqual([]);

      obj.onEvent = Object.assign(() => undefined, {event: 'event', auto: true});

      expect(EventUtils.descriptors(obj).length).toEqual(1);
      expect(EventUtils.descriptors(obj)[0]).toEqual(obj.onEvent);
    });
  });
});
