import {ESLEventUtils} from '../core/api';

describe('ESLEventUtils.subscribe invokes with `once` attribute', () => {
  const host = document.createElement('a');
  const fn = jest.fn();

  test('subscription to a single event is called at most once after being adding', () => {
    ESLEventUtils.subscribe(host, {event: 'click', once: true}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);

    host.click();
    expect(ESLEventUtils.listeners(host).length).toBe(0);
  });

  test('subscriptions to the multiple events are called at most once after being adding', () => {
    ESLEventUtils.subscribe(host, {event: 'click keydown', once: true}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(2);

    host.click();
    expect(ESLEventUtils.listeners(host, 'click').length).toBe(0);
    expect(ESLEventUtils.listeners(host, 'keydown').length).toBe(1);

    host.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
    expect(ESLEventUtils.listeners(host, 'keydown').length).toBe(0);
  });
});
