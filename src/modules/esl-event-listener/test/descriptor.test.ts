import {ESLEventUtils} from '../core';

describe('dom/events: ESLEventUtils: ESLListenerDescriptor Utils', () => {
  describe('ESLEventUtils.isEventDescriptor', () => {
    function fakeDesc() {}
    descEvent.event = false;

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
    });
  });

  describe('ESLEventUtils.getAutoDescriptors', () => {
    describe('ESLEventUtils.getAutoDescriptors: empty cases', () => {
      test.each([
        [undefined],
        [null],
        [''],
        [{}],
        [{event: ''}],
        [{onEvent() {}}],
        [new (class Test {onEvent() {}})()]
      ])('host = %p', (host) => expect(ESLEventUtils.getAutoDescriptors(host)).toEqual([]));
    });

    test('ESLEventUtils.getAutoDescriptors: catch prototype-level declared descriptor', () => {
      class Test { onEvent() {}}
      ESLEventUtils.initDescriptor(Test.prototype, 'onEvent', {event: 'event'});

      const instance = new Test();
      expect(ESLEventUtils.getAutoDescriptors(instance)).toEqual([Test.prototype.onEvent]);
    });

    test('ESLEventUtils.getAutoDescriptors: does not catch prototype-level declared manual descriptor', () => {
      class Test { onEvent() {}}
      ESLEventUtils.initDescriptor(Test.prototype, 'onEvent', {event: 'event', auto: false});

      const instance = new Test();
      expect(ESLEventUtils.getAutoDescriptors(instance)).toEqual([]);
    });

    describe('ESLEventUtils.getAutoDescriptors: handles deep inheritance cases', () => {
      class Base { onEvent() {}}
      ESLEventUtils.initDescriptor(Base.prototype, 'onEvent', {event: 'event'});

      test('ESLEventUtils.getAutoDescriptors: catch superclass level descriptor', () => {
        class Child extends Base {}
        const instance = new Child();
        expect(ESLEventUtils.getAutoDescriptors(instance)).toEqual([Base.prototype.onEvent]);
      });

      test('ESLEventUtils.getAutoDescriptors: simple override exclude descriptor from auto-subscription', () => {
        class Child extends Base {
          public override onEvent() {}
        }
        const instance = new Child();
        expect(ESLEventUtils.getAutoDescriptors(instance)).toEqual([]);
      });

      test('ESLEventUtils.getAutoDescriptors: override with descriptor declaration consumes overridden descriptor', () => {
        class Child extends Base {
          public override onEvent() {}
        }
        ESLEventUtils.initDescriptor(Child.prototype, 'onEvent', {inherit: true});
        const instance = new Child();
        expect(ESLEventUtils.getAutoDescriptors(instance)).toEqual([Child.prototype.onEvent]);
      });
    });

    test('ESLEventUtils.getAutoDescriptors: low level API consumes own properties as well', () => {
      const obj = {onEvent: () => void 0};
      ESLEventUtils.initDescriptor(obj, 'onEvent', {event: 'event'});
      expect(ESLEventUtils.getAutoDescriptors(obj)).toEqual([obj.onEvent]);
    });
  });
});
