import {EventUtils} from '../core/api';
import {ESLEventListener} from '../core/listener';

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

  describe('listeners', () => {
    const list = [
      {matches: jest.fn()},
      {matches: jest.fn()}
    ];
    const host = {__listeners: list};

    beforeEach(() => list.forEach(({matches}: any) => matches.mockReset()));
    test('all', () => {
      expect(EventUtils.listeners(host as any)).toEqual(list);
    });
    test('1 criteria', () => {
      list[0].matches.mockReturnValue(false);
      list[1].matches.mockReturnValue(true);

      expect(EventUtils.listeners(host as any, 'a')).toEqual(list.slice(1));
      expect(list[0].matches).lastCalledWith('a', expect.anything(), expect.anything());
      expect(list[1].matches).lastCalledWith('a', expect.anything(), expect.anything());
    });
    test('2 criteria', () => {
      list[0].matches.mockReturnValue(true);
      list[1].matches.mockReturnValue(true);

      expect(EventUtils.listeners(host as any, 'b', {})).toEqual(list);
      expect(list[0].matches).toBeCalledTimes(2);
      expect(list[1].matches).toBeCalledTimes(2);
    });
  });

  describe('subscribe', () => {
    const listener1 =
      Object.assign(() => undefined, {auto: false, event: 'e1', subscribe: jest.fn()});

    test('decorated handler', () => {
      const host = {};
      const createMock =
        jest.spyOn(ESLEventListener, 'createOrResolve').mockImplementation((el, cb, desc) => [desc] as any);

      EventUtils.subscribe(host as any, listener1);
      expect(listener1.subscribe).toBeCalled();
      expect(createMock).toBeCalledWith(host, expect.anything(), expect.anything());
    });

    test('decorated handler with empty override', () => {
      const host = {};
      const createMock =
        jest.spyOn(ESLEventListener, 'createOrResolve').mockImplementation((el, cb, desc) => [desc] as any);

      EventUtils.subscribe(host as any, {}, listener1);
      expect(listener1.subscribe).toBeCalled();
      expect(createMock).toBeCalledWith(host, expect.anything(), expect.anything());
    });

    test('merge decorated handler', () => {
      const host = {};
      const createMock =
        jest.spyOn(ESLEventListener, 'createOrResolve').mockImplementation((el, cb, desc) => [desc] as any);

      EventUtils.subscribe(host as any, {event: 'e2'}, listener1);
      expect(listener1.subscribe).toBeCalled();
      const expDesc = Object.assign({}, listener1, {event: 'e2'});
      expect(createMock).toBeCalledWith(host, expect.anything(), expDesc);
    });

    test('manual descriptor', () => {
      const host = {};
      const fn = jest.fn();
      const desc = {event: 'test'};
      const listener = {subscribe: jest.fn()};
      const createMock =
        jest.spyOn(ESLEventListener, 'createOrResolve').mockImplementation(() => [listener] as any);

      EventUtils.subscribe(host as any, desc, fn);
      expect(listener.subscribe).toBeCalled();
      expect(createMock).toBeCalledWith(host, fn, desc);
    });

    test('manual string descriptor', () => {
      const host = {};
      const fn = jest.fn();
      const listener = {subscribe: jest.fn()};
      const createMock =
        jest.spyOn(ESLEventListener, 'createOrResolve').mockImplementation(() => [listener] as any);

      EventUtils.subscribe(host as any, 'click', fn);
      expect(listener.subscribe).toBeCalled();
      expect(createMock).toBeCalledWith(host, fn, {event: 'click'});
    });
  });

  describe('unsubscribe', () => {
    const list = [
      {matches: jest.fn(), unsubscribe: jest.fn()},
      {matches: jest.fn(), unsubscribe: jest.fn()}
    ];
    const host = {__listeners: list};

    beforeEach(() => list.forEach(({matches, unsubscribe}: any) => {
      matches.mockReset();
      unsubscribe.mockReset();
    }));
    test('all', () => {
      EventUtils.unsubscribe(host as any);
      expect(list[0].unsubscribe).toBeCalled();
      expect(list[1].unsubscribe).toBeCalled();
    });
    test('criteria', () => {
      list[0].matches.mockReturnValue(false);
      list[1].matches.mockReturnValue(true);
      EventUtils.unsubscribe(host as any, 'test');
      expect(list[0].unsubscribe).not.toBeCalled();
      expect(list[1].unsubscribe).toBeCalled();
    });
  });
});
