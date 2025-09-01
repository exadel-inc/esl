import {ESLMixinElement} from '../core';
import {listen} from '../../esl-utils/decorators/listen';
import {ESLEventUtils} from '../../esl-utils/dom/events';

describe('ESLMixinElement: listeners', () => {
  describe('ESLMixinElement auto subscribes to listener declarations', () => {
    const mockHandler = jest.fn();
    class TestElement extends ESLMixinElement {
      static override is = 'test-listen-mixin';

      @listen('click')
      public onClick(...args: any[]) { mockHandler(this, ...args); }
    }
    TestElement.register();

    const el = document.createElement('div');
    el.setAttribute(TestElement.is, '');

    beforeAll(() => document.body.appendChild(el));

    test('ESLMixinElement successfully auto subscribed', () => {
      const host = TestElement.get(el) as TestElement;
      expect(ESLEventUtils.listeners(host).length).toBe(1);
      expect(ESLEventUtils.listeners(host)[0].event).toBe('click');
    });

    test('ESLMixinElement subscription works correctly', () => {
      mockHandler.mockReset();
      el.click();
      expect(mockHandler).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenLastCalledWith(TestElement.get(el), expect.any(Event));
    });

    test('ESLMixinElement successfully auto unsubscribed', async () => {
      document.body.removeChild(el);
      await Promise.resolve(); // Wait for microtasks completed
      expect(ESLEventUtils.listeners(el).length).toBe(0);
      return Promise.resolve();
    });

    afterAll(async () => el.parentElement && el.remove());
  });
});
