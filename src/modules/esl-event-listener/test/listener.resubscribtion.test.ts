import {ESLBaseElement} from '../../esl-base-element/core';
import {ESLEventUtils} from '../core/api';
import {listen} from '../../esl-utils/decorators/listen';

describe('ESLEventListener re-subscribtion usecase with condition', () => {
  class TestSubsEl extends ESLBaseElement {
    public static override is = 'test-subs-el';
    public mockFn = jest.fn();

    get enabled() {
      return this.hasAttribute('enabled');
    }
    set enabled(value) {
      this.$$attr('enabled', value);
      this.$$off(this.onClick);
      this.$$on(this.onClick);
    }

    @listen({event: 'click', condition: (that: TestSubsEl) => that.enabled})
    onClick() {
      this.mockFn();
    }
  }

  TestSubsEl.register();

  const host = TestSubsEl.create();

  test('ESLEventListener initial subscription is rejected by condition', () => {
    expect(ESLEventUtils.listeners(host).length).toBe(0);
    host.click();
    expect(host.mockFn).not.toBeCalled();
  });

  test('ESLEventListener subscription occurs after condition is resolved to true', () => {
    host.enabled = true;
    expect(ESLEventUtils.listeners(host).length).toBe(1);
    host.click();
    expect(host.mockFn).toBeCalled();
  });

  test('ESLEventListener subscription is removed after condition is resolved to false', () => {
    host.enabled = false;
    expect(ESLEventUtils.listeners(host).length).toBe(0);
    host.click();
    expect(host.mockFn).toBeCalledTimes(1);
  });
});
