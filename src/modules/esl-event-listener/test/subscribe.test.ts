import {EventUtils} from '../core';

describe('EventUtils:subscribe tests', () => {
  test('EventUtils:subscribe successfully subscribe listener by descriptor', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, {event: 'click'}, handle);
    expect(EventUtils.listeners($host).length).toBe(1);
  });
  test('EventUtils:subscribe successfully subscribe listener by event name', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, 'click', handle);
    expect(EventUtils.listeners($host).length).toBe(1);
  });
  test('EventUtils:subscribe successfully subscribe listener by event provider', () => {
    const $host = document.createElement('div');
    const provider = jest.fn(function () {
      expect(this).toBe($host);
      return 'event';
    });
    const handle = jest.fn();
    EventUtils.subscribe($host, {event: provider}, handle);
    expect(EventUtils.listeners($host).length).toBe(1);
    expect(provider).toBeCalledWith($host);
  });

  test('EventUtils:subscribe successfully subscribe listeners by string with multiple events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, 'click keydown', handle);
    expect(EventUtils.listeners($host).length).toBe(2);
    expect(EventUtils.listeners($host, 'keydown').length).toBe(1);
    expect(EventUtils.listeners($host, 'click').length).toBe(1);
  });

  test('ESLEventListener observes target events', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    EventUtils.subscribe($host, {event: 'click'}, handle);

    $host.click();
    expect(handle).toBeCalledTimes(1);
  });
  test('ESLEventListener correctly observes target with selector (event delegation)', ()  => {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    div.appendChild(btn);
    const span = document.createElement('span');
    div.appendChild(span);
    const handle = jest.fn();
    EventUtils.subscribe(div, {event: 'click', selector: 'button'}, handle);

    btn.click();
    expect(handle).toBeCalledTimes(1);
    span.click();
    expect(handle).toBeCalledTimes(1);
  });

  describe('ESlEventListener subscription and delegation', () => {
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

    afterEach(() => EventUtils.unsubscribe(host));

    test('Simple click subscription catches click', () => {
      const handler = jest.fn();
      EventUtils.subscribe(host, 'click', handler);
      expect(handler).toBeCalledTimes(0);
      btn.click();
      expect(handler).toBeCalledTimes(1);
      btn2.click();
      expect(handler).toBeCalledTimes(2);
    });

    test('Subscription with selector catches click exact on selected target', () => {
      const handler = jest.fn();
      EventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
      expect(handler).toBeCalledTimes(0);
      btn.click();
      expect(handler).toBeCalledTimes(1);
      btn2.click();
      expect(handler).toBeCalledTimes(1);
    });

    test('Subscription with selector catches click inside selected target', () => {
      const handler = jest.fn();
      EventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
      expect(handler).toBeCalledTimes(0);
      btnSpan.click();
      expect(handler).toBeCalledTimes(1);
    });

    test('Subscription with target provided with query catches click', () => {
      const handler = jest.fn();
      EventUtils.subscribe(host, {event: 'click', target: '::find(#btn)'}, handler);
      expect(handler).toBeCalledTimes(0);
      btnSpan.click();
      expect(handler).toBeCalledTimes(0);
      btn2.click();
      expect(handler).toBeCalledTimes(1);
    });

    test('Subscription with target provided by instance', () => {
      const handler = jest.fn();
      const el = document.createElement('button');
      EventUtils.subscribe(host, {event: 'click', target: el}, handler);
      expect(handler).toBeCalledTimes(0);
      btn.click();
      expect(handler).toBeCalledTimes(0);
      btn2.click();
      expect(handler).toBeCalledTimes(0);
      el.click();
      expect(handler).toBeCalledTimes(1);
    });
  });

  describe('ESlEventListener subscription with target or selector defined by provider', () => {
    const host = document.createElement('section');
    host.innerHTML = `
      <div class="btns">
        <button class="btn1">Test</button>
        <button class="btn2">2</button>
      </div>
    `;
    const btn1 = host.querySelector('button.btn1') as HTMLButtonElement;
    const btn2 = host.querySelector('button.btn2') as HTMLButtonElement;

    afterEach(() => EventUtils.unsubscribe(host));

    test('Selector provider receives host in arg and context', () => {
      const handler = jest.fn();
      const provider  = jest.fn(function () {
        expect(this).toBe(host);
        return 'button';
      });
      EventUtils.subscribe(host, {event: 'click', selector: provider}, handler);
      btn1.click();
      expect(provider).toHaveBeenCalledWith(host);
    });

    test('Selector defined with provider applies on fly', () => {
      const handler = jest.fn();
      const provider  = jest.fn();
      EventUtils.subscribe(host, {event: 'click', selector: provider}, handler);
      expect(handler).toBeCalledTimes(0);

      provider.mockReturnValue('.btn1');
      btn1.click();
      expect(handler).toBeCalledTimes(1);
      btn2.click();
      expect(handler).toBeCalledTimes(1);

      provider.mockReturnValue('.btn2');
      btn1.click();
      expect(handler).toBeCalledTimes(1);
      btn2.click();
      expect(handler).toBeCalledTimes(2);
    });

    test('Target provider receives host in arg and context', () => {
      const handler = jest.fn();
      const provider  = jest.fn(function () {
        expect(this).toBe(host);
        return '';
      });
      EventUtils.subscribe(host, {event: 'click', target: provider}, handler);
      btn1.click();
      expect(provider).toHaveBeenCalledWith(host);
    });

    test('Subscription use target provider value correctly', () => {
      const handler = jest.fn();
      const provider  = jest.fn(() => '::find(.btn2)');
      EventUtils.subscribe(host, {event: 'click', target: provider}, handler);
      btn1.click();
      expect(handler).not.toBeCalled();
      btn2.click();
      expect(handler).toBeCalled();
    });
  });

  test('ESlEventListener does not produce subscription if target provider returns null', () => {
    jest.spyOn(console, 'warn').mockImplementationOnce(() => undefined); // Skip warn
    const host = document.createElement('div');
    const handler = jest.fn();
    const provider  = jest.fn(() => null);

    const listeners = EventUtils.subscribe(host, {event: 'click', target: provider}, handler);
    host.click();
    expect(listeners).toEqual([]);
    expect(provider).toBeCalled();
    expect(handler).not.toBeCalled();
  });

  describe('EventUtils.subscribe resubscribing event', () => {
    const $host = document.createElement('div');
    const handle = jest.fn();
    const targ1 = document.createElement('button');
    const targ2 = document.createElement('button');
    const target = jest.fn(() => targ1);

    const listeners1 = EventUtils.subscribe($host, {event: 'click', target}, handle);
    test('EventUtils.subscribe subscription correctly first time', () => {
      expect(listeners1.length).toBe(1);
      expect(EventUtils.listeners($host).length).toBe(1);
    });

    target.mockImplementation(() => targ2);
    const listeners2 = EventUtils.subscribe($host, {event: 'click', target}, handle);
    test('EventUtils.subscribe subscription correctly second time', () => {
      expect(listeners2.length).toBe(1);
      expect(EventUtils.listeners($host).length).toBe(1);
    });

    test('Resubscribed listener does not observe initial target', () => {
      targ1.click();
      expect(handle).not.toBeCalled();
    });

    test('Resubscribed listener observes actual target', () => {
      targ2.click();
      expect(handle).toBeCalled();
    });

    test('EventUtils des not recreate instance', () => expect(listeners1[0]).toBe(listeners2[0]));
  });

  describe('EventUtils.subscribe subscribes single time', () => {
    test('subscribe one event with the same handler does not leads to duplicate subscription', () => {
      const host = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, 'click', fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, 'click', fn);
      expect(EventUtils.listeners(host).length).toBe(1);
    });

    test('subscribe one event with different handlers produces different subscriptions', () => {
      const host = document.createElement('div');
      const fn1 = jest.fn();
      const fn2 = jest.fn();

      EventUtils.subscribe(host, 'click', fn1);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, 'click', fn2);
      expect(EventUtils.listeners(host).length).toBe(2);
    });

    test('subscribe considers descriptors with different selectors as different', () => {
      const host = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, {event: 'e', selector: 'a'}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', selector: 'a'}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', selector: 'b'}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
      EventUtils.subscribe(host, {event: 'e'}, fn);
      expect(EventUtils.listeners(host).length).toBe(3);
    });

    test('subscribe considers descriptors with different targets as different', () => {
      const host = document.createElement('div');
      const target1 = document.createElement('div');
      const target2 = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, {event: 'e', target: target1}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', target: target1}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', target: target2}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
      EventUtils.subscribe(host, {event: 'e'}, fn);
      expect(EventUtils.listeners(host).length).toBe(3);
    });

    test('subscribe considers descriptors with different capture phases as different', () => {
      const host = document.createElement('div');
      const fn = jest.fn();

      EventUtils.subscribe(host, {event: 'e', capture: true}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', capture: true}, fn);
      expect(EventUtils.listeners(host).length).toBe(1);
      EventUtils.subscribe(host, {event: 'e', capture: false}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
      EventUtils.subscribe(host, {event: 'e'}, fn);
      expect(EventUtils.listeners(host).length).toBe(2);
    });
  });

  // TODO: tests for `once` marker

  // TODO: tests for find method

  // TODO: Do we need to split it...
});
