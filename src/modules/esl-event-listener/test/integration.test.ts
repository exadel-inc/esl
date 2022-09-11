import {EventUtils} from '../core/api';
import {listen} from '../../esl-utils/decorators/listen';

describe('EventUtils: integration', () => {
  test('subscribe', ()  => {
    const div = document.createElement('div');
    const handle = jest.fn();

    EventUtils.subscribe(div, {event: 'click'}, handle);

    expect(EventUtils.listeners(div).length).toBe(1);

    expect(handle).toBeCalledTimes(0);
    div.click();
    expect(handle).toBeCalledTimes(1);
  });

  test('subscribe delegate', ()  => {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    div.appendChild(btn);
    const span = document.createElement('span');
    div.appendChild(span);
    const handle = jest.fn();
    EventUtils.subscribe(div, {event: 'click', selector: 'button'}, handle);

    expect(handle).toBeCalledTimes(0);
    btn.click();
    expect(handle).toBeCalledTimes(1);
    span.click();
    expect(handle).toBeCalledTimes(1);
  });

  describe('subscription constraints', () => {
    test('subscribe one event with the same handler does not leads to duplicate subscription', () => {
      const host = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, 'click', fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, 'click', fn);
      expect(EventUtils.listeners(host).length).toBe(1);
    });

    test('subscribe one event with different handlers produces different subscriptions', () => {
      const host = document.createElement('div');
      const fn1 = jest.fn();
      const fn2 = jest.fn();

      EventUtils.subscribe(host, 'click', fn1);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, 'click', fn2);
      expect(EventUtils.listeners(host).length).toBe(2);
    });

    test('subscribe of single descriptor multiple times does not leads to duplicate subscription', () => {
      class TestEl extends HTMLElement {
        @listen('click')
        public onClick() {}
      }
      customElements.define('subscription-test-el', TestEl);

      const $el = document.createElement('subscription-test-el') as TestEl;
      EventUtils.subscribe($el, $el.onClick);
      expect(EventUtils.listeners($el).length).toBe(1);
      EventUtils.subscribe($el, $el.onClick);
      expect(EventUtils.listeners($el).length).toBe(1);
    });
  });

  describe('unsubscribe', () => {
    const handle = jest.fn();
    const div = document.createElement('div');

    beforeEach(() => {
      EventUtils.subscribe(div, {id: 'test', event: 'click'}, handle);
    });

    test('all', ()  => {
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div);
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by id', ()  => {
      EventUtils.unsubscribe(div, {id: 'testic'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, {id: 'test'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by event', ()  => {
      EventUtils.unsubscribe(div, {event: 'mousedown'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, {event: 'click'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by event(string)', ()  => {
      EventUtils.unsubscribe(div, 'test');
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, 'click');
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by handler', ()  => {
      EventUtils.unsubscribe(div, () => 1);
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, handle);
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('with multiple criteria', ()  => {
      EventUtils.unsubscribe(div, handle, {event: 'key'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, handle, {event: 'click'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });
  });
});
