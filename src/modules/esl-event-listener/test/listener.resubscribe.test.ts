import {EventUtils} from '../core/api';

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
