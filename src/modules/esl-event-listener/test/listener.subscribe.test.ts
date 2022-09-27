import {ESLEventUtils} from '../core';

describe('ESLEventUtils:subscribe tests', () => {
  test('ESLEventUtils.subscribe successfully subscribes listener by descriptor', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, {event: 'click'}, handle);
    expect(ESLEventUtils.listeners($host).length).toBe(1);
  });

  test('ESLEventUtils.subscribe successfully subscribes listener by event name', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, 'click', handle);
    expect(ESLEventUtils.listeners($host).length).toBe(1);
  });

  test('ESLEventUtils.subscribe successfully subscribes listener by event provider', () => {
    const $host = document.createElement('div');
    const provider = jest.fn(function () {
      expect(this).toBe($host);
      return 'event';
    });
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, {event: provider}, handle);
    expect(ESLEventUtils.listeners($host).length).toBe(1);
    expect(provider).toBeCalledWith($host);
  });

  test('ESLEventUtils.subscribe successfully subscribes listeners by string with multiple events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, 'click keydown', handle);
    expect(ESLEventUtils.listeners($host).length).toBe(2);
    expect(ESLEventUtils.listeners($host, 'keydown').length).toBe(1);
    expect(ESLEventUtils.listeners($host, 'click').length).toBe(1);
  });

  test('ESLEventListener observes target events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, {event: 'click'}, handle);
    $host.click();
    expect(handle).toBeCalledTimes(1);
  });
});
