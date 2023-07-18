import {ESLToggleableDispatcher, ESLToggleable} from '../core';
import {ESLEventUtils} from '../../esl-event-listener/core/api';

describe('ESLToggleableDispatcher custom element', () => {
  ESLToggleableDispatcher.init();
  const $dispatcher = document.querySelector(ESLToggleableDispatcher.is) as ESLToggleableDispatcher;

  const groupAttr1 = 'test-group1';
  const groupAttr2 = 'test-group2';

  const $el1 = ESLToggleable.create();
  const $el2 = ESLToggleable.create();

  $el1.setAttribute('group', groupAttr1);
  $el2.setAttribute('group', groupAttr1);

  document.body.appendChild($el1);
  document.body.appendChild($el2);

  beforeAll(() => {
    jest.useFakeTimers();
    ESLToggleable.register();
  });

  describe('ESLToggleableDispatcher instance', () => {
    test('should initialize with correct tag name and default root as body', () => {
      expect($dispatcher).toBeInstanceOf(ESLToggleableDispatcher);
      expect($dispatcher.root).toBe(document.body);
    });

    test('shouldn`t initialize on the same level twice', () => {
      ESLToggleableDispatcher.init();
      expect(document.querySelectorAll(ESLToggleableDispatcher.is)).toHaveLength(1);
    });

    test('shouldn`t initialize if no parent element provided', () => expect(() => ESLToggleableDispatcher.init(null as any)).toThrowError());

    test('should initialize on the same level twice', () => {
      ESLToggleableDispatcher.init($dispatcher);
      expect(document.querySelectorAll(ESLToggleableDispatcher.is)).toHaveLength(2);
    });
  });

  describe('Basic functionality', () => {
    test('toggle actions in group', () => {
      $el1.show();
      jest.advanceTimersByTime(1);

      expect($dispatcher.getActive(groupAttr1)).toBe($el1);

      $el2.show();
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe($el2);
      expect($el1.open).toBe(false);

      $el2.hide();
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe(undefined);
    });

    test('group change action', () => {
      $el1.show();
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe($el1);

      $el1.setAttribute('group', groupAttr2);
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe(undefined);
      expect($dispatcher.getActive(groupAttr2)).toBe($el1);
    });
  });

  describe('Invalid action calls', () => {
    test('invalid group change', () => {
      const groupAttrInvalid = '';
      const $el3 = ESLToggleable.create();
      document.body.appendChild($el3);

      $dispatcher.setActive(groupAttrInvalid, $el3);
      expect($dispatcher.getActive(groupAttrInvalid)).toBe(undefined);
    });

    test('invalid dispatcher target', () => {
      const $el3 = document.createElement('div');
      Object.assign($el3, {groupName: groupAttr1});
      document.body.appendChild($el3);

      $el2.show();
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe($el2);

      ESLEventUtils.dispatch($el3, ESLToggleable.prototype.BEFORE_SHOW_EVENT);
      jest.advanceTimersByTime(1);
      expect($el2.open).toBe(true);

      ESLEventUtils.dispatch($el3, ESLToggleable.prototype.SHOW_EVENT);
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe($el2);

      ESLEventUtils.dispatch($el3, ESLToggleable.prototype.GROUP_CHANGED_EVENT);
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe($el2);

      ESLEventUtils.dispatch($el3, ESLToggleable.prototype.HIDE_EVENT);
      jest.advanceTimersByTime(1);
      expect($dispatcher.getActive(groupAttr1)).toBe($el2);
    });
  });
});
