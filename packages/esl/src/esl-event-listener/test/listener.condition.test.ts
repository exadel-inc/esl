import {ESLEventUtils} from '../core/api';

describe('ESlEventListener subscription with conditional statement', () => {
  const host = document.createElement('section');

  afterEach(() => ESLEventUtils.unsubscribe(host));

  test('ESLEventListener rejected by condition does not produce warning', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const handler = vi.fn();
    ESLEventUtils.subscribe(host, {event: 'click', condition: false}, handler);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('ESLEventListener does not subscribe if condition is false', () => {
    const handler = vi.fn();
    const listeners = ESLEventUtils.subscribe(host, {event: 'click', condition: false}, handler);
    expect(listeners.length).toBe(0);
  });

  test('ESLEventListener subscribes if condition is true', () => {
    const handler = vi.fn();
    const listeners = ESLEventUtils.subscribe(host, {event: 'click', condition: true}, handler);
    expect(listeners.length).toBe(1);
  });

  test('ESLEventListener does not subscribes if condition is resolves to false', () => {
    const handler = vi.fn();
    const listeners = ESLEventUtils.subscribe(host, {event: 'click', condition: () => false}, handler);
    expect(listeners.length).toBe(0);
  });

  test('ESLEventListener subscribes if condition is resolves to true', () => {
    const handler = vi.fn();
    const listeners = ESLEventUtils.subscribe(host, {event: 'click', condition: () => true}, handler);
    expect(listeners.length).toBe(1);
  });
});
