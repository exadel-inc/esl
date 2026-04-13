import {promisifyEvent, promisifyMarker} from '../../promise/event';

describe('async/promise/event', () => {
  beforeAll(() =>  vi.useFakeTimers());
  afterAll(() => vi.useRealTimers());

  describe('promisifyEvent', () => {
    test('Resolves when event occurs', () => {
      const el = document.createElement('div');
      const promise$ = promisifyEvent(el, 'test');
      el.dispatchEvent(new CustomEvent('test'));
      return expect(promise$.then((e) => e.type)).resolves.toBe('test');
    });
    test('Resolved converter unsubscribes from target', async () => {
      const el = document.createElement('div');
      const spy = vi.spyOn(el, 'removeEventListener');
      const promise$ = promisifyEvent(el, 'test');
      el.dispatchEvent(new CustomEvent('test'));
      await promise$;
      return expect(spy).toHaveBeenCalledWith('test', expect.any(Function), undefined);
    });

    test('Rejected by timeout if it is exceeded', async () => {
      const el = document.createElement('div');
      const promise$ = promisifyEvent(el, 'test', 10);
      vi.advanceTimersByTime(100);
      await expect(promise$).rejects.toThrow(new Error('Rejected by timeout'));
    });
    test('Listener unsubscribed if promise was rejected by timeout', async () => {
      const el = document.createElement('div');
      const spy = vi.spyOn(el, 'removeEventListener');
      const promise$ = promisifyEvent(el, 'test', 10);
      vi.advanceTimersByTime(100);
      try {
        await promise$;
      } catch {
        expect(spy).toHaveBeenCalledWith('test', expect.any(Function), undefined);
      }
    });
    describe('AbortSignal handling', () => {
      test('Rejected when was passed options with signal and invoked abort', async () => {
        const el = document.createElement('div');
        const controller = new AbortController();
        const promise$ = promisifyEvent(el, 'test', null, {signal: controller.signal});
        controller.abort();
        await expect(promise$).rejects.toThrow(new Error('Rejected by abort signal'));
      });
      test('Rejected when was passed options with signal in aborted state', async () => {
        const el = document.createElement('div');
        const promise$ = promisifyEvent(el, 'test', null, {signal: AbortSignal.abort()});
        await expect(promise$).rejects.toThrow(new Error('Rejected by abort signal'));
      });
      test('AbortSignal listener unsubscribed if the promise was resolved by event', async () => {
        const el = document.createElement('div');
        const controller = new AbortController();
        const signal = controller.signal;
        const spy = vi.spyOn(signal, 'removeEventListener');
        const promise$ = promisifyEvent(el, 'test', null, {signal});
        el.dispatchEvent(new CustomEvent('test'));
        await promise$;
        return expect(spy).toHaveBeenCalledWith('abort', expect.any(Function));
      });
      test('AbortSignal listener unsubscribed if the promise was rejected by timeout', async () => {
        const el = document.createElement('div');
        const controller = new AbortController();
        const signal = controller.signal;
        const spy = vi.spyOn(signal, 'removeEventListener');
        const promise$ = promisifyEvent(el, 'test', 10, {signal});
        vi.advanceTimersByTime(100);
        try {
          await promise$;
        } catch {
          expect(spy).toHaveBeenCalledWith('abort', expect.any(Function));
        }
      });
      test('AbortSignal listener unsubscribed if the promise was rejected by signal', async () => {
        const el = document.createElement('div');
        const controller = new AbortController();
        const signal = controller.signal;
        const spy = vi.spyOn(signal, 'removeEventListener');
        const promise$ = promisifyEvent(el, 'test', null, {signal});
        controller.abort();
        try {
          await promise$;
        } catch {
          expect(spy).toHaveBeenCalledWith('abort', expect.any(Function));
        }
      });
    });
  });

  describe('promisifyMarker', () => {
    test('Resolves by attribute', () => {
      const el = document.createElement('div');
      (el as any).test = true;
      const promise$ = promisifyMarker(el, 'test');
      return expect(promise$).resolves.toBe(el);
    });

    test('Resolves by event', () => {
      const el = document.createElement('div');
      const promise$ = promisifyMarker(el, 'test');
      vi.advanceTimersByTime(50);
      el.dispatchEvent(new CustomEvent('test'));
      return expect(promise$).resolves.toBe(el);
    });
  });
});
