import {EventUtils} from '../core';

describe('EventUtils:unsubscribe successfully removes listener', () => {
  const handle = jest.fn();
  const div = document.createElement('div');

  beforeEach(() => {
    EventUtils.subscribe(div, {event: 'click'}, handle);
    EventUtils.subscribe(div, {event: 'event'}, handle);
  });

  test('all', ()  => {
    EventUtils.unsubscribe(div);
    expect(EventUtils.listeners(div).length).toBe(0);
  });

  test('by event', ()  => {
    EventUtils.unsubscribe(div, {event: 'mousedown'});
    expect(EventUtils.listeners(div).length).toBe(2);
    EventUtils.unsubscribe(div, {event: 'click'});
    expect(EventUtils.listeners(div).length).toBe(1);
    EventUtils.unsubscribe(div, {event: 'event'});
    expect(EventUtils.listeners(div).length).toBe(0);
  });

  test('by event(string)', ()  => {
    EventUtils.unsubscribe(div, 'test');
    expect(EventUtils.listeners(div).length).toBe(2);
    EventUtils.unsubscribe(div, 'click');
    expect(EventUtils.listeners(div).length).toBe(1);
    EventUtils.unsubscribe(div, 'event');
    expect(EventUtils.listeners(div).length).toBe(0);
  });

  test('by handler', ()  => {
    EventUtils.unsubscribe(div, () => 1);
    expect(EventUtils.listeners(div).length).toBe(2);
    EventUtils.unsubscribe(div, handle);
    expect(EventUtils.listeners(div).length).toBe(0);
  });

  test('with multiple criteria', ()  => {
    EventUtils.unsubscribe(div, handle, {event: 'key'});
    expect(EventUtils.listeners(div).length).toBe(2);
    EventUtils.unsubscribe(div, handle, {event: 'click'});
    expect(EventUtils.listeners(div).length).toBe(1);
  });
});
