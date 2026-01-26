import {ESLEventUtils} from '../core/api';

describe('ESLEventUtils.subscribe subscribes single time', () => {
  test('subscribe one event with the same handler does not leads to duplicate subscription', () => {
    const host = document.createElement('div');
    const fn = vi.fn();

    ESLEventUtils.subscribe(host, 'click', fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, 'click', fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
  });

  test('subscribe one event with different handlers produces different subscriptions', () => {
    const host = document.createElement('div');
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    ESLEventUtils.subscribe(host, 'click', fn1);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, 'click', fn2);
    expect(ESLEventUtils.listeners(host).length).toBe(2);
  });

  test('subscribe considers descriptors with different selectors as different', () => {
    const host = document.createElement('div');
    const fn = vi.fn();

    ESLEventUtils.subscribe(host, {event: 'e', selector: 'a'}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, {event: 'e', selector: 'a'}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, {event: 'e', selector: 'b'}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(2);
    ESLEventUtils.subscribe(host, {event: 'e'}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(3);
  });

  test('subscribe considers descriptors with different targets as different', () => {
    const host = document.createElement('div');
    const target1 = document.createElement('div');
    const target2 = document.createElement('div');
    const fn = vi.fn();

    ESLEventUtils.subscribe(host, {event: 'e', target: target1}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, {event: 'e', target: target1}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, {event: 'e', target: target2}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(2);
    ESLEventUtils.subscribe(host, {event: 'e'}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(3);
  });

  test('subscribe considers descriptors with different capture phases as different', () => {
    const host = document.createElement('div');
    const fn = vi.fn();

    ESLEventUtils.subscribe(host, {event: 'e', capture: true}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, {event: 'e', capture: true}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    ESLEventUtils.subscribe(host, {event: 'e', capture: false}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(2);
    ESLEventUtils.subscribe(host, {event: 'e'}, fn);
    expect(ESLEventUtils.listeners(host).length).toBe(2);
  });
});
