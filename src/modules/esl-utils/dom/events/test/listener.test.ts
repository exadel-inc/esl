import {ESLEventListener} from '../listener';

describe('dom/events: ESLEventListener', () => {
  describe('get', () => {
    test('simple', () => {
      expect(ESLEventListener.get()).toEqual([]);
      expect(ESLEventListener.get({})).toEqual([]);
    });
    test('singleton', () => {
      const obj = {};
      const listeners = ESLEventListener.get(obj);
      expect(ESLEventListener.get(obj)).toBe(listeners);
    });
  });

  describe('descriptors', () => {
    test('basic test 1', () => {
      const fn1 = () => undefined;
      const fn2 = () => undefined;
      fn1.event = fn2.event = 'test';

      const obj = {onClick: fn1};
      const proto = {onEvent: fn2};
      Object.setPrototypeOf(obj, proto);

      const desc = ESLEventListener.descriptors(obj);
      expect(Array.isArray(desc)).toBe(true);
      expect(desc.includes(fn1));
      expect(desc.includes(fn2));
    });
    test('basic test 2', () => {
      const obj: any = document.createElement('div');

      expect(ESLEventListener.descriptors(obj)).toEqual([]);

      obj.onEvent = Object.assign(() => undefined, {event: 'event'});

      expect(ESLEventListener.descriptors(obj).length).toEqual(1);
      expect(ESLEventListener.descriptors(obj)[0]).toEqual(obj.onEvent);
    });
  });

  describe('create', () => {
    test('one by string', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.create(host, handler, 'click');

      expect(result.length).toBe(1);
      expect(result[0].event).toBe('click');
      expect(result[0].handler).toBe(handler);
    });

    test('multiple by string', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.create(host, handler, 'click keydown keypress');

      expect(result.length).toBe(3);
      expect(result[0].handler).toBe(handler);
      expect(result[1].handler).toBe(handler);
      expect(result[2].handler).toBe(handler);
      expect(result.map((l: ESLEventListener) => l.event)).toEqual(['click', 'keydown', 'keypress']);
    });

    test('one by desc', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.create(host, handler, {event: 'keypress', id: 'test'});

      expect(result.length).toBe(1);
      expect(result[0].handler).toBe(handler);
      expect(result[0].id).toBe('test');
      expect(result[0].event).toBe('keypress');
    });

    test('multiple by desc', () => {
      const host = document.createElement('div');
      const handler = jest.fn();
      const result = ESLEventListener.create(host, handler, {event: 'e1 e2', selector: 'button'});

      expect(result.length).toBe(2);
      expect(result[0].handler).toBe(handler);
      expect(result[1].handler).toBe(handler);
      expect(result[0].event).toBe('e1');
      expect(result[1].event).toBe('e2');
      expect(result[0].selector).toBe('button');
      expect(result[1].selector).toBe('button');
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
      const listener = new ESLEventListener(host, handler, {event: 'click'});
      listener.subscribe();

      expect(handler).toBeCalledTimes(0);
      btnSpan.click();
      expect(handler).toBeCalledTimes(1);
    });

    test('delegate subscribe', () => {
      const handler = jest.fn();
      const listener = new ESLEventListener(host, handler, {event: 'click', selector: '.btn'});
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
      const listener = new ESLEventListener(host, handler, {event: 'click', target: '::find(#btn)'});
      listener.subscribe();

      expect(handler).toBeCalledTimes(0);
      btn.click();
      expect(handler).toBeCalledTimes(0);
      btn2.click();
      expect(handler).toBeCalledTimes(1);
    });
  });
});
