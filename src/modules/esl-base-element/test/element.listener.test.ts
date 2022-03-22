import '../../../polyfills/es5-target-shim';

import {ESLBaseElement, listen} from '../core';
import {randUID} from '../../esl-utils/misc/uid';
import {EventUtils} from '../../esl-utils/dom/events/utils';

describe('ESLBaseElement: listeners', () => {
  test('auto-subscribe', () => {
    class TestElement extends ESLBaseElement {
      @listen('click')
      public onClick() {}
    }
    TestElement.register('test-' + randUID());
    const el = new TestElement();

    expect(EventUtils.listeners(el).length).toBe(0);
    document.body.appendChild(el);
    expect(EventUtils.listeners(el).length).toBe(1);
    expect(EventUtils.listeners(el)[0].event).toBe('click');
    document.body.removeChild(el);
    expect(EventUtils.listeners(el).length).toBe(0);
  });

  describe('event accessors', () => {
    class TestElement extends ESLBaseElement {
      onEvent1() {}
      onEvent2() {}
    }
    TestElement.register('test-' + randUID());

    test('$$on', () => {
      const mock = jest.spyOn(EventUtils, 'subscribe').mockImplementation();

      const el = new TestElement();
      const desc = {event: 'click'};

      el.$$on(el.onEvent1);
      expect(mock).lastCalledWith(el, el.onEvent1, undefined);

      el.$$on(desc, el.onEvent2);
      expect(mock).lastCalledWith(el, desc, el.onEvent2);

      el.$$on('test', el.onEvent2);
      expect(mock).lastCalledWith(el, 'test', el.onEvent2);
    });

    test('$$off', () => {
      const mock = jest.spyOn(EventUtils, 'unsubscribe').mockImplementation(() => []);

      const el = new TestElement();
      const desc = {event: 'click'};

      el.$$off(el.onEvent1);
      expect(mock).lastCalledWith(el, el.onEvent1);

      el.$$off(el.onEvent2, desc);
      expect(mock).lastCalledWith(el, el.onEvent2, desc);

      el.$$off(el.onEvent2, 'test');
      expect(mock).lastCalledWith(el, el.onEvent2, 'test');
    });
  });
});
