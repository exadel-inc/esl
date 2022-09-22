import {EventUtils} from '../core/api';

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

  test('ESlEventListener does not produce subscription if target provider returns null', () => {
    jest.spyOn(console, 'warn').mockImplementationOnce(() => undefined); // Skip warn
    const handler = jest.fn();
    const provider = jest.fn(() => null);

    const listeners = EventUtils.subscribe(host, {event: 'click', target: provider}, handler);
    host.click();
    expect(listeners).toEqual([]);
    expect(provider).toBeCalled();
    expect(handler).not.toBeCalled();
  });
});
