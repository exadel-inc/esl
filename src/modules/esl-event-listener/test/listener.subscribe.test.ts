import {ESLEventUtils} from '../core';

describe('ESLEventUtils:subscribe tests', () => {
  test('ESLEventUtils.subscribe successfully subscribes listener by descriptor', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, {event: 'click'}, handle);
    expect(ESLEventUtils.listeners($host).length).toBe(1);
    ESLEventUtils.unsubscribe($host);
  });

  test('ESLEventUtils.subscribe successfully subscribes listener by event name', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, 'click', handle);
    expect(ESLEventUtils.listeners($host).length).toBe(1);
    ESLEventUtils.unsubscribe($host);
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
    ESLEventUtils.unsubscribe($host);
  });

  test('ESLEventListener subscribes successfully by global selector',  () => {
    const host = {};
    const handle = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', target: 'body'}, handle);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.unsubscribe(host);
  });

  test('ESLEventListener subscribes successfully by target instance',  () => {
    const host = {};
    const el = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', target: el}, handle);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.unsubscribe(host);
  });

  test('ESLEventUtils.subscribe successfully subscribes listeners by string with multiple events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, 'click keydown', handle);
    expect(ESLEventUtils.listeners($host).length).toBe(2);
    expect(ESLEventUtils.listeners($host, 'keydown').length).toBe(1);
    expect(ESLEventUtils.listeners($host, 'click').length).toBe(1);
    ESLEventUtils.unsubscribe($host);
  });

  test('ESLEventListener observes target events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    ESLEventUtils.subscribe($host, {event: 'click'}, handle);
    $host.click();
    expect(handle).toBeCalledTimes(1);
    ESLEventUtils.unsubscribe($host);
  });

  test('ESLEventListener does not subscribe if no targets',  () => {
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
    const host = {};
    const handle = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click'}, handle);
    expect(ESLEventUtils.listeners(host).length).toBe(0);
  });

  describe('ESLEventListener subscribes correctly for any object-like host', () => {
    test.each([
      {},
      Object.create(null),
      function hostFunction() {},
      class HostClass {},
      new (class HostClassInst {})()
    ])('ESLEventListener subscribes correctly for %o host',  (host) => {
      const handle = jest.fn();
      ESLEventUtils.subscribe(host, {event: 'click', target: document.body}, handle);
      expect(ESLEventUtils.listeners(host).length).toBe(1);
      ESLEventUtils.unsubscribe(host);
    });

    test('ESLEventListener can not subscribe for primitive host', () => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
      const handle = jest.fn();
      const count = ESLEventUtils.subscribe(1 as any, {event: 'click', target: document.body}, handle).length;
      expect(count).toBe(0);
    });

    test('ESLEventListener can not subscribe for null host', () => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
      const handle = jest.fn();
      const count = ESLEventUtils.subscribe(null as any, {event: 'click', target: document.body}, handle).length;
      expect(count).toBe(0);
    });
  });
});
