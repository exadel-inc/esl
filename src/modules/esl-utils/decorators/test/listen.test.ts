import '../../../../polyfills/es5-target-shim';

import {listen} from '../listen';
import {ESLEventUtils} from '../../dom/events';

import type {ESLListenerDescriptorFn} from '../../dom/events';

describe('Decorator: @listen', () => {
  test('Decorator listen should accept one argument call with an event type', () => {
    class Test extends HTMLElement {
      @listen('click')
      onEvent() {}
    }
    customElements.define('test-listen-1', Test);

    const test = new Test();
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(1);
    expect(ESLEventUtils.getAutoDescriptors(test)[0].event).toBe('click');
  });

  test('Decorator listen should accept one argument call with an event type provider', () => {
    class Test extends HTMLElement {
      @listen(() => 'test')
      onEvent() {}
    }
    customElements.define('test-listen-1-provider', Test);

    const test = new Test();
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(1);
    expect(typeof ESLEventUtils.getAutoDescriptors(test)[0].event).toBe('function');
  });

  test('Multiple @listen declarations should be auto-subscribed correctly with a full event definition', () => {
    class Test extends HTMLElement {
      @listen({event: 'event1'})
      onEvent1() {}
      @listen({event: 'event1'})
      onEvent2() {}
    }
    customElements.define('test-listen-2', Test);

    const test = new Test();
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(2);
  });

  test('Event listener definitions from the superclass should be handled correctly', () => {
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
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(2);
  });

  test('Override event listener definition without decorator should exclude subscription', () => {
    class Test extends HTMLElement {
      @listen({event: 'event1'})
      onEvent() {}
    }
    class TestInh extends Test {
      override onEvent() {}
    }
    customElements.define('test-listen-4', TestInh);

    const test = new TestInh();
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(0);
  });

  test('Override event listener definition with a @listen({inherit: true}) inherits event description meta information', () => {
    class Test extends HTMLElement {
      @listen({event: 'event1'})
      onEvent() {}
    }
    class TestInh extends Test {
      @listen({inherit: true})
      override onEvent() {}
    }
    customElements.define('test-listen-5', TestInh);

    const test = new TestInh();
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(1);
    expect((test.onEvent as any as ESLListenerDescriptorFn).event).toBe('event1');
  });

  test('Override event listener definition with a @listen({inherit: true, ...}) should merge event description meta information', () => {
    class Test extends HTMLElement {
      @listen({event: 'event1', selector: 'e'})
      onEvent() {}
    }
    class TestInh extends Test {
      @listen({inherit: true, event: 'event2'})
      override onEvent() {}
    }
    customElements.define('test-listen-6', TestInh);

    const test = new TestInh();
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(1);
    expect((test.onEvent as any as ESLListenerDescriptorFn).event).toBe('event2');
    expect((test.onEvent as any as ESLListenerDescriptorFn).selector).toBe('e');
  });

  test('Override event listener definition with a @listen({...}) replaces event description meta information', () => {
    class Test extends HTMLElement {
      @listen({event: 'event1', selector: 'e'})
      onEvent() {}
    }
    class TestInh extends Test {
      @listen({event: 'event2'})
      override onEvent() {}
    }
    customElements.define('test-listen-7', TestInh);

    const test = new TestInh();
    expect(ESLEventUtils.getAutoDescriptors(test).length).toBe(1);
    expect((test.onEvent as any as ESLListenerDescriptorFn).event).toBe('event2');
    expect((test.onEvent as any as ESLListenerDescriptorFn).selector).toBe(undefined);
  });

  test('Decorator @listen can not be applied multiple times to the same function', () => {
    expect(() => {
      class Test extends HTMLElement {
        @listen({event: 'event1'})
        @listen({event: 'event2'})
        onEvent() {}
      }
      new Test();
    }).toThrowError();
  });

  describe('@listen creates auto-subscribable(collectable) descriptors', () => {
    class Test extends HTMLElement {
      @listen({event: 'event-auto'})
      onEventAuto() {}
      @listen({event: 'event-manual', auto: false})
      onEventManual() {}
    }
    class TestChild extends Test {
      @listen({inherit: true})
      override onEventAuto() {}
      @listen({inherit: true})
      override onEventManual() {}
    }
    customElements.define('test-listen-auto', Test);
    customElements.define('test-listen-auto-inherit', TestChild);

    test('@listen creates auto-subscribable(collectable) descriptor by default', () => {
      const test = new Test();
      expect(ESLEventUtils.getAutoDescriptors(test)).toContain(Test.prototype.onEventAuto);
    });
    test('@listen does not creates auto-subscribable(collectable) descriptor if auto passed as false', () => {
      const test = new Test();
      expect(ESLEventUtils.getAutoDescriptors(test)).not.toContain(Test.prototype.onEventManual);
    });
    test('@listen inherits positive subscribe-ability', () => {
      const test = new TestChild();
      expect(ESLEventUtils.getAutoDescriptors(test)).toContain(TestChild.prototype.onEventAuto);
    });
    test('@listen inherits negative subscribe-ability', () => {
      const test = new TestChild();
      expect(ESLEventUtils.getAutoDescriptors(test)).not.toContain(TestChild.prototype.onEventManual);
    });
  });
});
