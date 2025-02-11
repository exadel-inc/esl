import {ESLEventUtils} from '../core';
import {listen} from '../../esl-utils/decorators/listen';

describe('dom/events: ESLEventUtils: ESLListenerDescriptor Utils', () => {
  describe('ESLEventUtils.isEventDescriptor', () => {
    function fakeDesc() {}
    fakeDesc.event = false;

    function fakeDesc2() {}
    fakeDesc2.event = {};

    function descEvent() {}
    descEvent.event = 'event';

    function descEventProvider() {}
    descEventProvider.event = () => 'event';

    test.each([
      [undefined, false],
      [null, false],
      ['', false],
      [{}, false],
      [{event: ''}, false],
      [function noop() {}, false],
      [fakeDesc, false],
      [fakeDesc2, false],

      [descEvent, true],
      [descEventProvider, true]
    ])(
      'isEventDescriptor(%p) = %s',
      (sample: any, check: boolean) => expect(ESLEventUtils.isEventDescriptor(sample)).toBe(check)
    );
  });

  describe('ESLEventUtils.initDescriptor', () => {
    test('ESLEventUtils.initDescriptor: missing key throws error', () => {
      const host: any = {};
      expect(() => ESLEventUtils.initDescriptor(host, 'fn', {event: 'event'})).toThrowError();
    });

    test('ESLEventUtils.initDescriptor: incorrect key type throws error', () => {
      const host = {fn: null};
      expect(() => ESLEventUtils.initDescriptor(host, 'fn', {event: 'event'})).toThrowError();
    });

    test('ESLEventUtils.initDescriptor: returns host key', () => {
      const host = {fn: () => void 0};
      const desc = ESLEventUtils.initDescriptor(host, 'fn', {event: 'event'});
      expect(desc).toBe(host.fn);
    });

    test('ESLEventUtils.initDescriptor: merge descriptor if called twice', () => {
      const host = {fn: () => void 0};
      const meta = {event: () => 'event'};
      ESLEventUtils.initDescriptor(host, 'fn', {selector: 'a'});
      const desc = ESLEventUtils.initDescriptor(host, 'fn', meta);
      expect(desc.event).toBe(meta.event);
      expect(desc.selector).toBe('a');
    });

    describe('ESLEventUtils.initDescriptor: auto-subscription management', () => {
      test('ESLEventUtils.initDescriptor: simple subscription is not auto by default', () => {
        const host = {fn: () => void 0};
        const desc = ESLEventUtils.initDescriptor(host, 'fn', {event: 'event'});
        expect(desc.auto).toBe(false);
        expect(ESLEventUtils.descriptors(host, {auto: true})).not.toContain(desc);
      });

      test('ESLEventUtils.initDescriptor: auto=true makes descriptor auto-subscribable', () => {
        const host = {fn: () => void 0};
        const desc = ESLEventUtils.initDescriptor(host, 'fn', {event: 'event', auto: true});
        expect(desc.auto).toBe(true);
        expect(ESLEventUtils.descriptors(host, {auto: true})).toContain(desc);
      });
    });

    describe('ESLEventUtils.initDescriptor: inheritance cases', () => {
      const proto = {fn: () => void 0};
      ESLEventUtils.initDescriptor(proto, 'fn', {event: 'event', selector: 'a'});

      test('ESLEventUtils.initDescriptor: override creates new descriptor', () => {
        const host = {fn: () => void 0};
        Object.setPrototypeOf(host, proto);
        const desc = ESLEventUtils.initDescriptor(host, 'fn', {event: 'event2'});
        expect(desc).toBe(host.fn);
        expect(desc.event).toBe('event2');
        expect(desc.selector).toBeUndefined();
      });

      test('ESLEventUtils.initDescriptor: can inherit descriptor from prototype', () => {
        const host = {fn: () => void 0};
        Object.setPrototypeOf(host, proto);
        const desc = ESLEventUtils.initDescriptor(host, 'fn', {inherit: true, selector: 'b'});
        expect(desc).toBe(host.fn);
        expect(desc.event).toBe('event');
        expect(desc.selector).toBe('b');
      });

      test('ESLEventUtils.initDescriptor: can inherit descriptor from prototype', () => {
        const host = {fn2: () => void 0};
        Object.setPrototypeOf(host, proto);
        expect(() => ESLEventUtils.initDescriptor(host, 'fn2', {inherit: true, selector: 'b'})).toThrowError();
      });

      test('ESLEventUtils.initDescriptor: inheriting of type (auto collectable) of the prototype', () => {
        const parent = {fn: () => void 0};
        const parentDesc = ESLEventUtils.initDescriptor(parent, 'fn', {event: 'event', auto: true});
        const host = {fn: () => void 0};
        Object.setPrototypeOf(host, parent);
        const desc = ESLEventUtils.initDescriptor(host, 'fn', {inherit: true});
        expect(parentDesc.auto).toBe(true);
        expect(desc.auto).toBe(true);
        expect(ESLEventUtils.descriptors(host, {auto: true})).toContain(desc);
      });

      test('ESLEventUtils.descriptors({auto: true}): does not catch prototype-level declared manual descriptor', () => {
        class Test {
          onEvent() {}
        }
        ESLEventUtils.initDescriptor(Test.prototype, 'onEvent', {event: 'event'});

        const instance = new Test();
        expect(ESLEventUtils.descriptors(instance, {auto: true})).toEqual([]);
      });
    });
  });

  describe('ESLEventUtils.descriptors', () => {
    describe('ESLEventUtils.descriptors: empty cases', () => {
      test.each([
        [undefined],
        [null],
        [''],
        [{}],
        [{event: ''}],
        [{onEvent() {}}],
        [new (class Test {
          onEvent() {}
        })()]
      ])('host = %p', (host: any) => expect(ESLEventUtils.descriptors(host)).toEqual([]));
    });

    test('ESLEventUtils.descriptors: catch prototype-level declared descriptor', () => {
      class Test {onEvent() {}}
      ESLEventUtils.initDescriptor(Test.prototype, 'onEvent', {event: 'event'});

      const instance = new Test();
      expect(ESLEventUtils.descriptors(instance)).toEqual([Test.prototype.onEvent]);
    });

    describe('ESLEventUtils.descriptors: handles deep inheritance cases', () => {
      class Base {
        onEvent() {}
      }
      ESLEventUtils.initDescriptor(Base.prototype, 'onEvent', {event: 'event'});

      test('ESLEventUtils.descriptors: catch superclass level descriptor', () => {
        class Child extends Base {}
        const instance = new Child();
        expect(ESLEventUtils.descriptors(instance)).toEqual([Base.prototype.onEvent]);
      });

      test('ESLEventUtils.descriptors: simple override exclude descriptor', () => {
        class Child extends Base {
          public override onEvent() {}
        }
        const instance = new Child();
        expect(ESLEventUtils.descriptors(instance)).toEqual([]);
      });

      test('ESLEventUtils.descriptors: override with descriptor declaration consumes overridden descriptor', () => {
        class Child extends Base {
          public override onEvent() {}
        }
        ESLEventUtils.initDescriptor(Child.prototype, 'onEvent', {inherit: true});
        const instance = new Child();
        expect(ESLEventUtils.descriptors(instance)).toEqual([Child.prototype.onEvent]);
      });
    });

    test('ESLEventUtils.descriptors: low level API consumes own properties as well', () => {
      const obj = {onEvent: () => void 0};
      ESLEventUtils.initDescriptor(obj, 'onEvent', {event: 'event'});
      expect(ESLEventUtils.descriptors(obj)).toEqual([obj.onEvent]);
    });

    test('ESLEventListener.descriptors: are collected and subscribed in case of any object-like host', () => {
      class HostClass {
        @listen({event: 'event-one'})
        onEventOne() {}
        @listen({event: 'event-two'})
        onEventTwo() {}
      }
      const $host = new HostClass();
      expect(ESLEventUtils.descriptors($host)).toContain(HostClass.prototype.onEventOne);
      expect(ESLEventUtils.descriptors($host)).toContain(HostClass.prototype.onEventTwo);
    });

    describe('ESLEventUtils.descriptors: filters by criteria', () => {
      class Test {
        onEvent() {}
        onEventWithGroup() {}
        onEvent2WithGroup() {}
        onEventAuto() {}
      }
      ESLEventUtils.initDescriptor(Test.prototype, 'onEvent', {event: 'event'});
      ESLEventUtils.initDescriptor(Test.prototype, 'onEventWithGroup', {event: 'event', group: 'group'});
      ESLEventUtils.initDescriptor(Test.prototype, 'onEvent2WithGroup', {event: 'event2', group: 'group'});
      ESLEventUtils.initDescriptor(Test.prototype, 'onEventAuto', {event: 'event', auto: true});

      test('ESLEventUtils.descriptors: filters by event name', () => {
        const instance = new Test();
        expect(ESLEventUtils.descriptors(instance, 'event')).toEqual([
          Test.prototype.onEvent,
          Test.prototype.onEventWithGroup,
          Test.prototype.onEventAuto
        ]);
      });

      test('ESLEventUtils.descriptors: filters by group name', () => {
        const instance = new Test();
        expect(ESLEventUtils.descriptors(instance, {group: 'group'})).toEqual([
          Test.prototype.onEventWithGroup,
          Test.prototype.onEvent2WithGroup
        ]);
      });

      test('ESLEventUtils.descriptors: filters by auto:true criteria', () => {
        const instance = new Test();
        expect(ESLEventUtils.descriptors(instance, {auto: true})).toEqual([Test.prototype.onEventAuto]);
      });

      test('ESLEventUtils.descriptors: filters by auto:false criteria', () => {
        const instance = new Test();
        expect(ESLEventUtils.descriptors(instance, {auto: false})).toEqual([
          Test.prototype.onEvent,
          Test.prototype.onEventWithGroup,
          Test.prototype.onEvent2WithGroup
        ]);
      });

      test('ESLEventUtils.descriptors: filters by event name and group name', () => {
        const instance = new Test();
        expect(ESLEventUtils.descriptors(instance, {event: 'event', group: 'group'})).toEqual([Test.prototype.onEventWithGroup]);
      });

      test('ESLEventUtils.descriptors: filters by multiple criteria', () => {
        const instance = new Test();
        expect(ESLEventUtils.descriptors(instance, 'event', {group: 'group'})).toEqual([Test.prototype.onEventWithGroup]);
      });
    });
  });
});
