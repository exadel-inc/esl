import {ESLLineClamp} from '../core/esl-line-clamp';
import {ESLLineClampAlt} from '../core/esl-line-clamp-alt';

describe('ESLLineClampAlt (mixin): tests', () => {
  let $host: HTMLElement;

  beforeAll(() => {
    ESLLineClampAlt.register();
  });

  beforeEach(() => {
    $host = document.createElement('div');
    $host.setAttribute(ESLLineClampAlt.is, '');
    document.body.appendChild($host);
  });

  afterEach(() => {
    document.body.removeChild($host);
  });

  test('should initialize with correct default values', () => {
    const lineClamp = ESLLineClampAlt.get($host);
    expect(lineClamp).toEqual(expect.any(ESLLineClampAlt));
    expect(lineClamp!.altActive).toBe(false);
  });

  test('should handle basic toggle', () => {
    const lineClamp = ESLLineClampAlt.get($host);
    lineClamp!.toggle();
    expect(lineClamp!.altActive).toBe(true);
  });

  test('should dispatch clamp event on toggle', () => {
    const handler = jest.fn();
    $host.addEventListener(ESLLineClampAlt.CLAMP_EVENT, handler);

    const lineClamp = ESLLineClampAlt.get($host);
    lineClamp!.toggle();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('ESLLineClampAlt (mixin): integration with ESLLineClamp', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());

  let $host: HTMLElement;

  const altVal = '3';
  const defaultVal = '5';

  beforeEach(() => {
    $host = document.createElement('div');
    $host.setAttribute(ESLLineClamp.is, defaultVal);
    $host.setAttribute(ESLLineClampAlt.is, altVal);
  });

  afterEach(() => {
    document.body.removeChild($host);
  });

  test('state update on connected callback', async () => {
    $host.setAttribute(ESLLineClampAlt.activeAttr, '');
    document.body.appendChild($host);
    await microtaskQueue();

    expect($host.getAttribute(ESLLineClampAlt.is)).toBe(defaultVal);
    expect($host.getAttribute(ESLLineClamp.is)).toBe(altVal);
  });

  test('state toggle', async () => {
    document.body.appendChild($host);
    await microtaskQueue();

    const lineClamp = ESLLineClampAlt.get($host);
    lineClamp!.toggle();

    expect($host.getAttribute(ESLLineClampAlt.is)).toBe(defaultVal);
    expect($host.getAttribute(ESLLineClamp.is)).toBe(altVal);
  });

  test('state toggle back after sync', async () => {
    $host.setAttribute(ESLLineClampAlt.activeAttr, '');
    document.body.appendChild($host);
    await microtaskQueue();

    const lineClamp = ESLLineClampAlt.get($host);
    lineClamp!.toggle();

    expect($host.getAttribute(ESLLineClampAlt.is)).toBe(altVal);
    expect($host.getAttribute(ESLLineClamp.is)).toBe(defaultVal);
  });
});
