import {ESLToggleable} from '../core';
import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {ESC} from '../../esl-utils/dom/keys';

import type {ESLToggleableRequestDetails} from '../core/esl-toggleable';

jest.mock('../../esl-utils/environment/device-detector', () => ({
  DeviceDetector: {
    hasHover: true,
  }
}));

describe('ESLToggleable: show/hide-request events', () => {
  beforeAll(() => ESLToggleable.register());

  afterAll(() => jest.clearAllMocks());

  describe('Direct events correctly caught by toggleable', () => {
    const $el = ESLToggleable.create();
    jest.useFakeTimers();
    beforeAll(() => document.body.appendChild($el));
    afterAll(() => ($el.parentElement === document.body) && document.body.removeChild($el));
    test('Direct SHOW_REQUEST leads to show of the toggleable', () => {
      $el.hide();
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);
      $el.dispatchEvent(new CustomEvent($el.SHOW_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(true);
    });
    test('Direct HIDE_REQUEST leads to show of the toggleable', () => {
      $el.show();
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(true);
      $el.dispatchEvent(new CustomEvent($el.HIDE_REQUEST_EVENT));
      jest.advanceTimersByTime(1);
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

    jest.useFakeTimers();
    beforeAll(() => document.body.appendChild($root));
    afterAll(() => ($root.parentElement === document.body) && document.body.removeChild($root));

    test('Initial hide request passed for all toggleables in hierarchy', () => {
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.HIDE_REQUEST_EVENT);
      jest.advanceTimersByTime(1);
      expect($root.open).toBe(false);
      expect($childTbl.open).toBe(false);
    });
    test('Show request passed for all toggleables in hierarchy', () => {
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.SHOW_REQUEST_EVENT);
      jest.advanceTimersByTime(1);
      expect($root.open).toBe(true);
      expect($childTbl.open).toBe(true);
    });
    test('Hide request passed for all toggleables in hierarchy', () => {
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.HIDE_REQUEST_EVENT);
      jest.advanceTimersByTime(1);
      expect($root.open).toBe(false);
      expect($childTbl.open).toBe(false);
    });

    test('Show/hide request with filter processed correctly in toggleables in hierarchy', () => {
      const detail: ESLToggleableRequestDetails = {match: '.root'};
      ESLEventUtils.dispatch($button, ESLToggleable.prototype.SHOW_REQUEST_EVENT, {detail});
      jest.advanceTimersByTime(1);
      expect($root.open).toBe(true);
      expect($childTbl.open).toBe(false);

      ESLEventUtils.dispatch($button, ESLToggleable.prototype.HIDE_REQUEST_EVENT, {detail});
      jest.advanceTimersByTime(1);
      expect($root.open).toBe(false);
      expect($childTbl.open).toBe(false);
    });
  });

  test('silent parameter', () => {
    const $el = ESLToggleable.create();
    $el.defaultParams = {silent: true};
    $el.dispatchEvent = jest.fn();
    document.body.appendChild($el);

    $el.show();
    jest.advanceTimersByTime(1);
    expect($el.open).toBe(true);
    expect($el.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({type: $el.REFRESH_EVENT}));
    expect($el.dispatchEvent).not.toHaveBeenCalledWith(expect.objectContaining({type: ESLToggleable.prototype.BEFORE_SHOW_EVENT}));
    expect($el.dispatchEvent).not.toHaveBeenCalledWith(expect.objectContaining({type: ESLToggleable.prototype.SHOW_EVENT}));
  });

  describe('Before event', () => {
    const $el = ESLToggleable.create();
    $el.dispatchEvent = jest.fn();
    document.body.appendChild($el);

    test('show event', () => {
      $el.show();
      $el.addEventListener(ESLToggleable.prototype.BEFORE_SHOW_EVENT, () => {
        expect($el.open).toBe(false);
        jest.advanceTimersByTime(1);
        expect($el.open).toBe(true);
      });
    });

    test('hide event', () => {
      $el.hide();
      $el.addEventListener(ESLToggleable.prototype.BEFORE_HIDE_EVENT, () => {
        expect($el.open).toBe(true);
        jest.advanceTimersByTime(1);
        expect($el.open).toBe(false);
      });
    });
  });

  describe('trackHover parameter', () => {
    let $el: ESLToggleable;

    beforeEach(() => {
      $el = ESLToggleable.create();
      $el.setAttribute('open', '');
      $el.defaultParams = {trackHover: true};
      document.body.appendChild($el);
      jest.advanceTimersByTime(1);
    });

    test('should enable hover tracking', () => {
      ESLEventUtils.dispatch($el, 'mouseleave');
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);

      ESLEventUtils.dispatch($el, 'mouseenter');
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(true);
    });

    test('should disable hover tracking', () => {
      $el.trackHoverParams = {trackHover: false};
      ESLEventUtils.dispatch($el, 'mouseleave');
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);

      ESLEventUtils.dispatch($el, 'mouseenter');
      jest.advanceTimersByTime(1);
      expect($el.open).toBe(false);
    });
  });

  describe('Outside action', () => {
    const $toggleable = ESLToggleable.create();
    const $button = document.createElement('button');
    const $siblingBtn = document.createElement('button');
    const $parentBtn = document.createElement('button');

    $toggleable.setAttribute('open', '');
    $toggleable.closeOnOutsideAction = true;
    $toggleable.appendChild($button);

    $parentBtn.appendChild($toggleable);
    document.body.appendChild($parentBtn);
    document.body.appendChild($siblingBtn);

    test('event came from outside scope element', () => {
      ESLEventUtils.dispatch(document.body, 'mouseup');
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(false);
    });

    test('event came from child element', () => {
      $toggleable.show();
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);

      ESLEventUtils.dispatch($button, 'mouseup');
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);
    });

    test('event came from valid activator', () => {
      $toggleable.show({activator: $parentBtn});
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);

      ESLEventUtils.dispatch($siblingBtn, 'mouseup');
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(false);
    });

    test('event came from invalid activator', () => {
      $toggleable.show({activator: $siblingBtn});
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);

      ESLEventUtils.dispatch($siblingBtn, 'mouseup');
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);
    });
  });

  test('inner close trigger', () => {
    const $root = ESLToggleable.create();
    $root.setAttribute('open', '');
    $root.setAttribute('close-on', '.test-button');
    const $button = document.createElement('button');
    $button.className = 'test-button';

    $root.appendChild($button);
    document.body.appendChild($root);

    jest.advanceTimersByTime(1);
    expect($root.open).toBe(true);

    ESLEventUtils.dispatch($button, 'click');
    jest.advanceTimersByTime(1);
    expect($root.open).toBe(false);
  });

  test('close on escape', () => {
    const $root = ESLToggleable.create();
    $root.setAttribute('open', '');
    $root.setAttribute('close-on-esc', '');

    document.body.appendChild($root);

    jest.advanceTimersByTime(1);
    expect($root.open).toBe(true);

    $root.dispatchEvent(new KeyboardEvent('keydown', {key: ESC}));
    jest.advanceTimersByTime(1);
    expect($root.open).toBe(false);
  });
});
