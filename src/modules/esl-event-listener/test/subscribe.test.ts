import {EventUtils} from '../core/api';

describe('EventUtils:subscribe tests', () => {
  test('EventUtils:subscribe successfully subscribe listener by descriptor', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, {event: 'click'}, handle);
    expect(EventUtils.listeners($host).length).toBe(1);
  });
  test('EventUtils:subscribe successfully subscribe listener by event name', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, 'click', handle);
    expect(EventUtils.listeners($host).length).toBe(1);
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

  describe('EventUtils.subscribe subscribes single time', () => {
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

    test('subscribe considers descriptors with different selectors as different', () => {
      const host = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, {event: 'e', selector: 'a'}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', selector: 'a'}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', selector: 'b'}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
      EventUtils.subscribe(host, {event: 'e'}, fn);
      expect(EventUtils.listeners(host).length).toBe(3);
    });

    test('subscribe considers descriptors with different targets as different', () => {
      const host = document.createElement('div');
      const target1 = document.createElement('div');
      const target2 = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, {event: 'e', target: target1}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', target: target1}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', target: target2}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
      EventUtils.subscribe(host, {event: 'e'}, fn);
      expect(EventUtils.listeners(host).length).toBe(3);
    });

    test('subscribe considers descriptors with different capture phases as different', () => {
      const host = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, {event: 'e', capture: true}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', capture: true}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', capture: false}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
      EventUtils.subscribe(host, {event: 'e'}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
    });
  });
});
