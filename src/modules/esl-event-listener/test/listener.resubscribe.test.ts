import {ESLEventUtils} from '../core/api';


describe('ESLEventUtils.subscribe resubscribing event', () => {
  const $host = document.createElement('div');
  const $el1 = document.createElement('button');
  const $el2 = document.createElement('button');

  describe('ESLEventUtils.subscribe dynamic resubscribtion of the same event with different target', () => {
    const handle = jest.fn();
    const target = jest.fn(() => $el1);

    const listeners1 = ESLEventUtils.subscribe($host, {event: 'click', target}, handle);
    test('ESLEventUtils.subscribe subscription correct first time', () => {
      expect(listeners1.length).toBe(1);
      expect(ESLEventUtils.listeners($host)).toEqual(listeners1);
    });

    // Change target
    target.mockImplementation(() => $el2);

    // Subscription descriptor is the same as produced in listener 1 situation
    const listeners2 = ESLEventUtils.subscribe($host, {event: 'click', target}, handle);
    test('ESLEventUtils.subscribe subscription correct second time', () => {
      expect(listeners2.length).toBe(1);
      expect(ESLEventUtils.listeners($host)).toEqual(listeners2);
    });

    test('Resubscribed listener does not observe initial target', () => {
      $el1.click();
      expect(handle).not.toHaveBeenCalled();
    });

    test('Resubscribed listener observes actual target', () => {
      $el2.click();
      expect(handle).toHaveBeenCalled();
    });

    test('ESLEventUtils does not recreate instance', () => expect(listeners1).toEqual(listeners2));
  });

  describe('ESLEventUtils.subscribe resubscribes listener correctly if the source is declared descriptor', () => {
    class Test {
      onClick() {}
    }

    const target = jest.fn(() => $el1);
    ESLEventUtils.initDescriptor(Test.prototype, 'onClick', {event: 'click', auto: true, target});

    const instance = new Test();
    ESLEventUtils.subscribe(instance);

    test('Initial subscription happened', () => {
      expect(ESLEventUtils.listeners(instance).length).toBe(1);
    });

    test('Initial subscription have a correct target', () => {
      expect(ESLEventUtils.listeners(instance)[0].$targets).toEqual([$el1]);
    });

    // Change target
    target.mockImplementation(() => $el2);
    // Re-subscription
    ESLEventUtils.subscribe(instance);

    test('Re-subscription does not create new listener', () => {
      expect(ESLEventUtils.listeners(instance).length).toBe(1);
    });

    test('Re-subscription have a correct target', () => {
      expect(ESLEventUtils.listeners(instance)[0].$targets).toEqual([$el2]);
    });
  });

  describe('ESLEventUtils.subscribe resubscribes listener correctly if the condition is involved', () => {
    class Test {
      allowed = false;
      onClick() {}
    }
    ESLEventUtils.initDescriptor(Test.prototype, 'onClick', {
      auto: true,
      event: 'click',
      target: $el1,
      condition: ($that: Test) => $that.allowed
    });

    describe('Dynamic condition change to false', () => {
      const instance = new Test();

      test('Initial subscription happened (condition: true)', () => {
        instance.allowed = true;
        ESLEventUtils.subscribe(instance);
        expect(ESLEventUtils.listeners(instance).length).toBe(1);
      });

      test('Subscription removed when condition dynamically ', () => {
        instance.allowed = false;
        ESLEventUtils.subscribe(instance);
        expect(ESLEventUtils.listeners(instance).length).toBe(0);
      });
    });

    describe('Dynamic condition change to true', () => {
      const instance = new Test();

      test('Initial subscription does not happened (condition: false)', () => {
        instance.allowed = false;
        ESLEventUtils.subscribe(instance);
        expect(ESLEventUtils.listeners(instance).length).toBe(0);
      });

      test('Subscription added when condition dynamically ', () => {
        instance.allowed = true;
        ESLEventUtils.subscribe(instance);
        expect(ESLEventUtils.listeners(instance).length).toBe(1);
      });
    });
  });
});
