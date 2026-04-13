import {SyntheticEventTarget} from '../target';

describe('dom/events: SyntheticEventTarget', () => {
  describe('Handler function', () => {
    describe('Basic functionality', () => {
      const et = new SyntheticEventTarget();

      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const event3 = new CustomEvent('change');
      const event4 = new CustomEvent('click');

      const listener = vi.fn();
      et.addEventListener('change', listener);

      test('listener shoudn`t be called', () => expect(listener).toHaveBeenCalledTimes(0));

      test('listener should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener).toHaveBeenCalledWith(event1);
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
        expect(listener).toHaveBeenCalledTimes(2);
      });

      afterAll(() => vi.clearAllMocks());
    });

    describe('Shorthand API', () => {
      const et = new SyntheticEventTarget();

      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');

      const listener = vi.fn();
      et.addEventListener(listener);

      test('listener shoudn`t be called', () => expect(listener).toHaveBeenCalledTimes(0));

      test('listener should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener).toHaveBeenCalledWith(event1);
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
        expect(listener).toHaveBeenCalledTimes(1);
      });

      afterAll(() => vi.clearAllMocks());
    });

    describe('API restriction', () => {
      const et = new SyntheticEventTarget();
      // @ts-ignore
      test('should fail without params', () => expect(() => et.addEventListener()).toThrow());
      test('should fail with null passed as param', () => expect(() => et.addEventListener(null as any)).toThrow());
      test('should fail with number passed as param', () => expect(() => et.addEventListener(1 as any)).toThrow());
      test('should fail with string passed as callback', () => expect(() => et.addEventListener('change', 'click' as any)).toThrow());
    });
  });

  describe('handler object', () => {
    const et = new SyntheticEventTarget();

    describe('Basic functionality', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const event3 = new CustomEvent('change');
      const listener = {
        handleEvent: vi.fn()
      };
      et.addEventListener('change', listener);

      test('listener event handler shoudn`t be called', () => expect(listener.handleEvent).toHaveBeenCalledTimes(0));

      test('listener event handler should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener.handleEvent).toHaveBeenCalledWith(event1);
      });

      test('listener event handler should be called second time', () => {
        et.dispatchEvent(event2);
        expect(listener.handleEvent).toHaveBeenLastCalledWith(event2);
      });

      test('listener event handler shouldn`t be called third time', () => {
        et.removeEventListener('change', listener);
        et.dispatchEvent(event3);
        expect(listener.handleEvent).toHaveBeenCalledTimes(2);
      });
    });

    describe('Short api', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const listener = {
        handleEvent: vi.fn()
      };

      test('listener event handler shoudn`t be called', () => {
        et.addEventListener(listener);
        expect(listener.handleEvent).toHaveBeenCalledTimes(0);});

      test('listener event handler should be called once', () => {
        et.dispatchEvent(event1);
        expect(listener.handleEvent).toHaveBeenCalledWith(event1);
      });

      test('listener event handler shouldn`t be called second time', () => {
        et.removeEventListener(listener);
        et.dispatchEvent(event2);
        expect(listener.handleEvent).toHaveBeenCalledTimes(1);
      });
    });

    test('api restriction', () => expect(() => et.addEventListener({} as any)).toThrow());
  });

  describe('PreventDefault', () => {
    describe('Event action not prevented', () => {
      const et = new SyntheticEventTarget();
      const listener = vi.fn(() => {});
      et.addEventListener('change', listener);

      test('event shouldn`t be prevented', () => {
        const result = et.dispatchEvent(new Event('change', {cancelable: true}));
        expect(listener).toHaveBeenCalled();
        expect(result).toBe(false);
      });
    });

    describe('Event action prevented', () => {
      const et = new SyntheticEventTarget();
      const listener = vi.fn((e: Event) => {e.preventDefault();});
      et.addEventListener('change', listener);

      test('preventDefault method should work correctly', () => {
        const result = et.dispatchEvent(new Event('change', {cancelable: true}));
        expect(listener).toHaveBeenCalled();
        expect(result).toBe(true);
      });
    });
  });
});
