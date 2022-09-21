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
});
