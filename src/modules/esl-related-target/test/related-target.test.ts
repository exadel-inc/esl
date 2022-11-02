import {ESLRelatedTarget} from '../core/esl-related-target';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';

describe('ESLRelatedTarget: show/hide depending on mixin element state', () => {
  const $el = document.createElement(ESLToggleable.is) as ESLToggleable;
  const $relatedEl = document.createElement(ESLToggleable.is) as ESLToggleable;
  $relatedEl.setAttribute('id', 'related-toggleable');
  $el.setAttribute(ESLRelatedTarget.is, '#related-toggleable');

  jest.useFakeTimers();
  beforeAll(() =>  {
    ESLToggleable.register();
    ESLRelatedTarget.register();
    document.body.appendChild($el);
    document.body.appendChild($relatedEl);
  });
  afterAll(() => {
    ($el.parentElement === document.body) && document.body.removeChild($el);
    ($relatedEl.parentElement === document.body) && document.body.removeChild($relatedEl);
  });

  describe('Synchronization of mixin and target states: SHOW_REQUEST on the current mixin element leads to show target element', () => {
    beforeEach(() =>  $el.hide());
    test('Direct call of show function', () => {
      expect($relatedEl.open).toBe(false);
      $el.show();
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(true);
    });
    test('SHOW_REQUEST_EVENT dispatching', () => {
      expect($relatedEl.open).toBe(false);
      $el.dispatchEvent(new CustomEvent($el.SHOW_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(true);
    });
  });

  describe('Synchronization of mixin and target states: HIDE_REQUEST on the current mixin element leads to show target element', () => {
    beforeEach(() =>  $el.show());
    test('Direct call of hide function', () => {
      expect($relatedEl.open).toBe(true);
      $el.hide();
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(false);
    });
    test('HIDE_REQUEST_EVENT dispatching', () => {
      expect($relatedEl.open).toBe(true);
      $el.dispatchEvent(new CustomEvent($el.HIDE_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
      expect($relatedEl.open).toBe(false);
    });
  });
});
