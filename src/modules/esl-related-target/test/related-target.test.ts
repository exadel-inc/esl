import {ESLRelatedTarget} from '../core/esl-related-target';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';

describe('ESLRelatedTarget: show/hide depending on mixin element state', () => {
  beforeAll(() => ESLToggleable.register());
  beforeAll(() => ESLRelatedTarget.register());

  const $el = document.createElement(ESLToggleable.is) as ESLToggleable;
  const $relatedEl = document.createElement(ESLToggleable.is) as ESLToggleable;
  $relatedEl.setAttribute('id', 'related-toggleable');
  $el.setAttribute(ESLRelatedTarget.is, '#related-toggleable');

  jest.useFakeTimers();
  beforeAll(() => document.body.appendChild($el));
  beforeAll(() => document.body.appendChild($relatedEl));
  afterAll(() => ($el.parentElement === document.body) && document.body.removeChild($el));
  afterAll(() => ($relatedEl.parentElement === document.body) && document.body.removeChild($relatedEl));

  describe('Synchronization of mixin and target states: check SHOW_REQUEST event', () => {
    test('SHOW_REQUEST on the current mixin element leads to show target element', () => {
      $el.hide();
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);
      expect($relatedEl.open).toBe(false);
      $el.dispatchEvent(new CustomEvent($el.SHOW_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(true);
      expect($relatedEl.open).toBe(true);
    });
  });

  describe('Synchronization of mixin and target states: check HIDE_REQUEST event', () => {
    test('HIDE_REQUEST on the current mixin element leads to show target element', () => {
      $el.show();
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(true);
      expect($relatedEl.open).toBe(true);
      $el.dispatchEvent(new CustomEvent($el.HIDE_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);
      expect($relatedEl.open).toBe(false);
    });
  });
});
