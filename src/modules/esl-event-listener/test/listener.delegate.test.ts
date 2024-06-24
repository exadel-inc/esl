import {ESLEventUtils} from '../core/api';
import type {DelegatedEvent} from '../core/api';

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

  afterEach(() => ESLEventUtils.unsubscribe(host));

  test('Simple click subscription catches click', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, 'click', handler);
    expect(handler).toHaveBeenCalledTimes(0);
    btn.click();
    expect(handler).toHaveBeenCalledTimes(1);
    btn2.click();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test('Subscription with selector catches click exact on selected target', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    expect(handler).toHaveBeenCalledTimes(0);
    btn.click();
    expect(handler).toHaveBeenCalledTimes(1);
    btn2.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('Subscription with selector catches click inside selected target', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    expect(handler).toHaveBeenCalledTimes(0);
    btnSpan.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('Subscription with target provided with query catches click', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', target: '::find(#btn)'}, handler);
    expect(handler).toHaveBeenCalledTimes(0);
    btnSpan.click();
    expect(handler).toHaveBeenCalledTimes(0);
    btn2.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('Subscription with target provided by instance', () => {
    const handler = jest.fn();
    const el = document.createElement('button');
    ESLEventUtils.subscribe(host, {event: 'click', target: el}, handler);
    expect(handler).toHaveBeenCalledTimes(0);
    btn.click();
    expect(handler).toHaveBeenCalledTimes(0);
    btn2.click();
    expect(handler).toHaveBeenCalledTimes(0);
    el.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('Click on the target element leads to correct delegate information', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    btn.click();
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({$delegate: btn}));
  });

  test('Click inside the target element leads to correct delegate information', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    btnSpan.click();
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({$delegate: btn}));
  });

  test('Click on the container should not be handled if a selector is defined', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', target: document, selector: '#btn'}, handler);
    document.body.click();
    expect(handler).not.toHaveBeenCalled();
  });

  describe('Delegation on non DOM target works correctly', () => {
    const $btn = document.createElement('button');
    beforeEach(() => document.body.appendChild($btn));

    test('Delegation of the click event on the document works correct', () => {
      const handler = jest.fn();
      ESLEventUtils.subscribe(host, {event: 'click', target: document, selector: 'button'}, handler);
      $btn.click();
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({$delegate: $btn}));
    });

    test('Delegation of the click event on the window works correct', () => {
      const handler = jest.fn();
      ESLEventUtils.subscribe(host, {event: 'click', target: window, selector: 'button'}, handler);
      $btn.click();
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({$delegate: $btn}));
    });
  });

  test('Delegation types are correct (build time)', () => {
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, (e: MouseEvent) => void 0);
    ESLEventUtils.subscribe(host, {event: 'keyup keydown', selector: '.btn'}, (e: KeyboardEvent) => void 0);
    ESLEventUtils.subscribe(host, {event: 'touchstart mousedown', selector: '.btn'}, (e: MouseEvent) => void 0);
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, (e: DelegatedEvent<MouseEvent>) => void 0);
    ESLEventUtils.subscribe(host, {event: 'keyup keydown', selector: '.btn'}, (e: DelegatedEvent<KeyboardEvent>) => void 0);
    ESLEventUtils.subscribe(host, {event: 'touchstart mousedown', selector: '.btn'}, (e: DelegatedEvent<PointerEvent>) => void 0);
    expect(true).toBe(true);
  });
});
