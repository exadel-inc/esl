import {identity} from '../../../esl-utils/misc/functions';
import {debounce} from '../../../esl-utils/async/debounce';
import {throttle} from '../../../esl-utils/async/throttle';
import {ESLEventUtils, ESLDecoratedEventTarget} from '../../core';

describe('ESLDecoratedEventTarget proxy', () => {
  const DEFAULT_TIMEOUT = 250;

  describe('ESLDecoratedEventTarget.for caching',  () => {
    test('ESLDecoratedEventTarget.for cached for target and fake fn', () => {
      const fn = (arg: any) => arg;
      expect(ESLDecoratedEventTarget.for(window, fn) === ESLDecoratedEventTarget.for(window, fn));
      expect(ESLDecoratedEventTarget.for(document, fn) !== ESLDecoratedEventTarget.for(window, fn));
    });

    test('ESLDecoratedEventTarget.for cached for target and debounce fn', () => {
      expect(ESLDecoratedEventTarget.for(window, debounce) === ESLDecoratedEventTarget.for(window, debounce));
      expect(ESLDecoratedEventTarget.for(document, debounce) !== ESLDecoratedEventTarget.for(window, debounce));
    });

    test('ESLDecoratedEventTarget.for cached for target, fake fn and timeout', () => {
      const fn = (arg: any, num: number) => arg;
      expect(ESLDecoratedEventTarget.for(window, fn, 100) === ESLDecoratedEventTarget.for(window, fn, 100));
      expect(ESLDecoratedEventTarget.for(window, fn, 100) !== ESLDecoratedEventTarget.for(window, fn, 150));
    });
  });

  describe('ESLDecoratedEventTarget.for event target',  () => {
    const et = document.createElement('div');
    const dec = ESLDecoratedEventTarget.for(et, identity);
    const handler = jest.fn();

    beforeEach(() => dec.addEventListener('click', handler));
    afterEach(() => dec.removeEventListener('click', handler));

    test('ESLDecoratedEventTarget.for does not replace event.target', () => {
      et.dispatchEvent(new Event('click'));
      expect(handler).toHaveBeenLastCalledWith(expect.objectContaining({target: et}));
    });
    test('ESLDecoratedEventTarget.for uses ESLDecoratedEventTarget instance as `event.currentTarget`', () => {
      et.dispatchEvent(new Event('click'));
      expect(handler).toHaveBeenLastCalledWith(expect.objectContaining({currentTarget: dec}));
    });
  });

  describe('ESLDecoratedEventTarget.for attribute processing', () => {
    const el = document.createElement('div');
    const handler = jest.fn();
    const dec = jest.fn(() => handler);
    const decorated = ESLDecoratedEventTarget.for(el, dec);

    test('Creation does not cause execution', () => expect(dec).not.toHaveBeenCalled());

    test('Creation happens once on subscription', () => {
      const fn = jest.fn();
      decorated.addEventListener('something', fn);
      expect(dec).toHaveBeenCalled();
      expect(handler).not.toHaveBeenCalled();
      decorated.removeEventListener(fn);
    });

    test('Event is passed to the handler', () => {
      const fn = jest.fn();
      const event = new Event('event');
      decorated.addEventListener('event', fn);

      el.dispatchEvent(event);
      expect(handler).toHaveBeenLastCalledWith(event);

      decorated.removeEventListener(fn);
    });
  });

  describe('window.resize debouncing case', () => {
    const host = {};
    const fn = jest.fn();

    beforeAll(() => {
      ESLEventUtils.subscribe(host, {
        event: 'resize',
        target: ESLDecoratedEventTarget.for(window, debounce, DEFAULT_TIMEOUT)
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
      expect(fn).toHaveBeenLastCalledWith(event);
    });

    test('Proxy resize happens debounced (multiple events in bounds of debounce range)',  ()=> {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(10);

      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      expect(fn).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(DEFAULT_TIMEOUT);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('Proxy resize happens debounced (multiple events in bounds of two debounce range)',  ()=> {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(DEFAULT_TIMEOUT);

      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(DEFAULT_TIMEOUT);

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('window.scroll throttling case', () => {
    const host = {};
    const fn = jest.fn();

    beforeEach(() => {
      ESLEventUtils.subscribe(host, {
        event: 'scroll',
        target: ESLDecoratedEventTarget.for(window, throttle, DEFAULT_TIMEOUT)
      }, fn);
      jest.useFakeTimers();
      fn.mockReset();
    });

    afterEach(() => {
      jest.runAllTimers();
      ESLEventUtils.unsubscribe(host);
    });

    test('Proxy scroll receives the scroll event',  ()=> {
      const event = new Event('scroll');
      window.dispatchEvent(event);
      jest.advanceTimersByTime(10);
      expect(fn).toHaveBeenLastCalledWith(event);
    });

    test('Proxy scroll happens throttled (multiple events received once in bounds of threshold)',  ()=> {
      expect(fn).toHaveBeenCalledTimes(0);
      window.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(1);
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(DEFAULT_TIMEOUT + 100);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
