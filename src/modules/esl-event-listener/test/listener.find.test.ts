import {isSimilar} from '../../esl-utils/misc/object/compare';
import {EventUtils} from '../core';
import type {ESLEventListener} from '../core';

describe('Finds currently subscribed listeners of the host by passed criteria', () => {
  const host = document.createElement('div');
  const fn1 = jest.fn();
  const fn2 = jest.fn();

  test('getting listeners without any criteria', () => {
    EventUtils.subscribe(host, 'click', fn1);
    EventUtils.subscribe(host, 'click keydown', fn2);

    const listeners = EventUtils.listeners(host) ;

    expect(EventUtils.listeners(host).length).toBe(3);
    expect(listeners.length).toBe(3);
  });

  test('getting listeners by `event` name', () => {
    const listeners = EventUtils.listeners(host, 'click') ;
    const match = (listener: ESLEventListener) => listener.event === 'click';

    expect(EventUtils.listeners(host).length).toBe(3);
    expect(listeners.length).toBe(2);
    expect(listeners.every(match)).toBe(true);
  });

  test('getting listeners by `handler` reference', () => {
    EventUtils.subscribe(host, 'mouseout', fn2);

    const listeners = EventUtils.listeners(host, fn2) ;
    const match = (listener: ESLEventListener) => listener.handler === fn2;

    expect(EventUtils.listeners(host).length).toBe(4);
    expect(listeners.length).toBe(3);
    expect(listeners.every(match)).toBe(true);
  });

  test('getting listeners by descriptor', () => {
    const div = document.createElement('div');

    EventUtils.subscribe(div, {event: 'click', selector: 'a'}, fn1);
    EventUtils.subscribe(div, {event: 'click', selector: 'a'}, fn2);
    EventUtils.subscribe(div, {event: 'click', selector: 'b'}, fn1);

    const listeners = EventUtils.listeners(div, {event: 'click', selector: 'a'}) ;
    const match = (listener: ESLEventListener) => isSimilar(listener, {event: 'click', selector: 'a'}, false);

    expect(EventUtils.listeners(div).length).toBe(3);
    expect(listeners.length).toBe(2);
    expect(listeners.every(match)).toBe(true);
  });

  test('getting listeners by descriptor and `handler` reference', () => {
    const div = document.createElement('div');

    EventUtils.subscribe(div, {event: 'click', selector: 'a', once: true}, fn1);
    EventUtils.subscribe(div, {event: 'mouseout', selector: 'a', once: true}, fn1);
    EventUtils.subscribe(div, {event: 'click', selector: 'a'}, fn2);

    const listeners = EventUtils.listeners(div,  {selector: 'a', once: true}, fn1) ;
    const match = (listener: ESLEventListener) => {
      return listener.handler === fn1 && isSimilar(listener, {selector: 'a', once: true}, false);
    };

    expect(EventUtils.listeners(div).length).toBe(3);
    expect(listeners.length).toBe(2);
    expect(listeners.every(match)).toBe(true);
  });
});
