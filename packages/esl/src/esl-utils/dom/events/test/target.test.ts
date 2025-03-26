import {SyntheticEventTarget} from '../target';

describe('dom/events: SyntheticEventTarget', () => {
  describe('Handler function', () => {
    describe('Basic functionality', () => {
      const et = new SyntheticEventTarget();

      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const event3 = new CustomEvent('change');
      const event4 = new CustomEvent('click');

      const listener = jest.fn();
      et.addEventListener('change', listener);

      test('listener shoudn`t be called', () => expect(listener).toBeCalledTimes(0));

      test('listener should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener).toBeCalledWith(event1);
      });

      test('listener should be called two times', () => {
        et.dispatchEvent(event2);
        expect(listener).toHaveBeenLastCalledWith(event2);
      });

      test('listener shouldn`t be called for event it`s not subscribed to', () => {
        et.dispatchEvent(event4);
        expect(listener).toHaveBeenLastCalledWith(event2);
      });

      test('listener shouldn`t be called third time', () => {
        et.removeEventListener('change', listener);
        et.dispatchEvent(event3);
        expect(listener).toBeCalledTimes(2);
      });

      afterAll(() => jest.clearAllMocks());
    });

    describe('Shorthand API', () => {
      const et = new SyntheticEventTarget();

      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');

      const listener = jest.fn();
      et.addEventListener(listener);

      test('listener shoudn`t be called', () => expect(listener).toBeCalledTimes(0));

      test('listener should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener).toBeCalledWith(event1);
      });

      describe('Listener should be stored', () => {
        test('should be valid to pass only event type', () => {
          expect(et.hasEventListener('change')).toBe(true);
        });

        test('should be valid without passing any of the parameters', () => {
          expect(et.hasEventListener()).toBe(true);
        });
      });

      test('listener shouldn`t be stored for wrong event type', () => {
        expect(et.hasEventListener('change2')).toBe(false);
      });

      test('listener shouldn`t be called second time', () => {
        et.removeEventListener(listener);
        et.dispatchEvent(event2);
        expect(listener).toBeCalledTimes(1);
      });

      afterAll(() => jest.clearAllMocks());
    });

    describe('API restriction', () => {
      const et = new SyntheticEventTarget();
      // @ts-ignore
      test('should fail without params', () => expect(() => et.addEventListener()).toThrowError());
      test('should fail with null passed as param', () => expect(() => et.addEventListener(null as any)).toThrowError());
      test('should fail with number passed as param', () => expect(() => et.addEventListener(1 as any)).toThrowError());
      test('should fail with string passed as callback', () => expect(() => et.addEventListener('change', 'click' as any)).toThrowError());
    });
  });

  describe('handler object', () => {
    const et = new SyntheticEventTarget();

    describe('Basic functionality', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const event3 = new CustomEvent('change');
      const listener = {
        handleEvent: jest.fn()
      };
      et.addEventListener('change', listener);

      test('listener event handler shoudn`t be called', () => expect(listener.handleEvent).toBeCalledTimes(0));

      test('listener event handler should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener.handleEvent).toBeCalledWith(event1);
      });

      test('listener event handler should be called second time', () => {
        et.dispatchEvent(event2);
        expect(listener.handleEvent).toHaveBeenLastCalledWith(event2);
      });

      test('listener event handler shouldn`t be called third time', () => {
        et.removeEventListener('change', listener);
        et.dispatchEvent(event3);
        expect(listener.handleEvent).toBeCalledTimes(2);
      });
    });

    describe('Short api', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const listener = {
        handleEvent: jest.fn()
      };

      test('listener event handler shoudn`t be called', () => {
        et.addEventListener(listener);
        expect(listener.handleEvent).toBeCalledTimes(0);});

      test('listener event handler should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener.handleEvent).toBeCalledWith(event1);
      });

      test('listener event handler shouldn`t be called second time', () => {
        et.removeEventListener(listener);
        et.dispatchEvent(event2);
        expect(listener.handleEvent).toBeCalledTimes(1);
      });
    });

    test('api restriction', () => expect(() => et.addEventListener({} as any)).toThrowError());
  });

  describe('PreventDefault', () => {
    describe('Event action not prevented', () => {
      const et = new SyntheticEventTarget();
      const listener = jest.fn(() => {});
      et.addEventListener('change', listener);

      test('event shouldn`t be prevented', () => {
        const result = et.dispatchEvent(new Event('change', {cancelable: true}));
        expect(listener).toBeCalled();
        expect(result).toBe(false);
      });
    });

    describe('Event action prevented', () => {
      const et = new SyntheticEventTarget();
      const listener = jest.fn((e: Event) => {e.preventDefault();});
      et.addEventListener('change', listener);

      test('preventDefault method should work correctly', () => {
        const result = et.dispatchEvent(new Event('change', {cancelable: true}));
        expect(listener).toBeCalled();
        expect(result).toBe(true);
      });
    });
  });
});
