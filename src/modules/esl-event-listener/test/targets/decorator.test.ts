import {identity} from '../../../esl-utils/misc/functions';
import {debounce} from '../../../esl-utils/async/debounce';
import {throttle} from '../../../esl-utils/async/throttle';
import {ESLEventUtils} from '../../core/api';

describe('ESLEventUtils.decorate proxy', () => {
  const DEFAULT_TIMEOUT = 250;

  describe('ESLEventUtils.decorate caching',  () => {
    test('ESLEventUtils.decorate cached for target and fake fn', () => {
      const fn = (arg: any) => arg;
      expect(ESLEventUtils.decorate(window, fn) === ESLEventUtils.decorate(window, fn));
      expect(ESLEventUtils.decorate(document, fn) !== ESLEventUtils.decorate(window, fn));
    });

    test('ESLEventUtils.decorate cached for target and debounce fn', () => {
      expect(ESLEventUtils.decorate(window, debounce) === ESLEventUtils.decorate(window, debounce));
      expect(ESLEventUtils.decorate(document, debounce) !== ESLEventUtils.decorate(window, debounce));
    });

    test('ESLEventUtils.decorate cached for target, fake fn and timeout', () => {
      const fn = (arg: any, num: number) => arg;
      expect(ESLEventUtils.decorate(window, fn, 100) === ESLEventUtils.decorate(window, fn, 100));
      expect(ESLEventUtils.decorate(window, fn, 100) !== ESLEventUtils.decorate(window, fn, 150));
    });
  });

  describe('ESLEventUtils.decorate event target',  () => {
    const et = document.createElement('div');
    const dec = ESLEventUtils.decorate(et, identity);
    const handler = jest.fn();

    beforeEach(() => dec.addEventListener('click', handler));
    afterEach(() => dec.removeEventListener('click', handler));

    test('ESLEventUtils.decorate does not replace event.target', () => {
      et.dispatchEvent(new Event('click'));
      expect(handler).lastCalledWith(expect.objectContaining({target: et}));
    });
    test('ESLEventUtils.decorate use ESLEventTargetDecorator instance as `event.currentTarget`', () => {
      et.dispatchEvent(new Event('click'));
      expect(handler).lastCalledWith(expect.objectContaining({currentTarget: dec}));
    });
  });

  describe('ESLEventUtils.decorate attribute processing', () => {
    const el = document.createElement('div');
    const handler = jest.fn();
    const dec = jest.fn(() => handler);
    const decorated = ESLEventUtils.decorate(el, dec);

    test('Creation does not cause execution', () => expect(dec).not.toBeCalled());

    test('Creation happens once on subscription', () => {
      const fn = jest.fn();
      decorated.addEventListener(fn);
      expect(dec).toBeCalled();
      expect(handler).not.toBeCalled();
      decorated.removeEventListener(fn);
    });

    test('Event is passed to the handler', () => {
      const fn = jest.fn();
      const event = new Event('event');
      decorated.addEventListener('event', fn);

      el.dispatchEvent(event);
      expect(handler).lastCalledWith(event);

      decorated.removeEventListener(fn);
    });
  });

  describe('window.resize debouncing case', () => {
    const host = {};
    const fn = jest.fn();

    beforeAll(() => {
      ESLEventUtils.subscribe(host, {
        event: 'resize',
        target: ESLEventUtils.decorate(window, debounce, DEFAULT_TIMEOUT)
      }, fn);
      jest.useFakeTimers();
    });
    afterAll(() => ESLEventUtils.unsubscribe(host));

    beforeEach(() => fn.mockReset());
    afterEach(() => jest.runAllTimers());

    test('Proxy resize receives the resize event',  ()=> {
      const event = new Event('resize');
      window.dispatchEvent(event);
      jest.advanceTimersByTime(DEFAULT_TIMEOUT);
      expect(fn).lastCalledWith(event);
    });

    test('Proxy resize happens debounced (multiple events in bounds of debounce range)',  ()=> {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(10);

      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      expect(fn).toBeCalledTimes(0);

      jest.advanceTimersByTime(DEFAULT_TIMEOUT);
      expect(fn).toBeCalledTimes(1);
    });

    test('Proxy resize happens debounced (multiple events in bounds of two debounce range)',  ()=> {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(DEFAULT_TIMEOUT);

      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(DEFAULT_TIMEOUT);

      expect(fn).toBeCalledTimes(2);
    });
  });

  describe('window.scroll throttling case', () => {
    const host = {};
    const fn = jest.fn();

    beforeAll(() => {
      ESLEventUtils.subscribe(host, {
        event: 'scroll',
        target: ESLEventUtils.decorate(window, throttle, DEFAULT_TIMEOUT)
      }, fn);
      jest.useFakeTimers();
    });
    afterAll(() => ESLEventUtils.unsubscribe(host));

    beforeEach(() => fn.mockReset());
    afterEach(() => jest.runAllTimers());

    test('Proxy scroll receives the scroll event',  ()=> {
      const event = new Event('scroll');
      window.dispatchEvent(event);
      jest.advanceTimersByTime(10);
      expect(fn).lastCalledWith(event);
    });

    test('Proxy scroll happens throttled (multiple events received once in bounds of threshold)',  ()=> {
      expect(fn).toBeCalledTimes(0);
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      expect(fn).toBeCalledTimes(1);
      jest.advanceTimersByTime(DEFAULT_TIMEOUT + 100);
      expect(fn).toBeCalledTimes(2);
    });
  });
});
