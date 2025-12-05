import {ESLLineClamp} from '../core/esl-line-clamp';
import {ESLLineClampToggler} from '../core/esl-line-clamp-toggler';

describe('ESLLineClampToggler (mixin): tests', () => {
  const microtaskQueue = () => Promise.resolve().then(() => Promise.resolve());
  let $host: HTMLElement;

  const ALT_ACTIVE_ATTRIBUTE = ESLLineClampToggler.prototype.ALT_ACTIVE_ATTRIBUTE;
  const ACTIVE_ATTRIBUTE = 'toggler-active';

  beforeAll(() => {
    ESLLineClampToggler.register();
    ESLLineClamp.register();
  });

  function appendToggler(attrs: {target?: string, a11yTarget?: string, active?: boolean}): HTMLElement {
    const $toggler = document.createElement('button');
    $toggler.setAttribute(ESLLineClampToggler.is, attrs.target || '');
    $toggler.setAttribute('a11y-target', attrs.a11yTarget || '');
    if (attrs.active) $toggler.setAttribute(ACTIVE_ATTRIBUTE, '');
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
    expect($mixin!.$target).toBe(toggler);
    expect(toggler.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(false);
  });

  test('base attribute should query target', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});
    await microtaskQueue();

    const $mixin = ESLLineClampToggler.get(toggler);
    expect($mixin!.$target).toBe($host);
  });

  test('should handle basic click toggling', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});
    await microtaskQueue();

    expect($host.hasAttribute(ALT_ACTIVE_ATTRIBUTE)).toBe(false);
    expect(toggler.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(false);

    toggler.click();
    await microtaskQueue();

    expect($host.hasAttribute(ALT_ACTIVE_ATTRIBUTE)).toBe(true);
    expect(toggler.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(true);

    toggler.click();
    await microtaskQueue();

    expect($host.hasAttribute(ALT_ACTIVE_ATTRIBUTE)).toBe(false);
    expect(toggler.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(false);
  });

  test('multiple togglers should work with one target', async () => {
    const toggler1 = appendToggler({target: '::parent::child[esl-line-clamp]'});
    const toggler2 = appendToggler({target: '::parent::child[esl-line-clamp]'});
    await microtaskQueue();

    expect(toggler1.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(false);
    expect(toggler2.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(false);

    toggler1.click();
    await microtaskQueue();

    expect(toggler1.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(true);
    expect(toggler2.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(true);

    toggler2.click();
    await microtaskQueue();

    expect(toggler1.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(false);
    expect(toggler2.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(false);
  });

  test('toggler should become active if target is active', async () => {
    const toggler = appendToggler({target: '::parent::child[esl-line-clamp]'});
    $host.setAttribute(ALT_ACTIVE_ATTRIBUTE, '');
    await microtaskQueue();

    expect(toggler.hasAttribute(ACTIVE_ATTRIBUTE)).toBe(true);
  });

  test('target should become active if toggler is active', async () => {
    appendToggler({target: '::parent::child[esl-line-clamp]', active: true});
    await microtaskQueue();

    expect($host.hasAttribute(ALT_ACTIVE_ATTRIBUTE)).toBe(true);
  });

  test('should dispatch clamp event on toggle', async () => {
    appendToggler({target: '::parent::child[esl-line-clamp]', active: true});
    const handler = jest.fn();
    $host.addEventListener(ESLLineClampToggler.prototype.CLAMP_EVENT, handler);
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

      toggler.click();
      await microtaskQueue();

      expect(toggler.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
