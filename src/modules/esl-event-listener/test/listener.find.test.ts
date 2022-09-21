import {isSimilar} from '../../esl-utils/misc/object';
import {EventUtils} from '../core';
import type {ESLEventListener} from '../core';

describe('Finds currently subscribed listeners of the host by passed criteria', () => {
  const host = document.createElement('div');
  const fn1 = jest.fn();
  const fn2 = jest.fn();

  beforeEach(() => {
    EventUtils.unsubscribe(host);
  });

  test('getting listeners without any criteria', () => {
    EventUtils.subscribe(host, 'click', fn1);
    EventUtils.subscribe(host, 'click keydown', fn2);

    const listeners = EventUtils.listeners(host) ;

    expect(listeners.length).toBe(3);
  });

  test('getting listeners by `event` name', () => {
    EventUtils.subscribe(host, 'click', fn1);
    EventUtils.subscribe(host, 'click keydown', fn2);

    const listeners = EventUtils.listeners(host, 'click') ;
    const match = (listener: ESLEventListener) => listener.event === 'click';

    expect(listeners.length).toBe(2);
    expect(listeners.every(match)).toBe(true);
  });

  test('getting listeners by `handler` reference', () => {
    EventUtils.subscribe(host, 'click', fn1);
    EventUtils.subscribe(host, 'click keydown', fn2);
    EventUtils.subscribe(host, 'mouseout', fn2);

    const listeners = EventUtils.listeners(host, fn2) ;
    const match = (listener: ESLEventListener) => listener.handler === fn2;

    expect(listeners.length).toBe(3);
    expect(listeners.every(match)).toBe(true);
  });

  test('getting listeners by descriptor', () => {
    EventUtils.subscribe(host, {event: 'click', selector: 'a'}, fn1);
    EventUtils.subscribe(host, {event: 'click', selector: 'a'}, fn2);
    EventUtils.subscribe(host, {event: 'click', selector: 'b'}, fn1);

    const listeners = EventUtils.listeners(host, {event: 'click', selector: 'a'}) ;
    const match = (listener: ESLEventListener) => isSimilar(listener, {event: 'click', selector: 'a'}, false);

    expect(listeners.length).toBe(2);
    expect(listeners.every(match)).toBe(true);
  });

  test('getting listeners by descriptor and `handler` reference', () => {
    EventUtils.subscribe(host, {event: 'click', selector: 'a', once: true}, fn1);
    EventUtils.subscribe(host, {event: 'mouseout', selector: 'a', once: true}, fn1);
    EventUtils.subscribe(host, {event: 'click', selector: 'a'}, fn2);

    const listeners = EventUtils.listeners(host,  {selector: 'a', once: true}, fn1) ;
    const match = (listener: ESLEventListener) => {
      return listener.handler === fn1 && isSimilar(listener, {selector: 'a', once: true}, false);
    };

    expect(listeners.length).toBe(2);
    expect(listeners.every(match)).toBe(true);
  });
});
