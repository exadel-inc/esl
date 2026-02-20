import {ESLToggleable} from '../core';
import {ESLTrigger} from '../../esl-trigger/core';

describe('ESLToggleable custom element - integration with ESLTrigger', () => {
  const $trigger = ESLTrigger.create();
  const $toggleable = ESLToggleable.create();
  $trigger.$target = $toggleable;

  jest.spyOn($trigger, 'dispatchEvent');

  beforeAll(() => {
    jest.useFakeTimers();
    ESLToggleable.register();
    ESLTrigger.register();

    document.body.appendChild($trigger);
    document.body.appendChild($toggleable);
  });

  afterEach(() => {
    $trigger.hideTarget();
    jest.advanceTimersByTime(1);
    jest.resetAllMocks();
  });

  describe('Basic default functionality', () => {
    test('toggle action methods', () => {
      $trigger.showTarget();
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);

      $trigger.hideTarget();
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(false);

      $trigger.toggleTarget();
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);
    });

    test('trigger change event', () => {
      $trigger.showTarget();
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(true);
      expect($trigger.dispatchEvent).lastCalledWith(expect.objectContaining({type: $trigger.CHANGE_EVENT}));
    });
  });

  describe('Custom toggleable parameters', () => {
    test('toggle using custom trigger delay', () => {
      $trigger.showDelay = '100';
      $trigger.showTarget();
      jest.advanceTimersByTime(1);
      expect($toggleable.open).toBe(false);

      jest.advanceTimersByTime(99);
      expect($toggleable.open).toBe(true);
    });

    test('toggle using additional params object', () => {
      const params = {delay: 110, silent: true};

      $trigger.showTarget(params);
      jest.advanceTimersByTime(100);
      expect($toggleable.open).toBe(false);

      jest.advanceTimersByTime(109);
      expect($toggleable.open).toBe(true);
      expect($trigger.dispatchEvent).toBeCalledTimes(0);
    });
  });
});
