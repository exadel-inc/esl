import {SyntheticEventTarget} from '../target';

describe('dom/events: SyntheticEventTarget', () => {
  describe('handler function', () => {
    const et = new SyntheticEventTarget();

    test('basic', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const event3 = new CustomEvent('change');
      const listener = jest.fn();
      et.addEventListener('change', listener);

      expect(listener).toBeCalledTimes(0);
      et.dispatchEvent(event1);
      expect(listener).toBeCalledWith(event1);
      et.dispatchEvent(event2);
      expect(listener).toHaveBeenLastCalledWith(event2);
      et.removeEventListener('change', listener);
      et.dispatchEvent(event3);
      expect(listener).toBeCalledTimes(2);
    });

    test('short', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const listener = jest.fn();
      et.addEventListener(listener);

      expect(listener).toBeCalledTimes(0);
      et.dispatchEvent(event1);
      expect(listener).toBeCalledWith(event1);
      et.removeEventListener(listener);
      et.dispatchEvent(event2);
      expect(listener).toBeCalledTimes(1);
    });

    test('legacy fn', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const listener = jest.fn();
      et.addListener(listener);

      expect(listener).toBeCalledTimes(0);
      et.dispatchEvent(event1);
      expect(listener).toBeCalledWith(event1);
      et.removeListener(listener);
      et.dispatchEvent(event2);
      expect(listener).toBeCalledTimes(1);
    });

    test('api restriction', () => {
      // @ts-ignore
      expect(() => et.addEventListener()).toThrowError();
      expect(() => et.addEventListener(null as any)).toThrowError();
      expect(() => et.addEventListener(1 as any)).toThrowError();
    });
  });

  describe('handler object', () => {
    const et = new SyntheticEventTarget();

    test('basic', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const event3 = new CustomEvent('change');
      const listener = {
        handleEvent: jest.fn()
      };
      et.addEventListener('change', listener);

      expect(listener.handleEvent).toBeCalledTimes(0);
      et.dispatchEvent(event1);
      expect(listener.handleEvent).toBeCalledWith(event1);
      et.dispatchEvent(event2);
      expect(listener.handleEvent).toHaveBeenLastCalledWith(event2);
      et.removeEventListener('change', listener);
      et.dispatchEvent(event3);
      expect(listener.handleEvent).toBeCalledTimes(2);
    });

    test('short', () => {
      const event1 = new CustomEvent('change');
      const event2 = new CustomEvent('change');
      const listener = {
        handleEvent: jest.fn()
      };
      et.addEventListener(listener);

      expect(listener.handleEvent).toBeCalledTimes(0);
      et.dispatchEvent(event1);
      expect(listener.handleEvent).toBeCalledWith(event1);
      et.removeEventListener(listener);
      et.dispatchEvent(event2);
      expect(listener.handleEvent).toBeCalledTimes(1);
    });

    test('api restriction', () => {
      expect(() => et.addEventListener({} as any)).toThrowError();
    });
  });

  describe('preventDefault', () => {
    test('not prevented', () => {
      const et = new SyntheticEventTarget();
      const listener = jest.fn(() => {});

      et.addEventListener('change', listener);
      const result = et.dispatchEvent(new Event('change', {cancelable: true}));
      expect(listener).toBeCalled();
      expect(result).toBe(false);
    });

    test('prevented', () => {
      const et = new SyntheticEventTarget();
      const listener = jest.fn((e: Event) => {e.preventDefault();});

      et.addEventListener('change', listener);
      const result = et.dispatchEvent(new Event('change', {cancelable: true}));
      expect(listener).toBeCalled();
      expect(result).toBe(true);
    });
  });
});
