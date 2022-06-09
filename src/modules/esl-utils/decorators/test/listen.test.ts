import '../../../../polyfills/es5-target-shim';

import {listen} from '../listen';
import {EventUtils} from '../../dom/events';

describe('Decorator: listen', () => {
  test('short', () => {
    class Test extends HTMLElement {
      @listen('click')
      onEvent() {}
    }
    customElements.define('test-listen-1', Test);

    const test = new Test();
    expect(EventUtils.descriptors(test).length).toBe(1);
    expect(EventUtils.descriptors(test)[0].event).toBe('click');
  });

  test('provider', () => {
    class Test extends HTMLElement {
      @listen(() => 'test')
      onEvent() {}
    }
    customElements.define('test-listen-1-provider', Test);

    const test = new Test();
    expect(EventUtils.descriptors(test).length).toBe(1);
    expect(typeof EventUtils.descriptors(test)[0].event).toBe('function');
  });

  test('full', () => {
    class Test extends HTMLElement {
      @listen({event: 'event1'})
      onEvent1() {}
      @listen({event: 'event1', id: 'a'})
      onEvent2() {}
    }
    customElements.define('test-listen-2', Test);

    const test = new Test();
    expect(EventUtils.descriptors(test).length).toBe(2);
  });

  test('inheritance', () => {
    class Test extends HTMLElement {
      @listen({event: 'event1'})
      onEvent1() {}
    }
    class TestInh extends Test {
      @listen({event: 'event2'})
      onEvent2() {}
    }
    customElements.define('test-listen-3', TestInh);

    const test = new TestInh();
    expect(EventUtils.descriptors(test).length).toBe(2);
  });

  test('multiple decoration', () => {
    expect(() => {
      class Test extends HTMLElement {
        @listen({event: 'event1'})
        @listen({event: 'event2'})
        onEvent() {}
      }
      new Test();
    }).toThrowError();
  });
});
