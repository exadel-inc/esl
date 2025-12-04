import {ESLLineClamp} from '../core/esl-line-clamp';
import {ESLLineClampToggler} from '../core/esl-line-clamp-toggler';

describe('ESLLineClampAlt (mixin): tests', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());
  let $host: HTMLElement;

  beforeAll(() => {
    ESLLineClampToggler.register();
    ESLLineClamp.register();
  });

  function appendToggler(attrs: {target?: string, a11yTarget?: string, active?: boolean}): HTMLElement {
    const $toggler = document.createElement('button');
    $toggler.setAttribute(ESLLineClampToggler.is, attrs.target || '');
    $toggler.setAttribute('a11y-target', attrs.a11yTarget || '');
    if (attrs.active) $toggler.setAttribute(ESLLineClampToggler.togglerActive, '');
    document.body.appendChild($toggler);
    return $toggler;
  }

  beforeEach(async () => {
    $host = document.createElement('div');
    $host.setAttribute(ESLLineClamp.is, '3');

    document.body.appendChild($host);
  });

  afterEach(() => {
    document.body.removeChild($host);
    document.body.querySelectorAll(`[${ESLLineClampToggler.is}]`).forEach((btn) => btn.remove());
  });

  test('should initialize with correct default values', async () => {
    const toggler = appendToggler({});
    await microtaskQueue();

    const $mixin = ESLLineClampToggler.get(toggler);
    expect($mixin).toEqual(expect.any(ESLLineClampToggler));
    expect($mixin!.$targetEl).toBeUndefined();
    expect(toggler.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);
  });

  test('shouldn\'t have active marker without target', async () => {
    const toggler = appendToggler({active: true});
    await microtaskQueue();

    const $mixin = ESLLineClampToggler.get(toggler);
    expect($mixin!.$targetEl).toBeUndefined();
    expect(toggler.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);
  });

  test('base attribute should query target', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});
    await microtaskQueue();

    const $mixin = ESLLineClampToggler.get(toggler);
    expect($mixin!.$targetEl).toBe($host);
  });

  test('should handle basic click toggling', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampToggler.altActive)).toBe(false);
    expect(toggler.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);

    toggler.click();
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampToggler.altActive)).toBe(true);
    expect(toggler.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(true);

    toggler.click();
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampToggler.altActive)).toBe(false);
    expect(toggler.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);
  });

  test('multiple togglers should work with one target', async () => {
    const toggler1 = appendToggler({target: '::parent::child[esl-line-clamp]'});
    const toggler2 = appendToggler({target: '::parent::child[esl-line-clamp]'});
    await microtaskQueue();

    expect(toggler1.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);
    expect(toggler2.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);

    toggler1.click();
    await microtaskQueue();

    expect(toggler1.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(true);
    expect(toggler2.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(true);

    toggler2.click();
    await microtaskQueue();

    expect(toggler1.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);
    expect(toggler2.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(false);
  });

  test('toggler should become active if target is active', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});
    $host.setAttribute(ESLLineClampToggler.altActive, '');
    await microtaskQueue();

    expect(toggler.hasAttribute(ESLLineClampToggler.togglerActive)).toBe(true);
  });

  test('target should become active if toggler is active', async () => {
    appendToggler({target: '::parent::child[esl-line-clamp]', active: true});
    await microtaskQueue();

    expect($host.hasAttribute(ESLLineClampToggler.altActive)).toBe(true);
  });

  test('should dispatch clamp event on toggle', async () => {
    appendToggler({target: '::parent::child[esl-line-clamp]', active: true});
    const handler = jest.fn();
    $host.addEventListener(ESLLineClampToggler.CLAMP_EVENT, handler);
    await microtaskQueue();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  describe('a11y test', () => {
    test('should set role and aria attributes', async () => {
      const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});

      await microtaskQueue();

      expect(toggler.getAttribute('role')).toBe('button');
      expect(toggler.getAttribute('aria-label')).toBe(ESLLineClampToggler.get(toggler)!.a11yLabel);
      expect(toggler.getAttribute('aria-expanded')).toBe('false');
    });

    test('should set role and aria attributes', async () => {
      const toggler = appendToggler({target: '::child'});

      await microtaskQueue();

      expect(toggler.getAttribute('role')).toBe(null);
      expect(toggler.getAttribute('aria-label')).toBe(null);
      expect(toggler.getAttribute('aria-expanded')).toBe('false');
    });

    test('shouldn\'t set role and label if target is invalid', async () => {
      const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});

      await microtaskQueue();
      toggler.click();
      await microtaskQueue();

      expect(toggler.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
