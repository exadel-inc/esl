import {ESLEventUtils} from '../core/api';

describe('EventUtils.subscribe resubscribing event', () => {
  const $host = document.createElement('div');
  const handle = jest.fn();
  const targ1 = document.createElement('button');
  const targ2 = document.createElement('button');
  const target = jest.fn(() => targ1);

  const listeners1 = ESLEventUtils.subscribe($host, {event: 'click', target}, handle);
  test('EventUtils.subscribe subscription correct first time', () => {
    expect(listeners1.length).toBe(1);
    expect(ESLEventUtils.listeners($host).length).toBe(1);
  });

  target.mockImplementation(() => targ2);
  const listeners2 = ESLEventUtils.subscribe($host, {event: 'click', target}, handle);
  test('EventUtils.subscribe subscription correct second time', () => {
    expect(listeners2.length).toBe(1);
    expect(ESLEventUtils.listeners($host).length).toBe(1);
  });

  test('Resubscribed listener does not observe initial target', () => {
    targ1.click();
    expect(handle).not.toBeCalled();
  });

  test('Resubscribed listener observes actual target', () => {
    targ2.click();
    expect(handle).toBeCalled();
  });

  test('EventUtils does not recreate instance', () => expect(listeners1[0]).toBe(listeners2[0]));
});
