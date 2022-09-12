import {ESLEventListener} from '../core/listener';

describe('dom/events: ESLEventListener', () => {
  describe('get', () => {
    test('simple', () => {
      expect(ESLEventListener.get()).toEqual([]);
      expect(ESLEventListener.get({})).toEqual([]);
    });
  });

  describe('create', () => {
    test('without event type', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.createOrResolve(host, handler, {event: ''});

      expect(result.length).toBe(0);
    });

    test('one by string', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.createOrResolve(host, handler, {event: 'click'});

      expect(result.length).toBe(1);
      expect(result[0].event).toBe('click');
      expect(result[0].handler).toBe(handler);
    });

    test('via event provider', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const eventProvider = jest.fn(() => 'click');
      const result = ESLEventListener.createOrResolve(host, handler, {event: eventProvider});

      expect(result.length).toBe(1);
      expect(result[0].event).toBe('click');
      expect(result[0].handler).toBe(handler);
      expect(eventProvider).lastCalledWith(host);
    });

    test('via event provider with context', () => {
      const context  = {};
      const host = document.createElement('div');
      const handler = jest.fn();
      const eventProvider = jest.fn(() => 'click');
      ESLEventListener.createOrResolve(host, handler, {event: eventProvider, context});
      expect(eventProvider).lastCalledWith(context);
    });

    test('multiple by string', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.createOrResolve(host, handler, {event: 'click keydown keypress'});

      expect(result.length).toBe(3);
      expect(result[0].handler).toBe(handler);
      expect(result[1].handler).toBe(handler);
      expect(result[2].handler).toBe(handler);
      expect(result.map((l: ESLEventListener) => l.event)).toEqual(['click', 'keydown', 'keypress']);
    });

    test('one by desc', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.createOrResolve(host, handler, {event: 'keypress'});

      expect(result.length).toBe(1);
      expect(result[0].handler).toBe(handler);
      expect(result[0].event).toBe('keypress');
    });

    test('multiple by desc', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.createOrResolve(host, handler, {event: 'e1 e2', selector: 'button'});

      expect(result.length).toBe(2);
      expect(result[0].handler).toBe(handler);
      expect(result[1].handler).toBe(handler);
      expect(result[0].event).toBe('e1');
      expect(result[1].event).toBe('e2');
      expect(result[0].selector).toBe('button');
      expect(result[1].selector).toBe('button');
    });

    // TODO: rewrite dummy test
    test('option providers', () => {
      const host = document.createElement('div');
      const target = document.createElement('div');
      const handler = jest.fn();
      const eventProvider = jest.fn(() => 'test');
      const targetProvider = jest.fn(() => target);
      const selectorProvider = jest.fn(() => '.btn');

      const [listener] = ESLEventListener.createOrResolve(host, handler, {
        event: eventProvider,
        target: targetProvider,
        selector: selectorProvider
      });

      expect(listener.event).toBe(eventProvider());
      expect(listener.$targets).toContain(targetProvider());
      expect(listener.delegate).toBe(selectorProvider());
    });

    // TODO: rewrite dummy test
    test('option providers vs context', () => {
      const context  = {};
      const host = document.createElement('div');
      const handler = jest.fn();
      const eventProvider = jest.fn(() => 'click');
      const targetProvider = jest.fn(() => '::not(btn)');
      const selectorProvider = jest.fn(() => '.btn');

      const listeners = ESLEventListener.createOrResolve(host, handler, {
        event: eventProvider,
        target: targetProvider,
        selector: selectorProvider,
        context
      });
      listeners.forEach((l) => l.subscribe());
      host.click();

      expect(eventProvider).toBeCalledWith(context);
      expect(targetProvider).toBeCalledWith(context);
      expect(selectorProvider).toBeCalledWith(context);
    });
  });

  describe('instance methods', () => {
    const host = document.createElement('section');
    host.innerHTML = `
      <div class="btns">
        <button class="btn">Test <span>1</span></button>
        <button id="btn">2</button>
      </div>
    `;
    const btn = host.querySelector('button.btn') as HTMLButtonElement;
    const btnSpan = btn.querySelector('span') as HTMLSpanElement;
    const btn2 = host.querySelector('#btn') as HTMLButtonElement;

    test('simple subscribe', () => {
      const handler = jest.fn();
      const listener = ESLEventListener.createOrResolve(host, handler, {event: 'click'})[0];
      listener.subscribe();

      expect(handler).toBeCalledTimes(0);
      btnSpan.click();
      expect(handler).toBeCalledTimes(1);
    });

    test('delegate subscribe', () => {
      const handler = jest.fn();
      const listener = ESLEventListener.createOrResolve(host, handler, {event: 'click', selector: '.btn'})[0];
      listener.subscribe();

      expect(handler).toBeCalledTimes(0);
      btnSpan.click();
      expect(handler).toBeCalledTimes(1);
      btn.click();
      expect(handler).toBeCalledTimes(2);
      btn2.click();
      expect(handler).toBeCalledTimes(2);
    });

    test('target subscribe', () => {
      const handler = jest.fn();
      const listener = ESLEventListener.createOrResolve(host, handler, {event: 'click', target: '::find(#btn)'})[0];
      listener.subscribe();

      expect(handler).toBeCalledTimes(0);
      btn.click();
      expect(handler).toBeCalledTimes(0);
      btn2.click();
      expect(handler).toBeCalledTimes(1);
    });
  });
});
