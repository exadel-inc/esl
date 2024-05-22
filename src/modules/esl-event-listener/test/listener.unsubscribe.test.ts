import {ESLEventUtils} from '../core';

describe('ESLEventUtils:unsubscribe successfully removes listener', () => {
  const handle = jest.fn();
  const div = document.createElement('div');

  beforeEach(() => {
    ESLEventUtils.subscribe(div, {event: 'click', group: 'test'}, handle);
    ESLEventUtils.subscribe(div, {event: 'event', group: 'test'}, handle);
  });

  test('all', ()  => {
    ESLEventUtils.unsubscribe(div);
    expect(ESLEventUtils.listeners(div).length).toBe(0);
  });

  test('by event', ()  => {
    ESLEventUtils.unsubscribe(div, {event: 'mousedown'});
    expect(ESLEventUtils.listeners(div).length).toBe(2);
    ESLEventUtils.unsubscribe(div, {event: 'click'});
    expect(ESLEventUtils.listeners(div).length).toBe(1);
    ESLEventUtils.unsubscribe(div, {event: 'event'});
    expect(ESLEventUtils.listeners(div).length).toBe(0);
  });

  test('by event(string)', ()  => {
    ESLEventUtils.unsubscribe(div, 'test');
    expect(ESLEventUtils.listeners(div).length).toBe(2);
    ESLEventUtils.unsubscribe(div, 'click');
    expect(ESLEventUtils.listeners(div).length).toBe(1);
    ESLEventUtils.unsubscribe(div, 'event');
    expect(ESLEventUtils.listeners(div).length).toBe(0);
  });

  test('by handler', ()  => {
    ESLEventUtils.unsubscribe(div, () => 1);
    expect(ESLEventUtils.listeners(div).length).toBe(2);
    ESLEventUtils.unsubscribe(div, handle);
    expect(ESLEventUtils.listeners(div).length).toBe(0);
  });

  test('by group', ()  => {
    ESLEventUtils.unsubscribe(div, {group: 'test'});
    expect(ESLEventUtils.listeners(div).length).toBe(0);
  });

  test('with multiple criteria', ()  => {
    ESLEventUtils.unsubscribe(div, handle, {event: 'key'});
    expect(ESLEventUtils.listeners(div).length).toBe(2);
    ESLEventUtils.unsubscribe(div, handle, {event: 'click'});
    expect(ESLEventUtils.listeners(div).length).toBe(1);
  });
});
