import {ESLBaseElement} from '../core';
import {listen} from '../../esl-utils/decorators/listen';
import {randUID} from '../../esl-utils/misc/uid';
import {ESLEventUtils} from '../../esl-utils/dom/events';

describe('ESLBaseElement: listeners', () => {
  describe('ESLBaseElement auto subscribes to listener declarations', () => {
    const mockHandler = vi.fn();
    class TestElement extends ESLBaseElement {
      static override is = 'test-listen-element';

      @listen('click')
      public onClick(...args: any[]) { mockHandler(this, ...args); }
    }
    TestElement.register();

    const el = TestElement.create();

    beforeAll(() => document.body.appendChild(el));

    test('ESLBaseElement successfully auto subscribed', () => {
      expect(ESLEventUtils.listeners(el).length).toBe(1);
      expect(ESLEventUtils.listeners(el)[0].event).toBe('click');
    });

    test('ESLBaseElement subscription works correctly', () => {
      mockHandler.mockReset();
      el.click();
      expect(mockHandler).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenLastCalledWith(el, expect.any(Event));
    });

    test('ESLBaseElement successfully auto unsubscribed', async () => {
      document.body.removeChild(el);
      await Promise.resolve(); // Wait for microtasks completed
      expect(ESLEventUtils.listeners(el).length).toBe(0);
      return Promise.resolve();
    });

    afterAll(async () => el.parentElement && el.remove());
  });

  describe('event accessors', () => {
    class TestElement extends ESLBaseElement {
      onEvent1() {}
      onEvent2() {}
    }
    TestElement.register('test-' + randUID());

    test('$$on', () => {
      const mock = vi.spyOn(ESLEventUtils, 'subscribe').mockImplementation(() => undefined as any);;

      const el = new TestElement();
      const desc = {event: 'click'};

      el.$$on(el.onEvent1);
      expect(mock).toHaveBeenLastCalledWith(el, el.onEvent1, undefined);

      el.$$on(desc, el.onEvent2);
      expect(mock).toHaveBeenLastCalledWith(el, desc, el.onEvent2);

      el.$$on('test', el.onEvent2);
      expect(mock).toHaveBeenLastCalledWith(el, 'test', el.onEvent2);
    });

    test('$$off', () => {
      const mock = vi.spyOn(ESLEventUtils, 'unsubscribe').mockImplementation(() => []);

      const el = new TestElement();
      const desc = {event: 'click'};

      el.$$off(el.onEvent1);
      expect(mock).toHaveBeenLastCalledWith(el, el.onEvent1);

      el.$$off(el.onEvent2, desc);
      expect(mock).toHaveBeenLastCalledWith(el, el.onEvent2, desc);

      el.$$off(el.onEvent2, 'test');
      expect(mock).toHaveBeenLastCalledWith(el, el.onEvent2, 'test');
    });
  });
});
