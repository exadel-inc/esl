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
      Object.assign(() => undefined, {auto: true, subscribe: jest.fn()});
    const listener2 =
      Object.assign(() => undefined, {auto: false, subscribe: jest.fn()});

    test('all', () => {
      const host = {};
      jest.spyOn(ESLEventListener, 'descriptors').mockReturnValue([listener1, listener2] as any);
      const createMock =
        jest.spyOn(ESLEventListener, 'create').mockImplementation((host, cb, desc) => [desc] as any);

      EventUtils.subscribe(host as any);
      expect(listener1.subscribe).toBeCalled();
      expect(listener2.subscribe).not.toBeCalled();
      expect(createMock).toBeCalledWith(host, expect.anything(), expect.anything());
    });

    test('single decorated', () => {
      const host = {};
      const createMock =
        jest.spyOn(ESLEventListener, 'create').mockImplementation((host, cb, desc) => [desc] as any);

      EventUtils.subscribe(host as any, listener2);
      expect(listener2.subscribe).toBeCalled();
      expect(createMock).toBeCalledWith(host, expect.anything(), expect.anything());
    });

    test('single manual', () => {
      const host = {};
      const fn = jest.fn();
      const desc = {event: 'test'};
      const listener = {subscribe: jest.fn()};
      const createMock =
        jest.spyOn(ESLEventListener, 'create').mockImplementation(() => [listener] as any);

      EventUtils.subscribe(host as any, fn, desc);
      expect(listener.subscribe).toBeCalled();
      expect(createMock).toBeCalledWith(host, fn, desc);
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
