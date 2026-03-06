import {ESLToggleable} from '../core';

describe('ESLToggleable custom element - a11y attributes test', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    ESLToggleable.register();
  });

  describe('Default a11y target', () => {
    const $el = ESLToggleable.create();

    beforeAll(() => document.body.appendChild($el));

    test('a11y target set initially', () => expect($el.getAttribute('aria-hidden')).toBe('true'));

    test('a11y target should be update on toggle actions', () => {
      $el.show();
      jest.advanceTimersByTime(1);
      expect($el.getAttribute('aria-hidden')).toBe('false');

      $el.hide();
      jest.advanceTimersByTime(1);
      expect($el.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('No a11y target', () => {
    const $el = ESLToggleable.create();
    $el.setAttribute('a11y-target', 'none');

    beforeAll(() => document.body.appendChild($el));

    test('a11y target should be missing initially', () => expect($el.hasAttribute('aria-hidden')).toBe(false));

    test('a11y target shouldn`t apper on toggle actions', () => {
      $el.show();
      jest.advanceTimersByTime(1);
      expect($el.hasAttribute('aria-hidden')).toBe(false);

      $el.hide();
      jest.advanceTimersByTime(1);
      expect($el.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  describe('Internal element a11y target', () => {
    const $el = ESLToggleable.create();
    $el.setAttribute('a11y-target', 'button');

    const $innerEl = document.createElement('button');
    $el.appendChild($innerEl);

    beforeAll(() => document.body.appendChild($el));

    test('a11y target should initially appear on target element', () => {
      expect($el.hasAttribute('aria-hidden')).toBe(false);
      expect($innerEl.getAttribute('aria-hidden')).toBe('true');
    });

    test('a11y target should update on target element on toggle action', () => {
      $el.show();
      jest.advanceTimersByTime(1);
      expect($el.hasAttribute('aria-hidden')).toBe(false);
      expect($innerEl.getAttribute('aria-hidden')).toBe('false');

      $el.hide();
      jest.advanceTimersByTime(1);
      expect($el.hasAttribute('aria-hidden')).toBe(false);
      expect($innerEl.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
