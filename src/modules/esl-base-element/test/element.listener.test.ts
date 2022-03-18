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

  describe('listeners', () => {
    class TestElement extends ESLBaseElement {}
    TestElement.register('test-' + randUID());
    const el = new TestElement();

    const container = document.createElement('div');
    container.className = 'container';
    el.appendChild(container);

    const button = document.createElement('button');
    button.innerHTML = 'Test <i>A</i>';
    container.appendChild(button);

    beforeEach(() => document.body.appendChild(el));
    afterEach(() => el.parentElement && document.body.removeChild(el));

    test('subscribe full', () => {
      const handle = jest.fn();

      el.$$on(handle, {event: 'click'});
      button.click();

      expect(handle).toBeCalledTimes(1);

      el.$$off(handle, {event: 'click'});
      button.click();

      expect(handle).toBeCalledTimes(1);
      expect(EventUtils.listeners(el).length).toBe(0);
    });
  });
});
