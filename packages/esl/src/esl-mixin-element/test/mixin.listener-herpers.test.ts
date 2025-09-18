import {ESLMixinElement} from '../ui/esl-mixin-element';
import {ESLEventUtils} from '../../esl-event-listener/core/api';

describe('Shortcut helpers for EventUtils', () => {
  class TestHelpersMixin extends ESLMixinElement {
    static override is = 'esl-test-helpers-mixin';

    public onEvent = jest.fn();
  }
  TestHelpersMixin.register();
  const $el = document.createElement('div');
  $el.setAttribute(TestHelpersMixin.is, '');

  beforeAll(() => document.body.appendChild($el));
  afterAll(() => document.body.removeChild($el));

  test('$$on call leads to correct subscribe call with mixin as a host', () => {
    const mock = jest.spyOn(ESLEventUtils, 'subscribe');
    const mixin = TestHelpersMixin.get($el) as TestHelpersMixin;
    const props = {event: 'test'};
    mixin.$$on(props, mixin.onEvent);
    expect(mock).toHaveBeenLastCalledWith(mixin, props, mixin.onEvent);
  });

  test('$$off call leads to correct unsubscribe call with mixin as a host', () => {
    const mock = jest.spyOn(ESLEventUtils, 'unsubscribe');
    const mixin = TestHelpersMixin.get($el) as TestHelpersMixin;
    const props = {event: 'test'};
    mixin.$$off(props, mixin.onEvent);
    expect(mock).toHaveBeenLastCalledWith(mixin, props, mixin.onEvent);
  });
});
