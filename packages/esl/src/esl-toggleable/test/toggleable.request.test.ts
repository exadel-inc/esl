import {ESLToggleable} from '../core/esl-toggleable';
import {ESLEventUtils} from '../../esl-event-listener/core/api';
import type {ESLToggleableRequestDetails} from '../core/esl-toggleable';

describe('ESLToggleable: show/hide-request events', () => {
  beforeAll(() => ESLToggleable.register());

  describe('Direct events correctly caught by toggleable', () => {
    const $el = ESLToggleable.create();
    vi.useFakeTimers();
    beforeAll(() => document.body.appendChild($el));
    afterAll(() => ($el.parentElement === document.body) && document.body.removeChild($el));
    test('Direct SHOW_REQUEST leads to show of the toggleable', () => {
      $el.hide();
      vi.advanceTimersByTime(1);
      expect($el.open).toBe(false);
      $el.dispatchEvent(new CustomEvent($el.SHOW_REQUEST_EVENT));
      vi.advanceTimersByTime(1);
      expect($el.open).toBe(true);
    });
    test('Direct HIDE_REQUEST leads to show of the toggleable', () => {
      $el.show();
      vi.advanceTimersByTime(1);
      expect($el.open).toBe(true);
      $el.dispatchEvent(new CustomEvent($el.HIDE_REQUEST_EVENT));
      vi.advanceTimersByTime(1);
      expect($el.open).toBe(false);
    });
  });

  describe('ESLToggleables catch and filtering bubbling events', () => {
    const $root = ESLToggleable.create();
    const $childTbl = ESLToggleable.create();
    const $button = document.createElement('button');
    $root.classList.add('root');
    $root.appendChild($childTbl);
    $childTbl.appendChild($button);

    vi.useFakeTimers();
    beforeAll(() => document.body.appendChild($root));
    afterAll(() => ($root.parentElement === document.body) && document.body.removeChild($root));

    test('Initial hide request passed for all toggleables in hierarchy', () => {
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.HIDE_REQUEST_EVENT);
      vi.advanceTimersByTime(1);
      expect($root.open).toBe(false);
      expect($childTbl.open).toBe(false);
    });
    test('Show request passed for all toggleables in hierarchy', () => {
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.SHOW_REQUEST_EVENT);
      vi.advanceTimersByTime(1);
      expect($root.open).toBe(true);
      expect($childTbl.open).toBe(true);
    });
    test('Hide request passed for all toggleables in hierarchy', () => {
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.HIDE_REQUEST_EVENT);
      vi.advanceTimersByTime(1);
      expect($root.open).toBe(false);
      expect($childTbl.open).toBe(false);
    });

    test('Show/hide request with filter processed correctly in toggleables in hierarchy', () => {
      const detail: ESLToggleableRequestDetails = {match: '.root'};
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.SHOW_REQUEST_EVENT, {detail});
      vi.advanceTimersByTime(1);
      expect($root.open).toBe(true);
      expect($childTbl.open).toBe(false);

      ESLEventUtils.dispatch($button, ESLToggleable.prototype.HIDE_REQUEST_EVENT, {detail});
      vi.advanceTimersByTime(1);
      expect($root.open).toBe(false);
      expect($childTbl.open).toBe(false);
    });
  });
});
