import {EventUtils} from '../utils';

describe('dom/events: EventUtils', () => {
  describe('dispatch', () => {
    test('dispatches event with custom event init on the provided element', () => {
      const el = document.createElement('div');
      jest.spyOn(el, 'dispatchEvent');

      const eventName = `click${Math.random()}`;
      const customEventInit = {detail: Math.random()};
      EventUtils.dispatch(el, eventName, customEventInit);

      expect(el.dispatchEvent).toHaveBeenCalled();

      const event: CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
      expect(event.type).toBe(eventName);
      expect((event as any).detail).toBe(customEventInit.detail);
    });
  });

  describe('descriptors', () => {
    test('singleton', () => {
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
  });

  // describe('init', () => {
  //   // TODO
  // });
  //
  // describe('subscribe', () => {
  //   // TODO
  // });
  //
  // describe('unsubscribe', () => {
  //   // TODO
  // });
});
