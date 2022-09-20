import {EventUtils} from '../core';

describe('EventUtils:subscribe tests', () => {
  test('EventUtils.subscribe successfully subscribes listener by descriptor', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, {event: 'click'}, handle);
    expect(EventUtils.listeners($host).length).toBe(1);
  });
  test('EventUtils.subscribe successfully subscribes listener by event name', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, 'click', handle);
    expect(EventUtils.listeners($host).length).toBe(1);
  });
  test('EventUtils.subscribe successfully subscribes listener by event provider', () => {
    const $host = document.createElement('div');
    const provider = jest.fn(function () {
      expect(this).toBe($host);
      return 'event';
    });
    const handle = jest.fn();
    EventUtils.subscribe($host, {event: provider}, handle);
    expect(EventUtils.listeners($host).length).toBe(1);
    expect(provider).toBeCalledWith($host);
  });

  test('EventUtils.subscribe successfully subscribes listeners by string with multiple events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, 'click keydown', handle);
    expect(EventUtils.listeners($host).length).toBe(2);
    expect(EventUtils.listeners($host, 'keydown').length).toBe(1);
    expect(EventUtils.listeners($host, 'click').length).toBe(1);
  });

  test('ESLEventListener observes target events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, {event: 'click'}, handle);

    $host.click();
    expect(handle).toBeCalledTimes(1);
  });
  test('ESLEventListener correctly observes target with selector (event delegation)', ()  => {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    div.appendChild(btn);
    const span = document.createElement('span');
    div.appendChild(span);
    const handle = jest.fn();
    EventUtils.subscribe(div, {event: 'click', selector: 'button'}, handle);

    btn.click();
    expect(handle).toBeCalledTimes(1);
    span.click();
    expect(handle).toBeCalledTimes(1);
  });

  describe('EventUtils.subscribe invokes with `once` attribute', () => {
    const host = document.createElement('a');
    const fn = jest.fn();

    test('subscription to a single event is called at most once after being adding', () => {
      EventUtils.subscribe(host, {event: 'click', once: true}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      host.click();
      expect(EventUtils.listeners(host).length).toBe(0);
    });

    test('subscriptions to the multiple events are called at most once after being adding', () => {
      EventUtils.subscribe(host, {event: 'click keydown', once: true}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);

      host.click();
      expect(EventUtils.listeners(host, 'click').length).toBe(0);
      expect(EventUtils.listeners(host, 'keydown').length).toBe(1);

      host.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
      expect(EventUtils.listeners(host, 'keydown').length).toBe(0);
    });
  });
});
