import {debounce} from '../../esl-utils/async/debounce';
import {ESLEventUtils} from '../core/api';

describe('ESLEventProxy: window proxy', () => {
  describe('window:resize event', () => {
    const TIMEOUT = 255;
    const host = {};
    const fn = jest.fn();
    jest.useFakeTimers();

    beforeAll(() => ESLEventUtils.subscribe(host, {
      event: 'resize',
      target: ESLEventUtils.decorate(window, debounce)
    }, fn));
    afterAll(() => ESLEventUtils.unsubscribe(host));

    test('Proxy resize receive the resize event',  ()=> {
      const event = new Event('resize');
      window.dispatchEvent(event);
      jest.advanceTimersByTime(TIMEOUT);
      expect(fn).lastCalledWith(event);
    });

    test('Proxy resize happens debounced (multiple events in bounds of debounce range)',  ()=> {
      fn.mockReset();
      expect(fn).toBeCalledTimes(0);
      jest.advanceTimersByTime(20);
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(20);
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(20);
      expect(fn).toBeCalledTimes(0);
      jest.advanceTimersByTime(TIMEOUT);
      expect(fn).toBeCalledTimes(1);
    });

    test('Proxy resize happens debounced (multiple events in bounds of two debounce range)',  ()=> {
      fn.mockReset();
      expect(fn).toBeCalledTimes(0);
      jest.advanceTimersByTime(20);
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(TIMEOUT);
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(TIMEOUT);
      expect(fn).toBeCalledTimes(2);
    });
  });
});
