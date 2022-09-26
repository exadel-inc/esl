import {EventUtils} from '../core/api';

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
