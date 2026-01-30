import {ESLEventUtils} from '../core/api';

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

  afterEach(() => ESLEventUtils.unsubscribe(host));

  test('Selector provider receives host in arg and context', () => {
    const handler = vi.fn();
    const provider  = vi.fn(function () {
      expect(this).toBe(host);
      return 'button';
    });
    ESLEventUtils.subscribe(host, {event: 'click', selector: provider}, handler);
    btn1.click();
    expect(provider).toHaveBeenCalledWith(host);
  });

  test('Selector defined with provider applies on fly', () => {
    const handler = vi.fn();
    const provider  = vi.fn();
    ESLEventUtils.subscribe(host, {event: 'click', selector: provider}, handler);
    expect(handler).toHaveBeenCalledTimes(0);

    provider.mockReturnValue('.btn1');
    btn1.click();
    expect(handler).toHaveBeenCalledTimes(1);
    btn2.click();
    expect(handler).toHaveBeenCalledTimes(1);

    provider.mockReturnValue('.btn2');
    btn1.click();
    expect(handler).toHaveBeenCalledTimes(1);
    btn2.click();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test('Target provider receives host in arg and context', () => {
    const handler = vi.fn();
    const provider  = vi.fn(function () {
      expect(this).toBe(host);
      return '';
    });
    ESLEventUtils.subscribe(host, {event: 'click', target: provider}, handler);
    btn1.click();
    expect(provider).toHaveBeenCalledWith(host);
  });

  test('Subscription use target provider value correctly', () => {
    const handler = vi.fn();
    const provider  = vi.fn(() => '::find(.btn2)');
    ESLEventUtils.subscribe(host, {event: 'click', target: provider}, handler);
    btn1.click();
    expect(handler).not.toHaveBeenCalled();
    btn2.click();
    expect(handler).toHaveBeenCalled();
  });

  test('ESlEventListener does not produce subscription if target provider returns null', () => {
    vi.spyOn(console, 'warn').mockImplementationOnce(() => undefined); // Skip warn
    const handler = vi.fn();
    const provider = vi.fn(() => null);

    const listeners = ESLEventUtils.subscribe(host, {event: 'click', target: provider}, handler);
    host.click();
    expect(listeners).toEqual([]);
    expect(provider).toHaveBeenCalled();
    expect(handler).not.toHaveBeenCalled();
  });
});
