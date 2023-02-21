import {debounce} from '../../../esl-utils/async/debounce';
import {throttle} from '../../../esl-utils/async/throttle';
import {ESLEventUtils} from '../../core/api';

describe('ESLEventUtils.decorate proxy', () => {
  const DEFAULT_TIMEOUT = 250;

  jest.useFakeTimers();

  describe('window.resize debouncing case', () => {
    const host = {};
    const fn = jest.fn();

    beforeAll(() => ESLEventUtils.subscribe(host, {
      event: 'resize',
      target: ESLEventUtils.decorate(window, debounce)
    }, fn));
    afterAll(() => ESLEventUtils.unsubscribe(host));

    beforeEach(() => fn.mockReset());
    afterEach(() => jest.runAllTimers());

    test('Proxy resize receive the resize event',  ()=> {
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

    beforeAll(() => ESLEventUtils.subscribe(host, {
      event: 'scroll',
      target: ESLEventUtils.decorate(window, throttle)
    }, fn));
    afterAll(() => ESLEventUtils.unsubscribe(host));

    beforeEach(() => fn.mockReset());
    afterEach(() => jest.runAllTimers());

    test('Proxy scroll receive the scroll event',  ()=> {
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
