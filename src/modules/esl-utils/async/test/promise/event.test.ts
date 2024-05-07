import {promisifyEvent, promisifyMarker} from '../../promise/event';

describe('async/promise/event', () => {
  beforeAll(() =>  jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  describe('promisifyEvent', () => {
    test('Resolves when event occurs', () => {
      const el = document.createElement('div');
      const promise$ = promisifyEvent(el, 'test');
      el.dispatchEvent(new CustomEvent('test'));
      return expect(promise$.then((e) => e.type)).resolves.toBe('test');
    });
    test('Resolved converter unsubscribes from target', async () => {
      const el = document.createElement('div');
      const spy = jest.spyOn(el, 'removeEventListener');
      const promise$ = promisifyEvent(el, 'test');
      el.dispatchEvent(new CustomEvent('test'));
      await promise$;
      return expect(spy).toBeCalledWith('test', expect.any(Function), undefined);
    });

    test('Rejected by timeout if it is exceeded', () => {
      const el = document.createElement('div');
      const promise$ = promisifyEvent(el, 'test', 10);
      jest.advanceTimersByTime(100);
      return expect(promise$).rejects.toBeInstanceOf(Error);
    });
    test('Listener unsubscribed if promise was rejected by timeout', async () => {
      const el = document.createElement('div');
      const spy = jest.spyOn(el, 'removeEventListener');
      const promise$ = promisifyEvent(el, 'test', 10);
      jest.advanceTimersByTime(100);
      try {
        await promise$;
      } catch {
        expect(spy).toBeCalledWith('test', expect.any(Function), undefined);
      }
    });
    test('Rejected by abort signal', async () => {
      const el = document.createElement('div');
      const controller = new AbortController();
      const promise$ = promisifyEvent(el, 'test', null, {signal: controller.signal});
      controller.abort();
      await expect(promise$).rejects.toBeInstanceOf(Error);
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
      jest.advanceTimersByTime(50);
      el.dispatchEvent(new CustomEvent('test'));
      return expect(promise$).resolves.toBe(el);
    });
  });
});
