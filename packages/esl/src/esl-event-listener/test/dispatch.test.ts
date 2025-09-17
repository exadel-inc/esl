import {ESLEventUtils} from '../core';

describe('ESLEventUtils.dispatch', () => {
  const el = document.createElement('div');
  const mockDispatch = jest.spyOn(el, 'dispatchEvent').mockReturnValue(true);

  beforeEach(() => mockDispatch.mockClear());

  test('dispatches CustomEvent for normal event name', () => {
    const eventName = `click${Math.random()}`;
    const result = ESLEventUtils.dispatch(el, eventName);

    expect(result).toBe(true);
    expect(el.dispatchEvent).toHaveBeenCalled();

    const event: CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
    expect(event.type).toBe(eventName);
    expect(event.bubbles).toBe(true);
    expect(event.cancelable).toBe(true);
  });

  test('does not dispatch CustomEvent for empty event name', () => {
    const result = ESLEventUtils.dispatch(el, '');

    expect(result).toBe(true);
    expect(el.dispatchEvent).not.toHaveBeenCalled();
  });

  test('does not dispatch CustomEvent for whitespace-only event name', () => {
    const result = ESLEventUtils.dispatch(el, '   ');

    expect(result).toBe(true);
    expect(el.dispatchEvent).not.toHaveBeenCalled();
  });

  test('does not dispatch CustomEvent for tab/newline-only event name', () => {
    const result = ESLEventUtils.dispatch(el, '\t\n  ');

    expect(result).toBe(true);
    expect(el.dispatchEvent).not.toHaveBeenCalled();
  });

  test('dispatches CustomEvent for event name with leading/trailing whitespace', () => {
    const eventName = `  test-event  `;
    const result = ESLEventUtils.dispatch(el, eventName);

    expect(result).toBe(true);
    expect(el.dispatchEvent).toHaveBeenCalled();

    const event: CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
    expect(event.type).toBe(eventName); // Should preserve original name, not trimmed
  });

  test('passes eventInit options correctly', () => {
    const eventName = 'test-event';
    const eventInit = {
      detail: {data: 'test'},
      bubbles: false,
      cancelable: false
    };
    
    const result = ESLEventUtils.dispatch(el, eventName, eventInit);

    expect(result).toBe(true);
    expect(el.dispatchEvent).toHaveBeenCalled();

    const event: CustomEvent = (el.dispatchEvent as jest.Mock).mock.calls[0][0];
    expect(event.type).toBe(eventName);
    expect(event.bubbles).toBe(false);
    expect(event.cancelable).toBe(false);
    expect(event.detail).toEqual({data: 'test'});
  });
});