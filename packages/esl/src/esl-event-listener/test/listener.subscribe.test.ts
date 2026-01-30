import {ESLEventUtils} from '../core';

describe('ESLEventUtils:subscribe tests', () => {
  describe('ESLEventUtils.subscribe subscribes listeners by separate descriptors', () => {
    test('ESLEventUtils.subscribe successfully subscribes listener by descriptor', () => {
      const $host = document.createElement('div');
      const handle = vi.fn();
      ESLEventUtils.subscribe($host, {event: 'click'}, handle);
      expect(ESLEventUtils.listeners($host).length).toBe(1);
      ESLEventUtils.unsubscribe($host);
    });

    test('ESLEventUtils.subscribe successfully subscribes listener by event name', () => {
      const $host = document.createElement('div');
      const handle = vi.fn();
      ESLEventUtils.subscribe($host, 'click', handle);
      expect(ESLEventUtils.listeners($host).length).toBe(1);
      ESLEventUtils.unsubscribe($host);
    });

    test('ESLEventUtils.subscribe successfully subscribes listener by event provider', () => {
      const $host = document.createElement('div');
      const provider = vi.fn(function () {
        expect(this).toBe($host);
        return 'event';
      });
      const handle = vi.fn();
      ESLEventUtils.subscribe($host, {event: provider}, handle);
      expect(ESLEventUtils.listeners($host).length).toBe(1);
      expect(provider).toHaveBeenCalledWith($host);
      ESLEventUtils.unsubscribe($host);
    });

    test('ESLEventUtils.subscribe successfully subscribes listeners by string with multiple events', () => {
      const $host = document.createElement('div');
      const handle = vi.fn();
      ESLEventUtils.subscribe($host, 'click keydown', handle);
      expect(ESLEventUtils.listeners($host).length).toBe(2);
      expect(ESLEventUtils.listeners($host, 'keydown').length).toBe(1);
      expect(ESLEventUtils.listeners($host, 'click').length).toBe(1);
      ESLEventUtils.unsubscribe($host);
    });
  });

  describe('ESLEventUtils.subscribe subscribes listeners by function decorated with descriptor', () => {
    const $target = document.createElement('div');
    const $host = Object.assign(document.createElement('div'), {
      onClick: vi.fn(),
      onClickWithTarget: vi.fn()
    });
    ESLEventUtils.initDescriptor($host, 'onClick', {event: 'click'});
    ESLEventUtils.initDescriptor($host, 'onClickWithTarget', {event: 'click', target: $target});

    test('ESLEventUtils.subscribe successfully subscribes listener by descriptor function', () => {
      ESLEventUtils.subscribe($host, $host.onClick);
      expect(ESLEventUtils.listeners($host).length).toBe(1);
      expect(ESLEventUtils.listeners($host)[0].matches($host.onClick)).toBe(true);
      ESLEventUtils.unsubscribe($host);
    });

    test('ESLEventUtils.subscribe successfully subscribes listener by descriptor function with extra config', () => {
      ESLEventUtils.subscribe($host, $host.onClickWithTarget);
      expect(ESLEventUtils.listeners($host)[0].matches($host.onClickWithTarget)).toBe(true);
      expect(ESLEventUtils.listeners($host)[0].$targets).toEqual([$target]);
      ESLEventUtils.unsubscribe($host);
    });

    test('ESLEventUtils.subscribe merge descriptor function with descriptor passed explicitly', () => {
      ESLEventUtils.subscribe($host, {event: 'keydown'}, $host.onClickWithTarget);
      expect(ESLEventUtils.listeners($host)[0].matches('keydown')).toBe(true);
      expect(ESLEventUtils.listeners($host)[0].matches($host.onClickWithTarget)).toBe(true);
      expect(ESLEventUtils.listeners($host)[0].$targets).toEqual([$target]);
      ESLEventUtils.unsubscribe($host);
    });
  });

  describe('ESLEventUtils.subscribe uses correct target resolution', () => {
    test('ESLEventListener subscribes successfully by global selector',  () => {
      const host = {};
      const handle = vi.fn();
      ESLEventUtils.subscribe(host, {event: 'click', target: 'body'}, handle);
      expect(ESLEventUtils.listeners(host).length).toBe(1);
      ESLEventUtils.unsubscribe(host);
    });

    test('ESLEventListener subscribes successfully by target instance',  () => {
      const host = {};
      const el = document.createElement('div');
      const handle = vi.fn();
      ESLEventUtils.subscribe(host, {event: 'click', target: el}, handle);
      expect(ESLEventUtils.listeners(host).length).toBe(1);
      ESLEventUtils.unsubscribe(host);
    });
  });

  describe('Created by ESLEventUtils listener behaves correctly', () => {
    test('ESLEventListener observes target events', () => {
      const $host = document.createElement('div');
      const handle = vi.fn();
      ESLEventUtils.subscribe($host, {event: 'click'}, handle);
      $host.click();
      expect(handle).toHaveBeenCalledTimes(1);
      ESLEventUtils.unsubscribe($host);
    });
  });

  describe('ESLEventListener subscribes correctly for any object-like host', () => {
    test.each([
      {},
      Object.create(null),
      function hostFunction() {},
      class HostClass {},
      new (class HostClassInst {})()
    ])('ESLEventListener subscribes correctly for %o host',  (host) => {
      const handle = vi.fn();
      ESLEventUtils.subscribe(host, {event: 'click', target: document.body}, handle);
      expect(ESLEventUtils.listeners(host).length).toBe(1);
      ESLEventUtils.unsubscribe(host);
    });

    test('ESLEventListener can not subscribe for primitive host', () => {
      expect(() => {
        const handle = vi.fn();
        ESLEventUtils.subscribe(1 as any, {event: 'click', target: document.body}, handle).length;
      }).toThrow();
    });

    test('ESLEventListener can not subscribe for null host', () => {
      expect(() => {
        const handle = vi.fn();
        ESLEventUtils.subscribe(null as any, {event: 'click', target: document.body}, handle).length;
      }).toThrow();
    });
  });

  describe('ESLEventListener subscribes from descriptors correctly by criteria', () => {
    const $host = Object.assign(document.createElement('div'), {
      clickAuto: vi.fn(),
      clickManual: vi.fn(),
      clickWithGroup: vi.fn(),
      clickWithTarget: vi.fn(),
      keydownAuto: vi.fn(),
      keydownWithGroup: vi.fn(),
      keydownWithTarget: vi.fn(),
      keydownWithTargetAndGroup: vi.fn()
    });
    const $tgt = document.createElement('div');
    ESLEventUtils.initDescriptor($host, 'clickAuto', {event: 'click', auto: true});
    ESLEventUtils.initDescriptor($host, 'clickManual', {event: 'click', auto: false});
    ESLEventUtils.initDescriptor($host, 'clickWithGroup', {event: 'click', group: 'group'});
    ESLEventUtils.initDescriptor($host, 'clickWithTarget', {event: 'click', target: $tgt});
    ESLEventUtils.initDescriptor($host, 'keydownAuto', {event: 'keydown', auto: true});
    ESLEventUtils.initDescriptor($host, 'keydownWithGroup', {event: 'keydown', group: 'group'});
    ESLEventUtils.initDescriptor($host, 'keydownWithTarget', {event: 'keydown', target: $tgt});
    ESLEventUtils.initDescriptor($host, 'keydownWithTargetAndGroup', {event: 'keydown', target: 'body', group: 'group'});

    afterEach(() => ESLEventUtils.unsubscribe($host));

    test('ESLEventListener.subscribe without arguments subscribes auto listeners', () => {
      const listeners = ESLEventUtils.subscribe($host);
      expect(listeners.length).toBe(2);
      expect(listeners[0].matches($host.clickAuto)).toBe(true);
      expect(listeners[1].matches($host.keydownAuto)).toBe(true);
    });

    test('ESLEventListener.subscribe with criteria subscribes listeners that match criteria (event)', () => {
      const listeners = ESLEventUtils.subscribe($host, {event: 'click'});
      expect(listeners.length).toBe(4);
      expect(listeners[0].matches($host.clickAuto)).toBe(true);
      expect(listeners[1].matches($host.clickManual)).toBe(true);
      expect(listeners[2].matches($host.clickWithGroup)).toBe(true);
      expect(listeners[3].matches($host.clickWithTarget)).toBe(true);
    });

    test('ESLEventListener.subscribe with criteria subscribes listeners that match criteria (group)', () => {
      const listeners = ESLEventUtils.subscribe($host, {group: 'group'});
      expect(listeners.length).toBe(3);
      expect(listeners[0].matches($host.clickWithGroup)).toBe(true);
      expect(listeners[1].matches($host.keydownWithGroup)).toBe(true);
      expect(listeners[2].matches($host.keydownWithTargetAndGroup)).toBe(true);
    });

    test('ESLEventListener.subscribe with criteria subscribes listeners that match criteria (target)', () => {
      const listeners = ESLEventUtils.subscribe($host, {target: $tgt});
      expect(listeners.length).toBe(2);
      expect(listeners[0].matches($host.clickWithTarget)).toBe(true);
      expect(listeners[1].matches($host.keydownWithTarget)).toBe(true);
    });

    test('ESLEventListener.subscribe with criteria subscribes listeners that match criteria (event and group)', () => {
      const listeners = ESLEventUtils.subscribe($host, {event: 'click', group: 'group'});
      expect(listeners.length).toBe(1);
      expect(listeners[0].matches($host.clickWithGroup)).toBe(true);
    });
  });

  describe('ESLEventListener edge cases and exception control', () => {
    test('ESLEventListener.subscribe throws an error if multiple handler functions are passed', () => {
      const $host = document.createElement('div');
      expect(() => ESLEventUtils.subscribe($host, (() => void 0) as any, () => void 0)).toThrow();
    });

    test('ESLEventListener does not subscribe if no targets',  () => {
      vi.spyOn(console, 'warn').mockImplementationOnce(() => {});
      const host = {};
      const handle = vi.fn();
      ESLEventUtils.subscribe(host, {event: 'click'}, handle);
      expect(ESLEventUtils.listeners(host).length).toBe(0);
    });

    test('ESLEventListener does not fails or subscribes if non descriptor function passed',  () => {
      const host = {
        onClick: vi.fn()
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {});

      expect(ESLEventUtils.subscribe(host, host.onClick)).toEqual([]);
      expect(ESLEventUtils.listeners(host).length).toBe(0);
      expect(host.onClick).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
