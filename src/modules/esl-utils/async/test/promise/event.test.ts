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
    test('Rejected by timeout if it is exceeded', () => {
      const el = document.createElement('div');
      const promise$ = promisifyEvent(el, 'test', 10);
      jest.advanceTimersByTime(100);
      return expect(promise$).rejects.toBeInstanceOf(Error);
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
