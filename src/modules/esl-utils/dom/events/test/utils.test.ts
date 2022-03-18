import {EventUtils} from '../utils';
import {ESLEventListener} from '../listener';

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

      const desc = ESLEventListener.descriptors(obj);
      expect(Array.isArray(desc)).toBe(true);
      expect(desc.includes(fn1));
      expect(desc.includes(fn2));
    });
  });

  describe('subscribe', () => {
    const div = document.createElement('div');

    test('subscribe', ()  => {
      const handle = jest.fn();
      EventUtils.subscribe(div, handle, {event: 'click'});

      expect(EventUtils.listeners(div).length).toBe(1);

      expect(handle).toBeCalledTimes(0);
      div.click();
      expect(handle).toBeCalledTimes(1);
    });
  });

  describe('subscribe: delegate', () => {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    div.appendChild(btn);
    const span = document.createElement('span');
    div.appendChild(span);

    test('subscribe', ()  => {
      const handle = jest.fn();
      EventUtils.subscribe(div, handle, {event: 'click', selector: 'button'});

      expect(handle).toBeCalledTimes(0);
      btn.click();
      expect(handle).toBeCalledTimes(1);
      span.click();
      expect(handle).toBeCalledTimes(1);
    });
  });

  describe('unsubscribe', () => {
    const handle = jest.fn();
    const div = document.createElement('div');

    beforeEach(() => {
      EventUtils.subscribe(div, handle, {id: 'test', event: 'click'});
    });

    test('all', ()  => {
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div);
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by id', ()  => {
      EventUtils.unsubscribe(div, {id: 'testic'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, {id: 'test'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by event', ()  => {
      EventUtils.unsubscribe(div, {event: 'mousedown'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, {event: 'click'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by event(string)', ()  => {
      EventUtils.unsubscribe(div, 'test');
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, 'click');
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by handler', ()  => {
      EventUtils.unsubscribe(div, () => 1);
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, handle);
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('with multiple criteria', ()  => {
      EventUtils.unsubscribe(div, handle, {event: 'key'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, handle, {event: 'click'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });
  });
});
