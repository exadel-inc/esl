import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {ESLToggleableDispatcher, ESLToggleable} from '../core';

describe('ESLToggleableDispatcher - integration with ESLToggleable', () => {
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

  describe('Basic integration tests', () => {
    describe('toggle actions', () => {
      test('show', () => {
        $el1.show();
        jest.advanceTimersByTime(1);
        expect($dispatcher.getActive(groupAttr1)).toBe($el1);

        $el2.show();
        jest.advanceTimersByTime(1);
        expect($dispatcher.getActive(groupAttr1)).toBe($el2);
        expect($el1.open).toBe(false);
      });

      test('hide', () => {
        $el2.hide();
        jest.advanceTimersByTime(1);
        expect($dispatcher.getActive(groupAttr1)).toBe(undefined);
      });
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

    describe('Invalid dispatcher target', () => {
      const $el3 = document.createElement('div');
      Object.assign($el3, {groupName: groupAttr1});
      document.body.appendChild($el3);

      test('invalid show', () => {
        $el2.show();
        jest.advanceTimersByTime(1);
        expect($dispatcher.getActive(groupAttr1)).toBe($el2);

        ESLEventUtils.dispatch($el3, ESLToggleable.prototype.BEFORE_SHOW_EVENT);
        jest.advanceTimersByTime(1);
        expect($el2.open).toBe(true);

        ESLEventUtils.dispatch($el3, ESLToggleable.prototype.SHOW_EVENT);
        jest.advanceTimersByTime(1);
        expect($dispatcher.getActive(groupAttr1)).toBe($el2);
      });

      test('invalid group change', () => {
        ESLEventUtils.dispatch($el3, ESLToggleable.prototype.GROUP_CHANGED_EVENT);
        jest.advanceTimersByTime(1);
        expect($dispatcher.getActive(groupAttr1)).toBe($el2);
      });

      test('invalid hide', () => {
        ESLEventUtils.dispatch($el3, ESLToggleable.prototype.HIDE_EVENT);
        jest.advanceTimersByTime(1);
        expect($dispatcher.getActive(groupAttr1)).toBe($el2);
      });
    });
  });
});
