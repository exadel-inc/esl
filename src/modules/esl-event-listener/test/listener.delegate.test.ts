import {ESLEventUtils} from '../core/api';

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
    expect(handler).toBeCalledTimes(0);
    btn.click();
    expect(handler).toBeCalledTimes(1);
    btn2.click();
    expect(handler).toBeCalledTimes(2);
  });

  test('Subscription with selector catches click exact on selected target', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    expect(handler).toBeCalledTimes(0);
    btn.click();
    expect(handler).toBeCalledTimes(1);
    btn2.click();
    expect(handler).toBeCalledTimes(1);
  });

  test('Subscription with selector catches click inside selected target', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    expect(handler).toBeCalledTimes(0);
    btnSpan.click();
    expect(handler).toBeCalledTimes(1);
  });

  test('Subscription with target provided with query catches click', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', target: '::find(#btn)'}, handler);
    expect(handler).toBeCalledTimes(0);
    btnSpan.click();
    expect(handler).toBeCalledTimes(0);
    btn2.click();
    expect(handler).toBeCalledTimes(1);
  });

  test('Subscription with target provided by instance', () => {
    const handler = jest.fn();
    const el = document.createElement('button');
    ESLEventUtils.subscribe(host, {event: 'click', target: el}, handler);
    expect(handler).toBeCalledTimes(0);
    btn.click();
    expect(handler).toBeCalledTimes(0);
    btn2.click();
    expect(handler).toBeCalledTimes(0);
    el.click();
    expect(handler).toBeCalledTimes(1);
  });

  test('Click on the target element leads to correct delegate information', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    btn.click();
    expect(handler).toBeCalledWith(expect.objectContaining({$delegate: btn}));
  });

  test('Click inside the target element leads to correct delegate information', () => {
    const handler = jest.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: '.btn'}, handler);
    btnSpan.click();
    expect(handler).toBeCalledWith(expect.objectContaining({$delegate: btn}));
  });
});
