import {EventUtils} from '../utils';

describe('EventUtils: integration', () => {
  test('subscribe', ()  => {
    const div = document.createElement('div');
    const handle = jest.fn();

    EventUtils.subscribe(div, {event: 'click'}, handle);

    expect(EventUtils.listeners(div).length).toBe(1);

    expect(handle).toBeCalledTimes(0);
    div.click();
    expect(handle).toBeCalledTimes(1);
  });

  test('subscribe delegate', ()  => {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    div.appendChild(btn);
    const span = document.createElement('span');
    div.appendChild(span);
    const handle = jest.fn();
    EventUtils.subscribe(div, {event: 'click', selector: 'button'}, handle);

    expect(handle).toBeCalledTimes(0);
    btn.click();
    expect(handle).toBeCalledTimes(1);
    span.click();
    expect(handle).toBeCalledTimes(1);
  });

  describe('unsubscribe', () => {
    const handle = jest.fn();
    const div = document.createElement('div');

    beforeEach(() => {
      EventUtils.subscribe(div, {id: 'test', event: 'click'}, handle);
    });

    test('all', ()  => {
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div);
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by id', ()  => {
      EventUtils.unsubscribe(div, {id: 'testic'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, {id: 'test'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by event', ()  => {
      EventUtils.unsubscribe(div, {event: 'mousedown'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, {event: 'click'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by event(string)', ()  => {
      EventUtils.unsubscribe(div, 'test');
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, 'click');
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('by handler', ()  => {
      EventUtils.unsubscribe(div, () => 1);
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, handle);
      expect(EventUtils.listeners(div).length).toBe(0);
    });

    test('with multiple criteria', ()  => {
      EventUtils.unsubscribe(div, handle, {event: 'key'});
      expect(EventUtils.listeners(div).length).toBe(1);
      EventUtils.unsubscribe(div, handle, {event: 'click'});
      expect(EventUtils.listeners(div).length).toBe(0);
    });
  });
});
