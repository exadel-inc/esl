import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';
import {ESLToggleableDispatcher, ESLToggleable} from '../core';

const createToggleableMock = (): ESLToggleable =>
  Object.assign(new SyntheticEventTarget(), {
    hide: jest.fn(),
  }) as any;

describe('ESLToggleableDispatcher custom element', () => {
  ESLToggleableDispatcher.init();
  const $dispatcher = document.querySelector(ESLToggleableDispatcher.is) as ESLToggleableDispatcher;

  const groupAttr1 = 'test-group1';

  const $el1 = createToggleableMock();
  const $el2 = createToggleableMock();

  $el1.groupName = groupAttr1;
  $el2.groupName = groupAttr1;

  beforeAll(() => {
    jest.useFakeTimers();
    ESLToggleable.register();
  });

  describe('ESLToggleableDispatcher instance', () => {
    test('should initialize with correct tag name and default root as body', () => {
      expect($dispatcher).toBeInstanceOf(ESLToggleableDispatcher);
      expect($dispatcher.root).toBe(document.body);
    });

    test('should initialize again for child nodes', () => {
      const $root = document.createElement('div');
      const $child = document.createElement('div');
      $root.appendChild($child);

      ESLToggleableDispatcher.init($root);
      ESLToggleableDispatcher.init($child);
      expect($root.querySelectorAll(ESLToggleableDispatcher.is)).toHaveLength(2);
    });

    test('shouldn`t initialize if no parent element provided', () => expect(() => ESLToggleableDispatcher.init(null as any)).toThrowError());

    test('shouldn`t initialize on the same level twice', () => {
      const $root = document.createElement('div');

      ESLToggleableDispatcher.init($root);
      ESLToggleableDispatcher.init($root);
      expect($root.querySelectorAll(ESLToggleableDispatcher.is)).toHaveLength(1);
    });
  });

  describe('Basic functionality', () => {
    test('function getActive', () => {
      expect($dispatcher.getActive(groupAttr1)).toBe(undefined);
    });

    test('function setActive', () => {
      $dispatcher.setActive(groupAttr1, $el1);
      expect($dispatcher.getActive(groupAttr1)).toBe($el1);
    });

    test('function deleteActive', () => {
      $dispatcher.deleteActive(groupAttr1, $el1);
      expect($dispatcher.getActive(groupAttr1)).toBe(undefined);
    });

    test('function hideActive', () => {
      $dispatcher.setActive(groupAttr1, $el1);
      $dispatcher.hideActive(groupAttr1);
      expect($el1.hide).toBeCalledTimes(1);
    });
  });
});
